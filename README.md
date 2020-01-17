CrossBrowdy 
============ 
by Joan Alba Maldonado (joanalbamaldonadoNO_SPAM_PLEASE AT gmail DOT com, without NO_SPAM_PLEASE)

Your cross-browser brodie!

[CrossBrowdy](https://crossbrowdy.com/ "CrossBrowdy web site") is a Multimedia JavaScript framework that can be used to create real cross-platform and hybrid game engines, games, emulators, multimedia libraries and apps.

It is compatible with web browsers, desktop and laptop computers, mobile devices (phones, tablets), desktop and handheld video game consoles, TV sets, smart watches, embedded devices and many others.

Main web site: https://crossbrowdy.com/


# About &amp; FAQ
Visit the [About &amp; FAQ section](https://crossbrowdy.com/about "About &amp; FAQ") to read more about [CrossBrowdy](https://crossbrowdy.com/ "CrossBrowdy web site").


# Download
To include it in your project and start using it, the most common way to download [CrossBrowdy](https://crossbrowdy.com/ "CrossBrowdy web site") for production is through the [Download section](https://crossbrowdy.com/download "Download CrossBrowdy") from the official web site.

You can also download [CrossBrowdy](https://crossbrowdy.com/ "CrossBrowdy web site") from GitHub directly. Just download the whole content of the **[dist/](https://github.com/jalbam/CrossBrowdy/blob/master/dist/)** folder.

Alternatively, from the command line (shell), you can also use one of the following commands to download [CrossBrowdy](https://crossbrowdy.com/ "CrossBrowdy web site") while you are in your project folder:


**npm**:
```
npm i crossbrowdy 
```


**Yarn**:
```
yarn add crossbrowdy 
```


**Bower** (whole repo):
```
bower install jalbam/crossbrowdy --save 
```

**Note**: Bower will downlaod whole GitHub repository. 


# Getting started
Visit the [Getting started topic](https://crossbrowdy.com/basic_tutorial/general/getting_started/ "Getting started with CrossBrowdy") from the [Basic tutorial](https://crossbrowdy.com/guides#basic_tutorial "CrossBrowdy's Basic tutorial") to learn more.

## Here you have a simple example:
```html
<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="content-type" content="text/html; charset=utf-8" />
		<title>My first CrossBrowdy project!</title>
		<script src="CrossBrowdy/CrossBrowdy.js" type="text/javascript" language="javascript"></script><!-- "type" and "language" parameters for legacy clients. -->
		<script type="text/javascript" language="javascript">
			CB_init(main); //It will call the "main" function when ready.

			//This function will be called when CrossBrowdy is ready:
			function main()
			{
				//Now, you can start using CrossBrowdy here...
				CB_console("CrossBrowdy started!");
			}
		</script>
	</head>
	<body>
		<!-- The "CB_console" element will be used automatically in the case that the client does not support console: -->
		<div id="CB_console" style="display:none; visibility:hidden; overflow:scroll;">
			<span style="font-weight:bold;">Console:</span><br />
		</div>
	</body>
</html>
```


# Usage
Visit the [Guides &amp; Tutorials section](https://crossbrowdy.com/guides "Guides &amp; Tutorials for CrossBrowdy") to get all the information you may need.


# Basic tutorial
Check the [Basic tutorial](https://crossbrowdy.com/guides#basic_tutorial "CrossBrowdy's Basic tutorial") to learn how to use it.


# Examples
Check the [Examples section](https://crossbrowdy.com/guides#examples "CrossBrowdy examples") to see some live examples and learn through their code.


# API documentation
For more technical documentation, visit the [API documentation section](https://crossbrowdy.com/api/ "CrossBrowdy API documentation").


# News
Visit the [News section](https://crossbrowdy.com/news "CrossBrowdy News") to keep up to date.


# Community & Get Involved
Visit the [Community & Get Involved section](https://crossbrowdy.com/community "Community & Get Involved") to access the [CrossBrowdy](https://crossbrowdy.com/ "CrossBrowdy web site") community through different ways and to get involved with its development.


## License
The code written by Joan Alba Maldonado (joanalbamaldonadoNO_SPAM_PLEASE AT gmail DOT com, without NO_SPAM_PLEASE) which genuinely belongs to the [CrossBrowdy](https://crossbrowdy.com/ "CrossBrowdy web site") project is
licensed under the ["Creative Commons Attribution 4.0 International"](https://creativecommons.org/licenses/by/4.0/) license.

Apart from that, it is important to have into account that [CrossBrowdy](https://crossbrowdy.com/ "CrossBrowdy web site") uses some external libraries and some code which may have their own license each. It is important to respect each license properly as the responsibility will always lie with you.

See more at ["What is the CrossBrowdy's copyright and license?"](https://crossbrowdy.com/about#what_is_the_crossbrowdy_copyright_and_license).