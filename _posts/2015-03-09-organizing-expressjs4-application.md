---
layout: post
title: "Organizing your expressjs 4 apllication"
date: 2015-03-09
tags: [expressjs, nodejs]
image: /images/pimg/expressjs.png
status: draft
---  

## Introduction

>Fast, unopinionated, minimalist web framework for Node.js

ExpressJS is one of the easier and more popular nodejs framework out there and you can find numerous blogs and tutorials in the internet.

## Problem
Because ```express``` is an **unopinionated** framework, almost every tutorial in the internet does their tutorial in different way from others which confuses beginners specially in how they organize express application.

## Solution
This is not the only way of organizing your express application but this works for me and I'll share it to you.

### 1. Intall ExpressJS

~~~ sh
mkdir orgpress
cd express
~~~

Open your terminal and create ```orgpress``` directory then ```cd``` to it. Yes, I can't think of a better app name than combining **organize express** to become **orgpress**. And yes again, im on windows.

Create ```package.json``` by typing ```npm init``` and then fillup the terminal wizzard with the details for our application. Please refer to the image below.

{:.text-center}
![npminit](/images/post/post-3-1.png)

Install ```express``` and register it in package.json as a dependency.

~~~sh
npm install express --save
~~~

We also need to install some of the most common express dependencies.

{:.mb0}
```jade``` for templating engine

~~~sh
npm install jade --save
~~~

{:.mb0}
```mongoose``` is an **odm** which will help us manipulate mongodb 

~~~sh
npm install mongoose --save
~~~

{:.mb0}
```body-parser```is a node.js body parsing middleware

~~~sh
npm install body-parser --save
~~~ 

After installing these modules successfully, we're now ready to create our express application.

### 2. Creating express application

Let's create our ```orgpress``` file structure.

~~~ sh
/orgpress
	/config
		db.js
	/models
		blog.js
	/node_modules
	/public
		/css
			styles.css
		/js
			functions.js
		images
			logo.png
	/routes
		blogs.js
		index.js
	/views
		/blogs
			index.js
			create.js
			edit.js
			show.js
	index.js
	package.json
~~~

The ```/config``` folder will contains all configuration files such as the database config in ```db.js```.

The ```models``` folder contains our mongoose schemas.

The ```node_modules``` is where our dependency modules reside.

The ```/public``` folder is where our assets like css, javascript and image files go.

The ```/routes``` folder will contains our routes. 

The ```/views``` folder contains our template files. We created sub-folders to group the templates based on their types (or based on available schemas).


An express application's heart is ```index.js``` which was declared as our ```main``` in ```package.json``` when installing express.

~~~ javascript
"main": "index.js"
~~~

This ```index.js``` file is composed of 5 parts :

1. Include dependencies
2. Set configurations
3. Declare the middlewares
4. Declare routes
5. Start express application

{:.page-subheader}
### 2.a Include dependencies

When creating an express application, the most important part is adding your dependencies specially the ```express``` module.

~~~ js
// declare dependencies
var express = require('express');
var app = express(); 
var path = require('path');
var bodyParser = require('body-parser'); 
var mongoose = require('mongoose');
~~~

In the chunk of code above, we required ```express``` in our application and store it in a variable. Then we invoke it with ```express()``` to expose its APIs and saved it to ```app``` variable. 

We also included the ```path```, ```bodyParser```, ```mongoose```. 

{:.page-subheader}
### 2.b Setup configurations

~~~ js
// configurations
app.set('views', path.join(__dirname, 'views'));
app.set('views engine', 'jade');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
require('./config/db')(mongoose); /* database configuration */ 
~~~