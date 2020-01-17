/**
 * @file Management for things related with the net. Contains the {@link CB_Net} static class.
 *  @author Joan Alba Maldonado <workindalian@gmail.com>
 *  @license Creative Commons Attribution 4.0 International. See more at {@link https://crossbrowdy.com/about#what_is_the_crossbrowdy_copyright_and_license}.
 */


/**
 * Static class to manage things related to the net. It will return itself if it is tried to be instantiated.
 * @namespace CB_Net
 */
if (typeof(CB_Net) === "undefined") { var CB_Net = function() { return CB_Net; }; }
{
	CB_Net.initialized = false; //It will tells whether the object has been initialized or not.
	
	
	//Initializes all values:
	CB_Net.init = function()
	{
		if (CB_Net.initialized) { return CB_Net; }

		//The object has been initialized:
		CB_Net.initialized = true;
			
		//TODO.

		return CB_Net;
	}

	
	/**
	 * Alias for {@link CB_Net.URIValueEncode}.
	 *  @function CB_Net.URLValueEncode
	 *  @see {@link CB_Net.URIValueEncode}
	 */
	/**
	 * Encodes a given URI value. Uses the native [encodeURIComponent]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent} function internally if available or fallbacks to the native [escape]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/escape} function otherwise.
	 *  @function
	 *  @param {string|number} value - The value that we want to encode. Normally, it should be either a string or a number.
	 *  @returns {string}
	 *  @todo Think about using another thing since [escape]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/escape} maybe is not a good fallback. Probably a polyfill to simulate the [encodeURIComponent]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent} function.
	 */
	CB_Net.URIValueEncode = CB_Net.URLValueEncode = function(value)
	{
		if (typeof(encodeURIComponent) !== "undefined") { return encodeURIComponent(value); }
		else { return escape(value); } //TODO: think about using another thing since escape maybe is not a good fallback. Probably a polyfill to simulate the encodeURIComponent function.
	}


	/**
	 * Alias for {@link CB_Net.URIValueDecode}.
	 *  @function CB_Net.URLValueDecode
	 *  @see {@link CB_Net.URIValueDecode}
	 */
	/**
	 * Decodes a given URI value. Uses the native [decodeURIComponent]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent} function internally if available or fallbacks to the native [unescape]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/unescape} function otherwise.
	 *  @function
	 *  @param {string|number} value - The value that we want to decode. Normally, it should be either a string or a number.
	 *  @returns {string}
	 *  @todo Think about using another thing since [unescape]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/unescape} maybe is not a good fallback. Probably a polyfill to simulate the [decodeURIComponent]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent} function.
	 */
	CB_Net.URIValueDecode = CB_Net.URLValueDecode = function(value)
	{
		if (typeof(decodeURIComponent) !== "undefined") { return decodeURIComponent(value); }
		else { return unescape(value); } //TODO: think about using another thing since unescape maybe is not a good fallback. Probably a polyfill to simulate the decodeURIComponent function.
	}


	/**
	 * Alias for {@link CB_Net.URIEncode}.
	 *  @function CB_Net.URLEncode
	 *  @see {@link CB_Net.URIEncode}
	 */
	/**
	 * Encodes a given URI. Uses the native [encodeURI]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI} function internally if available or fallbacks to the native [escape]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/escape} function otherwise.
	 *  @function
	 *  @param {string|number} URI - The URI that we want to encode. Normally, it should be either a string or a number.
	 *  @returns {string}
	 *  @todo Think about using another thing since [escape]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/escape} maybe is not a good fallback. Probably a polyfill to simulate the [encodeURI]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI} function.
	 */
	CB_Net.URIEncode = CB_Net.URLEncode = function(URI)
	{
		if (typeof(encodeURI) !== "undefined") { return encodeURI(URI); }
		else { return escape(URI); } //TODO: think about using another thing since escape maybe is not a good fallback. Probably a polyfill to simulate the encodeURI function.
	}


	/**
	 * Alias for {@link CB_Net.URIDecode}.
	 *  @function CB_Net.URLDecode
	 *  @see {@link CB_Net.URIDecode}
	 */
	/**
	 * Encodes a given URI. Uses the native [decodeURI]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURI} function internally if available or fallbacks to the native [unescape]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/unescape} function otherwise.
	 *  @function
	 *  @param {string|number} URI - The URI that we want to decode. Normally, it should be either a string or a number.
	 *  @returns {string}
	 *  @todo Think about using another thing since [unescape]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/unescape} maybe is not a good fallback. Probably a polyfill to simulate the [decodeURI]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURI} function.
	 */
	CB_Net.URIDecode = CB_Net.URLDecode = function(URI)
	{
		if (typeof(decodeURI) !== "undefined") { return decodeURI(URI); }
		else { return unescape(URI); } //TODO: think about using another thing since unescape maybe is not a good fallback. Probably a polyfill to simulate the decodeURI function.
	}


	/**
	 * Gets all the "GET" (query) parameters (names and their values) from a given URI or from the current URL.
		<br />
		For example, if the URI provided is "http://whatever.com/index.html?parameter1=value1&amp;parameter2=value2#hash_parameter1=hash_value1&amp;hash_parameter2=hash_value2", it will return "parameter1=value1&amp;parameter2=value2" (using the default options).
	 *  @function
	 *  @param {string} [URI=[window.location]{@link https://developer.mozilla.org/en-US/docs/Web/API/Window/location}.href] - The URI that we want to work with. If not provided, it will try to use the current URL (by using [window.location]{@link https://developer.mozilla.org/en-US/docs/Web/API/Window/location}.href).
	 *  @param {array} [exclude] - A numeric array containing the name of the parameters that we want to exclude in the returned string. It will exclude them even if they are contained in the given "includeOnly" parameter (if any).
	 *  @param {array} [includeOnly] - A numeric array containing the name of the parameters that we want to include in the returned string. If provided, it will only include these ones to the returned string (unless they are included in the "exclude" parameter).
	 *  @param {boolean} [includeIfNotExists=false] - If it is set to true and an array is given as the "includeOnly" parameter, it will add the parameters in the "includeOnly" array (with empty values) in the returned string even when they did not exist in the original URI provided.
	 *  @param {boolean} [trim=true] - Defines whether we want to trim the spaces around the values or not.
	 *  @param {string} [firstDelimiter='?'] - The string that indicates where the parameters start. If it is not provided, it will be "?" as default. If not provided and "lastDelimiter" is not provided either, it will be "?" and "lastDelimiter" will be "#".
	 *  @param {string} [lastDelimiter=undefined|'#'] - The string that indicates where the parameters end. If not provided and "firstDelimiter" is provided, it will stop at the end of the given URI. If it is not provided and "firstDelimiter" is not provided either, "firstDelimiter" will be "?" and "lastDelimiter" will be "#".
	 *  @param {string} [concatenator='&'] - The string that joints the different parameters.
	 *  @param {string} [nameValueSeparator='='] - The string that is the separator for the parameters and their values.
	 *  @returns {string} An empty string will be returned if no parameters can be found.
	 */
	CB_Net.getURIParameters = function(URI, exclude, includeOnly, includeIfNotExists, trim, firstDelimiter, lastDelimiter, concatenator, nameValueSeparator)
	{
		concatenator = CB_trim(concatenator);
		if (concatenator === "") { concatenator = "&"; }
		
		nameValueSeparator = CB_trim(nameValueSeparator);
		if (nameValueSeparator === "") { nameValueSeparator = "="; }

		firstDelimiter = CB_trim(firstDelimiter);
		lastDelimiter = CB_trim(lastDelimiter);
		if (firstDelimiter === "")
		{
			firstDelimiter = "?";
			if (lastDelimiter === "") { lastDelimiter = "#"; }
		}
		
		URI = CB_trim(URI);
		if (URI === "") { URI = window.location.href; }
		if (URI.indexOf(firstDelimiter) !== -1) { URI = URI.substring(URI.indexOf(firstDelimiter) + firstDelimiter.length); }
		else { return ""; }
		if (lastDelimiter !== "" && URI.indexOf(lastDelimiter) !== -1) { URI = URI.substring(0, URI.indexOf(lastDelimiter)); }
		URI = CB_trim(URI);

		var filteredURI = URI;
		
		
		if (typeof(trim) === "undefined" || trim === null) { trim = true; }
		

		//If set, only includes the desired ones:
		if (CB_isArray(includeOnly) && includeOnly.length > 0)
		{
			filteredURI = "";
			URI = firstDelimiter + URI;
			for (var x = 0, includeOnlyLength = includeOnly.length; x < includeOnlyLength; x++)
			{
				if (includeIfNotExists || URI.toUpperCase().indexOf(includeOnly[x].toUpperCase() + nameValueSeparator) !== -1)
				{
					filteredURI += includeOnly[x] + nameValueSeparator + CB_Net.getParameter(includeOnly[x], trim, URI, firstDelimiter, lastDelimiter, concatenator, nameValueSeparator) + concatenator;
				}
			}
			filteredURI = CB_rtrim(filteredURI, [concatenator]);
		}
		
		//If set, excludes the desired ones and/or trims values if desired:
		var excludePending = false;
		if (CB_isArray(exclude) && exclude.length > 0)
		{
			excludePending = true;
		}
		if (trim || excludePending)
		{
			var parametersArray = filteredURI.split(concatenator);
			var parameterArray;
			filteredURI = "";
			for (x = 0, parametersArrayLength = parametersArray.length; x < parametersArrayLength; x++)
			{
				parameterArray = parametersArray[x].split(nameValueSeparator);
				if (trim || excludePending && CB_indexOf(exclude, parameterArray[0]) === -1)
				{
					if (typeof(parameterArray[1]) !== "undefined" && parameterArray[1] !== null)
					{
						filteredURI += parameterArray[0] + nameValueSeparator + (trim ? CB_trim(parameterArray[1]) : parameterArray[1]) + concatenator;
					}
					else
					{
						filteredURI += parameterArray[0] + concatenator;
					}
				}
			}
			filteredURI = CB_rtrim(filteredURI, [concatenator]);
		}
		
		filteredURI = CB_trim(filteredURI, [concatenator]);
		
		
		return filteredURI;
	}
	

	/**
	 * Gets all the hash parameters (names and their values) from a given URI or from the current URL.
		<br />
		For example, if the URI provided is "http://whatever.com/index.html?parameter1=value1&amp;parameter2=value2#hash_parameter1=hash_value1&amp;hash_parameter2=hash_value2", it will return
		"hash_parameter1=hash_value1&amp;hash_parameter2=hash_value2" (using the default options).
	 *  @function
	 *  @param {string} [URI=[window.location]{@link https://developer.mozilla.org/en-US/docs/Web/API/Window/location}.href] - The URI that we want to work with. If not provided, it will try to use the current URL (by using [window.location]{@link https://developer.mozilla.org/en-US/docs/Web/API/Window/location}.href).
	 *  @param {array} [exclude] - A numeric array containing the name of the parameters that we want to exclude in the returned string. It will exclude them even if they are contained in the given "includeOnly" parameter (if any).
	 *  @param {array} [includeOnly] - A numeric array containing the name of the parameters that we want to include in the returned string. If provided, it will only include these ones to the returned string (unless they are included in the "exclude" parameter).
	 *  @param {boolean} [includeIfNotExists=false] - If it is set to true and an array is given as the "includeOnly" parameter, it will add the parameters in the "includeOnly" array (with empty values) in the returned string even when they did not exist in the original URI provided.
	 *  @param {boolean} [trim=true] - It will use this option when it calls the {@link CB_Net.getURIParameters} function internally.
	 *  @returns {string} An empty string will be returned if no parameters can be found.
	 */
	CB_Net.getHashParameters = function(URI, exclude, includeOnly, includeIfNotExists, trim)
	{
		return CB_Net.getURIParameters(URI, exclude, includeOnly, includeIfNotExists, trim, "#");
	}


	/**
	 * Gets the value of a specific URI parameter (query or hash), respecting GET/URL rules by default, from the current URL or a desired one (with the given delimiters).
		<br />
		For example, if the URI provided is "http://whatever.com/index.html?parameter1=value1&amp;parameter2=value2#hash_parameter1=hash_value1&amp;hash_parameter2=hash_value2" and the index given is "parameter1", it will return "value1" (using the default options).
	 *  @function
	 *  @param {string} index - The name of the parameter whose value we want to get.
	 *  @param {boolean} [trim=true] - It will trim the value (using {@link CB_trim} internally) before returning it.
	 *  @param {string} [URI=[window.location]{@link https://developer.mozilla.org/en-US/docs/Web/API/Window/location}.href] - The URI that we want to work with. If not provided, it will try to use the current URL (by using [window.location]{@link https://developer.mozilla.org/en-US/docs/Web/API/Window/location}.href).
	 *  @param {string} [firstDelimiter='?'] - The string that indicates where the parameters start. If it is not provided, it will be "?" as default. If not provided and "lastDelimiter" is not provided either, it will be "?" and "lastDelimiter" will be "#".
	 *  @param {string} [lastDelimiter=undefined|'#'] - The string that indicates where the parameters end. If not provided and "firstDelimiter" is provided, it will stop at the end of the given URI. If it is not provided and "firstDelimiter" is not provided either, "firstDelimiter" will be "?" and "lastDelimiter" will be "#".
	 *  @param {string} [concatenator='&'] - The string that joints the different parameters.
	 *  @param {string} [nameValueSeparator='='] - The string that is the separator for the parameters and their values.
	 *  @returns {string} An empty string will be returned if the value of the given parameter cannot be found.
	 */
	CB_Net.getParameter = function(index, trim, URI, firstDelimiter, lastDelimiter, concatenator, nameValueSeparator)
	{
		if (typeof(trim) === "undefined" || trim === null) { trim = true; }
		
		index = CB_trim(index).toUpperCase();
		if (index === "") { return ""; }
		
		concatenator = CB_trim(concatenator);
		if (concatenator === "") { concatenator = "&"; }

		nameValueSeparator = CB_trim(nameValueSeparator);
		if (nameValueSeparator === "") { nameValueSeparator = "="; }
		
		firstDelimiter = CB_trim(firstDelimiter);
		lastDelimiter = CB_trim(lastDelimiter);
		if (firstDelimiter === "")
		{
			firstDelimiter = "?";
			if (lastDelimiter === "") { lastDelimiter = "#"; }
		}
		
		URI = CB_trim(URI);
		if (URI === "") { URI = window.location.href; }
		if (URI.indexOf(firstDelimiter) !== -1) { URI = URI.substring(URI.indexOf(firstDelimiter) + firstDelimiter.length); }
		else { return ""; }
		if (lastDelimiter !== "" && URI.indexOf(lastDelimiter) !== -1) { URI = URI.substring(0, URI.indexOf(lastDelimiter)); }
		URI = CB_trim(URI);
		if (URI === "") { return ""; }
		
		var value = "";
		var URIUpperCase = URI.toUpperCase();
		var indexOfFound = URIUpperCase.indexOf(index + nameValueSeparator);
		if (indexOfFound !== -1)
		{
			URI = URI.substring(indexOfFound + index.length + nameValueSeparator.length);
			if (URI.indexOf(concatenator) !== -1)
			{
				URI = URI.substring(0, URI.indexOf(concatenator));
			}
			value = URI;
		}
		
		if (trim) { value = CB_trim(value); }
		
		return CB_Net.URIValueDecode(value);
	}


	/**
	 * Gets the value of a specific URI "GET" parameter (query) from the current URL or a desired URI.
		<br />
		For example, if the URI provided is "http://whatever.com/index.html?parameter1=value1&amp;parameter2=value2#hash_parameter1=hash_value1&amp;hash_parameter2=hash_value2" and the index given is "parameter1", it will return "value1" (using the default options).
	 *  @function
	 *  @param {string} index - The name of the parameter whose value we want to get.
	 *  @param {boolean} [trim=true] - It will trim the value (using {@link CB_Net.getParameter} internally) before returning it.
	 *  @param {string} [URI=[window.location]{@link https://developer.mozilla.org/en-US/docs/Web/API/Window/location}.href] - The URI that we want to work with. If not provided, it will try to use the current URL (by using [window.location]{@link https://developer.mozilla.org/en-US/docs/Web/API/Window/location}.href).
	 *  @returns {string} An empty string will be returned if the value of the given parameter cannot be found.
	 */
	CB_Net.getURIValue = function(index, trim, URI)
	{
		return CB_Net.getParameter(index, trim, URI, "?", "#");
	}


	/**
	 * Gets the value of a specific hash (string after "#") parameter from the current URL or a desired URI.
		<br />
		For example, if the URI provided is "http://whatever.com/index.html?parameter1=value1&amp;parameter2=value2#hash_parameter1=hash_value1&amp;hash_parameter2=hash_value2" and the index given is "hash_parameter1",
		it will return "hash_value1" (using the default options).
	 *  @function
	 *  @param {string} index - The name of the parameter whose value we want to get.
	 *  @param {boolean} [trim=true] - It will trim the value (using {@link CB_Net.getParameter} internally) before returning it.
	 *  @param {string} [URI=[window.location]{@link https://developer.mozilla.org/en-US/docs/Web/API/Window/location}.href] - The URI that we want to work with. If not provided, it will try to use the current URL (by using [window.location]{@link https://developer.mozilla.org/en-US/docs/Web/API/Window/location}.href).
	 *  @returns {string} An empty string will be returned if the value of the given parameter cannot be found.
	 */
	CB_Net.getHashValue = function(index, trim, URI)
	{
		return CB_Net.getParameter(index, trim, URI, "#");
	}
	

	/**
	 * Alias for {@link CB_Net.combineURIParameters}.
	 *  @function CB_Net.combineURLParameters
	 *  @see {@link CB_Net.combineURIParameters}
	 */	
	/**
	 * Alias for {@link CB_combineURIParameters}.
	 *  @function CB_Net.combineURIParameters
	 *  @see {@link CB_combineURIParameters}
	 */	
	CB_Net.combineURIParameters = CB_Net.combineURLParameters = function(parametersA, parametersB)
	{
		return CB_combineURIParameters(parametersA, parametersB);
	};
}