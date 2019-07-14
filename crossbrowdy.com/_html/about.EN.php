<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<h1 class="category_title">About <?php echo $projectName; ?></h1>
<div class="category_text">
	<p>
		CrossBrowdy is an open-source JavaScript framework that allows to create multimedia apps, emulators, game engines and games that will be compatible with any device.
	</p>
	<p>
		Any software developed with CrossBrowdy should be able to be used in any JavaScript compatible web client (including browser plug-in, add-on, extension, app...) which supports &quot;<i>document.getElementById</i>&quot;.
	</p>
	<p>
		This framework allows any developer to manage easier many different things, such as audio (with Flash fallback, audio pool, etc.), canvas (with DHTML, VML, Flash or Silverlight fallbacks), screen, mouse, keyboard, gamepads, sockets (including PHP proxy fallback), XHR / AJAX (with PHP proxy for cross-domain requests) and many more.
	</p>
	<p>
		It also includes many basic DOM element manipulations, fallbacks and polyfills as well as integration with Apache Cordova (including PhoneGap, Ionic...), desktop apps (PWA, UWP, NW.js, Atom...), video game consoles, TV sets and so on.
	</p>
	<p>
		CrossBrowdy focuses on cross-browser (including legacy browsers) and cross-platform compatibility. The main target is to allow any app to run in any web client with or without HTML5 compatibility.
	</p>
</div>

<h1 class="category_title">Frequently Asked Questions</h1>
<div class="category_text">


	<h2 class="category_subtitle">What is the meaning of &quot;CrossBrowdy&quot;?</h2>
	<p>
		&quot;<i>Cross</i>&quot; comes from its capacity to be cross-platform / cross-browser / cross-device.
	</p>
	<p>
		&quot;<i>Browdy</i>&quot; was inspired by a mix between &quot;<i>browser</i>&quot; and &quot;<i>brodie</i>&quot; words.
	</p>
	

	<h2 class="category_subtitle">What makes CrossBrowdy different from other frameworks?</h2>
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

	
	<h2 class="category_subtitle">Is CrossBrowdy compatible with other frameworks, libraries, etc.?</h2>
	<p>
		CrossBrowdy should be able to run in combination with most of the JavaScript software available out there without doing anything special.
	</p>
	<p>
		Some JavaScript software may need the developers to follow some practices and even perform some code modifications. This could be improved in new CrossBrowdy versions.
	</p>
	
	
	<h2 class="category_subtitle">Where the software made with CrossBrowdy can run?</h2>
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
		Apart from that, CrossBrowdy software will also run on many video game consoles, TV sets and so on. This will also include other devices, platforms and technologies, some legacy ones, such as PWA (Progressive Web App), UWP (Universal Windows Platform), Apple TV (tvOS), Facebook app, BlackBerry 10, BlackBerry Tablet OS (BlackBerry PlayBook), Nokia Series 40 (Nokia S40) / WRT Widget, W3C Packaged Web App (W3C Widget) / Nokia Asha widget, WebOS, Windows Phone (from 7.1 to 8.1), Chrome OS / Chromium OS (Google Chrome App), Firefox OS (Mozilla Firefox App) / KaiOS, Sailfish OS...
	</p>
	<p>
		Finally, CrossBrowdy can also be used to develop web browser extensions although it is important to pay attention to possible safety restrictions that some web browsers may have. To comply with them, some code modifications may be needed.
	</p>
	
	
	<h2 class="category_subtitle">What is the CrossBrowdy license?</h2>
	<p>
		CrossBrowdy is a free and open-source project which can be used and modified by anyone for any legal purpose.
	</p>
	<p>
		The unique restriction is that any modified CrossBrowdy version or the software made with CrossBrowdy or with any version of it must always keep the name of its original authors (official credits) as well as the name of &quot;<i>CrossBrowdy</i>&quot;.
		These credits and the &quot;<i>CrossBrowdy</i>&quot; name must be easily accessible somewhere in the software by any kind of user, not only in the code but also through the user interface.
	</p>
	<p>
		In the case that the name of the authors are not shown through the user interface, they must remain in the source code and in the user interface the &quot;<i>CrossBrowdy</i>&quot; must still appear and always showing the address of the official web site (<i>http://CrossBrowdy.com/</i>).
	</p>
	<p>
		A good example could be a game made with CrossBrowdy where it shows &quot;<i>Created by CrossBrowdy (http://CrossBrowdy.com/)</i>&quot; somewhere in the screen after pressing on a &quot;<i>Credits</i>&quot; option.
	</p>
	<p>
		CrossBrowdy also provides a splash screen that can be disabled by the developers. When it is enabled, this splash screen is shown when CrossBrowdy is loading. Keeping it enable can be a good idea because it will be enough to show the credits and respect these rules.
	</p>
	<p>
		Apart from all of this, it is important to have into account that CrossBrowdy uses some external libraries and some code which may have their own license each. It is important to respect each license properly as the responsibility will always lie with you.
	</p>


	<h2 class="category_subtitle">Where can I find the credits and contact the authors?</h2>
	<p>
		CrossBrowdy project was created by <a href="http://joanalbamaldonado.com/" target="_blank">Joan Alba Maldonado</a>. It also uses some external libraries and &quot;third-party&quot; code. The name of these libraries and the name of the authors of these libraries and other code can be found in the source code as well as in the splash screen and in the <i>console</i> when CrossBrowdy is loading. As this information may vary with each version, it is not included here.
	</p>
	
	
	<h2 class="category_subtitle">Are there any restrictions running on some platforms?</h2>
	<p>
		To support legacy platforms without HTML5 compatibility or without some other features, CrossBrowdy uses some fallbacks, polyfills and workarounds.
	</p>
	<p>
		The main purpose of this is to emulate the native behaviour as exact as possible but, obviously, some restrictions can be present and should be taken into account.
	</p>
	<p>
		For present and future platforms, no restrictions should be present. If there were any, it should be fixed in future CrossBrowdy releases.
	</p>
	
	
	<h2 class="category_subtitle">Can the performance be improved?</h2>
	<p>
		One of the main objectives for next versions is to optimize CrossBrowdy, improving its performance and reducing the loading time (perhaps packing it in a single file).
	</p>
	
</div>