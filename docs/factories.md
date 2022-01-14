# Factories

[[TOC]]

## Factory callbacks

While using factories for seeding data, you can provide Factory Callback functions to perform some action after record is inserted.

```php
$factory->afterCreating(App\User::class, function ($user, $faker) {
    $user->accounts()->save(factory(App\Account::class)->make());
});
```

## Generate Images with Seeds/Factories

Did you know that Faker can generate not only text values but also IMAGES? See `avatar` field here - it will generate 50x50 image:

```php
$factory->define(User::class, function (Faker $faker) {
    return [
        'name' => $faker->name,
        'email' => $faker->unique()->safeEmail,
        'email_verified_at' => now(),
        'password' => bcrypt('password'),
        'remember_token' => Str::random(10),
        'avatar' => $faker->image(storage_path('images'), 50, 50)
    ];
});
```

## Override values and apply custom login to them

When creating records with Factories, you can use Sequence class to override some values and apply custom logic to them.

```php
$users = User::factory()
			->count(10)
			->state(new Sequence(
				['admin' => 'Y'],
				['admin' => 'N'],
			))
			->create();
```

## Using factories with relationships

When using factories with relationships, Laravel also provides magic methods.

```php
// magic factory relationship methods
User::factory()->hasPosts(3)->create();

// instead of
User::factory()->has(Post::factory()->count(3))->create();
```

Tip given by [@oliverds_](https://twitter.com/oliverds_/status/1441447356323430402)

## Create models without dispatching any events

Sometimes you may wish to `update` a given model without dispatching any events. You may accomplish this using the `updateQuietly` method

```php
Post::factory()->createOneQuietly();

Post::factory()->count(3)->createQuietly();

Post::factory()->createManyQuietly([
    ['message' => 'A new comment'],
    ['message' => 'Another new comment'],
]);
```

## Useful for() method

The Laravel factory has a very useful `for()` method. You can use it to create `belongsTo()` relationships.

```php
public function run()
{
    Product::factory()
        ->count(3);
        ->for(Category::factory()->create())
        ->create();    
}
```

Tip given by [@mmartin_joo](https://twitter.com/mmartin_joo/status/1461002439629361158)
