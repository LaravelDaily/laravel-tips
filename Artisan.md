## Artisan

⬆️ [Go to main menu](README.md#laravel-tips) ⬅️ [Previous (Mail)](Mail.md) ➡️ [Next (Factories)](Factories.md)

- [Artisan command parameters](#artisan-command-parameters)
- [Maintenance Mode](#maintenance-mode)
- [Artisan command help](#artisan-command-help)
- [Exact Laravel version](#exact-laravel-version)
- [Launch Artisan command from anywhere](#launch-artisan-command-from-anywhere)
- [Hide your custom command](#hide-your-custom-command)
- [Skip method](#skip-method)

### Artisan command parameters

When creating Artisan command, you can ask the input in variety of ways: `$this->confirm()`, `$this->anticipate()`, `$this->choice()`.

```php
// Yes or no?
if ($this->confirm('Do you wish to continue?')) {
    //
}

// Open question with auto-complete options
$name = $this->anticipate('What is your name?', ['Taylor', 'Dayle']);

// One of the listed options with default index
$name = $this->choice('What is your name?', ['Taylor', 'Dayle'], $defaultIndex);
```

### Maintenance Mode

If you want to enable maintenance mode on your page, execute the down Artisan command:

```bash
php artisan down
```

Then people would see default 503 status page.

You may also provide flags, in Laravel 9:

- the path the user should be redirected to
- the view that should be prerendered
- secret phrase to bypass maintenance mode
- retry page reload every X seconds

```bash
php artisan down --redirect="/" --render="errors::503" --secret="1630542a-246b-4b66-afa1-dd72a4c43515" --retry=60
```

Before Laravel 8:

- message that would be shown
- retry page reload every X seconds
- still allow the access to some IP address

```bash
php artisan down --message="Upgrading Database" --retry=60 --allow=127.0.0.1
```

When you've done the maintenance work, just run:

```bash
php artisan up
```

### Artisan command help

To check the options of artisan command, Run artisan commands with `--help` flag. For example, `php artisan make:model --help` and see how many options you have:

```
Options:
  -a, --all             Generate a migration, seeder, factory, and resource controller for the model
  -c, --controller      Create a new controller for the model
  -f, --factory         Create a new factory for the model
      --force           Create the class even if the model already exists
  -m, --migration       Create a new migration file for the model
  -s, --seed            Create a new seeder file for the model
  -p, --pivot           Indicates if the generated model should be a custom intermediate table model
  -r, --resource        Indicates if the generated controller should be a resource controller
      --api             Indicates if the generated controller should be an API controller
  -h, --help            Display this help message
  -q, --quiet           Do not output any message
  -V, --version         Display this application version
      --ansi            Force ANSI output
      --no-ansi         Disable ANSI output
  -n, --no-interaction  Do not ask any interactive question
      --env[=ENV]       The environment the command should run under
  -v|vv|vvv, --verbose  Increase the verbosity of messages: 1 for normal output, 2 for more verbose output and 3 for debug
```

### Exact Laravel version

Find out exactly what Laravel version you have in your app, by running command
`php artisan --version`

### Launch Artisan command from anywhere

If you have an Artisan command, you can launch it not only from Terminal, but also from anywhere in your code, with parameters. Use Artisan::call() method:

```php
Route::get('/foo', function () {
    $exitCode = Artisan::call('email:send', [
        'user' => 1, '--queue' => 'default'
    ]);

    //
});
```

### Hide your custom command

If you don't want to show a specific command on the artisan command list, set `hidden` property to `true`

```php
class SendMail extends Command
{
    protected $signature = 'send:mail';
    protected $hidden = true;
}
```

You won't see `send:mail` on the available commands if you typed `php artisan`

Tip given by [@sky_0xs](https://twitter.com/sky_0xs/status/1487921500023832579)

### Skip method

Laravel the skip method in scheduler

You can use `skip` in your commands to skip an execution

```php
$schedule->command('emails:send')->daily()->skip(function () {
    return Calendar::isHoliday();
});
```

Tip given by [@cosmeescobedo](https://twitter.com/cosmeescobedo/status/1494503181438492675)
