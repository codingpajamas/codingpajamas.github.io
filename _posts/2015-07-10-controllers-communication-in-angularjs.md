---
layout: post
title: "Controllers Communication in Angularjs"
date: 2015-07-10
tags: [angularjs]
image: /images/post/post-7.png
status: published
--- 


{:.text-center.panel.panel-default.padTB20}
[Check Demo](/demos/angularjs-controller-communication/){:.btn.btn-primary.btn-lg.padLR30.mr20}{:target="_new"}
[Check the Code on Github](https://github.com/codingpajamas/ngcontrollercommunication){:.btn.btn-primary.btn-lg.padLR30.mr20}{:target="_new"}

## Introduction

One way for controllers to communicate with each other is by using angularjs event system. Create an event and fire it up, then create a listener to this event somewhere in other controllers. It's sort of pub/sub system, publish an event and some controllers were subscribed to that event.

## Passing Data from Parent Controller to Child Controller

You use ``` $scope.$broadcast``` to pass a data from Parent controller to child controllers. ```$broadcast``` will fire an event down the ```$scope```. Then use ```$scope.$on``` on the child controller to listen for this event.

~~~javascript 
app.controller('ParentCtrl', function($scope) {
   // send a message to child
   $scope.$broadcast('ParentMessage', 'Child, I am your father.');
});

 
app.controller('ChildFirstCtrl', function($scope, $rootScope) {     
   // listen to papa
   $scope.$on('ParentMessage', function(event, data){
      console.log(data); 
   }) 
}); 
~~~        

## Passing Data From Child Controller to Parent Controller

When passing a data from child controller to parent controller, you need to use ```$scope.$emit``` because this will fire an event **up**.

~~~javascript 
app.controller('ParentCtrl', function($scope) {
   // listen to child
   $scope.$on('childToParentMessage', function(event, data){
     console.log(data);
   })
});

 
app.controller('ChildFirstCtrl', function($scope, $rootScope) {     
   // send message to papa
   $scope.$emit('childToParentMessage', 'Nooooooo!!!!');
}); 
~~~  

## Passing Data From Controller to Sibling Controller

If you've noticed, our examples above deals with parent-child scopes. The events you fires goes **up** or **down** but what if you want to target a sibling controller which is on the same level. You will be using ```$rootScope```, this is the descendant of all **scopes**. It sits at the top of scope hierarchy.

~~~javascript
app.controller('FirstChildCtrl', function($scope, $rootScope) { 
   $rootScope.$emit('firstToSecondMessage', 'Hello there, brother controller'); 
}); 

app.controller('SecondChildCtrl', function($scope, $rootScope) {   
   // listen to first controller
   $rootScope.$on('firstToSecondMessage', function(event, data){
      console.log(data); 
   })
}); 
~~~ 

So if ```$emit``` fires event up, why did we use it in ```$rootScope``` which is the highest of all scopes. Well, if we use ```broadcast``` in **rootScope**, it will fire the event down to **all scopes** whether these scopes are listening or not. But is we use ```$emit```, **rootScope** will only fire the event to those **scopes listening** to that event. 


{:.text-center.panel.panel-default.padTB20}
[Check Demo](/demos/angularjs-controller-communication/){:.btn.btn-primary.btn-lg.padLR30.mr20}{:target="_new"}
[Check the Code on Github](https://github.com/codingpajamas/ngcontrollercommunication){:.btn.btn-primary.btn-lg.padLR30.mr20}{:target="_new"}