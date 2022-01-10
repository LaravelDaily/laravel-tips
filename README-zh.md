# Laravel 编码技巧

为所有的`Laravel`开发者们提供的 `Laravel` 提示和技巧。欢迎PR 提供好点子!

想法由[PovilasKorop](https://github.com/PovilasKorop) and [MarceauKa](https://github.com/MarceauKa) 提供.

嘿 喜欢这些提示吗?也看看我优质的 [Laravel 课程](https://laraveldaily.teachable.com/)

---

__更新于 2022/1/5:现在有209个小提示，分成14类.



## 目录

- [数据库模型与 Eloquent](#数据库模型与-Eloquent) (55 提示)
- [模型关联](#模型关联) (31 提示)
- [数据库迁移](#数据库迁移) (13 提示)
- [视图](#视图) (11 提示)
- [路由](#路由) (22 提示)
- [验证](#验证) (14 提示)
- [集合](#集合) (6 提示)
- [授权](#授权) (5 提示)
- [邮件](#邮件) (5 提示)
- [Artisan](#artisan) (5 提示)
- [工厂](#工厂) (4 提示)
- [日志与调试](#日志与调试) (4 提示)
- [API](#api) (2 提示)
- [其他](#其他) (31 提示)


## 数据库模型与 Eloquent

⬆️ [回到顶部](#Laravel-编码技巧) ➡️ [下一个 (模型关联)](#模型关联)

1. [复用或克隆query](#复用或克隆query)
2. [Eloquent where 日期方法](#Eloquent-where日期方法)
3. [增量和减量](#增量和减量)
4. [禁止 timestamp 列](#禁止-timestamp-列)
5. [软删除: 多行恢复](#软删除-多行恢复)
6. [Model all: columns](#Model-all-columns)
7. [To Fail or not to Fail](#To-Fail-or-not-to-Fail)
8. [列名修改](#列名修改)
9. [过滤结果集合](#过滤结果集合)
10. [修改默认的Timestamp 字段](#修改默认的-Timestamp-字段)
11. [按照created_at快速排序](#按照created_at快速排序)
12. [当创建记录时自动修改某些列的值](#当创建记录时自动修改某些列的值)
13. [数据库原始查询计算运行得更快](#数据库原始查询计算运行得更快)
14. [不止一个范围](#不止一个范围)
15. [无需转换 Carbon](#无需转换-Carbon)
16. [根据首字母分组](#根据首字母分组)
17. [永不更新某个字段](#永不更新某个字段)
18. [find () 查询多条数据](#find-()-查询多条数据)
19. [find多个模型并返回多列](#find多个模型并返回多列)
20. [按照键查找](#按照键查找)
21. [使用UUID替换auto-increment](#使用UUID替换auto-increment)
22. [Laravel 中的子查询](#Laravel-中的子查询)
23. [隐藏某些列](#隐藏某些列)
24. [确定DB报错](#确定DB报错)
25. [软删除与查询构造器](#软删除与查询构造器)
26. [SQL声明](#SQL声明)
27. [数据库事务](#数据库事务)
28. [更新或创建](#更新或创建)
29. [保存时移除缓存](#保存时移除缓存)
30. [修改Created_at和Updated_at的格式](#修改Created_at和Updated_at的格式)
31. [数组类型存储到 JSON 中](#数组类型存储到-JSON-中)
32. [复制一个模型](#复制一个模型)
33. [降低内存占用](#降低内存占用)
34. [忽略 $fillable/$guarded 并强制执行](#忽略-$fillable/$guarded-并强制执行)
35. [3层父子级结构](#3层父子级结构)
36. [使用 find() 来搜索更多的记录](#使用-find()-来搜索更多的记录)
37. [失败时执行任何操作](#失败时执行任何操作)
38. [检查记录是否存在否则显示 404](#检查记录是否存在否则显示-404)
39. [条件语句为否时中止](#条件语句为否时中止)
40. [在删除模型之前执行任何额外的操作](#在删除模型之前执行任何额外的操作)
41. [当你需要在保存数据到数据库时自动填充一个字段](#当你需要在保存数据到数据库时自动填充一个字段)
42. [获取查询语句的额外信息](#获取查询语句的额外信息)
43. [在 Laravel 中使用doesntExist()方法](#在-Laravel-中使用doesntExist()方法)
44. [在一些模型的 boot () 方法中自动调用一个特性](#在一些模型的-boot-()-方法中自动调用一个特性)
46. [在 Laravel 中有两种常见的方法来确定一个表是否为空表](#在-Laravel-中有两种常见的方法来确定一个表是否为空表)
47. [如何避免 property of non-object 错误](#如何避免-property-of-non-object-错误)
48. [Eloquent 数据改变后获取原始数据](#Eloquent-数据改变后获取原始数据)
49. [一种更简单创建数据库的方法](#一种更简单创建数据库的方法)
49. [Query构造器的crossJoinSub方法](#Query构造器的crossJoinSub 方法)
50. [belongsToMany的中间表命名](#belongsToMany的中间表命名)
51. [根据Pivot字段排序](#根据Pivot字段排序)
52. [从数据库中查询一条记录](#从数据库中查询一条记录)
53. [记录自动分块](#记录自动分块)
54. [更新模型而不触发事件](#更新模型而不触发事件)
55. [定时清理过期记录中的模型](#定时清理过期记录中的模型)
56. [不变的日期和对它们的强制转换](#不变的日期和对它们的强制转换)



### 复用或克隆query

通常，我们需要从过滤后的查询中进行更多次查询。因此，大多数时候我们使用 query() 方法，
让我们编写一个查询来获取今天创建的可用和不可用的产品

```php
$query = Product::query();


$today = request()->q_date ?? today();
if($today){
    $query->where('created_at', $today);
}

// 让我们获取可用和不可用的产品
$active_products = $query->where('status', 1)->get(); // 这一行 修改了$query 对象变量
$inactive_products = $query->where('status', 0)->get(); // 所以这里我们将获取不到任何不可用产品
```

但是，在获得 `$active products` 后，`$query` 会被修改。因此 `$inactive_products` 不会从 `$query` 中获取到不可用产品，并且每次都返回空集合。因为，它尝试从 `$active_products` 中查找不可用产品（`$query` 仅返回可用产品）。

为了解决这个问题,我们可以通过重用这个`$query`对象来查询多次。因此我们在做任何对`$query`修改操作的时候需要克隆这个`$query`。

```php
$active_products = $query->clone()->where('status', 1)->get(); // it will not modify the $query
$inactive_products = $query->clone()->where('status', 0)->get(); // so we will get inactive products from $query

```

### Eloquent where日期方法

在 Eloquent 中，使用 `whereDay()`、`whereMonth()`、`whereYear()`、`whereDate()` 和 `whereTime()` 函数检查日期。

```php
$products = Product::whereDate('created_at', '2018-01-31')->get();
$products = Product::whereMonth('created_at', '12')->get();
$products = Product::whereDay('created_at', '31')->get();
$products = Product::whereYear('created_at', date('Y'))->get();
$products = Product::whereTime('created_at', '=', '14:13:58')->get();
```

### 增量和减量

如果要增加数据库某个表中的某个列的值，只需要使用 `increment()` 函数。你不仅可以增加 1，还可以增加其他数字，如 50。

```php
Post::find($post_id)->increment('view_count');
User::find($user_id)->increment('points', 50);
```

### 禁止 timestamp 列

如果你的数据库表不包含 timestamp 字段 `created_at` 和 `updated_at`，你可以使用 `$timestamps = false` 属性指定 Eloquent 模型不使用它们。

```php
class Company extends Model
{
    public $timestamps = false;
}
```

### 软删除-多行恢复

使用软删除时，可以在一个句子中恢复多行。

```php
Post::onlyTrashed()->where('author_id', 1)->restore();
```

### Model all-columns

当调用Eloquent's `Model::all()`时你可以指定返回哪些列。

```php
$users = User::all(['id', 'name', 'email']);
```

### To Fail or not to Fail

除了 `findOrFail()` 之外，还有 Eloquent 方法 `firstOrFail()`，如果没有找到查询记录，它将返回 `404` 页面。

```php
$user = User::where('email', 'povilas@laraveldaily.com')->firstOrFail();
```

### 列名修改

在 `Eloquent Query Builder` 中，您可以像在普通 SQL 查询中一样指定`as`以返回任何列的别名。

```php
$users = DB::table('users')->select('name', 'email as user_email')->get();
```

### 过滤结果集合

在 `Eloquent` 查询到结果之后，您可以使用 Collections 中的 `map()` 函数来修改行数据。

```php
$users = User::where('role_id', 1)->get()->map(function (User $user) {
    $user->some_column = some_function($user);
    return $user;
});
```

### 修改默认的Timestamp 字段

如果您使用的是非 `Laravel` 数据库并且时间戳列的名称不同怎么办？也许，你有 `create_time` 和 `update_time`。 幸运的是，您也可以在模型中指定它们：

```php
class Role extends Model
{
    const CREATED_AT = 'create_time';
    const UPDATED_AT = 'update_time';
}
```

### 按照created_at快速排序

不用:

```php
User::orderBy('created_at', 'desc')->get();
```

你可以更快的使用排序:

```php
User::latest()->get();
```

默认情况下 `latest()` 将按照 `created_at`排序。

有一个相反的方法 `oldest()`，按 created_at 升序排序：

```php
User::oldest()->get();
```

您也可以指定另一列进行排序。 例如，如果你想使用 `updated_at`，你可以这样做：

```php
$lastUpdatedUser = User::latest('updated_at')->first();
```

### 当创建记录时自动修改某些列的值

如果您想在创建记录时生成一些 DB 列值，请将其添加到模型的 boot() 方法中。
例如，如果您有一个字段 「position」，并且想要赋值下一个可用位置（如 Country::max('position') + 1)，请执行以下操作：

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

### 数据库原始查询计算运行得更快

使用类似 `whereRaw()` 方法的 SQL 原始查询，直接在查询中进行一些数据库特定计算，而不是在 Laravel 中，通常情况下结果会更快。 例如，如果您想获得注册后 30 天以上仍处于活跃状态的用户，代码如下：

```php
User::where('active', 1)
    ->whereRaw('TIMESTAMPDIFF(DAY, created_at, updated_at) > ?', 30)
    ->get();
```

### 不止一个范围

您可以在 Eloquent 中组合和链式调用查询范围，在一个`query`查询中使用多个范围。

Model文件内:

```php
public function scopeActive($query) {
    return $query->where('active', 1);
}

public function scopeRegisteredWithinDays($query, $days) {
    return $query->where('created_at', '>=', now()->subDays($days));
}
```

控制器内:

```php
$users = User::registeredWithinDays(30)->active()->get();
```

### 无需转换 Carbon

如果你正使用 `whereDate()` 查询今日的记录，可以直接使用 `Carbon` 的 `now()` 方法，它会自动转换为日期进行查询，而不需要指定 ->toDateString()。

```php
// 不用
$todayUsers = User::whereDate('created_at', now()->toDateString())->get();
// 不用做转换 只需要用 now()
$todayUsers = User::whereDate('created_at', now())->get();
```

### 根据首字母分组

你可以用任意自定义条件对 Eloquent 结果进行分组，下面的示例是由用户名的第一个单词进行分组:

```php
$users = User::all()->groupBy(function($item) {
    return $item->name[0];
});
```

### 永不更新某个字段

如果有一个数据库字段你想只设置一次并不想再次更新，您可以在Eloquent的模型上使用一个修改器设置该限制：

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

### find () 查询多条数据

`find()`方法可以接受多参数, 传入多个值时会返回所有找到记录的集合，而不是一个模型:

```php
// 返回 Eloquent Model
$user = User::find(1);
// 返回 Eloquent Collection
$users = User::find([1,2,3]);
```

技巧来自 [@tahiriqbalnajam](https://twitter.com/tahiriqbalnajam/status/1436120403655671817)

### find多个模型并返回多列

`find`方法可接受多参数 使得结果集返回指定列的模型集合，而不是模型的所有列:

```php
// Will return Eloquent Model with first_name and email only
$user = User::find(1, ['first_name', 'email']);
// Will return Eloquent Collection with first_name and email only
$users = User::find([1,2,3], ['first_name', 'email']);
```

技巧来自 [@tahiriqbalnajam](https://github.com/tahiriqbalnajam)

### 按照键查找

您还可以使用`whereKey()`方法根据您指定的主键查找多条记录。(默认`id`但是你可以在Eloquent 模型中覆盖掉)

```php
$users = User::whereKey([1,2,3])->get();
```

### 使用UUID替换auto-increment

您不想在模型中使用自动递增 ID？

迁移:

```php
Schema::create('users', function (Blueprint $table) {
    // $table->increments('id');
    $table->uuid('id')->unique();
});
```

模型:

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

### Laravel 中的子查询

从 Laravel 6 开始，您可以在 Eloquent 语句中使用 `addSelect()`方法，对列进行一些计算。

```php
return Destination::addSelect(['last_flight' => Flight::select('name')
    ->whereColumn('destination_id', 'destinations.id')
    ->orderBy('arrived_at', 'desc')
    ->limit(1)
])->get();
```

### 隐藏某些列

在进行 Eloquent 查询时，如果您想在返回中隐藏特定字段，最快捷的方法之一是在集合结果上添加 `->makeHidden()`。

```php
$users = User::all()->makeHidden(['email_verified_at', 'deleted_at']);
```

### 确定DB报错

如果您想捕获 Eloquent Query 异常，请使用特定的 `QueryException` 代替默认的 `Exception` 类，您将能够获得SQL确切的错误代码。

```php
try {
    // Some Eloquent/SQL statement
} catch (\Illuminate\Database\QueryException $e) {
    if ($e->getCode() === '23000') { // integrity constraint violation
        return back()->withError('Invalid data');
    }
}
```

### 软删除与查询构造器

注意 当你用到 `Eloquent`时 软删除将会起作用，但是查询构造器不行。

```php
// 将排除软删除的条目
$users = User::all();

// 将不会排除软删除的条目
$users = User::withTrashed()->get();

// 将不会排除软删除的条目
$users = DB::table('users')->get();
```

### SQL声明

如果你需要执行一个简单的 SQL 查询，但没有方案 —— 比如改变数据库模式中的某些东西，只需执行 DB::statement()。

```php
DB::statement('DROP TABLE users');
DB::statement('ALTER TABLE projects AUTO_INCREMENT=123');
```

### 数据库事务

如果您执行了两个数据库操作，第二个可能会出错，那么您应该回滚第一个，对吗？
为此，我建议使用 DB Transactions，它在 Laravel 中非常简单：

```php
DB::transaction(function () {
    DB::table('users')->update(['votes' => 1]);

    DB::table('posts')->delete();
});
```

### 更新或创建

如果你需要检查记录是否存在，然后更新它，或者创建一个新记录，你可以用一句话来完成 - 使用 Eloquent updateOrCreate() 方法：

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

### 保存时移除缓存

由 [@pratiksh404](https://github.com/pratiksh404)提供

如果您缓存了一个键存储了 `posts` 这个集合，想在新增或更新时移除缓存键，可以在您的模型上调用静态的 saved 函数：

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

### 修改Created_at和Updated_at的格式

由[@syofyanzuhad](https://github.com/syofyanzuhad)提供

想要改变 `created_at`的格式，您可以在模型中添加一个方法，如下所示:

```php
public function getCreatedAtFormattedAttribute()
{
   return $this->created_at->format('H:i d, M Y');
}
```

你可以在需要改变时间格式时使用 `$entry->created_at_formatted` ，它会返回 `created_at` 的属性如同 `04:19 23, Aug 2020`。

你也可以用同样的方法更改 `updated_at`：

```php
public function getUpdatedAtFormattedAttribute()
{
   return $this->updated_at->format('H:i d, M Y');
}
```

在有需要的时候使用 `$entry->updated_at_formatted`。它会返回 `updated_at` 的属性如同: `04:19 23, Aug 2020` 。

### 数组类型存储到 JSON 中

由[@pratiksh404](https://github.com/pratiksh404)提供

如果你的输入字段有一个数组需要存储为 JSON 格式，你可以在模型中使用 `$casts` 属性。 这里的 `images` 是 JSON 属性

```php
protected $casts = [
    'images' => 'array',
];
```

这样你可以以 JSON 格式存储它，但当你从 DB 中读取时，它会以数组方式使用。

### 复制一个模型

如果你有两个非常相似的模型（比如送货地址和账单地址），而且你想要复制其中一个作为另一个，你可以使用 replicate() 方法并更改一部分属性。

[官方文档的示例](https://laravel.com/docs/8.x/eloquent#replicating-models)

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

### 降低内存占用

有时我们需要将大量的数据加载到内存中，比如：

```php
$orders = Order::all();
```

但如果我们有非常庞大的数据库，这可能会很慢，因为 `Laravel ` 会准备好模型类的对象。在这种情况下，`Laravel `有一个很方便的函数 `toBase()`。

```php
$orders = Order::toBase()->get();
//$orders 将是一个由`StdClass`组成的 `Illuminate\Support\Collection`
```

通过调用这个方法，它将从数据库中获取数据，但它不会准备模型类。同时，向 `get()` 方法传递一个字段数组通常是个好主意，这样可以防止从数据库中获取所有字段。

### 忽略 $fillable/$guarded 并强制执行

如果你为其他开发者创建了一个 Laravel 模板, 然后你不能控制他们以后会在模型的 $fillable/$guarded 中填写什么，你可以使用 forceFill()

```php
$team->update(['name' => $request->name])
```

如果 name 不在`team`模型的 `$fillable` 中，怎么办？或者如果根本就没有 `$fillable/$guarded`， 怎么办？

```php
$team->forceFill(['name' => $request->name])
```

这将忽略该查询的 $fillable 并强制执行。

### 3层父子级结构

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

### 使用 find() 来搜索更多的记录

你不仅可以用 find() 来搜索单条记录，还可以用 IDs 的集合来搜索更多的记录，方法如下：

```php
return Product::whereIn('id', $this->productIDs)->get();
```

这么做:

```php
return Product::find($this->productIDs)
```

### 失败时执行任何操作

当查询一条记录时，如果没有找到，你可能想执行一些操作。除了用 ->firstOrFail() 会抛出 404 之外，你可以在失败时执行任何操作，只需要使用 

`->firstOr(function() { ... })`

```php
$model = Flight::where('legs', '>', 3)->firstOr(function () {
    // ...
})
```

### 检查记录是否存在否则显示 404

不要使用 find() ，然后再检查记录是否存在，使用 `findOrFail()`

```php
$product = Product::find($id);
if (!$product) {
    abort(404);
}
$product->update($productDataArray);
```

更简单的方法:

```php
$product = Product::findOrFail($id); // shows 404 if not found
$product->update($productDataArray);
```

### 条件语句为否时中止

可以使用 `abort_if()` 作为判断条件和抛出错误页面的快捷方式。

```php
$product = Product::findOrFail($id);
if($product->user_id != auth()->user()->id){
    abort(403);
}
```

更简单的方法:

```php
/* abort_if(CONDITION, ERROR_CODE) */
$product = Product::findOrFail($id);
abort_if ($product->user_id != auth()->user()->id, 403)
```

### 在删除模型之前执行任何额外的操作

由[@back2Lobby](https://github.com/back2Lobby)提供

我们可以使用 `Model::delete()` 执行额外的操作来覆盖原本的删除方法

```php
// App\Models\User.php

public function delete(){

	//extra steps here whatever you want
	
	//now perform the normal deletion
	Model::delete();
}
```

### 当你需要在保存数据到数据库时自动填充一个字段

当你需要在保存数据到数据库时自动填充一个字段 （例如: slug），使用模型观察者来代替重复编写代码

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

由[@sky_0xs](https://twitter.com/sky_0xs/status/1432390722280427521)提供

### 获取查询语句的额外信息

你可以使用 `explain()` 方法来获取查询语句的额外信息

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

由 [@amit_merchant](https://twitter.com/amit_merchant/status/1432277631320223744)提供

### 在 Laravel 中使用doesntExist()方法

```php
// 一个例子
if ( 0 === $model->where('status', 'pending')->count() ) {
}

// 我不关心它有多少数据只要它是0
// Laravel 的 exists() 方法会很清晰
if ( ! $model->where('status', 'pending')->exists() ) {
}

// 但我发现上面这条语句中的！很容易被忽略。
// 那么 doesntExist() 方法会让这个例子更加清晰
if ( $model->where('status', 'pending')->doesntExist() ) {
}
```

由 [@ShawnHooper](https://twitter.com/ShawnHooper/status/1435686220542234626)提供

### 在一些模型的 boot () 方法中自动调用一个特性

如果你有一个特性，你想把它添加到几个模型中，自动调用它们的 `boot()` 方法，你可以把特性的方法作为boot （特性名称）来调用

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

### Laravel 的 find () 方法，比只传一个 ID 更多的选择

```php
// 在 find($id) 方法中第二个参数可以是返回字段
Studdents::find(1, ['name', 'father_name']);
// 这样我们可以查询 ID 为 '1' 并返回 name , father_name 字段

// 我们可以用数组的方式传递更多的 ID
Studdents::find([1,2,3], ['name', 'father_name']);
// 输出: ID 为 1,2,3 并返回他们的 name , father_name 字段
```

### 在 Laravel 中有两种常见的方法来确定一个表是否为空表

在 Laravel 中，有两种常见的方法来确定一个表是否为空表。 直接在模型上使用 `exists()` 或者 `count()`
不等于一个返回严格的布尔值，另一个返回一个整数，你都可以在条件语句中使用。

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

由 [@aschmelyun](https://twitter.com/aschmelyun/status/1440641525998764041)提供

### 如何避免 property of non-object 错误

```php
// 设定默认模型
// 假设你有一篇 Post （帖子） 属于一个 Author （作者），代码如下:
$post->author->name;

// 当然你可以像这样阻止错误:
$post->author->name ?? ''
// 或者
@$post->author->name

// 但你可以在Eloquent关系层面上做到这一点。
// 如果没有作者关联帖子，这种关系将返回一个空的App/Author模型。
public function author() {
    return $this->belongsTo('App\Author')->withDefault();
}
// 或者
public function author() {
    return $this->belongsTo('App\Author')->withDefault([
        'name' => 'Guest Author'
    ]);
}
```

由 [@coderahuljat](https://twitter.com/coderahuljat/status/1440556610837876741)提供

### Eloquent 数据改变后获取原始数据

Eloquent 模型数据改变后，你可以使用 getOriginal () 方法来获取原始数据

```php
$user = App\User::first();
$user->name; // John
$user->name = "Peter"; // Peter
$user->getOriginal('name'); // John
$user->getOriginal(); // Original $user record
```

由 [@devThaer](https://twitter.com/devThaer/status/1442133797223403521)提供

### 一种更简单创建数据库的方法

Laravel 还可以使用 .sql 文件来更简单的创建数据库

```php
DB::unprepared(
    file_get_contents(__DIR__ . './dump.sql')
);
```

由 [@w3Nicolas](https://twitter.com/w3Nicolas/status/1447902369388249091)提供

### Query构造器的crossJoinSub方法
使用CROSS JOIN交叉连接

```php
use Illuminate\Support\Facades\DB;
$totalQuery = DB::table('orders')->selectRaw('SUM(price) as total');
DB::table('orders')
    ->select('*')
    ->crossJoinSub($totalQuery, 'overall')
    ->selectRaw('(price / overall.total) * 100 AS percent_of_total')
    ->get();
```

由 [@PascalBaljet](https://twitter.com/pascalbaljet)提供

### belongsToMany的中间表命名

为了决定 关系表的中间表, Eloquent将按字母顺序连接两个相关的型号名称。

这意味着可以这样添加“Post”和“Tag”之间的连接：

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
但是，您可以自由重写此约定，并且需要在第二个参数中指定联接表。

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
如果希望明确说明主键，还可以将其作为第三个和第四个参数提供。
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
由 [@iammikek](https://twitter.com/iammikek)提供

### 根据Pivot字段排序

`BelongsToMany::orderByPivot()` 允许你直接对`BelongsToMany `关系查询的结果集进行排序。

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
        return $this->belongsToMany(Tag::class, 'posts_tags', 'post_id', 'tag_id')
            ->using(PostTagPivot::class)
            ->withTimestamps()
            ->withPivot('flag');
    }
}
class PostTagPivot extends Pivot
{
    protected $table = 'posts_tags';
}
// Somewhere in the Controller
public function getPostTags($id)
{
    return Post::findOrFail($id)->tags()->orderByPivot('flag', 'desc')->get();
}
```

由 [@PascalBaljet](https://twitter.com/pascalbaljet)提供



### 从数据库中查询一条记录

`sole()`方法将会只返回一条匹配标准的记录。如果没找到，将会抛出`NoRecordsFoundException` 异常。如果发现了多条记录，抛出`MultipleRecordsFoundException` 异常

```php
DB::table('products')->where('ref', '#123')->sole();
```

由 [@PascalBaljet](https://twitter.com/pascalbaljet)提供

### 记录自动分块

与`each()`相同，但是更简单使用。`chunks`自动将记录分成多块。

```php
return User::orderBy('name')->chunkMap(fn ($user) => [
    'id' => $user->id,
    'name' => $user->name,
]), 25);
```

由[@PascalBaljet](https://twitter.com/pascalbaljet)提供

### 更新模型而不触发事件
有时候你需要更新一个模型但是不想发送任何事件 我们可以使用`updateQuietly`做到, 底层使用了`saveQuietly`方法。

```php
$flight->updateQuietly(['departed' => false]);
```

由 [@PascalBaljet](https://twitter.com/pascalbaljet)提供

### 定时清理过期记录中的模型
定期清理过时记录的模型。有了这个特性，Laravel将自动完成这项工作，只需调整内核类中`model:prune`命令的频率

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
此外，在修剪方法中，可以设置删除模型之前必须执行的操作：

```php
protected function pruning()
{
    // Removing additional resources,
    // associated with the model. For example, files.
    Storage::disk('s3')->delete($this->filename);
}
```

由 [@PascalBaljet](https://twitter.com/pascalbaljet)提供

### 不变的日期和对它们的强制转换
Laravel 8.53 介绍了`immutable_date` 和`immutable_datetime` 将日期转换为Immutable`.

转换成`CarbonImmutable `，而不是常规的`Carbon `实例。

```php
class User extends Model
{
    public $casts = [
        'date_field'     => 'immutable_date',
        'datetime_field' => 'immutable_datetime',
    ];
}
```

由 [@PascalBaljet](https://twitter.com/pascalbaljet)提供

## 模型关联

⬆️ [回到顶部](#Laravel-编码技巧) ⬅️ [上一个 (数据库模型与 Eloquent)](#数据库模型与-Eloquent) ➡️ [下一个 (数据库迁移)](#数据库迁移)

1. [在 Eloquent 关系中使用 OrderBy](#在-Eloquent-关系中使用-OrderBy)
2. [在 Eloquent 关系中添加条件](#在-Eloquent-关系中添加条件)
3. [DB 原生查询: havingRaw ()](#DB-原生查询-havingRaw-())
4. [Eloquent 使用 has () 实现多层调用查询](#Eloquent-使用-has-()-实现多层调用查询)
5. [一对多关系中获取符合指定数量的信息](#一对多关系中获取符合指定数量的信息)
6. [默认模型](#默认模型)
7. [一对多关系中一次创建多条关联数据](#一对多关系中一次创建多条关联数据)
8. [多层级预加载](#多层级预加载)
9. [预加载特定字段](#预加载特定字段)
10. [轻松更新父级 updated_at](#轻松更新父级-updated_at)
11. [一直检查关联是否存在](#一直检查关联是否存在)
12. [使用 withCount () 来统计关联记录数](#使用-withCount-()-来统计关联记录数)
13. [关联关系中过滤查询](#关联关系中过滤查询)
14. [动态预加载相关模型](#动态预加载相关模型)
15. [使用 hasMany 代替 belongsTo](#使用-hasMany-代替-belongsTo)
16. [重命名 pivot 表名称](#重命名-pivot-表名称)
17. [仅用一行代码更新归属关系](#仅用一行代码更新归属关系)
18. [Laravel 7+ 的外键](#Laravel-7+-的外键)
19. [两种 「whereHas」 组合使用](#两种-「whereHas」-组合使用)
20. [检查关系方法是否已经存在](#检查关系方法是否已经存在)
21. [获取中间表中的关联关系数据](#获取中间表中的关联关系数据)
22. [便捷获取一对多关系中子集的数量](#便捷获取一对多关系中子集的数量)
23. [对关联模型数据进行随机排序](#对关联模型数据进行随机排序)
24. [过滤一对多关联](#过滤一对多关联)
25. [通过中间表字段过滤多对多关联](#通过中间表字段过滤多对多关联)
26. [whereHas 的一个更简短的方法](#whereHas-的一个更简短的方法)
27. [提取一个重复回调作为变量](#提取一个重复回调作为变量)
28. [你可以为你的模型关联添加条件](#你可以为你的模型关联添加条件)
29. [新的 Eloquent 查询构建器方法 whereBelongsTo()](#新的-Eloquent-查询构建器方法-whereBelongsTo())
30. [使用is()方法比较一对一关系模型](#使用is()方法比较一对一关系模型)
31.  [`whereHas()`多连接](#whereHas多连接)


### 在 Eloquent 关系中使用 OrderBy

您可以在关联关系中直接指定 `orderBy ()`。

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

### 在 Eloquent 关系中添加条件

假如你经常在模型关联关系中添加某些相同的 `where `条件，可以单独创建一个方法。

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

### DB 原生查询 havingRaw ()

你可以在很多地方使用原始数据库查询，比如在 `groupBy()` 后面调用 `havingRaw()`

```php
Product::groupBy('category_id')->havingRaw('COUNT(*) > 1')->get();
```

### Eloquent 使用 has () 实现多层调用查询

你可以在关联关系查询中使用 `has()` 实现两层关联查询。

```php
// Author -> hasMany(Book::class);
// Book -> hasMany(Rating::class);
$authors = Author::has('books.ratings')->get();
```

### 一对多关系中获取符合指定数量的信息

在`hasMany()`中，你可以通过条件过滤，获取符合的数据。

```php
// Author -> hasMany(Book::class)
$authors = Author::has('books', '>', 5)->get();
```

### 默认模型

你可以在 `belongsTo `关系中设置返回一个默认的模型，从而避免类似于使用 `{{ $post->user->name }}` 当 $post->user 不存在的时候，引起的致命的错误

```php
public function user()
{
    return $this->belongsTo('App\User')->withDefault();
}
```

### 一对多关系中一次创建多条关联数据

在一对多关系中，你可以使用 `saveMany` 通过一次提交，保存多条关联数据。

```php
$post = Post::find(1);
$post->comments()->saveMany([
    new Comment(['message' => 'First comment']),
    new Comment(['message' => 'Second comment']),
]);
```

### 多层级预加载

在 `Laravel `中，你可以在一条语句中预加载多个层级，在这个例子中，我们不仅加载作者关系，而且还加载作者模型上的国家关系。

```php
$users = App\Book::with('author.country')->get();
```

### 预加载特定字段

你可以在 `Laravel `中预加载并指定关联中的特定字段。

```php
$users = App\Book::with('author:id,name')->get();
```

你同样可以在深层级中这样做，如第二层级关系：

```php
$users = App\Book::with('author.country:id,name')->get();
```

### 轻松更新父级 updated_at

如果你想更新一条数据同时更新它父级关联的 `updated_at` 字段 （例如：你添加一条帖子评论，想同时更新帖子的 posts.updated_at），只需要在子模型中使用 `$touches = ['post'];` 属性。

```php
class Comment extends Model
{
    protected $touches = ['post'];
}
```

### 一直检查关联是否存在

永远不要在不检查关联是否存在时使用 `$model->relationship->field`
它可能因为任何原因，如在你的代码之外，被别人的队列任务等等被删除。

用 `if-else`，或者在 Blade 模板中 `{{$model->relationship->field ? ? '' }}`，或者 `{{optional($model->relationship)->field }}` 。在 php8 中，你甚至可以使用 null 安全操作符 {{ $model->relationship?->field) }}

### 使用 withCount () 来统计关联记录数

如果你有 `hasMany()` 的关联，并且你想统计子关联记录的条数，不要写一个特殊的查询。例如，如果你的用户模型上有帖子和评论，使用 `withCount()`。

```php
public function index()
{
    $users = User::withCount(['posts', 'comments'])->get();
    return view('users', compact('users'));
}
```

同时，在 Blade 文件中，您可以通过使用 `{relationship}_count` 属性获得这些数量：

```blade
@foreach ($users as $user)
<tr>
    <td>{{ $user->name }}</td>
    <td class="text-center">{{ $user->posts_count }}</td>
    <td class="text-center">{{ $user->comments_count }}</td>
</tr>
@endforeach
```

也可以按照这些统计字段进行排序：

```php
User::withCount('comments')->orderBy('comments_count', 'desc')->get(); 
```

### 关联关系中过滤查询

假如您想加载关联关系的数据，同时需要指定一些限制或者排序的闭包函数。例如，您想获取人口最多的前 3 座城市信息，可以按照如下方式实现:

```php
$countries = Country::with(['cities' => function($query) {
    $query->orderBy('population', 'desc');
    $query->take(3);
}])->get();
```

### 动态预加载相关模型

您不仅可以实现对关联模型的实时预加载，还可以根据情况动态设置某些关联关系，需要在模型初始化方法中处理：

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

### 使用 hasMany 代替 belongsTo

在关联关系中，如果创建子关系的记录中需要用到父关系的 ID ，那么使用  `hasMany ` 比使用 `belongsTo `更简洁。

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

### 重命名 pivot 表名称

如果你想要重命名`pivot`并用其他的什么方式来调用关系，你可以在你的关系声明中使用 `->as('name')` 来为关系取名。
模型 ：

```php
public function podcasts() {
    return $this->belongsToMany('App\Podcast')
        ->as('subscription')
        ->withTimestamps();
}
```

控制器:

```php
$podcasts = $user->podcasts();
foreach ($podcasts as $podcast) {
    // instead of $podcast->pivot->created_at ...
    echo $podcast->subscription->created_at;
}
```

### 仅用一行代码更新归属关系

如果有一个 `belongsTo()` 关系，你可以在仅仅一条语句中更新这个 `Elquent` 关系：

```php
// if Project -> belongsTo(User::class)
$project->user->update(['email' => 'some@gmail.com']); 
```

### Laravel 7+ 的外键

从 Laravel 7 开始，你不需要在迁移（migration）中为一些关系字段写两行代码 —— 一行是字段，一行是外键。你可以使用 `foreignId()` 方法。

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

### 两种 「whereHas」 组合使用

在 Eloquent 中，你可以在同一条语句中使用 `whereHas()` 和 `orDoesntHave()`。

```php
User::whereHas('roles', function($query) {
    $query->where('id', 1);
})
->orDoesntHave('roles')
->get();
```

### 检查关系方法是否已经存在

如果你的 `Eloquent` 关系名是动态的，那么你需要检查项目中是否存在相同名称的关系。你可以使用这个 PHP 方法  `method_exists($object, $methodName)`。

```php
$user = User::first();
if (method_exists($user, 'roles')) {
	// Do something with $user->roles()->...
}
```

### 获取中间表中的关联关系数据

在多对多关系中，您定义的中间表里面可能会包含扩展字段，甚至可能包含其它的关联关系。
下面生成一个中间表模型

```bash
php artisan make:model RoleUser --pivot
```

然后，给  `belongsToMany()` 指定 `->using()` 方法。下面就是见证奇迹的时刻：

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

### 便捷获取一对多关系中子集的数量

除了可以使用 `Eloquent` 中的 `withCount()` 方法统计子集数量外，还可以直接用 `loadCount()` 更加便捷和快速获取：

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

### 对关联模型数据进行随机排序

您可以使用 `inRandomOrder()` 对 Eloquent 的查询结果进行随机排序，同时也可以作用于关联关系中，实现关联数据的随机排序。

```php
// If you have a quiz and want to randomize questions...

// 1. If you want to get questions in random order:
$questions = Question::inRandomOrder()->get();

// 2. If you want to also get question options in random order:
$questions = Question::with(['answers' => function($q) {
    $q->inRandomOrder();
}])->inRandomOrder()->get();
```

### 过滤一对多关联

通过我项目中的一个代码例子，展示了过滤一对多关系的可能性。`TagType -> hasMany tags -> hasMany examples`

如果你想查询所有的标签类型，伴随他们的标签，但只包含有实例的标签，并按照实例数量倒序

```php
$tag_types = TagType::with(['tags' => function ($query) {
    $query->has('examples')
        ->withCount('examples')
        ->orderBy('examples_count', 'desc');
    }])->get();
```

### 通过中间表字段过滤多对多关联

如果你有一个多对多关联，你可以在中间表中添加一个额外字段，这样你可以在查询列表时用它排序。

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

### whereHas 的一个更简短的方法

在 `Laravel 8.57` 中发布：通过包含一个简单条件的简短方法来写 `whereHas()`。

```php
// Before
User::whereHas('posts', function ($query) {
    $query->where('published_at', '>', now());
})->get();

// After
User::whereRelation('posts', 'published_at', '>', now())->get();
```

### 提取一个重复回调作为变量

如果你有一个重复使用的回调函数，你可以提取它作为变量。

```php
// You have long repeated callback function inside?
$results = Model::with('relationships')
    ->whereHas('relationships', function($query) use ($var1, $var2) {
        return $query->where('field1', $var1)->where('field2', $var2);
    })
    ->withCount('relationships', function($query) use ($var1, $var2) {
        return $query->where('field1', $var1)->where('field2', $var2);
    })
    ->get();

// You can extract that into a variable
$callback = function($query) use ($var1, $var2) {
        return $query->where('field1', $var1)->where('field2', $var2);
    });
$results = Model::with('relationships')
    ->whereHas('relationships', $callback)
    ->withCount('relationships', $callback)
    ->get();
```

### 你可以为你的模型关联添加条件

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

由 [@anwar_nairi](https://twitter.com/anwar_nairi/status/1441718371335114756)提供

### 新的 Eloquent 查询构建器方法 whereBelongsTo()

Laravel `8.63.0` 版本带有一个新的 `Eloquent` 查询构建器方法 `whereBelongsTo()` 。这允许你从你的查询中删除 `BelongsTo` 外键名称，并使用关联方法替代（该方法会根据类名自动确定关联与外键，也可以添加第二个参数手动关联）

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

由 [@danjharrin](https://twitter.com/danjharrin/status/1445406334405459974)提供

### 使用is()方法比较一对一关系模型

我们可以在相关联的模型中做比较 而不需要其他数据库访问。

```php
// BEFORE: the foreign key is taken from the Post model
$post->author_id === $user->id;
// BEFORE: An additional request is made to get the User model from the Author relationship
$post->author->is($user);
// AFTER
$post->author()->is($user);
```

由 [@PascalBaljet](https://twitter.com/pascalbaljet)提供

### whereHas多连接

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

由 [@adityaricki](https://twitter.com/adityaricki2)提供

## 数据库迁移

⬆️ [回到顶部](#Laravel-编码技巧) ⬅️ [上一个 (模型关联)](#模型关联) ➡️ [下一个 (视图)](#视图)

1. [无符号整型](#无符号整型)
2. [迁移顺序](#迁移顺序)
3. [带时区的迁移字段](#带时区的迁移字段)
4. [数据库迁移字段类型](#数据库迁移字段类型)
5. [默认时间戳](#默认时间戳)
6. [迁移状态](#迁移状态)
7. [创建带空格的迁移](#创建带空格的迁移)
8. [在另一列的后面创建一列](#在另一列的后面创建一列)
9. [为已经存在的表生成迁移文件](#为已经存在的表生成迁移文件)
10. [执行迁移前先输出 SQL 语句](#执行迁移前先输出-SQL-语句)
11. [匿名迁移](#匿名迁移)
12. [给迁移添加注释](#给迁移添加注释)
13. [表名表字段检测](#表名表字段检测)

### 无符号整型

作为迁移的外键，请使用 `unsignedInteger()`  类型或 `integer()->unsigned()` 来替代 `integer()` ，否则你会得到 SQL 错误。

```php
Schema::create('employees', function (Blueprint $table) {
    $table->unsignedInteger('company_id');
    $table->foreign('company_id')->references('id')->on('companies');
    // ...
});
```

同样，你可以用 `unsignedBigInteger()` 如果外键对应的是 `bigInteger()` 类型。

```php
Schema::create('employees', function (Blueprint $table) {
    $table->unsignedBigInteger('company_id');
});
```

### 迁移顺序

如果你想改变数据库迁移的顺序，只需要将文件按时间戳记命名， 就像 `2018_08_04_070443_create_posts_table.php` 改为 `2018_07_04_070443_create_posts_table.php` (从 `2018_08_04` 改成了 `2018_07_04`).

迁移是以字母顺序执行。

### 带时区的迁移字段

你知不知道在迁移中不止有 `timestamps()` 还有带时区的 `timestampsTz()` 。

```php
Schema::create('employees', function (Blueprint $table) {
    $table->increments('id');
    $table->string('name');
    $table->string('email');
    $table->timestampsTz();
});
```

同样，还有这么些列 `dateTimeTz()` ，` timeTz()` ， `timestampTz()` ， `softDeletesTz()`。

### 数据库迁移字段类型

迁移中有一些有趣的字段类型，下面是一些示例。

```php
$table->geometry('positions');
$table->ipAddress('visitor');
$table->macAddress('device');
$table->point('position');
$table->uuid('id');
```

在 [官方文档](https://laravel.com/docs/master/migrations#creating-columns) 中你可以找到全部的字段类型列表.

### 默认时间戳

当创建迁移文件时，你可以使用带
`useCurrent()` 和 `useCurrentOnUpdate()` 可选项的 `timestamp()` 类型，这将会设置使相应字段以 `CURRENT_TIMESTAMP` 作为默认值。

```php
$table->timestamp('created_at')->useCurrent();
$table->timestamp('updated_at')->useCurrentOnUpdate();
```

### 迁移状态

如果你想知道迁移是不是已经运行过了，不需要查看 "migrations" 表，你可以运行 `php artisan migrate:status` 命令来查看。

结果示例:

```
+------+------------------------------------------------+-------+
| Ran? | Migration                                      | Batch |
+------+------------------------------------------------+-------+
| Yes  | 2014_10_12_000000_create_users_table           | 1     |
| Yes  | 2014_10_12_100000_create_password_resets_table | 1     |
| No   | 2019_08_19_000000_create_failed_jobs_table     |       |
+------+------------------------------------------------+-------+
```

### 创建带空格的迁移

当你打入 `make:migration` 命令，你不 “必须” 在不同部分间使用下划线 _ 进行分隔，比如 `create_transactions_table` 。你可以把名字用引号引起来并把下划线换成空格。

```php
// This works
php artisan make:migration create_transactions_table

// But this works too
php artisan make:migration "create transactions table"
```

Source: [Steve O on Twitter](https://twitter.com/stephenoldham/status/1353647972991578120)

### 在另一列的后面创建一列

注意： 仅 MySQL 可用
如果你要在已经存在的表里增加一个新列，这个列不 “必须” 成为最后一列，你可以指定这个列创建在哪个列的后面

```php
Schema::table('users', function (Blueprint $table) {
    $table->string('phone')->after('email');
});
```

如果你要在已经存在的表里增加一个新列，这个列不 “必须” 成为最后一列，你也可以指定这个列创建在哪个列的前面：

```php
Schema::table('users', function (Blueprint $table) {
    $table->string('phone')->before('created_at');
});
```

如果你让创建的列排在表中的第一个，那么可以使用 `first` 方法。

```php
Schema::table('users', function (Blueprint $table) {
    $table->string('uuid')->first();
});
```

### 为已经存在的表生成迁移文件

如果你要为已经存的表生成迁移文件，而且你想让 Lavarel 来为你生成 Schema::table ()  代码，那么，在命令后面加入  "_in_xxxxx_table" 或"_to_xxxxx_table"，或者指明 "--table" 参数。
`php artisan make:migration change_fields_products_table` generates empty class

```php
class ChangeFieldsProductsTable extends Migration
{
    public function up()
    {
        //
    }
}
```

但是，加入 `in_xxxxx_table` `php artisan make:migration change_fields_in_products_table` 生成了填好了 `Schemma::table()` 的类。

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

同样，你可以指明 `--table` 参数 `php artisan make:migration whatever_you_want --table=products`

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

### 执行迁移前先输出 SQL 语句

当输入 migrate --pretend 命令，你可以得到将在终端中执行的 SQL 查询。如果有需要的话调试 SQL 的方法，这是个很有趣的方法。

```php
// Artisan command
php artisan migrate --pretend
```

### 匿名迁移

`Laravel`团队发布了`Laravel 8.37`版本 支持匿名迁移，解决了迁移命名冲突的问题。

这个问题的核心是 如果多个迁移有相同的类名 当尝试重新创建数据库时可能会导致问题

以下是一个来自 `pr `的例子

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

由 [@nicksdot](https://twitter.com/nicksdot/status/1432340806275198978)提供

### 给迁移添加注释

在迁移中你可以给字段添加 `comment` 提供有用的信息。

如果数据库被其他开发者管理,他们在任何操作之前可以看这些表结构的注释。

```php
$table->unsignedInteger('interval')
    ->index()
    ->comment('This column is used for indexing.')   
```

由 [@Zubairmohsin33](https://twitter.com/Zubairmohsin33/status/1442345998790107137)提供

### 表名表字段检测

你可以使用 `hasTable` 和 `hasColumn` 方法检测表或字段是否存在。

```php
if (Schema::hasTable('users')) {
    // The "users" table exists...
}
if (Schema::hasColumn('users', 'email')) {
    // The "users" table exists and has an "email" column...
}
```

 [@dipeshsukhia](https://github.com/dipeshsukhia)提供

## 视图

⬆️ [回到顶部](#Laravel-编码技巧) ⬅️ [上一个 (数据库迁移)](#数据库迁移) ➡️ [下一个 (路由)](#路由)

1. [foreach 语句中的 $loop 变量](#foreach-语句中的-$loop-变量)
2. [视图是否存在](#视图是否存在)
3. [错误代码视图页面](#错误代码视图页面)
4. [脱离控制器的视图](#脱离控制器的视图)
5. [Blade @auth 指令](#Blade-@auth-指令)
6. [Blade 视图中的二级 $loop 变量](#Blade-视图中的二级-$loop-变量)
7. [创建你自己的 Blade 指令](#创建你自己的-Blade-指令)
8. [视图指令IncludeIf IncludeWhen IncludeFirst](#视图指令IncludeIf-IncludeWhen-IncludeFirst)
9. [使用Laravel Blade-X 变量绑定节省更多空间](#使用Laravel-Blade-X-变量绑定节省更多空间)
10. [Blade 组件属性](#Blade-组件属性)
11. [Blade类型提示](#Blade类型提示)

### foreach 语句中的 $loop 变量

在 `foreach` 循环中，使用 `$loop` 变量来查看当前是否是第一次 / 最后一次循环。

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

同样也有诸如 `$loop->iteration` 或 `$loop->count` 等属性。可以在 [官方文档](https://laravel.com/docs/master/blade#the-loop-variable)中查看更多相关内容。

### 视图是否存在

你可以在视图实际加载之前确认该视图文件是否存在。

```php
if (view()->exists('custom.page')) {
 // Load the view
}
```

你甚至可以使用一个数组来加载视图，这样只有第一个视图文件确实存在的视图会被加载。

```php
return view()->first(['custom.dashboard', 'dashboard'], $data);
```

### 错误代码视图页面

如果你想为一些特殊的 HTTP 返回码建立特定的错误页面，比如 `500` —— 只需要使用该码值创建视图文件，比如  `resources/views/errors/500.blade.php` ，或者是 `403.blade.php` 等等，这些视图会在对应的错误码出现时自动被加载。

### 脱离控制器的视图

如果你想让一个路由仅仅显示某个视图，不需要创建控制器，只需要使用 Route::view() 方法即可。

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

### Blade @auth 指令

不需要使用 if 来检查用户是否登录，使用 @auth 指令即可。

比较典型的方式是：

```blade
@if(auth()->user())
    // The user is authenticated.
@endif
```

更短的用法：

```blade
@auth
    // The user is authenticated.
@endauth
```

与 @auth 相对的是 @guest 指令：

```blade
@guest
    // The user is not authenticated.
@endguest
```

### Blade 视图中的二级 $loop 变量

你甚至可以在 `Blade` 视图的二级 `foreach` 循环中使用 `$loop` 变量来表示外层的循环变量。

```blade
@foreach ($users as $user)
    @foreach ($user->posts as $post)
        @if ($loop->parent->first)
            This is first iteration of the parent loop.
        @endif
    @endforeach
@endforeach
```

### 创建你自己的 Blade 指令

你只需要在 `app/Providers/AppServiceProvider.php` 中添加你自己的方法。举个例子，如果你需要将 `<br>` 标签替换为换行：

```blade
<textarea>@br2nl($post->post_text)</textarea>
```

然后将这个指令添加到 `AppServiceProvider` 的 `boot()` 方法中：

```php
public function boot()
{
    Blade::directive('br2nl', function ($string) {
        return "<?php echo preg_replace('/\<br(\s*)?\/?\>/i', \"\n\", $string); ?>";
    });
}
```

### 视图指令IncludeIf IncludeWhen IncludeFirst

如果你不确定 Blade 文件是否存在，你可以使用这些条件指令。
仅当 Blade 文件存在时载入 header：

```blade
@includeIf('partials.header')
```

仅当用户的 role_id == 1 的时候载入 header：

```blade
@includeWhen(auth()->user()->role_id == 1, 'partials.header')
```

尝试加载 adminlte.header ，如果不存在，则加载 default.header：

```blade
@includeFirst('adminlte.header', 'default.header')
```

### 使用Laravel Blade-X 变量绑定节省更多空间

```php
// Using include, the old way
@include("components.post", ["title" => $post->title])

// Using Blade-X
<x-post link="{{ $post->title }}" />

// Using Blade-X variable binding
<x-post :link="$post->title" />
```

由 [@anwar_nairi](https://twitter.com/anwar_nairi/status/1442441888787795970)提供

### Blade 组件属性

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

由 [@godismyjudge95](https://twitter.com/godismyjudge95/status/1448825909167931396)提供

### Blade类型提示
```php
@php
    /* @var App\Models\User $user */
@endphp
<div>
    // your ide will typehint the property for you 
    {{$user->email}}
</div>
```

由 [@freekmurze](https://twitter.com/freekmurze/status/1455466663927746560)提供

## 路由

⬆️ [回到顶部](#Laravel-编码技巧) ⬅️ [上一个 (视图)](#视图) ➡️ [下一个 (验证)](#验证)

1. [分组中的分组](#分组中的分组)
2. [通配符子域名](#通配符子域名)
3. [Auth::routes调用之后是什么](#routes调用之后是什么)
4. [路由模型绑定-你可以定义一个Key](#路由模型绑定-你可以定义一个Key)
5. [快速从路由导航到控制器](#快速从路由导航到控制器)
6. [备选路由-当没有匹配到任何路由时](#备选路由-当没有匹配到任何路由时)
7. [使用正则进行路由参数验证](#使用正则进行路由参数验证)
8. [限流-全局配置与按用户配置](#限流-全局配置与按用户配置)
9. [路由中的URL参数](#路由中的URL参数)
10. [按文件为路由分类](#按文件为路由分类)
11. [翻译资源中的动词](#翻译资源中的动词)
12. [自定义资源路由名称](#自定义资源路由名称)
13. [可读性更强的路由列表](#可读性更强的路由列表)
14. [预加载](#预加载)
15. [本地化资源URI](#本地化资源URI)
16. [资源控制器命名](#资源控制器命名)
17. [更简单地高亮你的导航栏](#更简单地高亮你的导航栏)
18. [使用route()辅助函数生成绝对路径](#使用route()辅助函数生成绝对路径)
19. [为你的每个模型重写路由绑定解析器](#为你的每个模型重写路由绑定解析器)
20. [如果你需要一个公共URL但是你想让他们更安全](#如果你需要一个公共URL但是你想让他们更安全)
21. [在中间件中使用Gate](#在中间件中使用Gate)
22. [简单路由-使用箭头函数](#简单路由-使用箭头函数)

### 分组中的分组

在路由中，你可以在分组中创建分组，来实现仅仅为父分组中的某些路由分配中间件。

```php
Route::group(['prefix' => 'account', 'as' => 'account.'], function() {
    Route::get('login', 'AccountController@login');
    Route::get('register', 'AccountController@register');
    
    Route::group(['middleware' => 'auth'], function() {
        Route::get('edit', 'AccountController@edit');
    });
});
```

### 通配符子域名

你可以在分组中定义变量，来创建动态子域名分组，然后将这个变量传递给每一个子路由。

```php
Route::domain('{username}.workspace.com')->group(function () {
    Route::get('user/{id}', function ($username, $id) {
        //
    });
});
```

### routes调用之后是什么

从 Laravel 7 之后，它被分在一个单独的包中，你可以查阅文件 `/vendor/laravel/ui/src/AuthRouteMethods.php`。

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

Laravel 7 之前，请查阅  `/vendor/laravel/framework/src/illuminate/Routing/Router.php`。

### 路由模型绑定-你可以定义一个Key

你可以像 `Route::get('api/users/{user}', function (App\User $user) { … }` 这样来进行路由模型绑定，但不仅仅是 ID 字段，如果你想让 {user} 是 username，你可以把它放在模型中：

```php
public function getRouteKeyName() {
    return 'username';
}
```

### 快速从路由导航到控制器

在 `Laravel 8` 之前，这件事情是可选的。在 `Laravel 8` 中这将成为路由的标准语法

不用这么写:

```php
Route::get('page', 'PageController@action');
```

你可以将控制器标识为 `class` 类名:

```php
Route::get('page', [\App\Http\Controllers\PageController::class, 'action']);
```

这样，你就可以在 `PhpStorm`中点击 `PageController` 来跳转到控制器定义，而不是手动去搜索它

或者你想要让路由的定义更简洁，你可以在路由文件的开始提前引入控制器的类。

```php
use App\Http\Controllers\PageController;

// Then:
Route::get('page', [PageController::class, 'action']);
```

### 备选路由-当没有匹配到任何路由时

如果你想为未找到的路由指定其它逻辑，而不是直接显示 404 页面，你可以在路由文件的最后为其创建一个特殊的路由。

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

### 使用正则进行路由参数验证

我们可以在路由中使用 `where`参数 来直接验证参数。一个典型的例子是，当使用语言区域的参数来作为路由前缀时，像是 `fr/blog` 和 `en/article/333` 等，这时我们如何来确保这两个首字母没有被用在其他语言呢？

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

### 限流-全局配置与按用户配置

你可以使用 `throttle:60,1` 来限制一些 URL 在每分钟内最多被访问 60 次。

```php
Route::middleware('auth:api', 'throttle:60,1')->group(function () {
    Route::get('/user', function () {
        //
    });
});
```

另外，你也可以为公开请求和登录用户分别配置：

```php
// maximum of 10 requests for guests, 60 for authenticated users
Route::middleware('throttle:10|60,1')->group(function () {
    //
});
```

此外，你也可以使用数据库字段 `users.rate_limit` 为一些特殊用户设定此值。

```php
Route::middleware('auth:api', 'throttle:rate_limit,1')->group(function () {
    Route::get('/user', function () {
        //
    });
});
```

### 路由中的URL参数

如果你在路由中使用数组传入了其它参数，这些键 / 值将会自动配对并且带入 `URL` 查询参数中。

```php
Route::get('user/{id}/profile', function ($id) {
    //
})->name('profile');

$url = route('profile', ['id' => 1, 'photos' => 'yes']); // Result: /user/1/profile?photos=yes
```

### 按文件为路由分类

如果你有一组与某些功能相关的路由，你可以将它们放在一个特殊的文件 `routes/XXXXX.php` 中，然后在 `routes/web.php` 中使用 include 引入它。`

Taylor Otwell 在  [Laravel Breeze](https://github.com/laravel/breeze/blob/1.x/stubs/routes/web.php) 中的例子：
`routes/auth.php`


```php
Route::get('/', function () {
    return view('welcome');
});

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth'])->name('dashboard');

require __DIR__.'/auth.php';
```

然后，在 `routes/auth.php` 中:

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

但是，你应该只在路由都各自具有相同的前缀 / 中间件配置时使用 `include()` 来引入路由，否则，更好的选择是将他们分类在 `app/Providers/RouteServiceProvider` 中。

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

### 翻译资源中的动词

当你使用了资源控制器，但希望变更 `URL` 谓词以适应非英语语言环境下的 `SEO` ，以在路由中用 `/crear` 替换 `/create`，你可以使用 `App\Providers\RouteServiceProvider 中的 Route::resourceVerbs()` 配置。

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

### 自定义资源路由名称

当使用资源路由时，你可以在 `routes/web.php` 中指定 `->names() 参数`，这样一来，在整个 Laravel 项目中，浏览器中的 URL 前缀和路由名称前缀可能会不同。

```php
Route::resource('p', ProductController::class)->names('products');
```

这行代码将会生成像 `/p`, `/p/{id}`, `/p/{id}/edit` 这样的路由，但是你可以在代码中使用` route('products.index')`, `route('products.create')` 等方式来调用它们。

### 可读性更强的路由列表

你有没有运行过 `php artisan route:list` ，然后发现这个列表又长，可读性又很差。
另一个方法是：
`php artisan route:list --compact`
这样只会输出 3 列，而非 6 列：只展示方法名、 URI 和方法

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

你还可以特别地指定所需要的列：

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

### 预加载

如果你使用了路由模型绑定，并且你认为不会在绑定关系中使用预加载，请你再想一想。
所以当你用了这样的路由模型绑定:

```php
public function show(Product $product) {
    //
}
```

但是你有一个从属关系，这时候就不能使用 `$product->with('category')` 预加载了吗？ 
你当然可以，使用 `->load()` 来加载关系

But you have a belongsTo relationship, and cannot use $product->with('category') eager loading?<br>
You actually can! Load the relationship with `->load()`

```php
public function show(Product $product) {
    $product->load('category');
    //
}
```

### 本地化资源URI

如果你使用了资源控制器，但是想要将 URL 谓词变为非英语形式的，比如你想要西班牙语的 `/crear` 而不是 `/create` ，你可以使用 `Route::resourceVerbs()` 方法来配置。

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

### 资源控制器命名

在资源控制器中，你可以在 `routes/web.php` 中指定 `->names()` 参数，这样 `URL` 前缀与路由前缀可能会不同
.
这样会生成诸如  `/p`, `/p/{id}`, `/p/{id}/edit` 等等，但是你可以这样调用它们：

`route('products.index)`
`route('products.create)`
等等

```php
Route::resource('p', \App\Http\Controllers\ProductController::class)->names('products');
```

### 更简单地高亮你的导航栏

使用`Route::is('route-name')`来更简单的高亮你的导航栏

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

由 [@anwar_nairi](https://twitter.com/anwar_nairi/status/1443893957507747849)提供

### 使用route辅助函数生成绝对路径

```php
route('page.show', $page->id);
// http://laravel.test/pages/1

route('page.show', $page->id, false);
// /pages/1
```

由 [@oliverds_](https://twitter.com/oliverds_/status/1445796035742240770)提供

### 为你的每个模型重写路由绑定解析器

你可以为你的所有模型重写路由绑定解析器。在这个例子里，我们没有对`URL` 中的 `@` 符号做任何处理，所以 用``resolveRouteBinding` `我可以移除`@`符号 然后解析模型

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

由 [@Philo01](https://twitter.com/Philo01/status/1447539300397195269)提供

### 如果你需要一个公共URL但是你想让他们更安全

如果你需要一个公共URL但是你想让他们更安全，使用 ` Laravel signed URL`

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

由 [@anwar_nairi](https://twitter.com/anwar_nairi/status/1448239591467589633)提供

### 在中间件中使用Gate
你可以在中间件中使用在 `App\Providers\AuthServiceProvider`设置的`Gate` 

怎么做呢?你可以在路由中添加`can:`和必要`gate`的名字
```php
Route::put('/post/{post}', function (Post $post) {
    // The current user may update the post...
})->middleware('can:update,post');
```

### 简单路由-使用箭头函数
在路由中你可以使用PHP的箭头函数 而不需要用匿名函数。

要做到这一点 你可以使用 `fn() =>` 这样看起来更简单。

```php
// Instead of
Route::get('/example', function () {
    return User::all();
});
// You can
Route::get('/example', fn () => User::all());
```

## 验证

⬆️ [回到顶部](#Laravel-编码技巧) ⬅️ [上一个 (路由)](#路由) ➡️ [下一个 (集合)](#集合)

1. [图片验证](#图片验证)
2. [自定义验证错误的信息](#自定义验证错误的信息)
3. [用now或yesterday来验证日期](#用now或yesterday来验证日期)
4. [具有某些条件的验证规则](#具有某些条件的验证规则)
5. [更改默认验证消息](#更改默认验证消息)
6. [预验证](#预验证)
7. [第一次验证错误时停止](#第一次验证错误时停止)
8. [不使用validate或者FormRequest就抛出422](#不使用validate或者FormRequest就抛出422)
9. [规则取决于其他条件](#规则取决于其他条件)
10. [使用属性设置首次验证失败时停止](#使用属性设置首次验证失败时停止)
11. [unique规则在软删除全局作用域中无效](#unique规则在软删除全局作用域中无效)
12. [sometimes方法允许你定义验证器在什么时候被应用](#sometimes方法允许你定义验证器在什么时候被应用)
13. [提交自定义验证规则](#提交自定义验证规则)
14. [数组元素验证](#数组元素验证)

### 图片验证

在验证上传的图片时，可以指定所需的尺寸

```php
['photo' => 'dimensions:max_width=4096,max_height=4096']
```

### 自定义验证错误的信息

只需在 `resources/lang/xx/validation.php` 文件创建适当的数组结构，就可以定义定每个 字段、规则和语言的验证错误消息。

```php
'custom' => [
     'email' => [
        'required' => 'We need to know your e-mail address!',
     ],
],
```

### 用now或yesterday来验证日期

您可以使用 `before/after` 的规则验证日期，并将各种字符串作为参数传递，比如: `tomorrow`, `now`, `yesterday`。例如: `'start_date' => 'after:now'`。它在底层下使用 `strtotime ()`。

```php
$rules = [
    'start_date' => 'after:tomorrow',
    'end_date' => 'after:start_date'
];
```

### 具有某些条件的验证规则

如果验证规则依赖于某些条件，则可以通过将 `withValidator()` 添加到 `FormRequest` 类中来修改规则，并在那里指定自定义逻辑。例如，如果您只想为某些用户角色添加验证规则。

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

### 更改默认验证消息

如果要更改特定字段和特定验证规则的默认验证错误消息，只需将 `messages()` 方法添加到` FormRequest `类中。

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

### 预验证

如果你想在默认的` Laravel `验证之前修改某个字段，或者，换句话说，“准备” 那个字段， `FormRequest `类中有一个方法 `prepareForValidation () `

```php
protected function prepareForValidation()
{
    $this->merge([
        'slug' => Illuminate\Support\Str::slug($this->slug),
    ]);
}
```

### 第一次验证错误时停止

默认情况下，将在列表中返回 Laravel 验证错误，检查所有验证规则。但是如果你想要在第一个错误之后停止这个过程，使用验证规则叫做 bail:

```php
$request->validate([
    'title' => 'bail|required|unique:posts|max:255',
    'body' => 'required',
]);
```

如果你需要停止首次错误验证，可以设置`FormRequest` 类中`$stopOnFirstFailure`为`true`:

```php
protected $stopOnFirstFailure = true;
```

### 不使用validate或者FormRequest就抛出422

如果您不使用 `validate()` 或 `Form Request`，但仍然需要使用相同的 `422` 状态码和错误结构抛出错误，那么可以手动抛出 `throw ValidationException::withMessages()`

```php
if (! $user || ! Hash::check($request->password, $user->password)) {
    throw ValidationException::withMessages([
        'email' => ['The provided credentials are incorrect.'],
    ]);
}
```

### 规则取决于其他条件

如果您的规则是动态的并且依赖于其他条件，那么您可以动态地创建该规则数组

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

### 使用属性设置首次验证失败时停止

在`request`类中使用这个属性设置首次验证失败时停止。

注意 这个跟 `Bail`规则不一样 只在单个规则失败时就停止

```php
/**
* Indicated if the validator should stop
 * the entire validation once a single
 * rule failure has occurred.
 */
protected $stopOnFirstFailure = true;
```

由 [@Sala7JR](https://twitter.com/Sala7JR/status/1436172331198603270)提供

### unique规则在软删除全局作用域中无效

`Rule::unique` 默认不在软删除的全局范围内。但是`使用`withoutTrashed` 时可用。

```php
Rule::unique('users', 'email')->withoutTrashed();
```

由 [@Zubairmohsin33](https://twitter.com/Zubairmohsin33/status/1438490197956702209)提供

### sometimes方法允许你定义验证器在什么时候被应用

`Validator::sometimes` 方法允许你定义验证器在什么时候被应用，基于提供的输入。
这个片段展示了如果购买的物品数量不够，如何禁止使用优惠券。

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

### 数组元素验证

如果你想要验证提交的数组元素，使用带`*`号的点符号。

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

由[HydroMoon](https://github.com/HydroMoon)提供

### 提交自定义验证规则

感谢`Rule::when` 我们可以指定提交验证规则。

下面例子我们可以验证用户是否真的可以对文章点赞。

```php
use Illuminate\Validation\Rule;

public function rules()
{
    return [
        'vote' => Rule::when($user->can('vote', $post), 'required|int|between:1,5'),
    ]
}
```

由 [@cerbero90](https://twitter.com/cerbero90/status/1434426076198014976)提供

## 集合

⬆️ [回到顶部](#Laravel-编码技巧) ⬅️ [上一个 (验证)](#验证) ➡️ [下一个 (授权)](#授权)

1. [不要使用NULL过滤集合](#不要使用NULL过滤集合)
2. [使用自定义的回调函数对集合分组](#使用自定义的回调函数对集合分组)
3. [针对行的集合方法](#针对行的集合方法)
4. [对分页集合求和](#对分页集合求和)
5. [分页组件中的唯一标识](#分页组件中的唯一标识)
6. [高阶集合方法](#高阶集合方法)

### 不要使用NULL过滤集合

你可以在 Eloquent 中使用 `NULL` 过滤，但是你不能用 `NULL` 过滤 集合 - 你应该换成空字符串过滤，字段中已经没有 "null"。(意思是全字符串的形式的过滤不能使用 NULL，因为会被格式化为 ["field is null", "=", true])

```php
// This works
$messages = Message::where('read_at is null')->get();

// Won’t work - will return 0 messages
$messages = Message::all();
$unread_messages = $messages->where('read_at is null')->count();

// Will work
$unread_messages = $messages->where('read_at', '')->count();
```

### 使用自定义的回调函数对集合分组

如果你想对结果分组，且分组字段不对应数据库中的字段，你可以提供一个回调函数来返回自定义的分组字段。
例如，通过用户的注册日分组，代码如下：

```php
$users = User::all()->groupBy(function($item) {
    return $item->created_at->format('Y-m-d');
});
```

注意：这个方法是在 `Collection `类上的，所以将会在数据库的返回结果上执行。(意思不会在数据库 sql 层面分组)

### 针对行的集合方法

你可以用 `->all(`) ,` ->get()` 方法查询数据，然后在这个返回的集合上执行各种集合方法，执行集合操作不会每次都查询数据库。

```php
$users = User::all();
echo 'Max ID: ' . $users->max('id');
echo 'Average age: ' . $users->avg('age');
echo 'Total budget: ' . $users->sum('budget');
```

### 对分页集合求和

如何对分页返回的结果集求和？使用相同的查询构建器，在分页查询之前执行求和操作


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

### 分页组件中的唯一标识

我们可以在分页组件中像序列号那样使用每趟循环中的索引 `index `，作为分页组件的唯一标识。

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

这可以解决下一页（?page=2&...）索引的计数问题。

### 高阶集合方法

集合具有更高阶的可以链式调用的方法，例如 `groupBy()` `map()` 等，给你流畅的语法体验。下面的例子计算了一个需求单中每组产品的价格。

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

## 授权

⬆️ [回到顶部](#Laravel-编码技巧) ⬅️ [上一个 (集合)](#集合) ➡️ [下一个 (邮件)](#邮件)

1. [一次检查多个权限](#一次检查多个权限)
2. [更多关于用户注册的事件](#更多关于用户注册的事件)
3. [你知道Auth::once()吗](#你知道Authonce吗)
4. [更改用户密码更新的API令牌](#更改用户密码更新的API令牌)
5. [覆盖超级管理员的权限](#覆盖超级管理员的权限)

### 一次检查多个权限

除了 `@can Blade` 指令外，你知道可以用 `@canany` 指令一次检查多个权限吗？

```blade
@canany(['update', 'view', 'delete'], $post)
    // The current user can update, view, or delete the post
@elsecanany(['create'], \App\Post::class)
    // The current user can create a post
@endcanany
```

### 更多关于用户注册的事件

希望在新用户注册后执行一些操作？ 转到 `app/Providers/EventServiceProvider.php` 和 添加更多的监听类，然后在 `$event->user` 对象中实现 `handle()` 方法。

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

### 你知道Authonce吗

你可以用用户登录一个请求，使用方法 `Auth::once()`。
不会使用任何会话或 cookie，这意味着该方法在构建无状态 API 时可能很有帮助。

```php
if (Auth::once($credentials)) {
    //
}
```

### 更改用户密码更新的API令牌

当用户的密码更改时，可以方便地更改用户的 API 令牌。
模型：

```php
public function setPasswordAttribute($value)
{
    $this->attributes['password'] = $value;
    $this->attributes['api_token'] = Str::random(100);
}
```

### 覆盖超级管理员的权限


如果你已经定义了网关（Gates）但是又想要覆盖超级管理员的所有权限。 给超级管理员所有权限，你可以在  `AuthServiceProvider.php` 文件中用 `Gate::before()` 语句拦截网关（Gates）。

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


## 邮件

⬆️ [回到顶部](#Laravel-编码技巧) ⬅️ [上一个 (授权)](#授权) ➡️ [下一个 (Artisan)](#Artisan)

1. [测试邮件存入laravel.log](#测试邮件存入laravel.log)
2. [预览邮件](#预览邮件)
3. [不使用Mailables预览邮件](#不使用Mailables预览邮件)
4. [Laravel 通知中的默认邮件主题](#Laravel-通知中的默认邮件主题)
5. [向任何人发送通知](#向任何人发送通知)

### 测试邮件存入laravel.log

如果你想在你的应用中测试邮件内容但是无法或不愿意设置类似 `Mailgun` 的东西，使用 `.env` 参数 `MAIL_DRIVER=log` 然后所有的邮件都会被保存到 `storage/logs/laravel.log` 文件，而不是真实的发送。

### 预览邮件

如果你使用 `Mailables` 发送邮件，您可以在浏览器中预览结果，而无需发送。返回一个 Mailables 作为路由结果:

```php
Route::get('/mailable', function () {
    $invoice = App\Invoice::find(1);
    return new App\Mail\InvoicePaid($invoice);
});
```

### 不使用Mailables预览邮件

不使用Mailables你也可以预览你的邮件。举个例子，当你创建通知的时候你可以指定你的邮件通知中可能用到的markdown文件。

```php
use Illuminate\Notifications\Messages\MailMessage;
Route::get('/mailable', function () {
    $invoice = App\Invoice::find(1);
    return (new MailMessage)->markdown('emails.invoice-paid', compact('invoice'));
});
```
你也可以使用``MailMessage` `对象提供的`view`方法和其他方法。

由 [@raditzfarhan](https://github.com/raditzfarhan)提供

### Laravel 通知中的默认邮件主题

如果您发送 `Laravel` 通知，并且没有在 `toMail()` 中指定主题，默认主题是您的通知类名，驼峰命名进入控制器。
那么，你可以：

```php
class UserRegistrationEmail extends Notification {
    //
}
```

然后您将收到一封主题为` 用户注册的电子邮件` 的电子邮件。

### 向任何人发送通知

你不仅可以发送 `Laravel` 通知 给特定的用户 `$user->notify()`，而且可以发送给你想发给的任何人，通过 `Notification::route()` ，所谓的 “按需” 通知：

```php
Notification::route('mail', 'taylor@example.com')
        ->route('nexmo', '5555555555')
        ->route('slack', 'https://hooks.slack.com/services/...')
        ->notify(new InvoicePaid($invoice));
```

## Artisan

⬆️ [回到顶部](#Laravel-编码技巧) ⬅️ [上一个 (邮件)](#邮件) ➡️ [下一个 (工厂)](#工厂)

1. [Artisan 命令参数](#Artisan-命令参数)
2. [维护模式](#维护模式)
3. [Artisan 命令行帮助](#Artisan-命令行帮助)
4. [确认 Laravel 的版本](#确认-Laravel-的版本)
5. [从任意处使用 Artisan 命令](#从任意处使用-Artisan-命令)

### Artisan 命令参数

创建 Artisan 命令时，您可以各种方式询问输入：`$this->confirm()` （确认），`$this->perialipate()` (预期输入)，`$this->choice()`(选择)。

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

### 维护模式

如果你想要在页面上启用维护模式，执行下面的 Artisan 命令:

```bash
php artisan down
```

然后人们会看到默认的 503 页面。
在 Laravel 8 里，你还可以提供的标识：

用户将会重定向的路径地址
预渲染的维护模式视图页面
绕过维护模式的秘钥
维护模式返回的状态吗
每 X 秒重新加载页面

```bash
php artisan down --redirect="/" --render="errors::503" --secret="1630542a-246b-4b66-afa1-dd72a4c43515" --status=200 --retry=60
```

在 Laravel 8 之前有：

- 维护模式显示的消息
- 每 X 秒重新加载页面
- 允许访问的 IP 地址

```bash
php artisan down --message="Upgrading Database" --retry=60 --allow=127.0.0.1
```

当你完成了维护工作，只需要运行：

```bash
php artisan up
```

### Artisan 命令行帮助

要查看 `Artisan` 命令的相关选项，可以运行 `Artisan` 命令带上 `--help` 标识参数，比如 `php artisan make:model --help` 然后就可以看到你可以用到的诸多选项

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

### 确认 Laravel 的版本

通过以下命令行，可以查看并确认你的应用所使用 Lavavel 版本
`php artisan --version`

### 从任意处使用 Artisan 命令

你不仅可以在命令行中启动`Artisan` 命令，还可以携带参数地在代码中启动它，使用`Artisan::call()· 方法即可：

```php
Route::get('/foo', function () {
    $exitCode = Artisan::call('email:send', [
        'user' => 1, '--queue' => 'default'
    ]);

    //
});
```

## 工厂

⬆️ [回到顶部](#Laravel-编码技巧) ⬅️ [上一个 (Artisan)](#Artisan) ➡️ [下一个 (日志与调试)](#日志与调试)

1. [工厂回调](#工厂回调)
2. [生成带图像的数据工厂或填充](#生成带图像的数据工厂或填充)
3. [使用自定义逻辑覆盖值](#使用自定义逻辑覆盖值)
4. [使用带关联关系的工厂](#使用带关联关系的工厂)

### 工厂回调

使用工厂类进行填充数据时，您可以在插入记录后提供回调函数来执行某种操作。

```php
$factory->afterCreating(App\User::class, function ($user, $faker) {
    $user->accounts()->save(factory(App\Account::class)->make());
});
```

### 生成带图像的数据工厂或填充

你是否知道伪造类 (Faker) 不仅可以生成文本值，还可以生成图像？看此处的 avatar 字段，它将生成一个 50x50 的图像:

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

### 使用自定义逻辑覆盖值

当使用工厂类创建记录时，可以使用序列类 (Sequence) 来输入自定义逻辑并将值覆盖

```php
$users = User::factory()
                ->count(10)
                ->state(new Sequence(
                    ['admin' => 'Y'],
                    ['admin' => 'N'],
                ))
                ->create();
```

### 使用带关联关系的工厂

当使用带关联关系的工厂时，`laravel`也提供了魔术方法:

```php
// magic factory relationship methods
User::factory()->hasPosts(3)->create();

// instead of
User::factory()->has(Post::factory()->count(3))->create();
```

由 [@oliverds_](https://twitter.com/oliverds_/status/1441447356323430402)提供

## 日志与调试

⬆️ [回到顶部](#Laravel-编码技巧) ⬅️ [上一个 (工厂)](#工厂) ➡️ [下一个 (API)](#API)

1. [日志记录参数](#日志记录参数)
2. [更方便的 DD](#更方便的-DD)
3. [使用 context 日志](#使用-context-日志)
4. [快速输出Query的sql](#快速输出Query的sql)

### 日志记录参数

你可以使用 `Log::info()`，或使用更短的 `info()` 额外参数信息，来了解更多发生的事情

```php
Log::info('User failed to login.', ['id' => $user->id]);
```

### 更方便的 DD

你可以在你的 `Eloquent` 句子或者任何集合结尾添加 `->dd()`，而不是使用 `dd($result)`

```php
// Instead of
$users = User::where('name', 'Taylor')->get();
dd($users);
// Do this
$users = User::where('name', 'Taylor')->get()->dd();
```

### 使用 context 日志

在最新的 `Laravel 8.49` 中：`Log::withContext()` 将帮助您区分不同请求之间的日志消息。
如果你创建了中间件并且设置了 `context`，所有的长消息将包含在 `context` 中，你将会搜索更容易。

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

由 [@LaraibiM](https://twitter.com/LaraibiM/status/1437857603263078421)提供

### 快速输出Query的sql

如果你想快速输出一个 `Eloquent query`的sql 你可以调用 `toSql()`方法如下:

```php
$invoices = Invoice::where('client', 'James pay')->toSql();

dd($invoices)
// select * from `invoices` where `client` = ? 
```

Tip given by [@devThaer](https://twitter.com/devThaer/status/1438816135881822210)


## API

⬆️ [回到顶部](#Laravel-编码技巧) ⬅️ [上一个 (日志与调试)](#日志与调试) ➡️ [下一个 (其他)](#其他)

1. [API 返回一切正常](#API-返回一切正常)
2. [去掉额外的内部数据包装](#去掉额外的内部数据包装)


由 [@phillipmwaniki](https://twitter.com/phillipmwaniki/status/1445230637544321029)提供

### API 返回一切正常

如果你有 API 端口执行某些操作但是没有响应，那么您只想返回 “一切正常”, 您可以返回 204 状态代码 “No content”。在 Laravel 中，很简单: `return response()->noContent();`

```php
public function reorder(Request $request)
{
    foreach ($request->input('rows', []) as $row) {
        Country::find($row['id'])->update(['position' => $row['position']]);
    }

    return response()->noContent();
}
```



### 去掉额外的内部数据包装

当创建一个 `Laravel Resource` 集合 你可以去除数据外层包装, 通过在 `AppServiceProvider`中添加

`JsonResource::withoutWrapping()`

```php
public function boot()
{
    JsonResource::withoutWrapping();
}
```

## 其他

⬆️ [回到顶部](#Laravel-编码技巧) ⬅️ [上一个 (API)](#API) 

1. [localhost配置](#localhost配置)
2. [何时运行或不运行composer-update](#何时运行或不运行composer-update)
3. [Composer检查新版本](#Composer检查新版本)
4. [自动大写翻译](#自动大写翻译)
5. [仅含小时的Carbon](#仅含小时的Carbon)
6. [单动作控制器](#单动作控制器)
7. [重定向到特定的控制器方法](#重定向到特定的控制器方法)
8. [使用旧版本的Laravel](#使用旧版本的Laravel)
9. [为分页链接添加参数](#为分页链接添加参数)
10. [可重复回调函数](#可重复回调函数)
11. [$request->hasAny](#$request->hasAny)
12. [简单分页组件](#简单分页组件)
13. [获取数据的方法](#获取数据的方法)
14. [Blade指令增加真假条件s](#Blade指令增加真假条件)
15. [任务允许脱离队列](#任务允许脱离队列)
16. [在工厂类或seeders外部使用Faker](#在工厂类或seeders外部使用Faker)
17. [可以定时执行的事情](#可以定时执行的事情)
18. [检索Laravel文档](#检索Laravel文档)
19. [过滤route-list](#过滤route-list)
20. [自定义Blade指令](#自定义Blade指令)
21. [Artisan命令帮助](#Artisan命令帮助)
22. [当运行测试时禁用懒加载](#当运行测试时禁用懒加载)
23. [使用两个很好用的辅助函数会带来魔法效果](#使用两个很好用的辅助函数会带来魔法效果)
24. [请求参数的默认值](#请求参数的默认值)
25. [在路由中直接传入中间件而不是注册它](#在路由中直接传入中间件而不是注册它)
26. [将数组转化成css类](#将数组转化成css类)
27. [Laravel-Cashier中的upcomingInvoice方法](#Laravel-Cashier中的upcomingInvoice方法)
28. [$request->exists与has](#$request->exists与has)
29. [返回带变量视图的多种方法](#返回带变量视图的多种方法)
30. [调度标准shell命令](#调度标准shell命令)

### localhost配置

不要忘记将 `.env` 文件中的 `app_url` 从 `http://localhost` 中改为真实的 `URL`，因为它将是你的电子邮件通知和任何其他链接的基础。

```
APP_NAME=Laravel
APP_ENV=local
APP_KEY=base64:9PHz3TL5C4YrdV6Gg/Xkkmx9btaE93j7rQTUZWm2MqU=
APP_DEBUG=true
APP_URL=http://localhost
```

### 何时运行或不运行composer-update

与`Laravel`不是很相关，但是… 永远不要在生产服务器上运行 `composer update` ，它很慢，会 “破坏” 存储库。始终在你电脑上本地运行 `composer update` ，将新的 `composer.lock` 提交到存储库，然后再在生产服务器运行 `composer install`。

### Composer检查新版本

如果你想找出 `composer.json` 包中已经发布的较新版本，直接运行 `composer outdated`。你会得到一个包含所有信息的完整列表，如下所示。

```
phpdocumentor/type-resolver 0.4.0 0.7.1
phpunit/php-code-coverage   6.1.4 7.0.3 Library that provides collection, processing, and rende...
phpunit/phpunit             7.5.9 8.1.3 The PHP Unit Testing framework.
ralouphie/getallheaders     2.0.5 3.0.3 A polyfill for getallheaders.
sebastian/global-state      2.0.0 3.0.0 Snapshotting of global state
```

### 自动大写翻译

在翻译文件中`（resources/lang）`，你不仅可以指定变量为`:variable` ，也可以指定大写为`:VARIABLE` 或 `:Variable`，然后你传递的值也会自动大写。

```php
// resources/lang/en/messages.php
'welcome' => 'Welcome, :Name'

// Result: "Welcome, Taylor"
echo __('messages.welcome', ['name' => 'taylor']);
```

### 仅含小时的Carbon

如果你想有当前日期不包含秒或者分钟，用`Carbon`的方法比如：`setSeconds(0)` 或者  `setMinutes(0)`。

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

### 单动作控制器

如果你想创建一个只有一个动作的控制器，你可以使用 __invoke() 方法创建「可调用（invokable）」控制器。
路由：

```php
Route::get('user/{id}', 'ShowProfile');
```

Artisan 命令:

```bash
php artisan make:controller ShowProfile --invokable
```

控制器 

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

### 重定向到特定的控制器方法

你不仅可以 `redirect()` 到 `URL` 或特定的路由，而且可以跳转到一个特定的控制器里的特定方法，甚至向其传递参数。像这样：

```php
return redirect()->action('SomeController@method', ['param' => $value]);
```

### 使用旧版本的Laravel

如果你想用旧版本而非新版本的 `Laravel`，使用这个命令：

```bash
composer create-project --prefer-dist laravel/laravel project "7.*"
```

将 `7.*` 更改为任何你想要的版本。

### 为分页链接添加参数

在默认的分页链接中，你可以传递其他参数，保留原始的查询字符串，甚至指向一个特定的 `#xxxxx` 锚点。

```blade
{{ $users->appends(['sort' => 'votes'])->links() }}

{{ $users->withQueryString()->links() }}

{{ $users->fragment('foo')->links() }}
```

### 可重复回调函数

如果你又一个需要多次重复调用的回调函数，你可以将其声明在一个变量中，然后反复使用它。

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


### $request->hasAny

你不仅可以使用 `$request->has()` 方法来查看一个参数，而且可以使用 `$request->hasAny()` 来查看传入的多个参数。

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

### 简单分页组件

在分页组件中，如果你只需要「上一页 / 下一页」的链接，而不是需要所有页码，也因此可以使用更少的数据库查询，你只需要将 `simplePaginate() `更改为` paginate()`

```php
// Instead of 
$users = User::paginate(10);

// You can do this
$users = User::simplePaginate(10);
```

### 获取数据的方法

如果你有一个具有复杂数据结构的数组，例如带对象嵌套的数组，你可以使用 `data_get() `助手函数配合通配符和「点」符号，来从嵌套数组或对象中检索值。

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

### Blade指令增加真假条件

`Laravel 8.51` 新增 `@class` 指令，用于添加控制 CSS 类的真 / 假条件。可以在 [文档](https://laravel.com/docs/8.x/blade#conditional-classes) <br>中了解更多
之前: 

```php
<div class="@if ($active) underline @endif">`
```

现在:

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

由 [@Teacoders](https://twitter.com/Teacoders/status/1445417511546023938)提供

### 任务允许脱离队列

在文档中，任务是在`队列`章节进行讨论的，但是你可以脱离队列来使用`job`，就像传统的委托任务的类一样。只需在控制器中调用 `$this->dispatchNow()` 即可。

```php
public function approve(Article $article)
{
    //
    $this->dispatchNow(new ApproveArticle($article));
    //
}
```

### 在工厂类或seeders外部使用Faker

如果你想要生成一些假数据，你可以在模型工厂或 Seeds 中，甚至任何类的外部使用 Faker。

注意：要在生产模式 `production` 中使用它的话，你需要在 `composer.json` 中，将 faker 从 "require-dev" 移动到 "require" 中。

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

### 可以定时执行的事情

你可以让一些事情以每小时、每天，或是其他时间模式执行。

你可以安排 `artisan` 命令、作业类、可调用类、回调函数、甚至是 `shell` 脚本去定时执行。

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

### 检索Laravel文档

如果你想使用一些关键词来检索 `Laravel` 文档，默认情况下只会给出 5 个结果。或许还能给出更多结果。

如果你想要看全部的结果，你可以前往 `Laravel` 文档 的` Github` [仓库](https://github.com/laravel/docs) 直接搜索。



### 过滤route-list
Laravel 8.34 新增： `php artisan route:list` 获得了新的参数 `--except-path`，你可以把一些你不想看见的路由过滤掉。

 [原始PR](https://github.com/laravel/framework/pull/36619)

### 自定义Blade指令

如果你在不同的 `Blade` 文件中格式化数据，可以尝试创建自己的 `Blade` 指令。
下面这一段是来自 `Laravel Cashier` 包的例子：

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

### Artisan命令帮助

如果您不确定某些 Artisan 命令的参数，或者您想知道可用的参数，只需键入 `php artisan help [command]`。




### 当运行测试时禁用懒加载

当运行测试时如果你想排除掉懒加载 你可以禁用掉懒加载

```php
Model::preventLazyLoading(!$this->app->isProduction() && !$this->app->runningUnitTests());
```

由 [@djgeisi](https://twitter.com/djgeisi/status/1435538167290073090)提供

### 使用两个很好用的辅助函数会带来魔法效果

在这个例子中 服务将会被调用并重试。如果仍然失败 将会被报告。但是请求不会失败。(rescue)

```php
rescue(function () {
    retry(5, function () {
        $this->service->callSomething();
    }, 200);
});
```

由 [@JuanDMeGon](https://twitter.com/JuanDMeGon/status/1435466660467683328)提供

### 请求参数的默认值

以下是我们检测我们使用的`per_page`值是否存在 否则我们用默认值

```php
// Isteand of this
$perPage = request()->per_page ? request()->per_page : 20;

// You can do this
$perPage = request('per_page', 20);
```

由 [@devThaer](https://twitter.com/devThaer/status/1437521022631165957)提供

### 在路由中直接传入中间件而不是注册它

```php
Route::get('posts', PostController::class)
    ->middleware(['auth', CustomMiddleware::class])
```

由 [@sky_0xs](https://twitter.com/sky_0xs/status/1438258486815690766)提供

### 将数组转化成css类

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

由 [@dietsedev](https://twitter.com/dietsedev/status/1438550428833271808)提供

### Laravel-Cashier中的upcomingInvoice方法

您可以显示客户将在下一个计费周期支付的金额。<br>

在`Laravel Cashier（Stripe）`中有一个“upcomingInvoice”方法来获取即将到来的发票详细信息。

```php
Route::get('/profile/invoices', function (Request $request) {
    return view('/profile/invoices', [
        'upcomingInvoice' => $request->user()->upcomingInvoice(),
        'invoices' => $request-user()->invoices(),
    ]);
});
```

由 [@oliverds_](https://twitter.com/oliverds_/status/1439997820228890626)提供

### $request->exists与has

```php
// https://example.com?popular
$request->exists('popular') // true
$request->has('popular') // false 

// https://example.com?popular=foo
$request->exists('popular') // true
$request->has('popular') // true
```

由 [@coderahuljat](https://twitter.com/coderahuljat/status/1442191143244951552)提供

### 返回带变量视图的多种方法

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

### 调度标准shell命令

我们可以使用`scheduled  command`调度标准shell命令

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

由y [@anwar_nairi](https://twitter.com/anwar_nairi/status/1448985254794915845)提供



### 无需SSL验证的HTTP请求
有时候你可能会在本地发送一个无需`SSL`验证的`HTTP`请求 可以如下这么干:

```php
return Http::withoutVerifying()->post('https://example.com');
```

如果想设置一些选项 可以使用 ``withOptions``

```php
return Http::withOptions([
    'verify' => false,
    'allow_redirects' => true
])->post('https://example.com');
```

由 [@raditzfarhan](https://github.com/raditzfarhan)提供
