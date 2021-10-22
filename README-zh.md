# Laravel 编码技巧

为所有工匠们提供的 Laravel 提示和技巧。欢迎PR 提供好点子!

想法由[PovilasKorop](https://github.com/PovilasKorop) and [MarceauKa](https://github.com/MarceauKa) 提供.

嘿 喜欢这些提示吗?也看看我优质的 [Laravel 课程](https://laraveldaily.teachable.com/)

---

__更新于 2021/10/17__:现在有194个小提示，分成14类.



## 目录

- [数据库模型与 Eloquent](#数据库模型与-Eloquent) (52 提示)
- [模型关联](#模型关联) (29 提示)
- [数据库迁移](#数据库迁移) (12 提示)
- [视图](#视图) (10 提示)
- [路由](#路由) (19 提示)
- [验证](#验证) (12 提示)
- [集合](#集合) (6 提示)
- [授权](#授权) (5 提示)
- [邮件](#邮件) (4 提示)
- [Artisan](#artisan) (5 提示)
- [工厂](#工厂) (4 提示)
- [日志与调试](#日志与调试) (5 提示)
- [API](#api) (3 提示)
- [其他](#其他) (30 提示)


## 数据库模型与 Eloquent

⬆️ [回到顶部](#Laravel-编码技巧) ➡️ [下一个 (模型关联)](#模型关联)

- [复用或克隆query](#复用或克隆query)
- [Eloquent where 日期方法](#Eloquent-where日期方法)
- [增量和减量](#增量和减量)
- [禁止 timestamp 列](#禁止-timestamp-列)
- [软删除: 多行恢复](#软删除:-多行恢复)
- [Model all: columns](#Model all:-columns)
- [To Fail or not to Fail](#To-Fail-or-not-to-Fail)
- [列名修改](#列名修改)
- [过滤结果集合](#过滤结果集合)
- [修改默认的Timestamp 字段](#修改默认的-Timestamp-字段)
- [按照created_at快速排序](#按照created_at快速排序)
- [当创建记录时自动修改某些列的值](#当创建记录时自动修改某些列的值)
- [数据库原始查询计算运行得更快](#数据库原始查询计算运行得更快)
- [不止一个范围](#不止一个范围)
- [无需转换 Carbon](#无需转换-Carbon)
- [根据首字母分组](#根据首字母分组)
- [永不更新某个字段](#永不更新某个字段)
- [find () 查询多条数据](#find ()-查询多条数据)
- [find多个模型并返回多列](#find多个模型并返回多列)
- [按照键查找](#按照键查找)
- [使用UUID替换auto-increment](#使用UUID替换auto-increment)
- [Laravel 中的子查询](#Laravel-中的子查询)
- [隐藏某些列](#隐藏某些列)
- [确定DB报错](#确定DB报错)
- [软删除与查询构造器](#软删除与查询构造器)
- [SQL声明](#SQL声明)
- [数据库事务](#数据库事务)
- [更新或创建](#更新或创建)
- [保存时移除缓存](#保存时移除缓存)
- [修改Created_at和Updated_at的格式](#修改Created_at和Updated_at的格式)
- [数组类型存储到 JSON 中](#数组类型存储到-JSON-中)
- [复制一个模型](#复制一个模型)
- [降低内存占用](#降低内存占用)
- [忽略 $fillable/$guarded 并强制执行](#忽略-$fillable/$guarded-并强制执行)
- [3层父子级结构](#3层父子级结构)
- [使用 find() 来搜索更多的记录](#使用-find()-来搜索更多的记录)
- [失败时执行任何操作](#失败时执行任何操作)
- [检查记录是否存在否则显示 404](#检查记录是否存在否则显示-404)
- [条件语句为否时中止](#条件语句为否时中止)
- [在删除模型之前执行任何额外的操作](#在删除模型之前执行任何额外的操作)
- [当你需要在保存数据到数据库时自动填充一个字段](#当你需要在保存数据到数据库时自动填充一个字段)
- [获取查询语句的额外信息](#获取查询语句的额外信息)
- [在 Laravel 中使用doesntExist()方法](#在-Laravel-中使用doesntExist()方法)
- [在一些模型的 boot () 方法中自动调用一个特性](#在一些模型的-boot-()-方法中自动调用一个特性)
- [Laravel 的 find () 方法，比只传一个 ID 更多的选择](#Laravel-的-find-()-方法，比只传一个-ID-更多的选择)
- [在 Laravel 中有两种常见的方法来确定一个表是否为空表](#在-Laravel-中有两种常见的方法来确定一个表是否为空表)
- [如何避免 property of non-object 错误](#如何避免-property-of-non-object-错误)
- [Eloquent 数据改变后获取原始数据](#Eloquent-数据改变后获取原始数据)
- [一种更简单创建数据库的方法](#一种更简单创建数据库的方法)



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
$active_products = (clone $query)->where('status', 1)->get(); // it will not modify the $query
$inactive_products = (clone $query)->where('status', 0)->get(); // so we will get inactive products from $query

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

### 软删除: 多行恢复

使用软删除时，可以在一个句子中恢复多行。

```php
Post::onlyTrashed()->where('author_id', 1)->restore();
```

### Model all: columns

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
@$post->auhtor->name

// 但你可以在Eloquent关系层面上做到这一点。
// 如果没有作者关联帖子，这种关系将返回一个空的App/Author模型。
public function author() {
    return $this->belongsTo('App\Author')->withDefaults();
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

## 模型关联

⬆️ [回到顶部](#Laravel 编码技巧) ⬅️ [上一个 (数据库模型与 Eloquent)](#数据库模型与 Eloquent) ➡️ [下一个 (数据库迁移)](#数据库迁移)

- [在 Eloquent 关系中使用 OrderBy](#在 Eloquent 关系中使用 OrderBy)
- [在 Eloquent 关系中添加条件](#在 Eloquent 关系中添加条件)
- [DB 原生查询: havingRaw ()](#DB 原生查询: havingRaw ())
- [Eloquent 使用 has () 实现多层调用查询](#Eloquent 使用 has () 实现多层调用查询)
- [一对多关系中获取符合指定数量的信息](#一对多关系中获取符合指定数量的信息)
- [默认模型](#默认模型)
- [一对多关系中一次创建多条关联数据](#一对多关系中一次创建多条关联数据)
- [多层级预加载](#多层级预加载)
- [预加载特定字段](#预加载特定字段)
- [轻松更新父级 updated_at](#轻松更新父级 updated_at)
- [一直检查关联是否存在](#一直检查关联是否存在)
- [使用 withCount () 来统计关联记录数](#使用 withCount () 来统计关联记录数)
- [关联关系中过滤查询](#关联关系中过滤查询)
- [动态预加载相关模型](#动态预加载相关模型)
- [使用 hasMany 代替 belongsTo](#使用 hasMany 代替 belongsTo)
- [重命名 pivot 表名称](#重命名 pivot 表名称)
- [仅用一行代码更新归属关系](#仅用一行代码更新归属关系)
- [Laravel 7+ 的外键](#Laravel 7+ 的外键)
- [两种 「whereHas」 组合使用](#两种 「whereHas」 组合使用)
- [检查关系方法是否已经存在](#检查关系方法是否已经存在)
- [获取中间表中的关联关系数据](#获取中间表中的关联关系数据)
- [便捷获取一对多关系中子集的数量](#便捷获取一对多关系中子集的数量)
- [对关联模型数据进行随机排序](#对关联模型数据进行随机排序)
- [过滤一对多关联](#过滤一对多关联)
- [通过中间表字段过滤多对多关联](#通过中间表字段过滤多对多关联)
- [whereHas 的一个更简短的方法](#whereHas 的一个更简短的方法)
- [提取一个重复回调作为变量](#提取一个重复回调作为变量)
- [你可以为你的模型关联添加条件](#你可以为你的模型关联添加条件)
- [新的 Eloquent 查询构建器方法 whereBelongsTo()](#新的 Eloquent 查询构建器方法 whereBelongsTo())


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

### DB 原生查询: havingRaw ()

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

## 数据库迁移

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

### Make migration for existing table

If you make a migration for existing table, and you want Laravel to generate the Schema::table() for you, then add "_in_xxxxx_table" at the end, or specify "--table" parameter.
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

Tip given by [@Zubairmohsin33](https://twitter.com/Zubairmohsin33/status/1442345998790107137)

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
- [Override the route binding resolver for each of your models](#override-the-route-binding-resolver-for-each-of-your-models)]
- [If you need public URL but you want them to be secured](#if-you-need-public-url-but-you-want-them-to-be-secured)

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
Route::get('{product:slug', Controller::class);

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

## Validation

⬆️ [Go to top](#laravel-tips) ⬅️ [Previous (Routing)](#routing) ➡️ [Next (Collections)](#collections)

- [Image validation](#image-validation)
- [Custom validation error messages](#custom-validation-error-messages)
- [Validate dates with "now" or "yesterday" words](#validate-dates-with-now-or-yesterday-words)
- [Validation Rule with Some Conditions](#validation-rule-with-some-conditions)
- [Change Default Validation Messages](#change-default-validation-messages)
- [Prepare for Validation](#prepare-for-validation)
- [Stop on First Validation Error](#stop-on-first-validation-error)
- [Throw 422 status code without using validete() or Form Request](#throw-422-status-code-without-using-validate-or-form-request)
- [Rules depending on some other conditions](#rules-depending-on-some-other-conditions)
- [With Rule::when() we can conditionally apply validation rules](#with-rule-when-we-can-conditionally-apply-validation-rules)
- [Use this property in the request classes to stop the validation of the whole request attributes](#use-this-property-in-the-request-classes-to-stop-the-validation-of-the-whole-request-attributes)
- [Rule::unique doesn't take into the SoftDeletes Global Scope applied on the Model](#rule-unique-doesnt-take-into-the-softdeletes-global-scope-applied-on-the-model)
- [Validator::sometimes() method allows us to define when a validation rule should be applied](#validator-sometimes-method-allows-us-to-define-when-a-validation-rule-should-be-applied)

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
- [Inline dd()](#inline-dd)
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

### Inline dd()

```php
// Instead of this
$clients = Client::where('payment,' 'confirmed')->get();
dd($clients);

// You can directly dd
Client::where('payment,' 'confirmed')->get()->dd();
```

Tip given by [@LaraibiM](https://twitter.com/LaraibiM/status/1437857603263078421)

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
- [Get rid of that extra inner data wrap](#get-rid-of-that-extra-inner-data-wrap)

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

### Get rid of that extra inner data wrap

When creating a Laravel Resource collection, you can get rid of that extra inner data wrap by adding `JsonResource::withoutWrapping();` in your `AppServiceProvider`

```php
public function boot()
{
    JsonResource::withoutWrapping();
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
- ["upcomingInvoice" method in Laravel Cashier (Stripe)](#upcomingInvoice-method-in-laravel-cashier-stripe)
- [Laravel Request exists() vs has()](#laravel-request-exists-vs-has)
- [There are multiple ways to return a view with variables](#there-are-multiple-ways-to-return-a-view-with-variables)
- [Schedule regular shell commands](#schedule-regular-shell-commands)

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