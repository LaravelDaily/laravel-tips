## Mail

⬆️ [Go to main menu](README.md#laravel-tips) ⬅️ [Previous (Auth)](Auth.md) ➡️ [Next (Artisan)](Artisan.md)

- [Testing email into laravel.log](#testing-email-into-laravellog)
- [Preview Mailables](#preview-mailables)
- [Preview Mail without Mailables](#preview-mail-without-mailables)
- [Default Email Subject in Laravel Notifications](#default-email-subject-in-laravel-notifications)
- [Send Notifications to Anyone](#send-notifications-to-anyone)
- [Set conditional object properties](#set-conditional-object-properties)

### Testing email into laravel.log

If you want to test email contents in your app but unable or unwilling to set up something like Mailgun, use `.env` parameter `MAIL_DRIVER=log` and all the email will be saved into `storage/logs/laravel.log` file, instead of actually being sent.

### Preview Mailables

If you use Mailables to send email, you can preview the result without sending, directly in your browser. Just return a Mailable as route result:

```php
Route::get('/mailable', function () {
    $invoice = App\Invoice::find(1);
    return new App\Mail\InvoicePaid($invoice);
});
```

### Preview Mail without Mailables

You can also preview your email without Mailables. For instance, when you are creating notification, you can specify the markdown that may be use for your mail notification.

```php
use Illuminate\Notifications\Messages\MailMessage;

Route::get('/mailable', function () {
    $invoice = App\Invoice::find(1);
    return (new MailMessage)->markdown('emails.invoice-paid', compact('invoice'));
});
```

You may also use other methods provided by `MailMessage` object such as `view` and others.

Tip given by [@raditzfarhan](https://github.com/raditzfarhan)

### Default Email Subject in Laravel Notifications

If you send Laravel Notification and don't specify subject in **toMail()**, default subject is your notification class name, CamelCased into Spaces.

So, if you have:

```php
class UserRegistrationEmail extends Notification {
    //
}
```

Then you will receive an email with subject **User Registration Email**.

### Send Notifications to Anyone

You can send Laravel Notifications not only to a certain user with `$user->notify()`, but also to anyone you want, via `Notification::route()`, with so-called "on-demand" notifications:

```php
Notification::route('mail', 'taylor@example.com')
        ->route('nexmo', '5555555555')
        ->route('slack', 'https://hooks.slack.com/services/...')
        ->notify(new InvoicePaid($invoice));
```

### Set conditional object properties

You can use the `when()` or `unless()` methods in your MailMessage notifications to set conditional object properties like a call to action.

```php
class InvoicePaid extends Notification
{
    public function toMail(User $user)
    {
        return (new MailMessage)
            ->success()
            ->line('We've received your payment)
            ->when($user->isOnMonthlyPaymentPlan(), function (MailMessage $message) {
                $message->action('Save 20% by paying yearly', route('account.billing'));
            })
            ->line('Thank you for using Unlock.sh');
    }
}
```

Use the `when` or `unless` methods in you own classes by using the `Illuminate\Support\Traits\Conditionable` trait

Tip given by [@Philo01](https://twitter.com/Philo01/status/1503302749525528582)
