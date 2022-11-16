## API

⬆️ [Go to main menu](README.md#laravel-tips) ⬅️ [Previous (Log and debug)](log-and-debug.md) ➡️ [Next (Other)](other.md)

- [API Resources: With or Without "data"?](#api-resources-with-or-without-data)
- [Conditional Relationship Counts on API Resources](#conditional-relationship-counts-on-api-resources)
- [API Return "Everything went ok"](#api-return-everything-went-ok)
- [Avoid N+1 queries in API resources](#avoid-n1-queries-in-api-resources)
- [Get Bearer Token from Authorization header](#get-bearer-token-from-authorization-header)
- [Sorting Your API Results](#sorting-your-api-results)
- [Customize Exception Handler For API](#customize-exception-handler-for-api)

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

### Conditional Relationship Counts on API Resources

You may conditionally include the count of a relationship in your resource response by using the whenCounted method. By doing so, the attribute is not included if the relationships' count is missing.
```php
public function toArray($request)
{
     return [
          'id' => $this->id,
          'name' => $this->name,
          'email' => $this->email,
          'posts_count' => $this->whenCounted('posts'),
          'created_at' => $this->created_at,
          'updated_at' => $this->updated_at,
     ];
}
```

Tip given by [@mvpopuk](https://twitter.com/mvpopuk/status/1570480977507504128)

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

### Avoid N+1 queries in API resources

You can avoid N+1 queries in API resources by using the `whenLoaded()` method.

This will only append the department if it’s already loaded in the Employee model.

Without `whenLoaded()` there is always a query for the department

```php
class EmplyeeResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->uuid,
            'fullName' => $this->full_name,
            'email' => $this->email,
            'jobTitle' => $this->job_title,
            'department' => DepartmentResource::make($this->whenLoaded('department')),
        ];
    }
}
```

Tip given by [@mmartin_joo](https://twitter.com/mmartin_joo/status/1473987501501071362)

### Get Bearer Token from Authorization header

The `bearerToken()` function is very handy when you are working with apis & want to access the token from Authorization header.

```php
// Don't parse API headers manually like this:
$tokenWithBearer = $request->header('Authorization');
$token = substr($tokenWithBearer, 7);

//Do this instead:
$token = $request->bearerToken();
```

Tip given by [@iamharis010](https://twitter.com/iamharis010/status/1488413755826327553)

### Sorting Your API Results

Single-column API sorting, with direction control

```php
// Handles /dogs?sort=name and /dogs?sort=-name
Route::get('dogs', function (Request $request) {
    // Get the sort query parameter (or fall back to default sort "name")
    $sortColumn = $request->input('sort', 'name');

    // Set the sort direction based on whether the key starts with -
    // using Laravel's Str::startsWith() helper function
    $sortDirection = Str::startsWith($sortColumn, '-') ? 'desc' : 'asc';
    $sortColumn = ltrim($sortColumn, '-');

    return Dog::orderBy($sortColumn, $sortDirection)
        ->paginate(20);
});
```

we do the same for multiple columns (e.g., ?sort=name,-weight)

```php
// Handles ?sort=name,-weight
Route::get('dogs', function (Request $request) {
    // Grab the query parameter and turn it into an array exploded by ,
    $sorts = explode(',', $request->input('sort', ''));

    // Create a query
    $query = Dog::query();

    // Add the sorts one by one
    foreach ($sorts as $sortColumn) {
        $sortDirection = Str::startsWith($sortColumn, '-') ? 'desc' : 'asc';
        $sortColumn = ltrim($sortColumn, '-');

        $query->orderBy($sortColumn, $sortDirection);
    }

    // Return
    return $query->paginate(20);
});
```

### Customize Exception Handler For API

#### Laravel 8 and below:

There's a method `render()` in `App\Exceptions` class:

```php
   public function render($request, Exception $exception)
    {
        if ($request->wantsJson() || $request->is('api/*')) {
            if ($exception instanceof ModelNotFoundException) {
                return response()->json(['message' => 'Item Not Found'], 404);
            }

            if ($exception instanceof AuthenticationException) {
                return response()->json(['message' => 'unAuthenticated'], 401);
            }

            if ($exception instanceof ValidationException) {
                return response()->json(['message' => 'UnprocessableEntity', 'errors' => []], 422);
            }

            if ($exception instanceof NotFoundHttpException) {
                return response()->json(['message' => 'The requested link does not exist'], 400);
            }
        }

        return parent::render($request, $exception);
    }
```

#### Laravel 9 and above:

There's a method `register()` in `App\Exceptions` class:

```php
    public function register()
    {
        $this->renderable(function (ModelNotFoundException $e, $request) {
            if ($request->wantsJson() || $request->is('api/*')) {
                return response()->json(['message' => 'Item Not Found'], 404);
            }
        });

        $this->renderable(function (AuthenticationException $e, $request) {
            if ($request->wantsJson() || $request->is('api/*')) {
                return response()->json(['message' => 'unAuthenticated'], 401);
            }
        });
        $this->renderable(function (ValidationException $e, $request) {
            if ($request->wantsJson() || $request->is('api/*')) {
                return response()->json(['message' => 'UnprocessableEntity', 'errors' => []], 422);
            }
        });
        $this->renderable(function (NotFoundHttpException $e, $request) {
            if ($request->wantsJson() || $request->is('api/*')) {
                return response()->json(['message' => 'The requested link does not exist'], 400);
            }
        });
    }
```

