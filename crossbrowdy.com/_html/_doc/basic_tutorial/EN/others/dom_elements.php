<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	Here are some examples of DOM elements management:
</p>
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Getting an element by its ID:
	var element = CB_Elements.id("element_id"); //Gets the element, using the cache if 'CB_Configuration.CrossBase.CB_Elements_id_USE_CACHE' is true (which is the default value). Equivalent to 'CB_Elements.get'
	var element_2 = CB_Elements.id("element_id", true); //Gets the element using the cache. Equivalent to 'CB_Elements.get'
	var element_3 = CB_Elements.id("element_id", false); //Gets the element without using the cache (and updates the cache). Equivalent to 'CB_Elements.idCacheUpdate'.
	var element_4 = CB_Elements.idCacheUpdate("element_id"); //Gets the element without using the cache (and updates it). Equivalent to 'CB_Elements.id' with the second parameter 'false'.

	//Removing an element by its ID, equivalent to 'CB_Elements.removeById':
	CB_Elements.idRemove("element_id") //Removes the element, using the cache if 'CB_Configuration.CrossBase.CB_Elements_id_USE_CACHE' is true (which is the default value).
	CB_Elements.idRemove("element_id", true) //Removes the element using the cache.
	CB_Elements.idRemove("element_id", false) //Removes the element without using the cache.
	
	//Clearing the cache used by 'CB_Elements.id' and 'CB_Elements.idRemove':
	CB_Elements.idCacheClear("element_id"); //Clears the cache for the element whose ID is "element_id".
	CB_Elements.idCacheClear(); //Clears the cache used by all element IDs.
	
	//Getting elements (NodeList/array depending on the client) by their tag name (if not provided, first parameter will be "*" by default):
	var elements = CB_Elements.tag("*"); //Gets all elements, using the cache if 'CB_Configuration.CrossBase.CB_Elements_tag_USE_CACHE' is true (which is the default value).
	var elements_2 = CB_Elements.tag("div"); //Gets the elements whose tag is "&lt;DIV&gt;", using the cache if 'CB_Configuration.CrossBase.CB_Elements_tag_USE_CACHE' is true (which is the default value).
	var elements_3 = CB_Elements.tag("*", CB_Elements.id("parent_id")); //Gets all elements which are inside the element whose ID is "parent_id", using the cache if 'CB_Configuration.CrossBase.CB_Elements_tag_USE_CACHE' is true (which is the default value).
	var elements_4 = CB_Elements.tag("div", CB_Elements.id("parent_id")); //Gets the elements whose tag is "&lt;DIV&gt;" which are inside the element whose ID is "parent_id", using the cache if 'CB_Configuration.CrossBase.CB_Elements_tag_USE_CACHE' is true (which is the default value).
	var elements_5 = CB_Elements.tag("*", null, true); //Gets all elements using the cache.
	var elements_6 = CB_Elements.tag("div", null, true); //Gets the elements whose tag is "&lt;DIV&gt;" using the cache.
	var elements_7 = CB_Elements.tag("*", null, false); //Gets all elements without using the cache. Equivalent to 'CB_Elements.tagCacheUpdate'.
	var elements_8 = CB_Elements.tag("div", null, false); //Gets the elements whose tag is "&lt;DIV&gt;" without using the cache. Equivalent to 'CB_Elements.tagCacheUpdate'.
	var elements_9 = CB_Elements.tagCacheUpdate("*"); //Gets all elements without using the cache (and updates it). Equivalent to 'CB_Elements.tag' with the third parameter 'false'.
	var elements_10 = CB_Elements.tagCacheUpdate("div"); //Gets the elements whose tag is "&lt;DIV&gt;" without using the cache (and updates it). Equivalent to 'CB_Elements.tag' with the third parameter 'false'.
	var elements_11 = CB_Elements.tagCacheUpdate("*", CB_Elements.id("parent_id")); //Gets all elements which are inside the element whose ID is "parent_id" without using the cache (and updates it). Equivalent to 'CB_Elements.tag' with the third parameter 'false'.
	var elements_12 = CB_Elements.tagCacheUpdate("div", CB_Elements.id("parent_id")); //Gets the elements whose tag is "&lt;DIV&gt;" which are inside the element whose ID is "parent_id" without using the cache (and updates it). Equivalent to 'CB_Elements.tag' with the third parameter 'false'.
	
	//Removing elements by their tag name (if not provided, first parameter will be "*" by default), equivalent to 'CB_Elements.removeByTagName':
	CB_Elements.tagRemove("*") //Removes all elements, using the cache if 'CB_Configuration.CrossBase.CB_Elements_tag_USE_CACHE' is true (which is the default value).
	CB_Elements.tagRemove("div") //Removes the elements whose tag is "&lt;DIV&gt;", using the cache if 'CB_Configuration.CrossBase.CB_Elements_tag_USE_CACHE' is true (which is the default value).
	CB_Elements.tagRemove("*", CB_Elements.id("parent_id")) //Removes all elements which are inside the element whose ID is "parent_id", using the cache if 'CB_Configuration.CrossBase.CB_Elements_tag_USE_CACHE' is true (which is the default value).
	CB_Elements.tagRemove("div", CB_Elements.id("parent_id")) //Removes the elements whose tag is "&lt;DIV&gt;" which are inside the element whose ID is "parent_id", using the cache if 'CB_Configuration.CrossBase.CB_Elements_tag_USE_CACHE' is true (which is the default value).
	CB_Elements.tagRemove("*", null, true) //Removes all elements using the cache.
	CB_Elements.tagRemove("div", null, true) //Removes the elements whose tag is "&lt;DIV&gt;" using the cache.
	CB_Elements.tagRemove("*", null, false) //Removes all elements without using the cache.
	CB_Elements.tagRemove("div", null, false) //Removes the elements whose tag is "&lt;DIV&gt;" without using the cache.

	//Clearing the cache used by 'CB_Elements.tag' and 'CB_Elements.tagRemove' (if not provided, first parameter will be "*" by default):
	CB_Elements.tagCacheClear("div", CB_Elements.id("parent_id")); //Clears the cache used by the elements whose tag is "&lt;DIV&gt;" which are inside the element whose ID is "parent_id".
	CB_Elements.tagCacheClear("*", CB_Elements.id("parent_id")); //Clears the cache used by all elements which are inside the element whose ID is "parent_id"
	CB_Elements.tagCacheClear("div"); //Clears the cache used by the elements whose tag is "&lt;DIV&gt;".
	CB_Elements.tagCacheClear(); //Clears the cache used by all elements.

	//Getting elements (NodeList/array depending on the client) by their class or classes name (the order of the classes is just important for the internal cache):
	var elements_13 = CB_Elements.classes("class_1"); //Gets the elements which use the "class_1" class, using the cache if 'CB_Configuration.CrossBase.CB_Elements_classes_USE_CACHE' is true (which is the default value).
	var elements_14 = CB_Elements.classes("class_1 class_2"); //Gets the elements which use both the "class_1" and the "class_2" classes, using the cache if 'CB_Configuration.CrossBase.CB_Elements_classes_USE_CACHE' is true (which is the default value).
	var elements_15 = CB_Elements.classes("class_1", CB_Elements.id("parent_id")); //Gets the elements which use the "class_1" class and are inside the element whose ID is "parent_id", using the cache if 'CB_Configuration.CrossBase.CB_Elements_classes_USE_CACHE' is true (which is the default value).
	var elements_16 = CB_Elements.classes("class_1 class_2", CB_Elements.id("parent_id")); //Gets the elements which use both the "class_1" and the "class_2" classes and are inside the element whose ID is "parent_id", using the cache if 'CB_Configuration.CrossBase.CB_Elements_classes_USE_CACHE' is true (which is the default value).
	var elements_17 = CB_Elements.classes("class_1", null, true); //Gets the elements which use the "class_1" class using the cache.
	var elements_18 = CB_Elements.classes("class_1 class_2", null, true); //Gets the elements which use both the "class_1" and the "class_2" classes using the cache.
	var elements_19 = CB_Elements.classes("class_1", null, false); //Gets the elements which use the "class_1" class without using the cache. Equivalent to 'CB_Elements.classesCacheUpdate'.
	var elements_20 = CB_Elements.classes("class_1 class_2", null, false); //Gets the elements which use both the "class_1" and the "class_2" classes without using the cache. Equivalent to 'CB_Elements.classesCacheUpdate'.
	var elements_21 = CB_Elements.classesCacheUpdate("class_1"); //Gets the elements which use the "class_1" class without using the cache (and updates it). Equivalent to 'CB_Elements.classes' with the third parameter 'false'.
	var elements_22 = CB_Elements.classesCacheUpdate("class_1 class_2"); //Gets the elements which use both the "class_1" and the "class_2" classes without using the cache (and updates it). Equivalent to 'CB_Elements.classes' with the third parameter 'false'.
	var elements_23 = CB_Elements.classesCacheUpdate("class_1", CB_Elements.id("parent_id")); //Gets the elements which use the "class_1" class and are inside the element whose ID is "parent_id" without using the cache (and updates it). Equivalent to 'CB_Elements.classes' with the third parameter 'false'.
	var elements_24 = CB_Elements.classesCacheUpdate("class_1 class_2", CB_Elements.id("parent_id")); //Gets the elements which use both the "class_1" and the "class_2" classes and are inside the element whose ID is "parent_id" without using the cache (and updates it). Equivalent to 'CB_Elements.classes' with the third parameter 'false'.
	
	//Removing elements by their class or classes name (the order of the classes is just important for the internal cache), equivalent to 'CB_Elements.removeByClasses':
	CB_Elements.classesRemove("class_1") //Removes the elements which use the "class_1" class, using the cache if 'CB_Configuration.CrossBase.CB_Elements_classes_USE_CACHE' is true (which is the default value).
	CB_Elements.classesRemove("class_1 class_2") //Removes the elements which use both the "class_1" and the "class_2" classes, using the cache if 'CB_Configuration.CrossBase.CB_Elements_classes_USE_CACHE' is true (which is the default value).
	CB_Elements.classesRemove("class_1", CB_Elements.id("parent_id")) //Removes the elements which use the "class_1" class and are inside the element whose ID is "parent_id", using the cache if 'CB_Configuration.CrossBase.CB_Elements_classes_USE_CACHE' is true (which is the default value).
	CB_Elements.classesRemove("class_1 class_2", CB_Elements.id("parent_id")) //Removes the elements which use both the "class_1" and the "class_2" classes and are inside the element whose ID is "parent_id", using the cache if 'CB_Configuration.CrossBase.CB_Elements_classes_USE_CACHE' is true (which is the default value).
	CB_Elements.classesRemove("class_1", null, true) //Removes the elements which use the "class_1" class using the cache.
	CB_Elements.classesRemove("class_1 class_2", null, true) //Removes the elements which use both the "class_1" and the "class_2" classes using the cache.
	CB_Elements.classesRemove("class_1", null, false) //Removes the elements which use the "class_1" class without using the cache.
	CB_Elements.classesRemove("class_1 class_2", null, false) //Removes the elements which use both the "class_1" and the "class_2" classes without using the cache.

	//Clearing the cache used by 'CB_Elements.classes' and 'CB_Elements.classesRemove' (the order of the classes is important for the internal cache):
	CB_Elements.classesCacheClear("class_1 class_2", CB_Elements.id("parent_id")); //Clears the cache used by the elements which use both the "class_1" and the "class_2" classes and are inside the element whose ID is "parent_id".
	CB_Elements.classesCacheClear("class_1", CB_Elements.id("parent_id")); //Clears the cache used by the elements which use the "class_1" class and are inside the element whose ID is "parent_id"
	CB_Elements.classesCacheClear("class_1 class_2"); //Clears the cache used by the elements which use both the "class_1" and the "class_2" classes.
	CB_Elements.classesCacheClear(); //Clears the cache used by all elements.
	
	//Removes an element (you can also use 'CB_Elements.idRemove'/'CB_Elements.removeById', 'CB_Elements.tagRemove'/'CB_Elements.removeByTagName' and 'CB_Elements.classesRemove'/'CB_Elements.removeByClasses'):
	var myElement = CB_Elements.id("my_element_id");
	CB_Elements.remove(myElement);

	//Sets the given value of a chosen property for the desired element (similar to 'myElement.property_name = property_value' but adding security and features):
	CB_Elements.setProperty(myElement, "property_name", "property_value");
	CB_Elements.setProperty(myElement, "property_name", "property_value", true, function() { CB_console("Property value modified!"); }); //Calls the function only if the property value is modified.
	CB_Elements.setPropertyById("my_element_id", "property_name", "property_value");
	CB_Elements.setPropertyById("my_element_id", "property_name", "property_value", true, function() { CB_console("Property value modified!"); }); //Calls the function only if the property value is modified.
	
	//Gets the position and size of an element:
	var elementLeft = CB_Elements.getLeft(myElement);
	var elementLeft_2 = CB_Elements.getLeft(myElement, false); //Ignores scroll position.
	var elementTop = CB_Elements.getTop(myElement);
	var elementTop_2 = CB_Elements.getTop(myElement, false); //Ignores scroll position.
	var elementWidth = CB_Elements.getWidth(myElement);
	var elementHeight = CB_Elements.getHeight(myElement);
	
	//Gets the position and size of an element by its ID:
	var elementLeft_3 = CB_Elements.getLeftById("element_id");
	var elementLeft_4 = CB_Elements.getLeftById("element_id", false); //Ignores scroll position.
	var elementTop_3 = CB_Elements.getTopById("element_id");
	var elementTop_4 = CB_Elements.getTopById("element_id", false); //Ignores scroll position.
	var elementWidth_2 = CB_Elements.getWidthById("element_id");
	var elementHeight_2 = CB_Elements.getHeightById("element_id");

	//Gets the "style" (object) of an element:
	var elementStyle = CB_Elements.getStyle(myElement); //Returns the "style" property.
	var elementStyle_2 = CB_Elements.getStyle(myElement, true); //Returns computed style (can be different from the "style" property).
	
	//Gets the "style" (object) of an element by its ID:
	var elementStyle_3 = CB_Elements.getStyleById("element_id"); //Returns the "style" property.
	var elementStyle_4 = CB_Elements.getStyleById("element_id", true); //Returns computed style (can be different from the "style" property).

	//Gets the value of a given property of the "style" of an element:
	var styleProperty = CB_Elements.getStyleProperty(myElement, "attribute_name");
	var styleProperty_2 = CB_Elements.getStyleProperty(myElement, "attribute_name", true); //Gets the data from the computed style (can be different from the "style" property).
	var styleProperty_3 = CB_Elements.getStylePropertyById("element_id", "attribute_name");
	var styleProperty_4 = CB_Elements.getStylePropertyById("element_id", "attribute_name", true); //Gets the data from the computed style (can be different from the "style" property).
	
	//Gets the numeric value of a given property of the "style" of an element, different ways (all return an array):
	var styleProperty_5 = CB_Elements.getStylePropertyInteger(myElement, "attribute_name");
	var styleProperty_6 = CB_Elements.getStylePropertyInteger(myElement, "attribute_name", true); //Gets the data from the computed style (can be different from the "style" property).
	var styleProperty_7 = CB_Elements.getStylePropertyIntegerById("element_id", "attribute_name");
	var styleProperty_8 = CB_Elements.getStylePropertyIntegerById("element_id", "attribute_name", true); //Gets the data from the computed style (can be different from the "style" property).
	var styleProperty_9 = CB_Elements.getStylePropertyNumeric(myElement, "attribute_name");
	var styleProperty_10 = CB_Elements.getStylePropertyNumeric(myElement, "attribute_name", true); //Gets the data from the computed style (can be different from the "style" property).
	var styleProperty_11 = CB_Elements.getStylePropertyNumericById("element_id", "attribute_name");
	var styleProperty_12 = CB_Elements.getStylePropertyNumericById("element_id", "attribute_name", true); //Gets the data from the computed style (can be different from the "style" property).
	
	//Sets the desired class or classes for a given element (overwriting previous ones, if any):
	CB_Elements.setClass(myElement, "class_1 class_2");
	CB_Elements.setClass(myElement, "class_3", true, function(element) { CB_console("Class set!"); }); //Calls the function only if the element did not use the same class already, after setting it.
	CB_Elements.setClassById("element_id", "class_1 class_2");
	CB_Elements.setClassById("element_id", "class_3", true, function(element) { CB_console("Class set!"); }); //Calls the function only if the element did not use the same class already, after setting it.
	
	//Adds the desired class for a given element (keeping previous ones, if any):
	CB_Elements.addClass(myElement, "class_1");
	CB_Elements.addClass(myElement, "class_2", true, function(element) { CB_console("Class added!"); }); //Calls the function only if the element did not use the same class already, after adding it.
	CB_Elements.addClassById("element_id", "class_1");
	CB_Elements.addClassById("element_id", "class_2", function(element) { CB_console("Class added!"); }); //Calls the function only if the element did not use the same class already, after adding it.
	
	//Removes the desired class from a given element (keeping others, if any):
	CB_Elements.removeClass(myElement, "class_1");
	CB_Elements.removeClass(myElement, "class_1", true, function(element) { CB_console("Class removed!"); }); //Calls the function only if the element used the same class, after removing it.
	CB_Elements.removeClassById("element_id", "class_1");
	CB_Elements.removeClassById("element_id", "class_1", true, function(element) { CB_console("Class removed!"); }); //Calls the function only if the element used the same class, after removing it.
	
	//Toggles the class of a given element between two given classes or adds/removes the given class (keeping other classes, if any):
	CB_Elements.toggleClass(myElement, "class_1"); //Adds/removes "class_1".
	CB_Elements.toggleClass(myElement, "class_1", "", function(element, className) { if (className === "") { CB_console("Class removed!"); } else { CB_console("Class added!"); } }); //Adds/removes "class_1". Calls the function after it.
	CB_Elements.toggleClass(myElement, "class_1", "class_2"); //Toggles between the two given classes.
	CB_Elements.toggleClass(myElement, "class_1", "class_2", function(element, className) { CB_console(className + " class added!"); }); //Toggles between the two given classes. Calls the function after it.
	CB_Elements.toggleClassById("element_id", "class_1"); //Adds/removes "class_1".
	CB_Elements.toggleClassById("element_id", "class_1", "", function(element, className) { if (className === "") { CB_console("Class removed!"); } else { CB_console("Class added!"); } }); //Adds/removes "class_1". Calls the function after it.
	CB_Elements.toggleClassById("element_id", "class_1", "class_2"); //Toggles between the two given classes.
	CB_Elements.toggleClassById("element_id", "class_1", "class_2", function(element, className) { CB_console(className + " class added!"); }); //Toggles between the two given classes. Calls the function after it.

	//Shows a hidden element (when not given, uses "block" for the "display" property of its "style"):
	CB_Elements.show(myElement);
	CB_Elements.show(myElement, "table-cell"); //Shows the element using "table-cell" for the "display" property of its "style".
	CB_Elements.show(myElement, undefined, true, false, function(element, displayValue) { CB_console("Element shown!"); }); //Calls the function after showing the element.
	CB_Elements.showById("element_id");
	CB_Elements.showById("element_id", "table-cell"); //Shows the element using "table-cell" for the "display" property of its "style".
	CB_Elements.showById("element_id", undefined, true, false, function(element, displayValue) { CB_console("Element shown!"); }); //Calls the function after showing the element.
	
	//Hides an element:
	CB_Elements.hide(myElement);
	CB_Elements.hide(myElement, true, false, function(element, displayValue) { CB_console("Element hidden!"); }); //Calls the function after hiding the element.
	CB_Elements.hideById("element_id");
	CB_Elements.hideById("element_id", true, false, function(element, displayValue) { CB_console("Element hidden!"); }); //Calls the function after hiding the element.

	//Toggles the visibility of an element, showing/hiding it (when not given, uses "block" for the "display" property of its "style" when showing it):
	CB_Elements.showHide(element);
	CB_Elements.showHide(element, "table-cell"); //If shows the element, it will use "table-cell" for the "display" property of its "style".
	CB_Elements.showHide(element, undefined, true, false, function(element, displayValue) { if (displayValue === "none") { CB_console("Element hidden!"); } else { CB_console("Element shown!"); } }); //Calls the function after showing/hiding the element.
	CB_Elements.showHideById("element_id");
	CB_Elements.showHideById("element_id", "table-cell"); //If shows the element, it will use "table-cell" for the "display" property of its "style".
	CB_Elements.showHideById("element_id", undefined, true, false, function(element, displayValue) { if (displayValue === "none") { CB_console("Element hidden!"); } else { CB_console("Element shown!"); } }); //Calls the function after showing/hiding the element.

	//Inserts the desired content into a given container element (when a "displayValue" is given, calls the 'CB_Elements.show' internally with it):
	CB_Elements.insertContent(myElement, "Content example");
	CB_Elements.insertContent(myElement, "Content example", "block"); //It will make the element appear with 'CB_Elements.show' and using 'block' as the "displayValue" (useful when the element is hidden).
	CB_Elements.insertContent(myElement, "Content example", undefined, true, false, function(container) { CB_Console("Content inserted!"); }); //Calls the function after inserting the content.
	CB_Elements.insertContentById("element_id", "Content example");
	CB_Elements.insertContentById("element_id", "Content example", "block"); //It will make the element appear with 'CB_Elements.show' and using 'block' as the "displayValue" (useful when the element is hidden).
	CB_Elements.insertContentById("element_id", "Content example", undefined, true, false, function(container) { CB_Console("Content inserted!"); }); //Calls the function after inserting the content.

	//Appends the desired content at the end of a given container element (when a "displayValue" is given, calls the 'CB_Elements.show' internally with it), keeping the existing one:
	CB_Elements.appendContent(myElement, "Content example");
	CB_Elements.appendContent(myElement, "Content example", "block"); //It will make the element appear with 'CB_Elements.show' and using 'block' as the "displayValue" (useful when the element is hidden).
	CB_Elements.appendContent(myElement, "Content example", undefined, true, false, function(container) { CB_Console("Content inserted!"); }); //Calls the function after inserting the content.
	CB_Elements.appendContentById("element_id", "Content example");
	CB_Elements.appendContentById("element_id", "Content example", "block"); //It will make the element appear with 'CB_Elements.show' and using 'block' as the "displayValue" (useful when the element is hidden).
	CB_Elements.appendContentById("element_id", "Content example", undefined, true, false, function(container) { CB_Console("Content inserted!"); }); //Calls the function after inserting the content.

	//Appends the desired content at the end of a given container element (when a "displayValue" is given, calls the 'CB_Elements.show' internally with it), keeping the existing one:
	CB_Elements.appendContentBeginning(myElement, "Content example");
	CB_Elements.appendContentBeginning(myElement, "Content example", "block"); //It will make the element appear with 'CB_Elements.show' and using 'block' as the "displayValue" (useful when the element is hidden).
	CB_Elements.appendContentBeginning(myElement, "Content example", undefined, true, false, function(container) { CB_Console("Content inserted!"); }); //Calls the function after inserting the content.
	CB_Elements.appendContentByIdBeginning("element_id", "Content example");
	CB_Elements.appendContentByIdBeginning("element_id", "Content example", "block"); //It will make the element appear with 'CB_Elements.show' and using 'block' as the "displayValue" (useful when the element is hidden).
	CB_Elements.appendContentByIdBeginning("element_id", "Content example", undefined, true, false, function(container) { CB_Console("Content inserted!"); }); //Calls the function after inserting the content.
	
	//Gets the scroll position (left and top) in pixels of a given element:
	var elementScrollLeft = CB_Elements.getScrollLeftById("element_id");
	var elementScrollTop = CB_Elements.getScrollTopById("element_id");
	
	//Gets the immediate parent of a given element:
	var elementParent = CB_Elements.getParent(myElement);
	var elementParent_2 = CB_Elements.getParentById("element_id");
	
	//Gets all the parents of a given element (returns an array):
	var elementParents = CB_Elements.getParents(myElement);
	var elementParents_2 = CB_Elements.getParentsById("element_id");
	
	//Tries to get the body content of a given IFRAME element (depending on the client and the safety measures, this might fail):
	var iframeElement = CB_Elements.id("iframe_id");
	var iframeElementContent = CB_Elements.getFrameBodyContent(iframeElement);
	var iframeElementContent_2 = CB_Elements.getFrameBodyContentById("iframe_id");
	
	//Prevents the possibility of selecting the content of a given element:
	CB_Elements.preventSelection(myElement);
	CB_Elements.preventSelectionById("element_id");

	//Allows selecting the content of a given element:
	CB_Elements.preventSelection(myElement, false);
	CB_Elements.preventSelectionById("element_id", false);

	//Disables the context menu of a given element:
	CB_Elements.contextMenuDisable(myElement);
	CB_Elements.contextMenuDisableById("element_id");
	
	//Enables the context menu of a given element:
	CB_Elements.contextMenuDisable(myElement, false);
	CB_Elements.contextMenuDisableById("element_id", false);
</code></pre>

<p>
	Check the <a href="_html/_doc/api/index.html" target="_blank">API documentation</a> to read more about the <a href="_html/_doc/api/CB_Elements.html" target="_blank">CB_Elements</a> static class.
</p>