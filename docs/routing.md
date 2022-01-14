# Routing

[[TOC]]

## Route group within a group

In Routes, you can create a group within a group, assigning a certain middleware only to some URLs in the "parent" group.

```php
Route::group(['prefix' => 'account', 'as' => 'account.'], function() {
    Route::get('login', 'AccountController@login');
    Route::get('register', 'AccountController@register');
    
    Route::group(['middleware' => 'auth'], function() {
        Route::get('edit', 'AccountController@edit');
    });
});
```

## Wildcard subdomains

You can create route group by dynamic subdomain name, and pass its value to every route.

```php
Route::domain('{username}.workspace.com')->group(function () {
    Route::get('user/{id}', function ($username, $id) {
        //
    });
});
```

## What's behind the routes?

If you use [Laravel UI package](https://github.com/laravel/ui), you likely want to know what routes are actually behind `Auth::routes()`?

You can check the file `/vendor/laravel/ui/src/AuthRouteMethods.php`.

```php
public function auth()
{
    return function ($options = []) {
        // Authentication Routes...
        $this->get('login', 'Auth\LoginController@showLoginForm')->name('login');
        $this->post('login', 'Auth\LoginController@login');
        $this->post('logout', 'Auth\LoginController@logout')->name('logout');
        // Registration Routes...
        if ($options['register'] ?? true) {
            $this->get('register', 'Auth\RegisterController@showRegistrationForm')->name('register');
            $this->post('register', 'Auth\RegisterController@register');
        }
        // Password Reset Routes...
        if ($options['reset'] ?? true) {
            $this->resetPassword();
        }
        // Password Confirmation Routes...
        if ($options['confirm'] ?? class_exists($this->prependGroupNamespace('Auth\ConfirmPasswordController'))) {
            $this->confirmPassword();
        }
        // Email Verification Routes...
        if ($options['verify'] ?? false) {
            $this->emailVerification();
        }
    };
}
```

The default use of that function is simply this:

```php
Auth::routes(); // no parameters
```

But you can provide parameters to enable or disable certain routes:

```php
Auth::routes([
    'login'    => true,
    'logout'   => true,
    'register' => true,
    'reset'    => true,  // for resetting passwords
    'confirm'  => false, // for additional password confirmations
    'verify'   => false, // for email verification
]);
```

Tip is based on [suggestion](https://github.com/LaravelDaily/laravel-tips/pull/57) by [MimisK13](https://github.com/MimisK13)

## Route Model Binding: You can define a key

You can do Route model binding like `Route::get('api/users/{user}', function (App\User $user) { … }` - but not only by ID field. If you want `{user}` to be a `username`
field, put this in the model:

```php
public function getRouteKeyName() {
    return 'username';
}
```

## Quickly Navigate from Routes file to Controller

This thing was optional before Laravel 8, and became a standard main syntax of routing in Laravel 8.

Instead of routing like this:
```php
Route::get('page', 'PageController@action');
```

You can specify the Controller as a class:
```php
Route::get('page', [\App\Http\Controllers\PageController::class, 'action']);
```

Then you will be able to click on **PageController** in PhpStorm, and navigate directly to Controller, instead of searching for it manually.

Or, to make it shorter, add this to top of Routes file:

```php
use App\Http\Controllers\PageController;

// Then:
Route::get('page', [PageController::class, 'action']);
```

## Route Fallback: When no Other Route is Matched

If you want to specify additional logic for not-found routes, instead of just throwing default 404 page, you may create a special Route for that, at the very end of your Routes file.

```php
Route::group(['middleware' => ['auth'], 'prefix' => 'admin', 'as' => 'admin.'], function () {
    Route::get('/home', 'HomeController@index');
    Route::resource('tasks', 'Admin\TasksController');
});

// Some more routes....
Route::fallback(function() {
    return 'Hm, why did you land here somehow?';
});
```

## Route Parameters Validation with RegExp

We can validate parameters directly in the route, with “where” parameter. A pretty typical case is to prefix your routes by language locale, like `fr/blog` and `en/article/333`. How do we ensure that those two first letters are not used for some other than language?

`routes/web.php`:
```php
Route::group([
    'prefix' => '{locale}',
    'where' => ['locale' => '[a-zA-Z]{2}']
], function () {
    Route::get('/', 'HomeController@index');
    Route::get('article/{id}', 'ArticleController@show');
});
```

## Rate Limiting: Global and for Guests/Users

You can limit some URL to be called a maximum of 60 times per minute, with `throttle:60,1`:
```php
Route::middleware('auth:api', 'throttle:60,1')->group(function () {
    Route::get('/user', function () {
        //
    });
});
```

But also, you can do it separately for public and for logged-in users:
```php
// maximum of 10 requests for guests, 60 for authenticated users
Route::middleware('throttle:10|60,1')->group(function () {
    //
});
```

Also, you can have a DB field users.rate_limit and limit the amount for specific user:
```php
Route::middleware('auth:api', 'throttle:rate_limit,1')->group(function () {
    Route::get('/user', function () {
        //
    });
});
```

## Query string parameters to Routes

If you pass additional parameters to the route, in the array, those key / value pairs will automatically be added to the generated URL's query string.

```php
Route::get('user/{id}/profile', function ($id) {
    //
})->name('profile');

$url = route('profile', ['id' => 1, 'photos' => 'yes']); // Result: /user/1/profile?photos=yes
```

## Separate Routes by Files

If you have a set of routes related to a certain "section", you may separate them in a special `routes/XXXXX.php` file, and just include it in `routes/web.php`

Example with `routes/auth.php` in [Laravel Breeze](https://github.com/laravel/breeze/blob/1.x/stubs/routes/web.php) by Taylor Otwell himself:


```php
Route::get('/', function () {
    return view('welcome');
});

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth'])->name('dashboard');

require __DIR__.'/auth.php';
```

Then, in `routes/auth.php`:

```php
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
// ... more controllers

use Illuminate\Support\Facades\Route;

Route::get('/register', [RegisteredUserController::class, 'create'])
                ->middleware('guest')
                ->name('register');

Route::post('/register', [RegisteredUserController::class, 'store'])
                ->middleware('guest');

// ... A dozen more routes
```

But you should use this `include()` only when that separate route file has the same settings for prefix/middlewares, otherwise it's better to group them in `app/Providers/RouteServiceProvider`:

```php
public function boot()
{
    $this->configureRateLimiting();

    $this->routes(function () {
        Route::prefix('api')
            ->middleware('api')
            ->namespace($this->namespace)
            ->group(base_path('routes/api.php'));

        Route::middleware('web')
            ->namespace($this->namespace)
            ->group(base_path('routes/web.php'));

        // ... Your routes file listed next here
    });
}
```

## Translate Resource Verbs

If you use resource controllers, but want to change URL verbs to non-English for SEO purposes, so instead of `/create` you want Spanish `/crear`, you can configure it by using `Route::resourceVerbs()` method in `App\Providers\RouteServiceProvider`:

```php
public function boot()
{
    Route::resourceVerbs([
        'create' => 'crear',
        'edit' => 'editar',
    ]);

    // ...
}
```

## Custom Resource Route Names

When using Resource Controllers, in `routes/web.php` you can specify `->names()` parameter, so the URL prefix in the browser and the route name prefix you use all over Laravel project may be different.

```php
Route::resource('p', ProductController::class)->names('products');
```

So this code above will generate URLs like `/p`, `/p/{id}`, `/p/{id}/edit`, etc.
But you would call them in the code by `route('products.index')`, `route('products.create')`, etc.

## More Readable Route List

Have you ever run "php artisan route:list" and then realized that the list takes too much space and hard to read?

Here's the solution:
`php artisan route:list --compact`

Then it shows 3 columns instead of 6 columns: shows only Method / URI / Action.

```
+----------+---------------------------------+-------------------------------------------------------------------------+
| Method   | URI                             | Action                                                                  |
+----------+---------------------------------+-------------------------------------------------------------------------+
| GET|HEAD | /                               | Closure                                                                 |
| GET|HEAD | api/user                        | Closure                                                                 |
| POST     | confirm-password                | App\Http\Controllers\Auth\ConfirmablePasswordController@store           |
| GET|HEAD | confirm-password                | App\Http\Controllers\Auth\ConfirmablePasswordController@show            |
| GET|HEAD | dashboard                       | Closure                                                                 |
| POST     | email/verification-notification | App\Http\Controllers\Auth\EmailVerificationNotificationController@store |
| POST     | forgot-password                 | App\Http\Controllers\Auth\PasswordResetLinkController@store             |
| GET|HEAD | forgot-password                 | App\Http\Controllers\Auth\PasswordResetLinkController@create            |
| POST     | login                           | App\Http\Controllers\Auth\AuthenticatedSessionController@store          |
| GET|HEAD | login                           | App\Http\Controllers\Auth\AuthenticatedSessionController@create         |
| POST     | logout                          | App\Http\Controllers\Auth\AuthenticatedSessionController@destroy        |
| POST     | register                        | App\Http\Controllers\Auth\RegisteredUserController@store                |
| GET|HEAD | register                        | App\Http\Controllers\Auth\RegisteredUserController@create               |
| POST     | reset-password                  | App\Http\Controllers\Auth\NewPasswordController@store                   |
| GET|HEAD | reset-password/{token}          | App\Http\Controllers\Auth\NewPasswordController@create                  |
| GET|HEAD | verify-email                    | App\Http\Controllers\Auth\EmailVerificationPromptController@__invoke    |
| GET|HEAD | verify-email/{id}/{hash}        | App\Http\Controllers\Auth\VerifyEmailController@__invoke                |
+----------+---------------------------------+-------------------------------------------------------------------------+
```

You can also specify the exact columns you want:

`php artisan route:list --columns=Method,URI,Name`

```
+----------+---------------------------------+---------------------+
| Method   | URI                             | Name                |
+----------+---------------------------------+---------------------+
| GET|HEAD | /                               |                     |
| GET|HEAD | api/user                        |                     |
| POST     | confirm-password                |                     |
| GET|HEAD | confirm-password                | password.confirm    |
| GET|HEAD | dashboard                       | dashboard           |
| POST     | email/verification-notification | verification.send   |
| POST     | forgot-password                 | password.email      |
| GET|HEAD | forgot-password                 | password.request    |
| POST     | login                           |                     |
| GET|HEAD | login                           | login               |
| POST     | logout                          | logout              |
| POST     | register                        |                     |
| GET|HEAD | register                        | register            |
| POST     | reset-password                  | password.update     |
| GET|HEAD | reset-password/{token}          | password.reset      |
| GET|HEAD | verify-email                    | verification.notice |
| GET|HEAD | verify-email/{id}/{hash}        | verification.verify |
+----------+---------------------------------+---------------------+
```

## Eager load relationship
If you use Route Model Binding and think you can't use Eager Loading for relationships, think again.<br>
So you use Route Model Binding
```php
public function show(Product $product) {
    //
}
```
But you have a belongsTo relationship, and cannot use $product->with('category') eager loading?<br>
You actually can! Load the relationship with `->load()`
```php
public function show(Product $product) {
    $product->load('category');
    //
}
```

## Localizing Resource URIs
If you use resource controllers, but want to change URL verbs to non-English, so instead of `/create` you want Spanish `/crear`, you can configure it with `Route::resourceVerbs()` method.
```php
public function boot()
{
    Route::resourceVerbs([
        'create' => 'crear',
        'edit' => 'editar',
    ]);
    //
}
```

## Resource Controllers naming
In Resource Controllers, in `routes/web.php` you can specify `->names()` parameter, so the URL prefix and the route name prefix may be different.<br>
This will generate URLs like `/p`, `/p/{id}`, `/p/{id}/edit` etc. But you would call them:
- route('products.index)
- route('products.create)
- etc
```php
Route::resource('p', \App\Http\Controllers\ProductController::class)->names('products');
```

## Easily highlight your navbar menus
Use `Route::is('route-name')` to easily highlight your navbar menus
```html
<ul>
    <li @if(Route::is('home')) class="active" @endif>
        <a href="/">Home</a>
    </li>
    <li @if(Route::is('contact-us')) class="active" @endif>
        <a href="/contact-us">Contact us</a>
    </li>
</ul>
```

Tip given by [@anwar_nairi](https://twitter.com/anwar_nairi/status/1443893957507747849)

## Generate absolute path using route() helper
```php
route('page.show', $page->id);
// http://laravel.test/pages/1

route('page.show', $page->id, false);
// /pages/1
```

Tip given by [@oliverds_](https://twitter.com/oliverds_/status/1445796035742240770)

## Override the route binding resolver for each of your models
You can override the route binding resolver for each of your models. In this example, I have no control over the @ sign in the URL, so using the `resolveRouteBinding` method, I'm able to remove the @ sign and resolve the model.
```php
// Route
Route::get('{product:slug}', Controller::class);

// Request
https://nodejs.pub/@unlock/hello-world

// Product Model
public function resolveRouteBinding($value, $field = null)
{
    $value = str_replace('@', '', $value);
    
    return parent::resolveRouteBinding($value, $field);
}
```

Tip given by [@Philo01](https://twitter.com/Philo01/status/1447539300397195269)

## If you need public URL but you want them to be secured
If you need public URL but you want them to be secured, use Laravel signed URL
```php
class AccountController extends Controller
{
    public function destroy(Request $request)
    {
        $confirmDeleteUrl = URL::signedRoute('confirm-destroy', [
            $user => $request->user()
        ]);
        // Send link by email...
    }
    
    public function confirmDestroy(Request $request, User $user)
    {
        if (! $request->hasValidSignature()) {
            abort(403);
        }
        
        // User confirmed by clikcing on the email
        $user->delete();
        
        return redirect()->route('home');
    }
}
```

Tip given by [@anwar_nairi](https://twitter.com/anwar_nairi/status/1448239591467589633)


## Using Gate in middleware method
You can use the gates you specified in `App\Providers\AuthServiceProvider` in middleware method.

To do this, you just need to put inside the `can:` and the names of the necessary gates.

```php
Route::put('/post/{post}', function (Post $post) {
    // The current user may update the post...
})->middleware('can:update,post');
```

## Simple route with arrow function 
You can use php arrow function in routing, without having to use anonymous function.

To do this, you can use `fn() =>`, it looks easier.

```php
// Instead of
Route::get('/example', function () {
    return User::all();
});

// You can
Route::get('/example', fn () => User::all());
```

## Route view 
You can use `Route::view($uri , $bladePage)` to return a view directly, without having to use controller function.


```php
//this will return home.blade.php view
Route::view('/home', 'home');
```
