<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\Contracts\{
    AreaRepositoryInterface,
    CategoriaRepositoryInterface,
    OlimpiadaRepositoryInterface,
    OlimpiadaAreaCategoriaRepositoryInterface,
    GradoRepositoryInterface,
    CategoriaGradoRepositoryInterface
};
use App\Repositories\Eloquent\{
    AreaRepository,
    CategoriaRepository,
    OlimpiadaRepository,
    OlimpiadaAreaCategoriaRepository,
    GradoRepository,
    CategoriaGradoRepository
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
    }

    public function boot()
    {
        //
    }
}