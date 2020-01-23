<?php
	if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); }

	if ($category === "api")
	{
		echo 'body, html { height:94%; }';
	}
?>

body
{
	background-color:#dddddd;
	font-family:times, serif;
	
	margin-top:50px;
	margin-bottom:0px;
	margin-left:0px;
	margin-right:0px;

	background-image:-webkit-gradient(
		linear,
		left bottom,
		left bottom,
		color-stop(0.6, rgb(255,255,255)),
		color-stop(0.9, rgb(230,230,230))
	);
	background-image:linear-gradient(bottom, rgb(230,230,230) 1%, rgb(255,255,255) 60%);
	background-image:-moz-linear-gradient(bottom, rgb(230,230,230) 1%, rgb(255,255,255) 60%);
	background-image:-o-linear-gradient(bottom, rgb(230,230,230) 1%, rgb(255,255,255) 60%);
	background-image:-khtml-linear-gradient(bottom, rgb(230,230,230) 1%, rgb(255,255,255) 60%);
	background-image:-webkit-linear-gradient(bottom, rgb(230,230,230) 1%, rgb(255,255,255) 60%);
	background-image:-ms-linear-gradient(bottom, rgb(230,230,230) 1%, rgb(255,255,255) 60%);
	
	background-repeat:no-repeat;
}


a
{
	color:#2345fd;
	text-decoration:none;
}
a:hover
{
	color:#000000;
	text-decoration:underline;
}


address { font-style:normal; }


#menu_button
{
	display:block;
	visibility:visible;
	background-color:#000000;
	color:#ffffff;
	width:100%;
	min-height:40px;
	text-align:center;
	line-height:40px;
	
	font-family:courier, monospace, arial;
	color:#ffffff;
	text-align:center;
	font-size:48px;
	font-size:3em;
	font-size:300%;
	font-size:5vmin;
	
	cursor:hand;
	cursor:pointer;
}
#menu_button:hover
{
	color:#2345fd;
}

#menu_background
{
	display:none;
	visibility:hidden;
	
	position:fixed;
	top:0px;
	width:100%;
	height:100%;
	
	background-color:#000000;

	filter:alpha(opacity=75);
	opacity:0.75;
	-moz-opacity:0.75;
	-khtml-opacity:0.75;
	-ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=75)";
	
	z-index:8;
}

#menu
{
	position:fixed;
	top:0px;
	width:100%;
	
	z-index:9;
}

#menu_options
{
	display:none;
	visibility:hidden;
	text-align:center;
	width:100%;
	background-color:#000000;
	-moz-box-shadow:0px 30px 100px -20px #000000;
	-webkit-box-shadow:0px 30px 100px -20px #000000;
	-o-box-shadow:0px 30px 100px -20px #000000;
	-khtml-box-shadow:0px 30px 100px -20px #000000;
	box-shadow:0px 30px 100px -20px #000000;
}

.menu_item
{
	white-space:nowrap;
	padding-top:20px;
	padding-bottom:15px;
}
@media (orientation: landscape)
{
	.menu_item
	{
		padding-top:5px;
		padding-bottom:2px;
	}
}

.menu_item_link
{
	font-family:courier, monospace, arial;
	color:#ffffff;
	text-align:center;
	font-size:48px;
	font-size:3em;
	font-size:300%;
	font-size:5vmin;
	text-decoration:none;
	padding:0px;
	margin:0px;
}
.menu_item_link:hover
{
	color:#2345fd;
}

.menu_item_link.disabled
{
	color:#555555;
}


#logo_container { text-align:center; padding-top:20px; padding-bottom:0px; }
@media (orientation: portrait) { #logo_container { padding-top:2px; } }

#logo_image
{
	width:160px; height:160px;
	
	transform:scale(0.8);
	-o-transform:scale(0.8);
	-ms-transform:scale(0.8);
	-khtml-transform:scale(0.8);
	-webkit-transform:scale(0.8);
}
#logo_image.final
{
	width:160px; height:160px;
	
	transform:scale(1) rotate(720deg);
	-o-transform:scale(1) rotate(720deg);
	-ms-transform:scale(1) rotate(720deg);
	-khtml-transform:scale(1) rotate(720deg);
	-webkit-transform:scale(1) rotate(720deg);
	
	transition:all 1000ms;
	-moz-transition:all 1000ms;
	-webkit-transition:all 1000ms;
	-o-transition:all 1000ms;
	-khtml-transition:all 1000ms;
	-ms-transition:all 1000ms;
}


.title
{
	font-family:courier, monospace, arial;
	color:#2345fd;
	text-align:center;
	font-size:200px;
	font-size:10em;
	font-size:1000%;
	font-size:14vmin;

	padding-top:0px;
	margin-top:0px;

	padding-bottom:0px;
	margin-bottom:0px;
	
	text-shadow:2px 2px 2px #666666;
}


.description_short
{
	font-family:arial;
	font-weight:bold;
	color:#ffffff;
	text-align:center;
	
	padding-top:0px;
	margin-top:0px;
	
	background-color:#000000;
	padding:10px;
	
	text-shadow:2px 2px 2px #332222;
}


.keypoints { text-align:center; font-weight:bold; }

.keypoint
{
	color:#000000;

	background-color:#ffffff;
	
	padding:6px;
	margin:2px;
	line-height:40px;
	
	white-space:nowrap;
	
	border:1px solid #000000;
	
	border-radius:18px;
	-moz-border-radius:18px;
	-webkit-border-radius:18px;
	-khtml-border-radius:18px;
	
	-moz-box-shadow:1px 2px 6px 1px #bbbbbb;
	-webkit-box-shadow:1px 2px 6px 1px #bbbbbb;
	-o-box-shadow:1px 2px 6px 1px #bbbbbb;
	-khtml-box-shadow:1px 2px 6px 1px #bbbbbb;
	box-shadow:1px 2px 6px 1px #bbbbbb;
}
@media (orientation: portrait)
{
	.keypoint
	{
		display:inline-block;
		width:41%;
		line-height:20px;
		min-height:60px;
	}
	
	.keypoint_content
	{
		display:table;
		
		text-align:center;
		width:100%;

		word-wrap:break-word;
		white-space:pre-line;
		height:60px;
	}
	
	.keypoint_content_2
	{
		display:table-cell;
		vertical-align:middle;
		height:60px;
	}
}


.description_long
{
	font-family:arial;
	font-weight:bold;
	color:#2345fd;
	text-align:center;
	
	padding-top:10px;
	margin-top:6px;

	padding-bottom:2px;
	margin-bottom:2px;
	
	text-shadow:2px 2px 2px #cccccc;
}


.features
{
	text-align:center;
}

.features_box
{
	text-align:center;

	font-family:arial;
	font-weight:bold;
	color:#ffffff;
	
	background-color:#ffffff;
	
	padding:12px;
	margin:20px;
	
	border:1px solid #2345fd;
	
	border-radius:18px;
	-moz-border-radius:18px;
	-webkit-border-radius:18px;
	-khtml-border-radius:18px;
	
	-moz-box-shadow:1px 2px 6px 1px #bbbbbb;
	-webkit-box-shadow:1px 2px 6px 1px #bbbbbb;
	-o-box-shadow:1px 2px 6px 1px #bbbbbb;
	-khtml-box-shadow:1px 2px 6px 1px #bbbbbb;
	box-shadow:1px 2px 6px 1px #bbbbbb;
}
@media (orientation: landscape) { .features_box { vertical-align:top; display:inline-block; } }

.features_box_title
{
	font-size:48px;
	font-size:3em;
	font-size:300%;
	font-size:5vmin;

	font-family:arial;
	font-weight:bold;
	color:#2345fd;

	text-shadow:2px 2px 2px #bbbbbb;
	
	padding:10px;
	margin:2px;
}

.features_box_item
{
	font-family:arial;
	font-weight:bold;
	color:#000000;

	background-color:#ffffff;
	
	padding:6px;
	margin:2px;
	line-height:40px;
	white-space:nowrap;
	
	border-radius:18px;
	-moz-border-radius:18px;
	-webkit-border-radius:18px;
	-khtml-border-radius:18px;
	
	
	-moz-box-shadow:1px 2px 6px 1px #bbbbbb;
	-webkit-box-shadow:1px 2px 6px 1px #bbbbbb;
	-o-box-shadow:1px 2px 6px 1px #bbbbbb;
	-khtml-box-shadow:1px 2px 6px 1px #bbbbbb;
	box-shadow:1px 2px 6px 1px #bbbbbb;
}


.features_box_link
{
	font-family:arial;
	font-weight:bold;
	color:#0000cc;

	text-decoration:none;

	padding:6px;
	margin:2px;
	line-height:40px;
	white-space:nowrap;
	
	border-radius:18px;
	-moz-border-radius:18px;
	-webkit-border-radius:18px;
	-khtml-border-radius:18px;
	
	
	-moz-box-shadow:1px 2px 6px 1px #bbbbbb;
	-webkit-box-shadow:1px 2px 6px 1px #bbbbbb;
	-o-box-shadow:1px 2px 6px 1px #bbbbbb;
	-khtml-box-shadow:1px 2px 6px 1px #bbbbbb;
	box-shadow:1px 2px 6px 1px #bbbbbb;
}


.features_box_link:hover
{
	color:#aa0000;
	text-decoration:none;
}


#features_unavailable
{
	font-family:arial;
	font-style:italic;
	color:#888888;
	text-align:center;
	font-size:24px;
	font-size:1.5em;
	font-size:150%;
	font-size:2.5vmin;
}


.author
{
	text-align:right;

	font-family:arial;
	font-weight:normal;
	color:#bbbbbb;
	
	padding-right:20px;
	padding-top:20px;
	padding-bottom:50px;
	
	font-size:20px !important;
	font-size:0.7em !important;
	font-size:70% !important;
	font-size:2.1vmin !important;
}
@media (orientation: portrait)
{
	.author
	{
		font-size:12px !important;
		font-size:0.6em !important;
		font-size:60% !important;
		font-size:3vmin !important;
	}
}

.author_link
{
	font-weight:bold;
	color:#bbbbbb;
}
.author_link:hover
{
	color:#cccccc;
}


hr
{
	margin-top:20px;
	margin-bottom:10px;
}

.license
{
	text-align:center;

	font-family:arial;
	font-weight:normal;
	color:#888888;
	
	padding-top:0px;
	padding-bottom:0px;
	
	font-size:20px !important;
	font-size:0.7em !important;
	font-size:70% !important;
	font-size:2.1vmin !important;
}
@media (orientation: portrait)
{
	.license
	{
		font-size:12px !important;
		font-size:0.6em !important;
		font-size:60% !important;
		font-size:3vmin !important;
	}
}


.category_title
{
	font-family:courier, monospace, arial;
	color:#000000;
	text-align:center;
}


h1.category_title
{
	font-size:48px;
	font-size:3em;
	font-size:300%;
	font-size:5vmin;
}
@media (orientation: portrait)
{
	h1.category_title
	{
		font-size:76px;
		font-size:4.8em;
		font-size:480%;
		font-size:8vmin;
	}
}

h2.category_title
{

	font-size:38px;
	font-size:2.4em;
	font-size:240%;
	font-size:4vmin;
}
@media (orientation: portrait)
{
	h2.category_title
	{
		font-size:48px;
		font-size:3em;
		font-size:300%;
		font-size:5vmin;
	}
}

.category_text
{
	font-family:courier, monospace, arial;
	color:#000000;
	text-align:left;
	font-size:29px;
	font-size:1.8em;
	font-size:180%;
	font-size:3vmin;
	margin:35px;

	word-wrap:break-word;
}
@media (orientation: portrait)
{
	.category_text
	{
		font-size:48px;
		font-size:1.2em;
		font-size:121%;
		font-size:5vmin;
	}
}

.category_subtitle
{
	font-family:courier, monospace, arial;
	color:#000000;
	text-align:left;
	font-size:29px;
	font-size:1.8em;
	font-size:180%;
	font-size:3vmin;
	margin-top:60px;
	margin-bottom:0px;
}
@media (orientation: portrait)
{
	.category_subtitle
	{
		font-size:48px;
		font-size:1.2em;
		font-size:121%;
		font-size:5vmin;
		margin-top:40px;
	}
}

li
{
	padding-top:20px;
}

ol li
{
	padding-top:4px;
}

ol
{
	counter-reset:item;
	padding-left:12px;
}

ol li
{
	display:table;
}

ol li:before
{
	content:counters(item, ".") ". ";
	counter-increment:item;
	display:table-cell;
}

.li_link
{
	color:#2345fd;
	text-decoration:none;
}
.li_link:hover
{
	color:#000000;
	text-decoration:underline;
}


a.faq_link
{
	font-style:italic;
	color:#2345fd;
	text-decoration:none;
}
a.faq_link:hover
{
	color:#000000;
	text-decoration:underline;
}


code
{
	font-size:20px !important;
	font-size:0.7em !important;
	font-size:70% !important;
	font-size:2.1vmin !important;
}
@media (orientation: portrait)
{
	code
	{
		font-size:12px !important;
		font-size:0.6em !important;
		font-size:60% !important;
		font-size:3vmin !important;
	}
}


#basic_tutorial_navbar, #examples_navbar
{
	position:fixed;
	bottom:0px;
	width:100%;
	background-color:#000000;
	color:#ffffff;
	
	min-height:40px;
	text-align:center;
	line-height:40px;
	
	font-family:courier, monospace, arial;
	color:#ffffff;
	text-align:center;
	font-size:48px;
	font-size:3em;
	font-size:300%;
	font-size:5vmin;
	
	display:table;
}

#basic_tutorial_navbar .item, #examples_navbar .item
{
	display:table-cell;
	text-align:center;
	width:33%;
}

#basic_tutorial_navbar .item a, #examples_navbar .item a
{
	color:#ffffff;
	text-decoration:none;
}
#basic_tutorial_navbar .item a:hover, #examples_navbar .item a:hover
{
	color:#2345fd;
}

.general_text, .basic_tutorial_text, .examples_text
{
	font-family:courier, monospace, arial;
	color:#000000;
	text-align:left;
	font-size:29px;
	font-size:1.8em;
	font-size:180%;
	font-size:3vmin;
	margin:35px;

	word-wrap:break-word;
}
@media (orientation: portrait)
{
	.basic_tutorial_text, .examples_text
	{
		font-size:18px;
		font-size:1.1em;
		font-size:111%;
		font-size:4.2vmin;
	}
}


.try_example
{
	text-align:center;
	font-size:48px;
	font-size:3em;
	font-size:300%;
	font-size:5vmin;
}
@media (orientation: portrait)
{
	.try_example
	{
		font-size:76px;
		font-size:4.8em;
		font-size:480%;
		font-size:8vmin;
	}
}

.try_example_floating
{
	position:fixed;
	top:20px;
	right:0px;
	color:#ffffff;
	padding:6px;
	margin:0px;
	text-decoration:none;
	background-color:#aa1100;
	text-align:center;
	font-size:29px;
	font-size:1.8em;
	font-size:180%;
	font-size:3vmin;

	z-index:10;

	border-bottom-left-radius:12px;
	-moz-border-radius-bottomleft:12px;
	-moz-border-bottom-left-radius:12px;
	-webkit-border-bottom-left-radius:12px;
	-khtml-border-bottom-left-radius:12px;

	border-top-left-radius:12px;
	-moz-border-radius-topleft:12px;
	-moz-border-top-left-radius:12px;
	-webkit-border-top-left-radius:12px;
	-khtml-border-top-left-radius:12px;

	filter:alpha(opacity=85);
	opacity:0.85;
	-moz-opacity:0.85;
	-khtml-opacity:0.85;
	-ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=85)";
}
.try_example_floating:hover
{
	color:#cccc00;
	background-color:#aa0000;
	text-decoration:none;
}
@media (orientation: portrait)
{
	.try_example_floating
	{
		font-size:18px;
		font-size:1.1em;
		font-size:111%;
		font-size:4.2vmin;
	}
}


.shell_command_line
{
	font-style:italic;
	color:#aa0000;
	background-color:#dddddd;
	padding:10px;
}


a.download_button
{
	color:#ffffff;
	background-color:#0000dd;
	
	padding:10px;

	font-size:24px;
	font-size:1.5em;
	font-size:150%;
	font-size:2.5vmin;
	
	border-radius:18px;
	-moz-border-radius:18px;
	-webkit-border-radius:18px;
	-khtml-border-radius:18px;
	
	-moz-box-shadow:1px 2px 6px 1px #bbbbbb;
	-webkit-box-shadow:1px 2px 6px 1px #bbbbbb;
	-o-box-shadow:1px 2px 6px 1px #bbbbbb;
	-khtml-box-shadow:1px 2px 6px 1px #bbbbbb;
	box-shadow:1px 2px 6px 1px #bbbbbb;
}
@media (orientation: portrait)
{
	a.download_button
	{
		font-size:12px;
		font-size:0.6em;
		font-size:60%;
		font-size:3vmin;
	}
}
a.download_button:hover
{
	color:#00ffff;
	text-decoration:none;
	background-color:#0000ff;
}

.download_size
{
	font-style:italic;
	line-height:0px;
	font-size:6px;
	font-size:0.3em;
	font-size:30%;
	font-size:1.5vmin;
}

a.download_old
{
	font-size:20px;
	font-size:0.7em;
	font-size:70%;
	font-size:2.1vmin;
}
@media (orientation: portrait)
{
	a.download_old
	{
		font-size:12px;
		font-size:0.6em;
		font-size:60%;
		font-size:3vmin;
	}
}
a.download_old:hover
{
	color:#000000;
	text-decoration:underline;
}


#api_iframe_container
{
	display:block;
	width:98%;
	height:92%;
	margin:10px;
	padding:10px;
	text-align:center;
}

#api_iframe
{
	display:block;
	width:100%;
	height:100%;
	border:0px;
	margin:0px;
	padding:0px;
}


.cdn_item
{
	display:list-item;
	list-style-type:none;
	list-style-position:inside;
	margin-left:30px;
	font-size:20px;
	font-size:0.7em;
	font-size:70%;
	font-size:2.1vmin;
}
@media (orientation: portrait)
{
	.cdn_item
	{
		font-size:12px;
		font-size:0.6em;
		font-size:60%;
		font-size:3vmin;
	}
}


#sharing_bar
{
	position:fixed;
	bottom:50px;
	left:0px;
	
	color:#aa0000;
	z-index:10;
}
#sharing_bar_button
{
	background-color:#aaaaaa;
	display:table-cell;
	vertical-align:middle;
	
	font-size:3vmin;
	line-height:2vmin;
	
	width:3.6em;
	width:22%;
	width:6vmin;

	height:3.6em;
	height:22%;
	height:6vmin;
	
	border-radius:2px;
	-moz-border-radius:2px;
	-webkit-border-radius:2x;
	-khtml-border-radius:2px;
	
	filter: alpha(opacity=70);
	opacity:0.7;
	-moz-opacity:0.7;
	-khtml-opacity:0.7;
	-ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=70)";
}
@media (orientation: portrait)
{
	#sharing_bar_button
	{
		width:4.4em;
		width:26%;
		width:11vmin;
		
		height:4.4em;
		height:26%;
		height:11vmin;
	}
}
#sharing_bar_button:hover
{
	cursor:hand;
	cursor:pointer;
}
.sharing_icon
{
	visibility:hidden;

	width:3.6em;
	width:22%;
	width:6vmin;

	height:3.6em;
	height:22%;
	height:6vmin;
	
	filter: alpha(opacity=90);
	filter:grayscale(50%);
	opacity:0.9;
	-moz-opacity:0.9;
	-khtml-opacity:0.9;
	-ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=90)";
}
@media (orientation: portrait)
{
	.sharing_icon
	{
		width:4.4em;
		width:26%;
		width:11vmin;
		
		height:4.4em;
		height:26%;
		height:11vmin;
	}
}
.sharing_icon:hover
{
	filter: alpha(opacity=100);
	filter:grayscale(0%);
	opacity:1;
	-moz-opacity:1;
	-khtml-opacity:1;
	-ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=100)";

	cursor:hand;
	cursor:pointer;
}