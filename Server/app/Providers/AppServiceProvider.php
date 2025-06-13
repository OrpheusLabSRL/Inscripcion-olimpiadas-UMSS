<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(
            \App\Repositories\Contracts\TutorRepositoryInterface::class,
            \App\Repositories\Eloquent\TutorRepository::class
        );

        $this->app->bind(
            \App\Repositories\Contracts\OlimpistaRepositoryInterface::class,
            \App\Repositories\Eloquent\OlimpistaRepository::class
        );
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
