## DB Models and Eloquent

⬆️ [Go to main menu](README.md#laravel-tips) ➡️ [Next (Models Relations)](models-relations.md)

- [Reuse or clone query()](#reuse-or-clone-query)
- [Remember to use bindings in your raw queries](#remember-to-use-bindings-in-your-raw-queries)
- [Small cheat-sheet for using Full-Text Search with Laravel on MySQL](#small-cheat-sheet-for-using-full-text-search-with-laravel-on-mysql)
- [Merging eloquent collections](#merging-eloquent-collections)
- [Perform operation without modifying updated_at field](#perform-operation-without-modifying-updated_at-field)
- [You can write transaction-aware code](#you-can-write-transaction-aware-code)
- [Eloquent scopes inside of other relationships](#eloquent-scopes-inside-of-other-relationships)
- [New `rawValue()` method since Laravel 9.37](#new-rawvalue-method-since-laravel-937)
- [Load data faster when the targeted value is an integer](#load-data-faster-when-the-targeted-value-is-an-integer)
- [Load data completed between two timestamps](#load-data-completed-between-two-timestamps)
- [Pass a raw query to order your results](#pass-a-raw-query-to-order-your-results)
- [Eloquent where date methods](#eloquent-where-date-methods)
- [Increments and decrements](#increments-and-decrements)
- [No timestamp columns](#no-timestamp-columns)
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
- [Find Many and return specific columns](#find-many-and-return-specific-columns)
- [Find by Key](#find-by-key)
- [Use UUID instead of auto-increment](#use-uuid-instead-of-auto-increment)
- [Sub-selects in Laravel Way](#sub-selects-in-laravel-way)
- [Hide Some Columns](#hide-some-columns)
- [Exact DB Error](#exact-db-error)
- [Soft-Deletes with Query Builder](#soft-deletes-with-query-builder)
- [Good Old SQL Query](#good-old-sql-query)
- [Use DB Transactions](#use-db-transactions)
- [Update or Create](#update-or-create)
- [Forget Cache on Save](#forget-cache-on-save)
- [Change Format Of Created_at and Updated_at](#change-format-of-created_at-and-updated_at)
- [Storing Array Type into JSON](#storing-array-type-into-json)
- [Make a Copy of the Model](#make-a-copy-of-the-model)
- [Reduce Memory](#reduce-memory)
- [Force query without $fillable/$guarded](#force-query-without-fillableguarded)
- [3-level structure of parent-children](#3-level-structure-of-parent-children)
- [Perform any action on failure](#perform-any-action-on-failure)
- [Check if record exists or show 404](#check-if-record-exists-or-show-404)
- [Abort if condition failed](#abort-if-condition-failed)
- [Fill a column automatically while you persist data to the database](#fill-a-column-automatically-while-you-persist-data-to-the-database)
- [Extra information about the query](#extra-information-about-the-query)
- [Using the doesntExist() method in Laravel](#using-the-doesntexist-method-in-laravel)
- [Trait that you want to add to a few Models to call their boot() method automatically](#trait-that-you-want-to-add-to-a-few-models-to-call-their-boot-method-automatically)
- [There are two common ways of determining if a table is empty in Laravel](#there-are-two-common-ways-of-determining-if-a-table-is-empty-in-laravel)
- [How to prevent “property of non-object” error](#how-to-prevent-property-of-non-object-error)
- [Get original attributes after mutating an Eloquent record](#get-original-attributes-after-mutating-an-eloquent-record)
- [A simple way to seed a database](#a-simple-way-to-seed-a-database)
- [The crossJoinSub method of the query constructor](#the-crossjoinsub-method-of-the-query-constructor)
- [Belongs to Many Pivot table naming](#belongs-to-many-pivot-table-naming)
- [Order by Pivot Fields](#order-by-pivot-fields)
- [Find a single record from a database](#find-a-single-record-from-a-database)
- [Automatic records chunking](#automatic-records-chunking)
- [Updating the model without dispatching events](#updating-the-model-without-dispatching-events)
- [Periodic cleaning of models from obsolete records](#periodic-cleaning-of-models-from-obsolete-records)
- [Immutable dates and casting to them](#immutable-dates-and-casting-to-them)
- [The findOrFail method also accepts a list of ids](#the-findorfail-method-also-accepts-a-list-of-ids)
- [Prunable trait to automatically remove models from your database](#prunable-trait-to-automatically-remove-models-from-your-database)
- [withAggregate method](#withaggregate-method)
- [Date convention](#date-convention)
- [Eloquent multiple upserts](#eloquent-multiple-upserts)
- [Retrieve the Query Builder after filtering the results](#retrieve-the-query-builder-after-filtering-the-results)
- [Custom casts](#custom-casts)
- [Order based on a related model's average or count](#order-based-on-a-related-models-average-or-count)
- [Return transactions result](#return-transactions-result)
- [Remove several global scopes from query](#remove-several-global-scopes-from-query)
- [Order JSON column attribute](#order-json-column-attribute)
- [Get single column's value from the first result](#get-single-columns-value-from-the-first-result)
- [Check if altered value changed key](#check-if-altered-value-changed-key)
- [New way to define accessor and mutator](#new-way-to-define-accessor-and-mutator)
- [Another way to do accessors and mutators](#another-way-to-do-accessors-and-mutators)
- [When searching for the first record, you can perform some actions](#when-searching-for-the-first-record-you-can-perform-some-actions)
- [Directly convert created_at date to human readable format](#directly-convert-created_at-date-to-human-readable-format)
- [Ordering by an Eloquent Accessor](#ordering-by-an-eloquent-accessor)
- [Check for specific model was created or found](#check-for-specific-model-was-created-or-found)
- [Laravel Scout with database driver](#laravel-scout-with-database-driver)
- [Make use of the value method on the query builder](#make-use-of-the-value-method-on-the-query-builder)
- [Pass array to where method](#pass-array-to-where-method)
- [Return the primary keys from models collection](#return-the-primary-keys-from-models-collection)
- [Force Laravel to use eager loading](#force-laravel-to-use-eager-loading)
- [Make all your models mass assignable](#make-all-your-models-mass-assignable)
- [Hiding columns in select all statements](#hiding-columns-in-select-all-statements)
- [JSON Where Clauses](#json-where-clauses)
- [Get all the column names for a table](#get-all-the-column-names-for-a-table)
- [Compare the values of two columns](#compare-the-values-of-two-columns)
- [Accessor Caching](#accessor-caching)
- [New scalar() method](#new-scalar-method)
- [Select specific columns](#select-specific-columns)
- [Chain conditional clauses to the query without writing if-else statements](#chain-conditional-clauses-to-the-query-without-writing-if-else-statements)
- [Override Connection Attribute in Models](#override-connection-attribute-in-models)
- [Using Column Names in Where Clauses](#using-column-names-in-where-clauses)

### Reuse or clone query()

Typically, we need to query multiple time from a filtered query. So, most of the time we use `query()` method,

let's write a query for getting today created active and inactive products

```php

$query = Product::query();


$today = request()->q_date ?? today();
if($today){
    $query->where('created_at', $today);
}

// lets get active and inactive products
$active_products = $query->where('status', 1)->get(); // this line modified the $query object variable
$inactive_products = $query->where('status', 0)->get(); // so here we will not find any inactive products
```

But, after getting `$active products` the `$query` will be modified. So, `$inactive_products` will not find any inactive products from `$query` and that will return blank collection every time. Cause, that will try to find inactive products from `$active_products` (`$query` will return active products only).

For solve this issue, we can query multiple time by reusing this `$query` object.
So, We need to clone this `$query` before doing any `$query` modification action.

```php
$active_products = $query->clone()->where('status', 1)->get(); // it will not modify the $query
$inactive_products = $query->clone()->where('status', 0)->get(); // so we will get inactive products from $query

```

### Remember to use bindings in your raw queries

You can pass an array of bindings to most raw query methods to avoid SQL injection.

```php
// This is vulnerable to SQL injection
$fullname = request('full_name');
User::whereRaw("CONCAT(first_name, last_name) = $fullName")->get();

// Use bindings
User::whereRaw("CONCAT(first_name, last_name) = ?", [request('full_name')])->get();
```

Tip given by [@cosmeescobedo](https://twitter.com/cosmeescobedo/status/1565806352219328513)

### Small cheat-sheet for using Full-Text Search with Laravel on MySQL

Migration
```php
Schema::create('comments', function (Blueprint $table) {
     $table->id();
     $table->string('title');
     $table->text('description');

     $table->fullText(['title', 'description']);
});
```

Natural language

Search for `something`
```php
Comment::whereFulltext(['title', 'description'], 'something')->get();
```

Natural language with Query Expansion

Search for `something` and use the results to perform a larger query
```php
Comment::whereFulltext(['title', 'description'], 'something', ['expanded' => true])->get();
```

Boolean mode

Search for `something` and exclude `else`
```php
Comment::whereFulltext(['title', 'description'], '+something -else', ['mode' => 'boolean'])->get();
```

Tip given by [@w3Nicolas](https://twitter.com/w3Nicolas/status/1566694849767772160/)

### Merging eloquent collections

The Eloquent collection's merge method uses the id to avoid duplicated models.

But if you are merging collections of different Models, it can cause get you unexpected results.

Use the base collection method instead.

```php
$videos = Video::all();
$images = Image::all();

// If there are videos with the same id as images they will get replaced
// You'll end up with missing videos
$allMedia = $videos->merge($images);

// call `toBase()` in your eloquent collection to use the base merge method instead
$allMedia = $videos->toBase()->merge($images);
```

Tip given by [@cosmeescobedo](https://twitter.com/cosmeescobedo/status/1568392184772296706)

### Perform operation without modifying updated_at field

If you would like to perform model operations without the model having its `updated_at` timestamp modified, you may operate on the model within a closure given to the `withoutTimestamps` method.

Available from Laravel 9.31.

```php
$user = User::first();

// `updated_at` is not changed...

User::withoutTimestamps(
     fn () => $user->update(['reserved_at' => now()])
);
```

Tip given by [@LaravelEloquent](https://twitter.com/LaravelEloquent/status/1573787406528126976)

### You can write transaction-aware code

Using `DB::afterCommit` method you can write code that will only be executed if the transaction gets committed and discarded if the transaction is rolled back.

If there is no transaction, the code will be executed right away.
```php
DB::transaction(function () {
     $user = User::create([...]);

     $user->teams()->create([...]);
});
```

```php
class User extends Model
{
     protected static function booted()
     {
          static::created(function ($user) {
               // Will send the email only if the
               // transaction is committed
               DB::afterCommit(function () use ($user) {
                    Mail::send(new WelcomeEmail($user));
               });
          });
     }
}
```

Tip given by [@cosmeescobedo](https://twitter.com/cosmeescobedo/status/1583960872602390528)

### Eloquent scopes inside of other relationships

Did you know that you can use Eloquent scopes inside of defining other relationships?

**app/Models/Lesson.php**:
```php
public function scopePublished($query)
{
     return $query->where('is_published', true);
}
```

**app/Models/Course.php**:
```php
public function lessons(): HasMany
{
     return $this->hasMany(Lesson::class);
}

public function publishedLessons(): HasMany
{
     return $this->lessons()->published();
}
```

### New `rawValue()` method since Laravel 9.37

Laravel 9.37 has a new `rawValue()` method to get a value from a SQL expression. Here are some examples from the pull request:
```php
$first = TripModel::orderBy('date_at', 'ASC')
     ->rawValue('YEAR(`date_at`)');
$last = TripModel::orderBy('date_at', 'DESC')
     ->rawValue('YEAR(`date_at`)');

$fullname = UserModel::where('id', $id)
     ->rawValue('CONCAT(`first_name`, " ", `last_name`)');
```

Tip given by [@LoydRG](https://twitter.com/LoydRG/status/1587689148768567298)

### Load data faster when the targeted value is an integer

Instead of using the 𝘄𝗵𝗲𝗿𝗲𝗜𝗻() method to load a large range of data when the targeted value is an integer, use 𝘄𝗵𝗲𝗿𝗲𝗜𝗻𝘁𝗲𝗴𝗲𝗿𝗜𝗻𝗥𝗮𝘄() which is faster than 𝘄𝗵𝗲𝗿𝗲𝗜𝗻().

```php
// instead of using whereIn
Product::whereIn('id', range(1, 50))->get();

// use WhereIntegerInRaw method for faster loading
Product::whereIntegerInRaw('id', range(1, 50))->get();
```

Tip given by [@LaraShout](https://twitter.com/LaraShout)

### Load data completed between two timestamps

Use 𝘄𝗵𝗲𝗿𝗲𝗕𝗲𝘁𝘄𝗲𝗲𝗻 to load records between two timestamps, you can pass the fallback value using the null coalescing operator (??).

```php
// Load tasks completed between two timestamps
Task::whereBetween('completed_at', [
    $request->from ?? '2023-01-01',
    $request->to ??  today()->toDateTimeString(),
]);
```

Tip given by [@LaraShout](https://twitter.com/LaraShout)

### Pass a raw query to order your results

You can pass a raw query to order your results.

For example, sorting tasks by how long before the due date they were completed.

```php
// Sort tasks by the task was completed before the due date
$tasks = Task::query()
    ->whereNotNull('completed_at')
    ->orderByRaw('due_at - completed_at DESC')
    ->get();
```

Tip given by [@cosmeescobedo](https://twitter.com/cosmeescobedo)

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

### Soft-deletes: multiple restore

When using soft-deletes, you can restore multiple rows in one sentence.

```php
Post::onlyTrashed()->where('author_id', 1)->restore();
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

- In version 9 and above:

```php
use Illuminate\Database\Eloquent\Casts\Attribute;

class User extends Model
{
    protected function email(): Attribute
    {
        return Attribute::make(
            set: fn ($value, $attributes) => $attributes['email'] ?? $value,
        );
    }
}
```

- In version 9 and below:

```php
class User extends Model
{
    public function setEmailAttribute($value)
    {
        if (isset($this->attributes['email']) && ! is_null($this->attributes['email'])) {
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

```php
return Product::whereIn('id', $this->productIDs)->get();
// You can do this
return Product::find($this->productIDs)
```

Tip given by [@tahiriqbalnajam](https://twitter.com/tahiriqbalnajam/status/1436120403655671817)

Incase of integer, use `whereIn` with limited data range only instead use `whereIntegerInRaw` which is faster then `whereIn`.

```php
Product::whereIn('id', range(1, 50))->get();
// You can do this
Product::whereIntegerInRaw('id', range(1, 50))->get();
```

Tip given by [@sachinkiranti](https://raisachin.com.np)

### Find Many and return specific columns

Eloquent method `find()` may accept multiple parameters, and then it returns a Collection of all records found with specified columns, not all columns of model:

```php
// Will return Eloquent Model with first_name and email only
$user = User::find(1, ['first_name', 'email']);
// Will return Eloquent Collection with first_name and email only
$users = User::find([1,2,3], ['first_name', 'email']);
```

Tip given by [@tahiriqbalnajam](https://github.com/tahiriqbalnajam)

### Find by Key

You can also find multiple records with `whereKey()` method which takes care of which field is exactly your primary key (`id` is the default, but you may override it in Eloquent model):

```php
$users = User::whereKey([1,2,3])->get();
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

#### Laravel 9 and above:

```php
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasUuids;

    // ...
}

$article = Article::create(['title' => 'Traveling to Europe']);

$article->id; // "8f8e8478-9035-4d23-b9a7-62f4d2612ce5"
```

#### Laravel 8 and below:

Model:

- In PHP 7.4.0 and above:

```php
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected static function boot()
    {
        parent::boot();

        self::creating(fn (User $model) => $model->attributes['id'] = Str::uuid());
        self::saving(fn (User $model) => $model->attributes['id'] = Str::uuid());
    }
}
```

- In PHP older than 7.4.0:

```php
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected static function boot()
    {
        parent::boot();

        self::creating(function ($model) {
             $model->attributes['id'] = Str::uuid();
        });
        self::saving(function ($model) {
             $model->attributes['id'] = Str::uuid();
        });
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
$users = User::withTrashed()->get();

// Will NOT exclude soft-deleted entries
$users = DB::table('users')->get();
```

### Good Old SQL Query

If you need to execute a simple SQL query, without getting any results - like changing something in DB schema, you can just do `DB::statement()`.

```php
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

If you have cache key like `posts` that gives collection, and you want to forget that cache key on new store or update, you can call static `saved` function on your model:

```php
class Post extends Model
{
    // Forget cache key on storing or updating
    public static function boot()
    {
        parent::boot();
        static::saved(function () {
           Cache::forget('posts');
        });
    }
}
```

### Change Format Of Created_at and Updated_at

Tip given by [@syofyanzuhad](https://github.com/syofyanzuhad)

To change the format of `created_at` you can add a method in your model like this:

Since Laravel 9:
```php
protected function createdAtFormatted(): Attribute
{
    return Attribute::make(
        get: fn ($value, $attributes) => $attributes['created_at']->format('H:i d, M Y'),
    );
}
```

Laravel 8 and below:
```php
public function getCreatedAtFormattedAttribute()
{
   return $this->created_at->format('H:i d, M Y');
}
```

So you can use it `$entry->created_at_formatted` when it's needed.
It will return the `created_at` attribute like this: `04:19 23, Aug 2020`.

And also for changing format of `updated_at` attribute, you can add this method :

Since Laravel 9:
```php
protected function updatedAtFormatted(): Attribute
{
    return Attribute::make(
        get: fn ($value, $attributes) => $attributes['updated_at']->format('H:i d, M Y'),
    );
}
```

Laravel 8 and below:
```php
public function getUpdatedAtFormattedAttribute()
{
   return $this->updated_at->format('H:i d, M Y');
}
```

So you can use it `$entry->updated_at_formatted` when it's needed.
It will return the `updated_at` attribute like this: `04:19 23, Aug 2020`.

### Storing Array Type into JSON

Tip given by [@pratiksh404](https://github.com/pratiksh404)

If you have input field which takes an array and you have to store it as a JSON, you can use `$casts` property in your model. Here `images` is a JSON attribute.

```php
protected $casts = [
    'images' => 'array',
];
```

So you can store it as a JSON, but when retrieved from DB, it can be used as an array.

### Make a Copy of the Model

If you have two very similar Models (like shipping address and billing address) and you need to make a copy of one to another, you can use `replicate()` method and change some properties after that.

Example from the [official docs](https://laravel.com/docs/8.x/eloquent#replicating-models):

```php
$shipping = Address::create([
    'type' => 'shipping',
    'line_1' => '123 Example Street',
    'city' => 'Victorville',
    'state' => 'CA',
    'postcode' => '90001',
]);

$billing = $shipping->replicate()->fill([
    'type' => 'billing'
]);

$billing->save();
```

### Reduce Memory

Sometimes we need to load a huge amount of data into memory. For example:

```php
$orders = Order::all();
```

But this can be slow if we have really huge data, because Laravel prepares objects of the Model class.
In such cases, Laravel has a handy function `toBase()`

```php
$orders = Order::toBase()->get();
//$orders will contain `Illuminate\Support\Collection` with objects `StdClass`.
```

By calling this method, it will fetch the data from the database, but it will not prepare the Model class.
Keep in mind it is often a good idea to pass an array of fields to the get method, preventing all fields to be fetched from the database.

### Force query without $fillable/$guarded

If you create a Laravel boilerplate as a "starter" for other devs, and you're not in control of what THEY would later fill in Model's $fillable/$guarded, you may use forceFill()

```php
$team->update(['name' => $request->name])
```

What if "name" is not in Team model's `$fillable`? Or what if there's no `$fillable/$guarded` at all?

```php
$team->forceFill(['name' => $request->name])
```

This will "ignore" the `$fillable` for that one query and will execute no matter what.

### 3-level structure of parent-children

If you have a 3-level structure of parent-children, like categories in an e-shop, and you want to show the number of products on the third level, you can use `with('yyy.yyy')` and then add `withCount()` as a condition

```php
class HomeController extend Controller
{
    public function index()
    {
        $categories = Category::query()
            ->whereNull('category_id')
            ->with(['subcategories.subcategories' => function($query) {
                $query->withCount('products');
            }])->get();
    }
}
```

```php
class Category extends Model
{
    public function subcategories()
    {
        return $this->hasMany(Category::class);
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
```

```php
<ul>
    @foreach($categories as $category)
        <li>
            {{ $category->name }}
            @if ($category->subcategories)
                <ul>
                @foreach($category->subcategories as $subcategory)
                    <li>
                        {{ $subcategory->name }}
                        @if ($subcategory->subcategories)
                            <ul>
                                @foreach ($subcategory->subcategories as $subcategory)
                                    <li>{{ $subcategory->name }} ({{ $subcategory->product_count }})</li>
                                @endforeach
                            </ul>
                        @endif
                    </li>
                @endforeach
                </ul>
            @endif
        </li>
    @endforeach
</ul>
```

### Perform any action on failure

When looking for a record, you may want to perform some actions if it's not found.
In addition to `->firstOrFail()` which just throws 404, you can perform any action on failure, just do `->firstOr(function() { ... })`

```php
$model = Flight::where('legs', '>', 3)->firstOr(function () {
    // ...
})
```

### Check if record exists or show 404

Don't use find() and then check if the record exists. Use findOrFail().

```php
$product = Product::find($id);
if (!$product) {
    abort(404);
}
$product->update($productDataArray);
```

Shorter way

```php
$product = Product::findOrFail($id); // shows 404 if not found
$product->update($productDataArray);
```

### Abort if condition failed

`abort_if()` can be used as shorter way to check condition and throw an error page.

```php
$product = Product::findOrFail($id);
if($product->user_id != auth()->user()->id){
    abort(403);
}
```

Shorter way

```php
/* abort_if(CONDITION, ERROR_CODE) */
$product = Product::findOrFail($id);
abort_if ($product->user_id != auth()->user()->id, 403)
```

### Fill a column automatically while you persist data to the database

If you want to fill a column automatically while you persist data to the database (e.g: slug) use Model Observer instead of hard code it every time

```php
use Illuminate\Support\Str;

class Article extends Model
{
    ...
    protected static function boot()
    {
        parent:boot();

        static::saving(function ($model) {
            $model->slug = Str::slug($model->title);
        });
    }
}
```

Tip given by [@sky_0xs](https://twitter.com/sky_0xs/status/1432390722280427521)

### Extra information about the query

You can call the `explain()` method on queries to know extra information about the query.

```php
Book::where('name', 'Ruskin Bond')->explain()->dd();
```

```php
Illuminate\Support\Collection {#5344
    all: [
        {#15407
            +"id": 1,
            +"select_type": "SIMPLE",
            +"table": "books",
            +"partitions": null,
            +"type": "ALL",
            +"possible_keys": null,
            +"key": null,
            +"key_len": null,
            +"ref": null,
            +"rows": 9,
            +"filtered": 11.11111164093,
            +"Extra": "Using where",
        },
    ],
}
```

Tip given by [@amit_merchant](https://twitter.com/amit_merchant/status/1432277631320223744)

### Using the doesntExist() method in Laravel

```php
// This works
if ( 0 === $model->where('status', 'pending')->count() ) {
}

// But since I don't care about the count, just that there isn't one
// Laravel's exists() method is cleaner.
if ( ! $model->where('status', 'pending')->exists() ) {
}

// But I find the ! in the statement above easily missed. The
// doesntExist() method makes this statement even clearer.
if ( $model->where('status', 'pending')->doesntExist() ) {
}
```

Tip given by [@ShawnHooper](https://twitter.com/ShawnHooper/status/1435686220542234626)

### Trait that you want to add to a few Models to call their boot() method automatically

If you have a Trait that you want to add to a few Models to call their `boot()` method automatically, you can call Trait's method as boot[TraitName]

```php
class Transaction extends  Model
{
    use MultiTenantModelTrait;
}
```

```php
class Task extends  Model
{
    use MultiTenantModelTrait;
}
```

```php
trait MultiTenantModelTrait
{
    // This method's name is boot[TraitName]
    // It will be auto-called as boot() of Transaction/Task
    public static function bootMultiTenantModelTrait()
    {
        static::creating(function ($model) {
            if (!$isAdmin) {
                $isAdmin->created_by_id = auth()->id();
            }
        })
    }
}
```

### There are two common ways of determining if a table is empty in Laravel

There are two common ways of determining if a table is empty in Laravel. Calling `exists()` or `count()` directly on the model!

One returns a strict true/false boolean, the other returns an integer which you can use as a falsy in conditionals.

```php
public function index()
{
    if (\App\Models\User::exists()) {
        // returns boolean true or false if the table has any saved rows
    }

    if (\App\Models\User::count()) {
        // returns the count of rows in the table
    }
}
```

Tip given by [@aschmelyun](https://twitter.com/aschmelyun/status/1440641525998764041)

### How to prevent “property of non-object” error

```php
// BelongsTo Default Models
// Let's say you have Post belonging to Author and then Blade code:
$post->author->name;

// Of course, you can prevent it like this:
$post->author->name ?? ''
// or
@$post->author->name

// But you can do it on Eloquent relationship level:
// this relation will return an empty App\Author model if no author is attached to the post
public function author() {
    return $this->belongsTo(Author::class)->withDefault();
}
// or
public function author() {
    return $this->belongsTo(Author::class)->withDefault([
        'name' => 'Guest Author'
    ]);
}
```

Tip given by [@coderahuljat](https://twitter.com/coderahuljat/status/1440556610837876741)

### Get original attributes after mutating an Eloquent record

Get original attributes after mutating an Eloquent record you can get the original attributes by calling getOriginal()

```php
$user = App\User::first();
$user->name; // John
$user->name = "Peter"; // Peter
$user->getOriginal('name'); // John
$user->getOriginal(); // Original $user record
```

Tip given by [@devThaer](https://twitter.com/devThaer/status/1442133797223403521)

### A simple way to seed a database

A simple way to seed a database in Laravel with a .sql dump file

```php
DB::unprepared(
    file_get_contents(__DIR__ . './dump.sql')
);
```

Tip given by [@w3Nicolas](https://twitter.com/w3Nicolas/status/1447902369388249091)

### The crossJoinSub method of the query constructor

Using the CROSS JOIN subquery

```php
use Illuminate\Support\Facades\DB;

$totalQuery = DB::table('orders')->selectRaw('SUM(price) as total');

DB::table('orders')
    ->select('*')
    ->crossJoinSub($totalQuery, 'overall')
    ->selectRaw('(price / overall.total) * 100 AS percent_of_total')
    ->get();
```

Tip given by [@PascalBaljet](https://twitter.com/pascalbaljet)

### Belongs to Many Pivot table naming

To determine the table name of the relationship's intermediate table, Eloquent will join the two related model names in alphabetical order.

This would mean a join between `Post` and `Tag` could be added like this:

```php
class Post extends Model
{
    public $table = 'posts';

    public function tags()
    {
        return $this->belongsToMany(Tag::class);
    }
}
```

However, you are free to override this convention, and you would need to specify the join table in the second argument.

```php
class Post extends Model
{
    public $table = 'posts';

    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'posts_tags');
    }
}
```

If you wish to be explicit about the primary keys you can also supply these as third and fourth arguments.

```php
class Post extends Model
{
    public $table = 'posts';

    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'post_tag', 'post_id', 'tag_id');
    }
}
```

Tip given by [@iammikek](https://twitter.com/iammikek)

### Order by Pivot Fields

`BelongsToMany::orderByPivot()` allows you to directly sort the results of a BelongsToMany relationship query.

```php
class Tag extends Model
{
    public $table = 'tags';
}

class Post extends Model
{
    public $table = 'posts';

    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'post_tag', 'post_id', 'tag_id')
            ->using(PostTagPivot::class)
            ->withTimestamps()
            ->withPivot('flag');
    }
}

class PostTagPivot extends Pivot
{
    protected $table = 'post_tag';
}

// Somewhere in the Controller
public function getPostTags($id)
{
    return Post::findOrFail($id)->tags()->orderByPivot('flag', 'desc')->get();
}
```

Tip given by [@PascalBaljet](https://twitter.com/pascalbaljet)

### Find a single record from a database

The `sole()` method will return only one record that matches the criteria. If no such entry is found, then a `NoRecordsFoundException` will be thrown. If multiple records are found, then a `MultipleRecordsFoundException` will be thrown.

```php
DB::table('products')->where('ref', '#123')->sole();
```

Tip given by [@PascalBaljet](https://twitter.com/pascalbaljet)

### Automatic records chunking

Similar to `each()` method, but easier to use. Automatically splits the result into parts (chunks).

```php
return User::orderBy('name')->chunkMap(fn ($user) => [
    'id' => $user->id,
    'name' => $user->name,
]), 25);
```

Tip given by [@PascalBaljet](https://twitter.com/pascalbaljet)

### Updating the model without dispatching events

Sometimes you need to update the model without sending any events. We can now do this with the `updateQuietly()` method, which under the hood uses the `saveQuietly()` method.

```php
$flight->updateQuietly(['departed' => false]);
```

Tip given by [@PascalBaljet](https://twitter.com/pascalbaljet)

### Periodic cleaning of models from obsolete records

To periodically clean models of obsolete records. With this trait, Laravel will do this automatically, only you need to adjust the frequency of the `model:prune` command in the Kernel class.

```php
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Prunable;
class Flight extends Model
{
    use Prunable;
    /**
     * Get the prunable model query.
     *
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function prunable()
    {
        return static::where('created_at', '<=', now()->subMonth());
    }
}
```

Also, in the pruning method, you can set the actions that must be performed before deleting the model:

```php
protected function pruning()
{
    // Removing additional resources,
    // associated with the model. For example, files.

    Storage::disk('s3')->delete($this->filename);
}
```

Tip given by [@PascalBaljet](https://twitter.com/pascalbaljet)

### Immutable dates and casting to them

Laravel 8.53 introduces the `immutable_date` and `immutable_datetime` castes that convert dates to `Immutable`.

Cast to CarbonImmutable instead of a regular Carbon instance.

```php
class User extends Model
{
    public $casts = [
        'date_field'     => 'immutable_date',
        'datetime_field' => 'immutable_datetime',
    ];
}
```

Tip given by [@PascalBaljet](https://twitter.com/pascalbaljet)

### The findOrFail method also accepts a list of ids

The findOrFail method also accepts a list of ids. If any of these ids are not found, then it "fails".

Nice if you need to retrieve a specific set of models and don't want to have to check that the count you got was the count you expected

```php
User::create(['id' => 1]);
User::create(['id' => 2]);
User::create(['id' => 3]);

// Retrieves the user...
$user = User::findOrFail(1);

// Throws a 404 because the user doesn't exist...
User::findOrFail(99);

// Retrieves all 3 users...
$users = User::findOrFail([1, 2, 3]);

// Throws because it is unable to find *all* of the users
User::findOrFail([1, 2, 3, 99]);
```

Tip given by [@timacdonald87](https://twitter.com/timacdonald87/status/1457499557684604930)

### Prunable trait to automatically remove models from your database

New in Laravel 8.50: You can use the Prunable trait to automatically remove models from your database. For example, you can permanently remove soft deleted models after a few days.

```php
class File extends Model
{
    use SoftDeletes;

    // Add Prunable trait
    use Prunable;

    public function prunable()
    {
        // Files matching this query will be pruned
        return static::query()->where('deleted_at', '<=', now()->subDays(14));
    }

    protected function pruning()
    {
        // Remove the file from s3 before deleting the model
        Storage::disk('s3')->delete($this->filename);
    }
}

// Add PruneCommand to your schedule (app/Console/Kernel.php)
$schedule->command(PruneCommand::class)->daily();
```

Tip by [@Philo01](https://twitter.com/Philo01/status/1457626443782008834)

### withAggregate method

Under the hood, the withAvg/withCount/withSum and other methods in Eloquent use the 'withAggregate' method. You can use this method to add a subselect based on a relationship

```php
// Eloquent Model
class Post extends Model
{
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

// Instead of eager loading all users...
$posts = Post::with('user')->get();

// You can add a subselect to only retrieve the user's name...
$posts = Post::withAggregate('user', 'name')->get();

// This will add a 'user_name' attribute to the Post instance:
$posts->first()->user_name;
```

Tip given by [@pascalbaljet](https://twitter.com/pascalbaljet/status/1457702666352594947)

### Date convention

Using the `something_at` convention instead of just a boolean in Laravel models gives you visibility into when a flag was changed – like when a product went live.

```php
// Migration
Schema::table('products', function (Blueprint $table) {
    $table->datetime('live_at')->nullable();
});

// In your model
public function live()
{
    return !is_null($this->live_at);
}

// Also in your model
protected $dates = [
    'live_at'
];
```

Tip given by [@alexjgarrett](https://twitter.com/alexjgarrett/status/1459174062132019212)

### Eloquent multiple upserts

The upsert() method will insert or update multiple records.

- First array: the values to insert or update
- Second: unique identifier columns used in the select statement
- Third: columns that you want to update if the record exists

```php
Flight::upsert([
    ['departure' => 'Oakland', 'destination' => 'San Diego', 'price' => 99],
    ['departure' => 'Chicago', 'destination' => 'New York', 'price' => 150],
], ['departure', 'destination'], ['price']);
```

Tip given by [@mmartin_joo](https://twitter.com/mmartin_joo/status/1461591319516647426)

### Retrieve the Query Builder after filtering the results

To retrieve the Query Builder after filtering the results: you can use `->toQuery()`.

The method internally use the first model of the collection and a `whereKey` comparison on the Collection models.

```php
// Retrieve all logged_in users
$loggedInUsers = User::where('logged_in', true)->get();

// Filter them using a Collection method or php filtering
$nthUsers = $loggedInUsers->nth(3);

// You can't do this on the collection
$nthUsers->update(/* ... */);

// But you can retrieve the Builder using ->toQuery()
if ($nthUsers->isNotEmpty()) {
    $nthUsers->toQuery()->update(/* ... */);
}
```

Tip given by [@RBilloir](https://twitter.com/RBilloir/status/1462529494917566465)

### Custom casts

You can create custom casts to have Laravel automatically format your Eloquent model data. Here's an example that capitalises a user's name when it is retrieved or changed.

```php
class CapitalizeWordsCast implements CastsAttributes
{
    public function get($model, string $key, $value, array $attributes)
    {
        return ucwords($value);
    }

    public function set($model, string $key, $value, array $attributes)
    {
        return ucwords($value);
    }
}

class User extends Model
{
    protected $casts = [
        'name'  => CapitalizeWordsCast::class,
        'email' => 'string',
    ];
}
```

Tip given by [@mattkingshott](https://twitter.com/mattkingshott/status/1462828232206659586)

### Order based on a related model's average or count

Did you ever need to order based on a related model's average or count?

It's easy with Eloquent!

```php
public function bestBooks()
{
    Book::query()
        ->withAvg('ratings as average_rating', 'rating')
        ->orderByDesc('average_rating');
}
```

Tip given by [@mmartin_joo](https://twitter.com/mmartin_joo/status/1466769691385335815)

### Return transactions result

If you have a DB transaction and want to return its result, there are at least two ways, see the example

```php
// 1. You can pass the parameter by reference
$invoice = NULL;
DB::transaction(function () use (&$invoice) {
    $invoice = Invoice::create(...);
    $invoice->items()->attach(...);
})

// 2. Or shorter: just return trasaction result
$invoice = DB::transaction(function () {
    $invoice = Invoice::create(...);
    $invoice->items()->attach(...);

    return $invoice;
});
```

### Remove several global scopes from query

When using Eloquent Global Scopes, you not only can use MULTIPLE scopes, but also remove certain scopes when you don't need them, by providing the array to `withoutGlobalScopes()`

[Link to docs](https://laravel.com/docs/8.x/eloquent#removing-global-scopes)

```php
// Remove all of the global scopes...
User::withoutGlobalScopes()->get();

// Remove some of the global scopes...
User::withoutGlobalScopes([
    FirstScope::class, SecondScope::class
])->get();
```

### Order JSON column attribute

With Eloquent you can order results by a JSON column attribute

```php
// JSON column example:
// bikes.settings = {"is_retired": false}
$bikes = Bike::where('athlete_id', $this->athleteId)
        ->orderBy('name')
        ->orderByDesc('settings->is_retired')
        ->get();
```

Tip given by [@brbcoding](https://twitter.com/brbcoding/status/1473353537983856643)

### Get single column's value from the first result

You can use `value()` method to get single column's value from the first result of a query

```php
// Instead of
Integration::where('name', 'foo')->first()->active;

// You can use
Integration::where('name', 'foo')->value('active');

// or this to throw an exception if no records found
Integration::where('name', 'foo')->valueOrFail('active')';
```

Tip given by [@justsanjit](https://twitter.com/justsanjit/status/1475572530215796744)

### Check if altered value changed key

Ever wanted to know if the changes you've made to a model have altered the value for a key? No problem, simply reach for originalIsEquivalent.

```php
$user = User::first(); // ['name' => "John']

$user->name = 'John';

$user->originalIsEquivalent('name'); // true

$user->name = 'David'; // Set directly
$user->fill(['name' => 'David']); // Or set via fill

$user->originalIsEquivalent('name'); // false
```

Tip given by [@mattkingshott](https://twitter.com/mattkingshott/status/1475843987181379599)

### New way to define accessor and mutator

New way to define attribute accessors and mutators in Laravel 8.77:

```php
// Before, two-method approach
public function setTitleAttribute($value)
{
    $this->attributes['title'] = strtolower($value);
}
public function getTitleAttribute($value)
{
    return strtoupper($value);
}

// New approach
protected function title(): Attribute
{
    return new Attribute(
        get: fn ($value) => strtoupper($value),
        set: fn ($value) => strtolower($value),
    );
}
```

Tip given by [@Teacoders](https://twitter.com/Teacoders/status/1473697808456851466)

### Another way to do accessors and mutators

In case you are going to use the same accessors and mutators in many models , You can use custom casts instead.

Just create a `class` that implements `CastsAttributes` interface. The class should have two methods, the first is `get` to specify how models should be retrieved from the database and the second is `set` to specify how the value will be stored in the database.

```php
<?php

namespace App\Casts;

use Carbon\Carbon;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;

class TimestampsCast implements CastsAttributes
{
    public function get($model, string $key, $value, array $attributes)
    {
        return Carbon::parse($value)->diffForHumans();
    }

    public function set($model, string $key, $value, array $attributes)
    {
        return Carbon::parse($value)->format('Y-m-d h:i:s');
    }
}

```

Then you can implement the cast in the model class.

```php
<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use App\Casts\TimestampsCast;
use Carbon\Carbon;


class User extends Authenticatable
{

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'updated_at' => TimestampsCast::class,
        'created_at' => TimestampsCast::class,
    ];
}

```

Tip given by [@AhmedRezk](https://github.com/AhmedRezk59)

### When searching for the first record, you can perform some actions

When searching for the first record, you want to perform some actions, when you don't find it. `firstOrFail()` throws a 404 Exception.

You can use `firstOr(function() {})` instead. Laravel got your covered

```php
$book = Book::whereCount('authors')
            ->orderBy('authors_count', 'DESC')
            ->having('modules_count', '>', 10)
            ->firstOr(function() {
                // The Sky is the Limit ...

                // You can perform any action here
            });
```

Tip given by [@bhaidar](https://twitter.com/bhaidar/status/1487757487566639113/)

### Directly convert created_at date to human readable format

Did you know you can directly convert created_at date to human readable format like 1 minute ago, 1 month ago using diffForHumans() function. Laravel eloquent by default enables Carbon instance on created_at field.

```php
$post = Post::whereId($id)->first();
$result = $post->created_at->diffForHumans();

/* OUTPUT */
// 1 Minutes ago, 2 Week ago etc..as per created time
```

Tip given by [@vishal\_\_2931](https://twitter.com/vishal__2931/status/1488369014980038662)

### Ordering by an Eloquent Accessor

Ordering by an Eloquent Accessor! Yes, that's doable. Instead of ordering by the accessor on the DB level, we order by the accessor on the returned Collection.

```php
class User extends Model
{
    // ...
    protected $appends = ['full_name'];

    // Since Laravel 9
    protected function full_name(): Attribute
    {
        return Attribute::make(
            get: fn ($value, $attributes) => $attributes['first_name'] . ' ' . $attributes['last_name'];),
        );
    }

    // Laravel 8 and lower
    public function getFullNameAttribute()
    {
        return $this->attribute['first_name'] . ' ' . $this->attributes['last_name'];
    }
    // ..
}
```

```php
class UserController extends Controller
{
    // ..
    public function index()
    {
        $users = User::all();

        // order by full_name desc
        $users->sortByDesc('full_name');

        // or

        // order by full_name asc
        $users->sortBy('full_name');

        // ..
    }
    // ..
}
```

`sortByDesc` and `sortBy` are methods on the Collection

Tip given by [@bhaidar](https://twitter.com/bhaidar/status/1490671693618053123)

### Check for specific model was created or found

If you want to check for specific model was created or found, use `wasRecentlyCreated` model attribute.

```php
$user = User::create([
    'name' => 'Oussama',
]);

// return boolean
return $user->wasRecentlyCreated;

// true for recently created
// false for found (already on you db)
```

Tip given by [@sky_0xs](https://twitter.com/sky_0xs/status/1491141790015320064)

### Laravel Scout with database driver

With laravel v9 you can use Laravel Scout (Search) with database driver. No more where likes!

```php
$companies = Company::search(request()->get('search'))->paginate(15);
```

Tip given by [@magarrent](https://twitter.com/magarrent/status/1493221422675767302)

### Make use of the value method on the query builder

Make use of the `value` method on the query builder to execute a more efficient query when you only need to retrieve a single column.

```php
// Before (fetches all columns on the row)
Statistic::where('user_id', 4)->first()->post_count;

// After (fetches only `post_count`)
Statistic::where('user_id', 4)->value('post_count');
```

Tip given by [@mattkingshott](https://twitter.com/mattkingshott/status/1493583444244410375)

### Pass array to where method

Laravel you can pass an array to the where method.

```php
// Instead of this
JobPost::where('company', 'laravel')
        ->where('job_type', 'full time')
        ->get();

// You can pass an array
JobPost::where(['company' => 'laravel',
                'job_type' => 'full time'])
        ->get();
```

Tip given by [@cosmeescobedo](https://twitter.com/cosmeescobedo/status/1495626752282234881)

### Return the primary keys from models collection

Did you know `modelsKeys()` eloquent collection method? It returns the primary keys from models collection.

```php
$users = User::active()->limit(3)->get();

$users->modelsKeys(); // [1, 2, 3]
```

Tip given by [@iamharis010](https://twitter.com/iamharis010/status/1495816807910891520)

### Force Laravel to use eager loading

If you want to prevent a lazy loading in your app, you only need to add following line to the `boot()` method in your `AppServiceProvider`

```php
Model::preventLazyLoading();
```

But, if you want to enable this feature only on your local development you can change above code on that:

```php
Model::preventLazyLoading(!app()->isProduction());
```

Tip given by [@CatS0up](https://github.com/CatS0up)

### Make all your models mass assignable

It is not a recommended approach for security reasons, but it is possible.

When you want do this, you don't need to set an empty `$guarded` array for every model, like this:

```php
protected $guarded = [];
```

You can do it from a single place, just add following line to the `boot()` method in your `AppServiceProvider`:

```php
Model::unguard();
```

Now, all your models are mass assignable.

Tip given by [@CatS0up](https://github.com/CatS0up)

### Hiding columns in select all statements

If you use Laravel v8.78 and MySQL 8.0.23 and onwards, you can define choosen columns as "invisible". Columns which are define as `invisible` will be hidden from the `select *` statements.

However, to do so, we must use a `invisible()` method in the migration, something like that:

```php
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

Schema::table('table', function (Blueprint $table) {
    $table->string('secret')->nullable()->invisible();
});
```

That's it! This will make chosen column hidden from `select *` statement.

Tip given by [@CatS0up](https://github.com/CatS0up)

### JSON Where Clauses

Laravel offers helpers to query JSON columns for databases that support them.

Currently, MySQL 5.7+, PostgreSQL, SQL Server 2016, and SQLite 3.9.0 (using the JSON1 extension)

```php
// To query a json column you can use the -> operator
$users = User::query()
            ->where('preferences->dining->meal', 'salad')
            ->get();
// You can check if a JSON array contains a set of values
$users = User::query()
            ->whereJsonContains('options->languages', [
                'en', 'de'
               ])
            ->get();
// You can also query by the length a JSON array
$users = User::query()
            ->whereJsonLength('options->languages', '>', 1)
            ->get();
```

Tip given by [@cosmeescobedo](https://twitter.com/cosmeescobedo/status/1509663119311663124)

### Get all the column names for a table

```php
DB::getSchemaBuilder()->getColumnListing('users');
/*
returns [
    'id',
    'name',
    'email',
    'email_verified_at',
    'password',
    'remember_token',
    'created_at',
    'updated_at',
];
*/
```

Tip given by [@aaronlumsden](https://twitter.com/aaronlumsden/status/1511014229737881605)

### Compare the values of two columns

You can use `whereColumn` method to compare the values of two columns.

```php
return Task::whereColumn('created_at', 'updated_at')->get();
// pass a comparison operator
return Task::whereColumn('created_at', '>', 'updated_at')->get();
```

Tip given by [@iamgurmandeep](https://twitter.com/iamgurmandeep/status/1511673260353548294)

### Accessor Caching

As of Laravel 9.6, if you have a computationally intensive accessor, you can use the shouldCache method.

```php
public function hash(): Attribute
{
    return Attribute::make(
        get: fn($value) => bcrypt(gzuncompress($value)),
    )->shouldCache();
}
```

Tip given by [@cosmeescobedo](https://twitter.com/cosmeescobedo/status/1514304409563402244)

### New scalar() method

In Laravel 9.8.0, the `scalar()` method was added that allows you to retrieve the first column of the first row from the query result.

```php
// Before
DB::selectOne("SELECT COUNT(CASE WHEN food = 'burger' THEN 1 END) AS burgers FROM menu_items;")->burgers
// Now
DB::scalar("SELECT COUNT(CASE WHEN food = 'burger' THEN 1 END) FROM menu_items;")
```

Tip given by [@justsanjit](https://twitter.com/justsanjit/status/1514550185837408265)

### Select specific columns

To select specific columns on a model you can use the select method -- or you can pass an array directly to the get method!

```php
// Select specified columns from all employees
$employees = Employee::select(['name', 'title', 'email'])->get();
// Select specified columns from all employees
$employees = Employee::get(['name', 'title', 'email']);
```

Tip given by [@ecrmnn](https://twitter.com/ecrmnn/status/1516087672351203332)

### Chain conditional clauses to the query without writing if-else statements

The "when" helper in the query builder is🔥

You can chain conditional clauses to the query without writing if-else statements.

Makes your query very clear:

```php
class RatingSorter extends Sorter
{
    function execute(Builder $query)
    {
        $query
            ->selectRaw('AVG(product_ratings.rating) AS avg_rating')
            ->join('product_ratings', 'products.id', '=', 'product_ratings.product_id')
            ->groupBy('products.id')
            ->when(
                $this->direction === SortDirections::Desc,
                fn () => $query->orderByDesc('avg_rating')
                fn () => $query->orderBy('avg_rating'),
            );

        return $query;
    }
}
```

Tip given by [@mmartin_joo](https://twitter.com/mmartin_joo/status/1521461317940350976)

### Override Connection Attribute in Models

Overriding the database connection attribute for individual models in Laravel can be a powerful technique. Here are a few use cases where you might find it especially handy:

#### 1. Multiple Database Connections

If your application uses multiple database connections (e.g., MySQL, PostgreSQL, or different instances of the same database), you may want to specify which connection should be used for a particular model. By overriding the `$connection` property, you can easily manage these connections and ensure your models are interacting with the appropriate databases.

#### 2. Data Sharding

In cases where you're using data sharding to distribute your data across multiple databases, you might have different models that map to different shards. Overriding the connection attribute in each model allows you to define which shard should be used without affecting other models or the default connection.

#### 3. Third-Party Integration

When integrating with third-party services that provide their own database, you may need to use a specific connection for a model representing data from that service. Overriding the connection attribute in that model will ensure it connects to the right database while keeping your application's default settings intact.

#### 4. Multi-Tenancy Applications

In a multi-tenant application, you may have separate databases for each tenant. By overriding the `$connection` property dynamically in your models, you can easily switch between tenant databases based on the current user, ensuring data isolation and proper resource management.

To override the connection attribute in a model, define the `$connection` property within the class:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomModel extends Model
{
    protected $connection = 'your_custom_connection';
}
```
### Using Column Names in Where Clauses (Dynamic Where Clauses)

You can use column names in where clause to make dynamic where clauses. In the following example, we use ```whereName('John')``` instead of ```where('name', 'John')```.

```php
<?php

namespace App\Http\Controllers;

use App\Models\User;

class UserController extends Controller
{
    public function example()
    {
        return User::whereName('John')->get();
    }
}
```
Tip given by [@MNurullahSaglam](https://twitter.com/MNurullahSaglam/status/1699763337586749585)
