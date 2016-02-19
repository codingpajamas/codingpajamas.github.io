---
layout: post
title: "My Top 10 Favorite Lodash Functions"
date: 2015-03-04
tags: [uncategorized]
image: /images/pimg/none.jpg
status: draft
--- 

## Grouping a data based on values

```_.groupBy()```

~~~javascript
_.groupBy(objOrders, function(order){return order.status.current})
~~~

## Iterate to modify values
```_.map()```
~~~javascript
_.map(json, function(d){
	d.lat = +d.lat;
	d.lon = +d.lon;
	return d;
});
~~~