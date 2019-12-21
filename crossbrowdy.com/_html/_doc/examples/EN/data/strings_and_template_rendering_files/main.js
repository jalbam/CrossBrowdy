/* This file belongs to a CrossBrowdy.com example, made by Joan Alba Maldonado. */

CB_init(main); //It will call the "main" function when ready.


//This function will be called when CrossBrowdy is ready:
function main()
{
	//Checks whether they are a string or not:
	var myString = "Hello, CrossBrowdy!";
	if (CB_isString(myString)) { printMessage("'myString' is a string!"); }
	else { printMessage("'myString' is not a string!"); }
	var myStringObject = new String("Hello, CrossBrowdy!");
	if (CB_isString(myStringObject)) { printMessage("'myStringObject' is a string!"); }
	else { printMessage("'myStringObject' is not a string!"); }
	var myNumber = 123;
	if (CB_isString(myNumber)) { printMessage("'myNumber' is a string!"); }
	else { printMessage("'myNumber' is not a string!"); }

	//Returns the given element if it is a string or an empty string otherwise:
	var a = CB_forceString("a"); //Returns: "a".
	var b = CB_forceString(123); //Returns: "" (empty string).
	var c = CB_forceString(0xFF); //Returns: "" (empty string).
	var d = CB_forceString([1, 2, 3]); //Returns: "" (empty string).
	var e = CB_forceString([]); //Returns: "" (empty string).
	var f = CB_forceString({ "property" : "value" }); //Returns: "" (empty string).
	var g = CB_forceString({}); //Returns: "" (empty string).
	var h = CB_forceString(null); //Returns: "" (empty string).
	var i = CB_forceString(undefined); //Returns: "" (empty string).
	var j = CB_forceString(NaN); //Returns: "" (empty string).
	var outputExpected = "a";
	var outputReal = a + b + c + d + e + f + g + h + i + j;
	checkOutput(outputExpected, outputReal);

	//Parses a given element as a string, returning an empty string if not possible:
	var a = CB_parseString("a"); //Returns: "a".
	var b = CB_parseString(123); //Returns: "123" (string).
	var c = CB_parseString(0xFF); //Returns: "255" (string).
	var d = CB_parseString([1, 2, 3]); //Returns: "" (empty string).
	var e = CB_parseString([]); //Returns: "" (empty string).
	var f = CB_parseString({ "property" : "value" }); //Returns: "" (empty string).
	var g = CB_parseString({}); //Returns: "" (empty string).
	var h = CB_parseString(null); //Returns: "" (empty string).
	var i = CB_parseString(undefined); //Returns: "" (empty string).
	var j = CB_parseString(NaN); //Returns: "" (empty string).
	outputExpected = "a123255";
	outputReal = a + b + c + d + e + f + g + h + i + j;
	checkOutput(outputExpected, outputReal);

	//Trims undesired strings from a string, case sensitive:
	//NOTE: functions below are equivalent to 'CB_Arrays.trim', 'CB_Arrays.ltrim' and 'CB_Arrays.rtrim'.
	var myFruit = "  watermelon    ";
	var stringTrimmed = CB_trim(myFruit); //Strips spaces. Returns: "watermelon".
	var stringTrimmed_2 = CB_trim(myFruit, "n"); //Trims "n". Returns: "  watermelon    ".
	var stringTrimmed_3 = CB_trim(myFruit, [" ", "l", "e", "n"]); //Trims spaces, "l", "e" and "n". Returns: "watermelo".
	var stringTrimmed_4 = CB_trim(myFruit, [" ", "wat", "on"]); //Trims spaces, "wat" and "on". Returns: "ermel".
	var stringTrimmed_5 = CB_ltrim(myFruit); //Trims spaces in the left. Returns: "watermelon    ".
	var stringTrimmed_6 = CB_ltrim(myFruit, [" ", "w", "ate", "o"]); //Trims spaces, "w", "ate" and "o" in the left. Returns: "rmelon    ".
	var stringTrimmed_7 = CB_rtrim(myFruit); //Trims spaces in the right. Returns: "  watermelon".
	var stringTrimmed_8 = CB_rtrim(myFruit, [" ", "l", "n", "o"]); //Trims spaces, "l", "n" and "o" in the right. Returns: "  waterme".
	outputExpected = "watermelon  watermelon    watermeloermelwatermelon    rmelon      watermelon  waterme";
	outputReal = stringTrimmed + stringTrimmed_2 + stringTrimmed_3 + stringTrimmed_4 + stringTrimmed_5 + stringTrimmed_6 + stringTrimmed_7 + stringTrimmed_8;
	checkOutput(outputExpected, outputReal);

	//Replacing strings easily (with the regular expression generated by 'CB_regularExpressionString'):
	var myString = "Line1\nLine2\nLINE3";
	var myString_2 = myString.replace(CB_regularExpressionString("e"), "A"); //Replaces first occurrence of "e" by "A". Returns: "LinA1\nLine2\nLINE3".
	var myString_3 = myString.replace(CB_regularExpressionString("e", true), "A"); //Replaces all occurrences of "e" by "A". Returns: "LinA1\nLinA2\nLINE3".
	var myString_4 = myString.replace(CB_regularExpressionString("e", true, true), "A"); //Replaces all occurrences of "e" by "A", case insensitive. Returns: "LinA1\nLinA2\nLINA3".
	var myString_5 = myString.replace(CB_regularExpressionString("e", false, true), "A"); //Replaces first occurrence of "e" by "A", case insensitive. Returns: "LinA1\nLine2\nLINE3".
	outputExpected = "Line1\nLine2\nLINE3LinA1\nLine2\nLINE3LinA1\nLinA2\nLINE3LinA1\nLinA2\nLINA3LinA1\nLine2\nLINE3";
	outputReal = myString + myString_2 + myString_3 + myString_4 + myString_5;
	checkOutput(outputExpected, outputReal);

	//Another easy way to replaces all the given occurrence from a given string or array of strings ("myString" could be an array of strings, with as many levels as we wish):
	var myString_6 = CB_replaceAll(myString, "e", "A"); //Replaces all occurrences of "e" by "A". Returns: "LinA1\nLinA2\nLINE3".
	var myString_7 = CB_replaceAll(myString, "e", "A", true); //Replaces all occurrences of "e" by "A", case insensitive. Returns: "LinA1\nLinA2\nLINA3".
	var myString_8 = CB_replaceAll(myString, ["e", "o", "i"], "A"); //Replaces all occurrences of "e", "o" and "h" by "A". Returns: "LAnA1\nLAnA2\nLINE3".
	var myString_9 = CB_replaceAll(myString, ["e", "o", "i"], "A", true); //Replaces all occurrences of "e", "o" and "h" by "A", case insensitive. Returns: "LAnA1\nLAnA2\nLANA3".
	outputExpected = "LinA1\nLinA2\nLINE3LinA1\nLinA2\nLINA3LAnA1\nLAnA2\nLINE3LAnA1\nLAnA2\nLANA3";
	outputReal = myString_6 + myString_7 + myString_8 + myString_9;
	checkOutput(outputExpected, outputReal);

	//Combine two sets of URI parameters (the same can be done with 'CB_Net.combineURIParameters'):
	var parametersCombined = CB_combineURIParameters("parameter1=value1&parameter2=value2", "parameter3=value3&parameter4=value4"); //Returns 'parameter1=value1&parameter2=value2&parameter3=value3&parameter4=value4'.
	var parametersCombined_2 = CB_combineURIParameters("?parameter1=value1&parameter2=value2", "?parameter3=value3&parameter4=value4"); //Returns 'parameter1=value1&parameter2=value2&parameter3=value3&parameter4=value4'.
	var parametersCombined_3 = CB_combineURIParameters("??parameter1=value1&parameter2=value2&&", "???&parameter3=value3&parameter4=value4&"); //Returns 'parameter1=value1&parameter2=value2&parameter3=value3&parameter4=value4'.
	outputExpected = "parameter1=value1&parameter2=value2&parameter3=value3&parameter4=value4parameter1=value1&parameter2=value2&parameter3=value3&parameter4=value4parameter1=value1&parameter2=value2&parameter3=value3&parameter4=value4";
	outputReal = parametersCombined + parametersCombined_2 + parametersCombined_3;
	checkOutput(outputExpected, outputReal);

	//Other functions:
	var myHTML = CB_nl2br(myString); //Replaces "\n" by "<br />". Returns: "Line1<br />Line2<br />LINE3". Equivalent to 'CB_nlToBr'.
	var myString_6 = CB_br2nl(myHTML); //Replaces "<br />" by "\n". Returns: "Line1\nLine2\nLINE3". Equivalent to 'CB_brToNl'.
	outputExpected = "Line1<br />Line2<br />LINE3Line1\nLine2\nLINE3";
	outputReal = myHTML + myString_6;
	checkOutput(outputExpected, outputReal);

	//Places the template desired in a string:
	var templateAsString = "Hello, {{name}}! Welcome to {{locations.first}}."; //Just an example, it could come from a file.

	//Sets an object with the information for rendering the template:
	var JSONObject = { "name" : "CrossBrowdy", "locations" : { "first" : "Wonderland" } };

	//Renders the string (it will use Handlebars.js if available or fallback automatically to vanilla JavaScript otherwise):
	var templateAsString_rendered = CB_renderString(templateAsString, JSONObject); //If Handlebar.js is not available, it will only replace variables with their values, without processing control structures, etc.
	outputExpected = "Hello, CrossBrowdy! Welcome to Wonderland.";
	outputReal = templateAsString_rendered;
	checkOutput(outputExpected, outputReal);

	//We can avoid using Handlebars.js, forcing vanilla JavaScript processing (it will only replace variables with their values, without processing control structures, etc.):
	var templateAsString_rendered_2 = CB_renderString(templateAsString, JSONObject, true); //In this case, it would contain the same as 'templateAsString_rendered'.
	outputReal = templateAsString_rendered_2;
	checkOutput(outputExpected, outputReal);

	//When using vanilla JavaScript processing, we can also define a maximum depth level for reading the JSON object (for performance purposes):
	var templateAsString_rendered_3 = CB_renderString(templateAsString, JSONObject, true, 20); //In this case, it would contain the same as 'templateAsString_rendered'.
	outputReal = templateAsString_rendered_3;
	checkOutput(outputExpected, outputReal);

	//It is also possible to get the string of the desired path in a JSON object this way:
	//NOTE: when dealing with any kind of values (not only strings), 'CB_getValueIndex' can be a better option.
	var name = CB_getValuePath(JSONObject, "name"); //Returns "CrossBrowdy".
	var locations = CB_getValuePath(JSONObject, "locations"); //Returns an empty string (as a string could not be found in the given path).
	var locationsFirst = CB_getValuePath(JSONObject, "locations.first"); //Default separator is dot ("."). Returns "Wonderland".
	var locationsFirst_2 = CB_getValuePath(JSONObject, "locations@first", "@"); //Using "@" as separator. Returns "Wonderland".
	var unexisting = CB_getValuePath(JSONObject, "this.path.does.not.exist"); //Returns an empty string (as a string could not be found in the given path).	
	outputExpected = "CrossBrowdyWonderlandWonderland";
	outputReal = name + locations + locationsFirst + locationsFirst_2 + unexisting;
	checkOutput(outputExpected, outputReal);
}


//Checks expected output compared with real one and prints the result:
function checkOutput(outputExpected, outputReal)
{
	printMessage("* Expected output:\n" + outputExpected + "\n* Real output:\n" + outputReal + "\n*** " + ((outputExpected === outputReal) ? "[CORRECT!]" : "[FAILED!]") + " ***");
}


//Prints the desired message:
function printMessage(message)
{
	message = message + "\n\n";
	CB_console(message);
	message = //Escapes some characters for HTML.
		CB_nl2br
		(
			message.replace(CB_regularExpressionString("&", true, true), "&amp;")
			.replace(CB_regularExpressionString("<br />", true, true), "&lt;br /&gt;")
			.replace(CB_regularExpressionString(" ", true, true), "&nbsp;")
		);
	CB_Elements.appendContentById("container", message);
}