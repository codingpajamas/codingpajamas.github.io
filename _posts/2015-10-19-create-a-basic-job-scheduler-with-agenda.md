---
layout: post
title: "Create a Basic Job Scheduler With Agenda"
date: 2015-12-20
tags: [uncategorized]
image: /images/pimg/nodejs.png
status: draft
--- 

## Introduction 

I'm adding a functionality to an online store that need to check an 'order' if it's 24 hours old and update its status from 'new' to 'abandoned'. 

I used (Agenda)[https://github.com/rschmukler/agenda] for schedule this functionality. 



## Installation and Usage

Install, include, and configure agenda on your application.

~~~sh
npm install agenda
~~~

~~~javascript
// add agenda in your app
var Agenda	= require('agenda'); 

// configure
var agenda = new Agenda({db: { address: 'localhost:27017/jobCollectionName'}});

// define a job
agenda.define('check orders', function(job, done) {
	Orders.update(conditions, update, options, function(err, result){
		
		// call "done()" to end the job
		done();
	});
});

// define interval
agenda.every('24 hours', 'check orders');

// start
agenda.start(); 

~~~

Using agenda is very easy, you just have to 