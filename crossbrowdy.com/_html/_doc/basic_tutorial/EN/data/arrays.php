<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	Here is an example of arrays management:
</p>
<pre><code class="language-javascript">
	//Defines an array:
	var fruitsArray = [ "watermelon", "lemon", "strawberry", "durian", "mango" ];
	
	//Checks whether a given element is an array or not:
	if (CB_isArray(fruitsArray)) //Equivalent to 'CB_Arrays.isArray'.
	{
		CB_console("It is an array!");
	}
	else { CB_console("It is not an array!"); }
	
	//Checking the number of elements (length) of an array (equivalent to 'fruitsArray.length', 'CB_Arrays.sizeof', 'CB_sizeOf' and 'CB_sizeof'):
	var elementLength = CB_Arrays.sizeOf(fruitsArray); //Returns 5.
	
	//Getting the first position (index number) of an element inside an array (equivalent to 'CB_indexOf'):
	var elementPosition = CB_Arrays.indexOf(fruitsArray, "durian"); //Starts from the beginning. Returns 3.
	var elementPosition = CB_Arrays.indexOf(fruitsArray, "durian", 4); //Starts from position (index) 4, ignoring previous values. Returns -1 (not found).

	//Getting the last position (index number) of an element inside an array (equivalent to 'CB_lastIndexOf'):
	var elementPosition = CB_Arrays.lastIndexOf(fruitsArray, "durian"); //Starts from the beginning. Returns 3.
	var elementPosition = CB_Arrays.lastIndexOf(fruitsArray, "durian", 2); //Starts from position (index) 2, ignoring next values. Returns -1 (not found).
	
	//Executes a function for each item in the array (equivalent to 'CB_forEach'):
	CB_Arrays.forEach(fruitsArray, function(element, index, array) { CB_console(element + " in index #" + index); CB_console(array); });
	CB_Arrays.forEach(fruitsArray, function(element, index, array) { CB_console(element + " in index #" + index); CB_console(array); CB_console(this); }, window); //Overriding "this" to use 'window'.

	//Another way to perform an action (execute a function) for each element (being able to introduce a delay between each call):
	CB_Arrays.forEachDelay
	(
		fruitsArray, //array.
		function(element, index, array, delay) //functionEach. Being "this" the element itself.
		{
			CB_console(element + " in index #" + index);
			CB_console(array);
		},
		1000, //delayBetweenEach. Optional. Default: 0. Can be either a positive number or a function returning a positive number.
		true, //returnSetTimeoutsArray. Optional. Default: false.
		false, //delayBetweenEachAffectsFirst. Optional. Default: false.
		function(array, totalItemsLooped, delayMaximum) { CB_console("All iterations finished!"); } //functionFinish. Optional.
	);

	//Creates an array identical from an original one:
	var arrayCopy = CB_Arrays.copy([1, 2, 3]); //Returns another array with the same elements (copies it).

	//Replaces all the given occurrence from array of strings (with as many levels as we wish):
	var arrayOfStrings = [ "Level0", ["Level1", ["LEVEL2", "Level2Again"], "Level1Again"], "Level0Again" ];
	var myArrayReplaced = CB_replaceAll(arrayOfStrings, "e", "A"); //Replaces all occurrences of "e" by "A". Returns: [ "LAvAl0", ["LAvAl1", ["LEVEL2", "LAvAl2Again"], "LAvAl1Again"], "LAvAl0Again" ].
	var myArrayReplaced_2 = CB_replaceAll(arrayOfStrings, "e", "A", true); //Replaces all occurrences of "e" by "A", case insensitive. Returns: [ "LAvAl0", ["LAvAl1", ["LAVAL2", "LAvAl2Again"], "LAvAl1Again"], "LAvAl0Again" ].
	var myArrayReplaced_3 = CB_replaceAll(arrayOfStrings, ["e", "v", "i"], "A"); //Replaces all occurrences of "e", "v" and "h" by "A". Returns: [ "LAAAl0", ["LAAAl1", ["LEVEL2", "LAAAl2AgaAn"], "LAAAl1AgaAn"], "LAAAl0AgaAn" ].
	var myArrayReplaced_4 = CB_replaceAll(arrayOfStrings, ["e", "v", "i"], "A", true); //Replaces all occurrences of "e", "v" and "h" by "A", case insensitive. Returns: [ "LAAAl0", ["LAAAl1", ["LAAAL2", "LAAAl2AgaAn"], "LAAAl1AgaAn"], "LAAAl0AgaAn" ].

	//Trims undesired strings from the strings of an array, case sensitive (using 'slice' method to keep original array without modifying):
	//NOTE: functions below are equivalent to 'CB_trim', 'CB_ltrim' and 'CB_rtrim'.
	var fruitsArray_2 = [ "  watermelon    ", "    lemon    ", "strawberry", "durian", "mango" ];
	var arrayTrimmed = CB_Arrays.trim(fruitsArray_2.slice(0)); //Strips spaces. Returns: [ "watermelon", "lemon", "strawberry", "durian", "mango" ].
	var arrayTrimmed_2 = CB_Arrays.trim(fruitsArray_2.slice(0), "m"); //Trims "m". Returns: [ "  watermelon    ", "    lemon    ", "strawberry", "durian", "ango" ].
	var arrayTrimmed_3 = CB_Arrays.trim(fruitsArray_2.slice(0), [" ", "l", "e", "m"]); //Trims spaces, "l", "e" and "m". Returns: [ "watermelon", "on", "strawberry", "durian", "ango" ].
	var arrayTrimmed_4 = CB_Arrays.trim(fruitsArray_2.slice(0), ["dur", "on", "ia"]); //Trims "dur", "on" and "ia". Returns: [ "  watermelon    ", "    lemon    ", "strawberry", "n", "mango" ].
	var arrayTrimmed_5 = CB_Arrays.ltrim(fruitsArray_2.slice(0)); //Trims spaces in the left. Returns: [ "watermelon    ", "lemon    ", "strawberry", "durian", "mango" ].
	var arrayTrimmed_6 = CB_Arrays.ltrim(fruitsArray_2.slice(0), [" ", "l", "n", "o"]); //Trims spaces, "l", "n" and "o" in the left. Returns: [ "watermelon    ", "emon    ", "strawberry", "durian", "mango" ].
	var arrayTrimmed_7 = CB_Arrays.rtrim(fruitsArray_2.slice(0)); //Trims spaces in the right. Returns: [ "  watermelon", "    lemon", "strawberry", "durian", "mango" ].
	var arrayTrimmed_8 = CB_Arrays.rtrim(fruitsArray_2.slice(0), [" ", "l", "n", "o"]); //Trims spaces, "l", "n" and "o" in the right. Returns: [ "  waterme", "    lem", "strawberry", "duria", "mang" ].
	
	//Sorting and filtering examples ('CB_Arrays.sort' uses native 'Array.sort' method and 'CB_Arrays.bsort' uses bubble sort method):
	var numbersArray = [ 3, 1984, 11, 13, 5, -8 ];
	var numbersArray_sorted = CB_Arrays.sort(numbersArray.slice(0)); //Sorts the array. Returns: [ -8, 3, 5, 11, 13, 1984 ].
	var numbersArray_sorted_2 = CB_Arrays.sort(numbersArray.slice(0), true); //Sorts the array in reversed order. Returns: [ 1984, 13, 11, 5, 3, -8 ].
	var numbersArray_sorted_3 = CB_Arrays.sort(numbersArray.slice(0), false, function(a, b) { return Math.abs(a) - Math.abs(b); }); //Sorts the array using a comparing function (just caring about absolute values). Returns: [ 3, 5, -8, 11, 13, 1984 ].
	var numbersArray_sorted_4 = CB_Arrays.bsort(numbersArray.slice(0)); //Sorts the array (bubble method). Returns: [ -8, 3, 5, 11, 13, 1984 ].
	var numbersArray_sorted_5 = CB_Arrays.bsort(numbersArray.slice(0), true); //Sorts the array (bubble method) in reversed order. Returns: [ 1984, 13, 11, 5, 3, -8 ].
	
	//Inserts an element in the desired position of a given an array:
	var arrayNew = CB_Arrays.insertElement(["a", "b", "c"], 1, "Z"); //Returns: [ "a", "Z", "b", "c" ].
	var arrayNew_2 = CB_Arrays.insertElement(["a", "b", "c"], 2, "Z"); //Returns: [ "a", "b", "Z", "c" ].
	var arrayNew_3 = CB_Arrays.insertElement(["a", "b", "c"], 3, "Z"); //Returns: [ "a", "b", "c", "Z" ].
	var arrayNew_4 = CB_Arrays.insertElement(["a", "b", "c"], 9999999, "Z"); //Returns: [ "a", "b", "c", "Z" ] (the maximum index is the length of the array).
	var arrayNew_5 = CB_Arrays.insertElement(["a", "b", "c"], 0, "Z"); //Returns: [ "Z", "a", "b", "c" ].
	var arrayNew_6 = CB_Arrays.insertElement(["a", "b", "c"], undefined, "Z"); //Returns: [ "Z", "a", "b", "c" ] (default index is 0).
	var arrayNew_7 = CB_Arrays.insertElement(["a", "b", "c"], null, "Z"); //Returns: [ "Z", "a", "b", "c" ] (default index is 0).
	var arrayNew_8 = CB_Arrays.insertElement(["a", "b", "c"], -123, "Z"); //Returns: [ "a", "b", "c", "Z" ] (any negative index will be converted to positive one and the maximum index is the length of the array).
	
	//Removes duplicated numbers from an array:
	var numbersArray = [ 3, 2, 1, 3, 5, 6, 1, 1, 1, 2, 8, 8, 9, 9, 9, 11 ];
	var numbersArray_purged = CB_Arrays.removeDuplicated(numbersArray.slice(0)); //Removes duplicated values, just leaving one of each. Returns: [ 3, 5, 6, 1, 2, 8, 9, 11 ].
	var numbersArray_purged_2 = CB_Arrays.removeDuplicated(numbersArray.slice(0), function(element, index, array) { return (element >= 5); }); //Removes duplicated values and also values greater or equal to 5 (by the defined purging function). Returns: [ 3, 1, 2 ].
	var numbersArray_purged_3 = CB_Arrays.removeDuplicated(numbersArray.slice(0), function(element, index, array) { return (element >= 5); }, true); //Removes values greater or equal to 5 (by the defined purging function) but keeps duplicated values. Returns: [ 3, 2, 1, 3, 1, 1, 1, 2 ].
	
	//Deletes an element from an array which is placed in the desired position (elements which were after it will be moved a position to the left):
	var arrayElementRemoved = CB_Arrays.removeElementByPosition([1, 2, 3, 4, 5, "hello"], 1); //Returns: [ 1, 3, 4, 5, "hello" ]. The same as 'CB_Arrays.removeElementByIndex'.

	//Deletes a given element from an array. All occurrences will be deleted (elements which were after a removed element will be moved a position to the left).
	var arrayElementRemoved_2 = CB_Arrays.removeElement([1, 2, 3, 4, 5, "hello", 6], "hello"); //Returns: [ 1, 2, 3, 4, 5, 6 ]. Note that it is type sensitive.

	//Deletes the given elements from an array. All occurrences will be deleted (elements which were after a removed element will be moved a position to the left).
	var arrayElementRemoved_3 = CB_Arrays.removeElements([1, 2, 3, 4, 5, "hello", 6], ["hello", 2, "3"]); //Returns: [ 1, 3, 4, 5, 6 ]. Note that it is type sensitive.

	//Combines two arrays (equivalent to 'CB_combineArraysOrObjects' and 'CB_combineJSON'):
	var arraysCombined = CB_Arrays.combine([1, 2, 3], [3, 4, 5, 6]); //Returns the array: [ 1, 2, 3, 3, 4, 5, 6 ].
	var arraysCombined_2 = CB_Arrays.combine([3, 4, 5, 6], [1, 2, 3]); //Returns the array: [ 3, 4, 5, 6, 1, 2, 3 ].
	var arraysCombined_3 = CB_Arrays.combine([1, 2, 3], [3, 4, 5, 6], true); //Removes duplicated values. Returns the array: [ 1, 2, 3, 4, 5, 6 ].
	var arraysCombined_4 = CB_Arrays.combine([3, 4, 5, 6], [1, 2, 3], true); //Removes duplicated values. Returns the array: [ 3, 4, 5, 6, 1, 2 ].
	
	//Combines one array with one object, third parameter ignored when not using two arrays (equivalent to 'CB_combineArraysOrObjects' and 'CB_combineJSON'):
	var objectsCombined = CB_Arrays.combine([1, 2, 3], { 1 : 22, "index1" : "3", "index2" : "whatever", "index3" : 3 }); //Returns the object: { 0: 1, 1: 22, 2: 3, index1: "3", index2: "whatever", index3: 3 }.
	var objectsCombined_2 = CB_Arrays.combine({ 1 : 22, "index1" : "3", "index2" : "whatever", "index3" : 3 }, [1, 2, 3]); //Returns the object: { 0: 1, 1: 2, 2: 3, index1: "3", index2: "whatever", index3: 3 }.
	var objectsCombined_3 = CB_Arrays.combine([1, 2, 3], { 1 : 22, "index1" : "3", "index2" : "whatever", "index3" : 3 }, true); //Returns the same as 'objectsCombined'.
	var objectsCombined_4 = CB_Arrays.combine({ 1 : 22, "index1" : "3", "index2" : "whatever", "index3" : 3 }, [1, 2, 3], true); //Returns the same as 'objectsCombined_2'.
</code></pre>

<p>
	Note that if the "<a href="_html/_doc/api/CB_Configuration.CrossBase.html#.EXTEND_DOM" target="_blank">EXTEND_DOM</a>" option of the <a href="_html/_doc/api/CB_Configuration.CrossBase.html" target="_blank">CB_Configuration.CrossBase</a> object is enabled, the following methods will be polyfilled automatically in clients which do not support them: 	
		<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf" target="_blank">Array.prototype.indexOf</a>,
		<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/lastIndexOf" target="_blank">Array.prototype.lastIndexOf</a>,
		<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray" target="_blank">Array.isArray</a>,
		<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach" target="_blank">Array.prototype.forEach</a>,
		<a href="https://developer.mozilla.org/en-US/docs/Web/API/NodeList/forEach" target="_blank">NodeList.prototype.forEach</a>
		and <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLCollection" target="_blank">HTMLCollection</a>.prototype.forEach.
</p>

<p>
	Finally, regardless the options defined, <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray" target="_blank">TypedArray</a> will always be present
	(including
	<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Int8Array" target="_blank">Int8Array</a>,
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array" target="_blank">Uint8Array</a>,
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8ClampedArray" target="_blank">Uint8ClampedArray</a>,
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Int16Array" target="_blank">Int16Array</a>,
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint16Array" target="_blank">Uint16Array</a>,
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Int32Array" target="_blank">Int32Array</a>,
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint32Array" target="_blank">Uint32Array</a>,
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float32Array" target="_blank">Float32Array</a>
    and <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float64Array" target="_blank">Float64Array</a>),
	using polyfills internally automatically if they are not supported natively.
</p>

<p>
	Check the <a href="_html/_doc/api/index.html" target="_blank">API documentation</a> to read more about the <a href="_html/_doc/api/CB_Arrays.html" target="_blank">CB_Arrays</a> static class and some <a href="_html/_doc/api/global.html" target="_blank">global functions and variables</a>.
</p>