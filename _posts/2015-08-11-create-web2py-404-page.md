---
layout: post
title: "Create a Web2py 404 Page"
date: 2015-08-11
tags: [python]
image: /images/post/post-8-1.png
status: published
--- 

## Introduction
**Web2py** is an apllication framework for **python**. Creating a web2py project is so easy. Unfortunately, creating a **404 page** is not so obvious for a first-time user like me. Even after reading the [docs](http://web2py.com/book/default/chapter/04#Routes-on-error){:target="_new"} and searching the internet for hours, I can't figure out how.

So after trying/combining/testing a lot of suggestions from stackoverflow, I have finally had my 404 page.

## The Problem
My web2py installation has more than 5 applications and I need a single 404 page to serve whenever something not nice happen, regardless of what application has failed.

## The Solution

### The 404 Application
First, create a new application called 404. Why? So you can display it by using this url format "http://localhost:8000**/404**". Now style that application to match your website. Unfortunately you need to import the stylesheets and images from your main application, but this is better than creating 404 pages in each applications (in my case, 5 applications).

### The routes.py
Now create a routes.py in the root folder of web2py to re-route any error request on the server.

~~~python
routes_onerror = [
  ('app1/400', '/404'),
  ('app1/*', '/404'),
  ('samp2/400', '/404'),
  ('samp2/*', '/404'),
  ('*/404', '/404'),
  ('*/*', '/404')
]
~~~

What the code above does is to map any invalid urls to your 404 application page. Now you don't have to worry about invalid application or controller or function errors because they will be handled gracefully. 

{:.text-center.alert.alert-danger.padTB20}
Beware of the syntax error you have because they will be hidden by your beautiful 404 page, so make sure you disable this in your dev/staging environment.

I hope this helps and thank you reading.