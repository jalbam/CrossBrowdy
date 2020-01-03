<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	Here is an example of objects and JSON management:
</p>
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Defines a "class" and creates an instance of it with 3 properties (1 of them inherited through the prototype):
	var myClass = function() {};
	myClass.prototype.propertyInherited = "propertyInherited_value"; //Adds the "propertyInherited" property to the prototype.
	var myObject = new myClass(); //Creates an instance of 'myClass'.
	myObject.property1 = "property1_value"; //Adds the "property1" property to the object.
	myObject.property2 = { "subproperty1" : "subproperty1_value" }; //Adds the "property2" property to the object.
	
	//Getting the size of the object, just counting properties on the first level (equivalent to 'CB_sizeof', 'CB_Arrays.sizeOf' and 'CB_Arrays.sizeof'):
	var myObjectSize = CB_sizeOf(myObject); //Also counts not own properties, inherited from prototype. Returns: 3.
	var myObjectSize_2 = CB_sizeOf(myObject, true); //Only counts own properties, not inherited from prototype. Returns: 2.

	//Duplicating an object:
	var objectCopy = CB_copyObject({"hello" : "world", "whatever" : 123, "subObject" : { "subObject2" : "hello" } }); //Returns another object with the same properties and their values (copies it).

	//Combines two objects, third parameter ignored when not using two arrays (equivalent to 'CB_combineJSON' and 'CB_Arrays.combine'):
	var objectsCombined = CB_combineArraysOrObjects({ a : 1, b: 2, c: 3 }, { c : 4, d : 5 }); //Returns the object: { a: 1, b: 2, c: 4, d: 5 }.
	var objectsCombined_2 = CB_combineArraysOrObjects({ c : 4, d : 5 }, { a : 1, b: 2, c: 3 }); //Returns the object: { c: 3, d: 5, a: 1, b: 2 }.
	var objectsCombined_3 = CB_combineArraysOrObjects({ a : 1, b: 2, c: 3 }, { c : 4, d : 5 }, true); //Returns the same as 'objectsCombined'.
	var objectsCombined_4 = CB_combineArraysOrObjects({ c : 4, d : 5 }, { a : 1, b: 2, c: 3 }, true); //Returns the same as 'objectsCombined_2'.

	//Combines one array with one object, third parameter ignored when not using two arrays (equivalent to 'CB_combineJSON' and 'CB_Arrays.combine'):
	var objectsCombined_5 = CB_combineArraysOrObjects([1, 2, 3], { 1 : 22, "index1" : "3", "index2" : "whatever", "index3" : 3 }); //Returns the object: { 0: 1, 1: 22, 2: 3, index1: "3", index2: "whatever", index3: 3 }.
	var objectsCombined_6 = CB_combineArraysOrObjects({ 1 : 22, "index1" : "3", "index2" : "whatever", "index3" : 3 }, [1, 2, 3]); //Returns the object: { 0: 1, 1: 2, 2: 3, index1: "3", index2: "whatever", index3: 3 }.
	var objectsCombined_7 = CB_combineArraysOrObjects([1, 2, 3], { 1 : 22, "index1" : "3", "index2" : "whatever", "index3" : 3 }, true); //Returns the same as 'objectsCombined_5'.
	var objectsCombined_8 = CB_combineArraysOrObjects({ 1 : 22, "index1" : "3", "index2" : "whatever", "index3" : 3 }, [1, 2, 3], true); //Returns the same as 'objectsCombined_6'.
	
	//Here is a way to get the value inside a given index from a desired object, returning the desired value if not found:
	//NOTE: when dealing with strings, 'CB_getValuePath' can be a better option.
	var JSONObject = { "name" : "CrossBrowdy", "locations" : { "first" : "Wonderland" } };
	var name = CB_getValueIndex(JSONObject, "name"); //Returns "CrossBrowdy".
	var locations = CB_getValueIndex(JSONObject, "locations"); //Returns { "first" : "Wonderland" }.
	var locationsFirst = CB_getValueIndex(JSONObject["locations"], "first"); //Returns "Wonderland".
	var locationsSecond = CB_getValueIndex(JSONObject["locations"], "second"); //Returns undefined.
	var locationsSecond_2 = CB_getValueIndex(JSONObject["locations"], "second", "Value when not found"); //Returns "Value when not found".

	//It is possible to parse a string that contains a JSON object to create a real JSON object and vice versa:
	//NOTE: internally, 'CB_parseJSON' uses 'JSON.parse' and 'CB_stringifyJSON' uses 'JSON.stringify'. If they are not available natively, a fallback method will be chosen automatically.
	var JSONObject = { a : 1, "b" : { "c" : "hello" } };
	var JSONObjectString = CB_stringifyJSON(JSONObject); //Returns a string containing 'JSONObject'. Second and third parameters would be used as the second and third ones ("replacer" and "space") when calling 'JSON.stringify' internally.
	var JSONObject_2 = CB_parseJSON(JSONObjectString); //Contains the same as 'JSONObject'. Second parameter would be used as the second one ("reviver") when calling 'JSON.parse' internally.
	var JSONObject_3 = CB_parseJSON(123, undefined, "error_value", true, function() { CB_console("Failed!"); }); //Returns 123 (number).
	var JSONObject_4 = CB_parseJSON(123, undefined, "error_value", false, function() { CB_console("Failed!"); }); //Returns the same as 'JSONObject_3'.
	var JSONObject_5 = CB_parseJSON("not_a_JSON_object", undefined, "error_value", true, function() { CB_console("Failed!"); }); //Returns "error_value" and calls the error callback.
	var JSONObject_6 = CB_parseJSON("not_a_JSON_object", undefined, "error_value", false, function() { CB_console("Failed!"); }); //Returns "error_value" and calls the error callback.
	var JSONObject_7 = CB_parseJSON(function(){}, undefined, "error_value", true, function() { CB_console("Failed!"); }); //Returns "error_value" and calls the error callback.
	var JSONObject_8 = CB_parseJSON(function(){}, undefined, "error_value", false, function() { CB_console("Failed!"); }); //Returns "error_value" and calls the error callback.
	var JSONObject_9 = CB_parseJSON(NaN, undefined, "error_value", true, function() { CB_console("Failed!"); }); //Returns "error_value" and calls the error callback.
	var JSONObject_10 = CB_parseJSON(NaN, undefined, "error_value", false, function() { CB_console("Failed!"); }); //Returns "error_value" and calls the error callback.
	var JSONObject_11 = CB_parseJSON(null, undefined, "error_value", true, function() { CB_console("Failed!"); }); //Returns an empty object.
	var JSONObject_12 = CB_parseJSON(null, undefined, "error_value", false, function() { CB_console("Failed!"); }); //Returns null.
	var JSONObject_13 = CB_parseJSON(undefined, undefined, "error_value", true, function() { CB_console("Failed!"); }); //Returns an empty object.
	var JSONObject_14 = CB_parseJSON(undefined, undefined, "error_value", false, function() { CB_console("Failed!"); }); //Returns "error_value" and calls the error callback.
	var JSONObjectString_2 = CB_stringifyJSON(123, undefined, undefined, "error_value", true, function() { CB_console("Failed!"); }); //Returns "123" (string).
	var JSONObjectString_3 = CB_stringifyJSON(123, undefined, undefined, "error_value", false, function() { CB_console("Failed!"); }); //Returns the same as 'JSONObjectString_2'.
	var JSONObjectString_4 = CB_stringifyJSON("one_string", undefined, undefined, "error_value", true, function() { CB_console("Failed!"); }); //Returns "\"one_string\"".
	var JSONObjectString_5 = CB_stringifyJSON("one_string", undefined, undefined, "error_value", false, function() { CB_console("Failed!"); }); //Returns the same as 'JSONObjectString_4'.
	var JSONObjectString_6 = CB_stringifyJSON(function(){}, undefined, undefined, "error_value", true, function() { CB_console("Failed!"); }); //Returns "error_value".
	var JSONObjectString_7 = CB_stringifyJSON(function(){}, undefined, undefined, "error_value", false, function() { CB_console("Failed!"); }); //Returns undefined.
	var JSONObjectString_8 = CB_stringifyJSON(NaN, undefined, undefined, "error_value", true, function() { CB_console("Failed!"); }); //Returns "error_value".
	var JSONObjectString_9 = CB_stringifyJSON(NaN, undefined, undefined, "error_value", false, function() { CB_console("Failed!"); }); //Returns "null" (string).
	var JSONObjectString_10 = CB_stringifyJSON(null, undefined, undefined, "error_value", true, function() { CB_console("Failed!"); }); //Returns "error_value".
	var JSONObjectString_11 = CB_stringifyJSON(null, undefined, undefined, "error_value", false, function() { CB_console("Failed!"); }); //Returns "null" (string).
	var JSONObjectString_12 = CB_stringifyJSON(undefined, undefined, undefined, "error_value", true, function() { CB_console("Failed!"); }); //Returns "error_value".
	var JSONObjectString_13 = CB_stringifyJSON(undefined, undefined, undefined, "error_value", false, function() { CB_console("Failed!"); }); //Returns undefined.
	
	//The 'CB_getJSONPropertyValue' function is similar to 'CB_getValueIndex' but it will accept strings (it will try to parse them as JSON objects) and will return the element given again if the property is not given:
	var myValue = CB_getJSONPropertyValue(JSONObject, "a"); //Returns 1.
	var myValue_2 = CB_getJSONPropertyValue(JSONObject, "a", "not found"); //Returns the same as 'myValue'.
	var myValue_3 = CB_getJSONPropertyValue(JSONObject, "c"); //The "c" property cannot be found in the first level. Returns undefined.
	var myValue_4 = CB_getJSONPropertyValue(JSONObject, "c", "not found"); //The "c" property cannot be found in the first level. Returns "not found".
	var myValue_5 = CB_getJSONPropertyValue(JSONObjectString, "a"); //Returns the same as 'myValue'.
	var myValue_6 = CB_getJSONPropertyValue(JSONObjectString, "a", "not found"); //Returns the same as 'myValue'.
	var myValue_7 = CB_getJSONPropertyValue(JSONObjectString, "c"); //Returns the same as 'myValue_3'.
	var myValue_8 = CB_getJSONPropertyValue(JSONObjectString, "c", "not found"); //Returns the same as 'myValue_4'.
</code></pre>

<p>
	Note that the
	<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON" target="_blank">JSON object</a> and its methods (as
	<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse" target="_blank">JSON.parse</a>
	and <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify" target="_blank">JSON.stringify</a>)
	will always be present, using polyfills internally automatically if it is not supported natively.
</p>

<p>
	Check the <a href="api/index.html" target="_blank">API documentation</a> to read more about some <a href="api/global.html" target="_blank">global functions and variables</a>.
</p>