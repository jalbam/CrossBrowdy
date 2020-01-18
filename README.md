CrossBrowdy 
============ 
by [Joan Alba Maldonado](https://joanalbamaldonado.com/ "Joan Alba Maldonado's home page") (joanalbamaldonadoNO_SPAM_PLEASE AT gmail DOT com, without NO_SPAM_PLEASE)

Your cross-browser brodie!

[CrossBrowdy](https://crossbrowdy.com/ "CrossBrowdy web site") is a Multimedia JavaScript framework that can be used to create real cross-platform and hybrid game engines, games, emulators, multimedia libraries and apps.

It is compatible with web browsers, desktop and laptop computers, mobile devices (phones, tablets), desktop and handheld video game consoles, TV sets, smart watches, embedded devices and many others.

It is open source and free.

Main web site: [https://crossbrowdy.com/](https://crossbrowdy.com/ "CrossBrowdy web site")


# About &amp; FAQ
Visit the [About &amp; FAQ section](https://crossbrowdy.com/about "About &amp; FAQ") to know more about [CrossBrowdy](https://crossbrowdy.com/ "CrossBrowdy web site").


# Download
To include it in your project and start using it, the most common way to download [CrossBrowdy](https://crossbrowdy.com/ "CrossBrowdy web site") for production is through the [Download section](https://crossbrowdy.com/download "Download CrossBrowdy") from the official web site.

You can also download [CrossBrowdy](https://crossbrowdy.com/ "CrossBrowdy web site") from [the GitHub repository](https://github.com/jalbam/CrossBrowdy/ "CrossBrowdy's GitHub repository") directly. Just download the whole content of the **[dist/](https://github.com/jalbam/CrossBrowdy/blob/master/dist/)** folder.

Alternatively, from the command line (shell), you can also use one of the following commands to download [CrossBrowdy](https://crossbrowdy.com/ "CrossBrowdy web site") while you are in your project folder:


## Using **[Yarn](https://yarnpkg.com/en/package/crossbrowdy "CrossBrowdy's Yarn package")**:
```
yarn add crossbrowdy 
```


## Using **[npm](https://www.npmjs.com/package/crossbrowdy "CrossBrowdy's npm package")**:
```
npm i crossbrowdy 
```


## Using **Bower**:
```
bower install jalbam/crossbrowdy --save 
```

**Note**: [Yarn](https://yarnpkg.com/en/package/crossbrowdy "CrossBrowdy's Yarn package"), [npm](https://www.npmjs.com/package/crossbrowdy "CrossBrowdy's npm package") and Bower will also download the [API documentation](https://crossbrowdy.com/api/ "CrossBrowdy API documentation").


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
		<!--
			CB_init(main); //It will call the "main" function when ready.

			//This function will be called when CrossBrowdy is ready:
			function main()
			{
				//Now, you can start using CrossBrowdy here...
				CB_console("CrossBrowdy started!");
			}
		// -->
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


# Help
Check ["_I still have a problem, doubt or suggestion. What can I do?_"](https://crossbrowdy.com/about#i_have_a_problem_doubt_or_suggestion_what_can_i_do).


# Community & Get Involved
Visit the [Community & Get Involved section](https://crossbrowdy.com/community "Community & Get Involved") to access the [CrossBrowdy](https://crossbrowdy.com/ "CrossBrowdy web site") community through different ways and also to get involved and contribute with its development.


# Credits
CrossBrowdy project was created by [Joan Alba Maldonado (aka Juan Alba Maldonado)](https://joanalbamaldonado.com/ "Joan Alba Maldonado's home page").
It also uses some external libraries and "third-party" code. The name of these libraries and the name of the authors of these libraries and that other code can be found in the source code as well as in the splash screen (if it was no disabled) and in the console when CrossBrowdy is loading. As this information may vary with each version, it is not included here. 


# License
The code written by [Joan Alba Maldonado](https://joanalbamaldonado.com/ "Joan Alba Maldonado's home page") (joanalbamaldonadoNO_SPAM_PLEASE AT gmail DOT com, without NO_SPAM_PLEASE) which genuinely belongs to the [CrossBrowdy](https://crossbrowdy.com/ "CrossBrowdy web site") project is
licensed under the ["Creative Commons Attribution 4.0 International"](https://creativecommons.org/licenses/by/4.0/) license.

Apart from that, it is important to have into account that [CrossBrowdy](https://crossbrowdy.com/ "CrossBrowdy web site") uses some external libraries and some code which may have their own license each. It is important to respect each license properly as the responsibility will always lie with you.

See more at ["_What is the CrossBrowdy's copyright and license?_"](https://crossbrowdy.com/about#what_is_the_crossbrowdy_copyright_and_license).