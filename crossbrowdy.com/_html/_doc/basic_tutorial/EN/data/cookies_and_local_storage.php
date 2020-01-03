<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	CrossBrowdy can deal with local data, using internally the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API" target="_blank">Web Storage API</a> and falling back automatically to other methods (as <a href="https://github.com/mortzdk/localStorage" target="_blank">localStorage library</a> or cookies) when the first one is not available. Here is an example of cookies and local storage management:
</p>
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Sets data in local storage (uses Web Storage API or fallbacks automatically to localStorage or cookies otherwise):
	CB_setDatum("my_index", "my_value"); //Stores data using the best storage method automatically.
	CB_setDatum("my_index_2", "my_value_2", undefined, undefined, true); //Stores data forcing it to use cookies (without 'days' nor 'path set).
	CB_setDatum("my_index_3", "my_value_3", 20, "/subfolder"); //Stores data using the best storage method automatically. If it finally uses cookies, they will last 20 days and use "/subfolder" path (otherwise, these parameter will be ignored).
	CB_setDatum("my_index_4", "my_value_4", 30, undefined, true); //Stores data forcing it to use cookies. They will last 30 days.
	CB_setDatum("my_index_5", "my_value_5", 25, "/subfolder", true); //Stores data forcing it to use cookies. They will last 30 days and use the "/subfolder" path.
	
	//Recovers the data set previously. If not found through Web Storage API or localStorage, it will search in the cookies:
	var myDatum = CB_getDatum("my_index"); //Returns "my_value".
	var myDatum_2 = CB_getDatum("my_index_2"); //Returns "my_value_2".
	var myDatum_3 = CB_getDatum("my_index_3"); //Returns "my_value_3" (if cookies were finally used, only if we are in "/subfolder").
	var myDatum_4 = CB_getDatum("my_index_4"); //Returns "my_value_4".
	var myDatum_5 = CB_getDatum("my_index_5"); //Returns "my_value_5" (only if we are in "/subfolder").

	//Sets data in a cookie:
	CB_setCookie("my_index_6", "my_value_6"); //Stores the data in a cookie (without 'days' nor 'path' set).
	CB_setCookie("my_index_7", "my_value_7", 365); //Stores the data in a cookie (using 365 days storage).
	CB_setCookie("my_index_8", "my_value_8", 5, "/subfolder"); //Stores the data in a cookie (using 5 days storage and "/subfolder" path).
	
	//Recovers the data set previously, from the cookies:
	var myDatum_6 = CB_getCookie("my_index_6"); //Returns "my_value_6".
	var myDatum_7 = CB_getCookie("my_index_7"); //Returns "my_value_7".
	var myDatum_8 = CB_getCookie("my_index_8"); //Returns "my_value_8" (only if we are in "/subfolder").
</code></pre>

<p>
	Check the <a href="api/index.html" target="_blank">API documentation</a> to read more about some <a href="api/global.html" target="_blank">global functions and variables</a>.
</p>