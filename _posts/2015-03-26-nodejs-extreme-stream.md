---
layout: post
title: "Nodejs Stream, The Basic"
date: 2015-03-26
tags: [angularjs]
image: /images/pimg/nodejs.png
status: draft
--- 

## Introduction
 
I've been working lately on an application that needs to read a big data on a big file. Node ```fs``` provides api for reading and writing files like ```fs.readFile``` and ```fs.writeFile``` and their synchronous counterparts. But if you're reading big files with ```fs.readFile``` you'll probably hit some memory issues because it will buffer up the entire file into the memory. Another issue is your application needs to wait until the whole file was loaded in the memory before processing some output.

**Stream** to the rescue. It reads the file in chunk and submit each chunk immediately for processing. This way your application doesn't wait and doesn't trigger memory overload.


## Problem

I need to read the big file line by line and start processing the data as soon as I get it.

## The Basic of Streams

There are several types of Stream and all of them are **EventEmitters**.

### The Readable Stream

The **readable** stream is the source of data. To create a readable stream, require the ```stream``` module and create a new instance then call the ```Readable``` constructor.


~~~javascript
var Stream = require('stream');
var readStream = new Stream.Readable;

readStream.push('This is first data \n'); 
readStream.push('This is second data \n'); 
readStream.push(null);

readStream.on('end', function(){
	console.log('done');
}); 

readStream.pipe(process.stdout); 
~~~

```readStream.push``` put the data into the read queue when data is available. Push a null value to signal that it's done outputting the data.

### The Writable Stream

The **writeable** stream is the destination of data.

### Duplex Stream

## The .pipe()

.pipe() vs .write()

> Note: If no data event handlers are attached, and there are no pipe() destinations, and the stream is switched into flowing mode, then data will be lost. 

## Pause and Resume  

## Transform Stream 



