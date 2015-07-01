---
layout: post
title: "Prototyping Angularjs Project with http-server and json-server"
date: 2015-06-30
tags: [angularjs]
image: /images/pimg/ng.png
status: draft
--- 

## Introduction
Building an angularjs prototype can be hard, actually it's like you're already creating the whole app. You need to setup mongo to store your data and then setup expressjs to create a restfull API, sometimes you don't need this setup but most of the time you need the CRUD functionality.

## Setup
For this article, I assume you're working on nodejs environment. 

### The Layout
So first, install ```http-server``` globally, it's a zero-configuration node module that can magically load your static files in the browser. How cool is that? Working node website without using and configuring framework like Expressjs.

~~~sh
npm install http-server -g
~~~

After installing, let's construct our files and folders. I created a folder name **ngproto** as a container of our application. Then inside are the **css**, **js**, **partials**, and **index.html**. This is a very basic html/css setup, you can do you own style here.

{:.text-center}
![npminit](/images/post/post-6-1.png)

- **index.html** is the will that will be served to the browser. It's a basic website setup with all the css and angularjs included. On the body, I instantiate our angularjs app called ``taskApp`` and has ```ng-view``` where we can display the appropriate partials based on the user's action. The view was also wrapped in a bootstrap layout
- **css** folder contains all css related files. I'll be using ```bootstrap``` to help me style this app.
- **js** folder contains all javascript files. I already added the necessary angularjs for this application. There's also **app.js** file where we will be writing our angularjs code.
- **partials** folder contains our view templates.  
- **data** folder will be our database container which we will setup later in the next section.

{:.mb0}
Contents of **index.html** file.

~~~html
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>Prototyping Angularjs</title>
	<link rel="stylesheet" href="css/bootstrap.css">
	<link rel="stylesheet" href="css/styles.css">
	<script src="js/angular.min.js"></script>
	<script src="js/angular.resource.js"></script>
	<script src="js/angular.route.js"></script>
	<script src="js/app.js"></script>
</head>
<body ng-app="taskApp">
	<div class="container">
		<div class="row">
			<div class="col-md-6 col-md-push-3">
				<div ng-view></div>
			</div>
		</div>
	</div>
</body>
</html>
~~~

After this setup, open terminal and cd to this directory and type ```http-server``` then enter.

~~~sh
http-server
~~~

Now open your browser, visite ```http://localhost:8080/``` and boom!!! Nothing!!! That's because we're not displaying anything yet. You can inspect the page and check if the index.html was really loaded, you can also see some angularjs error in the console. We'll fix that later.




### The REST API
Second module that you need to install is the ```json-server```. This module gives you an instant REST API without setting up mongodb.

~~~sh
npm install json-server -g
~~~

After installing, it's time to setup. Create a new json file called ```db.json``` inside the **data** folder. On that file, we'll create our schema.

{:.mb0}
Contents of **db.json** file.

~~~javascript
{
	"tasks": [
		{ "id": 1, "name": "Install http-server", "status": "done" },
		{ "id": 2, "name": "Install json-server", "status": "done" },
		{ "id": 3, "name": "Setup files and folders", "status": "done" },
		{ "id": 4, "name": "Setup Rest api", "status": "todo" },
		{ "id": 5, "name": "Create angular CRUD", "status": "todo" },
		{ "id": 6, "name": "Test app", "status": "todo" }
	]
}
~~~ 

Our database contains list of task. To test this, open another terminal and cd to the **data** directory and type ```json-server db.json``` then enter.

~~~sh
json-server db.json
~~~

Now open your browser and visit ```http://localhost:3000/tasks``` to view all out **task**.

To view a task with specific ```id```, just add ```/id_number``` in the url like ```http://localhost:3000/tasks/1```

Now we have a REST api. [You can learn more about json-server here](https://github.com/typicode/json-server)

## Boostraping our Angularjs Application

So after all these setup, let's now build our angularjs application by writing some angularjs code in ```app.js``` . 

~~~javascript
'use strict';

angular.module('taskApp', ['ngRoute', 'ngResource'])
	.config()
	.factory()
	.controller()
~~~ 

You may have done it in a different way but I like to start my angularjs code this way. First instantiate my application name with ```angular.module``` together with the dependency modules. Then setup the **urls** in ```config()```, followed by creating the restful functionality in ```factory()``` service, and then create the **controllers**.

For the basic CRUD (create, read, update, delete) functionality, I'll be using angularjs' service with ```$resource```. 

{:.alert.alert-warning}
The ```ngResource``` module is not part of angular's core. It's in a separate file that you need to download and include in your html.

## The Basic Angular CRUD

### Displaying Task Item

### Adding New Task

### Editing Task

### Deleting Task

## Conclusion