---
layout: post
title: "Advance Search in Laravel"
date: 2016-12-02
tags: [laravel]
image: /images/post/post-15.png
status: published
--- 

Every backend application requires a functionality to search data on each module - ex. products, customers, brands, etc. But oftentimes, a basic searching by "name" or "title" is not enough - the client require an advance filtering.

We can create advance search in many ways, unfortunately a lot of example and tutorials online has chosen the wrong path - even our devs.

### The Wrong Approach
I've seen others used the ```Model::when``` method and others are using ```if/else``` inside of a ```where``` closure.

{:.mb0}
But the most popular is saving the query in a variable. Then check if a filter exists and if ```true```, they chain a ```where``` method to the query object before the ending ```get()```.

~~~php
// url.com/histories?actions[]=created&actions[]=updated
$arrActions = request('actions', null);
$histories = History::orderBy('created_at', 'desc');

if($arrActions){
    $histories->whereIn('action', $arrActions);
}

$histories->get();
~~~

While all of the methods above gets the job done, it's not the best approach - not clean, not reusable, not cool.


### The Better Solution
The best solution would be using the ```eloquent's local scope```. It allows you to add a method in the model where you can perform the filtering. It's reusable in every instance of that ```Model``` - and even accessible in ```eager loading``` relationship.

{:.mb0}
For the purpose of demonstration, lets assume an agent is checking if **seller 1 or 2** has bags or purse (**category 3 or 4**) with a **color of blue or red**.  With that situation we have these ```GET``` data in our ```ProductController```, we set them as ```null``` by default just in case we are not applying filters:

~~~php
//http://website.com/products?seller[]=1&seller[]=2&category_id[]=3&category_id[]=4&color[]=blue&color[]=red
$arrSellers = request('sellers', null); // [1, 2]
$arrCatIds = request('category_id', null); // [3, 4]
$arrColors = request('color', null); // ['blue', 'red']
~~~

{:.mb0}
Now in our ```Product``` model, let's add our local scopes. What our scope methods does is checking if the passed filter **argument** is not ```null``` before modifying the **query**. If the **argument** is ```null```, it will just return the **query builder instance**.

~~~php
// filtering sellers
public function scopeOfSellers($query, $arrSellers) {
    if ($arrSellers) {  
        return $query->whereIn('seller_id', $arrSellers);
    } else {
        return $query;
    }
}

// filtering categories
public function scopeOfCategories($query, $arrCatIds) {
    if ($arrCatIds) {  
        return $query->whereIn('category_id', $arrCatIds);
    } else {
        return $query;
    }
}

// filtering colors
public function scopeOfColor($query, $arrColors) {
    if ($arrColors) {  
        return $query->whereIn('seller_id', $arrColors);
    } else {
        return $query;
    }
}
~~~

{:.mb0}
Let's now use our ```local scopes``` in our ```ProductController``` controller.

~~~php
$products = Product::orderBy('price', 'desc')
    ->ofSellers($arrSellers)
    ->ofCategories($arrCatIds)
    ->ofColor($arrColors) 
    ->get();
~~~
 
Now we can filter **products** in any controller easily, whether you're displaying filtered products in the Admin panel or a sidebar widget displaying a dynamic "top 10 products" based on the current category page. 

Thanks for reading and be sure to check the official [documentation of ```Local Scopes``` in the Laravel website](https://laravel.com/docs/5.2/eloquent#local-scopes){:target="new"}.