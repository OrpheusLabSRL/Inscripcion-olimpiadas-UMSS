<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\Contracts\{
    AreaRepositoryInterface,
    CategoriaRepositoryInterface,
    OlimpiadaRepositoryInterface,
    OlimpiadaAreaCategoriaRepositoryInterface,
    GradoRepositoryInterface,
    CategoriaGradoRepositoryInterface,
    ContactoRepositoryInterface,
    InscripcionTutorRepositoryInterface
};
use App\Repositories\Eloquent\{
    AreaRepository,
    CategoriaRepository,
    OlimpiadaRepository,
    OlimpiadaAreaCategoriaRepository,
    GradoRepository,
    CategoriaGradoRepository,
    ContactoRepository,
    InscripcionTutorRepository
};

class RepositoryServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->bind(
            AreaRepositoryInterface::class,
            AreaRepository::class
        );

        $this->app->bind(
            CategoriaRepositoryInterface::class,
            CategoriaRepository::class
        );

        $this->app->bind(
            OlimpiadaRepositoryInterface::class,
            OlimpiadaRepository::class
        );

        $this->app->bind(
            OlimpiadaAreaCategoriaRepositoryInterface::class,
            OlimpiadaAreaCategoriaRepository::class
        );

        $this->app->bind(
            GradoRepositoryInterface::class,
            GradoRepository::class
        );

        $this->app->bind(
            CategoriaGradoRepositoryInterface::class,
            CategoriaGradoRepository::class
        );

        // Contacto
        $this->app->bind(
            ContactoRepositoryInterface::class,
            ContactoRepository::class
        );

        // Inscripcion Tutor
        $this->app->bind(
            InscripcionTutorRepositoryInterface::class,
            InscripcionTutorRepository::class
        );
    }

    public function boot()
    {
        //
    }
}