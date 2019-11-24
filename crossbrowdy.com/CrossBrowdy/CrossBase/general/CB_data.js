/**
 * @file Data and related management.
 *  @author Joan Alba Maldonado <workindalian@gmail.com>
 *  @todo A function equivalent to htmlentities/htmlspecialchars (as in PHP).
 */
 

//If we want to extend the DOM, we do it:
if (CB_Configuration[CB_BASE_NAME].EXTEND_DOM)
{
	try
	{
		if (!Array.prototype.indexOf) { Array.prototype.indexOf = function(searchElement, fromIndex) { CB_indexOf(this, searchElement, fromIndex, true); } }
		if (!Array.prototype.lastIndexOf) { Array.prototype.lastIndexOf = function(searchElement, fromIndex) { CB_lastIndexOf(this, searchElement, fromIndex, true); } }
		if (!Array.isArray) { Array.isArray = function() { return CB_isArray(this, true); } } //isArray is a method which is not in the prototype.
		//if (!Array.prototype.isArray) { Array.prototype.isArray = function() { return CB_isArray(this, true); } }
		if (!Array.prototype.forEach) { Array.prototype.forEach = function(callback, thisArg) { CB_forEach(this, callback, thisArg, true); } }
		if (!NodeList.prototype.forEach) { NodeList.prototype.forEach = Array.prototype.forEach; }
		if (!HTMLCollection.prototype.forEach) { HTMLCollection.prototype.forEach = Array.prototype.forEach; }
	} catch(E) {}
}


/**
 * Implementation of [Array.lastIndexOf]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/lastIndexOf} method for browsers that do not support it natively.
   <br>
   Returns the last index of a given element that exists in an array (starting from a certain index if desired) or -1 if not found.
 *  @function
 *  @param {array} array - Desired array.
 *  @param {*} searchElement - Element we want to search. Note that it is type sensitive.
 *  @param {integer} [fromIndex=array.length - 1] - First index of the given array where the search will start.
 *  @param {boolean} [extendedDOM=false] - Defines whether the function is being called by a native function which was extended. Internal usage recommended only.
 *  @returns {integer} 
 *  @todo Implement the "fromIndex" in the polyfill.
 */
//* Polyfill source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/lastIndexOf
function CB_lastIndexOf(array, searchElement, fromIndex, extendedDOM)
{
	'use strict';
	if (!extendedDOM)
	{
		if (array && array.lastIndexOf) { return array.lastIndexOf.call(array, searchElement, fromIndex || array.length); } //It can be a string.
		if (Array.prototype.lastIndexOf) { return Array.prototype.lastIndexOf.call(array, searchElement, fromIndex || array.length); }
	}
	
	if (typeof(array) === "undefined" || array === null) { throw new TypeError(); }

	var n, k,
		t = Object(array),
		len = t.length >>> 0;
	if (len === 0) { return -1;	}

	n = len - 1;
	if (arguments.length > 2 && typeof(arguments[2]) !== "undefined" && arguments[2] !== null && !isNaN(arguments[2]))
	{
		n = Number(arguments[2]);
		if (n != n) { n = 0; }
		//if (n != n) { n = len - 1; }
		else if (n != 0 && n != (1 / 0) && n != -(1 / 0))
		{
			n = (n > 0 || -1) * Math.floor(Math.abs(n));
		}
	}

	for (k = n >= 0 ? Math.min(n, len - 1) : len - Math.abs(n); k >= 0; k--)
	{
		if (k in t && t[k] === searchElement) { return k; }
	}
	
	return -1;
}


/**
 * Implementation of [Array.indexOf]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf} method for arrays in browsers that do not support it natively.
   <br>
   Returns the first index of a given element that exists in an array (starting from a certain index if desired) or -1 if not found.
 *  @function
 *  @param {array} array - Desired array.
 *  @param {*} searchElement - Element we want to search. Note that it is type sensitive.
 *  @param {integer} [fromIndex=0] - First index of the given array where the search will start.
 *  @param {boolean} [extendedDOM=false] - Defines whether the function is being called by a native function which was extended. Internal usage recommended only.
 *  @returns {integer}
 */
//* Polyfill source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
function CB_indexOf(array, searchElement, fromIndex, extendedDOM)
{
	if (!extendedDOM)
	{
		if (array && array.indexOf) { return array.indexOf.call(array, searchElement, fromIndex); } //It can be a string.
		if (Array.prototype.indexOf) { return Array.prototype.indexOf.call(array, searchElement, fromIndex); }
	}

	if (typeof(array) === "undefined" || array === null)
	{
		throw new TypeError( '"array" is null or not defined' );
	}

	var length = array.length >>> 0; // Hack to convert object.length to a UInt32

	fromIndex = +fromIndex || 0;

	if (Math.abs(fromIndex) === Infinity) { fromIndex = 0; }

	if (fromIndex < 0)
	{
		fromIndex += length;
		if (fromIndex < 0) { fromIndex = 0; }
	}

	for (;fromIndex < length; fromIndex++)
	{
		if (array[fromIndex] === searchElement)
		{
			return fromIndex;
		}
	}

	return -1;
}


/**
 * Implementation of the [Array.forEach]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach} method for browsers that do not support it natively.
   <br>
   Executes a function for each element of a given array.
 *  @function
 *  @param {array} array - Desired array.
 *  @param {function} callback - Function that will be executed for each element of the given array. Following the same rules as the native [Array.forEach]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach} method, it will receive three arguments: currentValue, currentIndex and the array given.
 *  @param {*} [thisArg] - Value that will be passed as "this" every time the function is called.
 *  @param {boolean} [extendedDOM=false] - Defines whether the function is being called by a native function which was extended. Internal usage recommended only.
 *  @returns {array|undefined} If the "extendedDOM" parameter is set to false, returns the given "array" again. Otherwise, returns undefined.
 */
//* Polyfill source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
function CB_forEach(array, callback, thisArg, extendedDOM)
{
	"use strict";

	if (!extendedDOM)
	{
		if (array.forEach) { array.forEach.call(array, callback, thisArg); return array; }
		else if (Array.prototype.forEach) { Array.prototype.forEach.call(array, callback, thisArg); return array; }
	}
		
    if (array === void 0 || array === null) { throw new TypeError(); }
	if (typeof callback !== "function") { throw new TypeError(); }
	
    var t = Object(array);
    var len = t.length >>> 0;

    //thisArg = arguments.length >= 2 ? arguments[1] : void 0;
    for (var i = 0; i < len; i++)
	{
		if (i in t) { callback.call(thisArg, t[i], i, t); }
    }
	
	return extendedDOM ? undefined : array;
}


/**
 * Implementation of [Array.isArray]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray} method for browsers that do not support it natively.
   <br>
   Returns whether a given element is an array or not.
 *  @function
 *  @param {*} element - The element we want to check.
 *  @param {boolean} [extendedDOM=false] - Defines whether the function is being called by a native function which was extended. Internal usage recommended only.
 *  @returns {boolean}
 */
function CB_isArray(element, extendedDOM)
{
	if (typeof(element) === "undefined" || element === null) { return false; }
	var isArray = false;
	if (Array)
	{
		if (Array.isArray && !extendedDOM)
		{
			isArray = Array.isArray(element);
		}
		else
		{
			isArray = element instanceof Array;
			if (!isArray) //It could still be an Array from another frame.
			{
				isArray = (Object.prototype.toString.call(element) === '[object Array]');
			}
		}
	}
	return isArray;
}


/**
 * Alias for {@link CB_sizeOf}.
 *  @function CB_sizeof
 *  @see {@link CB_sizeOf}
 */	
/**
 * Returns the size of an object or array.
 *  @function
 *  @param {Object|array} element - The element whose size we want to know. It should be an object or an array.
 *  @param {boolean} [onlyOwn=false] - If the "element" given is not an object, this parameter will be ignored. Otherwise, if it is set to true, it will only have into account the properties which the object has as their own property and have not been inherited (using the [Object.hasOwnProperty]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty} method).
 *  @returns {integer} If an object is provided, the size will be the number of its properties. Otherwise, if an array is given, the size will be the numbers of its indexes ([Array.length]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/length} property).
 */
function CB_sizeOf(object, onlyOwn)
{
    var size = 0;
    if (CB_isArray(object) && typeof(object.length) !== "undefined" && object.length !== null && !isNaN(object.length) && object.length > 0) { return object.length; }
	for (var key in object)
	{
        if (!onlyOwn || object.hasOwnProperty(key)) { size++; }
    }
    return size;
}
var CB_sizeof = CB_sizeOf; //Alias for the function.


/**
 * Returns whether a given element is a string or not.
 *  @function
 *  @param {*} element - The element we want to check.
 *  @returns {boolean}
 */
function CB_isString(element)
{
	return (typeof(element) === "string" || element instanceof String);
}


/**
 * Returns back the given element if it is a string or an empty string otherwise.
 *  @function
 *  @param {*} element - The element that will be checked.
 *  @returns {string}
 */
function CB_forceString(element)
{
	if (!CB_isString(element)) { return ""; }
	else { return element; }
}


/**
 * Returns back the given element as a string if it could be parsed or an empty string otherwise.
 *  @function
 *  @param {*} element - The element that will be checked.
 *  @returns {string}
 */
function CB_parseString(element)
{
	if (typeof(element) === "undefined" || element === null || element === true || element === false || !CB_isString(element) && isNaN(element)) { return ""; }
	else { return element + ""; }
}


/**
 * Trims a given string or array of strings (modifying the given array), taking off the desired strings or otherwise trimming spaces, tabs ("\t"), new lines ("\n") and carriage returns ("\r"). Case sensitive.
 *  @function
 *  @param {string|array} element - The element that will be trimmed. It should be either a string or an array of strings.
 *  @param {string|array} [undesiredStrings=[ " ", "\n", "\r", "\t" ]] - String or an array with the strings that we want to trim off the given element.
 *  @returns {string|array} Returns the given element again if it was an string, a number (it will be casted to a string) or an array of strings, trimmed if it has been possible. If it was another type, returns an empty string.
 *  @todo Accept a "recursive" parameter (boolean) to affect multiple levels (array of arrays of strings, etc.).
 *  @todo Consider accepting objects instead of arrays in the "element" parameter.
 */
function CB_trim(element, undesiredStrings)
{
	if (CB_isArray(element))
	{
		for (var x = 0, elementLength = element.length; x < elementLength; x++)
		{
			element[x] = CB_trim(element[x], undesiredStrings);
		}
		return element;
	}
	//else if (typeof(element) !== "undefined" && element !== null && !isNaN(element)) { return element; }
	else if (typeof(element) === "undefined" || element === null) { return ""; }
	else if (element === true || element === false) { return ""; }
	else if (!isNaN(element)) { element = element + ""; }
	else if (!CB_isString(element)) { return ""; }
	else if (typeof(element.trim) === "function")
	{
		//Only calls the native function when the "undesiredStringFound" parameter is the default one (it will not just trim blank spaces but also "\r", "\n"...):
		if (!CB_isArray(undesiredStrings) && !CB_isString(undesiredStrings))
		{
			return element.trim();
		}
	}
	//return element.replace(/^\s+|\s+$/g, "");
	
	element = CB_rtrim(element, undesiredStrings);
	element = CB_ltrim(element, undesiredStrings);
	
	return element;
}


/**
 * Trims the right side of a given string or array of strings (modifying the given array), taking off the desired strings or otherwise trimming spaces, tabs ("\t"), new lines ("\n") and carriage returns ("\r"). Case sensitive.
 *  @function
 *  @param {string|array} element - The element that will be trimmed. It should be either a string or an array of strings.
 *  @param {string|array} [undesiredStrings=[ " ", "\n", "\r", "\t" ]] - String or an array with the strings that we want to trim off the given element.
 *  @returns {string|array} Returns the given element again if it was an string, a number (it will be casted to a string) or an array of strings, trimmed if it has been possible. If it was another type, returns an empty string.
 *  @todo Accept a "recursive" parameter (boolean) to affect multiple levels (array of arrays of strings, etc.).
 *  @todo Consider accepting objects instead of arrays in the "element" parameter.
 *  @todo Think about optimizing (using a counter for the number of occurrences in the loop and trim all the occurrences when finished).
 */
function CB_rtrim(element, undesiredStrings)
{
	if (CB_isArray(element))
	{
		for (var x = 0, elementLength = element.length; x < elementLength; x++)
		{
			element[x] = CB_rtrim(element[x], undesiredStrings);
		}
		return element;
	}
	//else if (typeof(element) !== "undefined" && element !== null && !isNaN(element)) { return element; }
	else if (typeof(element) === "undefined" || element === null) { return ""; }
	else if (element === true || element === false) { return ""; }
	else if (!isNaN(element)) { element = element + ""; }
	else if (!CB_isString(element)) { return ""; }
	
	if (CB_isString(undesiredStrings)) { undesiredStrings = [ undesiredStrings ]; }
	else if (!CB_isArray(undesiredStrings))
	{
		undesiredStrings = [ " ", "\n", "\r", "\t" ];
		//Only calls the native function when the "undesiredStringFound" parameter is the default one (it will not just trim blank spaces but also "\r", "\n"...):
		if (typeof(element.trimEnd) === "function") { return element.trimEnd(); }
	}
    
	//Loops through the undesired strings:
	var undesiredStringsLength = undesiredStrings.length;
	var undesiredStringFound = false;
	for (var x = 0; x < undesiredStringsLength; x++)
	{
		//Trims undesired string at the end:
		while (element.substring(element.length - undesiredStrings[x].length, element.length) === undesiredStrings[x])
		{
			element = element.substring(0, element.length - undesiredStrings[x].length);
			undesiredStringFound = true;
		}
		//If an undesired string has been found, we are looking for more than one undesired strings and the loop is at the end, starts the loop again:
		if (undesiredStringFound && undesiredStringsLength > 1 && x + 1 === undesiredStringsLength) { undesiredStringFound = false; x = -1; }
	}
	
	return element;
}


/**
 * Trims the left side of a given string or array of strings (modifying the given array), taking off the desired strings or otherwise trimming spaces, tabs ("\t"), new lines ("\n") and carriage returns ("\r"). Case sensitive.
 *  @function
 *  @param {string|array} element - The element that will be trimmed. It should be either a string or an array of strings.
 *  @param {string|array} [undesiredStrings=[ " ", "\n", "\r", "\t" ]] - String or an array with the strings that we want to trim off the given element.
 *  @returns {string|array} Returns the given element again if it was an string, a number (it will be casted to a string) or an array of strings, trimmed if it has been possible. If it was another type, returns an empty string.
 *  @todo Accept a "recursive" parameter (boolean) to affect multiple levels (array of arrays of strings, etc.).
 *  @todo Consider accepting objects instead of arrays in the "element" parameter.
 *  @todo Think about optimizing (using a counter for the number of occurrences in the loop and trim all the occurrences when finished).
 */
function CB_ltrim(element, undesiredStrings)
{
	if (CB_isArray(element))
	{
		for (var x = 0, elementLength = element.length; x < elementLength; x++)
		{
			element[x] = CB_ltrim(element[x], undesiredStrings);
		}
		return element;
	}
	//else if (typeof(element) !== "undefined" && element !== null && !isNaN(element)) { return element; }
	else if (typeof(element) === "undefined" || element === null) { return ""; }
	else if (element === true || element === false) { return ""; }
	else if (!isNaN(element)) { element = element + ""; }
	else if (!CB_isString(element)) { return ""; }

	if (CB_isString(undesiredStrings)) { undesiredStrings = [ undesiredStrings ]; }
	else if (!CB_isArray(undesiredStrings))
	{
		undesiredStrings = [ " ", "\n", "\r", "\t" ];
		//Only calls the native function when the "undesiredStringFound" parameter is the default one (it will not just trim blank spaces but also "\r", "\n"...):
		if (typeof(element.trimStart) === "function") { return element.trimStart(); }
	}

	//Loops through the undesired strings:
	var undesiredStringsLength = undesiredStrings.length;
	var undesiredStringFound = false;
	for (var x = 0; x < undesiredStringsLength; x++)
	{
		//Trims undesired string at the beginning:
		while (element.substring(0, undesiredStrings[x].length) === undesiredStrings[x])
		{
			element = element.substring(undesiredStrings[x].length, element.length);
			undesiredStringFound = true;
		}
		//If an undesired string has been found, we are looking for more than one undesired strings and the loop is at the end, starts the loop again:
		if (undesiredStringFound && undesiredStringsLength > 1 && x + 1 === undesiredStringsLength) { undesiredStringFound = false; x = -1; }
	}
	
	return element;
}


/**
 * Alias for {@link CB_nl2br}.
 *  @function CB_nlToBr
 *  @see {@link CB_nl2br}
 */
/**
 * Changes new lines (\n) for &lt;br /&gt;'s in a given string.
 *  @function
 *  @param {string} string - The string we want to modify.
 *  @returns {string} Returns the string with all the occurrences replaced or an empty string if the element given was not a string.
 */
function CB_nl2br(string)
{
	//If it is not a string, uses an empty string instead:
	if (!CB_isString(string)) { string = ""; }

	//Parses the variable to string type:
	string = string.toString();

	string = string.replace(/\n/gi, "<br />");

	return string;
}
var CB_nlToBr = CB_nl2br; //Alias for the function.


/**
 * Alias for {@link CB_br2nl}.
 *  @function CB_brToNl
 *  @see {@link CB_br2nl}
 */
/**
 * Changes &lt;br /&gt;'s, &lt;br/&gt;'s and &lt;br&gt;'s for new lines (\n) in a given string.
 *  @function
 *  @param {string} string - The string we want to modify.
 *  @returns {string} Returns the string with all the occurrences replaced or an empty string if the element given was not a string.
 */
function CB_br2nl(string)
{
	//If it is not a string, uses an empty string instead:
	if (!CB_isString(string)) { string = ""; }

	//Parses the variable to string type:
	string = string.toString();

	string = string.replace(/<br \/>/gi, "\n");	
	string = string.replace(/<br\/>/gi, "\n");	
	string = string.replace(/<br>/gi, "\n");	

	return string;
}
var CB_brToNl = CB_br2nl; //Alias for the function.


/**
 * Tries to guess whether a given file path (absolute or relative) is a local address or not. It will be assumed as local if the path
   uses the "file:" protocol or the current script is running locally and the path does not use the "http:", "https:" or "ftp:" protocols.
 *  @function
 *  @param {string} filePath - The file path we want to check.
 *  @returns {boolean} Returns whether the given file path is a local address or not.
 */
function CB_isFileLocal(filePath)
{
	var isFileLocal = false;

	filePath = CB_trim(filePath);
	
	if (filePath !== "")
	{
		if (filePath.substring(0, 5) === "file:" || CB_Client.isRunningLocally() && filePath.substring(0, 5) !== "http:" && filePath.substring(0, 6) !== "https:" && filePath.substring(0, 4) !== "ftp:")
		{
			isFileLocal = true;
		}
	}
	
	return isFileLocal;
}


/**
 * Processes a given string as a template and returns it rendered (if possible) with the values of the given JSON object.
   Tries to use [Handlebars]{@link https://handlebarsjs.com/} as the first choice but if is is not available it will just replace all occurrences with
   vanilla JavaScript.
 *  @function
 *  @param {string} str - The string we want to render.
 *  @param {Object} [JSONObject=CB_JSONData] - The JSON object which contains the values. If not provided, it will try to use the global CB_JSONData object in the case it exists.
 *  @param {boolean} [forceVanilla=false] - Forces vanilla JavaScript rendering instead of using [Handlebars]{@link https://handlebarsjs.com/}.
 *  @param {integer} [depthLevelMax=10] - Maximum depth level allowed to read the object to render the string. Only applies when it is rendered by vanilla JavaScript. For performance purposes.
 *  @returns {str}
 */
function CB_renderString(string, JSONObject, forceVanilla, depthLevelMax)
{
	string = CB_trim(string);
	
	//If a JSON object is not given, uses the default one (if any):
	if (typeof(JSONObject) === "undefined" || JSONObject === null)
	{
		if (typeof(CB_JSONData) !== "undefined" && CB_JSONData !== null) { JSONObject = CB_JSONData; }
	}

	//If we do not want vanilla JavaScript rendering and Handlebars is present, uses it:
	if (!forceVanilla && typeof(Handlebars) !== "undefined" && Handlebars !== null && typeof(Handlebars.compile) === "function")
	{
		//Returns the template rendered:
		return Handlebars.compile(string)(JSONObject); //Using Handlebars.
	}
	//...otherwise, just replaces all occurrences in the given string:
	else
	{
		return CB_renderStringRecursively(string, JSONObject, false, depthLevelMax);
	}
}


//Renders a given string recursively with the given object and the given max level:
function CB_renderStringRecursively(string, desiredObject, avoidRecursive, depthLevelMax, levelCurrent, pathCurrent)
{
	if (typeof(desiredObject) === "undefined" || desiredObject === null) { return string; }
	if (typeof(depthLevelMax) === "undefined" || depthLevelMax === null || isNaN(depthLevelMax)) { depthLevelMax = 10; }
	if (typeof(levelCurrent) === "undefined" || levelCurrent === null || isNaN(levelCurrent)) { levelCurrent = 0; }
	if (typeof(pathCurrent) === "undefined" || pathCurrent === null) { pathCurrent = ""; }
	if (pathCurrent.substring(0, 1) === ".") { pathCurrent = pathCurrent.substring(1); }

	for (var property in desiredObject)
	{
		if (CB_sizeof(desiredObject[property]) === 0 || CB_isString(desiredObject[property]))
		{
			string = string.replace(CB_regularExpressionString("{{" + pathCurrent + (pathCurrent === "" ? "" : ".") + property + "}}", true, false), desiredObject[property]);
		}
		else if (!avoidRecursive && levelCurrent < depthLevelMax)
		{
			string = CB_renderStringRecursively(string, desiredObject[property], avoidRecursive, depthLevelMax, ++levelCurrent, pathCurrent + "." + property);
			string = string.replace(CB_regularExpressionString("{{" + pathCurrent + (pathCurrent === "" ? "" : ".") + property + "}}", true, false), ""); //In the case is has not been found, clears it.
		}
	}

	return string;
}


/**
 * Tells whether a given email is valid or not. Not really precise.
 *  @function
 *  @param {string} email - Possible email that we want to validate.
 *  @returns {boolean}
 */
//* Source: steve @ http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
function CB_isEmail(email)
{
	return (CB_isString(email) && email.indexOf("..") === -1 && /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(email));
}


/**
 * Returns the given number with the desired decimals and make it a string if we want to (so it will be able to have trailing zeros). Uses decimal numeral system only. It will perform ceiling round automatically if needed.
 *  @function
 *  @param {integer|float|string} number - The number that we want to format. It can be a string.
 *  @param {integer} [decimals=2] - The number of decimals we want to allow.
 *  @param {boolean} [stringify=false] - Set to true if we want it to return a string (filled with trailing zeros to reach the desired number of decimals).
 *  @returns {integer|float|string} Returns zero in the case a non-valid number has been provided.
 *	@todo Allow to define a minimum length for the integer part of the "number" parameter, so it will fill with leading zeros if needed (when "stringify" is set to true). Think about allowing to define a maximum too.
 */
function CB_numberFormat(number, decimals, stringify)
{
	number = parseFloat(number);
	if (isNaN(number)) { return 0; }
	decimals = parseInt(decimals);
	if (isNaN(decimals) || decimals < 0) { decimals = 2; }
	number *= Math.pow(10, decimals);
	number = parseInt(number + 0.5); //Ceil round.
	number /= Math.pow(10, decimals);
	if (stringify)
	{
		number = number + "";
		
		//if (number.indexOf(".") === -1) { number += ".00"; }
		//else if (number.substring(number.indexOf(".") + 1).length === 1) { number += "0"; }
		
		if (decimals >= 1 && number.indexOf(".") === -1) { number += "."; }
		while (number.substring(number.indexOf(".") + 1).length < decimals)
		{
			number += "0";
		}
	}
	return number;
}


/**
 * Alias for {@link CB_countDecimalPart}.
 *  @function CB_countDecimals
 *  @see {@link CB_countDecimalPart}
 */
/**
 * Alias for {@link CB_countDecimalPart}.
 *  @function CB_countDecimalDigits
 *  @see {@link CB_countDecimalPart}
 */
/**
 * Alias for {@link CB_countDecimalPart}.
 *  @function CB_numberOfDecimals
 *  @see {@link CB_countDecimalPart}
 */
/**
 * Alias for {@link CB_countDecimalPart}.
 *  @function CB_numberOfDecimalDigits
 *  @see {@link CB_countDecimalPart}
 */
/**
 * Returns the number of decimals of the given number. It also works with numbers in exponential notation (as for example '1e-13' which would be 0.0000000000001).
 *  @function
 *  @param {integer|float|string} number - The number whose decimals we want to count. It can be a string.
 *  @returns {integer} Returns zero in the case a non-valid number has been provided. Otherwise, it returns the number of decimals counted.
 */
var CB_countDecimalPart = CB_countDecimalDigits = CB_countDecimals = CB_numberOfDecimals = CB_numberOfDecimalDigits = function(number)
{
	number = parseFloat(number);
	if (isNaN(number)) { return 0; }
	number = Math.abs(number);
	if (number % 1 === 0) { return 0; }

	//First it tries "fastest" way (it does not work for numbers in exponential notation):
	var decimals = (number + "").split(".");
	decimals = (typeof(decimals[1]) !== "undefined") ? decimals[1].length : 0;
	if (decimals > 0) { return decimals; }

	//For float numbers that are represented in exponential notation (like '1e-13', for example):
	decimals = 0;
	var numberMultiplied = 0;
	while ((numberMultiplied = number * Math.pow(10, ++decimals)) % 1 !== 0);
	return decimals;
}


/**
 * Alias for {@link CB_countIntegerPart}.
 *  @function CB_numberOfIntegerDigits
 *  @see {@link CB_countIntegerPart}
 */
 /**
 * Alias for {@link CB_countIntegerPart}.
 *  @function CB_countIntegerDigits
 *  @see {@link CB_countIntegerPart}
 */
/**
 * Returns the number of integer digits (the number of digits that belong to the integer part) of the given number. It also works with numbers in exponential notation (as for example '1e-13' which would be 0.0000000000001).
 *  @function
 *  @param {integer|float|string} number - The number whose integer digits (the digits that belong to the integer part) we want to count. It can be a string.
 *  @returns {integer} Returns zero in the case a non-valid number has been provided. Otherwise, it returns the number of integer digits (the number of digits that belong to the integer part) counted.
 */
var CB_countIntegerPart = CB_countIntegerDigits = CB_numberOfIntegerDigits = function(number)
{
	number = parseFloat(number);
	if (isNaN(number)) { return 0; }
	number = Math.abs(number);
	if (number < 1) { return 0; }

	//First it tries "fastest" way (it does not work for numbers in exponential notation):
	var integers = (number + "").split(".");
	integers = (typeof(integers[1]) !== "undefined") ? integers[0].length : 0;
	if (integers > 0) { return integers; }

	//For float numbers that are represented in exponential notation (like '1e-13', for example):
	integers = 0;
	var numberMultiplied = 0;
	while ((numberMultiplied = number / Math.pow(10, ++integers)) > 1);
	return integers;
}



/**
 * Returns the value of a desired path in an object or an empty string if it cannot be found.
 *  @function
 *  @param {Object} object - The object where we want to find the path.
 *  @param {string} path - The path that will be search in the given object to retrieve the value. It should use the string defined in the "splitString" parameter to separate items. If it is empty or not provided, it will just return the given "object" again.
 *  @param {string} [splitString="."] - The string that will be used to separate one item from another one. By default, it will be a dot (".") so, for example, a given "path" with a value of "hello.world" will indicate the "object.hello.world" path.
 *  @returns {*} Returns the value of a desired path in an object or an empty string if it cannot be found. If the "path" parameter is empty or not provided, it will just return the given "object" again.
 */
function CB_getValuePath(object, path, splitString)
{
	if (CB_sizeof(object) === 0 || CB_isString(object)) { return ""; }

	path = CB_trim(path);
	if (path === "") { return object; }
	
	if (!CB_isString(splitString) || splitString.length < 1) { splitString = "."; }
	var indexes = path.split(splitString);
	var indexesLength = indexes.length;
	var index;
	var value = object;
	for (var x = 0; x < indexesLength; x++)
	{
		index = CB_trim(indexes[x]);
		value = CB_getValueIndex(value, index, "");
		if (CB_sizeof(value) === 0 || CB_isString(value)) { break; }
	}

	return (x + 1 === indexesLength) ? value : "";
}


var CB_setDatumDateObject = new Date();
/**
 * Stores a value using [Web Storage API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API} ([localStorage]{@link https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage}). It can use [localStorage]{@link https://github.com/mortzdk/localStorage} as a fallback or cookies instead.
 *  @function
 *  @param {string|number} index - The index where the value given will be stored.
 *  @param {string|number} value - The value we want to store. It should be a string or a number.
 *  @param {integer} [days] - The number of days after which the cookie will expire (in the case that cookies are used). It belongs to the "expires=" parameter of the cookie. If not provided, the parameter will not be used at all.
 *  @param {string} [path] - The path where the cookie will be stored (in the case that cookies are used). It belongs to the "path=" parameter of the cookie. If not provided, the parameter will not be used at all.
 *  @param {boolean} [forceCookie=false] - Forces to use cookies instead of [Web Storage API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API} ([localStorage]{@link https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage}).
 *  @returns {boolean} Returns true if the value has been stored successfully (not totally reliable, it should be checked with {@link CB_getDatum} after a while).
 */
function CB_setDatum(index, value, days, path, forceCookie)
{
	index += "";
	value += "";
	
	if (!forceCookie && window.localStorage && window.localStorage.setItem)
	{
		try
		{
			localStorage.setItem(index, value);
			return true;
		} catch(E) { }
	}
	
	if (typeof(document.cookie) !== "undefined" && document.cookie !== null)
	{
		try
		{
			path = CB_trim(path);
			if (path !== "") { path = ";path=" + escape(path); }
			
			var expires = "";
			if (typeof(days) !== "undefined" && days !== null && !isNaN(days) && days >= 0 && days <= 365)
			{
				CB_setDatumDateObject.setTime(CB_setDatumDateObject.getTime() + (days * 24 * 60 * 60 * 1000));
				expires = ";expires=" + CB_setDatumDateObject.toUTCString();
			}
			
			document.cookie = escape(index) + "=" + escape(value) + expires + path;
			return true;
		} catch(E) { }
	}
	
	return false;
}


/**
 * Stores a cookie.
 *  @function
 *  @param {string|number} index - The index where the value given will be stored.
 *  @param {string|number} value - The value we want to store. It should be a string or a number.
 *  @param {integer} [days] - The number of days after which the cookie will expire. It belongs to the "expires=" parameter of the cookie. If not provided, the parameter will not be used at all.
 *  @param {string} [path] - The path where the cookie will be stored. It belongs to the "path=" parameter of the cookie. If not provided, the parameter will not be used at all.
 *  @returns {boolean} Returns true if the value has been stored successfully (not totally reliable, it should be checked with {@link CB_getCookie} after a while).
 */
function CB_setCookie(index, value, days, path)
{
	return CB_setDatum(index, value, days, path, true);
}


/**
 * Gets, from its index, a previous value stored. It will try to get it using [Web Storage API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API} ([localStorage]{@link https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage}). It can use [localStorage]{@link https://github.com/mortzdk/localStorage} as a fallback or cookies instead.
 *  @function
 *  @param {string} index - The index whose value we want to retrieve.
 *  @param {boolean} [forceCookie=false] - Forces to use cookies instead of [Web Storage API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API} ([localStorage]{@link https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage}).
 *  @param {boolean} [unescapeIndex=false] - Applies the unescape function to the value before returning it. Only applies when cookies are used.
 *  @returns {string|null} Returns null when the value cannot be found.
 */
function CB_getDatum(index, forceCookie, unescapeIndex)
{
	var itemFound = null;
	
	if (window.localStorage && window.localStorage.getItem && !forceCookie)
	{
		itemFound = localStorage.getItem(index);
	}
	
	if (itemFound === null && typeof(document.cookie) !== "undefined" && document.cookie !== null)
	{
		index += "=";
		if (unescapeIndex) { index = unescape(index); }
		var cookies = document.cookie.split(";");
		var cookies_length = cookies.length;
		for (var x = 0; x < cookies_length; x++)
		{
			if (cookies[x].indexOf(index) !== -1) { return unescape(cookies[x].substring(cookies[x].indexOf(index) + index.length, cookies[x].length)); }
		}
	}
	
	return itemFound;
}


/**
 * Returns, from its index, a previous stored cookie.
 *  @function
 *  @param {string} index - The index whose value we want to retrieve.
 *  @returns {string|null} Returns null when the value cannot be found.
 */
function CB_getCookie(index)
{
	return CB_getDatum(index, true);
}


/**
 * Gets the value from a given object which belongs to the desired index or returns the value of "returnValueOnFail" if it cannot be found.
 *  @function
 *  @param {Object} object - The object from which we want to get the value.
 *  @param {string} index - The index whose value we want to retrieve.
 *  @param {*} [returnValueOnFail=undefined] - The value we want it to return in the case that the property cannot be found. If not provided, undefined will be returned.
 *  @returns {*} Returns the value from a given object which belongs to the desired index or the value of "returnValueOnFail" otherwise if it cannot be found.
 */
function CB_getValueIndex(object, index, returnValueOnFail)
{
	if (typeof(object) !== "undefined" && object !== null && typeof(object[index]) !== "undefined" && object[index] !== null) { return object[index]; }
	else { return returnValueOnFail; }
}


/**
 * Returns an object copied from the given one.
 *  @function
 *  @param {object} element - The element whose properties and values we want to copy. It should be an object.
 *  @param {boolean} [onlyOwn=false] - If the "element" given is not an object, this parameter will be ignored. Otherwise, if it is set to true, it will only have into account the properties which the object has as their own property and have not been inherited (using the [Object.hasOwnProperty]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty} method).
 *  @returns {object} Returns an object copied from the given one. Returns an empty object if the given "element" was not an object.
 */
function CB_copyObject(object, onlyOwn)
{
    if (typeof(object) !== "object" || object === null) { return {}; }
	var newObject = {};
	for (var key in object)
	{
        if (!onlyOwn || object.hasOwnProperty(key)) { newObject[key] = object[key]; }
    }
    return newObject;
}


/**
 * Gets the value of a desired property of a given JSON object. Uses the {@link CB_getValueIndex} function internally.
 *  @function
 *  @param {Object|string} JSONObject - The JSON object from which we want to get the value. If it is a string, it will try to parse it to create a real object from it. Used as the "object" parameter when calling the {@link CB_getValueIndex} function internally.
 *  @param {string} property - The property whose value we want to retrieve. If not provided, the given object will be returned again. Used as the "index" parameter when calling the {@link CB_getValueIndex} function internally.
 *  @param {*} [returnValueOnFail] - The value we want it to return in the case it cannot be parsed. If not provided, undefined will be returned. Used as the "returnValueOnFail" parameter when calling the {@link CB_getValueIndex} function internally.
 *  @returns {*} Returns the given "JSONObject" again (after trying to parse it if it was a string, if possible) if the "property" value was not given. Returns the value from the given object which belongs to the desired property or the value of "returnValueOnFail" otherwise if it cannot be found.
 */
function CB_getJSONPropertyValue(JSONObject, property, returnValueOnFail)
{
	if (CB_isString(JSONObject)) { JSONObject = CB_parseJSON(JSONObject, undefined, null); } //If a string is received, tries to parse it as a JSON object.
	
	if (typeof(property) === "undefined" || property === null) { return JSONObject; }
	
	return CB_getValueIndex(JSONObject, property, returnValueOnFail);
	
	/*
	if (typeof(JSONObject) === "undefined" || JSONObject === null)
	{
		//if (!property || returnObjectOnFail) { return JSONObject; }
		return returnValueOnFail;
	}
	//else if (property && typeof(JSONObject[property]) !== "undefined" && JSONObject[property] !== null) { return JSONObject[property]; }
	//else if (!property || returnObjectOnFail) { return JSONObject; }
	else if (typeof(JSONObject[property]) !== "undefined" && JSONObject[property] !== null) { return JSONObject[property]; }
	else { return returnValueOnFail; }
	*/
}


/**
 * Tries to parse a given string to convert it into a JSON object. Internally it will use the native [JSON.parse]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse} method or otherwise use [JSON 3]{@link https://bestiejs.github.io/json3/} instead.
 *  @function
 *  @param {string} objectString - The JSON object we want to parse, in string format. First parameter when calling the [JSON.parse]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse} method (or equivalent)
 *  @param {function} [reviver] - Second parameter when calling the [JSON.parse]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse} method (or equivalent).
 *  @param {*} [returnValueOnFail] - The value we want it to return in the case it cannot be parsed. If not provided, undefined will be returned.
 *  @param {boolean} [acceptUndefinedOrNull=false] - If it is set to true and the given objectString is undefined or null, an empty object ({}) will be used as the objectString.
 *  @param {function} [onError] - Callback which will be called if it failed to be parsed (it will receive the "objectString" as the unique parameter).
 *  @returns {*} Returns the object parsed from the given string or the value of "returnValueOnFail" otherwise (which will be undefined if not provided).
 */
function CB_parseJSON(objectString, reviver, returnValueOnFail, acceptUndefinedOrNull, onError)
{
	if (typeof(objectString) === "undefined" || objectString === null)
	{
		if (acceptUndefinedOrNull) { objectString = '{}'; }
	}
	
	objectString = objectString + "";
	try { return JSON.parse(objectString, reviver); }
	catch(E)
	{
		if (typeof(onError) === "function") { onError(objectString); }
		return returnValueOnFail;
	}
}


/**
 * Tries to create a JSON valid string from a given JSON object or value. Internally it will use the native [JSON.stringify]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify} method or otherwise use [JSON 3]{@link https://bestiejs.github.io/json3/} instead.
 *  @function
 *  @param {*} objectOrValue - The object or value that we want to stringify. First parameter when calling the [JSON.stringify]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify} method (or equivalent).
 *  @param {function} [replacer] - Second parameter when calling the [JSON.stringify]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify} method (or equivalent).
 *  @param {string|integer} [space] - Third parameter when calling the [JSON.stringify]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify} method (or equivalent).
 *  @param {*} [returnValueOnFail] - The value we want it to return in the case it cannot be stringify. If not provided, undefined will be returned.
 *  @param {boolean} [failIfUndefinedOrNull=false] - If it is set to true and the returning value is undefined or null, the value of "returnValueOnFail" will be returned.
 *  @param {function} [onError] - Callback which will be called if it failed to be stringified (it will receive the "objectOrValue" as the unique parameter).
 *  @returns {string} Returns the object stringified from the given object or value if possible or the value of "returnValueOnFail" otherwise (which will be undefined if not provided). Avoids returning undefined or null if "failIfUndefinedOrNull" is set to true, returning the value of "returnValueOnFail" instead.
 */
function CB_stringifyJSON(objectOrValue, replacer, space, returnValueOnFail, failIfUndefinedOrNull, onError)
{
	try
	{
		var valueReturned = JSON.stringify(objectOrValue, replacer, space);
		if (failIfUndefinedOrNull && (typeof(valueReturned) === "undefined" || valueReturned === null || valueReturned === "null")) { return returnValueOnFail; }
		return valueReturned;
	}
	catch(E)
	{
		if (typeof(onError) === "function") { onError(objectOrValue); }
		return returnValueOnFail;
	}
}


/**
 * Tries to combine two given values guessing the best way to do it and returns their combination. Using the following rules:
	<br />
	If both values are either undefined or null, returns null.
	<br />
	Otherwise, if both values are boolean, returns the AND operation for the two of them (a && b).
	<br />
	Otherwise, if either of the two is a string (not empty) and is not JSON valid, combines them as URL (GET) parameters using {@link CB_combineURIParameters}.
	<br />
	Otherwise, if either of them is JSON valid, combines them as JSON using {@link CB_combineJSON} (passing the received avoidDuplicatedValuesInArray value as a parameter).
	<br />
	Otherwise, combines them as arrays or objects using {@link CB_combineArraysOrObjects} (passing the received "avoidDuplicatedValuesInArray" value as a parameter).
 *  @function
 *  @param {*} [a=null|[]|{}] - First value. It can be optional if "b" is a valid value, defined and not null.
 *  @param {*} [b=null|[]|{}] - Second value. It can be optional if "a" is a valid value, defined and not null.
 *  @param {boolean} [avoidDuplicatedValuesInArray=false] - Parameter that will be used in the case that {@link CB_combineJSON} or {@link CB_combineArraysOrObjects} is called.
 *  @param {boolean} [modifyArrayOrObjectA=false] - Parameter that will be used in the case that {@link CB_combineJSON} or {@link CB_combineArraysOrObjects} is called. If set to true, it will modify the original "a" array or object.
 *  @returns {*} 
 */
function CB_combineAutomatically(a, b, avoidDuplicatedValuesInArray, modifyArrayOrObjectA)
{
	if ((typeof(a) === "undefined" || a === null) && (typeof(b) === "undefined" || b === null)) { return null; }
	else if ((a === true || a === false) && (b === true || b === false)) { return a && b; }
	
	var aJSON = CB_parseJSON(a, undefined, null);
	var bJSON = CB_parseJSON(b, undefined, null);
	
	//If either of the two is a string (not empty) and is not JSON valid, combines them as URL (GET) parameters:
	if (CB_isString(a) && CB_trim(a) !== "" && aJSON === null || CB_isString(b) && CB_trim(b) !== "" && bJSON === null) { return CB_combineURIParameters(a, b); }
	//...otherwise, if either of them is JSON valid, combines them as JSON:
	else if (typeof(aJSON) !== "undefined" && aJSON !== null && aJSON !== true && aJSON !== false || typeof(bJSON) !== "undefined" && bJSON !== null && bJSON !== true && bJSON !== false) { return CB_combineJSON(a, b, avoidDuplicatedValuesInArray, modifyArrayOrObjectA); }
	//...otherwise, combines them as associative arrays or objects:
	else { return CB_combineArraysOrObjects(a, b, avoidDuplicatedValuesInArray, modifyArrayOrObjectA); }
}


/**
 * Alias for {@link CB_combineURIParameters}.
 *  @function CB_combineURLParameters
 *  @see {@link CB_combineURIParameters}
 */
/**
 * Combines two strings as URL (GET) parameters. If either "parametersA" or "parametersB" is not a string, internally it will use the native [JSON.stringify]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify} method if available or otherwise it will use [JSON 3]{@link https://bestiejs.github.io/json3/} instead.
 *  @function
 *  @param {string} parametersA - String with the desired parameter or parameters. It can be optional if "parametersB" is a valid string. It will trim any "&" and "?" character at the beginning and at the end, and finally use "&" to concatenate the two strings (if needed).
 *  @param {string} parametersB - String with the desired parameter or parameters. It can be optional if "parametersA" is a valid string. It will trim any "&" and "?" character at the beginning and at the end, and finally use "&" to concatenate the two strings (if needed).
 *  @returns {string} For example, if parametersA is "parameter1=value1&amp;parameter2=value2" and parametersB is "parameter3=value3&amp;what=ever" then it will return "parameter1=value1&amp;parameter2=value2&amp;parameter3=value3&amp;what=ever".
 */
function CB_combineURIParameters(parametersA, parametersB)
{
	if (typeof(parametersA) === "undefined" || parametersA === null) { parametersA = ""; }
	if (typeof(parametersB) === "undefined" || parametersB === null) { parametersB = ""; }
	if (!CB_isString(parametersA)) { parametersA = JSON.stringify(parametersA); if (!CB_isString(parametersA)) { parametersA = ""; } }
	if (!CB_isString(parametersB)) { parametersB = JSON.stringify(parametersB); if (!CB_isString(parametersB)) { parametersB = ""; } }
	if (parametersA !== "") { parametersA = CB_trim(CB_trim(parametersA), ["&", "?"]); }
	if (parametersB !== "") { parametersB = CB_trim(CB_trim(parametersB), ["&", "?"]); }
	return CB_trim(parametersA + "&" + parametersB, "&");
}
var CB_combineURLParameters = CB_combineURIParameters; //Alias for the function.


/**
 * Returns a combined array or object from two arrays or objects. Using the following rules:
	<br />
	If they both are arrays (numeric indexes), it will keep all elements (attaching the elements of the second array after the elements of the first one).
	<br />
	Otherwise, if either of them is not an array (it should be an associative array which is an object in JavaScript), it will merge the elements (overwritting those whose index is the same and keeping the ones from the second array/object):
 *  @function
 *  @param {array|Object|string|null|undefined} [arrayOrObjectA=[]|{}] - One of the arrays (numeric indexes) or associative arrays (object) that we want to combine. If a string is provided, it will try to convert it into a new object (the string should be a JSON-valid string). It can be optional if "arrayOrObjectB" is a valid value and neither null nor undefined. If not provided but the "arrayOrObjectB" is provided, it will be a new empty array if the "arrayOrObjectB" is an array or it will be an empty object otherwise.
 *  @param {array|Object|string|null|undefined} [arrayOrObjectB=[]|{}] - One of the arrays (numeric indexes) or associative arrays (object) that we want to combine. If a string is provided, it will try to convert it into a new object (the string should be a JSON-valid string). It can be optional if "arrayOrObjectA" is a valid value and neither null nor undefined. If not provided but the "arrayOrObjectA" is provided, it will be a new empty array if the "arrayOrObjectA" is an array or it will be an empty object otherwise.
 *  @param {boolean} avoidDuplicatedValuesInArray - Tells whether to avoid or allow items with duplicated values in the returned array or not. Only applies when both arrays to combine are numeric arrays.
 *  @param {boolean} [modifyArrayOrObjectA=false] - Parameter that will be used in the case that {@link CB_combineJSON} or {@link CB_combineArraysOrObjects} is called. If set to true, it will modify the original "arrayOrObjectA" array or object.
 *  @returns {array|Object}
 */
function CB_combineArraysOrObjects(arrayOrObjectA, arrayOrObjectB, avoidDuplicatedValuesInArray, modifyArrayOrObjectA)
{
	if (typeof(arrayOrObjectA) === "undefined" || arrayOrObjectA === null || arrayOrObjectA === true || arrayOrObjectA === false)
	{
		arrayOrObjectA = CB_isArray(arrayOrObjectB) ? [] : {};
	}
	if (typeof(arrayOrObjectB) === "undefined" || arrayOrObjectB === null || arrayOrObjectB === true || arrayOrObjectB === false)
	{
		arrayOrObjectB = CB_isArray(arrayOrObjectA) ? [] : {};
	}
	
	if (CB_isString(arrayOrObjectA))
	{
		arrayOrObjectA = CB_parseJSON(arrayOrObjectA, undefined, null);
		if (arrayOrObjectA === null) { arrayOrObjectA = CB_isArray(arrayOrObjectB) ? [] : {}; }
	}

	if (CB_isString(arrayOrObjectB))
	{
		arrayOrObjectB = CB_parseJSON(arrayOrObjectB, undefined, null);
		if (arrayOrObjectB === null) { arrayOrObjectB = CB_isArray(arrayOrObjectA) ? [] : {}; }
	}

	var mergedObjectOrArray;
	
	//If they both are arrays, it will keep all elements (attaching the elements of the second array after the elements of the first one):
	if (CB_isArray(arrayOrObjectA) && CB_isArray(arrayOrObjectB))
	{
		if (modifyArrayOrObjectA)
		{
			mergedObjectOrArray = arrayOrObjectA;
			if (!avoidDuplicatedValuesInArray) { mergedObjectOrArray = CB_Arrays.removeDuplicated(mergedObjectOrArray, undefined, false); }
		}
		else
		{
			mergedObjectOrArray = [];
			var arrayOrObjectALength = arrayOrObjectA.length;
			for (var x = 0; x < arrayOrObjectALength; x++)
			{
				if (!avoidDuplicatedValuesInArray || CB_indexOf(mergedObjectOrArray, arrayOrObjectA[x]) === -1)
				{
					mergedObjectOrArray[x] = arrayOrObjectA[x];
				}
			}
		}
		
		var arrayOrObjectBLength = arrayOrObjectB.length;
		for (var x = 0; x < arrayOrObjectBLength; x++)
		{
			if (!avoidDuplicatedValuesInArray || CB_indexOf(mergedObjectOrArray, arrayOrObjectB[x]) === -1)
			{
				mergedObjectOrArray[mergedObjectOrArray.length] = arrayOrObjectB[x];
			}
		}
	}
	//...otherwise, if either of them is not an array, it will merge the elements (overwritting those whose index is the same and keeping the ones from the second object/array):
	else
	{
		if (modifyArrayOrObjectA)
		{
			mergedObjectOrArray = arrayOrObjectA;
			if (!avoidDuplicatedValuesInArray && CB_isArray(arrayOrObjectA)) { mergedObjectOrArray = CB_Arrays.removeDuplicated(arrayOrObjectA, undefined, false); }
		}
		else
		{
			mergedObjectOrArray = {};
			for (var propertyName in arrayOrObjectA)
			{
				mergedObjectOrArray[propertyName] = arrayOrObjectA[propertyName];
			}
		}

		for (var propertyName in arrayOrObjectB)
		{
			mergedObjectOrArray[propertyName] = arrayOrObjectB[propertyName];
		}
	}
	
	return mergedObjectOrArray;
}


/**
 * Alias for {@link CB_combineArraysOrObjects}.
 *  @function CB_combineJSON
 *  @see {@link CB_combineArraysOrObjects}
 */
 var CB_combineJSON = CB_combineArraysOrObjects;
/*
function CB_combineJSON(JSONObjectA, JSONObjectB, avoidDuplicatedValuesInArray, modifyArrayOrObjectA)
{
	return CB_combineArraysOrObjects(JSONObjectA, JSONObjectB, avoidDuplicatedValuesInArray, modifyArrayOrObjectA);
}
*/


/**
  Object that contains different properties and methods that can be used as the "baseSymbols" parameter for the {@link CB_intToBase} and {@link CB_baseToInt} functions. Each property is a numeric array of characters.
  * @namespace
  * @type {Object}
 */
var CB_baseSymbols =
{
	"_getCache" : { "max" : [] },
	
	/**
	 * Function that will return a numeric array of characters containing as many items as the desired base. Uses a cache internally.
	 *  @function
	 *  @param {integer} [base=256] - The desired base (number of items, each with a character, that the returning array will contain). Minimum value is 1. The maximum can differ one client to another but it is not recommended to exceed 4096 (or even lower, depending on the client, although some clients could support up to 63988 or even more). All arrays of bases lower than 87 use the symbols included also in base 87.
	 *  @returns {array} Returns a numeric array of characters containing as many items as the desired base. All arrays of bases lower than 87 use the symbols included also in base 87. When the base is greater than 87 and it is not not created by default (88 and 128), each item of the returning array will be the result of calling the [String.fromCharCode]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/fromCharCode} function from 0 to one number less than the desired base number.
	 */
	"get" : function(base)
	{
		if (typeof(base) === "undefined" || base === null || isNaN(base) || base < 1) { base = 256; }
		
		if (CB_isArray(CB_baseSymbols[base]) && CB_baseSymbols[base].length === base) { return CB_baseSymbols[base]; }
		else if (CB_isArray(CB_baseSymbols._getCache[base]) && CB_baseSymbols._getCache[base].length === base) { return CB_baseSymbols._getCache[base]; }
		
		var baseSymbols = [];
		var _getCacheLength = CB_baseSymbols._getCache.max.length;
		//if (_getCacheLength === base) { return CB_baseSymbols._getCache.max; }
		
		for (var x = 0; x < base && x < _getCacheLength; x++) { baseSymbols[x] = CB_baseSymbols._getCache.max[x]; }
		for (; x < base; x++) { CB_baseSymbols._getCache.max[x] = baseSymbols[x] = String.fromCharCode(x); }
		
		CB_baseSymbols._getCache[base] = baseSymbols;
		
		return baseSymbols;
	},
	
	/**
	 * Alias for {@link CB_baseSymbols.128}.
	 *  @var CB_baseSymbols._128
	 *  @see {@link CB_baseSymbols.128}
	 */
	"_128" : [],
	/**
	 * Numeric array of characters with 128 symbols. These symbols (and also the ones from other bases with higher number) will be encoded by the [escape]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/escape} function and also by the [encodeURIComponent]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent} function and they will need to be encoded in HTML (not recommended for URI components or JavaScript strings or HTML code).
	 *  @type {array}
	 *  @default An array with each item being the result of calling the [String.fromCharCode]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/fromCharCode} function from 0 to 127 as its unique parameter.
	 */
	"128" : [],
	
	/**
	 * Alias for {@link CB_baseSymbols.88}.
	 *  @var CB_baseSymbols._88
	 *  @see {@link CB_baseSymbols.88}
	 */	
	/**
	 * Numeric array of characters with 88 symbols. These symbols will be encoded by the [escape]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/escape} function and also by the [encodeURIComponent]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent} function, but they will not need to be encoded in HTML (not recommended for URI components or JavaScript strings, but useful for HTML code).
	 *  @type {array}
	 *  @default
	 */
	 "88" : [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", ".", "~", "!", "'", "(", ")", "*", "-", "_", "@", "\\", "/", "|", "[", "]", "{", "}", "$", "%", "=", "?", "^", ":", ";", ",", "+" ],

	/**
	 * Alias for {@link CB_baseSymbols.87}.
	 *  @var CB_baseSymbols._87
	 *  @see {@link CB_baseSymbols.87}
	 */	
	 /**
	 * Numeric array of characters with 87 symbols. These symbols will be encoded by the [escape]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/escape} function and also by the [encodeURIComponent]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent} function but they will not need to be encoded neither in JavaScript strings nor in HTML (not recommended for URI components, but useful for JavaScript strings or HTML code). Includes all symbols from lower bases, respecting the same order (which is their value).
	 *  @type {array}
	 *  @default
	 */
	"87" : [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", ".", "*", "-", "_", "~", "!", "'", "(", ")", "@", "/", "|", "[", "]", "{", "}", "$", "%", "=", "?", "^", ":", ";", ",", "+" ],
	
	/**
	 * Alias for {@link CB_baseSymbols.71}.
	 *  @var CB_baseSymbols._71
	 *  @see {@link CB_baseSymbols.71}
	 */	
	/**
	 * Numeric array of characters with 71 symbols. These symbols will be encoded by the [escape]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/escape} function but not by the [encodeURIComponent]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent} function (not recommended for URI components in old clients, but useful for URI components in new clients with [encodeURIComponent]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent} function support, for JavaScript strings or HTML code). Includes all symbols from lower bases, respecting the same order (which is their value).
	 *  @type {array}
	 *  @default
	 */
	"71" : [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", ".", "*", "-", "_", "~", "!", "'", "(", ")"],
	
	/**
	 * Alias for {@link CB_baseSymbols.66}.
	 *  @var CB_baseSymbols._66
	 *  @see {@link CB_baseSymbols.66}
	 */	
	/**
	 * Numeric array of characters with 66 symbols. These symbols will not be encoded neither by the [escape]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/escape} function nor by the [encodeURIComponent]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent} function (recommended for URI components for any client, JavaScript strings or HTML code). Includes Includes all symbols from lower bases, respecting the same order (which is their value).
	 *  @type {array}
	 *  @default
	 */
	"66" : [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", ".", "*", "-", "_" ],
	
	/**
	 * Alias for {@link CB_baseSymbols.64}.
	 *  @var CB_baseSymbols._64
	 *  @see {@link CB_baseSymbols.64}
	 */	
	/**
	 * Numeric array of characters with 64 symbols (using 0 to 9, A to Z, a to z, "." and "*"). These symbols will not be encoded neither by the [escape]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/escape} function nor by the [encodeURIComponent]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent} function (recommended for URI components for any client, JavaScript strings or HTML code in the case that we do not want to use base 66 from the {@link CB_baseSymbols.66} property). Includes all symbols from lower bases, respecting the same order (which is their value).
	 *  @type {array}
	 *  @default
	 */
	"64" : [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", ".", "*" ],
	
	/**
	 * Alias for {@link CB_baseSymbols.16}.
	 *  @var CB_baseSymbols._16
	 *  @see {@link CB_baseSymbols.16}
	 */	
	/**
	 * Numeric array of characters with 16 symbols (using 0 to 9, A to F), hexadecimal system. These symbols will not be encoded neither by the [escape]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/escape} function nor by the [encodeURIComponent]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent} function (recommended for URI components for any client, JavaScript strings or HTML code). Includes all symbols from lower bases, respecting the same order (which is their value).
	 *  @type {array}
	 *  @default
	 */
	"16" : [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F" ],

	/**
	 * Alias for {@link CB_baseSymbols.10}.
	 *  @var CB_baseSymbols._10
	 *  @see {@link CB_baseSymbols.10}
	 */	
	/**
	 * Numeric array of characters with 10 symbols (using 0 to 9), decimal system. These symbols will not be encoded neither by the [escape]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/escape} function nor by the [encodeURIComponent]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent} function (recommended for URI components for any client, JavaScript strings or HTML code). Includes all symbols from lower bases, respecting the same order (which is their value).
	 *  @type {array}
	 *  @default
	 */
	"10" : [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9" ],

	/**
	 * Alias for {@link CB_baseSymbols.8}.
	 *  @var CB_baseSymbols._8
	 *  @see {@link CB_baseSymbols.8}
	 */	
	/**
	 * Numeric array of characters with 8 symbols (using 0 to 7), octal system. These symbols will not be encoded neither by the [escape]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/escape} function nor by the [encodeURIComponent]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent} function (recommended for URI components for any client, JavaScript strings or HTML code). Includes all symbols from lower bases, respecting the same order (which is their value).
	 *  @type {array}
	 *  @default
	 */
	"8" : [ "0", "1", "2", "3", "4", "5", "6", "7" ],
	
	/**
	 * Alias for {@link CB_baseSymbols.2}.
	 *  @var CB_baseSymbols._8
	 *  @see {@link CB_baseSymbols.2}
	 */	
	/**
	 * Numeric array of characters with 2 symbols (using 0 and 1), binary system. These symbols will not be encoded neither by the [escape]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/escape} function nor by the [encodeURIComponent]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent} function (recommended for URI components for any client, JavaScript strings or HTML code).
	 *  @type {array}
	 *  @default
	 */
	"2" : [ "0", "1" ]
};
CB_baseSymbols._128 = CB_baseSymbols["128"] = CB_baseSymbols.get(128);
CB_baseSymbols._88 = CB_baseSymbols["88"];
CB_baseSymbols._87 = CB_baseSymbols["87"];
CB_baseSymbols._71 = CB_baseSymbols["71"];
CB_baseSymbols._66 = CB_baseSymbols["66"];
CB_baseSymbols._64 = CB_baseSymbols["64"];
CB_baseSymbols._16 = CB_baseSymbols["16"];
CB_baseSymbols._10 = CB_baseSymbols["10"];
CB_baseSymbols._8 = CB_baseSymbols["8"];
CB_baseSymbols._2 = CB_baseSymbols["2"];
for (CB_baseSymbols._x = 3; CB_baseSymbols._x < 87; CB_baseSymbols._x++)
{
	if (typeof(CB_baseSymbols[CB_baseSymbols._x]) !== "undefined") { continue; }
	CB_baseSymbols["_" + CB_baseSymbols._x] = CB_baseSymbols[CB_baseSymbols._x] = CB_baseSymbols._87.slice(0, CB_baseSymbols._x);
}


/**
 * Converts a given integer into a desired base.
 *  @function
 *  @param {integer|string} number - The integer that we want to convert to the desired base. For bigger numbers (up to 999999999999999934464 or even lower, depending on the client and the "baseSymbols" used), it is recommended to use a string which will allow to accept a slightly bigger number (up to 999999999999999999999999 or lower, depending on the client and the "baseSymbols" used). Really big numbers will not be codified properly even when passed as a string due to the limitations of JavaScript engines and maximum number allowed to be stored in a variable.
 *  @param {array|integer} [baseSymbols={@link CB_baseSymbols.66}] - Array with the desired symbols, using only one per index (their value will correspond to their index). The base (radix) will be the total number of indexes. If an integer greater or equal than 2 is provided, it will try to use it as an index of the {@link CB_baseSymbols} object and use it if found or use it as a parameter to call the {@link CB_baseSymbols.get} function otherwise. If not provided or the integer is lower than 2, it will use base 66 (defined in the {@link CB_baseSymbols._66} property of the {@link CB_baseSymbols} object). It is recommended not to exceed 4096 (or even lower, depending on the client, although some clients could support up to 63988 or even more). The properties of the {@link CB_baseSymbols} object or the {@link CB_baseSymbols.get} function can be used for this parameter.
 *  @param {boolean} [unsigned=false] - Determines whether to treat the input and output numbers as unsigned or not.
 *  @param {string} [minusSymbol='-'|'0'] - Determines the minus symbol or string for the output, to mark negative numbers. If not provided, it will be '-' for bases equal or lower than 16 (hexadecimal) or '0' (zero character) otherwise. This parameter is ignored if the "unsigned" parameter is set to true.
 *  @param {prefix} [prefix='0'|'0x'|''] - Determines the prefix for the output. If not provided, it will be '0' (zero character) for base 8 (octal), '0x' for base 16 (hexadecimal) or nothing (empty string) for all the others. Use an empty string to avoid using anything.
 *  @returns {string} Returns an empty string in the case that the given number cannot be parsed as an integer. Otherwise, returns the given number in the desired base as a string.
 *  @todo Think about allowing the "number" parameter to be a very long string, for bigger numbers (to exceed the limit for integers). Internally, it would need to perform operations comparisons, divisions, remainder calculation with strings, etc.
 *  @todo Think about allowing to specify the base for the integer (now it is 16 if it begins with "0x", 8 if it begins with "0" and it is not a string or 10 otherwise, and newer clients can support '0b' for binaries, '0o' for octals, ).
 *  @todo Think about accepting a decimal symbol to separate decimals and support float numbers.
 */
function CB_intToBase(number, baseSymbols, unsigned, minusSymbol, prefix)
{
	number = parseInt(number);
	if (isNaN(number)) { return ""; }

	var isNegative = false;
	if (!unsigned && number < 0) { isNegative = true; }
	
	if (!CB_isArray(baseSymbols))
	{
		if (typeof(baseSymbols) !== "undefined" && baseSymbols !== null && !isNaN(baseSymbols) && baseSymbols >= 2)
		{
			if (CB_isArray(CB_baseSymbols[baseSymbols])) { baseSymbols = CB_baseSymbols[baseSymbols]; }
			else { baseSymbols = CB_baseSymbols.get(baseSymbols); }
		}
		else { baseSymbols = CB_baseSymbols._66; }
	}
	
	baseRadix = baseSymbols.length;
	if (!unsigned && isNegative && (typeof(minusSymbol) === "undefined" || minusSymbol === null)) { minusSymbol = baseRadix <= 16 ? "-" : "0"; }
	
	var total = "";
	
	number = Math.abs(number);
	if (number >= baseRadix)
	{
		total = CB_intToBase(number / baseRadix, baseSymbols, true, "", "");
		number = parseInt(number % baseRadix);
	}
	
	total += baseSymbols[number];
	
	if (typeof(prefix) === "undefined" || prefix === null)
	{
		if (baseRadix === 8) { prefix = "0"; }
		else if (baseRadix === 16) { prefix = "0x"; }
		else { prefix = null; }
	}
	if (prefix !== null) { total = prefix + total; }
	
	if (!unsigned && isNegative) { total = minusSymbol + total; }
	
	return total;
}


/**
 * Converts a given number which is already in a desired base into an integer (decimal base).
	<br />
	Note: It can return wrong values when the value exceeds the maximum allowed by a number in the client's JavaScript engine. It can also depend on the "baseSymbols" used.
 *  @function
 *  @param {string} number - A string containing the number which is already in the desired base and that we want to convert to an integer.
 *  @param {array|integer} [baseSymbols={@link CB_baseSymbols.66}] - Array with the desired symbols, using only one per index (their value will correspond to their index). The base (radix) will be the total number of indexes. It should be the base which is already being used by the given number. If an integer greater or equal than 2 is provided, it will try to use it as an index of the {@link CB_baseSymbols} object and use it if found or use it as a parameter to call the {@link CB_baseSymbols.get} function otherwise. If not provided or the integer is lower than 2, it will use base 66 (defined in the {@link CB_baseSymbols._66} property of the {@link CB_baseSymbols} object). It is recommended not to exceed 4096 (or even lower, depending on the client, although some clients could support up to 63988 or even more). The properties of the {@link CB_baseSymbols} object or the {@link CB_baseSymbols.get} function can be used for this parameter.
 *  @param {boolean} [unsigned=false] - Determines whether to treat the input and output numbers as unsigned or not.
 *  @param {string} [minusSymbol='-'|'0'] - Determines the minus symbol or string for the input, to mark negative numbers. If not provided, it will be '-' for bases equal or lower than 16 (hexadecimal) or '0' (zero character) otherwise. This parameter is ignored if the "unsigned" parameter is set to true.
 *  @param {prefix} [prefix='0'|'0x'|''] - Determines the prefix for the input. If not provided, it will be '0' (zero character) for base 8 (octal), '0x' for base 16 (hexadecimal) or nothing (empty string) for all the others. Use an empty string to avoid using anything.
 *  @returns {integer} Returns the integer number in decimal base.
 *  @todo Think about allowing to return a string, for bigger numbers (to exceed the limit for integers). Internally, it would need to perform operations comparisons, multiplications with strings, etc.
 *  @todo Think about allowing to specify the base for the integer.
 *  @todo Think about accepting a decimal symbol to separate decimals and support float numbers.
 */
function CB_baseToInt(number, baseSymbols, unsigned, minusSymbol, prefix)
{
	number = "" + number;
	if (!CB_isArray(baseSymbols))
	{
		if (typeof(baseSymbols) !== "undefined" && baseSymbols !== null && !isNaN(baseSymbols) && baseSymbols >= 2)
		{
			if (CB_isArray(CB_baseSymbols[baseSymbols])) { baseSymbols = CB_baseSymbols[baseSymbols]; }
			else { baseSymbols = CB_baseSymbols.get(baseSymbols); }
		}
		else { baseSymbols = CB_baseSymbols._66; }
	}
	
	var value = CB_indexOf(baseSymbols, number.substring(number.length-1));
	
	if (value === -1) { return 0; }
	
	baseRadix = baseSymbols.length;

	var isNegative = false;
	if (!unsigned)
	{
		if (typeof(minusSymbol) === "undefined" || minusSymbol === null) { minusSymbol = baseRadix <= 16 ? "-" : "0"; }
		else { minusSymbol = minusSymbol + ""; }
		if (number.substring(0, minusSymbol.length) === minusSymbol)
		{
			number = number.substring(minusSymbol.length);
			isNegative = true;
		}
	}
	
	if (typeof(prefix) === "undefined" || prefix === null)
	{
		if (baseRadix === 8) { prefix = "0"; }
		else if (baseRadix === 16) { prefix = "0x"; }
		else { prefix = null; }
	}

	if (prefix !== null && prefix.length && number.substring(0, prefix.length) === prefix)
	{
		number = number.substring(prefix.length);
	}
	
	number = number.substring(0, number.length - 1);
	if (number !== "")
	{
		value += CB_baseToInt(number, baseSymbols, true, "", "") * baseRadix;
	}

	if (isNegative && value > 0) { value *= -1; }
	
	return value;
}



/**
 * Converts a given number which is already in a desired base into another chosen base.
	<br />
	Note: Uses {@link CB_baseToInt} and {@link CB_intToBase} internally.
 *  @function
 *  @param {string} number - A string containing the number which is already in the desired base and that we want to convert into the another chosen base. Used as the "number" parameter for calling both {@link CB_intToBase} and {@link CB_baseToInt} functions internally.
 *  @param {array|integer} [baseSymbolsOrigin={@link CB_baseSymbols.66}] - Used as the "baseSymbols" parameter when calling the {@link CB_baseToInt} function internally.
 *  @param {array|integer} [baseSymbolsDestiny={@link CB_baseSymbols.66}] - Used as the "baseSymbols" parameter when calling the {@link CB_intToBase} function internally.
 *  @param {boolean} [unsigned=false] - Determines whether to treat the input and output numbers as unsigned or not. Used as the "unsigned" parameter for calling both {@link CB_intToBase} and {@link CB_baseToInt} functions internally.
 *  @param {string} [minusSymbolOrigin='-'|'0'] - Used as the "minusSymbol" parameter when calling the {@link CB_baseToInt} function internally.
 *  @param {string} [minusSymbolDestiny='-'|'0'] - Used as the "minusSymbol" parameter when calling the {@link CB_intToBase} function internally.
 *  @param {prefix} [prefixOrigin='0'|'0x'|''] - Used as the "prefix" parameter when calling the {@link CB_baseToInt} function internally.
 *  @param {prefix} [prefixDestiny='0'|'0x'|''] - Used as the "prefix" parameter when calling the {@link CB_intToBase} function internally.
 *  @returns {string} Returns the returning value of the internal call to the {@link CB_intToBase} function.
 *  @todo Think about accepting a decimal symbol to separate decimals and support float numbers.
 */
function CB_baseToBase(number, baseSymbolsOrigin, baseSymbolsDestiny, unsigned, minusSymbolOrigin, minusSymbolDestiny, prefixOrigin, prefixDestiny)
{
	var numberDecimal = CB_baseToInt(number, baseSymbolsOrigin, unsigned, minusSymbolOrigin, prefixOrigin);
	return CB_intToBase(numberDecimal, baseSymbolsDestiny, unsigned, minusSymbolDestiny, prefixDestiny);
}


/**
 * Returns the string or array of strings with all the desired occurrences replaced. Calls itself recursively and calls the {@link CB_regularExpressionString} function internally.
 *  @function
 *  @param {string|array} stringOrArray - An string or an array of strings whose content we want to replace. It can also be an array of arrays of strings (as many levels as you wish). If an array is given, it will not be modified and a copy from it will be generated and returned with the occurrences replaced.
 *  @param {string|array} stringOrArrayFind - An string or an array of strings (not a regular expressions) that we want to find to be replaced (special characters will be escaped).
 *  @param {string} [stringReplace=""] - The string that will replace "stringFind". If not provided, it will be replaced as an empty string (it will just remove the occurrences found).
 *  @param {boolean} [caseInsensitive=false] - Defines whether we want to be case insensitive or not.
 *  @returns {string|array} Returns the "stringOrArray" given with occurrences replaced. If the "stringOrArray" given was neither a string nor an array, it will be returned without being modified.
 */
function CB_replaceAll(stringOrArray, stringOrArrayFind, stringReplace, caseInsensitive)
{
	if (CB_isArray(stringOrArray))
	{
		var arrayCopy = [];
		for (var x = 0; x < stringOrArray.length; x++)
		{
			 arrayCopy[x] = CB_replaceAll(stringOrArray[x], stringOrArrayFind, stringReplace, caseInsensitive);
		}
		stringOrArray = arrayCopy;
	}
	else if (CB_isString(stringReplace))
	{
		stringOrArrayFind = CB_isArray(stringOrArrayFind) ? stringOrArrayFind : [ stringOrArrayFind ];
		for (var x = 0; x < stringOrArrayFind.length; x++)
		{
			stringOrArray = (stringOrArray + "").replace(CB_regularExpressionString(stringOrArrayFind[x], true, caseInsensitive), stringReplace);
		}
	}
	return stringOrArray; //If it is neither a string nor an array, it will be returned without being modified.
}



/**
 * Returns a desired regular expression (escaping the string) using the native JavaScript's [RegExp]{@link https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/RegExp} from a given string.
 *  @function
 *  @param {string} string - The string (not a regular expression) that we want to use (special characters will be escaped).
 *  @param {boolean} [allOccurrences=false] - Defines whether we want the regular expression returned to match all occurrences of the given string or only first found.
 *  @param {boolean} [caseInsensitive=false] - Defines whether we want the regular expression returned to be case insensitive or not.
 *  @returns {RegExp} Returns the desired regular expression (escaping the string) using the native JavaScript's [RegExp]{@link https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/RegExp} from a given string.
 */
//* Source: Cory Gross @ http://stackoverflow.com/questions/1144783/replacing-all-occurrences-of-a-string-in-javascript
function CB_regularExpressionString(string, allOccurrences, caseInsensitive)
{
	var parameters = "";
	if (allOccurrences) { parameters += "g"; }
	if (caseInsensitive) { parameters += "i"; }
	return new RegExp(string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), parameters === "" ? undefined : parameters);
}


/**
 * Returns the "LZString" object (used by the [lz-string]{@link http://pieroxy.net/blog/pages/lz-string/index.html} library), if any. Useful for compressing/decompressing strings.
 *  @function
 *  @returns {Object} Returns the "LZString" object (used by the [lz-string]{@link http://pieroxy.net/blog/pages/lz-string/index.html} library) if available or null otherwise.
 */
function CB_getLZStringObject()
{
	return (typeof(LZString) === "object") ? LZString : null;
}


/**
 * Returns the "Base64String" object (used by the base64-string library included in [lz-string]{@link http://pieroxy.net/blog/pages/lz-string/index.html}), if any. Useful for compressing/decompressing base64 code.
 *  @function
 *  @returns {Object} Returns the "Base64String" object (used by the base64-string library included in [lz-string]{@link http://pieroxy.net/blog/pages/lz-string/index.html}) if available or null otherwise.
 */
function CB_getBase64StringObject()
{
	return (typeof(Base64String) === "object") ? Base64String : null;
}