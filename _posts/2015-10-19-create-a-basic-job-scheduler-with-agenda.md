---
layout: post
title: "Create a Basic Job Scheduler With Agenda"
date: 2015-12-20
tags: [nodejs]
image: /images/pimg/nodejs.png
status: published
--- 

## Introduction 

I'm adding a functionality to an online store that need to check the **orders** if it's 24 hours old and update its status from 'new' to 'abandoned'. This checking task needs to run every 24 hours.

I used [Agenda](https://github.com/rschmukler/agenda) for this basic functionality because it is lightweight, easy to use, and doesn't require me to install another program in my application stack.



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

Using agenda is very easy, you just have to define the job and set the interval. And lastly, call ```start()``` method to actually start the scheduler. 

In the above example, ```done()``` was called after performing the update operation. 

## Conclusion

```Agenda``` is perfectly fine for scheduling simple periodic task. Read the [documentation](https://github.com/rschmukler/agenda#full-documentation) to learn more options like multiple jobs, job queue, managing failed jobs and more. But if your application needs more robust scheduling solution (for example you need a separate task server), I would really recommend you to check [kue](https://github.com/Automattic/kue)