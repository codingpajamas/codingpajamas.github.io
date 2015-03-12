---
layout: post
title: "Organizing your expressjs 4 apllication"
date: 2015-03-09
tags: [expressjs, nodejs]
image: /images/pimg/expressjs.png
status: published
---  

{:.text-center.panel.panel-default.padTB20}
[Check the code on Github](https://github.com/codingpajamas/orgpress){:.btn.btn-primary.btn-lg}{:target="new"}

## Introduction

>Fast, unopinionated, minimalist web framework for Node.js

ExpressJS is one of the easier and more popular nodejs framework out there and you can find numerous blogs and tutorials in the internet.

## Problem
Because ```express``` is an **unopinionated** framework, almost every tutorial in the internet does the same thing in different way which confuses beginners specially in organizing their express application.

## Solution

In this article we will follow a ```MVC```ish style where we have a ```model``` folder for our mongo schemas, a ```views``` folder for our templates and a ```routes``` folder for our routes which are going to act as our controllers. Also an ```index.js``` file as entry point to our express application. So let's start.


### 1. Intall ExpressJS

Open your terminal and create ```orgpress``` directory then ```cd``` to it. Yes, I can't think of a better app name than combining **organize express** into **orgpress**. And yes again, im on windows.

~~~ sh
mkdir orgpress
cd orgpress
~~~

Create ```package.json``` by typing ```npm init``` and then fillup the terminal wizzard with the details for our application. Please refer to the image below.

{:.text-center}
![npminit](/images/post/post-3-1.png)

{:.mb0}
Install ```express``` and register it in package.json as a dependency.

~~~sh
npm install express --save
~~~

We also need to install some of the most common modules used in express applications.

{:.mb0}
For our templating engine, we will use ```jade```. 

~~~sh
npm install jade --save
~~~

{:.mb0}
An **odm** which will help us in mongodb, I usualy use ```mongoose```

~~~sh
npm install mongoose --save
~~~

{:.mb0}
```body-parser```is a node.js body parsing middleware

~~~sh
npm install body-parser --save
~~~ 

After installing these modules successfully, we're now ready to create our express application.

### 2. Creating the files and sub-folders

Let's create our ```orgpress``` file structure.

~~~ sh
/orgpress
	/config
		db.js
	/models
		blog.js
		store.js
	/node_modules
	/public
		/css
		/js
		/images
	/routes
		blogs.js
		index.js
		stores.js
	/views
		/blogs
			index.js
		/stores
			index.js
	index.js
	package.json
~~~

This is how I organize my ```express 4``` application. 

The ```/config``` folder contains all configuration files such as the database config in ```db.js```.

The ```/models``` folder contains our mongoose schemas.

The ```/node_modules``` is where our dependency modules reside.

The ```/public``` folder is where our assets like css, javascript and image files go.

The ```/routes``` folder will contains our route files. 

The ```/views``` folder contains our template files. We created sub-folders to group the templates based on their types (or based on available schemas).


The ```index.js```  is the heart of express application and it is composed of 5 parts:

1. **Include dependencies**
2. **Set configurations**
3. **Create the custom middlewares**
4. **Declare routes**
5. **Start express application**

### 3. Creating express application

{:.page-subheader}
### 3.a Include the dependencies

When creating an express application, the first part is adding your dependencies specially the ```express``` module.

~~~ js
// declare dependencies
var express = require('express');
var app = express(); 
var path = require('path');
var bodyParser = require('body-parser'); 
var mongoose = require('mongoose');
~~~

In the chunk of code above, we required ```express``` in our application and stored it in a variable. Then we invoked it with ```express()``` to exposed its APIs and saved it to ```app``` variable. 

We also required the ```path```, ```bodyParser```, ```mongoose``` modules. 

{:.page-subheader}
### 3.b Setup configurations

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

Basically, we're configuring express settings using ```app.set()```. You can find more properties to configure [at express docs](http://expressjs.com/api.html#app.settings.table){:target="new"}. And we use ```app.use``` to configure the middlewares from our dependency modules.

If you noticed we didn't required ```jade``` when we're including our application dependencies but we're using it in the configuration by setting it as a value of ```views engine```, that's because express imported it already behind the scene (but you still need to install ```jade``` module locally).

And lastly, we configure ```mongoose``` to connect to mongodb by requiring the file (or in this case a module) ```db.js``` inside the ```/config``` folder and passed the ```mongoose``` object.

This is what our database configuration looks like.

~~~ javascript
// '/config/db.js'
module.exports = function(mongoose) {  
	var dbURI = 'mongodb://localhost/orgpress';
	mongoose.connect(dbURI);

	mongoose.connection.on('connect', function(){
		console.log('Mongoose connected on ' + dbURI);
	});

	mongoose.connection.on('error', function(err){
		console.log('Mongoose connection : ' + err);
	}); 
}
~~~


{:.page-subheader}
### 3.b Creating the routes

This is where most of the beginners get confused, **structuring routes**. Normally routes can be created in the ```index.js``` file but as your application grows bigger, it'll get ugly. I've seen different ways but the cleanest is the **middleware** style of routing. 

First we include the routes in our express application:

~~~ javascript
// call routes
require('./routes')(app);
~~~ 

So let's create a ```routes``` folder which has an ```index.js``` as entry point. Then inside our index.js, we will call our other route files. 

{:.mb0}
Inside ```/routes/index.js```

~~~ javascript
// '/routes/index.js'
module.exports = function (app) {
    app.use('/blogs', require('./blogs'));
    app.use('/stores', require('./stores'));
    //and some other route files if you have more...
};
~~~

{:.mb0}
Inside ```/routes/blogs.js```

~~~ javascript
// '/routes/blogs.js'
var express = require('express');
var router = express.Router();
var Blog = require('../models/blog');

router.get('/', function(req, res){ 
	Blog.find({},{},{}, function(err, blogs){
		if(!err){
			res.render('blogs/index.jade', {});
		} else {
			res.send(err);
		}
	});
});

module.exports = router;
~~~

{:.mb0}
And let's create ```/routes/users.js``` too.

~~~ javascript
// '/routes/stores.js'
var express = require('express');
var router = express.Router();
var Store = require('../models/store');

router.get('/', function(req, res){ 
	Store.find({},{},{}, function(err, stores){
		if(!err){
			res.render('stores/index.jade', {});
		} else {
			res.send(err);
		}
	});
});

module.exports = router;
~~~

{:.page-subheader}
### 3.c The models

As you can see in ```/routes/blog.js```, we required the ```../models/blog```. So let's create our **blog schema**.

~~~ javascript
// '/models/blog.js'
var mongoose = require('mongoose');

var blogSchema = new mongoose.Schema({
	title: String, 
	body: String, 
	category: String, 
	createdOn: {type: Date, default: Date.now()},
	modifiedOn: {type: Date} 
});

module.exports = mongoose.model('Blog', blogSchema);
~~~

You might be wondering (and worrying maybe) why we have to do ```mongoose = require('mongoose')``` again, we already did that in the main ```index.js```. Don't worry about that because ```require``` will return the same mongoose object, it didn't instantiate the module twice.

Let's create the ```store``` schema too since we create a controller for stores.

~~~ javascript
// '/models/store.js'
var mongoose = require('mongoose');

var storeSchema = new mongoose.Schema({
	name: String,
	location : String,
	owner: String
});

module.exports = mongoose.model('Store', storeSchema);
~~~

{:.page-subheader}
### 3.d The views

Let's create a very simple view for the sake of having a complete express application. So in the views folder let's create 2 folders, ```blogs``` and ```stores```, and each directory will have an ```index.jade``` file. 

{:.mb0}
Our **blog** template at ```/views/blogs/index.jade```.

~~~ html
h1
	| Welcome to my blog
~~~

{:.mb0}
Our **store** template at  ```/views/stores/index.jade```.

~~~ html
h1
	| Welcome to my store
~~~

Yes, our template's code are simple and clean. That's ```jade``` syntax for you, you can learn more about jade syntax in their [website](http://jade-lang.com/){:target="new"}

{:.page-subheader}
### 3.e Start our expressjs application

In order to start express, we just need to listen to listen to a port.

~~~ javascript
// start app
var port = process.env.PORT || 3000;
app.listen(port, function(){
	console.log('Listening to port ' + port);
})
~~~

Now go to your terminal, make sure that ```mongod``` is active, and run ```node index```. Then browse to [http://localhost:3000/stores](http://localhost:3000/stores) to test your ```expressjs v.4.x``` application.


## Done!
This is not the only way of organizing your express application but this works for me and it's simply well organized. There's also an ```express generator``` which was reserved for another post. Thank you for reading.

{:.text-center.panel.panel-default.padTB20}
[Check the code on Github](https://github.com/codingpajamas/orgpress){:.btn.btn-primary.btn-lg}{:target="new"}