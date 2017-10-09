---
layout: post
title: "Create a Social Network with Laravel 5.4 and Angular 4 - Part 1 : The Backend Setup"
date: 2017-06-07
tags: [angular]
image: /images/post/post-15.png
status: draft
--- 

This part covers the necessary steps to setup and scaffold our backend. We will :

* install laravel and additional packages (dingo and cors)
* setup the authentication
* create and run the required migration files

{:.mb0}
First let's create a fresh installation of laravel (version 5.4 at this time). Go to your local server's directory (i'm using wamp on windows so `C:\wamp64\www`) and create a new laravel project by typing

~~~sh
laravel new sportysocial
~~~

{:.mb0}
Create a new database `sportysocial` and configure our database variables in `.env`

~~~sh
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=sportysocial
DB_USERNAME=root
DB_PASSWORD=
~~~

{:.mb0}
Since this backend will serves as our RESTful server, let's install some other packages to make our job easier - **dingo api**, **jwt**, and **laravel-cors**. Dingo API is "desription from their website"

~~~sh
composer require dingo
~~~

{:.mb0}
Let's publish the Dingo config file by running :

~~~sh
php artisan vendor:publish --provider="Dingo\Api\Provider\LaravelServiceProvider"
~~~

{:.mb0}
Then update our `.env` to add the dingo config variables

~~~sh
API_SUBTYPE=sportysocial
API_PREFIX=api
API_VERSION=v1
API_NAME="SportySocial API"
API_DEBUG=true
~~~

{:.mb0}
We will be using json web token as our authentication.. so let's install jwt

~~~sh
tymon/jwt-auth
~~~

{:.mb0}
After installing jwt, let's tell dingo to use it for `auth`

~~~php
auth config of dingo
~~~

{:.mb0}
Laravel-cors is "description from their website"

~~~sh
composer require laravel/cors
~~~

{:.mb0}
That was easy. Now let's scaffold our authentication. Thanks to laravel, this can be easily done by running:

~~~sh
php artisan make:auth
~~~

{:.mb0}
That command will setup all routes and views for authentication workflows. But we will not be having a registration page through website so let's disable it. Open `sportysocial/app/Http/Controlers/Auth/RegisterController.php` and add `showRegistrationForm` method to regirect users to login page when accessing register route.

~~~php
public function showRegistrationForm()
{
    return redirect('login');
}
~~~

{:.mb0}
Next, we will update the newly generated *user migration* in `sportysocial/database/migrations/xxxxxxxxx_create_users_table.php` to include the additional user info.

~~~php
Schema::create('users', function (Blueprint $table) {
    ...
    $table->tinyInteger('age')->unsigned()->nullable();
    $table->tinyInteger('height')->unsigned()->nullable(); // in inches
    $table->tinyInteger('weight')->unsigned()->nullable(); // in lbs
    $table->string('type');
    $table->string('avatar')->nullable();
    $table->string('cover')->nullable();
    $table->string('status')->nullable();
});
~~~


