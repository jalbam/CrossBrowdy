<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>
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
	
	font-family:courier, monospace;
	color:#ffffff;
	text-align:center;
	font-size:16px;
	font-size:1em;
	font-size:100%;
	font-size:5vmin;
	
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
}


.menu_item
{
	white-space:nowrap;
	padding-top:20px;
	padding-bottom:15px;
}


.menu_item_link
{
	font-family:courier, monospace;
	color:#ffffff;
	text-align:center;
	font-size:16px;
	font-size:1em;
	font-size:100%;
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


#logo_image { width:160px; height:160px; }


.title
{
	font-family:courier, monospace;
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


.author
{
	text-align:right;

	font-family:arial;
	font-weight:normal;
	color:#bbbbbb;
	
	padding-right:20px;
	padding-top:20px;
	padding-bottom:50px;
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


.category_title
{
	font-family:courier, monospace;
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
	font-family:courier, monospace;
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
	font-family:courier, monospace;
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


#basic_tutorial_navbar
{
	position:fixed;
	bottom:0px;
	width:100%;
	background-color:#000000;
	color:#ffffff;
	
	min-height:40px;
	text-align:center;
	line-height:40px;
	
	font-family:courier, monospace;
	color:#ffffff;
	text-align:center;
	font-size:16px;
	font-size:1em;
	font-size:100%;
	font-size:5vmin;
	
	display:table;
}

#basic_tutorial_navbar .item
{
	display:table-cell;
	text-align:center;
	width:33%;
}

#basic_tutorial_navbar .item a
{
	color:#ffffff;
	text-decoration:none;
}

#basic_tutorial_navbar .item a:hover
{
	color:#2345fd;
}


.basic_tutorial_text
{
	font-family:courier, monospace;
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
	.basic_tutorial_text
	{
		font-size:18px;
		font-size:1.1em;
		font-size:111%;
		font-size:4.2vmin;
	}
}