## Validation

⬆️ [Go to main menu](README.md#laravel-tips) ⬅️ [Previous (Routing)](routing.md) ➡️ [Next (Collections)](collections.md)

- [Image validation](#image-validation)
- [Add Values to the Form Request After Validation](#add-values-to-the-form-request-after-validation)
- [Access model binding in FormRequests](#access-model-binding-in-formrequests)
- [Rule which ensures the field under validation is required if another field is accepted](#rule-which-ensures-the-field-under-validation-is-required-if-another-field-is-accepted)
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
- [Password::defaults method](#passworddefaults-method)
- [Form Requests for validation redirection](#form-requests-for-validation-redirection)
- [Mac validation rule](#mac-validation-rule)
- [Validate email with TLD domain required](#validate-email-with-tld-domain-required)
- [New array validation rule required_array_keys](#new-array-validation-rule-required_array_keys)
- [Position placeholder in validation messages](#position-placeholder-in-validation-messages)
- [Exclude validation value](#exclude-validation-value)

### Image validation

While validating uploaded images, you can specify the dimensions you require.

```php
['photo' => 'dimensions:max_width=4096,max_height=4096']
```

### Add Values to the Form Request After Validation

```php
class UpdatedBookRequest extends FormRequent
{
     public function validated()
     {
          return array_merge(parent::validated(), [
               'user_id' => Auth::user()->id,
          ]);
     }
}
```

### Access model binding in FormRequests

When using FormRequests, you can always access the binding model by simply using the following expression `$𝘁𝗵𝗶𝘀->{𝗿𝗼𝘂𝘁𝗲-𝗯𝗶𝗻𝗱𝗶𝗻𝗴-𝘃𝗮𝗿𝗶𝗮𝗯𝗹𝗲}`

Here's an example.

```php
class CommunityController extends Controller
{
     // ...
     public function update(CommunityUpdateRequest $request, Community $community)
     {
          $community->update($request->validated());

          return to_route('communities.index')->withMessage('Community updated successfully.');
     }
     // ...
}

class CommunityUpdateRequest extends FormRequest
{
     // ...
     public function rules()
     {
          return [
               'name' => ['required', Rule::unique('communities', 'name')->ignore($this->community)],
               'description' => ['required', 'min:5'],
          ];
     }
     // ...
}
```

Tip given by [@bhaidar](https://twitter.com/bhaidar/status/1574715518501666817)

### Rule which ensures the field under validation is required if another field is accepted

You can use `required_if_accepted` validation rule which ensures the field under validation is required if another field is accepted (a value of yes, on, 1, or true).
```php
Validator::make([
     'is_company' => 'on',
     'company_name' => 'Apple',
], [
     'is_company' => 'required|boolean',
     'company_name' => 'required_if_accepted:is_company',
]);
```

Tip given by [@iamgurmandeep](https://twitter.com/iamgurmandeep/status/1583420332693749761)

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

Thanks to Rule::when() we can conditionally apply validation rules in laravel.

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

Use this property in the request classes to stop the validation of the whole request attributes.

Hint Direct

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

Strange that `Rule::unique` doesn't take into the SoftDeletes Global Scope applied on the Model, by default.

But `withoutTrashed()` method is available

```php
Rule::unique('users', 'email')->withoutTrashed();
```

Tip given by [@Zubairmohsin33](https://twitter.com/Zubairmohsin33/status/1438490197956702209)

### Validator::sometimes() method allows us to define when a validation rule should be applied

The laravel `Validator::sometimes()` method allows us to define when a validation rule should be applied, based on the input provided.

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

If you want to validate elements of an array that you submited use dot notation in rules with '\*'

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

### Password::defaults method

You can enforce specific rules when validating user-supplied passwords by using the Password::defaults method. It includes options for requiring letters, numbers, symbols, and more.

```php
class AppServiceProvider
{
    public function boot(): void
    {
        Password::defaults(function () {
            return Password::min(12)
                ->letters()
                ->numbers()
                ->symbols()
                ->mixedCase()
                ->uncompromised();
        })
    }
}

request()->validate([
    ['password' => ['required', Password::defaults()]]
])
```

Tip given by [@mattkingshott](https://twitter.com/mattkingshott/status/1463190613260603395)

### Form Requests for validation redirection

when using Form Requests for validation, by default the validation error will redirect back to the previous page, but you can override it.
Just define the property of `$redirect` or `$redirectRoute`.

[Link to docs](https://laravel.com/docs/master/validation#customizing-the-redirect-location)

```php
// The URI that users should be redirected to if validation fails./
protected $redirect = '/dashboard';

// The route that users should be redirected to if validation fails.
protected $redirectRoute = 'dashboard';
```

### Mac validation rule

New mac_address validation rule added in Laravel 8.77

```php
$trans = $this->getIlluminateArrayTranslator();
$validator = new Validator($trans, ['mac' => '01-23-45-67-89-ab'], ['mac' => 'mac_address']);
$this->assertTrue($validator->passes());
```

Tip given by [@Teacoders](https://twitter.com/Teacoders/status/1475500006673027072)

### Validate email with TLD domain required

By default, the `email` validation rule will accept an email without tld domain (ie: `taylor@laravel`, `povilas@ldaily`)

But if you want to make sure the email must have a tld domain (ie: `taylor@laravel.com`, `povilas@ldaily.com`), use `email:filter` rule.

```php
[
    'email' => 'required|email', // before
    'email' => 'required|email:filter', // after
],
```

Tip given by [@Chris1904](https://laracasts.com/discuss/channels/general-discussion/laravel-58-override-email-validation-use-57-rules?replyId=645613)

### New array validation rule required_array_keys

Laravel 8.82 adds a `required_array_keys` validation rule. The rule checks that all of the specified keys exist in an array.

Valid data that would pass the validation:

```php
$data = [
    'baz' => [
        'foo' => 'bar',
        'fee' => 'faa',
        'laa' => 'lee'
    ],
];

$rules = [
    'baz' => [
        'array',
        'required_array_keys:foo,fee,laa',
    ],
];

$validator = Validator::make($data, $rules);
$validator->passes(); // true
```

Invalid data that would fail the validation:

```php
$data = [
    'baz' => [
        'foo' => 'bar',
        'fee' => 'faa',
    ],
];

$rules = [
    'baz' => [
        'array',
        'required_array_keys:foo,fee,laa',
    ],
];

$validator = Validator::make($data, $rules);
$validator->passes(); // false
```

Tip given by [@AshAllenDesign](https://twitter.com/AshAllenDesign/status/1488853052765478914)

### Position placeholder in validation messages

In Laravel 9 you can use the :position placeholder in validation messages if you're working with arrays.

This will output: "Please provide an amount for price #2"

```php
class CreateProductRequest extends FormRequest
{
    public function rules(): array
    {
        return  [
            'title' => ['required', 'string'];
            'description' => ['nullable', 'sometimes', 'string'],
            'prices' => ['required', 'array'],
            'prices.*.amount' => ['required', 'numeric'],
            'prices.*.expired_at' => ['required', 'date'],
        ];
    }

    public function messages(): array
    {
        'prices.*.amount.required' => 'Please provide an amount for price #:position'
    }
}
```

Tip given by [@mmartin_joo](https://twitter.com/mmartin_joo/status/1502299053635235842)

### Exclude validation value

When you need to validate a field, but don't actually require it for anything e.g. 'accept terms and conditions', make use of the `exclude` rule. That way, the `validated` method won't return it...

```php
class StoreRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => 'required|string',
            'email_address' => 'required|email',
            'terms_and_conditions' => 'required|accepted|exclude',
        ];
    }
```

```php
class RegistrationController extends Controller
{
    public function store(StoreRequest $request)
    {
        $payload = $request->validated(); // only name and email

        $user = User::create($payload);

        Auth::login($user);

        return redirect()->route('dashboard');
    }
```

Tip given by [@mattkingshott](https://twitter.com/mattkingshott/status/1518590652682063873)

