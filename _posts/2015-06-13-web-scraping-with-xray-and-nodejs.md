---
layout: post
title: "Web Scraping with Xray and Nodejs"
date: 2015-06-13
tags: [nodejs]
image: /images/pimg/nodejs.png
status: published
--- 

## Introduction

{:.alert.alert-danger.padTB20}
First, web scrapping is illegal. So be sure that you ask permission and you are allowed to scrape the website to avoid some legal issues.
Second, this post is not to promote stealing private data on the internet. Its purpose is to demonstrate how to use nodejs's [xray](#) package.

I used to scrape the internet for a Big Data company and it was not fun. I have to use multiple nodejs packages like **express**, **request**, **cheerio**, **async**, and some utility packages. I need to work on a very complicated callback hell just to create at least 3 levels deep of nested object. Sigh. 

But now, good guy [Mat](#) created **xray** and shared it to public. It's so easy to use so let's start scraping. For this deme I'll be getting some data from IMDB. (Shhhhh... I did not ask permission to use their data).

On this post, we will learn how to :

1. scrape
2. crawl the links
3. proceed to the next page
4. and stream our data

## 1. Basic scrapping

First, you need to install ``xray``.

~~~sh
npm install x-ray --save
~~~

Getting a content from a given URL is very easy. ``require`` xray in your application and then initialize it. 

~~~javascript
var Xray = require('x-ray');
var x = Xray();

x()
~~~

``xray`` needs some arguments to work. 

1. **URL** - this is some description
2. **data structure** - this is some description
3. **callback** - this is some description

So the code above will display the **title** of the page of the given URL. Now let's get all the posts listed in that page. With the help of **selector**, that would be an easy task.

~~~javascript
// code here
~~~

Now that code will display the list of posts in that page.

~~~javascript
// list of posts
~~~


## 2. A Bit More Exciting Scraping

Now that we can get each posts in that page, lets try to crawl to each link of every posts. To do that, al you have to do is initialize another instance of ``xray`` as a value of an object

~~~javascript
x(
  url,
  [{
    postTitle : '.post',
    postDetails : x(
                    '.post@href',
                    [{
                        content: '.content'
                    }]
                  )
  }]
)(function(err,data){
	if(err){
		console.log(err);
	}else{
		console.log(data);
	}
})
~~~

What this code does is it loops on every post then crawl to the link from ``.post@href`` and get the data from ``.content`` element on that page and save it on the ``postDetails`` of that iteration. If you didn't encounter an error, you'll see a new item on your post object call ``postDetails``with the blog article as value

~~~javascript
// sample result
~~~

## 3. Scraping Website with Pagination 