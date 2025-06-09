<?php
// Cargar el autoloader de Composer
require __DIR__ . '/../vendor/autoload.php';

// Cargar el archivo .env
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

// Verificar que se haya proporcionado el código de boleta
if (!isset($_GET['codigo'])) {
    die("Uso: http://tu_servidor/ruta/a/generate_receipt.php?codigo=[codigoBoleta]");
}

$codigoBoleta = $_GET['codigo'];

// Configuración de la base de datos usando getenv() que debería leer del .env cargado por Laravel/servidor web
$dbConnection = $_ENV['DB_CONNECTION'] ?? 'mysql';
$dbHost = $_ENV['DB_HOST'] ?? '127.0.0.1';
$dbPort = $_ENV['DB_PORT'] ?? '3306';
$dbDatabase = $_ENV['DB_DATABASE'] ?? 'laravel';
$dbUsername = $_ENV['DB_USERNAME'] ?? 'root';
$dbPassword = $_ENV['DB_PASSWORD'] ?? '';

// Ruta donde se guardará el PDF (usar storage_path si estamos en Laravel, si no, una ruta relativa)
$pdfOutputPath = __DIR__ . '/../storage/app/public/boletas_pdf/'; // Intenta usar una ruta común de Laravel storage

// Crear la carpeta si no existe
if (!file_exists($pdfOutputPath)) {
    mkdir($pdfOutputPath, 0755, true);
}

try {
    // Conexión a la base de datos usando PDO
    // Verificar que tengamos los datos de conexión mínimos
    if (empty($dbDatabase) || empty($dbUsername) || empty($dbHost)) {
         die("Error: Datos de conexión a la base de datos no disponibles o incompletos.\n" .
             "Asegúrate de que tu archivo .env esté configurado correctamente y sea accesible.\n");
    }

    // Verificar que la extensión PDO para el driver de base de datos esté habilitada
    $pdo_driver = "pdo_" . strtolower($dbConnection);
    if (!extension_loaded($pdo_driver)) {
        die("Error: La extensión $pdo_driver no está instalada o habilitada.\n" .
            "Por favor, ejecuta 'sudo apt-get install php-$dbConnection' (en Ubuntu/Debian) o instala la extensión correspondiente.\n");
    }

    $dsn = "$dbConnection:host=$dbHost;port=$dbPort;dbname=$dbDatabase";
    $pdo = new PDO($dsn, $dbUsername, $dbPassword);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Consulta SQL para obtener los datos necesarios
    $sql = "
        SELECT
            bp.codigoBoleta,
            bp.numeroControl,
            bp.fechaEmision,
            bp.montoTotal,
            p.nombre,
            p.apellido
        FROM boletas_pagos bp
        JOIN tutores t ON bp.idTutor = t.idPersona
        JOIN personas p ON t.idPersona = p.idPersona
        WHERE bp.codigoBoleta = :codigoBoleta
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':codigoBoleta', $codigoBoleta);
    $stmt->execute();

    $boleta = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$boleta) {
        // Si se ejecuta desde web, mostrar error en el navegador
        if (isset($_GET['codigo'])) {
             http_response_code(404);
             die("<html><body><h1>Error 404: Boleta no encontrada</h1></body></html>");
        } else {
            die("No se encontró la boleta con código: " . $codigoBoleta . "\n");
        }
    }

    // Formatear la fecha a dd-mm-yy
    $fechaEmision = date('d-m-y', strtotime($boleta['fechaEmision']));

    // Formatear el monto total con dos decimales
    $montoTotal = number_format($boleta['montoTotal'], 2, '.', '');

    // Convertir cantidad a texto (función simple, mejorar si es necesario)
    function numeroALetras($numero) {
        $unidades = array('', 'UNO', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE');
        $decenas = array('', 'DIEZ', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA');
        $centenas = array('', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS');
        
        $entero = floor($numero);
        
        if ($entero <= 9) {
            return $unidades[$entero];
        } else if ($entero <= 99) {
            if ($entero >= 10 && $entero <= 19) {
                $especiales = array('DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISEIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE');
                return $especiales[$entero - 10];
            } else {
                $dec = floor($entero / 10);
                $uni = $entero % 10;
                if ($uni == 0) {
                    return $decenas[$dec];
                } else {
                    return $decenas[$dec] . ' Y ' . $unidades[$uni];
                }
            }
        } else if ($entero <= 999) {
            $cen = floor($entero / 100);
            $resto = $entero % 100;
            
            if ($resto == 0) {
                return $centenas[$cen];
            } else {
                return $centenas[$cen] . ' ' . numeroALetras($resto);
            }
        }
        
        return "NUMERO FUERA DE RANGO";
    }

    // ** Generación del PDF con FPDF **
    
    // Crear un nuevo documento PDF
    $pdf = new FPDF(); // FPDF se carga via autoload de Composer
    $pdf->AddPage();

    // Configurar la fuente
    $pdf->SetFont('Courier', '', 12);

    // Encabezado centrado
    $pdf->Cell(0, 10, utf8_decode('UNIVERSIDAD MAYOR DE SAN SIMON'), 0, 1, 'C');
    $pdf->Cell(0, 10, utf8_decode('DIRECCION ADMINISTRATIVA Y FINANCIERA'), 0, 1, 'C');
    $pdf->Ln(5);
    $pdf->Cell(0, 10, utf8_decode('RECIBO DE CAJA'), 0, 1, 'C');
    $pdf->Ln(5);

    // Datos de la boleta alineados a la derecha
    $pdf->Cell(0, 8, utf8_decode('Nro. Control: ' . $boleta['numeroControl']), 0, 1, 'R');
    $pdf->Cell(0, 8, utf8_decode('Fecha: ' . $fechaEmision), 0, 1, 'R');
    $pdf->Cell(0, 8, utf8_decode('Usuario: HTORREZ'), 0, 1, 'R');
    $pdf->Ln(5);

    // Datos del cliente
    $pdf->Cell(0, 8, utf8_decode('Recibi de: ' . $boleta['nombre'] . ' ' . $boleta['apellido']), 0, 1, 'L');
    $pdf->Cell(0, 8, utf8_decode('Por concepto de:'), 0, 1, 'L');
    $pdf->Cell(0, 8, utf8_decode('DECANATO - OLIMPIADA EN CIENCIAS SANSI O! SANSI'), 0, 1, 'L'); // Valor estático
    $pdf->Ln(5);

    // Monto en texto y número
    $montoTexto = numeroALetras(intval($montoTotal));
    $pdf->Cell(0, 8, utf8_decode('La suma de: ' . $montoTexto), 0, 1, 'L');
    $pdf->Cell(0, 8, utf8_decode('Total: Bs ' . $montoTotal), 0, 1, 'R');
    $pdf->Ln(5);

    // Aclaraciones y códigos
    $pdf->Cell(0, 8, utf8_decode('Aclaracion: OF ' . $boleta['codigoBoleta']), 0, 1, 'L');
    $pdf->Ln(5);
    $pdf->Cell(0, 8, utf8_decode('Documento: 1023219029'), 0, 1, 'L'); // Valor estático
    $pdf->Cell(0, 8, utf8_decode('Codigo:'), 0, 1, 'L');

    // Generar el nombre del archivo
    $pdfFileName = 'recibo_' . $codigoBoleta . '.pdf';

    // Enviar el PDF al navegador
    $pdf->Output('I', $pdfFileName); // 'I' = Inline (mostrar en navegador)
    exit; // Terminar script después de enviar el PDF

} catch (\PDOException $e) {
    // Si se ejecuta desde web, mostrar error amigable en el navegador
    if (isset($_GET['codigo'])) {
         http_response_code(500);
         die("<html><body><h1>Error de base de datos</h1><p>No se pudo conectar o consultar la base de datos: " . htmlspecialchars($e->getMessage()) . "</p></body></html>");
    } else {
        die("Error de base de datos: " . $e->getMessage() . "\n");
    }
} catch (\Exception $e) {
    // Si se ejecuta desde web, mostrar error amigable en el navegador
    if (isset($_GET['codigo'])) {
         http_response_code(500);
         die("<html><body><h1>Ocurrió un error inesperado</h1><p>" . htmlspecialchars($e->getMessage()) . "</p></body></html>");
    } else {
        die("Ocurrió un error: " . $e->getMessage() . "\n");
    }
}
?>