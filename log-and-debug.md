## Log and debug

⬆️ [Go to main menu](README.md#laravel-tips) ⬅️ [Previous (Factories)](factories.md) ➡️ [Next (API)](api.md)

- [Logging with parameters](#logging-with-parameters)
- [Log Long Running Laravel Queries](#log-long-running-laravel-queries)
- [Benchmark class](#benchmark-class)
- [More convenient DD](#more-convenient-dd)
- [Log with context](#log-with-context)
- [Quickly output an Eloquent query in its SQL form](#quickly-output-an-eloquent-query-in-its-sql-form)
- [Log all the database queries during development](#log-all-the-database-queries-during-development)
- [Discover all events fired in one request](#discover-all-events-fired-in-one-request)

### Logging with parameters

You can write `Log::info()`, or shorter `info()` message with additional parameters, for more context about what happened.

```php
Log::info('User failed to login.', ['id' => $user->id]);
```

### Log Long Running Laravel Queries

```php
DB::enableQueryLog();

DB::whenQueryingForLongerThen(1000, function ($connection) {
     Log::warning(
          'Long running queries have been detected.',
          $connection->getQueryLog()
     );
});
```

Tip given by [@realstevebauman](https://twitter.com/realstevebauman/status/1576980397552185344)

### Benchmark class

In Laravel 9.32 we have a Benchmark class that can measure the time of any task.

It's a pretty useful helper:
```php
class OrderController
{
     public function index()
     {
          return Benchmark::measure(fn () => Order::all()),
     }
}
```

Tip given by [@mmartin_joo](https://twitter.com/mmartin_joo/status/1583096196494553088)

### More convenient DD

Instead of doing `dd($result)` you can put `->dd()` as a method directly at the end of your Eloquent sentence, or any Collection.

```php
// Instead of
$users = User::where('name', 'Taylor')->get();
dd($users);
// Do this
$users = User::where('name', 'Taylor')->get()->dd();
```

### Log with context

New in Laravel 8.49: `Log::withContext()` will help you to differentiate the Log messages between different requests.

If you create a Middleware and set this context, all Log messages will contain that context, and you'll be able to search them easier.

```php
public function handle(Request $request, Closure $next)
{
    $requestId = (string) Str::uuid();

    Log::withContext(['request-id' => $requestId]);

    $response = $next($request);

    $response->header('request-id', $requestId);

    return $response;
}
```

### Quickly output an Eloquent query in its SQL form

If you want to quickly output an Eloquent query in its SQL form, you can invoke the toSql() method onto it like so

```php
$invoices = Invoice::where('client', 'James pay')->toSql();

dd($invoices)
// select * from `invoices` where `client` = ?
```

Tip given by [@devThaer](https://twitter.com/devThaer/status/1438816135881822210)

### Log all the database queries during development

If you want to log all the database queries during development add this snippet to your AppServiceProvider

```php
public function boot()
{
    if (App::environment('local')) {
        DB::listen(function ($query) {
            logger(Str::replaceArray('?', $query->bindings, $query->sql));
        });
    }
}
```

Tip given by [@mmartin_joo](https://twitter.com/mmartin_joo/status/1473262634405449730)

### Discover all events fired in one request

If you want to implement a new listener to a specific event but you don't know its name, you can log all events fired during the request.

You can use the `\Illuminate\Support\Facades\Event::listen()` method on `boot()` method of `app/Providers/EventServiceProvider.php` to catch all events fired.

**Important:** If you use the `Log` facade within this event listener then you will need to exclude events named `Illuminate\Log\Events\MessageLogged` to avoid an infinite loop. 
(Example: `if ($event == 'Illuminate\\Log\\Events\\MessageLogged') return;`)

```php
// Include Event...
use Illuminate\Support\Facades\Event;

// In your EventServiceProvider class...
public function boot()
{
    parent::boot();

    Event::listen('*', function ($event, array $data) {
        // Log the event class
        error_log($event);

        // Log the event data delegated to listener parameters
        error_log(json_encode($data, JSON_PRETTY_PRINT));
    });
}
```

Tip given by [@MuriloChianfa](https://github.com/MuriloChianfa)
