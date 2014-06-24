Skroller
========

Skroller.js is a jQuery plugin that transforms elements such as div's into scrollable areas with customizable scrollbars that are consistent across different browsers

How it works
------------

Simple, just call `skroller()` method on the jQuery selector and you are pretty much done... Relatively straightforward right?

A little visual example...

```
<div id="myDiv">
  Div content in here...
</div>

<script>
  $('#myDiv').skroller();
</script>
```
And this is the result

![alt text](http://www.morellowebdesign.com/public/skroller/Skroller_1.jpg)

Easy enough, right?


Now some eye candy!
-------------------

Skroller has a few options that can be passed when the method is called here is a list with their defaults

Option | Default | Description
--- | --- | --- | ---
height | 200 | _Defines the fixed height of the rendered scrollable element in pixels_
maxHeight | false | _If set to a number will wrap the scrollable element around the target and expand untill the height in pixel is reached then start scrolling_
barWidth | 10 | _The scrollbar width in pixel_
barColor | #2C96DE | _The color of the scrollbar_
barOpacity | 1 | _The bar opacity from 0 to 1_
barMinHeight | 20 | _The minimum height of the scrollbar_
barHide | false | _Setting this to `true` will hide the bar and show it when the mouse is over the scrollable element_
barHideDelay | 0.5 | _Value in seconds before the scrollbar fades away when the mouse leaves the scrollable element_
railOff | false | _Setting this to `true` will NOT render the rail, just the scrollbar_
railHide | `=barHide` | _Inherit the value of barHide but can be changed to customize the rail behavior separately_
railColor | `=barColor` | _Set custom color for the rail_
railOpacity | `=barOpacity/5` | _Customize the rail opacity from 0 to 1_
railPadding | `=barWidth+5` | _The distance between the content and the scrollbar_
style | 'smooth' | _Can be 'round', 'smooth', 'square' or a numeric value that defines the roundness of the scrollbar corners_
frameClass | 'skroller' | _Defines a custom class for the scrollable element to offer more customization options_

Here is the hands-on...

![](http://www.morellowebdesign.com/public/skroller/Skroller_2.jpg)

And the code...

```
$('#myDiv').skroller({
	height : 230,
	barWidth : 10,
	barColor : '#db0456',
	barOpacity : 0.8,
	barMinHeight : 15,
	barHide : true,
	barHideDelay : 1,
	railOff : true,
	style : 'round'
});
```

That's it, very simple.

A note...
---------

Skroller is still a work-in-progress so there might be bugs, compatibility issues and it might pose a treath to your pets... I mainly developed it for personal use on my projects but I like sharing (because it's caring) and I will try and keep it updated... feel free to fork it of course and report any issues you may find.

Also forgive me if my code is not clean / canonical / rational / standardized etc... (you get the point) I am a web designer, self-taught web developer who likes to hack code, so you've been warned! :)




