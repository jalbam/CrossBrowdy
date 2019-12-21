/* This file belongs to a CrossBrowdy.com example, made by Joan Alba Maldonado. */

CB_init(main); //It will call the "main" function when ready.


//This function will be called when CrossBrowdy is ready:
function main()
{
	//Defines an array:
	var fruitsArray = [ "watermelon", "lemon", "strawberry", "durian", "mango" ];

	//Checks whether a given element is an array or not:
	if (CB_isArray(fruitsArray)) //Equivalent to 'CB_Arrays.isArray'.
	{
		printMessage("'fruitsArray' is an array!");
	}
	else { printMessage("'fruitsArray' is not an array!"); }
	var myArrayObject = new Array("Hello, CrossBrowdy!");
	if (CB_isArray(myArrayObject)) { printMessage("'myArrayObject' is an array!"); }
	else { printMessage("'myArrayObject' is not an array!"); }
	var myNumber = 123;
	if (CB_isArray(myNumber)) { printMessage("'myNumber' is an array!"); }
	else { printMessage("'myNumber' is not an array!"); }
	var myObject = 123;
	if (CB_isArray(myObject)) { printMessage("'myObject' is an array!"); }
	else { printMessage("'myObject' is not an array!"); }

	//Checking the number of elements (length) of an array (equivalent to 'fruitsArray.length', 'CB_Arrays.sizeof', 'CB_sizeOf' and 'CB_sizeof'):
	var elementLength = CB_Arrays.sizeOf(fruitsArray); //Returns 5.
	outputExpected = 5;
	outputReal = elementLength;
	checkOutput(outputExpected, outputReal);

	//Getting the first position (index number) of an element inside an array (equivalent to 'CB_indexOf'):
	var elementPosition = CB_Arrays.indexOf(fruitsArray, "durian"); //Starts from the beginning. Returns 3.
	var elementPosition_2 = CB_Arrays.indexOf(fruitsArray, "durian", 4); //Starts from position (index) 4, ignoring previous values. Returns -1 (not found).
	outputExpected = "3-1";
	outputReal = elementPosition + "" + elementPosition_2;
	checkOutput(outputExpected, outputReal);

	//Getting the last position (index number) of an element inside an array (equivalent to 'CB_lastIndexOf'):
	var elementPosition_3 = CB_Arrays.lastIndexOf(fruitsArray, "durian"); //Starts from the beginning. Returns 3.
	var elementPosition_4 = CB_Arrays.lastIndexOf(fruitsArray, "durian", 2); //Starts from position (index) 2, ignoring next values. Returns -1 (not found).
	outputExpected = "3-1";
	outputReal = elementPosition_3 + "" + elementPosition_4;
	checkOutput(outputExpected, outputReal);

	//Executes a function for each item in the array (equivalent to 'CB_forEach'):
	var myString = "";
	CB_Arrays.forEach(fruitsArray, function(element, index, array) { myString += element; });
	outputExpected = "watermelonlemonstrawberrydurianmango";
	outputReal = myString;
	checkOutput(outputExpected, outputReal);

	//Another way to perform an action (execute a function) for each element (being able to introduce a delay between each call):
	var myString = "";
	CB_Arrays.forEachDelay
	(
		fruitsArray, //array.
		function(element, index, array, delay) //functionEach. Being "this" the element itself.
		{
			CB_console(element + " in index #" + index);
			CB_console(array);
			myString += element;
		},
		1000, //delayBetweenEach. Optional. Default: 0. Can be either a positive number or a function returning a positive number.
		true, //returnSetTimeoutsArray. Optional. Default: false.
		false, //delayBetweenEachAffectsFirst. Optional. Default: false.
		function(array, totalItemsLooped, delayMaximum)
		{
			CB_console("All iterations finished!");
			outputExpected = "watermelonlemonstrawberrydurianmango";
			outputReal = myString;
			checkOutput(outputExpected, outputReal);
		} //functionFinish. Optional.
	);

	//Creates an array identical from an original one:
	var arrayCopy = CB_Arrays.copy([1, 2, 3]); //Returns another array with the same elements (copies it).
	outputExpected = [1, 2, 3].toString();
	outputReal = arrayCopy.toString();
	checkOutput(outputExpected, outputReal);
	
	//Replaces all the given occurrence from array of strings (with as many levels as we wish):
	var arrayOfStrings = [ "Level0", ["Level1", ["LEVEL2", "Level2Again"], "Level1Again"], "Level0Again" ];
	var myArrayReplaced = CB_replaceAll(arrayOfStrings, "e", "A"); //Replaces all occurrences of "e" by "A". Returns: [ "LAvAl0", ["LAvAl1", ["LEVEL2", "LAvAl2Again"], "LAvAl1Again"], "LAvAl0Again" ].
	var myArrayReplaced_2 = CB_replaceAll(arrayOfStrings, "e", "A", true); //Replaces all occurrences of "e" by "A", case insensitive. Returns: [ "LAvAl0", ["LAvAl1", ["LAVAL2", "LAvAl2Again"], "LAvAl1Again"], "LAvAl0Again" ].
	var myArrayReplaced_3 = CB_replaceAll(arrayOfStrings, ["e", "v", "i"], "A"); //Replaces all occurrences of "e", "v" and "h" by "A". Returns: [ "LAAAl0", ["LAAAl1", ["LEVEL2", "LAAAl2AgaAn"], "LAAAl1AgaAn"], "LAAAl0AgaAn" ].
	var myArrayReplaced_4 = CB_replaceAll(arrayOfStrings, ["e", "v", "i"], "A", true); //Replaces all occurrences of "e", "v" and "h" by "A", case insensitive. Returns: [ "LAAAl0", ["LAAAl1", ["LAAAL2", "LAAAl2AgaAn"], "LAAAl1AgaAn"], "LAAAl0AgaAn" ].
	outputExpected =
						[ "LAvAl0", ["LAvAl1", ["LEVEL2", "LAvAl2Again"], "LAvAl1Again"], "LAvAl0Again" ].toString() + [ "LAvAl0", ["LAvAl1", ["LAVAL2", "LAvAl2Again"], "LAvAl1Again"], "LAvAl0Again" ].toString() +
						[ "LAAAl0", ["LAAAl1", ["LEVEL2", "LAAAl2AgaAn"], "LAAAl1AgaAn"], "LAAAl0AgaAn" ].toString() + [ "LAAAl0", ["LAAAl1", ["LAAAL2", "LAAAl2AgaAn"], "LAAAl1AgaAn"], "LAAAl0AgaAn" ].toString();
	outputReal = myArrayReplaced.toString() + myArrayReplaced_2.toString() + myArrayReplaced_3.toString() + myArrayReplaced_4.toString();
	checkOutput(outputExpected, outputReal);

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
	outputExpected =
					[ "watermelon", "lemon", "strawberry", "durian", "mango" ].toString() + [ "  watermelon    ", "    lemon    ", "strawberry", "durian", "ango" ].toString() +
					[ "watermelon", "on", "strawberry", "durian", "ango" ].toString() + [ "  watermelon    ", "    lemon    ", "strawberry", "n", "mango" ].toString() +
					[ "watermelon    ", "lemon    ", "strawberry", "durian", "mango" ].toString() + [ "watermelon    ", "emon    ", "strawberry", "durian", "mango" ].toString() +
					[ "  watermelon", "    lemon", "strawberry", "durian", "mango" ].toString() + [ "  waterme", "    lem", "strawberry", "duria", "mang" ].toString();
	outputReal = arrayTrimmed.toString() + arrayTrimmed_2.toString() + arrayTrimmed_3.toString() + arrayTrimmed_4.toString() + arrayTrimmed_5.toString() + arrayTrimmed_6.toString() + arrayTrimmed_7.toString() + arrayTrimmed_8.toString();
	checkOutput(outputExpected, outputReal);

	//Inserts an element in the desired position of a given an array:
	var arrayNew = CB_Arrays.insertElement(["a", "b", "c"], 1, "Z"); //Returns: [ "a", "Z", "b", "c" ].
	var arrayNew_2 = CB_Arrays.insertElement(["a", "b", "c"], 2, "Z"); //Returns: [ "a", "b", "Z", "c" ].
	var arrayNew_3 = CB_Arrays.insertElement(["a", "b", "c"], 3, "Z"); //Returns: [ "a", "b", "c", "Z" ].
	var arrayNew_4 = CB_Arrays.insertElement(["a", "b", "c"], 9999999, "Z"); //Returns: [ "a", "b", "c", "Z" ] (the maximum index is the length of the array).
	var arrayNew_5 = CB_Arrays.insertElement(["a", "b", "c"], 0, "Z"); //Returns: [ "Z", "a", "b", "c" ].
	var arrayNew_6 = CB_Arrays.insertElement(["a", "b", "c"], undefined, "Z"); //Returns: [ "Z", "a", "b", "c" ] (default index is 0).
	var arrayNew_7 = CB_Arrays.insertElement(["a", "b", "c"], null, "Z"); //Returns: [ "Z", "a", "b", "c" ] (default index is 0).
	var arrayNew_8 = CB_Arrays.insertElement(["a", "b", "c"], -123, "Z"); //Returns: [ "a", "b", "c", "Z" ] (any negative index will be converted to positive one and the maximum index is the length of the array).
	outputExpected =
					[ "a", "Z", "b", "c" ].toString() + [ "a", "b", "Z", "c" ].toString() + [ "a", "b", "c", "Z" ].toString() + [ "a", "b", "c", "Z" ].toString() + [ "Z", "a", "b", "c" ].toString() + [ "Z", "a", "b", "c" ].toString() +
					[ "Z", "a", "b", "c" ].toString() +	[ "a", "b", "c", "Z" ].toString();
	outputReal = arrayNew.toString() + arrayNew_2.toString() + arrayNew_3.toString() + arrayNew_4.toString() + arrayNew_5.toString() + arrayNew_6.toString() + arrayNew_7.toString() + arrayNew_8.toString();
	checkOutput(outputExpected, outputReal);

	//Sorting and filtering examples ('CB_Arrays.sort' uses native 'Array.sort' method and 'CB_Arrays.bsort' uses bubble sort method):
	var numbersArray = [ 3, 1984, 11, 13, 5, -8 ];
	var numbersArray_sorted = CB_Arrays.sort(numbersArray.slice(0)); //Sorts the array. Returns: [ -8, 3, 5, 11, 13, 1984 ].
	var numbersArray_sorted_2 = CB_Arrays.sort(numbersArray.slice(0), true); //Sorts the array in reversed order. Returns: [ 1984, 13, 11, 5, 3, -8 ].
	var numbersArray_sorted_3 = CB_Arrays.sort(numbersArray.slice(0), false, function(a, b) { return Math.abs(a) - Math.abs(b); }); //Sorts the array using a comparing function (just caring about absolute values). Returns: [ 3, 5, -8, 11, 13, 1984 ].
	var numbersArray_sorted_4 = CB_Arrays.bsort(numbersArray.slice(0)); //Sorts the array (bubble method). Returns: [ -8, 3, 5, 11, 13, 1984 ].
	var numbersArray_sorted_5 = CB_Arrays.bsort(numbersArray.slice(0), true); //Sorts the array (bubble method) in reversed order. Returns: [ 1984, 13, 11, 5, 3, -8 ].
	outputExpected = [ -8, 3, 5, 11, 13, 1984 ].toString() + [ 1984, 13, 11, 5, 3, -8 ].toString() + [ 3, 5, -8, 11, 13, 1984 ].toString() + [ -8, 3, 5, 11, 13, 1984 ].toString() + [ 1984, 13, 11, 5, 3, -8 ].toString();
	outputReal = numbersArray_sorted.toString() + numbersArray_sorted_2.toString() + numbersArray_sorted_3.toString() + numbersArray_sorted_4.toString() + numbersArray_sorted_5.toString();
	checkOutput(outputExpected, outputReal);

	//Removes duplicated numbers from an array:
	var numbersArray = [ 3, 2, 1, 3, 5, 6, 1, 1, 1, 2, 8, 8, 9, 9, 9, 11 ];
	var numbersArray_purged = CB_Arrays.removeDuplicated(numbersArray.slice(0)); //Removes duplicated values, just leaving one of each. Returns: [ 3, 5, 6, 1, 2, 8, 9, 11 ].
	var numbersArray_purged_2 = CB_Arrays.removeDuplicated(numbersArray.slice(0), function(element, index, array) { return (element >= 5); }); //Removes duplicated values and also values greater or equal to 5 (by the defined purging function). Returns: [ 3, 1, 2 ].
	var numbersArray_purged_3 = CB_Arrays.removeDuplicated(numbersArray.slice(0), function(element, index, array) { return (element >= 5); }, true); //Removes values greater or equal to 5 (by the defined purging function) but keeps duplicated values. Returns: [ 3, 2, 1, 3, 1, 1, 1, 2 ].
	outputExpected = [ 3, 5, 6, 1, 2, 8, 9, 11 ].toString() + [ 3, 1, 2 ].toString() + [ 3, 2, 1, 3, 1, 1, 1, 2 ].toString();
	outputReal = numbersArray_purged.toString() + numbersArray_purged_2.toString() + numbersArray_purged_3.toString();
	checkOutput(outputExpected, outputReal);

	//Deletes an element from an array which is placed in the desired position (elements which were after it will be moved a position to the left):
	var arrayElementRemoved = CB_Arrays.removeElementByPosition([1, 2, 3, 4, 5, "hello"], 1); //Returns: [ 1, 3, 4, 5, "hello" ]. The same as 'CB_Arrays.removeElementByIndex'.

	//Deletes a given element from an array. All occurrences will be deleted (elements which were after a removed element will be moved a position to the left).
	var arrayElementRemoved_2 = CB_Arrays.removeElement([1, 2, 3, 4, 5, "hello", 6], "hello"); //Returns: [ 1, 2, 3, 4, 5, 6 ]. Note that it is type sensitive.

	//Deletes the given elements from an array. All occurrences will be deleted (elements which were after a removed element will be moved a position to the left).
	var arrayElementRemoved_3 = CB_Arrays.removeElements([1, 2, 3, 4, 5, "hello", 6], ["hello", 2, "3"]); //Returns: [ 1, 3, 4, 5, 6 ]. Note that it is type sensitive.

	outputExpected = [ 1, 3, 4, 5, "hello" ].toString() + [ 1, 2, 3, 4, 5, 6 ].toString() + [ 1, 3, 4, 5, 6 ].toString();
	outputReal = arrayElementRemoved.toString() + arrayElementRemoved_2.toString() + arrayElementRemoved_3.toString();
	checkOutput(outputExpected, outputReal);

	//Combines two arrays (equivalent to 'CB_combineArraysOrObjects' and 'CB_combineJSON'):
	var arraysCombined = CB_Arrays.combine([1, 2, 3], [3, 4, 5, 6]); //Returns the array: [ 1, 2, 3, 3, 4, 5, 6 ].
	var arraysCombined_2 = CB_Arrays.combine([3, 4, 5, 6], [1, 2, 3]); //Returns the array: [ 3, 4, 5, 6, 1, 2, 3 ].
	var arraysCombined_3 = CB_Arrays.combine([1, 2, 3], [3, 4, 5, 6], true); //Removes duplicated values. Returns the array: [ 1, 2, 3, 4, 5, 6 ].
	var arraysCombined_4 = CB_Arrays.combine([3, 4, 5, 6], [1, 2, 3], true); //Removes duplicated values. Returns the array: [ 3, 4, 5, 6, 1, 2 ].
	outputExpected = [ 1, 2, 3, 3, 4, 5, 6 ].toString() + [ 3, 4, 5, 6, 1, 2, 3 ].toString() + [ 1, 2, 3, 4, 5, 6 ].toString() + [ 3, 4, 5, 6, 1, 2 ].toString();
	outputReal = arraysCombined.toString() + arraysCombined_2.toString() + arraysCombined_3.toString() + arraysCombined_4.toString();
	checkOutput(outputExpected, outputReal);

	//Combines one array with one object, third parameter ignored when not using two arrays (equivalent to 'CB_combineArraysOrObjects' and 'CB_combineJSON'):
	var objectsCombined = CB_Arrays.combine([1, 2, 3], { 1 : 22, "index1" : "3", "index2" : "whatever", "index3" : 3 }); //Returns the object: { 0: 1, 1: 22, 2: 3, index1: "3", index2: "whatever", index3: 3 }.
	var objectsCombined_2 = CB_Arrays.combine({ 1 : 22, "index1" : "3", "index2" : "whatever", "index3" : 3 }, [1, 2, 3]); //Returns the object: { 0: 1, 1: 2, 2: 3, index1: "3", index2: "whatever", index3: 3 }.
	var objectsCombined_3 = CB_Arrays.combine([1, 2, 3], { 1 : 22, "index1" : "3", "index2" : "whatever", "index3" : 3 }, true); //Returns the same as 'objectsCombined'.
	var objectsCombined_4 = CB_Arrays.combine({ 1 : 22, "index1" : "3", "index2" : "whatever", "index3" : 3 }, [1, 2, 3], true); //Returns the same as 'objectsCombined_2'.	
	outputExpected =
					JSON.stringify({ 0: 1, 1: 22, 2: 3, index1: "3", index2: "whatever", index3: 3 }) + JSON.stringify({ 0: 1, 1: 2, 2: 3, index1: "3", index2: "whatever", index3: 3 }) +
					JSON.stringify({ 0: 1, 1: 22, 2: 3, index1: "3", index2: "whatever", index3: 3 }) + JSON.stringify({ 0: 1, 1: 2, 2: 3, index1: "3", index2: "whatever", index3: 3 });
	outputReal = JSON.stringify(objectsCombined) + JSON.stringify(objectsCombined_2) + JSON.stringify(objectsCombined_3) + JSON.stringify(objectsCombined_4);
	checkOutput(outputExpected, outputReal);
	
	//Defines a "class" and creates an instance of it with 3 properties (1 of them inherited through the prototype):
	var myClass = function() {};
	myClass.prototype.propertyInherited = "propertyInherited_value"; //Adds the "propertyInherited" property to the prototype.
	var myObject = new myClass(); //Creates an instance of 'myClass'.
	myObject.property1 = "property1_value"; //Adds the "property1" property to the object.
	myObject.property2 = { "subproperty1" : "subproperty1_value" }; //Adds the "property2" property to the object.

	//Getting the size of the object, just counting properties on the first level (equivalent to 'CB_sizeof', 'CB_Arrays.sizeOf' and 'CB_Arrays.sizeof'):
	var myObjectSize = CB_sizeOf(myObject); //Also counts not own properties, inherited from prototype. Returns: 3.
	var myObjectSize_2 = CB_sizeOf(myObject, true); //Only counts own properties, not inherited from prototype. Returns: 2.
	outputExpected = "3, 2";
	outputReal = myObjectSize + ", " + myObjectSize_2;
	checkOutput(outputExpected, outputReal);

	//Duplicating an object:
	var objectCopy = CB_copyObject({"hello" : "world", "whatever" : 123, "subObject" : { "subObject2" : "hello" } }); //Returns another object with the same properties and their values (copies it).
	outputExpected = JSON.stringify({"hello" : "world", "whatever" : 123, "subObject" : { "subObject2" : "hello" } });
	outputReal = JSON.stringify(objectCopy);
	checkOutput(outputExpected, outputReal);

	//Combines two objects, third parameter ignored when not using two arrays (equivalent to 'CB_combineJSON' and 'CB_Arrays.combine'):
	var objectsCombined = CB_combineArraysOrObjects({ a : 1, b: 2, c: 3 }, { c : 4, d : 5 }); //Returns the object: { a: 1, b: 2, c: 4, d: 5 }.
	var objectsCombined_2 = CB_combineArraysOrObjects({ c : 4, d : 5 }, { a : 1, b: 2, c: 3 }); //Returns the object: { c: 3, d: 5, a: 1, b: 2 }.
	var objectsCombined_3 = CB_combineArraysOrObjects({ a : 1, b: 2, c: 3 }, { c : 4, d : 5 }, true); //Returns the same as 'objectsCombined'.
	var objectsCombined_4 = CB_combineArraysOrObjects({ c : 4, d : 5 }, { a : 1, b: 2, c: 3 }, true); //Returns the same as 'objectsCombined_2'.
	outputExpected = JSON.stringify({ a: 1, b: 2, c: 4, d: 5 }) + JSON.stringify({ c: 3, d: 5, a: 1, b: 2 }) + JSON.stringify({ a: 1, b: 2, c: 4, d: 5 }) + JSON.stringify({ c: 3, d: 5, a: 1, b: 2 });
	outputReal = JSON.stringify(objectsCombined) + JSON.stringify(objectsCombined_2) + JSON.stringify(objectsCombined_3) + JSON.stringify(objectsCombined_4);
	checkOutput(outputExpected, outputReal);

	//Combines one array with one object, third parameter ignored when not using two arrays (equivalent to 'CB_combineJSON' and 'CB_Arrays.combine'):
	var objectsCombined_5 = CB_combineArraysOrObjects([1, 2, 3], { 1 : 22, "index1" : "3", "index2" : "whatever", "index3" : 3 }); //Returns the object: { 0: 1, 1: 22, 2: 3, index1: "3", index2: "whatever", index3: 3 }.
	var objectsCombined_6 = CB_combineArraysOrObjects({ 1 : 22, "index1" : "3", "index2" : "whatever", "index3" : 3 }, [1, 2, 3]); //Returns the object: { 0: 1, 1: 2, 2: 3, index1: "3", index2: "whatever", index3: 3 }.
	var objectsCombined_7 = CB_combineArraysOrObjects([1, 2, 3], { 1 : 22, "index1" : "3", "index2" : "whatever", "index3" : 3 }, true); //Returns the same as 'objectsCombined_5'.
	var objectsCombined_8 = CB_combineArraysOrObjects({ 1 : 22, "index1" : "3", "index2" : "whatever", "index3" : 3 }, [1, 2, 3], true); //Returns the same as 'objectsCombined_6'.
	outputExpected =
					JSON.stringify({ 0: 1, 1: 22, 2: 3, index1: "3", index2: "whatever", index3: 3 }) + JSON.stringify({ 0: 1, 1: 2, 2: 3, index1: "3", index2: "whatever", index3: 3 }) +
					JSON.stringify({ 0: 1, 1: 22, 2: 3, index1: "3", index2: "whatever", index3: 3 }) + JSON.stringify({ 0: 1, 1: 2, 2: 3, index1: "3", index2: "whatever", index3: 3 });
	outputReal = JSON.stringify(objectsCombined_5) + JSON.stringify(objectsCombined_6) + JSON.stringify(objectsCombined_7) + JSON.stringify(objectsCombined_8);
	checkOutput(outputExpected, outputReal);
	
	//Here is a way to get the value inside a given index from a desired object, returning the desired value if not found:
	//NOTE: when dealing with strings, 'CB_getValuePath' can be a better option.
	var JSONObject = { "name" : "CrossBrowdy", "locations" : { "first" : "Wonderland" } };
	var name = CB_getValueIndex(JSONObject, "name"); //Returns "CrossBrowdy".
	var locations = CB_getValueIndex(JSONObject, "locations"); //Returns { "first" : "Wonderland" }.
	var locationsFirst = CB_getValueIndex(JSONObject["locations"], "first"); //Returns "Wonderland".
	var locationsSecond = CB_getValueIndex(JSONObject["locations"], "second"); //Returns undefined.
	var locationsSecond_2 = CB_getValueIndex(JSONObject["locations"], "second", "Value when not found"); //Returns "Value when not found".
	outputExpected = "CrossBrowdy" + JSON.stringify({ "first" : "Wonderland" }) + "Wonderland" + undefined + "Value when not found";
	outputReal = name + JSON.stringify(locations) + locationsFirst + locationsSecond + locationsSecond_2;
	checkOutput(outputExpected, outputReal);

	//It is possible to parse a string that contains a JSON object to create a real JSON object and vice versa:
	//NOTE: internally, 'CB_parseJSON' uses 'JSON.parse' and 'CB_stringifyJSON' uses 'JSON.stringify'. If they are not available natively, a fallback method will be chosen automatically.
	var JSONObject = { a : 1, "b" : { "c" : "hello" } };
	var JSONObjectString = CB_stringifyJSON(JSONObject); //Returns a string containing 'JSONObject'. Second and third parameters would be used as the second and third ones ("replacer" and "space") when calling 'JSON.stringify' internally.
	var JSONObject_2 = CB_parseJSON(JSONObjectString); //Contains the same as 'JSONObject'. Second parameter would be used as the second one ("reviver") when calling 'JSON.parse' internally.
	var JSONObject_3 = CB_parseJSON(123, undefined, "error_value", true, function() { printMessage("Failed!"); }); //Returns 123 (number).
	var JSONObject_4 = CB_parseJSON(123, undefined, "error_value", false, function() { printMessage("Failed!"); }); //Returns the same as 'JSONObject_3'.
	var JSONObject_5 = CB_parseJSON("not_a_JSON_object", undefined, "error_value", true, function() { CB_console("Failed as expected! (all is fine)"); }); //Returns "error_value" and calls the error callback.
	var JSONObject_6 = CB_parseJSON("not_a_JSON_object", undefined, "error_value", false, function() { CB_console("Failed as expected! (all is fine)"); }); //Returns "error_value" and calls the error callback.
	var JSONObject_7 = CB_parseJSON(function(){}, undefined, "error_value", true, function() { CB_console("Failed as expected! (all is fine)"); }); //Returns "error_value" and calls the error callback.
	var JSONObject_8 = CB_parseJSON(function(){}, undefined, "error_value", false, function() { CB_console("Failed as expected! (all is fine)"); }); //Returns "error_value" and calls the error callback.
	var JSONObject_9 = CB_parseJSON(NaN, undefined, "error_value", true, function() { CB_console("Failed as expected! (all is fine)"); }); //Returns "error_value" and calls the error callback.
	var JSONObject_10 = CB_parseJSON(NaN, undefined, "error_value", false, function() { CB_console("Failed as expected! (all is fine)"); }); //Returns "error_value" and calls the error callback.
	var JSONObject_11 = CB_parseJSON(null, undefined, "error_value", true, function() { printMessage("Failed!"); }); //Returns an empty object.
	var JSONObject_12 = CB_parseJSON(null, undefined, "error_value", false, function() { printMessage("Failed!"); }); //Returns null.
	var JSONObject_13 = CB_parseJSON(undefined, undefined, "error_value", true, function() { printMessage("Failed!"); }); //Returns an empty object.
	var JSONObject_14 = CB_parseJSON(undefined, undefined, "error_value", false, function() { CB_console("Failed as expected! (all is fine)"); }); //Returns "error_value" and calls the error callback.
	var JSONObjectString_2 = CB_stringifyJSON(123, undefined, undefined, "error_value", true, function() { printMessage("Failed!"); }); //Returns "123" (string).
	var JSONObjectString_3 = CB_stringifyJSON(123, undefined, undefined, "error_value", false, function() { printMessage("Failed!"); }); //Returns the same as 'JSONObjectString_2'.
	var JSONObjectString_4 = CB_stringifyJSON("one_string", undefined, undefined, "error_value", true, function() { printMessage("Failed!"); }); //Returns "\"one_string\"".
	var JSONObjectString_5 = CB_stringifyJSON("one_string", undefined, undefined, "error_value", false, function() { printMessage("Failed!"); }); //Returns the same as 'JSONObjectString_4'.
	var JSONObjectString_6 = CB_stringifyJSON(function(){}, undefined, undefined, "error_value", true, function() { printMessage("Failed!"); }); //Returns "error_value".
	var JSONObjectString_7 = CB_stringifyJSON(function(){}, undefined, undefined, "error_value", false, function() { printMessage("Failed!"); }); //Returns undefined.
	var JSONObjectString_8 = CB_stringifyJSON(NaN, undefined, undefined, "error_value", true, function() { printMessage("Failed!"); }); //Returns "error_value".
	var JSONObjectString_9 = CB_stringifyJSON(NaN, undefined, undefined, "error_value", false, function() { printMessage("Failed!"); }); //Returns "null" (string).
	var JSONObjectString_10 = CB_stringifyJSON(null, undefined, undefined, "error_value", true, function() { printMessage("Failed!"); }); //Returns "error_value".
	var JSONObjectString_11 = CB_stringifyJSON(null, undefined, undefined, "error_value", false, function() { printMessage("Failed!"); }); //Returns "null" (string).
	var JSONObjectString_12 = CB_stringifyJSON(undefined, undefined, undefined, "error_value", true, function() { printMessage("Failed!"); }); //Returns "error_value".
	var JSONObjectString_13 = CB_stringifyJSON(undefined, undefined, undefined, "error_value", false, function() { printMessage("Failed!"); }); //Returns undefined.
	outputExpected =
					JSON.stringify({ a : 1, "b" : { "c" : "hello" } }) + JSON.stringify({ a : 1, "b" : { "c" : "hello" } }) + "123" + "123" + "error_value" + "error_value" + "error_value" + "error_value" + "error_value" +
					"error_value" + JSON.stringify({}) + JSON.stringify(null) + JSON.stringify({}) + "error_value" + "123" + "123" + "\"one_string\"" + "\"one_string\"" + "error_value" + JSON.stringify(undefined) + "error_value" +
					"null" + "error_value" + "null" + "error_value" + JSON.stringify(undefined);
	outputReal =
				JSONObjectString + JSON.stringify(JSONObject_2) + JSONObject_3 + JSONObject_4 + JSONObject_5 + JSONObject_6 +
				JSONObject_7 + JSONObject_8 + JSONObject_9 + JSONObject_10 + JSON.stringify(JSONObject_11) + JSON.stringify(JSONObject_12) +
				JSON.stringify(JSONObject_13) + JSONObject_14 + JSONObjectString_2 + JSONObjectString_3 + JSONObjectString_4 + JSONObjectString_5 + JSONObjectString_6 + JSONObjectString_7 + JSONObjectString_8 +
				JSONObjectString_9 + JSONObjectString_10 + JSONObjectString_11 + JSONObjectString_12 + JSONObjectString_13;
	checkOutput(outputExpected, outputReal);

	//The 'CB_getJSONPropertyValue' function is similar to 'CB_getValueIndex' but it will accept strings (it will try to parse them as JSON objects) and will return the element given again if the property is not given:
	var myValue = CB_getJSONPropertyValue(JSONObject, "a"); //Returns 1.
	var myValue_2 = CB_getJSONPropertyValue(JSONObject, "a", "not found"); //Returns the same as 'myValue'.
	var myValue_3 = CB_getJSONPropertyValue(JSONObject, "c"); //The "c" property cannot be found in the first level. Returns undefined.
	var myValue_4 = CB_getJSONPropertyValue(JSONObject, "c", "not found"); //The "c" property cannot be found in the first level. Returns "not found".
	var myValue_5 = CB_getJSONPropertyValue(JSONObjectString, "a"); //Returns the same as 'myValue'.
	var myValue_6 = CB_getJSONPropertyValue(JSONObjectString, "a", "not found"); //Returns the same as 'myValue'.
	var myValue_7 = CB_getJSONPropertyValue(JSONObjectString, "c"); //Returns the same as 'myValue_3'.
	var myValue_8 = CB_getJSONPropertyValue(JSONObjectString, "c", "not found"); //Returns the same as 'myValue_4'.	
	outputExpected = "1" + "1" + undefined + "not found" + "1" + "1" + undefined + "not found";
	outputReal = "" + myValue + myValue_2 + myValue_3 + myValue_4 + myValue_5 + myValue_6 + myValue_7 + myValue_8;
	checkOutput(outputExpected, outputReal);
	
	//Combines two kinds of elements (booleans, objects, arrays, strings, etc.) using 'CB_combineAutomatically':
	// 1) If both values are either undefined or null, returns null.
	// 2) If both values are boolean, returns the AND operation for the two of them (a && b).
	// 3) If either of the two is a string (not empty) and is not JSON valid, combines them as URL (GET) parameters using 'CB_combineURIParameters'.
	// 4) If either of them is JSON valid, combines them as JSON using 'CB_combineJSON' (passing the received "avoidDuplicatedValuesInArray" value as a parameter).
	// 5) Otherwise, combines them as arrays or objects using 'CB_combineArraysOrObjects' (passing the received "avoidDuplicatedValuesInArray" value as a parameter).
	var combination = CB_combineAutomatically(null, null); //Returns: null.
	var combination_2 = CB_combineAutomatically(undefined, undefined); //Returns: null.
	var combination_3 = CB_combineAutomatically(null, undefined); //Returns: null.
	var combination_4 = CB_combineAutomatically(undefined, null); //Returns: null.
	var combination_5 = CB_combineAutomatically(true, true); //Returns: true.
	var combination_6 = CB_combineAutomatically(true, false); //Returns: false.
	var combination_7 = CB_combineAutomatically(false, true); //Returns: false.
	var combination_8 = CB_combineAutomatically(false, false); //Returns: false.
	var combination_9 = CB_combineAutomatically("?p1=v1&p2=v2", "?p2=v2_alt&p3=v3"); //Returns: "p1=v1&p2=v2&p2=v2_alt&p3=v3".
	var combination_10 = CB_combineAutomatically("?p2=v2_alt&p3=v3", "?p1=v1&p2=v2"); //Returns: "p2=v2_alt&p3=v3&p1=v1&p2=v2".
	var combination_11 = CB_combineAutomatically("&p1=v1&p2=v2", "&p2=v2_alt&p3=v3"); //Returns: "p1=v1&p2=v2&p2=v2_alt&p3=v3".
	var combination_12 = CB_combineAutomatically("&p2=v2_alt&p3=v3", "&p1=v1&p2=v2"); //Returns: "p2=v2_alt&p3=v3&p1=v1&p2=v2".
	var combination_13 = CB_combineAutomatically("{ \"a\" : 123 }", "{ \"a\" : 987, \"b\" : \"xyz\" }"); //Returns: {a: 987, b: "xyz"}.
	var combination_14 = CB_combineAutomatically("{ \"a\" : 123 }", "{ \"a\" : 987, \"b\" : \"xyz\" }", true); //Returns: {a: 987, b: "xyz"}.
	var combination_15 = CB_combineAutomatically("{ \"a\" : 987, \"b\" : \"xyz\" }", "{ \"a\" : 123 }"); //Returns: {a: 123, b: "xyz"}.
	var combination_16 = CB_combineAutomatically("{ \"a\" : 987, \"b\" : \"xyz\" }", "{ \"a\" : 123 }", true); //Returns: {a: 123, b: "xyz"}.
	var combination_17 = CB_combineAutomatically(567, "{ \"a\" : 123 }"); //Returns: {a: 123}.
	var combination_18 = CB_combineAutomatically(567, "{ \"a\" : 123 }", true); //Returns: {a: 123}.
	var combination_19 = CB_combineAutomatically("{ \"a\" : 987, \"b\" : \"xyz\" }", 568); //Returns: {a: 987, b: "xyz"}.
	var combination_20 = CB_combineAutomatically("{ \"a\" : 987, \"b\" : \"xyz\" }", 568, true); //Returns: {a: 987, b: "xyz"}.
	var combination_21 = CB_combineAutomatically("hello", "{ \"a\" : 123 }"); //Returns: 'hello&{ "a" : 123 }' (string).
	var combination_22 = CB_combineAutomatically("hello", "{ \"a\" : 123 }", true); //Returns: 'hello&{ "a" : 123 }' (string).
	var combination_23 = CB_combineAutomatically("{ \"a\" : 987, \"b\" : \"xyz\" }", "hello"); //Returns: '{ "a" : 987, "b" : "xyz" }&hello' (string).
	var combination_24 = CB_combineAutomatically("{ \"a\" : 987, \"b\" : \"xyz\" }", "hello", true); //Returns: '{ "a" : 987, "b" : "xyz" }&hello' (string).
	var combination_25 = CB_combineAutomatically(false, "{ \"a\" : 123 }"); //Returns: {a: 123}.
	var combination_26 = CB_combineAutomatically(false, "{ \"a\" : 123 }", true); //Returns: {a: 123}.
	var combination_27 = CB_combineAutomatically("{ \"a\" : 987, \"b\" : \"xyz\" }", false); //Returns: {a: 987, b: "xyz"}.
	var combination_28 = CB_combineAutomatically("{ \"a\" : 987, \"b\" : \"xyz\" }", false, true); //Returns: {a: 987, b: "xyz"}.
	var combination_29 = CB_combineAutomatically(true, "{ \"a\" : 123 }"); //Returns: {a: 123}.
	var combination_30 = CB_combineAutomatically(true, "{ \"a\" : 123 }", true); //Returns: {a: 123}.
	var combination_31 = CB_combineAutomatically("{ \"a\" : 987, \"b\" : \"xyz\" }", true); //Returns: {a: 987, b: "xyz"}.
	var combination_32 = CB_combineAutomatically("{ \"a\" : 987, \"b\" : \"xyz\" }", true, true); //Returns: {a: 987, b: "xyz"}.
	var combination_33 = CB_combineAutomatically(null, "{ \"a\" : 123 }"); //Returns: {a: 123}.
	var combination_34 = CB_combineAutomatically(null, "{ \"a\" : 123 }", true); //Returns: {a: 123}.
	var combination_35 = CB_combineAutomatically("{ \"a\" : 987, \"b\" : \"xyz\" }", null); //Returns: {a: 987, b: "xyz"}.
	var combination_36 = CB_combineAutomatically("{ \"a\" : 987, \"b\" : \"xyz\" }", null, true); //Returns: {a: 987, b: "xyz"}.
	var combination_37 = CB_combineAutomatically(undefined, "{ \"a\" : 123 }"); //Returns: {a: 123}.
	var combination_38 = CB_combineAutomatically(undefined, "{ \"a\" : 123 }", true); //Returns: {a: 123}.
	var combination_39 = CB_combineAutomatically("{ \"a\" : 987, \"b\" : \"xyz\" }", undefined); //Returns: {a: 987, b: "xyz"}.
	var combination_40 = CB_combineAutomatically("{ \"a\" : 987, \"b\" : \"xyz\" }", undefined, true); //Returns: {a: 987, b: "xyz"}.
	var combination_41 = CB_combineAutomatically("{}", "{ \"a\" : 123 }"); //Returns: {a: 123}.
	var combination_42 = CB_combineAutomatically("{}", "{ \"a\" : 123 }", true); //Returns: {a: 123}.
	var combination_43 = CB_combineAutomatically("{ \"a\" : 987, \"b\" : \"xyz\" }", "{}"); //Returns: {a: 987, b: "xyz"}.
	var combination_44 = CB_combineAutomatically("{ \"a\" : 987, \"b\" : \"xyz\" }", "{}", true); //Returns: {a: 987, b: "xyz"}.
	var combination_45 = CB_combineAutomatically({}, "{ \"a\" : 123 }"); //Returns: {a: 123}.
	var combination_46 = CB_combineAutomatically({}, "{ \"a\" : 123 }", true); //Returns: {a: 123}.
	var combination_47 = CB_combineAutomatically("{ \"a\" : 987, \"b\" : \"xyz\" }", {}); //Returns: {a: 987, b: "xyz"}.
	var combination_48 = CB_combineAutomatically("{ \"a\" : 987, \"b\" : \"xyz\" }", {}, true); //Returns: {a: 987, b: "xyz"}.
	var combination_49 = CB_combineAutomatically({ a: 123 }, { a : 987, b: "xyz" }); //Returns: {a: 987, b: "xyz"}.
	var combination_50 = CB_combineAutomatically({ a: 123 }, { a : 987, b: "xyz" }, true); //Returns: {a: 987, b: "xyz"}.
	var combination_51 = CB_combineAutomatically({ a : 987, b: "xyz" }, { a: 123 }); //Returns: {a: 123, b: "xyz"}.
	var combination_52 = CB_combineAutomatically({ a : 987, b: "xyz" }, { a: 123 }, true); //Returns: {a: 123, b: "xyz"}.
	var combination_53 = CB_combineAutomatically("hello", { a: 123 }); //Returns: 'hello&{"a":123}' (string).
	var combination_54 = CB_combineAutomatically("hello", { a: 123 }, true); //Returns: 'hello&{"a":123}' (string).
	var combination_55 = CB_combineAutomatically({ a: 123 }, "hello"); //Returns: '{"a":123}&hello' (string).
	var combination_56 = CB_combineAutomatically({ a: 123 }, "hello", true); //Returns: '{"a":123}&hello' (string).
	var combination_57 = CB_combineAutomatically(false, { a: 123 }); //Returns: {a: 123}.
	var combination_58 = CB_combineAutomatically(false, { a: 123 }, true); //Returns: {a: 123}.
	var combination_59 = CB_combineAutomatically({ a: 123 }, false); //Returns: {a: 123}.
	var combination_60 = CB_combineAutomatically({ a: 123 }, false, true); //Returns: {a: 123}.
	var combination_61 = CB_combineAutomatically(true, { a: 123 }); //Returns: {a: 123}.
	var combination_62 = CB_combineAutomatically(true, { a: 123 }, true); //Returns: {a: 123}.
	var combination_63 = CB_combineAutomatically({ a: 123 }, true); //Returns: {a: 123}.
	var combination_64 = CB_combineAutomatically({ a: 123 }, true, true); //Returns: {a: 123}.
	var combination_65 = CB_combineAutomatically(null, { a: 123 }); //Returns: {a: 123}.
	var combination_66 = CB_combineAutomatically(null, { a: 123 }, true); //Returns: {a: 123}.
	var combination_67 = CB_combineAutomatically({ a: 123 }, null); //Returns: {a: 123}.
	var combination_68 = CB_combineAutomatically({ a: 123 }, null, true); //Returns: {a: 123}.
	var combination_69 = CB_combineAutomatically(undefined, { a: 123 }); //Returns: {a: 123}.
	var combination_70 = CB_combineAutomatically(undefined, { a: 123 }, true); //Returns: {a: 123}.
	var combination_71 = CB_combineAutomatically({ a: 123 }, undefined); //Returns: {a: 123}.
	var combination_72 = CB_combineAutomatically({ a: 123 }, undefined, true); //Returns: {a: 123}.
	var combination_73 = CB_combineAutomatically([ "a", "b" ], { "0": 12, a: 123 }); //Returns: {0: 12, 1: "b", a: 123}.
	var combination_74 = CB_combineAutomatically([ "a", "b" ], { "0": 12, a: 123 }, true); //Returns: {0: 12, 1: "b", a: 123}.
	var combination_75 = CB_combineAutomatically([ "a", "b" ], { 0: 12, a: 123 }); //Returns: {0: 12, 1: "b", a: 123}.
	var combination_76 = CB_combineAutomatically([ "a", "b" ], { 0: 12, a: 123 }, true); //Returns: {0: 12, 1: "b", a: 123}.
	var combination_77 = CB_combineAutomatically({ "0": 12, a: 123 }, [ "a", "b" ]); //Returns: {0: "a", 1: "b", a: 123}.
	var combination_78 = CB_combineAutomatically({ "0": 12, a: 123 }, [ "a", "b" ], true); //Returns: {0: "a", 1: "b", a: 123}.
	var combination_79 = CB_combineAutomatically({ 0: 12, a: 123 }, [ "a", "b" ]); //Returns: {0: "a", 1: "b", a: 123}.
	var combination_80 = CB_combineAutomatically({ 0: 12, a: 123 }, [ "a", "b" ], true); //Returns: {0: "a", 1: "b", a: 123}.
	var combination_81 = CB_combineAutomatically([ "a", "b" ], [ "a", "b", "c" ]); //Returns: ["a", "b", "a", "b", "c"].
	var combination_82 = CB_combineAutomatically([ "a", "b" ], [ "a", "b", "c" ], true); //Returns: ["a", "b", "c"].
	var combination_83 = CB_combineAutomatically([ "a", "b", "c" ], [ "a", "b" ]); //Returns: ["a", "b", "c", "a", "b"].
	var combination_84 = CB_combineAutomatically([ "a", "b", "c" ], [ "a", "b" ], true); //Returns: ["a", "b", "c"].
	outputExpected =
					JSON.stringify(null) + JSON.stringify(null) + JSON.stringify(null) + JSON.stringify(null) + JSON.stringify(true) + JSON.stringify(false) + JSON.stringify(false) + JSON.stringify(false) +
					"p1=v1&p2=v2&p2=v2_alt&p3=v3" + "p2=v2_alt&p3=v3&p1=v1&p2=v2" + "p1=v1&p2=v2&p2=v2_alt&p3=v3" + "p2=v2_alt&p3=v3&p1=v1&p2=v2" +	JSON.stringify({a: 987, b: "xyz"}) + JSON.stringify({a: 987, b: "xyz"}) +
					JSON.stringify({a: 123, b: "xyz"}) + JSON.stringify({a: 123, b: "xyz"}) + JSON.stringify({a: 123}) + JSON.stringify({a: 123}) +	JSON.stringify({a: 987, b: "xyz"}) + JSON.stringify({a: 987, b: "xyz"}) +
					'hello&{ "a" : 123 }' +	'hello&{ "a" : 123 }' +	'{ "a" : 987, "b" : "xyz" }&hello' + '{ "a" : 987, "b" : "xyz" }&hello' + JSON.stringify({a: 123}) + JSON.stringify({a: 123}) +
					JSON.stringify({a: 987, b: "xyz"}) + JSON.stringify({a: 987, b: "xyz"}) + JSON.stringify({a: 123}) + JSON.stringify({a: 123}) + JSON.stringify({a: 987, b: "xyz"}) + JSON.stringify({a: 987, b: "xyz"}) +
					JSON.stringify({a: 123}) + JSON.stringify({a: 123}) + JSON.stringify({a: 987, b: "xyz"}) + JSON.stringify({a: 987, b: "xyz"}) +	JSON.stringify({a: 123}) + JSON.stringify({a: 123}) +
					JSON.stringify({a: 987, b: "xyz"}) + JSON.stringify({a: 987, b: "xyz"}) + JSON.stringify({a: 123}) + JSON.stringify({a: 123}) + JSON.stringify({a: 987, b: "xyz"}) + JSON.stringify({a: 987, b: "xyz"}) +
					JSON.stringify({a: 123}) + JSON.stringify({a: 123}) + JSON.stringify({a: 987, b: "xyz"}) + JSON.stringify({a: 987, b: "xyz"}) +  JSON.stringify({a: 987, b: "xyz"}) + JSON.stringify({a: 987, b: "xyz"}) +
					JSON.stringify({a: 123, b: "xyz"}) + JSON.stringify({a: 123, b: "xyz"}) + 'hello&{"a":123}' + 'hello&{"a":123}' + '{"a":123}&hello' + '{"a":123}&hello' + JSON.stringify({a: 123}) + JSON.stringify({a: 123}) +
					JSON.stringify({a: 123}) + JSON.stringify({a: 123}) + JSON.stringify({a: 123}) + JSON.stringify({a: 123}) + JSON.stringify({a: 123}) + JSON.stringify({a: 123}) + JSON.stringify({a: 123}) +
					JSON.stringify({a: 123}) + JSON.stringify({a: 123}) + JSON.stringify({a: 123}) + JSON.stringify({a: 123}) + JSON.stringify({a: 123}) + JSON.stringify({a: 123}) + JSON.stringify({a: 123}) +
					JSON.stringify({0: 12, 1: "b", a: 123}) + JSON.stringify({0: 12, 1: "b", a: 123}) + JSON.stringify({0: 12, 1: "b", a: 123}) + JSON.stringify({0: 12, 1: "b", a: 123}) +
					JSON.stringify({0: "a", 1: "b", a: 123}) + JSON.stringify({0: "a", 1: "b", a: 123}) + JSON.stringify({0: "a", 1: "b", a: 123}) + JSON.stringify({0: "a", 1: "b", a: 123}) +
					["a", "b", "a", "b", "c"].toString() + ["a", "b", "c"].toString() + ["a", "b", "c", "a", "b"].toString() + ["a", "b", "c"].toString();
	outputReal =
					JSON.stringify(combination) + JSON.stringify(combination_2) + JSON.stringify(combination_3) + JSON.stringify(combination_4) + JSON.stringify(combination_5) + JSON.stringify(combination_6) +
					JSON.stringify(combination_7) + JSON.stringify(combination_8) + combination_9 + combination_10 + combination_11 + combination_12 + JSON.stringify(combination_13) + JSON.stringify(combination_14) +
					JSON.stringify(combination_15) + JSON.stringify(combination_16) + JSON.stringify(combination_17) + JSON.stringify(combination_18) + JSON.stringify(combination_19) + JSON.stringify(combination_20) +
					combination_21 + combination_22 + combination_23 + combination_24 + JSON.stringify(combination_25) + JSON.stringify(combination_26) + JSON.stringify(combination_27) + JSON.stringify(combination_28) +
					JSON.stringify(combination_29) + JSON.stringify(combination_30) + JSON.stringify(combination_31) + JSON.stringify(combination_32) + JSON.stringify(combination_33) + JSON.stringify(combination_34) +
					JSON.stringify(combination_35) + JSON.stringify(combination_36) + JSON.stringify(combination_37) + JSON.stringify(combination_38) + JSON.stringify(combination_39) + JSON.stringify(combination_40) +
					JSON.stringify(combination_41) + JSON.stringify(combination_42) + JSON.stringify(combination_43) + JSON.stringify(combination_44) + JSON.stringify(combination_45) + JSON.stringify(combination_46) +
					JSON.stringify(combination_47) + JSON.stringify(combination_48) + JSON.stringify(combination_49) + JSON.stringify(combination_50) + JSON.stringify(combination_51) + JSON.stringify(combination_52) +
					combination_53 + combination_54 + combination_55 + combination_56 + JSON.stringify(combination_57) + JSON.stringify(combination_58) + JSON.stringify(combination_59) + JSON.stringify(combination_60) +
					JSON.stringify(combination_61) + JSON.stringify(combination_62) + JSON.stringify(combination_63) + JSON.stringify(combination_64) + JSON.stringify(combination_65) + JSON.stringify(combination_66) +
					JSON.stringify(combination_67) + JSON.stringify(combination_68) + JSON.stringify(combination_69) + JSON.stringify(combination_70) + JSON.stringify(combination_71) + JSON.stringify(combination_72) +
					JSON.stringify(combination_73) + JSON.stringify(combination_74) + JSON.stringify(combination_75) + JSON.stringify(combination_76) + JSON.stringify(combination_77) + JSON.stringify(combination_78) +
					JSON.stringify(combination_79) + JSON.stringify(combination_80) + combination_81.toString() + combination_82.toString() + combination_83.toString() + combination_84.toString();
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