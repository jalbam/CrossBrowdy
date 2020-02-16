<?php
	if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); }
	
	//Questions and answers for the FAQ section:
	$FAQ = Array
	(
		"EN" => Array
		(
			"what_is_the_meaning_of_crossbrowdy" =>
				Array
				(
					"question" => "What is the meaning of &quot;CrossBrowdy&quot;?",
					"answer" =>
					'
						<p>
							&quot;<i>Cross</i>&quot; comes from its capacity to be cross-platform / cross-browser / cross-device.
						</p>
						<p>
							&quot;<i>Browdy</i>&quot; was inspired by a mix between &quot;<i>browser</i>&quot; and &quot;<i>brodie</i>&quot; words.
						</p>
					'
				),
				
			"what_is_the_history_of_crossbrowdy" =>
				Array
				(
					"question" => "What is the history of CrossBrowdy?",
					"answer" =>
					'
						<p>
							The CrossBrowdy project was started being developed around March 2013 with the &quot;<i>CrossBase</i>&quot; name. Now, this is the name used by its main module.
						</p>
						<p>
							The original idea was to create a library to make cross-platform games easier, but it later became a much more powerful multipurpose multimedia framework. Of course, you can still make games and game engines as well as many other things with CrossBrowdy.
						</p>
					'
				),

			"what_makes_crossbrowdy_different_from_other_frameworks" =>
				Array
				(
					"question" => "What makes CrossBrowdy different from other frameworks?",
					"answer" =>
					'
						<p>
							CrossBrowdy is an open-source JavaScript framework which provides multimedia features. As it deals internally with the differences between platforms (via fallabacks, polyfills and workarounds), the developers will find their life much easier (&quot;<i>Code once, deploy everywhere</i>&quot;).
						</p>
						<p>
							A big part of its API is separated in different objects which represent real hardware or abstract devices (such as Screen, Speaker, Keyboard, Mouse, Pointer, Gamepad...), providing a device-oriented and object-oriented point of view.
						</p>
						<p>
							The main point of CrossBrowdy is the fact that it is a low-level framework which will allow to create and run software virtually everywhere, not only on new and future platforms but also on legacy ones (yes, even Internet Explorer 6).
						</p>
						<p>
							Developers can also enhance CrossBrowdy features easily by creating modules for it.
						</p>
					'
				),

			"is_crossbrowdy_compatible_with_other_frameworks_libraries_etc" =>
				Array
				(
					"question" => "Is CrossBrowdy compatible with other frameworks, libraries, etc.?",
					"answer" =>
					'
						<p>
							CrossBrowdy should be able to run in combination with most of the JavaScript software available out there without doing anything special.
						</p>
						<p>
							Some JavaScript software may need the developers to follow some practices and even perform some code modifications. This could be improved in new CrossBrowdy versions.
						</p>
					'
				),
			
			"where_can_the_software_made_with_crossbrowdy_run" =>
				Array
				(
					"question" => "Where can the software made with CrossBrowdy run?",
					"answer" =>
					'
						<p>
							Virtually everywhere, as long as it runs on a web client with a JavaScript engine compatible with &quot;<i>document.getElementById</i>&quot;. This includes any present and future web browser as well as old ones (including Internet Explorer 6).
						</p>
						<p>
							The software developed with CrossBrowdy can be ported to Microsoft Windows (from Windows XP to Windows 10 or even newer), Linux (including x86 and also Raspberry Pi or compatible), Apple macOS (formerly Mac OS X), etc. and run as a desktop app (using NW.js, Atom, etc.).
						</p>
						<p>
							This software can also be ported to iOS / iPadOS (iPhone, iPad), Android (including phones, tablets, Android TV, Nokia X, Amazon Fire OS...) or others and run as a mobile app (using Apache Cordova, PhoneGap, Ionic, etc.).
						</p>
						<p>
							Apart from that, CrossBrowdy software will also run on many video game consoles, TV sets, smart watches, embedded devices and so on. This will also include other devices, platforms and technologies, some legacy ones, such as PWA (Progressive Web App), UWP (Universal Windows Platform) / WinJS, Apple TV (tvOS), Facebook app, BlackBerry 10, BlackBerry Tablet OS (BlackBerry PlayBook), Nokia Series 40 (Nokia S40) / WRT Widget, W3C Packaged Web App (W3C Widget) / Nokia Asha widget, WebOS, Windows Phone (from 7.1 to 8.1), Chrome OS / Chromium OS (Google Chrome App), Firefox OS (Mozilla Firefox App) / KaiOS, Sailfish OS...
						</p>
						<p>
							Finally, CrossBrowdy can also be used to develop web browser extensions although it is important to pay attention to possible safety restrictions that some web browsers may have. To comply with them, some code modifications may be needed.
						</p>
						<p>
							Nevertheless, it is important to point that not all CrossBrowdy features will always be compatible with all clients. Some may have restrictions. It is up to the developer to provide support for clients which do not support those features.
						</p>
					'
				),
			
			"what_is_the_crossbrowdy_copyright_and_license" =>
				Array
				(
					"question" => "What is the CrossBrowdy's copyright and license?",
					"answer" =>
					'
						<p>
							CrossBrowdy is a free and open-source project which can be used and modified by anyone for any legal purpose.
						</p>
						<p>
							The unique restriction is that any modified CrossBrowdy version or the software made with CrossBrowdy or with any version of it must always keep the name of its original authors (official credits) as well as the name of &quot;<i>CrossBrowdy</i>&quot;.
							These credits and the &quot;<i>CrossBrowdy</i>&quot; name must be easily accessible somewhere in the software by any kind of user, not only in the code but also through the user interface.
						</p>
						<p>
							In the case that the name of the authors are not shown through the user interface, they must remain in the source code and in the user interface the &quot;<i>CrossBrowdy</i>&quot; must still appear and always showing the address of the official web site (<i>https://CrossBrowdy.com/</i>).
						</p>
						<p>
							A good example could be a game made with CrossBrowdy where it shows &quot;<i>Created with CrossBrowdy (https://CrossBrowdy.com/)</i>&quot; somewhere in the screen after pressing on a &quot;<i>Credits</i>&quot; option.
						</p>
						<p>
							CrossBrowdy also provides a splash screen that can be disabled by the developers. When it is enabled, this splash screen is shown when CrossBrowdy is loading. Keeping it enable can be a good idea because it will be enough to show the credits and respect these rules.
						</p>
						<p>
							<span xmlns:dct="http://purl.org/dc/terms/" property="dct:title">CrossBrowdy web site content (<a href="https://crossbrowdy.com/" target="_blank">crossbrowdy.com</a>, including tutorials and examples)</span> by
							<a xmlns:cc="http://creativecommons.org/ns#" href="https://joanalbamaldonado.com/" property="cc:attributionName" rel="cc:attributionURL" target="_blank">Joan Alba Maldonado (aka Juan Alba Maldonado)</a> is licensed under a
							<a rel="license" href="http://creativecommons.org/licenses/by/4.0/" target="_blank">Creative Commons Attribution 4.0 International License</a> (SPDX short identifier: &quot;<i>CC BY 4.0</i>&quot;).<br />
						</p>
						<p>
							<span xmlns:dct="http://purl.org/dc/terms/" property="dct:title"><a href="https://crossbrowdy.com/api" target="_blank">CrossBrowdy API documentation</a></span> by
							<a xmlns:cc="http://creativecommons.org/ns#" href="https://joanalbamaldonado.com/" property="cc:attributionName" rel="cc:attributionURL" target="_blank">Joan Alba Maldonado (aka Juan Alba Maldonado)</a> is licensed under a
							<a rel="license" href="http://creativecommons.org/licenses/by/4.0/" target="_blank">Creative Commons Attribution 4.0 International License</a> (SPDX short identifier: &quot;<i>CC BY 4.0</i>&quot;).<br />
						</p>
						<p>
							The code written by <a href="https://joanalbamaldonado.com/" target="_blank">Joan Alba Maldonado (aka Juan Alba Maldonado)</a>, which genuinely belongs to the CrossBrowdy project, is licensed under the <a href="https://choosealicense.com/licenses/bsd-2-clause/" target="_blank">2-Clause BSD License license</a> (aka &quot;<i>Simplified BSD License</i>&quot; or &quot;<i>FreeBSD License</i>&quot;, SPDX short identifier: &quot;<i>BSD-2-Clause</i>&quot;).
						</p>
						<p>
							Apart from all of this, it is important to have into account that CrossBrowdy uses some external libraries and some code which may have their own license each. It is important to respect each license properly as the responsibility will always lie with you.
						</p>
					'
				),

			"why_is_crossbrowdy_free_and_what_do_you_get_from_us" =>
				Array
				(
					"question" => "Why is CrossBrowdy free and what do you get from us?",
					"answer" =>
					'
						<p>
							Personally, although it has cost me a lot of money and time myself, I have enjoyed and still enjoy creating and struggling to keep this project alive. I have also learnt and still learn a lot through this process.
						</p>
						<p>
							My unique purpose doing this is the satisfaction to create and keep such a project as well as the pleasure to see that this effort could help others which might find CrossBrowdy useful for their own projects.
						</p>
					'
				),

			"How to use it?" =>
				Array
				(
					"question" => "How to use CrossBrowdy?",
					"answer" =>
					'
						<p>
							Using CrossBrowdy should not difficult. To start learning how to use it, you can visit the <a href="guides' . $PHPExtension . '" target="_blank">' . $menuOptions[$language]["guides"] . '</a> section where you can find
							a <a href="guides' . $PHPExtension . '#basic_tutorial" target="_blank">a complete tutorial with many topics</a>, as well as <a href="guides' . $PHPExtension . '#examples" target="_blank">many live examples with their source code</a>
							and <a href="guides' . $PHPExtension . '#more" target="_blank">more things</a>.
						</p>
						<p>
							For a more technical approach or as a consultation guide, you may want to take a look at the <a href="api/index.html" target="_blank">API documentation</a> (<a href="api/printable/index.html" target="_blank">more printer-friendly version here</a>).
						</p>
					'
				),

			"how_to_contribute_to_crossbrowdy_or_help_the_project" =>
				Array
				(
					"question" => "How to contribute to CrossBrowdy or help the project?",
					"answer" =>
					'
						<p>
							CrossBrowdy is using <a href="https://github.com/jalbam/CrossBrowdy" target="_blank">GitHub</a> and there you can not only find the source code of the whole project but also help informing about any bugs you might find, suggest code modifications, etc.
						</p>
						<p>
							For more information, you can take a look at the <a href="community' . $PHPExtension . '" target="_blank">' . $menuOptions[$language]["community"] . '</a> section.
						</p>
					'
				),

			"where_can_i_find_the_credits_and_contact_the_authors" =>
				Array
				(
					"question" => "Where can I find the credits and contact the authors?",
					"answer" =>
					'
						<p>
							CrossBrowdy project was created by <a href="https://joanalbamaldonado.com/" target="_blank">Joan Alba Maldonado (aka Juan Alba Maldonado)</a>. It also uses some external libraries and &quot;third-party&quot; code. The name of these libraries and the name of the authors of these libraries and that other code can be found in the source code as well as in the splash screen (if it was no disabled) and in the <i>console</i> when CrossBrowdy is loading. As this information may vary with each version, it is not included here.
						</p>
					'
				),
			
			"are_there_any_restrictions_running_on_some_platforms" =>
				Array
				(
					"question" => "Are there any restrictions running on some platforms?",
					"answer" =>
					'
						<p>
							To support legacy platforms without HTML5 compatibility or without some other features, CrossBrowdy uses some fallbacks, polyfills and workarounds.
						</p>
						<p>
							The main purpose of this is to emulate the native behaviour as exact as possible but, obviously, some restrictions can be present and should be taken into account.
						</p>
						<p>
							For present and future platforms, no restrictions should be present. If there were any, it should be fixed in future CrossBrowdy releases.
						</p>
					'
				),
			
			"why_do_certain_features_do_not_work_on_certain_clients" =>
				Array
				(
					"question" => "Why do certain features do not work on certain clients?",
					"answer" =>
					'
						<p>
							Please, refer to <a href="about' . $PHPExtension . '#are_there_any_restrictions_running_on_some_platforms" class="faq_link">Are there any restrictions running on some platforms?</a>.
						</p>
					'
				),
			
			"can_the_performance_be_improved" =>
				Array
				(
					"question" => "Can the performance be improved?",
					"answer" =>
					'
						<p>
							One of the main objectives for next versions is to optimize CrossBrowdy, improving its performance and reducing the loading time (perhaps packing it in a single file).
						</p>
					'
				),

			"can_i_load_just_the_features_i_need" =>
				Array
				(
					"question" => "Can I load just the features I need?",
					"answer" =>
					'
						<p>
							CrossBrowdy can use different modules to satisfy different needs each. You can even create your own modules if you desire it.
						</p>
						<p>
							The main CrossBrowdy module is called &quot;CrossBase&quot; and, at least for the time being, you should not disable any of the files that it uses as that could lead to some unexpected problems (since some files need each other).
							But if you feel brave enough, you can try to do it at your own risk and test it carefully to check whether it still keeps your desired behaviour.
						</p>
						<p>
							Finally, you can also just copy the code you need for your project and adapt it. If you do this, remember to keep the credits and refer to <a href="about' . $PHPExtension . '#what_is_the_crossbrowdy_copyright_and_license" class="faq_link">What is the CrossBrowdy\'s copyright and license?</a> prior to anything.
						</p>
					'
				),
			
			"i_have_a_problem_doubt_or_suggestion_what_can_i_do" =>
				Array
				(
					"question" => "I still have a problem, doubt or suggestion. What can I do?",
					"answer" =>
					'
						<p>
							If you have any suggestion to make to improve this project (including the <a href="https://crossbrowdy.com/" target="_blank">web site</a>), you can contact the author. Take a look at <a href="about' . $PHPExtension . '#where_can_i_find_the_credits_and_contact_the_authors" class="faq_link">Where can I find the credits and contact the authors?</a>.
						</p>
						<p>
							If you have any doubt or problem which could not be solved so far, visit the <a href="community' . $PHPExtension . '" target="_blank">' . $menuOptions[$language]["community"] . '</a> section and try to ask your question publicly in some of the available channels.
						</p>
						<p>
							The two main reasons to expose publicly your doubts are because you will have more chances to get an answer (even probably different ones, as there are often more than one solution for a same problem) and, mainly,
							because that answer could be useful for others with the same or a similar doubt.
						</p>
						<p>
							Do not forget the fact that CrossBrowdy is part of the open source community: let\'s take advantage of this!
						</p>
					'
				)
		)

	);