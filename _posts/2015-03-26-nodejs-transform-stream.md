---
layout: post
title: "Nodejs Transform Stream, Reading a File Line by Line"
date: 2015-03-26
tags: [nodejs]
image: /images/pimg/nodejs.png
status: published
--- 


{:.text-center.panel.panel-default.padTB20}
[Check full code](#the-full-code){:.btn.btn-primary.btn-lg.padLR30}

## Introduction
 
Recently, I needed a way to read a big file line by line. Node ```fs``` provides api for reading files like ```fs.readFile```. But if you're reading big files with ```fs.readFile``` you'll probably hit some memory issues because it will buffer up the entire file into the memory. Another issue is your application needs to wait until the whole file was loaded in the memory before processing some output.


## Problem

I need to read the big file line by line and start processing the data as soon as I get it without hitting memory issues.

## Solution

**[Stream](https://nodejs.org/api/stream.html){:target="new"}** to the rescue. It reads the file in chunk and submit each chunk immediately for processing. This way your application doesn't wait and doesn't trigger memory overload.
But before we dive into the real solution, lets take a look at the basic of node file streaming

~~~javascript
var fs = require('fs');
 
var readStream = fs.createReadStream('bigfilelogs.txt'); 
var writeStream = fs.createWriteStream('bigfilelogs-copy.txt');

readStream.pipe(writeStream);
~~~

The above code is a basic demonstration of how to copy a file. ```.createReadStream()``` is the source of data and ```.createWriteStream()``` is the destination. ```.pipe()``` handles the ```data``` and ```end``` events emitted by ```.createReadStream```, it catches the chunks from the readable stream and writes in to the supplied writable stream.


But how do we process the data coming out of readable stream? Well whenever ```data``` is emitted, the readable stream fires an event called ```readable``` and then you use ```.read``` in the callback to fetch the data.

~~~javascript
var fs = require('fs'); 
var readStream = fs.createReadStream('bigfilelogs.txt');  

// listen to 'readable' event
readStream.on('readable', function(){  
	var chunk = readStream.read(); 

	console.log(chunk); // this will display bunch of strings like this - <Buffer 61 62 63 0a>
	console.log(chunk.toString()); // this will display the data in a readable format.
});
~~~ 


That's cool, or not, because the data in that chunk contains multiple lines and probably the last line was cut off in the middle of the line. Streams doesn't care where to stop when reading the source, it could be in any part of a line. Unless you specify the number of bytes it will read but it's not applicable to me because each line can be any number of bytes. In this case, [```transform```](https://nodejs.org/api/stream.html#stream_class_stream_transform){:target="new"} is what we need.

>[Transform](https://nodejs.org/api/stream.html#stream_class_stream_transform) streams are Duplex streams where the output is in some way computed from the input.

Now that we know there's a way to manipulate the data, let's solve the issue.

 
First is we require the ```fs``` module and create a readable stream by using the ```.createReadStream()``` method.

~~~javascript 
var fs = require('fs'); 
var readStream = fs.createReadStream('bigfilelogs.txt');  
~~~

 
In order to use transform, we need to include the ```require('stream')```. Create a new **stream** class and call the ```.Transform()``` constructor. We will set ```objectMode``` into true so it can emit values other than Buffers and Strings

~~~javascript  
var stream = require('stream'); 
var xtream = new stream.Transform( { objectMode: true } );
~~~

 
Use ```_transform``` method to accept the data, manipulate the data, then push the processed data, and call the **callback** to signal the readable that you're done transforming the data. 

~~~javascript  
xtream._transform = function(chunk, encoding, done) {
	var strData = chunk.toString();

	if (this._invalidLine) {
		strData = this._invalidLine + strData;
	};

	var objLines = strData.split("\n"); 
	this._invalidLine = objLines.splice(objLines.length-1, 1)[0];  
	this.push(objLines);

	done();
};
~~~

In the code above, we read the chunk line by line. First, we convert the buffer into string. Then we check if there's an invalid line available and we will prepend that invalid line into the string. Then we will convert each line of **string** data into **array** members by using ```.split("\n")```. And lastly, we will remove the last member of that array because that's probably a cut line, and that's where the **invalid** line came from.

After the transformation of the data, it's now ready to be push and file up in the readable queue. To do that we used the ```.push()``` method. The data emitted is in array format and that's possible because we set ```objectMode``` to **true**. Now that the data sa pushed, lets tell readable that we're finished by calling the callback function which we named ```done()```.
 
And now you might be worried about the last array member that was cut off when the stream was finished. Transform will fire ```finish``` event when done and then it will call ```_flush``` method. So **push** the last data on ```_flush```. 

~~~javascript  
xtream._flush = function(done) {
	if (this._invalidLine) {   
		this.push([this._invalidLine]); 
	};

	this._invalidLine = null;
	done();
};
~~~

And now we're ready to transform the data. Let's ```.pipe()``` the readable stream into the transform stream.

~~~javascript  
readStream.pipe(xtream);
~~~

After that you can now listen to the ```readable``` event and consume your transformed data.

~~~javascript  
xtream.on('readable', function(){ 
	while (lines = xtream.read()) { 
		lines.forEach(function(line, index){
			console.log(line + '\n');  
		});   
	}
});
~~~
 

## The Full code

~~~javascript
var fs = require('fs'); 
var readStream = fs.createReadStream('bigfilelogs.txt');  

var stream = require('stream'); 
var xtream = new stream.Transform( { objectMode: true } );

xtream._transform = function(chunk, encoding, done) {
	var strData = chunk.toString();

	if (this._invalidLine) {
		strData = this._invalidLine + strData;
	};

	var objLines = strData.split("\n"); 
	this._invalidLine = objLines.splice(objLines.length-1, 1)[0];  
	this.push(objLines);

	done();
};

xtream._flush = function(done) {
	if (this._invalidLine) {   
		this.push([this._invalidLine]); 
	};

	this._invalidLine = null;
	done();
};

readStream.pipe(xtream);

xtream.on('readable', function(){ 
	while (lines = xtream.read()) { 
		lines.forEach(function(line, index){
			console.log(line + '\n');  
		});   
	}
});
~~~