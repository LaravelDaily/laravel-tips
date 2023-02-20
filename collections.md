## Collections

⬆️ [Go to main menu](README.md#laravel-tips) ⬅️ [Previous (Validation)](validation.md) ➡️ [Next (Auth)](auth.md)

- [Use groupBy on Collections with Custom Callback Function](#use-groupby-on-collections-with-custom-callback-function)
- [Laravel Scopes can be combined using "Higher Order" orWhere Method](#laravel-scopes-can-be-combined-using-higher-order-orwhere-method)
- [Multiple Collection Methods in a Row](#multiple-collection-methods-in-a-row)
- [Calculate Sum with Pagination](#calculate-sum-with-pagination)
- [Serial no in foreach loop with pagination](#serial-no-in-foreach-loop-with-pagination)
- [Higher order collection message](#higher-order-collection-message)
- [Get an existing key or insert a value if it doesn't exist and return the value](#get-an-existing-key-or-insert-a-value-if-it-doesnt-exist-and-return-the-value)
- [Static times method](#static-times-method)

### Use groupBy on Collections with Custom Callback Function

If you want to group result by some condition which isn’t a direct column in your database, you can do that by providing a closure function.

For example, if you want to group users by day of registration, here’s the code:

```php
$users = User::all()->groupBy(function($item) {
    return $item->created_at->format('Y-m-d');
});
```

⚠️ Notice: it is done on a `Collection` class, so performed **AFTER** the results are fetched from the database.

### Laravel Scopes can be combined using "Higher Order" orWhere Method

Following example from the Docs.

Before:
```php
User::popular()->orWhere(function (Builder $query) {
     $query->active();
})->get()
```

After:
```php
User::popular()->orWhere->active()->get();
```

Tip given by [@TheLaravelDev](https://twitter.com/TheLaravelDev/status/1564608208102199298/)

### Multiple Collection Methods in a Row

If you query all results with `->all()` or `->get()`, you may then perform various Collection operations on the same result, it won’t query database every time.

```php
$users = User::all();
echo 'Max ID: ' . $users->max('id');
echo 'Average age: ' . $users->avg('age');
echo 'Total budget: ' . $users->sum('budget');
```

### Calculate Sum with Pagination

How to calculate the sum of all records when you have only the PAGINATED collection? Do the calculation BEFORE the pagination, but from the same query.

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

### Higher order collection message

Collections also provide support for "higher order messages", which are short-cuts for performing common actions on collections.
This example calculates the price per group of products on an offer.

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

$totalPerGroup = collect($offer['lines'])->groupBy->group->map->sum('price');
```

### Get an existing key or insert a value if it doesn't exist and return the value

In Laravel 8.81 `getOrPut` method to Collections that simplifies the use-case where you want to either get an existing key or insert a value if it doesn't exist and return the value.

```php
$key = 'name';
// Still valid
if ($this->collection->has($key) === false) {
    $this->collection->put($key, ...);
}

return $this->collection->get($key);

// Using the `getOrPut()` method with closure
return $this->collection->getOrPut($key, fn() => ...);

// Or pass a fixed value
return $this->collection->getOrPut($key, $value='teacoders');
```

Tip given by [@Teacoders](https://twitter.com/Teacoders/status/1488338815592718336)

### Static times method

The static times method creates a new collection by invoking the given closure a specified number of times.

```php
Collection::times(7, function ($number) {
    return now()->addDays($number)->format('d-m-Y');
});
// Output: [01-04-2022, 02-04-2022, ..., 07-04-2022]
```

Tip given by [@Teacoders](https://twitter.com/Teacoders/status/1509447909602906116)

