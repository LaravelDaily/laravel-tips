## Views

⬆️ [Go to main menu](README.md#laravel-tips) ⬅️ [Previous (Migrations)](Migrations.md) ➡️ [Next (Routing)](Routing.md)

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
- [Component Syntax Tip](#component-syntax-tip)
- [Automatically highlight nav links](#automatically-highlight-nav-links)
- [Cleanup loops](#cleanup-loops)
- [Simple way to tidy up your Blade views](#simple-way-to-tidy-up-your-blade-views)
- [x-flash Blade Component](#x-flash-blade-component)

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

### Component Syntax Tip
Did you know that if you pass colon (:) before the component parameter, you can directly pass variables without print statement `{{ }}`?
```php
<x-navbar title="{{ $title }}"/>

// you can do instead

<x-navbar :title="$title"/>
```

Tip given by [@sky_0xs](https://twitter.com/sky_0xs/status/1457056634363072520)

### Automatically highlight nav links
Automatically highlight nav links when exact URL matches, or pass a path or route name pattern.<br>
A Blade component with request and CSS classes helpers makes it ridiculously simple to show active/inactive state.

```php
class NavLink extends Component
{
    public function __construct($href, $active = null)
    {
        $this->href = $href;
        $this->active = $active ?? $href;        
    }
    
    public function render(): View
    {
        $classes = ['font-medium', 'py-2', 'text-primary' => $this->isActive()];
        
        return view('components.nav-link', [
            'class' => Arr::toCssClasses($classes);
        ]);
    }
    
    protected function isActive(): bool
    {
        if (is_bool($this->active)) {
            return $this->active;
        }
        
        if (request()->is($this->active)) {
            return true;
        }
        
        if (request()->fullUrlIs($this->active)) {
            return true;
        }
        
        return request()->routeIs($this->active);
    }
}
```

```blade
<a href="{{ $href }}" {{ $attributes->class($class) }}>
    {{ $slot }}
</a>
```

```blade
<x-nav-link :href="route('projects.index')">Projects</x-nav-link>
<x-nav-link :href="route('projects.index')" active="projects.*">Projects</x-nav-link>
<x-nav-link :href="route('projects.index')" active="projects/*">Projects</x-nav-link>
<x-nav-link :href="route('projects.index')" :active="$tab = 'projects'">Projects</x-nav-link>
```

Tip given by [@mpskovvang](https://twitter.com/mpskovvang/status/1459646197635944455)

### Cleanup loops
Did you know the Blade `@each` directive can help cleanup loops in your templates?
```blade
// good
@foreach($item in $items)
    <div>
        <p>Name: {{ $item->name }}
        <p>Price: {{ $item->price }}
    </div>
@endforeach

// better (HTML extracted into partial)
@each('partials.item', $items, 'item')
```

Tip given by [@kirschbaum_dev](https://twitter.com/kirschbaum_dev/status/1463205294914297861)

### Simple way to tidy up your Blade views
A simple way to tidy up your Blade views!<br>
Use the `forelse loop`, instead of a `foreach loop` nested in an if statement
```blade
<!-- if/loop combination -->
@if ($orders->count())
    @foreach($orders as $order)
        <div>
            {{ $order->id }}
        </div>
    @endforeach
@else
    <p>You haven't placed any orders yet.</p>
@endif

<!-- Forelse alternative -->
@forelse($orders as $order)
    <div>
        {{ $order->id }}
    </div>
@empty
    <p>You haven't placed any orders yet.</p>
@endforelse
```

Tip given by [@alexjgarrett](https://twitter.com/alexjgarrett/status/1465674086022107137)

### x-flash Blade Component

```php
views\components\flash.blade.php

@props([
    'type' => 'success',
    'colors' => [
        'info' => 'alert-info',
        'success' => 'alert-success',
        'error' => 'alert-danger',
        'warning' => 'alert-warning'
    ]
])

@if (session('message'))
<div {{ $attributes->merge(['class' => "{$colors[$type]} alert alert-success d-flex align-items-center alert-dismissible"]) }} role="alert">
    <div class="flex-shrink-0">
        <i class="fa fa-fw fa-check"></i>
    </div>
    <div class="flex-grow-1 ms-3">
        <p class="mb-0">
            {{ $slot }}
        </p>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
</div>
@endif
```

Method example:

```php
public function destroy(Product $product)
{
     $product->delete();

     return redirect()
       ->route('products.index')
       ->with([
          'type' => 'success', 
          'message' => 'Product successfully deleted!'
       ]);
}
```

Usage:

```php
<x-flash type="{{ session('type') }}">
    {{ session('message') }}
</x-flash>
```

Tip given by [MimisK13](https://github.com/MimisK13)
