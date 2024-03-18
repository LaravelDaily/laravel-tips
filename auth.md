## Auth

⬆️ [Go to main menu](README.md#laravel-tips) ⬅️ [Previous (Collections)](collections.md) ➡️ [Next (Mail)](mail.md)

- [Check Multiple Permissions at Once](#check-multiple-permissions-at-once)
- [Authenticate users with more options](#authenticate-users-with-more-options)
- [More Events on User Registration](#more-events-on-user-registration)
- [Did you know about Auth::once()?](#did-you-know-about-authonce)
- [Change API Token on users password update](#change-api-token-on-users-password-update)
- [Override Permissions for Super Admin](#override-permissions-for-super-admin)
- [Multi-Authentication for Different User Types](#multi-authentication-for-different-user-types)

### Check Multiple Permissions at Once

In addition to `@can` Blade directive, did you know you can check multiple permissions at once with `@canany` directive?

```blade
@canany(['update', 'view', 'delete'], $post)
    // The current user can update, view, or delete the post
@elsecanany(['create'], \App\Post::class)
    // The current user can create a post
@endcanany
```

### Authenticate users with more options

If you only want to authenticate users that are also "activated", for example, it's as simple as passing an extra argument to `Auth::attempt()`.

No need for complex middleware or global scopes.

```php
Auth::attempt(
    [
        ...$request->only('email', 'password'),
        fn ($query) => $query->whereNotNull('activated_at')
    ],
    $this->boolean('remember')
);
```

Tip given by [@LukeDowning19](https://twitter.com/LukeDowning19)

### More Events on User Registration

Want to perform some actions after new user registration? Head to `app/Providers/EventServiceProvider.php` and add more Listeners classes, and then in those classes implement `handle()` method with `$event->user` object

```php
class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,

            // You can add any Listener class here
            // With handle() method inside of that class
        ],
    ];
```

### Did you know about Auth::once()?

You can login with user only for ONE REQUEST, using method `Auth::once()`.
No sessions or cookies will be utilized, which means this method may be helpful when building a stateless API.

```php
if (Auth::once($credentials)) {
    //
}
```

### Change API Token on users password update

It's convenient to change the user's API Token when its password changes.

Model:

```php
protected function password(): Attribute
{
    return Attribute::make(
            set: function ($value, $attributes) {
                $value = $value;
                $attributes['api_token'] = Str::random(100);
            }
        );
}
```

### Override Permissions for Super Admin

If you've defined your Gates but want to override all permissions for SUPER ADMIN user, to give that superadmin ALL permissions, you can intercept gates with `Gate::before()` statement, in `AuthServiceProvider.php` file.

```php
// Intercept any Gate and check if it's super admin
Gate::before(function($user, $ability) {
    if ($user->is_super_admin == 1) {
        return true;
    }
});

// Or if you use some permissions package...
Gate::before(function($user, $ability) {
    if ($user->hasPermission('root')) {
        return true;
    }
});
```

If you want to do something in your Gate when there is no user at all, you need to add a type hint for `$user` allowing it to be `null`. For example, if you have a role called Anonymous for your non-logged-in users:

```php
Gate::before(function (?User $user, $ability) {
    if ($user === null) {
        $role = Role::findByName('Anonymous');
        return $role->hasPermissionTo($ability) ? true : null;
    }
    return $user->hasRole('Super Admin') ? true : null;
});
```

### Multi-Authentication for Different User Types

You can leverage Laravel's built-in "guards" and "providers" configuration to customize authentication for different user types or models.

For example, if you have multiple user types like "User" and "Admin", each requiring different authentication logic, you can define separate guards and providers for them in the config/auth.php file.

Here's a basic example:
```php
// config/auth.php

'guards' => [
    'web' => [
        'driver' => 'session',
        'provider' => 'users',
    ],

    'api' => [
        'driver' => 'token',
        'provider' => 'users',
    ],

    'admin' => [
        'driver' => 'session',
        'provider' => 'admins',
    ],
],

'providers' => [
    'users' => [
        'driver' => 'eloquent',
        'model' => App\Models\User::class,
    ],

    'admins' => [
        'driver' => 'eloquent',
        'model' => App\Models\Admin::class,
    ],
],
```

With this setup, you can authenticate regular users using the 'web' guard and the 'users' provider and authenticate administrators using the 'admin' guard and the 'admins' provider.

Then, in your controllers or routes, you can specify which guard to use for authentication:
```php
// Regular user authentication
if (Auth::guard('web')->attempt($credentials)) {
    // Authentication passed
}

// Admin authentication
if (Auth::guard('admin')->attempt($credentials)) {
    // Authentication passed
}

// Routes:
Route::middleware(['auth:web'])->group(function () {
    // Routes accessible to regular users
});

Route::middleware(['auth:admin'])->group(function () {
    // Routes accessible to administrators
});
```
