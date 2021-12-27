# Laravel Tips

Awesome Laravel tips and tricks for all artisans. PR and ideas are welcome!  
An idea by [PovilasKorop](https://github.com/PovilasKorop) and [MarceauKa](https://github.com/MarceauKa).

Hey, like these tips? Also check out my premium [Laravel courses](https://laraveldaily.teachable.com/)

---

Or you want the chinese version:
[中文版本](https://github.com/Lysice/laravel-tips-chinese/blob/master/README-zh.md)

---

__Update 27 December 2021__: Currently there are __208 tips__ divided into 14 sections.

## Table of Contents

- [DB Models and Eloquent](#db-models-and-eloquent) (56 tips)
- [Models Relations](#models-relations) (31 tips)
- [Migrations](#migrations) (13 tips)
- [Views](#views) (11 tips)
- [Routing](#routing) (21 tips)
- [Validation](#validation) (14 tips)
- [Collections](#collections) (6 tips)
- [Auth](#auth) (5 tips)
- [Mail](#mail) (5 tips)
- [Artisan](#artisan) (5 tips)
- [Factories](#factories) (4 tips)
- [Log and debug](#log-and-debug) (4 tips)
- [API](#api) (2 tips)
- [Other](#other) (31 tips)


## DB Models and Eloquent

⬆️ [Go to top](#laravel-tips) ➡️ [Next (Models Relations)](#models-relations)
- [Reuse or clone query](#reuse-or-clone-query)
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
- [Change Format of Created_at and Updated_at](#change-format-of-created_at-and-updated_at)
- [Storing Array Type into JSON](#storing-array-type-into-json)
- [Make a Copy of the Model](#make-a-copy-of-the-model)
- [Reduce Memory](#reduce-memory)
- [Force query without $fillable/$guarded](#force-query-without-fillableguarded)
- [3-level structure of parent-children](#3-level-structure-of-parent-children)
- [Use find to search multiple records](#use-find-to-search-multiple-records)
- [Perform any action on failure](#perform-any-action-on-failure)
- [Check if record exists or show 404](#check-if-record-exists-or-show-404)
- [Abort if condition failed](#abort-if-condition-failed)
- [Perform any extra steps before deleting model](#perform-any-extra-steps-before-deleting-model)
- [Fill a column automatically while you persist data to the database](#fill-a-column-automatically-while-you-persist-data-to-the-database)
- [Extra information about the query](#extra-information-about-the-query)
- [Using the doesntExist() method in Laravel](#using-the-doesntexist-method-in-laravel)
- [Trait that you want to add to a few Models to call their boot() method automatically](#trait-that-you-want-to-add-to-a-few-models-to-call-their-boot-method-automatically)
- [There are two common ways of determining if a table is empty in Laravel](#there-are-two-common-ways-of-determining-if-a-table-is-empty-in-laravel)
- [How to prevent “property of non-object” error](#how-to-prevent-property-of-non-object-error)
- [Get original attributes after mutating an Eloquent record](#get-original-attributes-after-mutating-an-eloquent-record)
- [A simple way to seed a database](#a-simple-way-to-seed-a-database)
- [The crossJoinSub method of the query constructor](#the-crossJoinSub-method-of-the-query-constructor)
- [Order by Pivot Fields](#order-by-pivot-fields)
- [Belongs to Many Pivot table naming](#belongs-to-many-pivot-table-naming)
- [Find a single record from a database](#find-a-single-record-from-a-database)
- [Automatic records chunking](#automatic-records-chunking)
- [Updating the model without dispatching events](#updating-the-model-without-dispatching-events)
- [Periodic cleaning of models from obsolete records](#periodic-cleaning-of-models-from-obsolete-records)
- [Immutable dates and casting to them](#immutable-dates-and-casting-to-them)

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

But, after getting `$active products` the` $query `will be modified. So, `$inactive_products` will not find any inactive products from `$query`  and that will return blank collection every time. Cause, that will try to find inactive products from `$active_products` (`$query` will return active products only).

For solve this issue, we can query multiple time by reusing this `$query` object.
So, We need to clone this `$query` before doing any `$query` modification action.

```php
$active_products = (clone $query)->where('status', 1)->get(); // it will not modify the $query
$inactive_products = (clone $query)->where('status', 0)->get(); // so we will get inactive products from $query

```

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

Tip given by [@tahiriqbalnajam](https://twitter.com/tahiriqbalnajam/status/1436120403655671817)

### Find Many and return specific columns

Eloquent method `find()` may accept multiple parameters, and then it returns a Collection of all records found with specificied columns, not all columns of model:
```php
// Will return Eloquent Model with first_name and email only
$user = User::find(1, ['first_name', 'email']);
// Will return Eloquent Collection with first_name and email only
$users = User::find([1,2,3], ['first_name', 'email']);
```
Tip given by [@tahiriqbalnajam](https://github.com/tahiriqbalnajam)

### Find by Key

You can also find multiple records with `whereKey()` method which takes care of which field is exactly your primary key (`id` is the default but you may override it in Eloquent model):

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
```php
public function getCreatedAtFormattedAttribute()
{
   return $this->created_at->format('H:i d, M Y');
}
```
So you can use it `$entry->created_at_formatted` when it's needed.
It will return the `created_at` attribute like this: `04:19 23, Aug 2020`.

And also for changing format of `updated_at` attribute, you can add this method :
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

### Use find to search multiple records
You can use Eloquent `find()` not only to search for one record but also to return a collection of multiple records by their IDs.
Instead of
```php
return Product::whereIn('id', $this->productIDs)->get();
```
You can do this
```php
return Product::find($this->productIDs)
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

### Perform any extra steps before deleting model

Tip given by [@back2Lobby](https://github.com/back2Lobby)

We can use `Model::delete()` in the overridden delete method to perform additional steps.
```php
// App\Models\User.php

public function delete(){

	//extra steps here whatever you want
	
	//now perform the normal deletion
	Model::delete();
}
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
There are two common ways of determining if a table is empty in Laravel. Calling `exists()` or `count()` directly on the model!<br>
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
    return $this->belongsTo('App\Author')->withDefault();
}
// or
public function author() {
    return $this->belongsTo('App\Author')->withDefault([
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

## Models Relations

⬆️ [Go to top](#laravel-tips) ⬅️ [Previous (DB Models and Eloquent)](#db-models-and-eloquent) ➡️ [Next (Migrations)](#migrations)

- [OrderBy on Eloquent relationships](#orderby-on-eloquent-relationships)
- [Conditional relationships](#conditional-relationships)
- [Raw DB Queries: havingRaw()](#raw-db-queries-havingraw)
- [Eloquent has() deeper](#eloquent-has-deeper)
- [Has Many. How many exactly?](#has-many-how-many-exactly)
- [Default model](#default-model)
- [Use hasMany to create Many](#use-hasmany-to-create-many)
- [Multi level Eager Loading](#multi-level-eager-loading)
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
- [Randomize Relationship Order](#randomize-relationship-order)
- [Filter hasMany relationships](#filter-hasmany-relationships)
- [Filter by many-to-many relationship pivot column](#filter-by-many-to-many-relationship-pivot-column)
- [A shorter way to write whereHas](#a-shorter-way-to-write-whereHas)
- [You can add conditions to your relationships](#you-can-add-conditions-to-your-relationships)
- [New `whereBelongsTo()` Eloquent query builder method](#new-wherebelongsto-eloquent-query-builder-method)
- [The `is()` method of one-to-one relationships for comparing models](#the-is-method-of-one-to-one-relationships-for-comparing-models)
- [`whereHas()` multiple connections](#wherehas-multiple-connections)


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

### Multi level Eager Loading

In Laravel you can Eager Load multiple levels in one statement, in this example we not only load the author relation but also the country relation on the author model.

```php
$users = App\Book::with('author.country')->get();
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
Do `if-else`, or `{{ $model->relationship->field ?? '' }}` in Blade, or `{{ optional($model->relationship)->field }}`.  With php8 you can even use the nullsafe operator `{{ $model->relationship?->field) }}`

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
    $table->foreignId('created_by_id')->constrained('users', 'column');
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

```bash
php artisan make:model RoleUser --pivot
```

Next, specify it in `belongsToMany()` with `->using()` method. Then you could do magic, like in the example.

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

### Randomize Relationship Order

You can use `inRandomOrder()` to randomize Eloquent query result, but also you can use it to randomize the **relationship** entries you're loading with query.

```php
// If you have a quiz and want to randomize questions...

// 1. If you want to get questions in random order:
$questions = Question::inRandomOrder()->get();

// 2. If you want to also get question options in random order:
$questions = Question::with(['answers' => function($q) {
    $q->inRandomOrder();
}])->inRandomOrder()->get();
```

### Filter hasMany relationships
Just a code example from my project, showing the possibility of filtering hasMany relationships.<br>
TagTypes -> hasMany Tags -> hasMany Examples<br>
And you wanna query all the types, with their tags, but only those that have examples, ordering by most examples.
```php
$tag_types = TagType::with(['tags' => function ($query) {
    $query->has('examples')
        ->withCount('examples')
        ->orderBy('examples_count', 'desc');
    }])->get();
```

### Filter by many-to-many relationship pivot column
If you have a many-to-many relationship, and you add an extra column to the pivot table, here's how you can order by it when querying the list.
```php
class Tournament extends Model
{
    public function countries()
    {
        return $this->belongsToMany(Country::class)->withPivot(['position']);
    }
}
```
```php
class TournamentsController extends Controller

public function whatever_method() {
    $tournaments = Tournament::with(['countries' => function($query) {
            $query->orderBy('position');
        }])->latest()->get();
}
```

### A shorter way to write whereHas
Released in Laravel 8.57: a shorter way to write whereHas() with a simple condition inside.
```php
// Before
User::whereHas('posts', function ($query) {
    $query->where('published_at', '>', now());
})->get();

// After
User::whereRelation('posts', 'published_at', '>', now())->get();
```

### You can add conditions to your relationships
```php
class User
{
    public function posts()
    {
        return $this->hasMany(Post::class);
    }
    
    // with a getter
    public function getPublishedPostsAttribute()
    {
        return $this->posts->filter(fn ($post) => $post->published);
    }
    
    // with a relationship
    public function publishedPosts()
    {
        return $this->hasMany(Post::class)->where('published', true);
    }
}
```

Tip given by [@anwar_nairi](https://twitter.com/anwar_nairi/status/1441718371335114756)

### New `whereBelongsTo()` Eloquent query builder method
Laravel 8.63.0 ships with a new `whereBelongsTo()` Eloquent query builder method. Smiling face with heart-shaped eyes<br>
This allows you to remove BelongsTo foreign key names from your queries, and use the relationship method as a single source of truth instead!
```php
// From:
$query->where('author_id', $author->id)

// To:
$query->whereBelongsTo($author)

// Easily add more advanced filtering:
Post::query()
    ->whereBelongsTo($author)
    ->whereBelongsTo($cateogry)
    ->whereBelongsTo($section)
    ->get();

// Specify a custom relationship:
$query->whereBelongsTo($author, 'author')
```

Tip given by [@danjharrin](https://twitter.com/danjharrin/status/1445406334405459974)

### The `is()` method of one-to-one relationships for comparing models
We can now make comparisons between related models without further database access.
```php
// BEFORE: the foreign key is taken from the Post model
$post->author_id === $user->id;

// BEFORE: An additional request is made to get the User model from the Author relationship
$post->author->is($user);

// AFTER
$post->author()->is($user);
```

Tip given by [@PascalBaljet](https://twitter.com/pascalbaljet)

### `whereHas()` multiple connections

```php
// User Model
class User extends Model
{
    protected $connection = 'conn_1';

    public function posts()
    {
        return $this->hasMany(Post::class);
    }
}

// Post Model
class Post extends Model
{
    protected $connection = 'conn_2';

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}

// wherehas()
$posts = Post::whereHas('user', function ($query) use ($request) {
      $query->from('db_name_conn_1.users')->where(...);
  })->get();
```

Tip given by [@adityaricki](https://twitter.com/adityaricki2)

## Migrations

⬆️ [Go to top](#laravel-tips) ⬅️ [Previous (Models Relations)](#models-relations) ➡️ [Next (Views)](#views)

- [Unsigned Integer](#unsigned-integer)
- [Order of Migrations](#order-of-migrations)
- [Migration fields with timezones](#migration-fields-with-timezones)
- [Database migrations column types](#database-migrations-column-types)
- [Default Timestamp](#default-timestamp)
- [Migration Status](#migration-status)
- [Create Migration with Spaces](#create-migration-with-spaces)
- [Create Column after Another Column](#create-column-after-another-column)
- [Make migration for existing table](#make-migration-for-existing-table)
- [Output SQL before running migrations](#output-sql-before-running-migrations)
- [Anonymous Migrations](#anonymous-migrations)
- [You can add "comment" about a column inside your migrations](#you-can-add-comment-about-a-column-inside-your-migrations)
- [Checking For Table / Column Existence](#checking-for-table--column-existence)


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
`useCurrent()` and `useCurrentOnUpdate()`, it will set `CURRENT_TIMESTAMP` as default value.

```php
$table->timestamp('created_at')->useCurrent();
$table->timestamp('updated_at')->useCurrentOnUpdate();
```

### Migration Status

If you want to check what migrations are executed or not yet, no need to look at the database "migrations" table, you can launch `php artisan migrate:status` command.

Example result:

```
+------+------------------------------------------------+-------+
| Ran? | Migration                                      | Batch |
+------+------------------------------------------------+-------+
| Yes  | 2014_10_12_000000_create_users_table           | 1     |
| Yes  | 2014_10_12_100000_create_password_resets_table | 1     |
| No   | 2019_08_19_000000_create_failed_jobs_table     |       |
+------+------------------------------------------------+-------+
```

### Create Migration with Spaces

When typing `make:migration` command, you don't necessarily have to use underscore `_` symbol between parts, like `create_transactions_table`. You can put the name into quotes and then use spaces instead of underscores.

```php
// This works
php artisan make:migration create_transactions_table

// But this works too
php artisan make:migration "create transactions table"
```

Source: [Steve O on Twitter](https://twitter.com/stephenoldham/status/1353647972991578120)

### Create Column after Another Column

_Notice: Only MySQL_

If you're adding a new column to the existing table, it doesn't necessarily have to become the last in the list. You can specify after which column it should be created:

```php
Schema::table('users', function (Blueprint $table) {
    $table->string('phone')->after('email');
});
```

If you're adding a new column to the existing table, it doesn't necessarily have to become the last in the list. You can specify before which column it should be created:

```php
Schema::table('users', function (Blueprint $table) {
    $table->string('phone')->before('created_at');
});
```

If you want your column to be the first in your table , then use the first method.

```php
Schema::table('users', function (Blueprint $table) {
    $table->string('uuid')->first();
});
```

Also the `after()` method can now be used to add multiple fields.
```php
Schema::table('users', function (Blueprint $table) {
    $table->after('remember_token', function ($table){
        $table->string('card_brand')->nullable();
        $table->string('card_last_four', 4)->nullable();
    });
});
```

### Make migration for existing table
If you make a migration for existing table, and you want Laravel to generate the Schema::table() for you, then add "_in_xxxxx_table" or "_to_xxxxx_table" at the end, or specify "--table" parameter.
`php artisan change_fields_products_table` generates empty class
```php
class ChangeFieldsProductsTable extends Migration
{
    public function up()
    {
        //
    }
}
```
But add `in_xxxxx_table` `php artisan make:migration change_fields_in_products_table` and it generates class with `Schemma::table()` pre-fileed
```php
class ChangeFieldsProductsTable extends Migration
{
    public function up()
    {
        Schema::table('products', function (Blueprint $table) {
            //
        })
    };
}
```
Also you can specify `--table` parameter `php artisan make:migration whatever_you_want --table=products`
```php
class WhateverYouWant extends Migration
{
    public function up()
    {
        Schema::table('products', function (Blueprint $table) {
            //
        })
    };
}
```

### Output SQL before running migrations

When typing `migrate --pretend` command, you get the SQL query that will be executed in the terminal. It's an interesting way to debug SQL if necessary.

```php
// Artisan command
php artisan migrate --pretend
```

### Anonymous Migrations
The Laravel team released Laravel 8.37 with anonymous migration support, which solves a GitHub issue with migration class name collisions. The core of the problem is that if multiple migrations have the same class name, it'll cause issues when trying to recreate the database from scratch.
Here's an example from the [pull request](https://github.com/laravel/framework/pull/36906) tests:

```php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(
    {
        Schema::table('people', function (Blueprint $table) {
            $table->string('first_name')->nullable();
        });
    }

    public function down()
    {
        Schema::table('people', function (Blueprint $table) {
            $table->dropColumn('first_name');
        });
    }
};
```

Tip given by [@nicksdot](https://twitter.com/nicksdot/status/1432340806275198978)

### You can add "comment" about a column inside your migrations
You can add "comment" about a column inside your migrations and provide useful information.<br>
If database is managed by someone other than developers, they can look at comments in Table structure before performing any operations.
```php
$table->unsignedInteger('interval')
    ->index()
    ->comment('This column is used for indexing.')   
```

Tip given by [@nicksdot](https://twitter.com/nicksdot/status/1432340806275198978)

### Checking For Table / Column Existence
You may check for the existence of a table or column using the hasTable and hasColumn methods:
```php
if (Schema::hasTable('users')) {
    // The "users" table exists...
}

if (Schema::hasColumn('users', 'email')) {
    // The "users" table exists and has an "email" column...
}
```

Tip given by [@dipeshsukhia](https://github.com/dipeshsukhia)

## Views

⬆️ [Go to top](#laravel-tips) ⬅️ [Previous (Migrations)](#migrations) ➡️ [Next (Routing)](#routing)

- [$loop variable in foreach](#loop-variable-in-foreach)
- [Does view file exist?](#does-view-file-exist)
- [Error code Blade pages](#error-code-blade-pages)
- [View without controllers](#view-without-controllers)
- [Blade @auth](#blade-auth)
- [Two-level $loop variable in Blade](#two-level-loop-variable-in-blade)
- [Create Your Own Blade Directive](#create-your-own-blade-directive)
- [Blade Directives: IncludeIf, IncludeWhen, IncludeFirst](#blade-directives-includeif-includewhen-includefirst)
- [Use Laravel Blade-X variable binding to save even more space](#use-laravel-blade-x-variable-binding-to-save-even-more-space)
- [Blade components props](#blade-components-props)
- [Blade Autocomplete typehint](#blade-autocomplete-typehint)

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

### Use Laravel Blade-X variable binding to save even more space
```php
// Using include, the old way
@include("components.post", ["title" => $post->title])

// Using Blade-X
<x-post link="{{ $post->title }}" />

// Using Blade-X variable binding
<x-post :link="$post->title" />
```

Tip given by [@anwar_nairi](https://twitter.com/anwar_nairi/status/1442441888787795970)

### Blade components props
```php
// button.blade.php
@props(['rounded' => false])

<button {{ $attributes->class([
    'bg-red-100 text-red-800',
    'rounded' => $rounded
    ]) }}>
    {{ $slot }}
</button>

// view.blade.php
// Non-rounded:
<x-button>Submit</x-button>

// Rounded:
<x-button rounded>Submit</x-button>
```

Tip given by [@godismyjudge95](https://twitter.com/godismyjudge95/status/1448825909167931396)

### Blade Autocomplete typehint
```php
@php
    /* @var App\Models\User $user */
@endphp

<div>
    // your ide will typehint the property for you 
    {{$user->email}}
</div>
```

Tip given by [@freekmurze](https://twitter.com/freekmurze/status/1455466663927746560)

## Routing

⬆️ [Go to top](#laravel-tips) ⬅️ [Previous (Views)](#views) ➡️ [Next (Validation)](#validation)

- [Route group within a group](#route-group-within-a-group)
- [Wildcard subdomains](#wildcard-subdomains)
- [What's behind the routes?](#whats-behind-the-routes)
- [Route Model Binding: You can define a key](#route-model-binding-you-can-define-a-key)
- [Quickly Navigate from Routes file to Controller](#quickly-navigate-from-routes-file-to-controller)
- [Route Fallback: When no Other Route is Matched](#route-fallback-when-no-other-route-is-matched)
- [Route Parameters Validation with RegExp](#route-parameters-validation-with-regexp)
- [Rate Limiting: Global and for Guests/Users](#rate-limiting-global-and-for-guestsusers)
- [Query string parameters to Routes](#query-string-parameters-to-routes)
- [Separate Routes by Files](#separate-routes-by-files)
- [Translate Resource Verbs](#translate-resource-verbs)
- [Custom Resource Route Names](#custom-resource-route-names)
- [More Readable Route List](#more-readable-route-list)
- [Eager load relationship](#eager-load-relationship)
- [Localizing Resource URIs](#localizing-resource-uris)
- [Resource Controllers naming](#resource-controllers-naming)
- [Easily highlight your navbar menus](#easily-highlight-your-navbar-menus)
- [Generate absolute path using route() helper](#generate-absolute-path-using-route-helper)
- [Override the route binding resolver for each of your models](#override-the-route-binding-resolver-for-each-of-your-models)
- [If you need public URL but you want them to be secured](#if-you-need-public-url-but-you-want-them-to-be-secured)
- [Using Gate in middleware method](#using-gate-in-middleware-method)

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

### More Readable Route List

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

### Eager load relationship
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
In Resource Controllers, in `routes/web.php` you can specify `->names()` parameter, so the URL prefix and the route name prefix may be different.<br>
This will generate URLs like `/p`, `/p/{id}`, `/p/{id}/edit` etc. But you would call them:
- route('products.index)
- route('products.create)
- etc
```php
Route::resource('p', \App\Http\Controllers\ProductController::class)->names('products');
```

### Easily highlight your navbar menus
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

### Generate absolute path using route() helper
```php
route('page.show', $page->id);
// http://laravel.test/pages/1

route('page.show', $page->id, false);
// /pages/1
```

Tip given by [@oliverds_](https://twitter.com/oliverds_/status/1445796035742240770)

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

### If you need public URL but you want them to be secured
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


### Using Gate in middleware method
You can use the gates you specified in `App\Providers\AuthServiceProvider` in middleware method.

To do this, you just need to put inside the `can:` and the names of the necessary gates.

```php
Route::put('/post/{post}', function (Post $post) {
    // The current user may update the post...
})->middleware('can:update,post');
```

## Validation

⬆️ [Go to top](#laravel-tips) ⬅️ [Previous (Routing)](#routing) ➡️ [Next (Collections)](#collections)

- [Image validation](#image-validation)
- [Custom validation error messages](#custom-validation-error-messages)
- [Validate dates with "now" or "yesterday" words](#validate-dates-with-now-or-yesterday-words)
- [Validation Rule with Some Conditions](#validation-rule-with-some-conditions)
- [Change Default Validation Messages](#change-default-validation-messages)
- [Prepare for Validation](#prepare-for-validation)
- [Stop on First Validation Error](#stop-on-first-validation-error)
- [Throw 422 status code without using validate() or Form Request](#throw-422-status-code-without-using-validate-or-form-request)
- [Rules depending on some other conditions](#rules-depending-on-some-other-conditions)
- [With Rule::when() we can conditionally apply validation rules](#with-rulewhen-we-can-conditionally-apply-validation-rules)
- [Use this property in the request classes to stop the validation of the whole request attributes](#use-this-property-in-the-request-classes-to-stop-the-validation-of-the-whole-request-attributes)
- [Rule::unique doesn't take into the SoftDeletes Global Scope applied on the Model](#ruleunique-doesnt-take-into-the-softdeletes-global-scope-applied-on-the-model)
- [Validator::sometimes() method allows us to define when a validation rule should be applied](#validatorsometimes-method-allows-us-to-define-when-a-validation-rule-should-be-applied)
- [Array elements validation](#array-elements-validation)

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
If you need to stop validation on the first error in `FormRequest` class, you can set `stopOnFirstFailure` property to `true`:
```php
protected $stopOnFirstFailure = true;
```

### Throw 422 status code without using validate() or Form Request
If you don't use validate() or Form Request, but still need to throw errors with the same 422 status code and error structure, you can do it manually `throw ValidationException::withMessages()`

```php
if (! $user || ! Hash::check($request->password, $user->password)) {
    throw ValidationException::withMessages([
        'email' => ['The provided credentials are incorrect.'],
    ]);
}
```

### Rules depending on some other conditions
If your rules are dynamic and depend on some other condition, you can create that array of rules on the fly
```php
    public function store(Request $request)
    {
        $validationArray = [
            'title' => 'required',
            'company' => 'required',
            'logo' => 'file|max:2048',
            'location' => 'required',
            'apply_link' => 'required|url',
            'content' => 'required',
            'payment_method_id' => 'required'
        ];

        if (!Auth::check()) {
            $validationArray = array_merge($validationArray, [
                'email' => 'required|email|unique:users',
                'password' => 'required|confirmed|min:5',
                'name' => 'required'
            ]);
        }
        //
    }
```

### With Rule::when() we can conditionally apply validation rules
Thanks to Rule::when() we can conditionally apply validation rules in laravel.<br>
In this example we validate the value of the vote only if the user can actually vote the post.
```php
use Illuminate\Validation\Rule;

public function rules()
{
    return [
        'vote' => Rule::when($user->can('vote', $post), 'required|int|between:1,5'),
    ]
}
```

Tip given by [@cerbero90](https://twitter.com/cerbero90/status/1434426076198014976)

### Use this property in the request classes to stop the validation of the whole request attributes
Use this property in the request classes to stop the validation of the whole request attributes.<br><br>

Hint Direct<br>
This is different from `Bail` rule that stops the validation for just a single attribute if one of its rules doesn't validate.
```php
/**
* Indicated if the validator should stop
 * the entire validation once a single
 * rule failure has occurred.
 */
protected $stopOnFirstFailure = true;
```

Tip given by [@Sala7JR](https://twitter.com/Sala7JR/status/1436172331198603270)

### Rule::unique doesn't take into the SoftDeletes Global Scope applied on the Model
Strange that `Rule::unique` doesn't take into the SoftDeletes Global Scope applied on the Model, by default.<br>
But `withoutTrashed()` method is available
```php
Rule::unique('users', 'email')->withoutTrashed();
```

Tip given by [@Zubairmohsin33](https://twitter.com/Zubairmohsin33/status/1438490197956702209)

### Validator::sometimes() method allows us to define when a validation rule should be applied
The laravel `Validator::sometimes()` method allows us to define when a validation rule should be applied, based on the input provided.<br>
The snippet shows how to prohibit the use of a coupon if the quantity of the purchased items is not enough.
```php
$data = [
    'coupon' => 'PIZZA_PARTY',
    'items' => [
        [
            'id' => 1,
            'quantity' => 2
        ],
        [
            'id' => 2,
            'quantity' => 2,
        ],
    ],
];

$validator = Validator::make($data, [
    'coupon' => 'exists:coupons,name',
    'items' => 'required|array',
    'items.*.id' => 'required|int',
    'items.*.quantity' => 'required|int',
]);

$validator->sometimes('coupon', 'prohibited', function (Fluent $data) {
    return collect($data->items)->sum('quantity') < 5;
});

// throws a ValidationException as the quantity provided is not enough
$validator->validate();
```

Tip given by [@cerbero90](https://twitter.com/cerbero90/status/1440226037972013056)

### Array elements validation
If you want to validate elements of an array that you submited use dot notation in rules with '*'
```php
// say you have this array
// array in request 'user_info'
$request->validated()->user_info = [
    [
        'name' => 'Qasim',
        'age' => 26,
    ],
    [
        'name' => 'Ahmed',
        'age' => 23,
    ],
];

// Rule
$rules = [
    'user_info.*.name' => ['required', 'alpha'],
    'user_info.*.age' => ['required', 'numeric'],
];
```

Tip given by [HydroMoon](https://github.com/HydroMoon)


## Collections

⬆️ [Go to top](#laravel-tips) ⬅️ [Previous (Validation)](#validation) ➡️ [Next (Auth)](#auth)

- [Don’t Filter by NULL in Collections](#dont-filter-by-null-in-collections)
- [Use groupBy on Collections with Custom Callback Function](#use-groupby-on-collections-with-custom-callback-function)
- [Multiple Collection Methods in a Row](#multiple-collection-methods-in-a-row)
- [Calculate Sum with Pagination](#calculate-sum-with-pagination)
- [Serial no. in foreach loop with pagination](#serial-no-in-foreach-loop-with-pagination)
- [Higher order collection methods](#higher-order-collection-methods)

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

If you want to group result by some condition which isn’t a direct column in your database, you can do that by providing a closure function.

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

### Serial no in foreach loop with pagination
We can use foreach collection items index as serial no (SL) in pagination.

```php
   ...
   <th>Serial</th>
    ...
    @foreach ($products as $product)
    <tr>
        <td>{{ $loop->index + $product->firstItem() }}</td>
        ...
    @endforeach
```
it will solve the issue of next pages(?page=2&...) index count from continue.

### Higher order collection methods

Collections have higher order methods, this are methods that can be chained , like `groupBy()` , `map()` ... Giving you a fluid syntax.  This example calculates the
price per group of products on an offer.

```php
$offer = [
        'name'  => 'offer1',
        'lines' => [
            ['group' => 1, 'price' => 10],
            ['group' => 1, 'price' => 20],
            ['group' => 2, 'price' => 30],
            ['group' => 2, 'price' => 40],
            ['group' => 3, 'price' => 50],
            ['group' => 3, 'price' => 60]
        ]
];
                
$totalPerGroup = collect($offer->lines)->groupBy('group')->map(fn($group) => $group->sum('price')); 
```

## Auth

⬆️ [Go to top](#laravel-tips) ⬅️ [Previous (Collections)](#collections) ➡️ [Next (Mail)](#mail)

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

⬆️ [Go to top](#laravel-tips) ⬅️ [Previous (Auth)](#auth) ➡️ [Next (Artisan)](#artisan)

- [Testing email into laravel.log](#testing-email-into-laravellog)
- [Preview Mailables](#preview-mailables)
- [Preview Mail without Mailables](#preview-mail-without-mailables)
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

## Artisan

⬆️ [Go to top](#laravel-tips) ⬅️ [Previous (Mail)](#mail) ➡️ [Next (Factories)](#factories)

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

⬆️ [Go to top](#laravel-tips) ⬅️ [Previous (Artisan)](#artisan) ➡️ [Next (Log and debug)](#log-and-debug)

- [Factory callbacks](#factory-callbacks)
- [Generate Images with Seeds/Factories](#generate-images-with-seedsfactories)
- [Override values and apply custom login to them](#override-values-and-apply-custom-login-to-them)
- [Using factories with relationships](#using-factories-with-relationships)

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

### Override values and apply custom login to them
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

### Using factories with relationships
When using factories with relationships, Laravel also provides magic methods.
```php
// magic factory relationship methods
User::factory()->hasPosts(3)->create();

// instead of
User::factory()->has(Post::factory()->count(3))->create();
```

Tip given by [@oliverds_](https://twitter.com/oliverds_/status/1441447356323430402)

## Log and debug

⬆️ [Go to top](#laravel-tips) ⬅️ [Previous (Factories)](#factories) ➡️ [Next (API)](#api)

- [Logging with parameters](#logging-with-parameters)
- [More convenient DD](#more-convenient-dd)
- [Log with context](#log-with-context)
- [Quickly output an Eloquent query in its SQL form](#quickly-output-an-eloquent-query-in-its-sql-form)

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

### Log with context
New in Laravel 8.49: `Log::withContext()` will help you to differentiate the Log messages between different requests.<br>
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


## API

⬆️ [Go to top](#laravel-tips) ⬅️ [Previous (Log and debug)](#log-and-debug) ➡️ [Next (Other)](#other)

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

Tip given by [@phillipmwaniki](https://twitter.com/phillipmwaniki/status/1445230637544321029)

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

⬆️ [Go to top](#laravel-tips) ⬅️ [Previous (API)](#api)

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
- [Data Get Function](#data-get-function)
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

Change 7.* to whichever version you want.

### Add Parameters to Pagination Links

In default Pagination links, you can pass additional parameters, preserve the original query string, or even point to a specific `#xxxxx` anchor.

```blade
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


### Request: has any

You can check not only one parameter with `$request->has()` method, but also check for multiple parameters present, with `$request->hasAny()﻿`:

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

### Data Get Function

If you have an array complex data structure, for example a nested array with objects. You can use `data_get()` helper function retrieves a value from a nested array or object using "dot" notation and wildcard:

```php
// We have an array
[ 
  0 => 
	['user_id' =>'some user id', 'created_at' => 'some timestamp', 'product' => {object Product}, etc], 
  1 =>  
  	['user_id' =>'some user id', 'created_at' => 'some timestamp', 'product' => {object Product}, etc],  
  2 =>  etc
]

// Now we want to get all products ids. We can do like this:

data_get($yourArray,  '*.product.id');

// Now we have all products ids [1, 2, 3, 4, 5, etc...]
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
_Keep in mind: to use it in __production__, you need to move faker from `"require-dev"` to `"require"` in `composer.json`_
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

Tip given by [@oliverds_](https://twitter.com/oliverds_/status/1439997820228890626)

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

