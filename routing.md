## Routing

⬆️ [Go to main menu](README.md#laravel-tips) ⬅️ [Previous (Views)](views.md) ➡️ [Next (Validation)](validation.md)

- [Route group within a group](#route-group-within-a-group)
- [Declare a resolveRouteBinding method in your Model](#declare-a-resolveroutebinding-method-in-your-model)
- [assign withTrashed() to Route::resource() method](#assign-withtrashed-to-routeresource-method)
- [Skip Input Normalization](#skip-input-normalization)
- [Wildcard subdomains](#wildcard-subdomains)
- [What's behind the routes?](#whats-behind-the-routes)
- [Route Model Binding: You can define a key](#route-model-binding-you-can-define-a-key)
- [Route Fallback: When no Other Route is Matched](#route-fallback-when-no-other-route-is-matched)
- [Route Parameters Validation with RegExp](#route-parameters-validation-with-regexp)
- [Rate Limiting: Global and for Guests/Users](#rate-limiting-global-and-for-guestsusers)
- [Query string parameters to Routes](#query-string-parameters-to-routes)
- [Separate Routes by Files](#separate-routes-by-files)
- [Translate Resource Verbs](#translate-resource-verbs)
- [Custom Resource Route Names](#custom-resource-route-names)
- [Eager load relationship](#eager-load-relationship)
- [Localizing Resource URIs](#localizing-resource-uris)
- [Resource Controllers naming](#resource-controllers-naming)
- [Easily highlight your navbar menus](#easily-highlight-your-navbar-menus)
- [Generate absolute path using route() helper](#generate-absolute-path-using-route-helper)
- [Override the route binding resolver for each of your models](#override-the-route-binding-resolver-for-each-of-your-models)
- [If you need public URL, but you want them to be secured](#if-you-need-public-url-but-you-want-them-to-be-secured)
- [Using Gate in middleware method](#using-gate-in-middleware-method)
- [Simple route with arrow function](#simple-route-with-arrow-function)
- [Route view](#route-view)
- [Route directory instead of route file](#route-directory-instead-of-route-file)
- [Route resources grouping](#route-resources-grouping)
- [Custom route bindings](#custom-route-bindings)
- [Two ways to check the route name](#two-ways-to-check-the-route-name)
- [Route model binding soft-deleted models](#route-model-binding-soft-deleted-models)
- [Retrieve the URL without query parameters](#retrieve-the-url-without-query-parameters)
- [Customizing Missing Model Behavior in route model bindings](#customizing-missing-model-behavior-in-route-model-bindings)
- [Exclude middleware from a route](#exclude-middleware-from-a-route)
- [Controller groups](#controller-groups)

### Route group within a group

In Routes, you can create a group within a group, assigning a certain middleware only to some URLs in the "parent" group.

```php
Route::group(['prefix' => 'account', 'as' => 'account.'], function() {
    Route::get('login', [AccountController::class, 'login']);
    Route::get('register', [AccountController::class, 'register']);
    Route::group(['middleware' => 'auth'], function() {
        Route::get('edit', [AccountController::class, 'edit']);
    });
});
```

### Declare a resolveRouteBinding method in your Model

Route model binding in Laravel is great, but there are cases where we can't just allow users to easily access resources by ID. We might need to verify their ownership of a resource.

You can declare a resolveRouteBinding method in your Model and add your custom logic there.

```php
public function resolveRouteBinding($value, $field = null)
{
     $user = request()->user();

     return $this->where([
          ['user_id' => $user->id],
          ['id' => $value]
     ])->firstOrFail();
}
```

Tip given by [@notdylanv](https://twitter.com/notdylanv/status/1567296232183447552/)

### assign withTrashed() to Route::resource() method

Before Laravel 9.35 - only for Route::get()
```php
Route::get('/users/{user}', function (User $user) {
     return $user->email;
})->withTrashed();
```

Since Laravel 9.35 - also for `Route::resource()`!
```php
Route::resource('users', UserController::class)
     ->withTrashed();
```

Or, even by method
```php
Route::resource('users', UserController::class)
     ->withTrashed(['show']);
```

### Skip Input Normalization

Laravel automatically trims all incoming string fields on the request. It's called Input Normalization.

Sometimes, you might not want this behavior.

You can use skipWhen method on the TrimStrings middleware and return true to skip it.

```php
public function boot()
{
     TrimStrings::skipWhen(function ($request) {
          return $request->is('admin/*);
     });
}
```

Tip given by [@Laratips1](https://twitter.com/Laratips1/status/1580210517372596224)

### Wildcard subdomains

You can create route group by dynamic subdomain name, and pass its value to every route.

```php
Route::domain('{username}.workspace.com')->group(function () {
    Route::get('user/{id}', function ($username, $id) {
        //
    });
});
```

### What's behind the routes?

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

### Route Model Binding: You can define a key

You can do Route model binding like `Route::get('api/users/{user}', function (User $user) { … }` - but not only by ID field. If you want `{user}` to be a `username` field, put this in the model:

```php
public function getRouteKeyName() {
    return 'username';
}
```

### Route Fallback: When no Other Route is Matched

If you want to specify additional logic for not-found routes, instead of just throwing default 404 page, you may create a special Route for that, at the very end of your Routes file.

```php
Route::group(['middleware' => ['auth'], 'prefix' => 'admin', 'as' => 'admin.'], function () {
    Route::get('/home', [HomeController::class, 'index']);
    Route::resource('tasks', [Admin\TasksController::class]);
});

// Some more routes....
Route::fallback(function() {
    return 'Hm, why did you land here somehow?';
});
```

### Route Parameters Validation with RegExp

We can validate parameters directly in the route, with “where” parameter. A pretty typical case is to prefix your routes by language locale, like `fr/blog` and `en/article/333`. How do we ensure that those two first letters are not used for some other than language?

`routes/web.php`:

```php
Route::group([
    'prefix' => '{locale}',
    'where' => ['locale' => '[a-zA-Z]{2}']
], function () {
    Route::get('/', [HomeController::class, 'index']);
    Route::get('article/{id}', [ArticleController::class, 'show']);;
});
```

### Rate Limiting: Global and for Guests/Users

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

### Query string parameters to Routes

If you pass additional parameters to the route, in the array, those key / value pairs will automatically be added to the generated URL's query string.

```php
Route::get('user/{id}/profile', function ($id) {
    //
})->name('profile');

$url = route('profile', ['id' => 1, 'photos' => 'yes']); // Result: /user/1/profile?photos=yes
```

### Separate Routes by Files

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

### Translate Resource Verbs

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

### Custom Resource Route Names

When using Resource Controllers, in `routes/web.php` you can specify `->names()` parameter, so the URL prefix in the browser and the route name prefix you use all over Laravel project may be different.

```php
Route::resource('p', ProductController::class)->names('products');
```

So this code above will generate URLs like `/p`, `/p/{id}`, `/p/{id}/edit`, etc.
But you would call them in the code by `route('products.index')`, `route('products.create')`, etc.

### Eager load relationship

If you use Route Model Binding and think you can't use Eager Loading for relationships, think again.

So you use Route Model Binding

```php
public function show(Product $product) {
    //
}
```

But you have a belongsTo relationship, and cannot use $product->with('category') eager loading?

You actually can! Load the relationship with `->load()`

```php
public function show(Product $product) {
    $product->load('category');
    //
}
```

### Localizing Resource URIs

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

### Resource Controllers naming

In Resource Controllers, in `routes/web.php` you can specify `->names()` parameter, so the URL prefix and the route name prefix may be different.

This will generate URLs like `/p`, `/p/{id}`, `/p/{id}/edit` etc. But you would call them:

- route('products.index)
- route('products.create)
- etc

```php
Route::resource('p', \App\Http\Controllers\ProductController::class)->names('products');
```

### Easily highlight your navbar menus

Use `Route::is('route-name')` to easily highlight your navbar menus

```blade
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

### Generate absolute path using route() helper

```php
route('page.show', $page->id);
// http://laravel.test/pages/1

route('page.show', $page->id, false);
// /pages/1
```

Tip given by [@oliverds\_](https://twitter.com/oliverds_/status/1445796035742240770)

### Override the route binding resolver for each of your models

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

### If you need public URL, but you want them to be secured

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

        // User confirmed by clicking on the email
        $user->delete();

        return redirect()->route('home');
    }
}
```

Tip given by [@anwar_nairi](https://twitter.com/anwar_nairi/status/1448239591467589633)

### Using Gate in middleware method

You can use the gates you specified in `App\Providers\AuthServiceProvider` in middleware method.

To do this, you just need to put inside the `can:` and the names of the necessary gates.

```php
Route::put('/post/{post}', function (Post $post) {
    // The current user may update the post...
})->middleware('can:update,post');
```

### Simple route with arrow function

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

### Route view

You can use `Route::view($uri , $bladePage)` to return a view directly, without having to use controller function.

```php
//this will return home.blade.php view
Route::view('/home', 'home');
```

### Route directory instead of route file

You can create a _/routes/web/_ directory and only fill _/routes/web.php_ with:

```php
foreach(glob(dirname(__FILE__).'/web/*', GLOB_NOSORT) as $route_file){
    include $route_file;
}
```

Now every file inside _/routes/web/_ act as a web router file and you can organize your routes into different files.

### Route resources grouping

If your routes have a lot of resource controllers, you can group them and call one Route::resources() instead of many single Route::resource() statements.

```php
Route::resources([
    'photos' => PhotoController::class,
    'posts' => PostController::class,
]);
```

### Custom route bindings

Did you know you can define custom route bindings in Laravel?

In this example, I need to resolve a portfolio by slug. But the slug is not unique, because multiple users can have a portfolio named 'Foo'

So I define how Laravel should resolve them from a route parameter

```php
class RouteServiceProvider extends ServiceProvider
{
    public const HOME = '/dashboard';

    public function boot()
    {
        Route::bind('portfolio', function (string $slug) {
            return Portfolio::query()
                ->whereBelongsto(request()->user())
                ->whereSlug($slug)
                ->firstOrFail();
        });
    }
}
```

```php
Route::get('portfolios/{portfolio}', function (Portfolio $portfolio) {
    /*
     * The $portfolio will be the result of the query defined in the RouteServiceProvider
     */
})
```

Tip given by [@mmartin_joo](https://twitter.com/mmartin_joo/status/1496871240346509312)

### Two ways to check the route name

Here are two ways to check the route name in Laravel.

```php
// #1
<a
    href="{{ route('home') }}"
    @class="['navbar-link', 'active' => Route::current()->getName() === 'home']"
>
    Home
</a>
// #2
<a
    href="{{ route('home') }}"
    @class="['navbar-link', 'active' => request()->routeIs('home)]"
>
    Home
</a>
```

Tip given by [@AndrewSavetchuk](https://twitter.com/AndrewSavetchuk/status/1510197418909999109)

### Route model binding soft-deleted models

By default, when using route model binding will not retrieve models that have been soft-deleted.
You can change that behavior by using `withTrashed` in your route.

```php
Route::get('/posts/{post}', function (Post $post) {
    return $post;
})->withTrashed();
```

Tip given by [@cosmeescobedo](https://twitter.com/cosmeescobedo/status/1511154599255703553)

### Retrieve the URL without query parameters

If for some reason, your URL is having query parameters, you can retrieve the URL without query parameters using the `fullUrlWithoutQuery` method of request like so.

```php
// Original URL: https://www.amitmerchant.com?search=laravel&lang=en&sort=desc
$urlWithQueryString = $request->fullUrlWithoutQuery([
    'lang',
    'sort'
]);
echo $urlWithQueryString;
// Outputs: https://www.amitmerchant.com?search=laravel
```

Tip given by [@amit_merchant](https://twitter.com/amit_merchant/status/1510867527962066944)

### Customizing Missing Model Behavior in route model bindings

By default, Laravel throws a 404 error when it can't bind the model, but you can change that behavior by passing a closure to the missing method.

```php
Route::get('/users/{user}', [UsersController::class, 'show'])
    ->missing(function ($parameters) {
        return Redirect::route('users.index');
    });
```

Tip given by [@cosmeescobedo](https://twitter.com/cosmeescobedo/status/1511322007576608769)

### Exclude middleware from a route

You can exclude middleware at the route level in Laravel using the withoutMiddleware method.

```php
Route::post('/some/route', SomeController::class)
    ->withoutMiddleware([VerifyCsrfToken::class]);
```

Tip given by [@alexjgarrett](https://twitter.com/alexjgarrett/status/1512529798790320129)

### Controller groups

Instead of using the controller in each route, consider using a route controller group. Added to Laravel since v8.80

```php
// Before
Route::get('users', [UserController::class, 'index']);
Route::post('users', [UserController::class, 'store']);
Route::get('users/{user}', [UserController::class, 'show']);
Route::get('users/{user}/ban', [UserController::class, 'ban']);
// After
Route::controller(UsersController::class)->group(function () {
    Route::get('users', 'index');
    Route::post('users', 'store');
    Route::get('users/{user}', 'show');
    Route::get('users/{user}/ban', 'ban');
});
```

Tip given by [@justsanjit](https://twitter.com/justsanjit/status/1514943541612527616)

### Global strip_tags Validation
If you want no HTML Input in your Laravel-project, you can create a middleware wich escapes HTML for any input.

Create Middleware:
```bash
php artisan make:middleware StripTags
```

The `handle()` methode of the new created class should look like this:

```php
public function handle(Request $request, Closure $next): Response
    {
        $input = $request->all();
        array_walk_recursive($input, function(&$input) {
            $input = strip_tags($input);
        });
        $request->merge($input);
        return $next($request);
    }
```
After that you add the StripTags Middleware in your `Kernel.php`. For example like this:
```php
/**
* The application's global HTTP middleware stack.
*
* These middleware are run during every request to your application.
*
* @var array<int, class-string|string>
*/
protected $middleware = [
// \App\Http\Middleware\TrustHosts::class,
\App\Http\Middleware\TrustProxies::class,
\Illuminate\Http\Middleware\HandleCors::class,
\App\Http\Middleware\PreventRequestsDuringMaintenance::class,
\Illuminate\Foundation\Http\Middleware\ValidatePostSize::class,
\App\Http\Middleware\TrimStrings::class,
\Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull::class,
// This:
\App\Http\Middleware\StripTags::class,
];
```

Now on each Request all HTML will be removed. 

I find this code in my own (older) project. I am sure that this is a tip from the Internet. I cant give any credits for that, cause i do not know the source anymore.