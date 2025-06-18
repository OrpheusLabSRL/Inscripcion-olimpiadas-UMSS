<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

// Interfaces
use App\Repositories\Contracts\InscripcionRepositoryInterface;
use App\Repositories\Contracts\PersonaRepositoryInterface;
use App\Repositories\Contracts\OlimpistaRepositoryInterface;
use App\Repositories\Contracts\TutorRepositoryInterface;

// Implementaciones
use App\Repositories\Eloquent\InscripcionRepository;
use App\Repositories\Eloquent\PersonaRepository;
use App\Repositories\Eloquent\OlimpistaRepository;
use App\Repositories\Eloquent\TutorRepository;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(InscripcionRepositoryInterface::class, InscripcionRepository::class);
        $this->app->bind(PersonaRepositoryInterface::class, PersonaRepository::class);
        $this->app->bind(OlimpistaRepositoryInterface::class, OlimpistaRepository::class);
        $this->app->bind(TutorRepositoryInterface::class, TutorRepository::class);
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}