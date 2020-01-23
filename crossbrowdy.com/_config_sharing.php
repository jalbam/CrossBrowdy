<?php
	if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); }
	
	define("SHARING_ENABLED", true);

	$sharingMedias = Array
	(
		"twitter" => Array("EN" => "Twitter"),

		"facebook" => Array("EN" => "Facebook"),
		"vkontakte" => Array("EN" => "VK"),

		"linkedin" => Array("EN" => "LinkedIn"),
		"xing" => Array("EN" => "Xing"),

		"reddit" => Array("EN" => "Reddit"),
		
		"tumblr" => Array("EN" => "Tumblr"),
		"delicious" => Array("EN" => "Delicious"),
		
		"telegram" => Array("EN" => "Telegram"),
		"whatsapp" => Array("EN" => "WhatsApp")

		//"pinterest" => Array("EN" => "Pinterest"),
		//"odnoklassniki",
		//"moimir",
		//"livejournal",
		//"blogger",
		//"evernote",
		//"flipboard",
		//"mix",
		//"pocket",
		//"surfingbird",
		//"liveinternet",
		//"buffer",
		//"instapaper",
		//"wordpress",
		//"weibo",
		//"viber",
		//"wechat",
		//"line"
		//"skype",
		//"digg",
		//"meneame"
		//"baidu",
		//"renren",
		//"sms"
	);