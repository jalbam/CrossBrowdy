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


	//Performs a desired function for each element of a given array (changing the value of "this" if desired):
	CB_Arrays.forEach = function(array, fun, thisObject)
	{
		return CB_forEach(array, fun, thisObject, false);
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
	//Returns the size of an object given (does not need to be an array!):
	CB_Arrays.sizeOf = CB_Arrays.sizeof = CB_Arrays.count = function(object, onlyOwn)
	{
		return CB_sizeof(object, onlyOwn);
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
	
	
	/**
	 * Callback that is used as the "purgeFunction" parameter of the {@link CB_Arrays.removeDuplicated} function. It should return false when we want to keep the value or true otherwise.
	 *  @memberof CB_Arrays
	 *  @callback CB_Arrays.removeDuplicated_PURGE_FUNCTION
	 *  @param {*} value - Value which belongs to the index which is being checked in the current iteration used in {@link CB_Arrays.removeDuplicated}.
	 *  @param {integer} index - Index which is being checked in the current iteration used in {@link CB_Arrays.removeDuplicated}.
	 *  @param {array} array - Whole array which is being checked.
	 *  @returns It should return false when we want to keep the value or true otherwise.
	 */
	 
	/**
	 * Delete duplicated and/or not desired values (with a checking function to purge) from a numeric array. Values can be of any type. Internally, loops through the given array backwards (from the last index to the first one).
	 *  @function
	 *  @param {array} array - The array whose values we want to purge.
	 *  @param {CB_Arrays.removeDuplicated_PURGE_FUNCTION} [purgeFunction] - Callback that will be called for each item with the value of each item as the unique parameter. It should return false when we want to keep the value or true otherwise. If the "ignoreDuplicated" parameter is set to true, all duplicated elements will be removed regardless of the returning value of the "purgeFunction" function.
	 *  @param {boolean} [ignoreDuplicated=false] - If it is set to true, it will keep duplicated values (unless the given "purgeFunction" purge them).
	 *  @returns {array} Returns the array purged. If no valid array is given, it will return an empty array.
	 */
	CB_Arrays.removeDuplicated = function(array, purgeFunction, ignoreDuplicated)
	{
		if (!CB_isArray(array)) { return []; }
		//Removes possible duplicated values or not desired:
		var y = 0;
		var keysDuplicatedChecker = [];
		for (x = array.length - 1; x >= 0; x--)
		{
			//if (typeof(purgeFunction) === "function" && purgeFunction(array[x]) || (typeof(purgeFunction) !== "function" || !ignoreDuplicated) && CB_indexOf(keysDuplicatedChecker, array[x]) !== -1)
			if (typeof(purgeFunction) === "function" && purgeFunction(array[x], x, array) || !ignoreDuplicated && CB_indexOf(keysDuplicatedChecker, array[x]) !== -1)
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