---
layout: post
title: "Rapid Prototyping with Laravel 5.6"
date: 2018-08-03
tags: [angular]
image: /images/post/post-15.png
status: draft
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