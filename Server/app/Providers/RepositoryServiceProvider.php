<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\Contracts\{
    AreaRepositoryInterface,
    CategoriaRepositoryInterface,
    OlimpiadaRepositoryInterface
};
use App\Repositories\Eloquent\{
    AreaRepository,
    CategoriaRepository,
    OlimpiadaRepository
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
    }

    public function boot()
    {
        //
    }
}