var xray = require('x-ray')();


/*
// Using a Selector
xray('https://www.reddit.com/r/Steam/', 'title')(function(err, title) {
	console.log(title) // Steam on Reddit
})

xray('https://www.reddit.com/r/Steam/', '.bottommenu')(function(err, text){
	console.log(text) // the footer text
})

*/

/* Get collection - the menu text
xray('https://www.reddit.com/r/Steam/', ['.tabmenu li'])(function(err, menu){
	console.log(menu) // ['hot', 'new', 'rising', 'controversial', 'top', 'gilded', 'wiki', 'promoted']
})
*/ 

/*
// data composition on a collection
xray(
	'https://www.reddit.com/r/Steam/', 
	'.thing.link', 
	[{item:'.title'}]
)(function(err, items){
	console.log(items);
})
*/

/*
//crawling
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
*/

var xtream = xray(
	'https://www.reddit.com/r/Steam/', 
	'.tabmenu li', 
	[{
		item:'a',
		title: xray('a@href', 'title')
	}]
)
.limit(2)
.write();

var responseString = '';

xtream.on('data', function(chunk){ 
	responseString += chunk;
})

xtream.on('end', function(){
	console.log(responseString.toString('utf8'));
})

//.paginate('#paging li.current + li a[href]')