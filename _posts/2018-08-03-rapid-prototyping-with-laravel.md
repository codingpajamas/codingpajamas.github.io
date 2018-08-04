---
layout: post
title: "Rapid Prototyping with Laravel 5.6"
date: 2018-08-03
tags: [angular]
image: /images/post/post-15.png
status: published
--- 

A very basic Layout

{:.mb0}
Update `welcome.blade.php`

~~~html
@extends('layouts.app')

@section('content')
<div class="container jobsearch-box">
    <form class="row justify-content-center" method="get" action="{{url('/jobs')}}">
        <div class="col-md-4">
            <input type="text" class="form-control" placeholder="Type keywords">
        </div>
        <div class="col-md-3">
            <select name="skill" id="" class="form-control">
                <option value="">All Skills</option>
            </select>
        </div>
        <div class="col-md-3">
            <select name="city" id="" class="form-control">
                <option value="">All Cities</option>
            </select>
        </div>
        <div class="col-md-2">
            <input type="submit" value="Search" class="btn btn-primary btn-block">
        </div>
    </form>
</div>

<div class="container joblist-box">
    <div class="row">
        <div class="col-md-12">
            <div class="list-group">
                <a href="#" class="list-group-item">
                    <h4 class="list-group-item-heading">
                        Android Nodejs Developer
                        <span class="pull-right">Php 30,000</span>
                    </h4>
                    <p class="list-group-item-text detail-box">
                        <span>Company One</span>
                        <span> &bull; </span>
                        <span>Javascript, PHP, MySQL</span>
                    </p>
                </a>  
            </div>
        </div>
    </div>
</div>
@endsection
~~~

{:.mb0}
Create `/public/css/styles.css` and include it in `resources/views/layouts/app.blade.php`

~~~css
/* /public/css/styles.css */
.jobsearch-box { padding-top: 50px; padding-bottom: 50px; }
.joblist-box a { color: #333; }
.detail-box { margin: 0px; }
.detail-box span { display: inline-block; margin-right: 20px; }
.pull-right { float: right !important; }
~~~


Update the layout.app and add a link to profile page
~~~html
<div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
    <a class="dropdown-item" href="{{ url('/profile/'.Auth::user()->hash) }}">
        Profile
    </a>
    <a class="dropdown-item" href="{{ route('logout') }}"
       onclick="event.preventDefault();
                     document.getElementById('logout-form').submit();">
        {{ __('Logout') }}
    </a>

    <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">
        @csrf
    </form>
</div>
~~~

update web.php to add the profile routes

~~~php
Route::prefix('/profile')->middleware(['auth'])->group(function () {
    Route::get('/', 'UserController@edit');
    Route::get('edit', 'UserController@edit');
    Route::get('delete', 'UserController@delete'); 
    Route::put('{hash}', 'UserController@update'); 
    Route::delete('delete', 'UserController@destroy');
});

Route::get('/profile/{hash}', 'UserController@show');
~~~

update the UserController@show

~~~php
public function show(User $user)
{
    $user->load('skills');
    return view('profile.view', compact('user'));
}
~~~

whoah https://laravel.com/docs/5.6/routing#route-model-binding

Profile view template

~~~html
@extends('layouts.app')

@section('content')
<div class="container hero-box">
    <div class="row">
        <div class="col-md-12 text-center">
            <img src="http://lorempixel.com/200/200/people/1" alt="">
            <h3>{{$user->name}}</h3>
            <p class="detail-box">
                <span><i class="fa fa-map-marker"></i> {{$user->city->name}}</span>
                @if(Auth::check() && Auth::user()->id == $user->id)
                    <span>
                        <a href="{{url('profile/edit')}}" class="btn btn-primary btn-sm">
                            Edit Profile
                        </a>
                    </span>
                @endif
            </p> 
        </div>
    </div>
</div>

<div class="container joblist-box">
    <div class="row justify-content-center">
        <div class="col-md-6">
            <div class="list-group">
                @foreach($user->skills as $skill)
                    <div class="list-group-item">
                        <h4 class="list-group-item-heading m0">
                            {{$skill->name}}
                            <small class="pull-right text-primary"> 
                                @for ($i = 0; $i < (int)$skill->pivot->rating; $i++)
                                    <i class="fa fa-star"></i>
                                @endfor

                                @for ($i = 0; $i < 5-(int)$skill->pivot->rating; $i++)
                                    <i class="fa fa-star-o"></i>
                                @endfor 
                            </small>
                        </h4>
                    </div> 
                @endforeach
            </div>
        </div> 
    </div>
</div>
@endsection
~~~

The first container contains the profile info, a static avatar, user name and address, and a edit link if the profile belongs to the authenticated user
The second container displays the list of user skills.
The "for loop" displays the star representation of the user's rating on the specific skill


Next create the edit profile page, edit controller
~~~php
public function edit()
{
    $user = Auth::user();
    $user->load(['skills', 'city']);

    // get all the skills and cities for dropdown search
    $skills = Skill::select('name', 'id')->orderBy('name', 'asc')->get();
    $cities = City::select('name', 'id')->orderBy('name', 'asc')->get(); 

    return view('profile.edit', compact(['user', 'skills', 'cities']));
}
~~~


create profile/edit.blade.php
~~~html
@extends('layouts.app')

@section('content')  
<div class="container joblist-box">
    <div class="row justify-content-center">
        <div class="col-md-6">
            <h4 class="text-center">Personal Information</h4>
            
            @if (session('status'))
                <div class="alert alert-{{session('status') == 'success' ? 'success' : 'danger'}}">
                    {{ session('msg') }}
                </div>
            @endif 

            <form class="list-group" method="POST" action="{{url('/profile')}}" enctype="multipart/form-data"> 
                
                @method('PUT')
                @csrf
                
                <div class="list-group-item"> 
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text px-1"> 
                                <!-- <img src="http://lorempixel.com/30/30/people/1" alt=""> -->
                            </span>
                        </div>
                        <!-- accept="image/*" -->
                        <input type="file" class="form-control" name="avatar" >
                    </div>
                </div> 
                <div class="list-group-item">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="basic-addon1">
                                <i class="fa fa-user"></i>
                            </span>
                        </div>
                        <input name="name" type="text" placeholder="Name" 
                            value="{{old('name') ? old('name') : $user->name}}" 
                            class="form-control {{ $errors->has('name') ? ' is-invalid' : '' }}"
                        >
                    </div> 

                    @if ($errors->has('name'))
                        <div class="text-center text-danger">
                            <small>{{ $errors->first('name') }}</small>
                        </div>
                    @endif
                </div> 
                <div class="list-group-item">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="basic-addon1">
                                <i class="fa fa-map-marker"></i>
                            </span>
                        </div>
                        <input name="address" type="text" placeholder="Address" 
                            value="{{old('address') ? old('address') : $user->address}}" 
                            class="form-control {{ $errors->has('address') ? ' is-invalid' : '' }}"
                        >
                    </div>  
                    @if ($errors->has('address'))
                        <div class="text-center text-danger">
                            <small>{{ $errors->first('address') }}</small>
                        </div>
                    @endif
                </div>  
                <div class="list-group-item">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="basic-addon1">
                                <i class="fa fa-globe"></i>
                            </span>
                        </div>
                        <select name="city" id="" class="form-control {{ $errors->has('city') ? ' is-invalid' : '' }}">
                            <option value="">Select a City</option>
                            @foreach($cities as $city)
                                <option value="{{$city->id}}" @if($city->id == $user->city_id) selected @endif>{{$city->name}}</option>
                            @endforeach
                        </select>
                    </div> 
                    @if ($errors->has('city'))
                        <div class="text-center text-danger">
                            <small>{{ $errors->first('city') }}</small>
                        </div>
                    @endif 
                </div> 
                <div class="list-group-item text-center">
                    <input type="submit" value="Save Changes" class="btn btn-block btn-primary">
                </div>  
            </form>
        </div> 
    </div>
</div>
@endsection
~~~

The container above contains a profile form

Next let's add a functionality for a user to add/edit/remove his skills

create new routes inside the profile group

~~~php
Route::post('/skill', 'UserController@skill_store'); 
Route::put('/skill/{id}', 'UserController@skill_update'); 
Route::delete('/skill/{id}', 'UserController@skill_destroy'); 
~~~




create a local scope on JobPost model for the search functionality

~~~php
// JobPost.php
public function scopeOfKeywords($query, $strKeywords)
{
    if($strKeywords)
    {
        return $query->where('title', 'like', '%'.$strKeywords.'%')
                ->orWhere('description', 'like', '%'.$strKeywords.'%');
    }
    else
    {
        return $query;
    }
} 

public function scopeOfCity($query, $intCityId)
{
    if($intCityId != 0)
    {
        return $query->where('city_id', $intCityId);
    }
    else
    {
        return $query;
    }
}

public function scopeOfSkill($query, $intSkillId)
{
    if($intSkillId != 0)
    {
        return $query->whereHas('skills', function($query) use($intSkillId){
            $query->where('skills.id', $intSkillId);
        });
    }
    else
    {
        return $query;
    }
}

public function scopeOfStatus($query, $strStatus)
{
    if($strStatus == 'active')
    {
        return $query->where('expired_at', '>', Carbon::now());
    }
    elseif($strStatus == 'expired')
    {
        return $query->where('expired_at', '<', Carbon::now());
    }
    else
    {
        return $query;
    }
}
~~~

construct the controller
~~~php
public function index(Request $request)
{
    // get the parameters
    $intCityId = $request->input('city', null);
    $intSkillId = $request->input('skill', null);
    $strKeywords = $request->input('q', null);

    // get the jobposts
    $jobposts = JobPost::ofKeywords($strKeywords)
                ->ofCity($intCityId)
                ->ofSkill($intSkillId)
                ->ofStatus('active')
                ->with(['company', 'skills'])
                ->paginate(20); 

    // construct the pagination
    $jobposts->appends([ 'skill' => $intSkillId, 'city'=>$intCityId, 'q'=>$strKeywords ]);

    // get all the skills and cities for dropdown search
    $skills = Skill::select('name', 'id')->orderBy('name', 'asc')->get();
    $cities = City::select('name', 'id')->orderBy('name', 'asc')->get(); 

    // serve the view
    return view('welcome', compact('jobposts', 'intCityId', 'intSkillId', 'strKeywords', 'skills', 'cities'));
}
~~~


Loop the jobs in homepage and add the pagination

~~~html
<div class="col-md-12">
    <div class="list-group">
        @foreach($jobposts as $job)
            <a href="{{url('/job/'.$job->hash)}}" class="list-group-item">
                <h4 class="list-group-item-heading">
                    {{$job->title}}
                    <small class="pull-right">
                        Php {{number_format($job->salary_min)}}
                        - {{number_format($job->salary_max)}}
                    </small>
                </h4>
                <p class="list-group-item-text detail-box">
                    <span>{{$job->company->name}}</span>
                    <span> &bull; </span>
                    <span>{{implode(", ", $job->skills->pluck('name')->toArray())}}</span>
                </p>
            </a>  
        @endforeach
    </div>
</div>

<div class="col-md-12 text-center">
    <div class="pagination-box">
        {{ $jobposts->links() }}
    </div>
</div>
~~~