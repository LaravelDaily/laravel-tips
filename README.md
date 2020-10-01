# Laravel Tips

Awesome Laravel tips and tricks for all artisans. PR and ideas are welcome!  
An idea by [PovilasKorop](https://github.com/PovilasKorop) and [MarceauKa](https://github.com/MarceauKa).

__Update 01 Okt 2020__: Currently there are __112 tips__ divided into 14 sections.

## Table of Contents

- [DB Models and Eloquent](#db-models-and-eloquent) (28 tips)
- [Models Relations](#models-relations) (21 tips)
- [Migrations](#migrations) (5 tips)
- [Views](#views) (8 tips)
- [Routing](#routing) (9 tips)
- [Validation](#validation) (7 tips)
- [Collections](#collections) (4 tips)
- [Auth](#auth) (5 tips)
- [Mail](#mail) (4 tips)
- [Artisan](#artisan) (5 tips)
- [Factories](#factories) (2 tips)
- [Log and debug](#log-and-debug) (2 tips)
- [API](#api) (2 tips)
- [Other](#other) (10 tips)


## DB Models and Eloquent

⬆️ [Go to top](#summary) ➡️ [Next (Models Relations)](#models-relations)

- [Eloquent where date methods](#eloquent-where-date-methods)
- [Increments and decrements](#increments-and-decrements)
- [No timestamp columns](#no-timestamp-columns)
- [Set logged in user with Observers](#set-logged-in-user-with-observers)
- [Soft-deletes: multiple restore](#soft-deletes-multiple-restore)
- [Model all: columns](#model-all-columns)
- [To Fail or not to Fail](#to-fail-or-not-to-fail)
- [Column name change](#column-name-change)
- [Map query results](#map-query-results)
- [Change Default Timestamp Fields](#change-default-timestamp-fields)
- [Quick Order by created_at](#quick-order-by-created_at)
- [Automatic Column Value When Creating Records](#automatic-column-value-when-creating-records)
- [DB Raw Query Calculations Run Faster](#db-raw-query-calculations-run-faster)
- [More than One Scope](#more-than-one-scope)
- [No Need to Convert Carbon](#no-need-to-convert-carbon)
- [Grouping by First Letter](#grouping-by-first-letter)
- [Never Update the Column](#never-update-the-column)
- [Find Many](#find-many)
- [Use UUID instead of auto-increment](#use-uuid-instead-of-auto-increment)
- [Sub-selects in Laravel Way](#sub-selects-in-laravel-way)
- [Hide Some Columns](#hide-some-columns)
- [Exact DB Error](#exact-db-error)
- [Soft-Deletes with Query Builder](#soft-deletes-with-query-builder)
- [Good Old SQL Query](#good-old-sql-query)
- [Use DB Transactions](#use-db-transactions)
- [Update or Create](#update-or-create)
- [Forget Cache on Save](#forget-cache-on-save)
- [Auto Change Format of Created_at and Updated_at](#auto-change-format-of-created_at-and-updated_at)

### Eloquent where date methods

In Eloquent, check the date with functions `whereDay()`, `whereMonth()`, `whereYear()`, `whereDate()` and `whereTime()`.

```php
$products = Product::whereDate('created_at', '2018-01-31')->get();
$products = Product::whereMonth('created_at', '12')->get();
$products = Product::whereDay('created_at', '31')->get();
$products = Product::whereYear('created_at', date('Y'))->get();
$products = Product::whereTime('created_at', '=', '14:13:58')->get();
```

### Increments and decrements

If you want to increment some DB column in some table, just use `increment()` function. Oh, and you can increment not only by 1, but also by some number, like 50.

```php
Post::find($post_id)->increment('view_count');
User::find($user_id)->increment('points', 50);
```

### No timestamp columns

If your DB table doesn't contain timestamp fields `created_at` and `updated_at`, you can specify that Eloquent model wouldn't use them, with `$timestamps = false` property.

```php
class Company extends Model
{
    public $timestamps = false;
}
```

### Set logged in user with Observers

Use `make:observer` and fill in `creating()` method to automatically set up `user_id` field for current logged in user.

```php
class PostObserver
{
    public function creating(Post $post)
    {
        $post->user_id = auth()->id();
    }
}
```

### Soft-deletes: multiple restore

When using soft-deletes, you can restore multiple rows in one sentence.

```php
Post::withTrashed()->where('author_id', 1)->restore();
```

### Model all: columns

When calling Eloquent's `Model::all()`, you can specify which columns to return.

```php
$users = User::all(['id', 'name', 'email']);
```

### To Fail or not to Fail

In addition to `findOrFail()`, there's also Eloquent method `firstOrFail()` which will return 404 page if no records for query are found.

```php
$user = User::where('email', 'povilas@laraveldaily.com')->firstOrFail();
```

### Column name change

In Eloquent Query Builder, you can specify "as" to return any column with a different name, just like in plain SQL query.

```php
$users = DB::table('users')->select('name', 'email as user_email')->get();
```

### Map query results

After Eloquent query you can modify rows by using `map()` function in Collections.

```php
$users = User::where('role_id', 1)->get()->map(function (User $user) {
    $user->some_column = some_function($user);
    return $user;
});
```

### Change Default Timestamp Fields

What if you’re working with non-Laravel database and your timestamp columns are named differently? Maybe, you have create_time and update_time. Luckily, you can specify them in the model, too:

```php
class Role extends Model
{
    const CREATED_AT = 'create_time';
    const UPDATED_AT = 'update_time';
}
```

### Quick Order by created_at

Instead of:
```php
User::orderBy('created_at', 'desc')->get();
```

You can do it quicker:
```php
User::latest()->get();
```

By default, `latest()` will order by `created_at`.

There is an opposite method `oldest()` which would order by `created_at` ascending:
```php
User::oldest()->get();
```

Also, you can specify another column to order by. For example, if you want to use `updated_at`, you can do this:
```php
$lastUpdatedUser = User::latest('updated_at')->first();
```

### Automatic Column Value When Creating Records

If you want to generate some DB column value when creating record, add it to model's `boot()` method.
For example, if you have a field "position" and want to assign the next available position to the new record (like `Country::max('position') + 1)`, do this:

```php
class Country extends Model {
    protected static function boot()
    {
        parent::boot();

        Country::creating(function($model) {
            $model->position = Country::max('position') + 1;
        });
    }
}
```

### DB Raw Query Calculations Run Faster

Use SQL raw queries like `whereRaw()` method, to make some DB-specific calculations directly in query, and not in Laravel, usually the result will be faster. Like, if you want to get users that were active 30+ days after their registration, here's the code:

```php
User::where('active', 1)
    ->whereRaw('TIMESTAMPDIFF(DAY, created_at, updated_at) > ?', 30)
    ->get();
```

### More than One Scope

You can combine and chain Query Scopes in Eloquent, using more than one scope in a query.

Model:
```php
public function scopeActive($query) {
    return $query->where('active', 1);
}

public function scopeRegisteredWithinDays($query, $days) {
    return $query->where('created_at', '>=', now()->subDays($days));
}
```

Some Controller:
```php
$users = User::registeredWithinDays(30)->active()->get();
```

### No Need to Convert Carbon

If you're performing `whereDate()` and check today's records, you can use Carbon's `now()` and it will automatically be transformed to date. No need to do `->toDateString()`.

```php
// Instead of
$todayUsers = User::whereDate('created_at', now()->toDateString())->get();
// No need to convert, just use now()
$todayUsers = User::whereDate('created_at', now())->get();
```

### Grouping by First Letter

You can group Eloquent results by any custom condition, here's how to group by first letter of user's name:
```php
$users = User::all()->groupBy(function($item) {
    return $item->name[0];
});
```

### Never Update the Column

If you have DB column which you want to be set only once and never updated again, you can set that restriction on Eloquent Model, with a mutator:
```php
class User extends Model
{
    public function setEmailAttribute($value)
    {
        if ($this->email) {
            return;
        }

        $this->attributes['email'] = $value;
    }
}
```

### Find Many

Eloquent method `find()` may accept multiple parameters, and then it returns a Collection of all records found, not just one Model:
```php
// Will return Eloquent Model
$user = User::find(1);
// Will return Eloquent Collection
$users = User::find([1,2,3]);
```

### Use UUID instead of auto-increment

You don't want to use auto incrementing ID in your model?

Migration:
```php
Schema::create('users', function (Blueprint $table) {
    // $table->increments('id');
    $table->uuid('id')->unique();
});
```

Model:
```php
class User extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected static function boot()
    {
        parent::boot();

        User::creating(function ($model) {
            $model->setId();
        });
    }

    public function setId()
    {
        $this->attributes['id'] = Str::uuid();
    }
}
```

### Sub-selects in Laravel Way

From Laravel 6, you can use addSelect() in Eloquent statement, and do some calculation to that added column.

```php
return Destination::addSelect(['last_flight' => Flight::select('name')
    ->whereColumn('destination_id', 'destinations.id')
    ->orderBy('arrived_at', 'desc')
    ->limit(1)
])->get();
```

### Hide Some Columns

When doing Eloquent query, if you want to hide specific field from being returned, one of the quickest ways is to add `->makeHidden()` on Collection result.

```php
$users = User::all()->makeHidden(['email_verified_at', 'deleted_at']);
```

### Exact DB Error

If you want to catch Eloquent Query exceptions, use specific `QueryException` instead default Exception class, and you will be able to get the exact SQL code of the error.

```php
try {
    // Some Eloquent/SQL statement
} catch (\Illuminate\Database\QueryException $e) {
    if ($e->getCode() === '23000') { // integrity constraint violation
        return back()->withError('Invalid data');
    }
}
```

### Soft-Deletes with Query Builder

Don't forget that soft-deletes will exclude entries when you use Eloquent, but won't work if you use Query Builder.

```php
// Will exclude soft-deleted entries
$users = User::all();

// Will NOT exclude soft-deleted entries
$users = DB::table('users')->get();
```

### Good Old SQL Query

If you need to execute a simple SQL query, without getting any results - like changing something in DB schema, you can just do `DB::statement()`.

```
DB::statement('DROP TABLE users');
DB::statement('ALTER TABLE projects AUTO_INCREMENT=123');
```

### Use DB Transactions

If you have two DB operations performed, and second may get an error, then you should rollback the first one, right? 

For that, I suggest to use DB Transactions, it's really easy in Laravel:

```php
DB::transaction(function () {
    DB::table('users')->update(['votes' => 1]);

    DB::table('posts')->delete();
});
```

### Update or Create

If you need to check if the record exists, and then update it, or create a new record otherwise, you can do it in one sentence - use Eloquent method `updateOrCreate()`:

```php
// Instead of this
$flight = Flight::where('departure', 'Oakland')
    ->where('destination', 'San Diego')
    ->first();
if ($flight) {
    $flight->update(['price' => 99, 'discounted' => 1]);
} else {
	$flight = Flight::create([
	    'departure' => 'Oakland',
	    'destination' => 'San Diego',
	    'price' => 99,
	    'discounted' => 1
	]);
}
// Do it in ONE sentence
$flight = Flight::updateOrCreate(
    ['departure' => 'Oakland', 'destination' => 'San Diego'],
    ['price' => 99, 'discounted' => 1]
);
```

### Forget Cache on Save

Tip given by [@pratiksh404](https://github.com/pratiksh404)

If you have cache key like `posts` that gives collection, and you want to forget that cache key on new store or update, you can call static `saving` function on your model:

```php
class Post extends Model
{
    // Forget cache key on storing or updating
    public static function boot()
    {
        parent::boot();
        static::saving(function () {
           Cache::forget('posts');
        });
    }
}
```

### Auto Change Format Of Created_at and Updated_at

To change the format of `created_at` you can add a method in your model like this :
```
public function getCreatedAtAttribute()
{
   return \Carbon\Carbon::parse($this->attributes['created_at'])->format('H:i d, M Y');
}
```
It will return the `created_at` attribute like this : `04:19 23, Aug 2020`.

And also for changing format of `updated_at` attribute, you can add this method :
```
public function getUpdatedAtAttribute()
{
   return \Carbon\Carbon::parse($this->attributes['updated_at'])->format('H:i d, M Y');
}
```
It will return the `updated_at` attribute like this : `04:19 23, Aug 2020`.


## Models Relations

⬆️ [Go to top](#summary) ⬅️ [Previous (DB Models and Eloquent)](#db-models-and-eloquent) ➡️ [Next (Migrations)](#migrations)

- [OrderBy on Eloquent relationships](#orderby-on-eloquent-relationships)
- [Conditional relationships](#conditional-relationships)
- [Raw DB Queries: havingRaw()](#raw-db-queries-havingraw)
- [Eloquent has() deeper](#eloquent-has-deeper)
- [Has Many. How many exactly?](#has-many-how-many-exactly)
- [Default model](#default-model)
- [Use hasMany to create Many](#use-hasmany-to-create-many)
- [Eager Loading with Exact Columns](#eager-loading-with-exact-columns)
- [Touch parent updated_at easily](#touch-parent-updated_at-easily)
- [Always Check if Relationship Exists](#always-check-if-relationship-exists)
- [Use withCount() to Calculate Child Relationships Records](#use-withcount-to-calculate-child-relationships-records)
- [Extra Filter Query on Relationships](#extra-filter-query-on-relationships)
- [Load Relationships Always, but Dynamically](#load-relationships-always-but-dynamically)
- [Instead of belongsTo, use hasMany](#instead-of-belongsto-use-hasmany)
- [Rename Pivot Table](#rename-pivot-table)
- [Update Parent in One Line](#update-parent-in-one-line)
- [Laravel 7+ Foreign Keys](#laravel-7-foreign-keys)
- [Combine Two "whereHas"](#combine-two-wherehas)
- [Check if Relationship Method Exists](#check-if-relationship-method-exists)
- [Pivot Table with Extra Relations](#pivot-table-with-extra-relations)
- [Load Count on-the-fly](#load-count-on-the-fly)


### OrderBy on Eloquent relationships

You can specify orderBy() directly on your Eloquent relationships.

```php
public function products()
{
    return $this->hasMany(Product::class);
}

public function productsByName()
{
    return $this->hasMany(Product::class)->orderBy('name');
}
```

### Conditional relationships

If you notice that you use same relationship often with additional "where" condition, you can create a separate relationship method.

Model:
```php
public function comments()
{
    return $this->hasMany(Comment::class);
}

public function approved_comments()
{
    return $this->hasMany(Comment::class)->where('approved', 1);
}
```

### Raw DB Queries: havingRaw()

You can use RAW DB queries in various places, including `havingRaw()` function after `groupBy()`.

```php
Product::groupBy('category_id')->havingRaw('COUNT(*) > 1')->get();
```

### Eloquent has() deeper

You can use Eloquent `has()` function to query relationships even two layers deep!

```php
// Author -> hasMany(Book::class);
// Book -> hasMany(Rating::class);
$authors = Author::has('books.ratings')->get();
```

### Has Many. How many exactly?

In Eloquent `hasMany()` relationships, you can filter out records that have X amount of children records.

```php
// Author -> hasMany(Book::class)
$authors = Author::has('books', '>', 5)->get();
```

### Default model

You can assign a default model in `belongsTo` relationship, to avoid fatal errors when calling it like `{{ $post->user->name }}` if $post->user doesn't exist.

```php
public function user()
{
    return $this->belongsTo('App\User')->withDefault();
}
```

### Use hasMany to create Many

If you have `hasMany()` relationship, you can use `saveMany()` to save multiple "child" entries from your "parent" object, all in one sentence.

```php
$post = Post::find(1);
$post->comments()->saveMany([
    new Comment(['message' => 'First comment']),
    new Comment(['message' => 'Second comment']),
]);
```

### Eager Loading with Exact Columns

You can do Laravel Eager Loading and specify the exact columns you want to get from the relationship.
```php
$users = App\Book::with('author:id,name')->get();
```

You can do that even in deeper, second level relationships:
```php
$users = App\Book::with('author.country:id,name')->get();
```

### Touch parent updated_at easily

If you are updating a record and want to update the `updated_at` column of parent relationship (like, you add new post comment and want `posts.updated_at` to renew), just use `$touches = ['post'];` property on child model.

```php
class Comment extends Model
{
    protected $touches = ['post'];
}
```

### Always Check if Relationship Exists

Never **ever** do `$model->relationship->field` without checking if relationship object still exists.

It may be deleted for whatever reason, outside your code, by someone else's queued job etc.
Do `if-else`, or `{{ $model->relationship->field ?? '' }}` in Blade, or `{{ optional($model->relationship)->field }}`.

### Use withCount() to Calculate Child Relationships Records

If you have `hasMany()` relationship, and you want to calculate “children” entries, don’t write a special query. For example, if you have posts and comments on your User model, write this `withCount()`:

```php
public function index()
{
    $users = User::withCount(['posts', 'comments'])->get();
    return view('users', compact('users'));
}
```

And then, in your Blade file, you will access those number with `{relationship}_count` properties:

```blade
@foreach ($users as $user)
<tr>
    <td>{{ $user->name }}</td>
    <td class="text-center">{{ $user->posts_count }}</td>
    <td class="text-center">{{ $user->comments_count }}</td>
</tr>
@endforeach
```

You may also order by that field:

```php
User::withCount('comments')->orderBy('comments_count', 'desc')->get(); 
```

### Extra Filter Query on Relationships

If you want to load relationship data, you can specify some limitations or ordering in a closure function. For example, if you want to get Countries with only three of their biggest cities, here's the code.

```php
$countries = Country::with(['cities' => function($query) {
    $query->orderBy('population', 'desc');
    $query->take(3);
}])->get();
```

### Load Relationships Always, but Dynamically

You can not only specify what relationships to ALWAYS load with the model, but you can do it dynamically, in the constructor method:

```php
class ProductTag extends Model
{
    protected $with = ['product'];

    public function __construct() {
        parent::__construct();
        $this->with = ['product'];
        
        if (auth()->check()) {
            $this->with[] = 'user';
        }
    }
}
```

### Instead of belongsTo, use hasMany

For `belongsTo` relationship, instead of passing parent's ID when creating child record, use `hasMany` relationship to make a shorter sentence.

```php
// if Post -> belongsTo(User), and User -> hasMany(Post)...
// Then instead of passing user_id...
Post::create([
    'user_id' => auth()->id(),
    'title' => request()->input('title'),
    'post_text' => request()->input('post_text'),
]);

// Do this
auth()->user()->posts()->create([
    'title' => request()->input('title'),
    'post_text' => request()->input('post_text'),
]);
```

### Rename Pivot Table

If you want to rename "pivot" word and call your relationship something else, you just use `->as('name')` in your relationship.

Model:
```php
public function podcasts() {
    return $this->belongsToMany('App\Podcast')
        ->as('subscription')
        ->withTimestamps();
}
```

Controller:
```php
$podcasts = $user->podcasts();
foreach ($podcasts as $podcast) {
    // instead of $podcast->pivot->created_at ...
    echo $podcast->subscription->created_at;
}
```

### Update Parent in One Line

If you have a `belongsTo()` relationship, you can update the Eloquent relationship data in the same sentence:

```php
// if Project -> belongsTo(User::class)
$project->user->update(['email' => 'some@gmail.com']); 
```

### Laravel 7+ Foreign Keys

From Laravel 7, in migrations you don't need to write two lines for relationship field - one for the field and one for foreign key. Use method `foreignId()`.

```php
// Before Laravel 7
Schema::table('posts', function (Blueprint $table)) {
    $table->unsignedBigInteger('user_id');
    $table->foreign('user_id')->references('id')->on('users');
}

// From Laravel 7
Schema::table('posts', function (Blueprint $table)) {
    $table->foreignId('user_id')->constrained();
}

// Or, if your field is different from the table reference
Schema::table('posts', function (Blueprint $table)) {
    $table->foreignId('created_by_id')->references('id')->on('users');
}
```

### Combine Two "whereHas"

In Eloquent, you can combine `whereHas()` and `orDoesntHave()` in one sentence.

```php
User::whereHas('roles', function($query) {
    $query->where('id', 1);
})
->orDoesntHave('roles')
->get();
```

### Check if Relationship Method Exists

If your Eloquent relationship names are dynamic and you need to check if relationship with such name exists on the object, use PHP function `method_exists($object, $methodName)`

```php
$user = User::first();
if (method_exists($user, 'roles')) {
	// Do something with $user->roles()->...
}
```

### Pivot Table with Extra Relations

In many-to-many relationship, your pivot table may contain extra fields, and even extra relationships to other Model. 

Then generate a separate Pivot Model:

```
php artisan make:model RoleUser --pivot
```

Next, specify it in `belongsToMany()` with `->using()` method. Then you could do magic, like in the example.﻿

```php
// in app/Models/User.php
public function roles()
{
	return $this->belongsToMany(Role::class)
	    ->using(RoleUser::class)
	    ->withPivot(['team_id']);
}

// app/Models/RoleUser.php: notice extends Pivot, not Model
use Illuminate\Database\Eloquent\Relations\Pivot;

class RoleUser extends Pivot
{
	public function team()
	{
	    return $this->belongsTo(Team::class);
	}
}

// Then, in Controller, you can do:
$firstTeam = auth()->user()->roles()->first()->pivot->team->name;
```

### Load Count on-the-fly

In addition to Eloquent's `withCount()` method to count related records, you can also load the count on-the-fly, with `loadCount()`:

```php
// if your Book hasMany Reviews...
$book = App\Book::first();

$book->loadCount('reviews');
// Then you get access to $book->reviews_count;

// Or even with extra condition
$book->loadCount(['reviews' => function ($query) {
    $query->where('rating', 5);
}]);
```

## Migrations

⬆️ [Go to top](#summary) ⬅️ [Previous (Models Relations)](#models-relations) ➡️ [Next (Views)](#views)

- [Unsigned Integer](#unsigned-integer)
- [Order of Migrations](#order-of-migrations)
- [Migration fields with timezones](#migration-fields-with-timezones)
- [Database migrations column types](#database-migrations-column-types)
- [Default Timestamp](#default-timestamp)

### Unsigned Integer

For foreign key migrations instead of `integer()` use `unsignedInteger()` type or `integer()->unsigned()`, otherwise you may get SQL errors.

```php
Schema::create('employees', function (Blueprint $table) {
    $table->unsignedInteger('company_id');
    $table->foreign('company_id')->references('id')->on('companies');
    // ...
});
```

You can also use `unsignedBigInteger()` if that other column is `bigInteger()` type.

```php
Schema::create('employees', function (Blueprint $table) {
    $table->unsignedBigInteger('company_id');
});
```

### Order of Migrations

If you want to change the order of DB migrations, just rename the file's timestamp, like from `2018_08_04_070443_create_posts_table.php` to`2018_07_04_070443_create_posts_table.php` (changed from `2018_08_04` to `2018_07_04`).

They run in alphabetical order.

### Migration fields with timezones

Did you know that in migrations there's not only `timestamps()` but also `timestampsTz()`, for the timezone?

```php
Schema::create('employees', function (Blueprint $table) {
    $table->increments('id');
    $table->string('name');
    $table->string('email');
    $table->timestampsTz();
});
```

Also, there are columns `dateTimeTz()`, `timeTz()`, `timestampTz()`, `softDeletesTz()`.

### Database migrations column types

There are interesting column types for migrations, here are a few examples.

```php
$table->geometry('positions');
$table->ipAddress('visitor');
$table->macAddress('device');
$table->point('position');
$table->uuid('id');
```

See all column types on the [official documentation](https://laravel.com/docs/master/migrations#creating-columns).

### Default Timestamp

While creating migrations, you can use `timestamp()` column type with option
`useCurrent()`, it will set `CURRENT_TIMESTAMP` as default value.

```php
$table->timestamp('created_at')->useCurrent();
$table->timestamp('updated_at')->useCurrent();
```

## Views

⬆️ [Go to top](#summary) ⬅️ [Previous (Migrations)](#migrations) ➡️ [Next (Routing)](#routing)

- [$loop variable in foreach](#loop-variable-in-foreach)
- [Does view file exist?](#does-view-file-exist)
- [Error code Blade pages](#error-code-blade-pages)
- [View without controllers](#view-without-controllers)
- [Blade @auth](#blade-auth)
- [Two-level $loop variable in Blade](#two-level-loop-variable-in-blade)
- [Create Your Own Blade Directive](#create-your-own-blade-directive)
- [Blade Directives: IncludeIf, IncludeWhen, IncludeFirst](#blade-directives-includeif-includewhen-includefirst)

### $loop variable in foreach

Inside of foreach loop, check if current entry is first/last by just using `$loop` variable.

```blade
@foreach ($users as $user)
     @if ($loop->first)
        This is the first iteration.
     @endif

     @if ($loop->last)
        This is the last iteration.
     @endif

     <p>This is user {{ $user->id }}</p>
@endforeach
```

There are also other properties like `$loop->iteration` or `$loop->count`.
Learn more on the [official documentation](https://laravel.com/docs/master/blade#the-loop-variable).

### Does view file exist?

You can check if View file exists before actually loading it.

```php
if (view()->exists('custom.page')) {
 // Load the view
}
```

You can even load an array of views and only the first existing will be actually loaded.

```php
return view()->first(['custom.dashboard', 'dashboard'], $data);
```

### Error code Blade pages

If you want to create a specific error page for some HTTP code, like 500 - just create a blade file with this code as filename, in `resources/views/errors/500.blade.php`, or `403.blade.php` etc, and it will automatically be loaded in case of that error code.

### View without controllers

If you want route to just show a certain view, don't create a Controller method, just use `Route::view()` function.

```php
// Instead of this
Route::get('about', 'TextsController@about');
// And this
class TextsController extends Controller
{
    public function about()
    {
        return view('texts.about');
    }
}
// Do this
Route::view('about', 'texts.about');
```

### Blade @auth

Instead of if-statement to check logged in user, use `@auth` directive.

Typical way:
```blade
@if(auth()->user())
    // The user is authenticated.
@endif
```

Shorter:
```blade
@auth
    // The user is authenticated.
@endauth
```

The opposite is `@guest` directive:
```blade
@guest
    // The user is not authenticated.
@endguest
```

### Two-level $loop variable in Blade

In Blade's foreach you can use $loop variable even in two-level loop to reach parent variable.

```blade
@foreach ($users as $user)
    @foreach ($user->posts as $post)
        @if ($loop->parent->first)
            This is first iteration of the parent loop.
        @endif
    @endforeach
@endforeach
```

### Create Your Own Blade Directive

It’s very easy - just add your own method in `app/Providers/AppServiceProvider.php`. For example, if you want to have this for replace `<br>` tags with new lines:

```blade
<textarea>@br2nl($post->post_text)</textarea>
```

Add this directive to AppServiceProvider’s `boot()` method:
```php
public function boot()
{
    Blade::directive('br2nl', function ($string) {
        return "<?php echo preg_replace('/\<br(\s*)?\/?\>/i', \"\n\", $string); ?>";
    });
}
```

### Blade Directives: IncludeIf, IncludeWhen, IncludeFirst

If you are not sure whether your Blade partial file actually would exist, you may use these condition commands:

This will load header only if Blade file exists
```blade
@includeIf('partials.header')
```

This will load header only for user with role_id 1
```blade
@includeWhen(auth()->user()->role_id == 1, 'partials.header')
```

This will try to load adminlte.header, if missing - will load default.header
```blade
@includeFirst('adminlte.header', 'default.header')
```

## Routing

⬆️ [Go to top](#summary) ⬅️ [Previous (Views)](#views) ➡️ [Next (Validation)](#validation)

- [Route group within a group](#route-group-within-a-group)
- [Wildcard subdomains](#wildcard-subdomains)
- [What's behind the routes?](#whats-behind-the-routes)
- [Route Model Binding: You can define a key](#route-model-binding-you-can-define-a-key)
- [Quickly Navigate from Routes file to Controller](#quickly-navigate-from-routes-file-to-controller)
- [Route Fallback: When no Other Route is Matched](#route-fallback-when-no-other-route-is-matched)
- [Route Parameters Validation with RegExp](#route-parameters-validation-with-regexp)
- [Rate Limiting: Global and for Guests/Users](#rate-limiting-global-and-for-guestsusers)
- [Query string parameters to Routes](#query-string-parameters-to-routes)

### Route group within a group

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

Want to know what routes are actually behind `Auth::routes()`?
From Laravel 7, it’s in a separate package, so check the file `/vendor/laravel/ui/src/AuthRouteMethods.php`.

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

Before Laravel 7, check the file `/vendor/laravel/framework/src/illuminate/Routing/Router.php`.

### Route Model Binding: You can define a key

You can do Route model binding like `Route::get('api/users/{user}', function (App\User $user) { … }` - but not only by ID field. If you want `{user}` to be a `username`
field, put this in the model:

```php
public function getRouteKeyName() {
    return 'username';
}
```

### Quickly Navigate from Routes file to Controller

This thing was optional before Laravel 8, and became a standart main syntax of routing in Laravel 8.

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

### Route Fallback: When no Other Route is Matched

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

### Route Parameters Validation with RegExp

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

## Validation

⬆️ [Go to top](#summary) ⬅️ [Previous (Routing)](#routing) ➡️ [Next (Collections)](#collections)

- [Image validation](#image-validation)
- [Custom validation error messages](#custom-validation-error-messages)
- [Validate dates with "now" or "yesterday" words](#validate-dates-with-now-or-yesterday-words)
- [Validation Rule with Some Conditions](#validation-rule-with-some-conditions)
- [Change Default Validation Messages](#change-default-validation-messages)
- [Prepare for Validation](#prepare-for-validation)
- [Stop on First Validation Error](#stop-on-first-validation-error)

### Image validation

While validating uploaded images, you can specify the dimensions you require.

```php
['photo' => 'dimensions:max_width=4096,max_height=4096']
```

### Custom validation error messages

You can customize validation error messages per **field**, **rule** and **language** - just create a specific language file `resources/lang/xx/validation.php` with appropriate array structure.

```php
'custom' => [
     'email' => [
        'required' => 'We need to know your e-mail address!',
     ],
],
```

### Validate dates with "now" or "yesterday" words

You can validate dates by rules before/after and passing various strings as a parameter, like: `tomorrow`, `now`, `yesterday`. Example: `'start_date' => 'after:now'`. It's using strtotime() under the hood.

```php
$rules = [
    'start_date' => 'after:tomorrow',
    'end_date' => 'after:start_date'
];
```

### Validation Rule with Some Conditions

If your validation rules depend on some condition, you can modify the rules by adding `withValidator()` to your `FormRequest` class, and specify your custom logic there. Like, if you want to add validation rule only for some user role.

```php
use Illuminate\Validation\Validator;
class StoreBlogCategoryRequest extends FormRequest {
    public function withValidator(Validator $validator) {
        if (auth()->user()->is_admin) {
            $validator->addRules(['some_secret_password' => 'required']);
        }
    }
}
```

### Change Default Validation Messages

If you want to change default validation error message for specific field and specific validation rule, just add a `messages()` method into your `FormRequest` class.

```php
class StoreUserRequest extends FormRequest
{
    public function rules()
    {
        return ['name' => 'required'];
    }
    
    public function messages()
    {
        return ['name.required' => 'User name should be real name'];
    }
}
```

### Prepare for Validation

If you want to modify some field before default Laravel validation, or, in other words, "prepare" that field, guess what - there's a method `prepareForValidation()` in `FormRequest` class:

```php
protected function prepareForValidation()
{
    $this->merge([
        'slug' => Illuminate\Support\Str::slug($this->slug),
    ]);
}
``` 

### Stop on First Validation Error

By default, Laravel validation errors will be returned in a list, checking all validation rules. But if you want the process to stop after the first error, use validation rule called `bail`:
```php
$request->validate([
    'title' => 'bail|required|unique:posts|max:255',
    'body' => 'required',
]);
```

## Collections

⬆️ [Go to top](#summary) ⬅️ [Previous (Validation)](#validation) ➡️ [Next (Auth)](#auth)

- [Don’t Filter by NULL in Collections](#dont-filter-by-null-in-collections)
- [Use groupBy on Collections with Custom Callback Function](#use-groupby-on-collections-with-custom-callback-function)
- [Multiple Collection Methods in a Row](#multiple-collection-methods-in-a-row)
- [Calculate Sum with Pagination](#calculate-sum-with-pagination)

### Don’t Filter by NULL in Collections

You can filter by NULL in Eloquent, but if you're filtering the **collection** further - filter by empty string, there's no "null" in that field anymore.

```php
// This works
$messages = Message::where('read_at is null')->get();

// Won’t work - will return 0 messages
$messages = Message::all();
$unread_messages = $messages->where('read_at is null')->count();

// Will work
$unread_messages = $messages->where('read_at', '')->count();
```

### Use groupBy on Collections with Custom Callback Function

If you want to group result by some condition whith isn’t a direct column in your database, you can do that by providing a closure function.

For example, if you want to group users by day of registration, here’s the code:
```php
$users = User::all()->groupBy(function($item) {
    return $item->created_at->format('Y-m-d');
});
```

⚠️ Notice: it is done on a `Collection` class, so performed **AFTER** the results are fetched from the database.

### Multiple Collection Methods in a Row

If you query all results with `->all()` or `->get()`, you may then perform various Collection operations on the same result, it won’t query database every time.
```php
$users = User::all();
echo 'Max ID: ' . $users->max('id');
echo 'Average age: ' . $users->avg('age');
echo 'Total budget: ' . $users->sum('budget');
```

### Calculate Sum with Pagination

How to calculate the sum of all records when you have only the PAGINATED collection? Do the calculation BEFORE the pagination, but from the same query.﻿


```php
// How to get sum of post_views with pagination?
$posts = Post::paginate(10);
// This will be only for page 1, not ALL posts
$sum = $posts->sum('post_views');

// Do this with Query Builder
$query = Post::query();
// Calculate sum
$sum = $query->sum('post_views');
// And then do the pagination from the same query
$posts = $query->paginate(10);
```


## Auth

⬆️ [Go to top](#summary) ⬅️ [Previous (Collections)](#collections) ➡️ [Next (Mail)](#mail)

- [Check Multiple Permissions at Once](#check-multiple-permissions-at-once)
- [More Events on User Registration](#more-events-on-user-registration)
- [Did you know about Auth::once()?](#did-you-know-about-authonce)
- [Change API Token on users password update](#change-api-token-on-users-password-update)
- [Override Permissions for Super Admin](#override-permissions-for-super-admin)

### Check Multiple Permissions at Once

In addition to `@can` Blade directive, did you know you can check multiple permissions at once with `@canany` directive?

```blade
@canany(['update', 'view', 'delete'], $post)
    // The current user can update, view, or delete the post
@elsecanany(['create'], \App\Post::class)
    // The current user can create a post
@endcanany
```

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
public function setPasswordAttribute($value)
{
    $this->attributes['password'] = $value;
    $this->attributes['api_token'] = Str::random(100);
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


## Mail

⬆️ [Go to top](#summary) ⬅️ [Previous (Auth)](#auth) ➡️ [Next (Artisan)](#artisan)

- [Testing email into laravel.log](#testing-email-into-laravellog)
- [Preview Mailables](#preview-mailables)
- [Default Email Subject in Laravel Notifications](#default-email-subject-in-laravel-notifications)
- [Send Notifications to Anyone](#send-notifications-to-anyone)

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

## Artisan

⬆️ [Go to top](#summary) ⬅️ [Previous (Mail)](#mail) ➡️ [Next (Factories)](#factories)

- [Artisan command parameters](#artisan-command-parameters)
- [Maintenance Mode](#maintenance-mode)
- [Artisan command help](#artisan-command-help)
- [Exact Laravel version](#exact-laravel-version)
- [Launch Artisan command from anywhere](#launch-artisan-command-from-anywhere)


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

You may also provide flags, in Laravel 8:
- the path the user should be redirected to
- the view that should be prerendered
- secret phrase to bypass maintenance mode
- status code during maintenance mode
- retry page reload every X seconds

```bash
php artisan down --redirect="/" --render="errors::503" --secret="1630542a-246b-4b66-afa1-dd72a4c43515" --status=200 --retry=60
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

## Factories

⬆️ [Go to top](#summary) ⬅️ [Previous (Artisan)](#artisan) ➡️ [Next (Log and debug)](#log-and-debug)

- [Factory callbacks](#factory-callbacks)
- [Generate Images with Seeds/Factories](#generate-images-with-seedsfactories)

### Factory callbacks

While using factories for seeding data, you can provide Factory Callback functions to perform some action after record is inserted.

```php
$factory->afterCreating(App\User::class, function ($user, $faker) {
    $user->accounts()->save(factory(App\Account::class)->make());
});
```

### Generate Images with Seeds/Factories

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

## Log and debug

⬆️ [Go to top](#summary) ⬅️ [Previous (Factories)](#factories) ➡️ [Next (API)](#api)


- [Logging with parameters](#logging-with-parameters)
- [More convenient DD](#more-convenient-dd)

### Logging with parameters

You can write `Log::info()`, or shorter `info()` message with additional parameters, for more context about what happened.

```php
Log::info('User failed to login.', ['id' => $user->id]);
```

### More convenient DD

Instead of doing `dd($result)` you can put `->dd()` as a method directly at the end of your Eloquent sentence, or any Collection.

```php
// Instead of
$users = User::where('name', 'Taylor')->get();
dd($users);
// Do this
$users = User::where('name', 'Taylor')->get()->dd();
```

## API

⬆️ [Go to top](#summary) ⬅️ [Previous (Log and debug)](#log-and-debug) ➡️ [Next (Other)](#other)

- [API Resources: With or Without "data"?](#api-resources-with-or-without-data)
- [API Return "Everything went ok"](#api-return-everything-went-ok)

### API Resources: With or Without "data"?

If you use Eloquent API Resources to return data, they will be automatically wrapped in 'data'. If you want to remove it, add `JsonResource::withoutWrapping();` in `app/Providers/AppServiceProvider.php`.

```php
class AppServiceProvider extends ServiceProvider
{
    public function boot()
    {
        JsonResource::withoutWrapping();
    }
}
```

### API Return "Everything went ok"

If you have API endpoint which performs some operations but has no response, so you wanna return just "everything went ok", you may return 204 status code "No
content". In Laravel, it's easy: `return response()->noContent();`.

```php
public function reorder(Request $request)
{
    foreach ($request->input('rows', []) as $row) {
        Country::find($row['id'])->update(['position' => $row['position']]);
    }

    return response()->noContent();
}
```

## Other

⬆️ [Go to top](#summary) ⬅️ [Previous (API)](#api)

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

```
composer create-project --prefer-dist laravel/laravel project "7.*"
```

Change 7.* to whichever version you want.

### Add Parameters to Pagination Links

In default Pagination links, you can pass additional parameters, preserve the original query string, or even point to a specific `#xxxxx` anchor. 

```
{{ $users->appends(['sort' => 'votes'])->links() }}

{{ $users->withQueryString()->links() }}

{{ $users->fragment('foo')->links() }}
```

### Repeatable Callback Functions

If you have a callback function that you need to re-use multiple times, you can assign it to a variable, and then re-use.﻿

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
