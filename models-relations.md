## Models Relations

⬆️ [Go to main menu](README.md#laravel-tips) ⬅️ [Previous (DB Models and Eloquent)](db-models-and-eloquent.md) ➡️ [Next (Migrations)](migrations.md)

- [OrderBy on Eloquent relationships](#orderby-on-eloquent-relationships)
- [Add where statement to Many-to-Many relation](#add-where-statement-to-many-to-many-relation)
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
- [A shorter way to write whereHas](#a-shorter-way-to-write-wherehas)
- [You can add conditions to your relationships](#you-can-add-conditions-to-your-relationships)
- [New `whereBelongsTo()` Eloquent query builder method](#new-wherebelongsto-eloquent-query-builder-method)
- [The `is()` method of one-to-one relationships for comparing models](#the-is-method-of-one-to-one-relationships-for-comparing-models)
- [`whereHas()` multiple connections](#wherehas-multiple-connections)
- [Update an existing pivot record](#update-an-existing-pivot-record)
- [Relation that will get the newest (or oldest) item](#relation-that-will-get-the-newest-or-oldest-item)
- [Replace your custom queries with ofMany](#replace-your-custom-queries-with-ofmany)
- [Avoid data leakage when using orWhere on a relationship](#avoid-data-leakage-when-using-orwhere-on-a-relationship)

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

### Add where statement to Many-to-Many relation

In your many-to-many relationships, you can add where statements to your pivot table using the `wherePivot` method.

```php
class Developer extends Model
{
     // Get all clients related to this developer
     public function clients()
     {
          return $this->belongsToMany(Clients::class);
     }

     // Get only local clients
     public function localClients()
     {
          return $this->belongsToMany(Clients::class)
               ->wherePivot('is_local', true);
     }
}
```

Tip given by [@cosmeescobedo](https://twitter.com/cosmeescobedo/status/1582904416457269248)

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
    return $this->belongsTo(User::class)->withDefault();
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
$users = Book::with('author.country')->get();
```

### Eager Loading with Exact Columns

You can do Laravel Eager Loading and specify the exact columns you want to get from the relationship.

```php
$users = Book::with('author:id,name')->get();
```

You can do that even in deeper, second level relationships:

```php
$users = Book::with('author.country:id,name')->get();
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
Do `if-else`, or `{{ $model->relationship->field ?? '' }}` in Blade, or `{{ optional($model->relationship)->field }}`. With php8 you can even use the nullsafe operator `{{ $model->relationship?->field) }}`

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
    return $this->belongsToMany(Podcast::class)
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
$book = Book::first();

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

Just a code example from my project, showing the possibility of filtering hasMany relationships.

TagTypes -> hasMany Tags -> hasMany Examples

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
{
    public function whatever_method() {
        $tournaments = Tournament::with(['countries' => function($query) {
            $query->orderBy('position');
        }])->latest()->get();
    }
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

Laravel 8.63.0 ships with a new `whereBelongsTo()` Eloquent query builder method. Smiling face with heart-shaped eyes

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

### Update an existing pivot record

If you want to update an existing pivot record on the table, use `updateExistingPivot` instead of `syncWithPivotValues`.

```php
// Migrations
Schema::create('role_user', function ($table) {
    $table->unsignedId('user_id');
    $table->unsignedId('role_id');
    $table->timestamp('assigned_at');
})

// first param for the record id
// second param for the pivot records
$user->roles()->updateExistingPivot(
    $id, ['assigned_at' => now()],
);
```

Tip given by [@sky_0xs](https://twitter.com/sky_0xs/status/1461414850341621760)

### Relation that will get the newest (or oldest) item

New in Laravel 8.42: In an Eloquent model can define a relation that will get the newest (or oldest) item of another relation.

```php
public function historyItems(): HasMany
{
    return $this
        ->hasMany(ApplicationHealthCheckHistoryItem::class)
        ->orderByDesc('created_at');
}

public function latestHistoryItem(): HasOne
{
    return $this
        ->hasOne(ApplicationHealthCheckHistoryItem::class)
        ->latestOfMany();
}
```

### Replace your custom queries with ofMany

```php
class User extends Authenticable {
    // Get most popular post of user
    public function mostPopularPost() {
        return $this->hasOne(Post::class)->ofMany('like_count', 'max');
    }
}
```

Tip given by [@LaravelEloquent](https://twitter.com/LaravelEloquent/status/1493324310328578054)

### Avoid data leakage when using orWhere on a relationship

```php
$user->posts()
    ->where('active', 1)
    ->orWhere('votes', '>=', 100)
    ->get();
```

Returns: ALL posts where votes are greater than or equal to 100 are returned

```sql
select * from posts where user_id = ? and active = 1 or votes >= 100
```

```php
use Illuminate\Database\Eloquent\Builder;

$users->posts()
    ->where(function (Builder $query) {
        return $query->where('active', 1)
                    ->orWhere('votes', '>=', 100);
    })
    ->get();
```

Returns: Users posts where votes are greater than or equal to 100 are returned

```sql
select * from posts where user_id = ? and (active = 1 or votes >= 100)
```

Tip given by [@BonnickJosh](https://twitter.com/BonnickJosh/status/1494779780562096139)

