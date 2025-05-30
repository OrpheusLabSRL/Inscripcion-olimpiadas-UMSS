<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Exception;

class DatabaseSetup extends Command
{
    protected $signature = 'db:setup 
                            {--host=127.0.0.1 : Database host}
                            {--port=3306 : Database port}
                            {--root-user=root : Root username}
                            {--root-password= : Root password}
                            {--app-user= : Application username}
                            {--app-password= : Application password}
                            {--database= : Database name}';

    protected $description = 'Setup database user and permissions automatically';

    public function handle()
    {
        $host = $this->option('host');
        $port = $this->option('port');
        $rootUser = $this->option('root-user');
        $rootPassword = $this->option('root-password') ?: $this->secret('Enter root password');
        $appUser = $this->option('app-user') ?: $this->ask('Enter application username');
        $appPassword = $this->option('app-password') ?: $this->secret('Enter application password');
        $database = $this->option('database') ?: $this->ask('Enter database name');

        try {
            $this->info('Connecting to MySQL as root...');
            
            config(['database.connections.setup' => [
                'driver' => 'mysql',
                'host' => $host,
                'port' => $port,
                'username' => $rootUser,
                'password' => $rootPassword,
                'charset' => 'utf8mb4',
                'collation' => 'utf8mb4_unicode_ci',
            ]]);

            // Test connection
            DB::connection('setup')->getPdo();
            $this->info('✓ Connected successfully as root');

            // Crear usuario de aplicación
            $this->info('Creating application user...');
            DB::connection('setup')->statement("CREATE USER IF NOT EXISTS '{$appUser}'@'localhost' IDENTIFIED BY '{$appPassword}'");
            $this->info("✓ User '{$appUser}' created successfully");

            // Crear base de datos
            $this->info('Creating database...');
            DB::connection('setup')->statement("CREATE DATABASE IF NOT EXISTS {$database} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
            $this->info("✓ Database '{$database}' created successfully");

            // Otorgar permisos
            $this->info('Granting permissions...');
            DB::connection('setup')->statement("GRANT SELECT, INSERT, UPDATE, DELETE ON {$database}.* TO '{$appUser}'@'localhost'");
            $this->info("✓ Permissions granted successfully");

            // Flush privileges
            DB::connection('setup')->statement("FLUSH PRIVILEGES");
            $this->info("✓ Privileges flushed");

            // Verificar permisos
            $this->info('Verifying permissions...');
            $grants = DB::connection('setup')->select("SHOW GRANTS FOR '{$appUser}'@'localhost'");
            
            $this->info('Current grants for user:');
            foreach ($grants as $grant) {
                $grantArray = (array) $grant;
                $this->line('  - ' . array_values($grantArray)[0]);
            }

            // Actualizar archivo .env
            if ($this->confirm('Do you want to update the .env file with these credentials?')) {
                $this->updateEnvFile($host, $port, $database, $appUser, $appPassword);
            }

            $this->info('🎉 Database setup completed successfully!');

            // Test new connection
            if ($this->confirm('Do you want to test the new connection?')) {
                $this->testAppConnection($host, $port, $database, $appUser, $appPassword);
            }

        } catch (Exception $e) {
            $this->error('Error: ' . $e->getMessage());
            return 1;
        }

        return 0;
    }

    private function updateEnvFile($host, $port, $database, $username, $password)
    {
        $envFile = base_path('.env');
        
        if (!file_exists($envFile)) {
            $this->error('.env file not found');
            return;
        }

        $envContent = file_get_contents($envFile);
        
        $envContent = preg_replace('/^DB_HOST=.*/m', "DB_HOST={$host}", $envContent);
        $envContent = preg_replace('/^DB_PORT=.*/m', "DB_PORT={$port}", $envContent);
        $envContent = preg_replace('/^DB_DATABASE=.*/m', "DB_DATABASE={$database}", $envContent);
        $envContent = preg_replace('/^DB_USERNAME=.*/m', "DB_USERNAME={$username}", $envContent);
        $envContent = preg_replace('/^DB_PASSWORD=.*/m', "DB_PASSWORD={$password}", $envContent);

        file_put_contents($envFile, $envContent);
        $this->info('✓ .env file updated successfully');
    }

    private function testAppConnection($host, $port, $database, $username, $password)
    {
        try {
            config(['database.connections.test_app' => [
                'driver' => 'mysql',
                'host' => $host,
                'port' => $port,
                'database' => $database,
                'username' => $username,
                'password' => $password,
                'charset' => 'utf8mb4',
                'collation' => 'utf8mb4_unicode_ci',
            ]]);

            DB::connection('test_app')->getPdo();
            $this->info('✓ Application database connection test successful!');
            
            DB::connection('test_app')->select('SELECT 1');
            $this->info('✓ SELECT permission verified');

        } catch (Exception $e) {
            $this->error('Connection test failed: ' . $e->getMessage());
        }
    }
}