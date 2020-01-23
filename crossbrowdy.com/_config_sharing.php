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
		"whatsapp" => Array("EN" => "WhatsApp"),

		"pinterest" => Array("EN" => "Pinterest"),
		"odnoklassniki" => Array("EN" => "Odnoklassniki")
		
		//"weibo" => Array("EN" => "Weibo"),
		//"wechat" => Array("EN" => "WeChat / Weixin (微信)"),
		
		//"line" => Array("EN" => "LINE"),
		//"skype" => Array("EN" => "Skype"),
		//"digg" => Array("EN" => "Digg"),
		//"meneame"  => Array("EN" => "Men&eacute;ame"),
		//"baidu" => Array("EN" => "Baidu (百度)"),
		//"renren" => Array("EN" => "Renren (人人)"),

		//"moimir" => Array("EN" => "Moi Mir"),
		//"livejournal" => Array("EN" => "LiveJournal"),
		//"blogger" => Array("EN" => "Blogger"),
		//"evernote" => Array("EN" => "Evernote"),
		//"flipboard" => Array("EN" => "Flipboard"),
		//"mix" => Array("EN" => "Mix"),
		//"pocket" => Array("EN" => "Pocket"),
		//"surfingbird" => Array("EN" => "Surfingbird"),
		//"liveinternet" => Array("EN" => "LiveInternet"),
		//"buffer" => Array("EN" => "Buffer"),
		//"instapaper" => Array("EN" => "Instapaper"),
		//"wordpress" => Array("EN" => "WordPress"),
		//"viber" => Array("EN" => "Viber"),

		//"email" => Array("EN" => "E-Mail"),
		//"sms" => Array("EN" => "SMS")
	);