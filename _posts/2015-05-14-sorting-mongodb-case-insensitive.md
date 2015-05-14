---
layout: post
title: "Sorting MongoDB Case Insensitive"
date: 2015-05-14
tags: [mongodb]
image: /images/pimg/mongo.png
status: published
--- 
MongoDB doesn't support sorting on **lexicographical order** (lexical order, dictionary order, alpahbetical order, or human readable order). 

{:.mb0}
Consider the following data:

~~~javascript
{item : 'Cabbage'}
{item : '100 Tomatoes'}
{item : 'apple'}
{item : 'Orange'}
~~~

{:.mb0}
Now if you sort that by **item** field :

~~~javascript
db.items.find().sort({item:1})
~~~

{:.mb0}
You will get :

~~~javascript
{item : '100 Tomatoes'}
{item : 'Cabbage'}
{item : 'Orange'}
{item : 'apple'}
~~~

The rule of mongodb sorting is **numeric** first, then **upper case letters** then **lower case letters** last. That sucks.

###Solution 1 : Extra Field

You can add an extra field in your collection and store a lowercase version of the **title** field

~~~javascript
{item : 'Cabbage', lowertitle : 'cabbage'}
{item : '100 Tomatoes', lowertitle : '100 tomatoes'}
{item : 'apple', lowertitle : 'apple'}
{item : 'Orange', lowertitle : 'orange'}
~~~

{:.mb0}
Now if you sort that by **lowertitle** field, you'll get :

~~~javascript
'100 Tomatoes'
'apple'
'Cabbage'
'Orange
~~~

But what if you want to sort with other fields (ex. firstname, lastname, state, country), this would still sucks because you need to add many fake fields just for the purpose of sorting.

###Solution 2 : MongoDB Agrregation Framework

You can use MongoDB's [aggregattion framework](http://docs.mongodb.org/v2.2/applications/aggregation/){:target="_new"}

~~~javascript
db.items.aggregate([
    { "$project": {
       "item": 1,
       "loweritem": { "$toLower": "$item" }
    }},
    { "$sort": { "loweritem": 1 } }
])
~~~

```$project``` was used to transform the **item** field into lowercase and store it into a new field **loweritem**.

Then ```$sort``` was used to sort all the documents by the **loweritem** field.

After running the **aggregate query**, you'll get the follwing result:

~~~javascript
{item : '100 Tomatoes', loweritem : '100 tomatoes'}
{item : 'apple', loweritem : 'apple'}
{item : 'Cabbage', loweritem : 'cabbage'}
{item : 'Orange', loweritem : 'orange'}
~~~

Let's hope mongodb will support lexical sorting in its basic sorting functionality in the future.