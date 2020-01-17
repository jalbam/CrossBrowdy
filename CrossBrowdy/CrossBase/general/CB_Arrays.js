/**
 * @file Arrays management. Contains the {@link CB_Arrays} static class.
 *  @author Joan Alba Maldonado <workindalian@gmail.com>
 */
 

/**
 * Static class to manage arrays. It will return itself if it is tried to be instantiated.
 * @namespace
 * @borrows CB_lastIndexOf as lastIndexOf
 * @borrows CB_indexOf as indexOf
 * @borrows CB_forEach as forEach
 * @borrows CB_isArray as isArray
 * @borrows CB_sizeOf as sizeOf
 * @borrows CB_replaceAll as replaceAll
 * @borrows CB_trim as trim
 * @borrows CB_rtrim as rtrim
 * @borrows CB_ltrim as ltrim
 * @borrows CB_combineArraysOrObjects as combine
 */
var CB_Arrays = function() { return CB_Arrays; };
{
	CB_Arrays.initialized = false; //It will tells whether the object has been initialized or not.
	

	//Initializes all values:
	CB_Arrays.init = function()
	{
		if (CB_Arrays.initialized) { return CB_Arrays; }
			
		//The object has been initialized:
		CB_Arrays.initialized = true;
		
		//TODO.
		
		return CB_Arrays;
	}

	
	CB_Arrays.lastIndexOf = function(array, searchElement, fromIndex)
	{
		return CB_lastIndexOf(array, searchElement, fromIndex, false);
	}


	//Returns the first index of a given element in an array (starting from an index if desired):
	CB_Arrays.indexOf = function(array, searchElement, fromIndex)
	{
		return CB_indexOf(array, searchElement, fromIndex, false);
	}


	//Tells whether an variable given is an array or not:
	CB_Arrays.isArray = function(variable)
	{
		return CB_isArray(variable, false);
	}
	

	/**
	 * Alias for {@link CB_Arrays.sizeOf}.
	 *  @function CB_Arrays.sizeof
	 *  @see {@link CB_Arrays.sizeOf}
	 */
	/**
	 * Alias for {@link CB_Arrays.sizeOf}.
	 *  @function CB_Arrays.count
	 *  @see {@link CB_Arrays.sizeOf}
	 */
	//Returns the size of an object given (does not need to be an array!):
	CB_Arrays.sizeOf = CB_Arrays.sizeof = CB_Arrays.count = function(object, onlyOwn)
	{
		return CB_sizeof(object, onlyOwn);
	}
	

	//Returns the given array of strings with the desired occurrences replaced. Calls itself recursively and calls the CB_replaceAll function internally.
	CB_Arrays.replaceAll = function(stringOrArray, stringOrArrayFind, stringReplace, caseInsensitive) //Either "stringOrArray" or "stringOrArrayFind" can also be an array of arrays of strings (as many levels as you wish).
	{
		return CB_replaceAll(stringOrArray, stringOrArrayFind, stringReplace, caseInsensitive);
	}

	
	//Trims all the strings that contains a given array (undesired strings can be set or otherwise will be spaces, etc.):
	CB_Arrays.trim = function(array, undesiredStrings)
	{
		return CB_trim(array, undesiredStrings);
	}
	
	
	//Trims all the strings from the right side that contains a given array (undesired strings can be set or otherwise will be spaces, etc.):
	CB_Arrays.rtrim = function(array, undesiredStrings)
	{
		return CB_rtrim(array, undesiredStrings);
	}
	
	
	//Trims all the strings from the left side that contains a given array (undesired strings can be set or otherwise will be spaces, etc.):
	CB_Arrays.ltrim = function(array, undesiredStrings)
	{
		return CB_ltrim(array, undesiredStrings);
	}

	
	//Returns a combined array or object from two arrays or objects:
	CB_Arrays.combine = function(arrayOrObjectA, arrayOrObjectB, avoidDuplicatedValuesInArray)
	{
		return CB_combineArraysOrObjects(arrayOrObjectA, arrayOrObjectB, avoidDuplicatedValuesInArray);
	}


	//Performs a desired function for each element of a given array (changing the value of "this" if desired):
	CB_Arrays.forEach = function(array, fun, thisObject)
	{
		return CB_forEach(array, fun, thisObject, false);
	}
	
	
	/**
	 * Callback that is used for each iteration when looping the array. Being "this" the value itself.
	 *  @memberof CB_Arrays
	 *  @callback CB_Arrays.executeFunctionAll_ON_LOOP_CALLBACK
	 *  @param {*} item - Element (item) which belongs to the index which is being checked in the current iteration of the given array.
	 *  @param {integer} index - Index which is being checked in the current iteration.
	 *  @param {array} array - Whole array which is being looped.
	 *  @param {integer} delay - The "delayBetweenEach" used for this loop.
	 *  @returns {number} When used as a function to calculate the delay, it should return the delay desired as a number.
	 */
	/**
	 * Callback that is used when finishes all iterations after looping the array. Being "this" the array itself.
	 *  @memberof CB_Arrays
	 *  @callback CB_Arrays.executeFunctionAll_ON_FINISH_CALLBACK
	 *  @param {array} array - Whole array which was being looped.
	 *  @param {integer} itemsAffected - The number of times that the "functionEach" callback was called (the most likely, matches the number of elements unless they are undefined or null).
	 *  @param {integer} delayMaximum - The maximum "delay" used.
	 */
	/**
	 * Object used by the {@link CB_Arrays#executeFunctionAll} method when the "returnSetTimeoutsArray" parameter is set to true.
	 *  @memberof CB_Arrays
	 *  @typedef {Object} CB_Arrays.executeFunctionAll_OBJECT
	 *  @property {*} item - The element affected.
	 *  @property {integer} setTimeoutReturningValue - The returning value of calling the [setTimeout]{@link https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout} internally or null if it was not called, depending on the "delayBetweenEach" parameter.
	 *  @property {number} setTimeoutDelay - The value used as the second parameter when calling the [setTimeout]{@link https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout} internally or zero if it was not called, depending on the "delayBetweenEach" parameter.
	 */
	 
	/**
	 * Alias for {@link CB_Arrays#executeFunctionAll}.
	 *  @function CB_Arrays#executeAll
	 *  @see {@link CB_Arrays#executeFunctionAll}
	 */	
	 /**
	 * Alias for {@link CB_Arrays#executeFunctionAll}.
	 *  @function CB_Arrays#forEachDelay
	 *  @see {@link CB_Arrays#executeFunctionAll}
	 */	
	 /**
	 * Performs a desired action, using the provided function, on all the existing elements of a given array. Elements which are undefined or null will be skipped without calling the "functionEach" function.
	 *  @function
	 *  @param {array} array - A numeric array containing the elements that we want to loop.
	 *  @param {CB_Arrays.executeFunctionAll_ON_LOOP_CALLBACK} functionEach - Function that will be called for each element of the given array. As the first parameter it receives the element of the "array" provided being looped, as the second parameter the position of this element in the "array" provided, the third parameter is the array being looped and the fourth parameter will be the "delayBetweenEach" being used, being "this" the element itself.
	 *  @param {number|CB_Arrays.executeFunctionAll_ON_LOOP_CALLBACK} [delayBetweenEach=0] - If a value greater than zero is used, it will be used as the delay desired between each call to the "functionEach" function (calling them using the [setTimeout]{@link https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout} function internally). If not provided or the value is 0 (zero) or lower, each call to the "functionEach" function will be performed immediately one after the other. If a function is provided, it will be called with the same parameters as the "functionEach" function and its returning value will be used as the delay (executed every loop for each item).
	 *  @param {boolean} [returnSetTimeoutsArray=false] - Defines whether we want the method to return an integer or a numeric array with information of each [setTimeout]{@link https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout} call. Returning an array with information of each [setTimeout]{@link https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout} call is only useful when the [setTimeout]{@link https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout} function is called internally, which happens when the "delayBetweenEach" parameter is greater than 0 (zero).
	 *  @param {boolean} [delayBetweenEachAffectsFirst=false] - If set to true, the desired delay (if any) will also affect the first call to the "functionEach" function.
	 *  @param {CB_Arrays.executeFunctionAll_ON_FINISH_CALLBACK} [functionFinish] - Function that will be called for when it has finished looping all the items. The first parameter will be the array which was looped, the second parameter will be the number of times that the "functionEach" callback was called (the most likely, matches the number of elements unless they are undefined or null), and the third parameter will be the maximum "delay" used, being "this" the array itself.
	 *  @returns {integer|array} If the "returnSetTimeoutsArray" parameter is set to false, it will return the number of calls to the "functionEach" function that were performed (which should be the same number as the elements given in the "array" parameter). Otherwise, if the "returnSetTimeoutsArray" is set to true, it will return a numeric array with a {@link CB_Arrays.executeFunctionAll_OBJECT} object for each element given. The length of this array will also be the number of calls to the "functionEach" function that were performed. Note that if a value greater than 0 (zero) for the "delayBetweenEach" parameter has been provided, perhaps not all calls of the "functionEach" function will have been performed yet when exiting this method because of the asynchronous nature of the [setTimeout]{@link https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout} function.
	 */
	CB_Arrays.executeFunctionAll = CB_Arrays.executeAll = CB_Arrays.forEachDelay = function(array, functionEach, delayBetweenEach, returnSetTimeoutsArray, delayBetweenEachAffectsFirst, functionFinish)
	{
		if (typeof(functionEach) !== "function" || !CB_isArray(array))
		{
			if (typeof(functionFinish) === "function") { functionFinish.call(array, array, 0, 0); }
			return returnSetTimeoutsArray ? [] : 0;
		}
		if (typeof(delayBetweenEach) !== "function" && (typeof(delayBetweenEach) === "undefined" || delayBetweenEach === null || isNaN(delayBetweenEach) || delayBetweenEach < 0))
		{
			delayBetweenEach = 0;
		}
		
		var setTimeoutsInformation = [];
		
		var arrayLength = array.length;
		var y = 0;
		var setTimeoutReturningValue = null;
		var setTimeoutDelay = 0;
		var delay;
		var setTimeoutDelayMax = 0;
		for (var x = 0; x < arrayLength; x++)
		{
			//If the object exists:
			if (typeof(array[x]) !== "undefined" && array[x] !== null)
			{
				delay = typeof(delayBetweenEach) === "function" ? delayBetweenEach() : delayBetweenEach;
				delay = parseInt(delay) || 0;
				//Executes the given function ("this" parameters will point to the current object):
				if (delay === 0)
				{
					functionEach.call(array[x], array[x], x, array, delay); //"x" is the position of the object in the array.
				}
				else
				{
					new function(x, delay) //Closure to get unique value of "x" variable for each loop.
					{
						setTimeoutDelay = delayBetweenEachAffectsFirst ? delay * (y + 1) : delay * y;
						setTimeoutReturningValue = setTimeout
						(
							function()
							{
								functionEach.call(array[x], array[x], x, array, delay); //"x" is the position of the object in the array.
							},
							setTimeoutDelay
						);
						setTimeoutDelayMax = setTimeoutDelay > setTimeoutDelayMax ? setTimeoutDelay : setTimeoutDelayMax;
					}(x, delay);
				}
				setTimeoutsInformation[setTimeoutsInformation.length] = { "item" : array[x], "setTimeoutReturningValue" : setTimeoutReturningValue, "setTimeoutDelay" : setTimeoutDelay };
				y++;
			}
		}
		
		if (typeof(functionFinish) === "function")
		{
			if (setTimeoutDelayMax === 0) { functionFinish.call(array, array, y, setTimeoutDelayMax); }
			else { setTimeout(function() { functionFinish.call(array, array, y, setTimeoutDelayMax); }, setTimeoutDelayMax + 1); }
		}
		
		if (returnSetTimeoutsArray) { return setTimeoutsInformation; }
		else { return y; }
	}


	/**
	 * Returns an array copied from the given one. It will also make a copy of the arrays found in the values (if any), calling itself recursively.
	 *  @function
	 *  @param {array} array - The array whose values we want to copy.
	 *  @returns {object} Returns an array copied from the given one. Returns an empty array if the given "array" was not an array.
	 */
	CB_Arrays.copy = function(array)
	{
		if (!CB_isArray(array)) { return []; }
		//Removes possible duplicated values or not desired:
		var newArray = [];
		for (var x = array.length - 1; x >= 0; x--)
		{
			newArray[x] = CB_isArray(array[x]) ? CB_Arrays.copy(array[x]) : array[x];
		}
		return newArray;
	}
	
	
	/**
	 * Alias for {@link CB_Arrays.insertElement}.
	 *  @function CB_Arrays.insert
	 *  @see {@link CB_Arrays.insertElement}
	 */
	/**
	 * Alias for {@link CB_Arrays.insertElement}.
	 *  @function CB_Arrays.insertElementByPosition
	 *  @see {@link CB_Arrays.insertElement}
	 */
	/**
	 * Inserts an element in the desired position of a given an array. Elements which are placed after it will be moved a position to the right (increasing their index).
	 *  @function
	 *  @param {array} array - The array whose element we want to delete.
	 *  @param {integer} [index=0] - Position of the element in the given array that we want to remove.
	 *  @param {*} item - Element (item) which belongs to the index which is being checked in the current iteration of the given array.
	 *  @param {CB_Arrays.removeDuplicated_PURGE_FUNCTION} [onInsert] - Function to call if the element is inserted, after inserting it.
	 *  @returns {array} Returns the new array (with the element inserted if it was possible). If no valid array is given, it will return an empty array.
	 */
	CB_Arrays.insertElement = CB_Arrays.insertElementByPosition = CB_Arrays.insert = function(array, index, element, onInsert)
	{
		index = parseInt(index);
		index = isNaN(index) ? 0 : index;
		if (!CB_isArray(array)) { return []; }
		if (index < 0) { index *= -1; } //It must be a positive integer.
		if (index > array.length) { index = array.length; }
		array.splice(index, 0, element);
		if (typeof(onInsert) === "function") { onInsert.call(element, element, index, array); }
		return array;
	}

	
	/**
	 * Callback that is used as the "purgeFunction" parameter of the {@link CB_Arrays.removeDuplicated} function. Being "this" the current element (item). It should return false when we want to keep the value or true otherwise.
	 *  @memberof CB_Arrays
	 *  @callback CB_Arrays.removeDuplicated_PURGE_FUNCTION
	 *  @param {*} item - Element (item) which belongs to the index which is being checked in the current iteration used in {@link CB_Arrays.removeDuplicated}.
	 *  @param {integer} index - Index which is being checked in the current iteration used in {@link CB_Arrays.removeDuplicated}.
	 *  @param {array} array - Whole array which is being checked.
	 *  @returns {boolean} It should return false when we want to keep the value or true otherwise.
	 */
	 
	/**
	 * Deletes duplicated and/or not desired values (with a checking function to purge) from a numeric array. Values can be of any type. Internally, loops through the given array backwards (from the last index to the first one).
	 *  @function
	 *  @param {array} array - The array whose values we want to purge.
	 *  @param {CB_Arrays.removeDuplicated_PURGE_FUNCTION} [purgeFunction] - Callback that will be called for each item, being "this" the current item. It should return false when we want to keep the value or true otherwise. If the "ignoreDuplicated" parameter is set to true, all duplicated elements will be removed regardless of the returning value of the "purgeFunction" function.
	 *  @param {boolean} [ignoreDuplicated=false] - If it is set to true, it will keep duplicated values (unless the given "purgeFunction" purge them).
	 *  @returns {array} Returns the array purged. If no valid array is given, it will return an empty array.
	 */
	CB_Arrays.removeDuplicated = function(array, purgeFunction, ignoreDuplicated)
	{
		if (!CB_isArray(array)) { return []; }
		//Removes possible duplicated values or not desired:
		var keysDuplicatedChecker = [];
		for (var x = array.length - 1; x >= 0; x--)
		{
			//if (typeof(purgeFunction) === "function" && purgeFunction(array[x]) || (typeof(purgeFunction) !== "function" || !ignoreDuplicated) && CB_indexOf(keysDuplicatedChecker, array[x]) !== -1)
			if (typeof(purgeFunction) === "function" && purgeFunction.call(array[x], array[x], x, array) || !ignoreDuplicated && CB_indexOf(keysDuplicatedChecker, array[x]) !== -1)
			{
				array[x] = undefined;
				array.splice(x, 1);
				continue;
			}
			keysDuplicatedChecker[keysDuplicatedChecker.length] = array[x];
		}
		return array;
	}


	/**
	 * Alias for {@link CB_Arrays.removeElementByPosition}.
	 *  @function CB_Arrays.removeElementByIndex
	 *  @see {@link CB_Arrays.removeElementByPosition}
	 */
	/**
	 * Deletes an element from an array which is placed in the desired position. Elements which were after it will be moved a position to the left (decreasing their index).
	 *  @function
	 *  @param {array} array - The array whose element we want to delete.
	 *  @param {integer} [index=0] - Position of the element in the given array that we want to remove.
	 *  @param {CB_Arrays.removeDuplicated_PURGE_FUNCTION} [onRemove] - Function to call if the element is removed, before removing it.
	 *  @returns {array} Returns the new array (with the element removed if it was possible). If no valid array is given, it will return an empty array.
	 */
	CB_Arrays.removeElementByPosition = CB_Arrays.removeElementByIndex = function(array, index, onRemove)
	{
		index = parseInt(index);
		index = isNaN(index) ? 0 : index;
		if (index < 0) { index *= -1; } //It must be a positive integer.
		return CB_Arrays.removeDuplicated(array, function(value, position, array) { if (position === index) { if (typeof(onRemove) === "function") { onRemove.call(value, value, position, array); } return true; } return false; }, true);
	}


	/**
	 * Deletes a given element from an array. All occurrences will be deleted. Elements which were after a removed element will be moved a position to the left (decreasing their index).
	 *  @function
	 *  @param {array} array - The array whose element we want to delete.
	 *  @param {*} [element=undefined] - The element we want to remove. All occurrences will be deleted. Note that it is type sensitive.
	 *  @param {CB_Arrays.removeDuplicated_PURGE_FUNCTION} [onRemove] - Function to call if the element is removed, before removing it.
	 *  @returns {array} Returns the new array (with the element removed if it was possible). If no valid array is given, it will return an empty array.
	 */
	CB_Arrays.removeElement = function(array, element)
	{
		return CB_Arrays.removeDuplicated(array, function(value, position, array) { if (value === element) { if (typeof(onRemove) === "function") { onRemove.call(value, value, position, array); } return true; } return false; }, true);
	}


	/**
	 * Deletes the given elements from an array. All occurrences will be deleted. Elements which were after a removed element will be moved a position to the left (decreasing their index).
	 *  @function
	 *  @param {array} array - The array whose element we want to delete.
	 *  @param {array} elements - An array with the elements we want to remove. All occurrences will be deleted. Note that it is type sensitive.
	 *  @returns {array} Returns the new array (with the element removed if it was possible). If no valid array is given, it will return an empty array.
	 */
	CB_Arrays.removeElements = function(array, elements)
	{
		if (!CB_isArray(elements)) { elements = []; }
		return CB_Arrays.removeDuplicated(array, function(value, position, array) { return CB_Arrays.lastIndexOf(elements, value, position) !== -1; }, true);
	}


	
	/**
	 * Sorts the values of an array (using the native [Array.sort]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort} method).
	 *  @function
	 *  @param {array} array - The array whose elements we want to sort.
	 *  @param {boolean} [reversed=false] - Defines whether to sort in the reverse order or not. Only applies when comparingFunction is not provided.
	 *  @param {function} [comparingFunction] - Comparing function with the same rules as the native [Array.sort]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort} method. If provided, the "reversed" parameter will be ignored.
	 *  @returns {array} Returns the array ordered. If another value which is not an array is given, it will be returned again.
	 */
	CB_Arrays.sort = function(array, reversed, comparingFunction)
	{
		if (typeof(array) === "undefined" || array === null || !CB_Arrays.isArray(array)) { return array; }
		if (typeof(comparingFunction) !== "function")
		{
			if (reversed) { comparingFunction = function(a, b) { return b-a; }; }
			else { comparingFunction = function(a, b) { return a-b; }; }
		}
		return array.sort(comparingFunction);
	}

	
	/**
	 * Sorts an array using the [bubble sort (sinking sort) method]{@link https://en.wikipedia.org/wiki/Bubble_sort}. Internally, it uses the ">" operator for comparing values as they will be treated as numbers.
	 *  @function
	 *  @param {array} array - The array whose elements we want to sort.
	 *  @param {boolean} [reversed=false] - Defines whether to sort in the reverse order or not.
	 *  @todo Think about accepting a comparing function (as the "sort" method).
	 *  @returns {array} Returns the array ordered. If another value which is not an array is given, it will be returned again.
	 */
	CB_Arrays.bsort = function(array, reversed, comparingFunction) //NOTE: think about accepting a comparing function.
	{
		if (typeof(array) === "undefined" || array === null || !CB_Arrays.isArray(array)) { return array; }
		var arrayLength = array.length;
		for (var x = 1; x < arrayLength; x++)
		{
			for (var y = 0; y < arrayLength-x; y++)
			{
				if (!reversed && array[y] > array[y+1] || reversed && array[y] < array[y+1])
				{
					var aux = array[y];
					array[y] = array[y+1];
					array[y+1] = aux;
				}
			}
		}
		return array;
	}

	
	//Sorts an array using merge sort method:
	CB_Arrays.msort = function(array, reversed, comparingFunction) //NOTE: think about accepting a comparing function.
	{
		if (typeof(array) === "undefined" || array === null || !CB_Arrays.isArray(array)) { return array; }
		
		//TODO.
		
		array = CB_Arrays.sort(array, reversed, comparingFunction); //DELETE THIS!
		
		return array;
	}

	
	//Sorts an array using quick sort method:
	CB_Arrays.qsort = function(array, reversed, comparingFunction) //NOTE: think about accepting a comparing function.
	{
		if (typeof(array) === "undefined" || array === null || !CB_Arrays.isArray(array)) { return array; }
		
		//TODO.
		
		array = CB_Arrays.sort(array, reversed, comparingFunction); //DELETE THIS!
		
		return array;
	}

	
	//Sorts an array using selection sort method:
	CB_Arrays.ssort = function(array, reversed, comparingFunction) //NOTE: think about accepting a comparing function.
	{
		if (typeof(array) === "undefined" || array === null || !CB_Arrays.isArray(array)) { return array; }
		
		//TODO.
		
		array = CB_Arrays.sort(array, reversed, comparingFunction); //DELETE THIS!
		
		return array;
	}


	//Sorts an array using insertion sort method:
	CB_Arrays.isort = function(array, reversed, comparingFunction) //NOTE: think about accepting a comparing function.
	{
		if (typeof(array) === "undefined" || array === null || !CB_Arrays.isArray(array)) { return array; }
		
		//TODO.
		
		array = CB_Arrays.sort(array, reversed, comparingFunction); //DELETE THIS!
		
		return array;
	}
	
	
	//Sorts an array using cocktail sort (bidirectional bubble) method:
	CB_Arrays.csort = function(array, reversed, comparingFunction) //NOTE: think about accepting a comparing function.
	{
		if (typeof(array) === "undefined" || array === null || !CB_Arrays.isArray(array)) { return array; }
		
		//TODO.
		
		array = CB_Arrays.sort(array, reversed, comparingFunction); //DELETE THIS!
		
		return array;
	}

	
}