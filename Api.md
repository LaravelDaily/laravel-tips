## API

⬆️ [Go to main menu](README.md#laravel-tips) ⬅️ [Previous (Log and debug)](Log-and-Debug.md) ➡️ [Next (Other)](Other.md)

- [API Resources: With or Without "data"?](#api-resources-with-or-without-data)
- [API Return "Everything went ok"](#api-return-everything-went-ok)
- [Avoid N+1 queries in API resources](#avoid-N1-queries-in-API-resources)

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

### Avoid N+1 queries in API resources
You can avoid N+1 queries in API resources by using the `whenLoaded()` method.<br>
This will only append the department if it’s already loaded in the Employee model.<br>
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