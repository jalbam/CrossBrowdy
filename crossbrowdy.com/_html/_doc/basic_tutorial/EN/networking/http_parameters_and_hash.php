<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	You can manage HTTP parameters (URI parameters, also known as GET parameters or query parameters) easily with CrossBrowdy. Here is an example:
</p>
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Gets the current URL without any hash parameters:
	var parameters = CB_Net.getURIParameters();
	
	//Gets the current URL without any hash parameters, excluding the "parameter1" and the "parameter2" parameters:
	var parameters_2 = CB_Net.getURIParameters(null, ["parameter1", "parameter2"]);
	
	//Gets the current URL without any hash parameters, including only the "parameter2" and the "parameter3" parameters (excluding all the other ones):
	var parameters_3 = CB_Net.getURIParameters(null, null, ["parameter2", "parameter3"]);
	
	//Gets the current URL without any hash parameters, including the "parameter5" even if not did not exist before (with an empty value):
	var parameters_4 = CB_Net.getURIParameters(null, null, ["parameter5"], true); //If "parameter5" existed, it will keep its value. The value will be empty otherwise.
	
	//Examples giving a URL:
	var URL = "https://www.crossbrowdy.com/guides.php?parameter1=value1&amp;parameter2=value2&amp;parameter3=value3&amp;parameter4=value4&amp;parameter5=value5#parameter1=value1_hash&amp;parameter2=value2_hash&amp;parameter3=value3_hash&amp;parameter4=value4_hash&amp;parameter5=value5_hash";
	var parameters_5 = CB_Net.getURIParameters(URL); //Returns 'parameter1=value1&amp;parameter2=value2&amp;parameter3=value3&amp;parameter4=value4&amp;parameter5=value5'.
	var parameters_6 = CB_Net.getURIParameters(URL, ["parameter1", "parameter2"]); //Returns 'parameter3=value3&amp;parameter4=value4&amp;parameter5=value5'.
	var parameters_7 = CB_Net.getURIParameters(URL, null, ["parameter2", "parameter3"]); //Returns 'parameter2=value2&amp;parameter3=value3'.
	var parameters_8 = CB_Net.getURIParameters(URL, null, ["parameter5"], true); //Returns 'parameter5=value5'.
	var parameters_9 = CB_Net.getURIParameters(URL, null, ["parameter5", "parameter6", "parameter7"], true); //Returns 'parameter5=value5&amp;parameter6=&amp;parameter7='.
	
	//Gets the value of the "parameter1" from the current URL:
	var value = CB_Net.getURIValue("parameter1"); //It will be an empty string if the parameter did not exist.
	
	//Gets the value of the "parameter2" from the current URL, without trimming spaces around:
	var value_2 = CB_Net.getURIValue("parameter2", false); //It will be an empty string if the parameter did not exist.
	
	//Gets the value of the "parameter3" from the given URI string (the 'URL' variable), without trimming spaces around:
	var value_3 = CB_Net.getURIValue("parameter3", false, URL); //It should return "value3".
	
	//Combine two sets of URI parameters (the same can be done with 'CB_combineURIParameters'):
	var parametersCombined = CB_Net.combineURIParameters("parameter1=value1&amp;parameter2=value2", "parameter3=value3&amp;parameter4=value4"); //Returns 'parameter1=value1&amp;parameter2=value2&amp;parameter3=value3&amp;parameter4=value4'.
	var parametersCombined_2 = CB_Net.combineURIParameters("?parameter1=value1&amp;parameter2=value2", "?parameter3=value3&amp;parameter4=value4"); //Returns 'parameter1=value1&amp;parameter2=value2&amp;parameter3=value3&amp;parameter4=value4'.
	var parametersCombined_3 = CB_Net.combineURIParameters("??parameter1=value1&amp;parameter2=value2&amp;&amp;", "???&amp;parameter3=value3&amp;parameter4=value4&amp;"); //Returns 'parameter1=value1&amp;parameter2=value2&amp;parameter3=value3&amp;parameter4=value4'.
</code></pre>

<p>
	Likewise, you can also manage hash parameters easily:
</p>
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Gets all the hash parameters from the current URL:
	var hashParameters = CB_Net.getHashParameters();
	
	//Gets the hash parameters from the current URL, excluding the "parameter1" and the "parameter2" parameters:
	var hashParameters_2 = CB_Net.getHashParameters(null, ["parameter1", "parameter2"]);
	
	//Gets the hash parameters from the current URL, including only the "parameter2" and the "parameter3" parameters (excluding all the other ones):
	var hashParameters_3 = CB_Net.getHashParameters(null, null, ["parameter2", "parameter3"]);
	
	//Gets the hash parameters from the current URL, including the "parameter5" even if not did not exist before (with an empty value):
	var hashParameters_4 = CB_Net.getHashParameters(null, null, ["parameter5"], true); //If "parameter5" existed, it will keep its value. The value will be empty otherwise.
	
	//Examples giving a URL:
	var URL = "https://www.crossbrowdy.com/guides.php?parameter1=value1&amp;parameter2=value2&amp;parameter3=value3&amp;parameter4=value4&amp;parameter5=value5#parameter1=value1_hash&amp;parameter2=value2_hash&amp;parameter3=value3_hash&amp;parameter4=value4_hash&amp;parameter5=value5_hash";
	var parameters_5 = CB_Net.getHashParameters(URL); //Returns 'parameter1=value1_hash&amp;parameter2=value2_hash&amp;parameter3=value3_hash&amp;parameter4=value4_hash&amp;parameter5=value5_hash'.
	var parameters_6 = CB_Net.getHashParameters(URL, ["parameter1", "parameter2"]); //Returns 'parameter3=value3_hash&amp;parameter4=value4_hash&amp;parameter5=value5_hash'.
	var parameters_7 = CB_Net.getHashParameters(URL, null, ["parameter2", "parameter3"]); //Returns 'parameter2=value2_hash&amp;parameter3=value3_hash'.
	var parameters_8 = CB_Net.getHashParameters(URL, null, ["parameter5"], true); //Returns 'parameter5=value5_hash'.
	var parameters_9 = CB_Net.getHashParameters(URL, null, ["parameter5", "parameter6", "parameter7"], true); //Returns 'parameter5=value5_hash&amp;parameter6=&amp;parameter7='.
	
	//Gets the value of the "parameter1" from the current URL:
	var value = CB_Net.getHashValue("parameter1"); //It will be an empty string if the parameter did not exist.
	
	//Gets the value of the "parameter2" from the current URL, without trimming spaces around:
	var value_2 = CB_Net.getHashValue("parameter2", false); //It will be an empty string if the parameter did not exist.
	
	//Gets the value of the "parameter3" from the given URI string (the 'URL' variable), without trimming spaces around:
	var value_3 = CB_Net.getHashValue("parameter3", false, URL); //It should return "value3_hash".
</code></pre>

<p>
	It is also possible to manage sets of parameters with your own format:
</p>
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Gets all the desired parameters using the own format desired:
	var URL = "https://www.crossbrowdy.com/guides.php?data=[key1-     value1    ,key2-   value2   ,key3-   value3   ]#whatever";
	var values = CB_Net.getURIParameters(URL, null, null, null, null, "[", "]", ",", "-"); //Returns "key1-value1,key2-value2,key3-value3".
	
	//Gets the value of the desired parameter, using the own format desired:
	var value = CB_Net.getParameter("key2", false, URL, "[", "]", ",", "-"); //Returns "   value2   ".
	var value = CB_Net.getParameter("key2", true, URL, "[", "]", ",", "-"); //Returns "value2".
</code></pre>

<p>
	Although previous functions already decode the values automatically, sometimes manual codification and decodification is also useful:
</p>
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Encodes the given URI:
	var URLEncoded = CB_Net.URIEncode(URL); //The 'URL' variable should contain an unencoded URI.

	//Decodes the given URI:
	var URLDecoded = CB_Net.URIDecode(URLEncoded); //The 'URLEncoded' variable should contain an encoded URI.

	//Encodes the given URI value:
	var URLValueEncoded = CB_Net.URIValueEncode(value); //The 'value' variable should contain an unencoded value.
	
	//Decodes the given URI value:
	var URLValueDecoded = CB_Net.URIValueDecode(URLValueEncoded); //The 'URLValueEncoded' variable should contain an encoded value.
</code></pre>


<p>
	Check the <a href="api/index.html" target="_blank">API documentation</a> to read more about the <a href="api/CB_Net.html" target="_blank">CB_Net</a> static class.
</p>