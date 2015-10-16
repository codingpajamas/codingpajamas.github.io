---
layout: post
title: "Web Scraping with Nodejs and X-ray"
date: 2015-10-07
tags: [nodejs]
image: /images/pimg/nodejs.png
status: draft
--- 


## Introduction

{:.alert.alert-danger.font12}
This post does not promote online piracy. The intention of this article is to show you how to use a specific module written for nodejs. Please scrape responsibly. I'll be using "https://www.reddit.com/r/Steam/" website for demonstration purposes and I didn't ask permission from the site admin. 

Today we will scrape online contents using xray. Let's start with the basic scraping then move into more advance like data composition, subpages, and paginations.

To start, create a new node project using npm and install **xray** module.

~~~sh
npm install x-ray --save
~~~

Then require xray module into your project.

~~~javascript
var x = require('x-ray')();
~~~


## Basic Usage - Scraping One Page

As it was written on [xray's github page](https://github.com/lapwinglabs/x-ray#xrayurl-selectorfn), scraping elements are pretty basic. You can use the 'tag', 'class', or attribute as a parameter to xray instance.

{:.mb0}
The syntax:

~~~javascript
xray(url, selector)(function(err, obj){ })
~~~

{:.mb0}
So let's get the content of ```<title>``` tag. 

~~~javascript
xray('https://www.reddit.com/r/Steam/', 'title')(function(err, title) {
  console.log(title) // Steam on Reddit
})
~~~

{:.mb0}
Scrape using an element class. Lets get the footer text.

~~~javascript
xray('https://www.reddit.com/r/Steam/', '.bottommenu')(function(err, text){
  console.log(text) // fotter text
})
~~~

{:.mb0}
To scrape a collection, wrap your selector with square brackets ```[]```. This will return all the content in an **array** format. Let's try that by getting all the text in the header menu.

~~~javascript
xray('https://www.reddit.com/r/Steam/', ['.tabmenu li'])(function(err, menu){
  console.log(menu) // ['hot', 'new', 'rising', 'controversial', 'top', 'gilded', 'wiki', 'promoted']
})
~~~

## Data Composition

explanation goes here.

~~~javascript
xray(
  'https://www.reddit.com/r/Steam/', 
  '.thing.link', 
  [{item:'.title'}]
)(function(err, items){
  console.log(items);
})
~~~

## Scraping Links From Collection

Now that we can scrape on collection and compose a data, let's try to crawl the links and scrape the title of the page and add that to our data.

~~~javascript
xray(
  'https://www.reddit.com/r/Steam/', 
  '.tabmenu li', 
  [{
    item:'a',
    title: xray('a@href', 'title')
  }]
)(function(err, items){
  console.log(items);
})
~~~

-adding limit

## Scraping paginated website
- next and 123 pages
- streaming of data