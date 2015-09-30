---
layout: post
title: "Adding Bootstrap Modal To Angularjs Application"
date: 2015-09-26
tags: [angularjs]
image: /images/pimg/ng.png
status: draft
--- 

## Introduction
Without a doubt, Bootstrap is one of the most popular framework but you can't just use its javascript goodness in angularjs applications. Fortunately, Angular guys created directives for Bootstrap components. So taday let's create a basic application that uses "UI Bootstrap's modal"

We will create an application that displays a list of people. Each name on the list has a clickable button that when clicked will open a modal displaying the other informations of the person. 

## HTML Setup
It's basic html setup using bootstrap3 framework. We used the "list-group" component of bootstrap to display the people list. We also included the "angular.js" and "app.js" scripts. 

~~~html
<html>
<head>
  <meta charset="UTF-8">
  <title>NG-Modal</title>
  <link rel="stylesheet" href="css/bootstrap.min.css">
</head>
<body> 
  <div class="container" ng-controller="PageCtrl">
    <div class="row">
      <div class="col-xs-12 col-sm-6 col-sm-push-3">
        
        <ul class="list-group">
          <li class="list-group-item">
            FirstName LastName
            <a class="badge">view</a>
          </li>
        </ul>

      </div>
    </div>
  </div> 

  <script src="js/angular.min.js"></script> 
  <script src="js/app.js"></script>
</body>
</html>
~~~

## The Angular Application
In "app.js" let's instantiate our app. Then create a controller called 'PersonCtrl' and create an array of people.

~~~javascript
angular.module('ngmodal', [])
  .controller('PersonCtrl', function($scope){
    $scope.persons = [
      {id:1, "name":"Test1 Name1", "email":"test1@name.com"},
      {id:1, "name":"Test2 Name2", "email":"test2@name.com"},
      {id:1, "name":"Test3 Name3", "email":"test3@name.com"},
      {id:1, "name":"Test4 Name4", "email":"test4@name.com"},
      {id:1, "name":"Test5 Name5", "email":"test5@name.com"}
    ]; 
  })
~~~

Then we'll go back to our index.html and setup the angularjs directives - "ng-app" and "ng-controller"

~~~html
<html ng-app="ngmodal">
....
....
  <div class="container" ng-controller="PersonCtrl">
~~~

Then we will use "ng-repeat" to display our people array.

~~~html 
<li class="list-group-item" ng-repeat="person in persons"> 
  {% raw %}{{person.name}}{% endraw %}
  <a class="badge">view</a>
</li>
~~~

## The UI Bootstrap
The UI Bootstrap doesn't  have any javascript dependencies except angularjs. Got to "https://angular-ui.github.io/bootstrap/", download and include the script in your html.
[code html]

Add 'ng-click' directive on the button and pass 'openModal(user)' function, we're passing the 'user' as parameter to the function. We will create that 'openModal()' function inside our 'PeopleCtrl'. 
[code html]

create the function 'openModal' in our 'PeopleCtrl'.
[code js]

In the code above, we 