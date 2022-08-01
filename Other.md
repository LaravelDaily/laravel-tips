## Other

⬆️ [Go to main menu](README.md#laravel-tips) ⬅️ [Previous (API)](Api.md)

- [Localhost in .env](#localhost-in-env)
- [When (NOT) to run "composer update"](#when-not-to-run-composer-update)
- [Composer: check for newer versions](#composer-check-for-newer-versions)
- [Auto-Capitalize Translations](#auto-capitalize-translations)
- [Carbon with Only Hours](#carbon-with-only-hours)
- [Single Action Controllers](#single-action-controllers)
- [Redirect to Specific Controller Method](#redirect-to-specific-controller-method)
- [Use Older Laravel Version](#use-older-laravel-version)
- [Add Parameters to Pagination Links](#add-parameters-to-pagination-links)
- [Repeatable Callback Functions](#repeatable-callback-functions)
- [Request: has any](#request-has-any)
- [Simple Pagination](#simple-pagination)
- [Blade directive to add true/false conditions](#blade-directive-to-add-truefalse-conditions)
- [Jobs can be used without queues](#jobs-can-be-used-without-queues)
- [Use faker outside factories or seeders](#use-faker-outside-factories-or-seeders)
- [Schedule things](#schedule-things)
- [Search Laravel docs](#search-laravel-docs)
- [Filter route:list](#filter-routelist)
- [Blade directive for not repeating yourself](#blade-directive-for-not-repeating-yourself)
- [Artisan commands help](#artisan-commands-help)
- [Disable lazy loading when running your tests](#disable-lazy-loading-when-running-your-tests)
- [Using two amazing helpers in Laravel will bring magic results](#using-two-amazing-helpers-in-laravel-will-bring-magic-results)
- [Request parameter default value](#request-parameter-default-value)
- [Pass middleware directly into the route without register it](#pass-middleware-directly-into-the-route-without-register-it)
- [Transforming an array to CssClasses](#transforming-an-array-to-cssclasses)
- ["upcomingInvoice" method in Laravel Cashier (Stripe)](#upcominginvoice-method-in-laravel-cashier-stripe)
- [Laravel Request exists() vs has()](#laravel-request-exists-vs-has)
- [There are multiple ways to return a view with variables](#there-are-multiple-ways-to-return-a-view-with-variables)
- [Schedule regular shell commands](#schedule-regular-shell-commands)
- [HTTP client request without verifying](#http-client-request-without-verifying)
- [Test that doesn't assert anything ](#test-that-doesnt-assert-anything)
- ["Str::mask()" method](#strmask-method)
- [Extending Laravel classes](#extending-laravel-classes)
- [Can feature](#can-feature)
- [Temporary download URLs](#temporary-download-urls)
- [Dealing with deeply-nested arrays](#dealing-with-deeply-nested-arrays)
- [Customize how your exceptions are rendered](#customize-how-your-exceptions-are-rendered)
- [The tap helper](#the-tap-helper)
- [Reset all of the remaining time units](#reset-all-of-the-remaining-time-units)
- [Scheduled commands in the console kernel can automatically email their output if something goes wrong](#scheduled-commands-in-the-console-kernel-can-automatically-email-their-output-if-something-goes-wrong)
- [Be careful when constructing your custom filtered queries using GET parameters](#be-careful-when-constructing-your-custom-filtered-queries-using-get-parameters)
- [Dust out your bloated route file](#dust-out-your-bloated-route-file)
- [You can send e-mails to a custom log file](#you-can-send-e-mails-to-a-custom-log-file)
- [Markdown made easy](#markdown-made-easy)
- [Simplify if on a request with whenFilled() helper](#simplify-if-on-a-request-with-whenfilled-helper)
- [Pass arguments to middleware](#pass-arguments-to-middleware)
- [Get value from session and forget](#get-value-from-session-and-forget)
- [$request->date() method](#request-date-method)
- [Use through instead of map when using pagination](#use-through-instead-of-map-when-using-pagination)
- [Quickly add a bearer token to HTTP request](#quickly-add-a-bearer-token-to-HTTP-request)
- [Copy file or all files from a folder](#copy-file-or-all-files-from-a-folder)
- [Sessions has() vs exists() vs missing()](#sessions-has-vs-exists-vs-missing)
- [Test that you are passing the correct data to a view](#test-that-you-are-passing-the-correct-data-to-a-view)
- [Use Redis to track page views](#use-redis-to-track-page-views)
- [to_route() helper function](#to_route-helper-function)
- [Pause a long running job when queue worker shuts down](#pause-a-long-running-job-when-queue-worker-shuts-down)
- [Freezing Time in Laravel Tests](#freezing-time-in-laravel-tests)
- [New squish helper](#new-squish-helper)
- [Specify what to do if a scheduled task fails or succeeds](#specify-what-to-do-if-a-scheduled-task-fails-or-succeeds)
- [Scheduled command on specific environments](#scheduled-command-on-specific-environments)
- [Add conditionable behavior to your own classes](#add-conditionable-behavior-to-your-own-classes)
- [Run Jobs in sequence](#run-jobs-in-sequence)
- [Perform Action when Job is failed](#perform-action-when-job-is-failed)

### Localhost in .env

Don't forget to change `APP_URL` in your `.env` file from `http://localhost` to the real URL, cause it will be the basis for any links in your email notifications and elsewhere.

```
APP_NAME=Laravel
APP_ENV=local
APP_KEY=base64:9PHz3TL5C4YrdV6Gg/Xkkmx9btaE93j7rQTUZWm2MqU=
APP_DEBUG=true
APP_URL=http://localhost
```

### When (NOT) to run "composer update"

Not so much about Laravel, but... Never run `composer update` on production live server, it's slow and will "break" repository. Always run `composer update` locally on your computer, commit new `composer.lock` to the repository, and run `composer install` on the live server.

### Composer: Check for Newer Versions

If you want to find out which of your `composer.json` packages have released newer versions, just run `composer outdated`. You will get a full list with all information, like this below.

```
phpdocumentor/type-resolver 0.4.0 0.7.1
phpunit/php-code-coverage   6.1.4 7.0.3 Library that provides collection, processing, and rende...
phpunit/phpunit             7.5.9 8.1.3 The PHP Unit Testing framework.
ralouphie/getallheaders     2.0.5 3.0.3 A polyfill for getallheaders.
sebastian/global-state      2.0.0 3.0.0 Snapshotting of global state
```

### Auto-Capitalize Translations

In translation files (`resources/lang`), you can specify variables not only as `:variable`, but also capitalized as `:VARIABLE` or `:Variable` - and then whatever value you pass - will be also capitalized automatically.

```php
// resources/lang/en/messages.php
'welcome' => 'Welcome, :Name'

// Result: "Welcome, Taylor"
echo __('messages.welcome', ['name' => 'taylor']);
```

### Carbon with Only Hours

If you want to have a current date without seconds and/or minutes, use Carbon's methods like `setSeconds(0)` or `setMinutes(0)`.

```php
// 2020-04-20 08:12:34
echo now();

// 2020-04-20 08:12:00
echo now()->setSeconds(0);

// 2020-04-20 08:00:00
echo now()->setSeconds(0)->setMinutes(0);

// Another way - even shorter
echo now()->startOfHour();
```

### Single Action Controllers

If you want to create a controller with just one action, you can use `__invoke()` method and even create "invokable" controller.

Route:

```php
Route::get('user/{id}', 'ShowProfile');
```

Artisan:

```bash
php artisan make:controller ShowProfile --invokable
```

Controller:

```php
class ShowProfile extends Controller
{
    public function __invoke($id)
    {
        return view('user.profile', [
            'user' => User::findOrFail($id)
        ]);
    }
}
```

### Redirect to Specific Controller Method

You can `redirect()` not only to URL or specific route, but to a specific Controller's specific method, and even pass the parameters. Use this:

```php
return redirect()->action('SomeController@method', ['param' => $value]);
```

### Use Older Laravel Version

If you want to use OLDER version instead of the newest Laravel, use this command:

```bash
composer create-project --prefer-dist laravel/laravel project "7.*"
```

Change 7.\* to whichever version you want.

### Add Parameters to Pagination Links

In default Pagination links, you can pass additional parameters, preserve the original query string, or even point to a specific `#xxxxx` anchor.

```blade
{{ $users->appends(['sort' => 'votes'])->links() }}

{{ $users->withQueryString()->links() }}

{{ $users->fragment('foo')->links() }}
```

### Repeatable Callback Functions

If you have a callback function that you need to re-use multiple times, you can assign it to a variable, and then re-use.

```php
$userCondition = function ($query) {
    $query->where('user_id', auth()->id());
};

// Get articles that have comments from this user
// And return only those comments from this user
$articles = Article::with(['comments' => $userCondition])
    ->whereHas('comments', $userCondition)
    ->get();
```

### Request: has any

You can check not only one parameter with `$request->has()` method, but also check for multiple parameters present, with `$request->hasAny() `:

```php
public function store(Request $request)
{
    if ($request->hasAny(['api_key', 'token'])) {
        echo 'We have API key passed';
    } else {
        echo 'No authorization parameter';
    }
}
```

### Simple Pagination

In pagination, if you want to have just "Previous/next" links instead of all the page numbers (and have fewer DB queries because of that), just change `paginate()` to `simplePaginate()`:

```php
// Instead of
$users = User::paginate(10);

// You can do this
$users = User::simplePaginate(10);
```

### Blade directive to add true/false conditions

New in Laravel 8.51: `@class` Blade directive to add true/false conditions on whether some CSS class should be added. Read more in [docs](https://laravel.com/docs/8.x/blade#conditional-classes) <br>
Before:

```php
<div class="@if ($active) underline @endif">`
```

Now:

```php
<div @class(['underline' => $active])>
```

```php
@php
    $isActive = false;
    $hasError = true;
@endphp

<span @class([
    'p-4',
    'font-bold' => $isActive,
    'text-gray-500' => ! $isActive,
    'bg-red' => $hasError,
])></span>

<span class="p-4 text-gray-500 bg-red"></span>
```

Tip given by [@Teacoders](https://twitter.com/Teacoders/status/1445417511546023938)

### Jobs can be used without queues

Jobs are discussed in the "Queues" section of the docs, but you can use Jobs without queues, just as classes to delegate tasks to.
Just call `$this->dispatchNow()` from Controllers

```php
public function approve(Article $article)
{
    //
    $this->dispatchNow(new ApproveArticle($article));
    //
}
```

### Use faker outside factories or seeders

If you want to generate some fake data, you can use Faker even outside factories or seeds, in any class.<br>
_Keep in mind: to use it in **production**, you need to move faker from `"require-dev"` to `"require"` in `composer.json`_

```php
use Faker;

class WhateverController extends Controller
{
    public function whatever_method()
    {
        $faker = Faker\Factory::create();
        $address = $faker->streetAddress;
    }
}
```

### Schedule things

You can schedule things to run daily/hourly in a lot of different structures.<br>
You can schedule an artisan command, a Job class, an invokable class, a callback function, and even execute a shell script.

```php
use App\Jobs\Heartbeat;

$schedule->job(new Heartbeat)->everyFiveMinutes();
```

```php
$schedule->exec('node /home/forge/script.js')->daily();
```

```php
use App\Console\Commands\SendEmailsCommand;

$schedule->command('emails:send Taylor --force')->daily();

$schedule->command(SendEmailsCommand::class, ['Taylor', '--force'])->daily();
```

```php
protected function schedule(Schedule $schedule)
{
    $schedule->call(function () {
        DB::table('recent_users')->delete();
    })->daily();
}
```

### Search Laravel docs

If you want to search Laravel Docs for some keyword, by default it gives you only the TOP 5 results. Maybe there are more?<br>
If you want to see ALL results, you may go to the Github Laravel docs repository and search there directly. https://github.com/laravel/docs

### Filter route:list

New in Laravel 8.34: `php artisan route:list` gets additional flag `--except-path`, so you would filter out the routes you don't want to see. [See original PR](New in Laravel 8.34: `php artisan route:list` gets additional flag `--except-path`, so you would filter out the routes you don't want to see. [See original PR](https://github.com/laravel/framework/pull/36619)

### Blade directive for not repeating yourself

If you keep doing the same formatting of the data in multiple Blade files, you may create your own Blade directive.<br>
Here's an example of money amount formatting using the method from Laravel Cashier.

```php
"require": {
        "laravel/cashier": "^12.9",
}
```

```php
public function boot()
{
    Blade::directive('money', function ($expression) {
        return "<?php echo Laravel\Cashier\Cashier::formatAmount($expression, config('cashier.currency')); ?>";
    });
}
```

```php
<div>Price: @money($book->price)</div>
@if($book->discount_price)
    <div>Discounted price: @money($book->dicount_price)</div>
@endif
```

### Artisan commands help

If you are not sure about the parameters of some Artisan command, or you want to know what parameters are available, just type `php artisan help [a command you want]`.

### Disable lazy loading when running your tests

If you don't want to prevent lazy loading when running your tests you can disable it

```php
Model::preventLazyLoading(!$this->app->isProduction() && !$this->app->runningUnitTests());
```

Tip given by [@djgeisi](https://twitter.com/djgeisi/status/1435538167290073090)

### Using two amazing helpers in Laravel will bring magic results

Using two amazing helpers in Laravel will bring magic results...<br>
In this case, the service will be called and retried (retry). If it stills failing, it will be reported, but the request won't fail (rescue)

```php
rescue(function () {
    retry(5, function () {
        $this->service->callSomething();
    }, 200);
});
```

Tip given by [@JuanDMeGon](https://twitter.com/JuanDMeGon/status/1435466660467683328)

### Request parameter default value

Here we are checking if there is a per_page (or any other parameter) value then we will use it, otherwise, we will use a default one.

```php
// Isteand of this
$perPage = request()->per_page ? request()->per_page : 20;

// You can do this
$perPage = request('per_page', 20);
```

Tip given by [@devThaer](https://twitter.com/devThaer/status/1437521022631165957)

### Pass middleware directly into the route without register it

```php
Route::get('posts', PostController::class)
    ->middleware(['auth', CustomMiddleware::class])
```

Tip given by [@sky_0xs](https://twitter.com/sky_0xs/status/1438258486815690766)

### Transforming an array to CssClasses

```php
use Illuminate\Support\Arr;

$array = ['p-4', 'font-bold' => $isActive, 'bg-red' => $hasError];

$isActive = false;
$hasError = true;

$classes = Arr::toCssClasses($array);

/*
 * 'p-4 bg-red'
 */
```

Tip given by [@dietsedev](https://twitter.com/dietsedev/status/1438550428833271808)

### "upcomingInvoice" method in Laravel Cashier (Stripe)

You can show how much a customer will pay in the next billing cycle.<br>
There is a "upcomingInvoice" method in Laravel Cashier (Stripe) to get the upcoming invoice details.

```php
Route::get('/profile/invoices', function (Request $request) {
    return view('/profile/invoices', [
        'upcomingInvoice' => $request->user()->upcomingInvoice(),
        'invoices' => $request-user()->invoices(),
    ]);
});
```

Tip given by [@oliverds\_](https://twitter.com/oliverds_/status/1439997820228890626)

### Laravel Request exists() vs has()

```php
// https://example.com?popular
$request->exists('popular') // true
$request->has('popular') // false

// https://example.com?popular=foo
$request->exists('popular') // true
$request->has('popular') // true
```

Tip given by [@coderahuljat](https://twitter.com/coderahuljat/status/1442191143244951552)

### There are multiple ways to return a view with variables

```php
// First way ->with()
return view('index')
    ->with('projects', $projects)
    ->with('tasks', $tasks)

// Second way - as an array
return view('index', [
        'projects' => $projects,
        'tasks' => $tasks
    ]);

// Third way - the same as second, but with variable
$data = [
    'projects' => $projects,
    'tasks' => $tasks
];
return view('index', $data);

// Fourth way - the shortest - compact()
return view('index', compact('projects', 'tasks'));
```

### Schedule regular shell commands

We can schedule regular shell commands within Laravel scheduled command

```php
// app/Console/Kernel.php

class Kernel extends ConsoleKernel
{
    protected function shedule(Schedule $shedule)
    {
        $shedule->exec('node /home/forge/script.js')->daily();
    }
}
```

Tip given by [@anwar_nairi](https://twitter.com/anwar_nairi/status/1448985254794915845)

### HTTP client request without verifying

Sometimes, you may want to send HTTP request without verifying SSL in your local environment, you can do like so:

```php
return Http::withoutVerifying()->post('https://example.com');
```

If you want to set multiple options, you can use `withOptions`.

```php
return Http::withOptions([
    'verify' => false,
    'allow_redirects' => true
])->post('https://example.com');
```

Tip given by [@raditzfarhan](https://github.com/raditzfarhan)

### Test that doesn't assert anything

Test that doesn't assert anything, just launch something which may or may not throw an exception

```php
class MigrationsTest extends TestCase
{
    public function test_successful_foreign_key_in_migrations()
    {
        // We just test if the migrations succeeds or throws an exception
        $this->expectNotToPerformAssertions();


       Artisan::call('migrate:fresh', ['--path' => '/databse/migrations/task1']);
    }
}
```

### "Str::mask()" method

Laravel 8.69 released with "Str::mask()" method which masks a portion of string with a repeated character

```php
class PasswordResetLinkController extends Controller
{
    public function sendResetLinkResponse(Request $request)
    {
        $userEmail = User::where('email', $request->email)->value('email'); // username@domain.com

        $maskedEmail = Str::mask($userEmail, '*', 4); // user***************

        // If needed, you provide a negative number as the third argument to the mask method,
        // which will instruct the method to begin masking at the given distance from the end of the string

        $maskedEmail = Str::mask($userEmail, '*', -16, 6); // use******domain.com
    }
}
```

Tip given by [@Teacoders](https://twitter.com/Teacoders/status/1457029765634744322)

### Extending Laravel classes

There is a method called macro on a lot of built-in Laravel classes. For example Collection, Str, Arr, Request, Cache, File, and so on.<br>
You can define your own methods on these classes like this:

```php
Str::macro('lowerSnake', function (string $str) {
    return Str::lower(Str::snake($str));
});

// Will return: "my-string"
Str::lowerSnake('MyString');
```

Tip given by [@mmartin_joo](https://twitter.com/mmartin_joo/status/1457635252466298885)

### Can feature

If you are running Laravel `v8.70`, you can chain `can()` method directly instead of `middleware('can:..')`

```php
// instead of
Route::get('users/{user}/edit', function (User $user) {
    ...
})->middleware('can:edit,user');

// you can do this
Route::get('users/{user}/edit', function (User $user) {
    ...
})->can('edit' 'user');

// PS: you must write UserPolicy to be able to do this in both cases
```

Tip given by [@sky_0xs](https://twitter.com/sky_0xs/status/1458179766192853001)

### Temporary download URLs

You can use temporary download URLs for your cloud storage resources to prevent unwanted access. For example, when a user wants to download a file, we redirect to an s3 resource but have the URL expire in 5 seconds.

```php
public function download(File $file)
{
    // Initiate file download by redirecting to a temporary s3 URL that expires in 5 seconds
    return redirect()->to(
        Storage::disk('s3')->temporaryUrl($file->name, now()->addSeconds(5))
    );
}
```

Tip given by [@Philo01](https://twitter.com/Philo01/status/1458791323889197064)

### Dealing with deeply-nested arrays

If you have an complex array, you can use `data_get()` helper function to retrieve a value from a nested array using "dot" notation and wildcard.

```php
$data = [
  0 => ['user_id' => 1, 'created_at' => 'timestamp', 'product' => {object Product}],
  1 => ['user_id' => 2, 'created_at' => 'timestamp', 'product' => {object Product}],
  2 => etc
];

// Now we want to get all products ids. We can do like this:

data_get($data, '*.product.id');

// Now we have all products ids [1, 2, 3, 4, 5, etc...]
```

In the example below, if either `request`, `user` or `name` are missing then you'll get errors.

```php
$value = $payload['request']['user']['name'];

// The data_get function accepts a default value, which will be returned if the specified key is not found.

$value = data_get($payload, 'request.user.name', 'John')
```

Tip given by [@mattkingshott](https://twitter.com/mattkingshott/status/1460970984568094722)

### Customize how your exceptions are rendered

You can customize how your exceptions are rendered by adding a 'render' method to your exception.<br>
For example, this allows you to return JSON instead of a Blade view when the request expects JSON.

```php
abstract class BaseException extends Exception
{
    public function render(Request $request)
    {
        if ($request->expectsJson()) {
            return response()->json([
                'meta' => [
                    'valid'   => false,
                    'status'  => static::ID,
                    'message' => $this->getMessage(),
                ],
            ], $this->getCode());
        }

        return response()->view('errors.' . $this->getCode(), ['exception' => $this], $this->getCode());
    }
}
```

```php
class LicenseExpiredException extends BaseException
{
    public const ID = 'EXPIRED';
    protected $code = 401;
    protected $message = 'Given license has expired.'
}
```

Tip given by [@Philo01](https://twitter.com/Philo01/status/1461331239240192003/)

### The tap helper

The `tap` helper is a great way to remove a separate return statement after calling a method on an object. Makes things nice and clean

```php
// without tap
$user->update(['name' => 'John Doe']);

return $user;

// with tap()
return tap($user)->update(['name' => 'John Doe']);
```

Tip given by [@mattkingshott](https://twitter.com/mattkingshott/status/1462058149314183171)

### Reset all of the remaining time units

You can insert an exclamation into the `DateTime::createFromFormat` method to reset all of the remaining time units

```php
// 2021-10-12 21:48:07.0
DateTime::createFromFormat('Y-m-d', '2021-10-12');

// 2021-10-12 00:00:00.0
DateTime::createFromFormat('!Y-m-d', '2021-10-12');

2021-10-12 21:00:00.0
DateTime::createFromFormat('!Y-m-d H', '2021-10-12');
```

Tip given by [@SteveTheBauman](https://twitter.com/SteveTheBauman/status/1448045021006082054)

### Scheduled commands in the console kernel can automatically email their output if something goes wrong

Did you know that any commands you schedule in the console kernel can automatically email their output if something goes wrong

```php
$schedule
    ->command(PruneOrganizationsCOmmand::class)
    ->hourly()
    ->emailOutputOnFailure(config('mail.support'));
```

Tip given by [@mattkingshott](https://twitter.com/mattkingshott/status/1463160409905455104)

### Be careful when constructing your custom filtered queries using GET parameters

```php
if (request()->has('since')) {
    // example.org/?since=
    // fails with illegal operator and value combination
    $query->whereDate('created_at', '<=', request('since'));
}

if (request()->input('name')) {
    // example.org/?name=0
    // fails to apply query filter because evaluates to false
    $query->where('name', request('name'));
}

if (request()->filled('key')) {
    // correct way to check if get parameter has value
}
```

Tip given by [@mc0de](https://twitter.com/mc0de/status/1465209203472146434)

### Dust out your bloated route file

Dust out your bloated route file and split it up to keep things organized

```php
class RouteServiceProvider extends ServiceProvider
{
    public function boot()
    {
        $this->routes(function () {
            Route::prefix('api/v1')
                ->middleware('api')
                ->namespace($this->namespace)
                ->group(base_path('routes/api.php'));

            Route::prefix('webhooks')
                ->namespace($this->namespace)
                ->group(base_path('routes/webhooks.php'));

            Route::middleware('web')
                ->namespace($this->namespace)
                ->group(base_path('routes/web.php'));

            if ($this->app->environment('local')) {
                Route::middleware('web')
                    ->namespace($this->namespace)
                    ->group(base_path('routes/local.php'));
            }
        });
    }
}
```

Tip given by [@Philo01](https://twitter.com/Philo01/status/1466068376330153984)

### You can send e-mails to a custom log file

In Laravel you can send e-mails to a custom log file.

You can set your environment variables like this:

```
MAIL_MAILER=log
MAIL_LOG_CHANNEL=mail
```

And also configure your log channel:

```php
'mail' => [
    'driver' => 'single',
    'path' => storage_path('logs/mails.log'),
    'level' => env('LOG_LEVEL', 'debug'),
],
```

Now you have all your e-mails in /logs/mails.log<br>
It's a good use case to quickly test your mails.

Tip given by [@mmartin_joo](https://twitter.com/mmartin_joo/status/1466362508571131904)

### Markdown made easy

Laravel provides an interface to convert markdown in HTML out of the box, without the need to install new composer packages.

```php
$html = Str::markdown('# Changelogfy')
```

Output:

```
<h1>Changelogfy</h1>
```

Tip given by [@paulocastellano](https://twitter.com/paulocastellano/status/1467478502400315394)

### Simplify if on a request with whenFilled() helper

We often write if statements to check if a value is present on a request or not.<br>
You can simplify it with the `whenFilled()` helper.

```php
public function store(Request $request)
{
    $request->whenFilled('status', function (string $status)) {
        // Do something amazing with the status here!
    }, function () {
        // This it called when status is not filled
    });
}
```

Tip given by [@mmartin_joo](https://twitter.com/mmartin_joo/status/1467886802711293959)

### Pass arguments to middleware

You can pass arguments to your middleware for specific routes by appending ':' followed by the value. For example, I'm enforcing different authentication methods based on the route using a single middleware.

```php
Route::get('...')->middleware('auth.license');
Route::get('...')->middleware('auth.license:bearer');
Route::get('...')->middleware('auth.license:basic');
```

```php
class VerifyLicense
{
    public function  handle(Request $request, Closure $next, $type = null)
    {
        $licenseKey  = match ($type) {
            'basic'  => $request->getPassword(),
            'bearer' => $request->bearerToken(),
            default  => $request->get('key')
        };

        // Verify license and return response based on the authentication type
    }
}
```

Tip given by [@Philo01](https://twitter.com/Philo01/status/1471864630486179840)

### Get value from session and forget

If you need to grab something from the Laravel session, then forget it immediately, consider using `session()->pull($value)`. It completes both steps for you.

```php
// Before
$path = session()->get('before-github-redirect', '/components');

session()->forget('before-github-redirect');

return redirect($path);

// After
return redirect(session()->pull('before-github-redirect', '/components'))
```

Tip given by [@jasonlbeggs](https://twitter.com/jasonlbeggs/status/1471905631619715077)

### $request->date() method

New in this week's Laravel v8.77: `$request->date()` method.<br>
Now you don't need to call Carbon manually, you can do something like: `$post->publish_at = $request->date('publish_at')->addHour()->startOfHour();`<br>
[Link to full pr](https://github.com/laravel/framework/pull/39945) by [@DarkGhostHunter](https://twitter.com/DarkGhostHunter)

### Use through instead of map when using pagination

When you want to map paginated data and return only a subset of the fields, use `through` rather than `map`. The `map` breaks the pagination object and changes it's identity. While, `through` works on the paginated data itself

```php
// Don't: Mapping paginated data
$employees = Employee::paginate(10)->map(fn ($employee) => [
    'id' => $employee->id,
    'name' => $employee->name
])

// Do: Mapping paginated data
$employees = Employee::paginate(10)->through(fn ($employee) => [
    'id' => $employee->id,
    'name' => $employee->name
])
```

Tip given by [@bhaidar](https://twitter.com/bhaidar/status/1475073910383120399)

### Quickly add a bearer token to HTTP request

There’s a `withToken` method to attach the `Authorization` header to a request.

```php
// Booo!
Http::withHreader([
    'Authorization' => 'Bearer dQw4w9WgXcq'
])

// YES!
Http::withToken('dQw4w9WgXcq');
```

Tip given by [@p3ym4n](https://twitter.com/p3ym4n/status/1487809735663489024)

### Copy file or all files from a folder

You can use the `readStream` and `writeStream` to copy a file (or all files from a folder) from one disk to another keeping the memory usage low.

```php
// List all the files from a folder
$files = Storage::disk('origin')->allFiles('/from-folder-name');

// Using normal get and put (the whole file string at once)
foreach($files as $file) {
    Storage::disk('destination')->put(
        "optional-folder-name" . basename($file),
        Storage::disk('origin')->get($file)
    );
}

// Best: using Streams to keep memory usage low (good for large files)
foreach ($files as $file) {
    Storage::disk('destination')->writeStream(
        "optional-folder-name" . basename($file),
        Storage::disk('origin')->readStream($file)
    );
}
```

Tip given by [@alanrezende](https://twitter.com/alanrezende/status/1488194257567498243)

### Sessions has() vs exists() vs missing()

Do you know about `has`, `exists` and `missing` methods in Laravel session?

```php
// The has method returns true if the item is present & not null.
$request->session()->has('key');

// THe exists method returns true if the item ir present, event if its value is null
$request->session()->exists('key');

// THe missing method returns true if the item is not present or if the item is null
$request->session()->missing('key');
```

Tip given by [@iamharis010](https://twitter.com/iamharis010/status/1489086240729145344)

### Test that you are passing the correct data to a view

Need to test that you are passing the correct data to a view? You can use the viewData method on your response. Here are some examples:

```php
/** @test */
public function it_has_the_correct_value()
{
    // ...
    $response = $this->get('/some-route');
    $this->assertEquals('John Doe', $response->viewData('name'));
}

/** @test */
public function it_contains_a_given_record()
{
    // ...
    $response = $this->get('/some-route');
    $this->assertTrue($response->viewData('users')->contains($userA));
}

/** @test */
public function it_returns_the_correct_amount_of_records()
{
    // ...
    $response = $this->get('/some-route');
    $this->assertCount(10, $response->viewData('users'));
}
```

Tip given by [@JuanRangelTX](https://twitter.com/JuanRangelTX/status/1489944361580351490)

### Use Redis to track page views

Tracking something like page views with MySQL can be quite a performance hit when dealing with high traffic. Redis is much better at this. You can use Redis and a scheduled command to keep MySQL in sync on a fixed interval.

```php
Route::get('{project:slug', function (Project $project) {
    // Instead of $project->increment('views') we use Redis
    // We group the views by the project id
    Redis::hincrby('project-views', $project->id, 1);
})
```

```php
// Console/Kernel.php
$schedule->command(UpdateProjectViews::class)->daily();

// Console/Commands/UpdateProjectViews.php
// Get all views from our Redis instance
$views = Redis::hgetall('project-views');

/*
[
    (id) => (views)
    1 => 213,
    2 => 100,
    3 => 341
]
 */

// Loop through all project views
foreach ($views as $projectId => $projectViews) {
    // Increment the project views on our MySQL table
    Project::find($projectId)->increment('views', $projectViews);
}

// Delete all the views from our Redis instance
Redis::del('project-views');
```

Tip given by [@Philo01](https://twitter.com/JackEllis/status/1491909483496411140)

### to_route() helper function

Laravel 9 provides shorter version of `response()->route()`, take a look on the following code:

```php
// Old way
Route::get('redirectRoute', function() {
    return redirect()->route('home');
});

// Post Laravel 9
Route::get('redirectRoute', function() {
    return to_route('home');
});

```

This helper work in the same way as `redirect()->route('home')`, but it is more concise than a old way.

Tip given by [@CatS0up](https://github.com/CatS0up)

### Pause a long running job when queue worker shuts down

When running a long job, if your queue worker gets shutdown by

- Stopping the worker.
- Sending signal **SIGTERM** (**SIGINT** for Horizon).
- Pressing `CTRL + C` (Linux/Windows).

Then the job process may get corrupted while it is doing something.

By checking with `app('queue.worker')->shouldQuit`, we can determine if the worker is shutting down. This way, we can save the current process and requeue the job so that when the queue worker runs again, it can resume from where it left.

This is very useful in the Containerized world (Kubernetes, Docker etc.) where the container gets destroyed and re-created anytime.

```php
<?php

namespace App\Jobs;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class MyLongJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $timeout = 3600;

    private const CACHE_KEY = 'user.last-process-id';

    public function handle()
    {
        $processedUserId = Cache::get(self::CACHE_KEY, 0); // Get last processed item id
        $maxId = Users::max('id');

        if ($processedUserId >= $maxId) {
            Log::info("All users have already been processed!");
            return;
        }

        while ($user = User::where('id', '>', $processedUserId)->first()) {
            Log::info("Processing User ID: {$user->id}");

            // Your long work here to process user
            // Ex. Calling Billing API, Preparing Invoice for User etc.

            $processedUserId = $user->id;
            Cache::put(self::CACHE_KEY, $processedUserId, now()->addSeconds(3600)); // Updating last processed item id

            if (app('queue.worker')->shouldQuit) {
                $this->job->release(60); // Requeue the job with delay of 60 seconds
                break;
            }
        }

        Log::info("All users have processed successfully!");
    }
}
```

Tip given by [@a-h-abid](https://github.com/a-h-abid)

### Freezing Time in Laravel Tests

In your Laravel tests, you might sometimes need to freeze the time.

This is particularly useful if you're trying to make assertions based on timestamps or need to make queries based on dates and/or times.

```php
// To freeze the time, you used to be able to write this at the time top of your tests:
Carbon::setTestNow(Carbon::now());
// You could also use the "travelTo" method:
$this->travelTo(Carbon::now());
// You can now use the new "freezeTime" method to keep your code readable and obvious:
$this->freezeTime();
```

Tip given by [@AshAllenDesign](https://twitter.com/AshAllenDesign/status/1509115721183158272)

### New squish helper

New in Laravel from 9.7 `squish` helper.

```php
$result = Str::squish(' Hello   John,         how   are   you?    ');
// Hello John, how are you?
```

Tip given by [@mattkingshott](https://twitter.com/mattkingshott/status/1511718052752150534)

### Specify what to do if a scheduled task fails or succeeds

You can specify what to do if a scheduled task fails or succeeds.

```php
$schedule->command('emails:send')
        ->daily()
        ->onSuccess(function () {
            // The task succeeded
        })
        ->onFailure(function () {
            // The task failed
        });
```

Tip given by [@cosmeescobedo](https://twitter.com/cosmeescobedo/status/1513221529072414720)

### Scheduled command on specific environments

Running Laravel scheduled command on specific environments.

```php
// Not good
if (app()->environment('production', 'staging')) {
    $schedule->command('emails:send')
        ->daily();
}
// Better
$schedule->command('emails:send')
        ->daily()
        ->onEnvironment(['production', 'staging']);
```

Tip given by [@nguyenduy4994](https://twitter.com/nguyenduy4994/status/1516960273000587265)

### Add conditionable behavior to your own classes

You can use the [Conditionable Trait](https://laravel.com/api/9.x/Illuminate/Support/Traits/Conditionable.html) to avoid using `if/else` and promote method chaining.

```php
<?php

namespace App\Services;

use Illuminate\Support\Traits\Conditionable;

class MyService
{
    use Conditionable;

    // ...
}
```

```php
<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\MyRequest;
use App\Services\MyService;

class MyController extends Controller
{
    public function __invoke(MyRequest $request, MyService $service)
    {
        // Not good
        $service->addParam($request->param);

        if ($request->has('something')) {
            $service->methodToBeCalled();
        }

        $service->execute();
        // ---

        // Better
        $service->addParam($request->param)
            ->when($request->has('something'), fn ($service) => $service->methodToBeCalled())
            ->execute();
        // ---

        // ...
    }
}
```

### run-jobs-in-sequence

Sometimes we want to run jobs in a squence for this purpose we need to use `Illuminate\Bus\Batchable` in job ;

```php
<?php

namespace App\Jobs\Invoice;

use Illuminate\Bus\Batchable;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class CalculateSingleConsignment implements ShouldQueue
{
    use Batchable, Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */

    public function __construct()
    {


    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {


    }

}


```

There are two methods to do it

Method #1
You can add job one by one in batch with help of Loop

```php
 $batch =  Bus::batch([])->dispatch();
 foreach ($consignments as  $consignment) {
    $batch->add(new CalculateSingleConsignment($consignment));
 }
```

Method #2
You can make an array and push it in batch

```php
$batch = Bus::batch([
    new ImportCsv(1, 100),
    new ImportCsv(101, 200),
    new ImportCsv(201, 300),
    new ImportCsv(301, 400),
    new ImportCsv(401, 500),
])->then(function(){
    // After Job complete
})->catch(function(){
    //if errror happens
})->finally(function(){
    // After Bacth is complete
})->dispatch();
```

### perform-action-when-job-is-failed

In some cases we want to perform some action when job is failed. For Eample send and Email or a Notification

for this purpose we need to use failed method in job just like handle function

```php


namespace App\Jobs\Invoice;
use Illuminate\Bus\Batchable;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;


class CalculateSingleConsignment implements ShouldQueue
{
    use Batchable, Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct()
    {


    }


    public function handle()
    {

    }

    public function failed()
    {

        // Perfomen any Action here when job is failed
     }
}

```

Tip given by [@pauloimon](https://github.com/pauloimon)
