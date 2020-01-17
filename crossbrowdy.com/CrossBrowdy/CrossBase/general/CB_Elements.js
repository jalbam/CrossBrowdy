/**
 * @file DOM elements management. Contains the {@link CB_Elements} static class.
 *  @author Joan Alba Maldonado <workindalian@gmail.com>
 */

 
/**
 * Static class to manage DOM elements. It will return itself if it is tried to be instantiated.
 * @namespace
 * @todo Think about creating a function called "add" or "create" to create a new element (it could accept "tagName", "id" and "content" parameters).
 * @todo Think about creating "setStyle" and "setStyleById" methods to add a given style attribute and also supporting a boolean parameter to also add the style attribute with vendor prefixes (webkit, moz, ms, o, khtml) if we want to.
 */
var CB_Elements = function() { return CB_Elements; };
{
	CB_Elements.initialized = false; //It will tells whether the object has been initialized or not.


	//Initializes all values:
	CB_Elements.init = function()
	{
		//If this is the fist time:
		if (CB_Elements.initialized) { return CB_Elements; }

		//The object has been initialized:
		CB_Elements.initialized = true;
		
		//TODO.
			
		if (!document.body)
		{
			var tagBody = CB_Elements.tag("body", document);
			if (typeof(tagBody) !== "undefined" && tagBody !== null && typeof(tagBody[0]) !== "undefined" && tagBody[0] !== null)
			{
				document.body = tagBody[0];
			}
		}
		
		return CB_Elements;
	}
	
	
	CB_Elements._tagCache = {};
	/**
	 * Returns elements by their tag name.
	 *  @function
	 *  @param {string} [tagName='*'] - The name of the tag whose elements we want to find. Use asterisk ("*") in the case that we want all the elements.
	 *  @param {Node} [baseElement=document] - The node element parent where we want to focus our search.
	 *  @param {boolean} [useCache={@link CB_Configuration.CrossBase.CB_Elements_tag_USE_CACHE}] - Defines whether to try to get the result from an internal cache (it will exist if we previously called the function with the same parameters) or not. The internal cache will be updated when this parameter is set to false or it will be created automatically when it did not exist before.
	 *  @returns {NodeList|array} Returns the elements (NodeList or array, depending on the web client).
	 */
	CB_Elements.tag = function(tagName, baseElement, useCache)
	{
		if (typeof(baseElement) === "undefined" || baseElement === null) { baseElement = document; } //Uses document as default base element.
		if (typeof(useCache) === "undefined" || useCache === null) { useCache = CB_Configuration[CB_BASE_NAME].CB_Elements_tag_USE_CACHE; }
		
		//If no tag name is sent, uses "*" (all) by default:
		tagName = CB_trim(tagName).toLowerCase();
		if (tagName === "") { tagName = "*"; }
		
		if (!useCache || typeof(CB_Elements._tagCache[baseElement]) === "undefined" || CB_Elements._tagCache[baseElement] === null || typeof(CB_Elements._tagCache[baseElement][tagName]) === "undefined" || CB_Elements._tagCache[baseElement][tagName] === null)
		{
			if (typeof(CB_Elements._tagCache[baseElement]) === "undefined" || CB_Elements._tagCache[baseElement] === null)
			{
				CB_Elements._tagCache[baseElement] = {};
			}
			
			if (typeof(baseElement.getElementsByTagName) !== "undefined" && baseElement.getElementsByTagName !== null)
			{
				CB_Elements._tagCache[baseElement][tagName] = baseElement.getElementsByTagName(tagName);
				if (tagName === "*" && CB_Elements._tagCache[baseElement][tagName].length === 0 && typeof(document.all) !== "undefined" && document.all !== null)
				{
					CB_Elements._tagCache[baseElement][tagName] = document.all;
				}
			}
			else if (baseElement.querySelectorAll)
			{
				CB_Elements._tagCache[baseElement][tagName] = baseElement.querySelectorAll(tagName);
			}
			else if (document.querySelectorAll)
			{
				CB_Elements._tagCache[baseElement][tagName] = document.querySelectorAll(tagName);
			}
			else if (typeof(baseElement.all) !== "undefined" && baseElement.all !== null)
			{
				if (tagName === "*")
				{
					CB_Elements._tagCache[baseElement][tagName] = baseElement.all;
				}
				else
				{
					CB_Elements._tagCache[baseElement][tagName] = baseElement.all.tags(tagName);
				}
			}
			else if (typeof(document.all) !== "undefined" && document.all !== null)
			{
				if (tagName === "*")
				{
					CB_Elements._tagCache[baseElement][tagName] = document.all;
				}
				else
				{
					CB_Elements._tagCache[baseElement][tagName] = document.all.tags(tagName);
				}
			}
			else if (baseElement.layers || document.layers)
			{
				if (typeof(CB_Elements._tagCache[baseElement][tagName]) === "undefined" || CB_Elements._tagCache[baseElement][tagName] === null)
				{
					CB_Elements._tagCache[baseElement][tagName] = [];
				}

				var allElements = baseElement.layers || document.layers;
				
				//If we want all elements, then we get all of them:
				if (tagName === "*") { CB_Elements._tagCache[baseElement][tagName] = allElements; }
				//...otherwise, obtains all elements with the given tag name:
				else
				{
					//If any elements were obtained, we select just the ones with the desired tag name:
					var allElementsLength = allElements.length;
				
					var elementCurrent;
					for (var x = 0; x < allElementsLength; x++)
					{
						elementCurrent = allElements[x];
						if (elementCurrent !== null && typeof(elementCurrent.tagName) !== "undefined")
						{
							if (CB_trim(elementCurrent.tagName).toLowerCase() === tagName)
							{
								CB_Elements._tagCache[baseElement][tagName].push(elementCurrent);
							}
						}
					}
					//CB_Elements._tagCache[baseElement][tagName] = baseElement.layers[tagName];
				}
			}
			else if (typeof(CB_Elements._tagCache[baseElement][tagName]) === "undefined" || CB_Elements._tagCache[baseElement][tagName] === null)
			{
				CB_Elements._tagCache[baseElement][tagName] = [];
			}

			/*
			else if (baseElement.layers)
			{
				CB_Elements._tagCache[baseElement][tagName] = baseElement.layers[tagName];
			}
			else if (document.layers)
			{
				CB_Elements._tagCache[baseElement][tagName] = document.layers[tagName];
			}*/
			
			//If we used "*" and there is no elements, we try to use document.all instead (for old web clients):
			//if (tagName === "*" && CB_Elements._tagCache[baseElement][tagName].length === 0)
			//{
				//if (all in document) { CB_Elements._tagCache[baseElement][tagName] = document.all; }
			//}
			CB_Elements._tagCache[baseElement][tagName] = CB_Elements._tagCache[baseElement][tagName] || [];
		}

		return CB_Elements._tagCache[baseElement][tagName];
	}


	/**
	 * Returns elements by their tag name, updating (or creating) the internal cache. Calls the {@link CB_Elements.tag} function internally, with the "useCache" parameter set to false.
	 *  @function
	 *  @param {string} [tagName='*'] - The name of the tag whose elements we want to find. Use asterisk ("*") in the case that we want all the elements.
	 *  @param {Node} [baseElement=document] - The node element parent where we want to focus our search.
	 *  @returns {NodeList|array} Returns the elements (NodeList or array, depending on the web client).
	 */
	CB_Elements.tagCacheUpdate = function(tagName, baseElement)
	{
		return CB_Elements.tag(tagName, baseElement, false);
	}

	
	/**
	 * Clears the internal cache user by {@link CB_Elements.tag} and others. If no parameter is given, whole internal cache will be cleared.
	 *  @function
	 *  @param {string} [tagName] - The name of the tag whose internal cache we want to clear. Use asterisk ("*") in the case that we want to clear the internal cache for {@link CB_Elements.tag} which is used when it is called with this exact parameter. If not provided, it will clear the whole internal cache or the internal cache that belongs to the "baseElement" given (if provided).
	 *  @param {Node} [baseElement] - The node element parent whose internal cache we want to clear. If not provided but "tagName" is provided, it will clear the internal cache which matches the given "tagName" for any nodes. If it is provided but "tagName" is not, it will clear all the internal cache that belongs to this node element.
	 *  @returns {Object} Returns the current internal cache after clearing it (if it is has been possible), which is an associative array of two dimensions (JavaScript object) whose first index belongs to the nodes, the second and last index belongs to the tag name and the value belongs to the returning value of the {@link CB_Elements.tag} function when it was called for those parameters.
	 */
	CB_Elements.tagCacheClear = function(tagName, baseElement)
	{
		tagName = CB_trim(tagName).toLowerCase();
		
		//If no base element and no tag name are defined, we clean all the array:
		if (typeof(baseElement) === "undefined" && tagName === "" || baseElement === null && (typeof(tagName) === "undefined" || tagName === null))
		{
			CB_Elements._tagCache = {};
		}
		//...otherwise, if both base element and tag name are defined, we clear the elements of that base element:
		else if (typeof(baseElement) !== "undefined" && baseElement !== null && tagName !== "")
		{
			if (typeof(CB_Elements._tagCache[baseElement]) !== "undefined" && CB_Elements._tagCache[baseElement] !== null)
			{
				if (typeof(CB_Elements._tagCache[baseElement][tagName]) !== "undefined" && CB_Elements._tagCache[baseElement][tagName] !== null)
				{
					CB_Elements._tagCache[baseElement][tagName] = null;
				}
			}
		}
		//...otherwise, if a base element is defined (but not a tagName), we clear all elements of that base element:
		else if (typeof(baseElement) !== "undefined" && baseElement !== null)
		{
			if (typeof(CB_Elements._tagCache[baseElement]) !== "undefined" && CB_Elements._tagCache[baseElement] !== null)
			{
				CB_Elements._tagCache[baseElement] = {};
			}
		}
		//...otherwise, if a tag name is defined (but not a base element), we clear all the elements of that tag name from all the element bases:
		else if (tagName !== "")
		{
			for (var currentBaseElement in CB_Elements._tagCache)
			{
				if (typeof(CB_Elements._tagCache[currentBaseElement][tagName]) !== "undefined" && CB_Elements._tagCache[currentBaseElement][tagName] !== null)
				{
					CB_Elements._tagCache[currentBaseElement][tagName] = null;
				}
			}
		}
		
		return CB_Elements._tagCache;
	}


	/**
	 * Alias for {@link CB_Elements.tagRemove}.
	 *  @function CB_Elements.removeByTagName
	 *  @see {@link CB_Elements.tagRemove}
	 */	
	/**
	 * Removes elements by their tag name.
	 *  @function
	 *  @param {string} [tagName='*'] - The name of the tag whose elements we want to delete. Use asterisk ("*") in the case that we want all the elements.
	 *  @param {Node} [baseElement=document] - The node element parent where we want to focus our search.
	 *  @param {boolean} [useCache={@link CB_Configuration.CrossBase.CB_Elements_tag_USE_CACHE}] - Defines whether to try to get the result from an internal cache (it will exist if we previously called the function with the same parameters) or not. The internal cache will be updated when this parameter is set to false or it will be created automatically when it did not exist before.
	 */
	CB_Elements.tagRemove = CB_Elements.removeByTagName = function(tagName, baseElement, useCache)
	{
		if (typeof(baseElement) === "undefined" || baseElement === null) { baseElement = document; } //Uses document as default base element.
		tagName = CB_trim(tagName);
		if (tagName === "") { tagName = "*"; }

		var elementsOriginal = CB_Elements.tag(tagName, baseElement, useCache);
		if (typeof(elementsOriginal) !== "undefined" && elementsOriginal !== null && typeof(elementsOriginal.length) !== "undefined" && elementsOriginal.length !== null && elementsOriginal.length > 0)
		{
			var elements = [];
			var elementsLength = elementsOriginal.length;
			for (var x = 0; x < elementsLength; x++) { elements[x] = elementsOriginal[x]; }
			
			elementsLength = elements.length;
			for (var x = 0; x < elementsLength; x++)
			{
				//elements[x].parentNode.removeChild(elements[x]);
				CB_Elements.remove(elements[x]);
			}
			CB_Elements._tagCache[baseElement][tagName] = null;
		}
	}


	CB_Elements._classesCache = {};
	/**
	 * Returns elements by their class or classes name.
	 *  @function
	 *  @param {string} classNames - The name of the class or classes (separated by a blank space) whose elements we want to find. The order of the classes is just important for the internal cache.
	 *  @param {Node} [baseElement=document] - The node element parent where we want to focus our search.
	 *  @param {boolean} [useCache={@link CB_Configuration.CrossBase.CB_Elements_classes_USE_CACHE}] - Defines whether to try to get the result from an internal cache (it will exist if we previously called the function with the same parameters) or not. The internal cache will be updated when this parameter is set to false or it will be created automatically when it did not exist before.
	 *  @returns {NodeList|array} Returns the elements (NodeList or array, depending on the web client).
	 */
	CB_Elements.classes = function(classNames, baseElement, useCache)
	{
		if (typeof(useCache) === "undefined" || useCache === null) { useCache = CB_Configuration[CB_BASE_NAME].CB_Elements_classes_USE_CACHE; }
		if (typeof(baseElement) === "undefined" || baseElement === null) { baseElement = document; }
		
		//If no class name is sent, returns am empty array:
		classNames = CB_trim(classNames);//.toLowerCase();
		if (classNames === "") { return []; }
		
		if (!useCache || typeof(CB_Elements._classesCache[baseElement]) === "undefined" || CB_Elements._classesCache[baseElement] === null || typeof(CB_Elements._classesCache[baseElement][classNames]) === "undefined" || CB_Elements._classesCache[baseElement][classNames] === null)
		{
			if (typeof(CB_Elements._classesCache[baseElement]) === "undefined" || CB_Elements._classesCache[baseElement] === null)
			{
				CB_Elements._classesCache[baseElement] = {};
			}

			//CB_Elements._classesCache[baseElement][classNames] = baseElement.getElementsByClassName(classNames);
			if (typeof(baseElement.getElementsByClassName) !== "undefined" && baseElement.getElementsByClassName !== null)
			{
				CB_Elements._classesCache[baseElement][classNames] = baseElement.getElementsByClassName(classNames);
			}
			else if (baseElement.querySelectorAll)
			{
				CB_Elements._classesCache[baseElement][classNames] = baseElement.querySelectorAll("." + classNames.replace(/ /g, "."));
			}
			else if (document.querySelectorAll)
			{
				CB_Elements._classesCache[baseElement][classNames] = document.querySelectorAll("." + classNames.replace(/ /g, "."));
			}
			else
			{
				//Obtains all elements:
				var allElements = CB_Elements.tag("*", baseElement, useCache);

				//If any elements were obtained, we select just the ones with the desired class name:
				var allElementsLength = allElements.length;
				if (allElementsLength > 0)
				{
					if (typeof(CB_Elements._classesCache[baseElement][classNames]) === "undefined" || CB_Elements._classesCache[baseElement][classNames] === null)
					{
						CB_Elements._classesCache[baseElement][classNames] = [];
					}
					
					/*
					//classNames = classNames.toLowerCase();
					var elementCurrent;
					var classes;
					var classesLength;
					for (var x = 0; x < allElementsLength; x++)
					{
						elementCurrent = allElements[x];
						if (elementCurrent !== null)
						{
							classes = elementCurrent.className.split(" ");
							classesLength = classes.length;
							for (var y = 0; y < classesLength; y++)
							{
								classes[y] = CB_trim(classes[y]).toLowerCase();
								//TODO: make it compatible with regular expressions (be careful with web clients not compatible with RegExp!).
								if (classes[y] === classNames)
								{
									CB_Elements._classesCache[baseElement][classNames].push(elementCurrent);
									break;
								}
							}
						}
					}
					*/
					//TODO: make it compatible with regular expressions (be careful with web clients not compatible with RegExp!).
					var classesDesired = classNames.split(" ");
					var classesDesiredLength = classesDesired.length;
					for (var x = 0; x < classesDesiredLength; x++)
					{
						classesDesired[x] = CB_trim(classesDesired[x]);//.toLowerCase();
					}
					
					var elementCurrent;
					var elementCurrentClass;
					var classes;
					var classesLength;
					var y, z;
					var allClassesFound;
					for (x = 0; x < allElementsLength; x++)
					{
						elementCurrent = allElements[x];
						if (elementCurrent !== null)
						{
							elementCurrentClass = CB_trim(elementCurrent.className);
							if (elementCurrentClass === "") { continue; }
							classes = elementCurrentClass.split(" ");
							classesLength = classes.length;
							for (y = 0; y < classesLength; y++)
							{
								classes[y] = CB_trim(classes[y]);//.toLowerCase();
							}

							allClassesFound = true;
							for (z = 0; z < classesDesiredLength; z++)
							{
								if (CB_indexOf(classes, classesDesired[z]) === -1)
								{
									allClassesFound = false;
									break;
								}
							}
							
							if (allClassesFound)
							{
								CB_Elements._classesCache[baseElement][classNames].push(elementCurrent);
								//elements[elements.length] = elementCurrent;
							}
						}
					}
				}
				

			}
			/*
			else if (typeof(baseElement.all) !== "undefined" && baseElement.all !== null)
			{
				//allElements = baseElement.all;
				allElements = CB_Elements.tag("*", baseElement, useCache);
			}
			else if (typeof(document.all) !== "undefined" && document.all !== null)
			{
				//allElements = document.all;
				allElements = CB_Elements.tag("*", document, useCache);
			}
			*/
			/*
			else if (baseElement.layers)
			{
				CB_Elements._classesCache[baseElement][classNames] = baseElement.layers[classNames];
			}
			else if (document.layers)
			{
				CB_Elements._classesCache[baseElement][classNames] = document.layers[classNames];
			}*/
			
			CB_Elements._classesCache[baseElement][classNames] = CB_Elements._classesCache[baseElement][classNames] || [];
		}

		return CB_Elements._classesCache[baseElement][classNames];
	}


	/**
	 * Returns elements by their class or classes name, updating (or creating) the internal cache. Calls the {@link CB_Elements.classes} function internally, with the "useCache" parameter set to false.
	 *  @function
	 *  @param {string} classNames - The name of the class or classes (separated by a blank space) whose elements we want to find. The order of the classes is just important for the internal cache.
	 *  @param {Node} [baseElement=document] - The node element parent where we want to focus our search.
	 *  @returns {NodeList|array} Returns the elements (NodeList or array, depending on the web client).
	 */
	CB_Elements.classesCacheUpdate = function(classNames, baseElement)
	{
		return CB_Elements.classes(classNames, baseElement, false);
	}


	/**
	 * Clears the internal cache used by {@link CB_Elements.classes} and others. If no parameter is given, whole internal cache will be cleared.
	 *  @function
	 *  @param {string} [classNames] - The name of the class or classes (separated by a blank space) whose internal cache we want to clear. The order of the classes is important for the internal cache. If not provided, it will clear the whole internal cache or the internal cache that belongs to the "baseElement" given (if provided).
	 *  @param {Node} [baseElement] - The node element parent whose internal cache we want to clear. If not provided but "classNames" is provided, it will clear the internal cache which matches the given "classNames" for any nodes. If it is provided but "classNames" is not, it will clear all the internal cache that belongs to this node element.
	 *  @returns {Object} Returns the current internal cache after cleaning it (if it is has been possible), which is an associative array of two dimensions (JavaScript object) whose first index belongs to the nodes, the second and last index belongs to the class name or class names and the value belongs to the returning value of the {@link CB_Elements.classes} function when it was called for those parameters.
	 */
	CB_Elements.classesCacheClear = function(classNames, baseElement)
	{
		classNames = CB_trim(classNames);//.toLowerCase();
		
		//If no base element and no class name are defined, we clean all the array:
		if (typeof(baseElement) === "undefined"  && classNames === "" || baseElement === null && (typeof(classNames) === "undefined" || classNames === null))
		{
			CB_Elements._classesCache = {};
		}
		//...otherwise, if both base element and class name are defined, we clear the elements of that base element:
		else if (typeof(baseElement) !== "undefined" && baseElement !== null && classNames !== "")
		{
			if (typeof(CB_Elements._classesCache[baseElement]) !== "undefined" && CB_Elements._classesCache[baseElement] !== null)
			{
				if (typeof(CB_Elements._classesCache[baseElement][classNames]) !== "undefined" && CB_Elements._classesCache[baseElement][classNames] !== null)
				{
					CB_Elements._classesCache[baseElement][classNames] = null;
				}
			}
		}
		//...otherwise, if a base element is defined (but not a classNames), we clear all elements of that base element:
		else if (typeof(baseElement) !== "undefined" && baseElement !== null)
		{
			if (typeof(CB_Elements._classesCache[baseElement]) !== "undefined" && CB_Elements._classesCache[baseElement] !== null)
			{
				CB_Elements._classesCache[baseElement] = {};
			}
		}
		//...otherwise, if a class name is defined (but not a base element), we clear all the elements of that class name from all the element bases:
		else if (classNames !== "")
		{
			for (var currentBaseElement in CB_Elements._classesCache)
			{
				if (typeof(CB_Elements._classesCache[currentBaseElement][classNames]) !== "undefined" && CB_Elements._classesCache[currentBaseElement][classNames] !== null)
				{
					CB_Elements._classesCache[currentBaseElement][classNames] = null;
				}
			}
		}
		
		return CB_Elements._classesCache;
	}


	/**
	 * Alias for {@link CB_Elements.classesRemove}.
	 *  @function CB_Elements.removeByClasses
	 *  @see {@link CB_Elements.classesRemove}
	 */	
	/**
	 * Removes elements by their class or classes name.
	 *  @function
	 *  @param {string} classNames - The name of the class or classes (separated by a blank space) whose elements we want to delete. The order of the classes is just important for the internal cache.
	 *  @param {Node} [baseElement=document] - The node element parent where we want to focus our search.
	 *  @param {boolean} [useCache={@link CB_Configuration.CrossBase.CB_Elements_classes_USE_CACHE}] - Defines whether to try to get the result from an internal cache (it will exist if we previously called the function with the same parameters) or not. The internal cache will be updated when this parameter is set to false or it will be created automatically when it did not exist before.
	 */
	CB_Elements.classesRemove = CB_Elements.removeByClasses = function(classNames, baseElement, useCache)
	{
		if (typeof(baseElement) === "undefined" || baseElement === null) { baseElement = document; }
		classNames = CB_trim(classNames);//.toLowerCase();
		if (classNames === "") { return; }
		
		var elementsOriginal = CB_Elements.classes(classNames, baseElement, useCache);
		if (typeof(elementsOriginal) !== "undefined" && elementsOriginal !== null && typeof(elementsOriginal.length) !== "undefined" && elementsOriginal.length !== null && elementsOriginal.length > 0)
		{
			var elements = [];
			var elementsLength = elementsOriginal.length;
			for (var x = 0; x < elementsLength; x++) { elements[x] = elementsOriginal[x]; }
			
			var elementsLength = elements.length;
			for (var x = 0; x < elementsLength; x++)
			{
				//elements[x].parentNode.removeChild(elements[x]);
				CB_Elements.remove(elements[x]);
			}
			CB_Elements._classesCache[baseElement][classNames] = null;
		}
	}


	CB_Elements._idCache = {};
	/**
	 * Alias for {@link CB_Elements.id}.
	 *  @function CB_Elements.byId
	 *  @see {@link CB_Elements.id}
	 */	
	/**
	 * Alias for {@link CB_Elements.id}.
	 *  @function CB_Elements.get
	 *  @see {@link CB_Elements.id}
	 */	
	/**
	 * Alias for {@link CB_Elements.id}.
	 *  @function CB_Elements.getById
	 *  @see {@link CB_Elements.id}
	 */	
	/**
	 * Returns an element by its ID.
	 *  @function
	 *  @param {string} id - The identifier of the element that we want to find.
	 *  @param {boolean} [useCache={@link CB_Configuration.CrossBase.CB_Elements_id_USE_CACHE}] - Defines whether to try to get the result from an internal cache (it will exist if we previously called the function with the same parameters) or not. The internal cache will be updated when this parameter is set to false or it will be created automatically when it did not exist before.
	 *  @returns {Node|Object|null} Returns the elements (Node or object, depending on the web client). It will return null when not found.
	 */
	CB_Elements.id = CB_Elements.byId = CB_Elements.get = CB_Elements.getById = function(id, useCache)
	{
		if (typeof(useCache) === "undefined" || useCache === null) { useCache = CB_Configuration[CB_BASE_NAME].CB_Elements_id_USE_CACHE; }
		
		id = CB_trim(id);//.toLowerCase();
		
		//If no id is sent, returns null:
		if (id === "") { return null; }
		
		if (!useCache || typeof(CB_Elements._idCache[id]) === "undefined" || CB_Elements._idCache[id] === null)
		{
			if (document.getElementById)
			{
				CB_Elements._idCache[id] = document.getElementById(id);
			}
			else if (document.querySelector)
			{
				CB_Elements._idCache[id] = document.querySelector("#" + id);
			}
			else if (document.all)
			{
				if (typeof(document.all) !== "function")
				{
					CB_Elements._idCache[id] = document.all[id];
				}
				else { CB_Elements._idCache[id] = document.all(id); }
			}
			else if (document.layers)
			{
				CB_Elements._idCache[id] = document.layers[id];
			}
			else { CB_Elements._idCache[id] = null; }
			
			CB_Elements._idCache[id] = CB_Elements._idCache[id] || null;
		}
		
		return CB_Elements._idCache[id];
	}


	/**
	 * Returns an element by its ID, updating (or creating) the internal cache. Calls the {@link CB_Elements.id} function internally, with the "useCache" parameter set to false.
	 *  @function
	 *  @param {string} id - The identifier of the element that we want to find.
	 *  @returns {node|Object|null} Returns the elements (Node or object, depending on the web client). It will return null when not found.
	 */
	CB_Elements.idCacheUpdate = function(id)
	{
		return CB_Elements.id(id, false);
	}


	/**
	 * Clears the internal cache used by {@link CB_Elements.id} and others. If no parameter is given, whole internal cache will be cleared.
	 *  @function
	 *  @param {string} [id] - The identifier of the element whose internal cache we want to clear. If not provided, it will clear the whole internal cache.
	 *  @returns {Object} Returns the current internal cache after cleaning it (if it is has been possible), which is an associative array of one dimension (JavaScript object) whose first and unique index belongs to the identifier and the value belongs to each element.
	 */
	CB_Elements.idCacheClear = function(id)
	{
		id = CB_trim(id);
		if (id === "") { CB_Elements._idCache = {}; }
		else { CB_Elements._idCache[id] = null; }
		return CB_Elements._idCache;
	}


	/**
	 * Alias for {@link CB_Elements.idRemove}.
	 *  @function CB_Elements.removeById
	 *  @see {@link CB_Elements.idRemove}
	 */
	/**
	 * Removes an element by its ID.
	 *  @function
	 *  @param {string} id - The identifier of the element that we want to delete.
	 *  @param {boolean} [useCache={@link CB_Configuration.CrossBase.CB_Elements_id_USE_CACHE}] - Defines whether to try to get the result from an internal cache (it will exist if we previously called the function with the same parameters) or not. The internal cache will be updated when this parameter is set to false or it will be created automatically when it did not exist before.
	 */
	CB_Elements.idRemove = CB_Elements.removeById = function(id, useCache)
	{
		id = CB_trim(id);
		if (id === "") { return; }
		var element = CB_Elements.id(id, useCache);
		//if (typeof(CB_Elements._idCache[id]) !== "undefined" && CB_Elements._idCache[id] !== null)
		//{
			CB_Elements._idCache[id] = null;
		//}
		return CB_Elements.remove(element);
	}


	/**
	 * Removes an element given.
	 *  @function
	 *  @param {Node} element - The element that we want to delete.
	 */
	CB_Elements.remove = function(element)
	{
		if (typeof(element) !== "undefined" && element !== null)
		{
			var elementParent = CB_Elements.getParent(element);
			if (typeof(elementParent) !== "undefined" && elementParent !== null && typeof(elementParent.removeChild) !== "undefined" && elementParent.removeChild !== null)
			{
				///////return elementParent.removeChild(element);
				elementParent.removeChild(element);
			}
			else if (typeof(element.removeNode) !== "undefined" && element.removeNode !== null)
			{
				///////return element.removeNode(true);
				element.removeNode(true);
			}
			else if (document.all)
			{
				if (typeof(document.all) !== "function" && element.id && typeof(document.all[element.id]) !== "undefined" && document.all[element.id] !== null)
				{
					document.all[element.id].innerHTML = document.all[element.id].outerHTML = "";
				}
				else if (element.id)
				{
					//Uses try-catch because otherwise it fails on IE 8:
					try
					{
						document.all(element.id).innerHTML = document.all(element.id).outerHTML = "";
					} catch(E) {}
				}
			}
			else if (document.layers && element.id)
			{
				document.layers[element.id].visibility = "hide";
				delete document.layers[element.id];
			}
			
			if (typeof(element.remove) !== "undefined") { element.remove(); }
			///////////////delete(element); //Just in case (for some strange web clients). NOTE: commented since it gives problems with JSDoc ("ERROR: Unable to parse CB_Elements.js: Deleting local variable in strict mode").
			element = null;
			element = undefined;
		}
	}


	/**
	 * Returns an array with the parents of a given element, with the topmost parent in the highest index:
	 *  @function
	 *  @param {Node} element - The element whose parents we want to get.
	 *  @returns {array}
	 */
	CB_Elements.getParents = function(element)
	{
		var elementParents = [];
		var x = 0;
		var currentParent;
		while (currentParent = CB_Elements.getParent(element))
		{
			elementParents[x++] = currentParent;
			element = currentParent;
		}
		return elementParents;
	}


	/**
	 * Returns an array with the parents of a given element (by its identifier), with the topmost parent in the highest index:
	 *  @function
	 *  @param {string} elementId - The identifier of the element whose parents we want to get.
	 *  @returns {array}
	 */
	CB_Elements.getParentsById = function(elementId)
	{
		return CB_Elements.getParents(CB_Elements.id(elementId));
	}


	/**
	 * Returns the first parent of a given element:
	 *  @function
	 *  @param {Node} element - The element whose parent we want to get.
	 *  @returns {Node|null} Returns null if the parent cannot be found.
	 */
	CB_Elements.getParent = function(element)
	{
		if (typeof(element) === "undefined" || element === null) { return null; }
		var elementParent = null;
		if (typeof(element.parentNode) !== "undefined" && element.parentNode !== null)
		{
			elementParent = element.parentNode;
		}
		else if (typeof(element.parentElement) !== "undefined" && element.parentElement !== null)
		{
			elementParent = element.parentElement;
		}
		return elementParent;
	}


	/**
	 * Returns the first parent of a given element (by its identifier):
	 *  @function
	 *  @param {string} elementId - The identifier of the element whose parent we want to get.
	 *  @returns {Node|null} Returns null if the parent cannot be found.
	 */
	CB_Elements.getParentById = function(elementId)
	{
		return CB_Elements.getParent(CB_Elements.id(elementId));
	}


	/**
	 * Changes a desired element property with the given value.
	 *  @function
	 *  @param {Node} element - The element whose property we want to modify.
	 *  @param {string} property - The name of the property that we want to modify.
	 *  @param {*} propertyValue - The value desired for the property.
	 *  @param {boolean} [checkValues=false] - If set to true, it will only modify the property if the current value is different from the given one.
	 *  @param {function} [onSetProperty] - Callback function that will be called if the property of the element has been set, after doing it (this will happens always if "checkValues" is false). The first and unique parameter passed will be the affected element itself.
	 *  @returns {Node|null} Returns the given element again or null.
	 */
	CB_Elements.setProperty = function(element, property, propertyValue, checkValues, onSetProperty)
	{
		if (typeof(element) === "undefined" || element === null) { return null; }
		if (!checkValues || element[property] !== propertyValue)
		{
			element[property] = propertyValue;
			if (typeof(onSetProperty) === "function") { onSetProperty(element); }
		}
		return element;
	}


	/**
	 * Changes a desired element property with the given value (by its identifier).
	 *  @function
	 *  @param {string} elementId - The identifier of the element whose property we want to modify.
	 *  @param {string} property - The name of the property that we want to modify.
	 *  @param {*} propertyValue - The value desired for the property.
	 *  @param {boolean} [checkValues=false] - If set to true, it will only modify the property if the current value is different from the given one.
	 *  @param {function} [onSetProperty] - Callback function that will be called if the property of the element has been set, after doing it (this will happens always if "checkValues" is false). The first and unique parameter passed will be the affected element itself.
	 *  @returns {Node|null} Returns the affected element (if any) or null otherwise.
	 */
	CB_Elements.setPropertyById = function(elementId, property, propertyValue, checkValues, onSetProperty)
	{
		return CB_Elements.setProperty(CB_Elements.id(elementId), property, propertyValue, checkValues, onSetProperty);
	}


	/**
	 * Inserts the desired content inside a given element (using [innerHTML]{@link https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML}).
	 *  @function
	 *  @param {Node} container - The element whose content we want to modify.
	 *  @param {string} content - The content that we want to add.
	 *  @param {string} [displayValue] - If provided, it will call {@link CB_Elements.show} internally after inserting the content to set the given [display]{@link https://developer.mozilla.org/en-US/docs/Web/CSS/display} property to the element.
	 *  @param {boolean} [checkValues=false] - If it is set to true, it will only change the content if the current one is different from the given one and it will pass the same parameter to {@link CB_Elements.show} if it is called internally (when "displayValue" is given).
	 *  @param {boolean} [computed=false] - If "displayValue" is given, it will pass this parameter to {@link CB_Elements.show} if it is called internally (when "displayValue" is given).
	 *  @param {function} [onContentWritten] - Callback function that will be called if the content has been written, after doing it (this will happens always if "checkValues" is false). The unique parameter passed will be the container itself.
	 *  @param {function} [onShow] - If "displayValue" is given, it will pass this parameter to {@link CB_Elements.show} when it is called internally.
	 *  @param {boolean} [append=false] - If set to true, it will append the given content to the existing one instead of overwritten it. By default, it appends it at the end unless that the "appendAtBeginning" is set to true.
	 *  @param {boolean} [appendAtBeginning=false] - If set to true, it will append the given content to the existing one instead of overwritten it.
	 *  @returns {Node} Returns the given container again.
	 */
	CB_Elements.insertContent = function(container, content, displayValue, checkValues, computed, onContentWritten, onShow, append, appendAtBeginning)
	{
		if (container !== null)
		{
			if (!checkValues || append || container.innerHTML !== content)
			{
				if (append)
				{
					container.innerHTML = appendAtBeginning ?  content + container.innerHTML : container.innerHTML + content;
				}
				else { container.innerHTML = content; }
				if (typeof(onContentWritten) === "function") { onContentWritten(container); }
			}
			if (displayValue) { CB_Elements.show(container, displayValue, checkValues, computed, onShow); }
		}
		return container;
	}


	/**
	 * Appends the desired content inside a given element, keeping the existing one (using [innerHTML]{@link https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML}). Calls the {@link CB_Elements.insertContent} internally.
	 *  @function
	 *  @param {Node} container - The element whose content we want to modify.
	 *  @param {string} content - The content that we want to add.
	 *  @param {string} [displayValue] - If provided, it will call {@link CB_Elements.show} internally after inserting the content to set the given [display]{@link https://developer.mozilla.org/en-US/docs/Web/CSS/display} property to the element.
	 *  @param {boolean} [checkValues=false] - If it is set to true, it will only change the content if the current one is different from the given one and it will pass the same parameter to {@link CB_Elements.show} if it is called internally (when "displayValue" is given).
	 *  @param {boolean} [computed=false] - If "displayValue" is given, it will pass this parameter to {@link CB_Elements.show} if it is called internally (when "displayValue" is given).
	 *  @param {function} [onContentWritten] - Callback function that will be called if the content has been written, after doing it (this will happens always if "checkValues" is false). The unique parameter passed will be the container itself.
	 *  @param {function} [onShow] - If "displayValue" is given, it will pass this parameter to {@link CB_Elements.show} when it is called internally.
	 *  @param {boolean} [appendAtBeginning=false] - If set to true, it will append the given content to the existing one instead of overwritten it.
	 *  @returns {Node} Returns the given container again.
	 */
	CB_Elements.appendContent = function(container, content, displayValue, checkValues, computed, onContentWritten, onShow, appendAtBeginning)
	{
		return CB_Elements.insertContent(container, content, displayValue, checkValues, computed, onContentWritten, onShow, true, appendAtBeginning);
	}


	/**
	 * Appends the desired content inside a given element at the beginning, keeping the existing one (using [innerHTML]{@link https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML}). Calls the {@link CB_Elements.insertContent} internally.
	 *  @function
	 *  @param {Node} container - The element whose content we want to modify.
	 *  @param {string} content - The content that we want to add.
	 *  @param {string} [displayValue] - If provided, it will call {@link CB_Elements.show} internally after inserting the content to set the given [display]{@link https://developer.mozilla.org/en-US/docs/Web/CSS/display} property to the element.
	 *  @param {boolean} [checkValues=false] - If it is set to true, it will only change the content if the current one is different from the given one and it will pass the same parameter to {@link CB_Elements.show} if it is called internally (when "displayValue" is given).
	 *  @param {boolean} [computed=false] - If "displayValue" is given, it will pass this parameter to {@link CB_Elements.show} if it is called internally (when "displayValue" is given).
	 *  @param {function} [onContentWritten] - Callback function that will be called if the content has been written, after doing it (this will happens always if "checkValues" is false). The unique parameter passed will be the container itself.
	 *  @param {function} [onShow] - If "displayValue" is given, it will pass this parameter to {@link CB_Elements.show} when it is called internally.
	 *  @returns {Node} Returns the given container again.
	 */
	CB_Elements.appendContentBeginning = function(container, content, displayValue, checkValues, computed, onContentWritten, onShow)
	{
		return CB_Elements.insertContent(container, content, displayValue, checkValues, computed, onContentWritten, onShow, true, true);
	}


	/**
	 * Inserts the desired content inside a given element (using [innerHTML]{@link https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML}), by its identifier.
	 *  @function
	 *  @param {string} containerId - The identifier of the element whose content we want to modify.
	 *  @param {string} content - The content that we want to add.
	 *  @param {string} [displayValue] - If provided, it will call {@link CB_Elements.show} internally after inserting the content to set the given [display]{@link https://developer.mozilla.org/en-US/docs/Web/CSS/display} property to the element.
	 *  @param {boolean} [checkValues=false] - If it is set to true, it will only change the content if the current one is different from the given one and it will pass the same parameter to {@link CB_Elements.show} if it is called internally (when "displayValue" is given).
	 *  @param {boolean} [computed=false] - If "displayValue" is given, it will pass this parameter to {@link CB_Elements.show} if it is called internally (when "displayValue" is given).
	 *  @param {function} [onContentWritten] - Callback function that will be called if the content has been written, after doing it (this will happens always if "checkValues" is false). The unique parameter passed will be the affected container itself.
	 *  @param {function} [onShow] - If "displayValue" is given, it will pass this parameter to {@link CB_Elements.show} when it is called internally.
	 *  @param {boolean} [append=false] - If set to true, it will append the given content to the existing one instead of overwritten it. By default, it appends it at the end unless that the "appendAtBeginning" is set to true.
	 *  @param {boolean} [appendAtBeginning=false] - If set to true, it will append the given content to the existing one instead of overwritten it.
	 *  @returns {Node|null} Returns the affected container (if any) or null otherwise.
	 */
	CB_Elements.insertContentById = function(containerId, content, displayValue, checkValues, computed, onContentWritten, onShow, append, appendAtBeginning)
	{
		return CB_Elements.insertContent(CB_Elements.id(containerId), content, displayValue, checkValues, computed, onContentWritten, onShow, append, appendAtBeginning);
	}


	/**
	 * Appends the desired content inside a given element, keeping the existing one (using [innerHTML]{@link https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML}), by its identifier. Calls the {@link CB_Elements.insertContent} internally.
	 *  @function
	 *  @param {string} containerId - The identifier of the element whose content we want to modify.
	 *  @param {string} content - The content that we want to add.
	 *  @param {string} [displayValue] - If provided, it will call {@link CB_Elements.show} internally after inserting the content to set the given [display]{@link https://developer.mozilla.org/en-US/docs/Web/CSS/display} property to the element.
	 *  @param {boolean} [checkValues=false] - If it is set to true, it will only change the content if the current one is different from the given one and it will pass the same parameter to {@link CB_Elements.show} if it is called internally (when "displayValue" is given).
	 *  @param {boolean} [computed=false] - If "displayValue" is given, it will pass this parameter to {@link CB_Elements.show} if it is called internally (when "displayValue" is given).
	 *  @param {function} [onContentWritten] - Callback function that will be called if the content has been written, after doing it (this will happens always if "checkValues" is false). The unique parameter passed will be the affected container itself.
	 *  @param {function} [onShow] - If "displayValue" is given, it will pass this parameter to {@link CB_Elements.show} when it is called internally.
	 *  @param {boolean} [append=false] - If set to true, it will append the given content to the existing one instead of overwritten it. By default, it appends it at the end unless that the "appendAtBeginning" is set to true.
	 *  @param {boolean} [appendAtBeginning=false] - If set to true, it will append the given content to the existing one instead of overwritten it.
	 *  @returns {Node|null} Returns the affected container (if any) or null otherwise.
	 */
	CB_Elements.appendContentById = function(containerId, content, displayValue, checkValues, computed, onContentWritten, onShow, appendAtBeginning)
	{
		return CB_Elements.insertContent(CB_Elements.id(containerId), content, displayValue, checkValues, computed, onContentWritten, onShow, true, appendAtBeginning);
	}


	/**
	 * Appends the desired content inside a given element at the beginning, keeping the existing one (using [innerHTML]{@link https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML}), by its identifier. Calls the {@link CB_Elements.insertContent} internally.
	 *  @function
	 *  @param {string} containerId - The identifier of the element whose content we want to modify.
	 *  @param {string} content - The content that we want to add.
	 *  @param {string} [displayValue] - If provided, it will call {@link CB_Elements.show} internally after inserting the content to set the given [display]{@link https://developer.mozilla.org/en-US/docs/Web/CSS/display} property to the element.
	 *  @param {boolean} [checkValues=false] - If it is set to true, it will only change the content if the current one is different from the given one and it will pass the same parameter to {@link CB_Elements.show} if it is called internally (when "displayValue" is given).
	 *  @param {boolean} [computed=false] - If "displayValue" is given, it will pass this parameter to {@link CB_Elements.show} if it is called internally (when "displayValue" is given).
	 *  @param {function} [onContentWritten] - Callback function that will be called if the content has been written, after doing it (this will happens always if "checkValues" is false). The unique parameter passed will be the affected container itself.
	 *  @param {function} [onShow] - If "displayValue" is given, it will pass this parameter to {@link CB_Elements.show} when it is called internally.
	 *  @param {boolean} [append=false] - If set to true, it will append the given content to the existing one instead of overwritten it. By default, it appends it at the end unless that the "appendAtBeginning" is set to true.
	 *  @returns {Node|null} Returns the affected container (if any) or null otherwise.
	 */
	CB_Elements.appendContentByIdBeginning = function(containerId, content, displayValue, checkValues, computed, onContentWritten, onShow)
	{
		return CB_Elements.insertContent(CB_Elements.id(containerId), content, displayValue, checkValues, computed, onContentWritten, onShow, true, true);
	}


	/**
	 * Returns the style of an element, computed or static:
	 *  @function
	 *  @param {Node} element - The element whose style property we want to get.
	 *  @param {boolean} [computed=false] - If it is set to true, it will try to use the native function [window.getComputedStyle]{@link https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle} (if available).
	 *  @returns {Object|null} Returns an associative array (JavaScript object) with all the styles retrieved or null if nothing can be retrieved.
	 */
	CB_Elements.getStyle = function(element, computed)
	{
		if (typeof(element) === "undefined" || element === null) { return null; }
		
		if (computed)
		{
			 if ("getComputedStyle" in window && window.getComputedStyle)
			 {
				 return window.getComputedStyle(element, null);
			 }
			 else if (element.currentStyle)
			 {
				 return element.currentStyle;
			 }
		}
		
		if (element.style)
		{
			return element.style;
		}
		
		return null;
	}


	/**
	 * Returns the style of an element, computed or static (by its identifier):
	 *  @function
	 *  @param {string} elementId - The identifier of the element whose style property we want to get.
	 *  @param {boolean} [computed=false] - If it is set to true, it will try to use the native function [window.getComputedStyle]{@link https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle} (if available).
	 *  @returns {Object|null} Returns an associative array (JavaScript object) with all the styles retrieved or null if nothing can be retrieved.
	 */
	CB_Elements.getStyleById = function(elementId, computed)
	{
		return CB_Elements.getStyle(CB_Elements.id(elementId), computed);
	}


	/**
	 * Returns the desired attribute value from the style of an element, computed or static:
	 *  @function
	 *  @param {Node} element - The element whose attribute value from its style we want to get.
	 *  @param {string} attribute - The name of the attribute whose value we want to get from the style.
	 *  @param {boolean} [computed=false] - If it is set to true, it will try to use the native function [window.getComputedStyle]{@link https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle} (if available).
	 *  @returns {*} Returns null if nothing can be retrieved.
	 *  @todo Think about supporting a boolean parameter to try to find the attribute having into account vendor prefixes (webkit, moz, ms, o, khtml).
	 */
	CB_Elements.getStyleProperty = function(element, attribute, computed)
	{
		//If we have received a string instead of an element, we try to get an element with that string as id:
		//if (CB_isString(element)) { element = CB_Elements.id(element); }

		var elementStyle = CB_Elements.getStyle(element, computed);
		if (elementStyle !== null && typeof(elementStyle[attribute]) !== "undefined") { return elementStyle[attribute]; }
		
		return null;
	}


	/**
	 * Returns the desired attribute value from the style of an element, computed or static (by its identifier):
	 *  @function
	 *  @param {string} elementId - The identifier of the element whose attribute value from its style we want to get.
	 *  @param {string} attribute - The name of the attribute whose value we want to get from the style.
	 *  @param {boolean} [computed=false] - If it is set to true, it will try to use the native function [window.getComputedStyle]{@link https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle} (if available).
	 *  @returns {*} Returns null if nothing can be retrieved.
	 *  @todo Think about supporting a boolean parameter to try to find the attribute having into account vendor prefixes (webkit, moz, ms, o, khtml).
	 */
	CB_Elements.getStylePropertyById = function(elementId, attribute, computed)
	{
		return CB_Elements.getStyleProperty(CB_Elements.id(elementId), attribute, computed);
	}


	/**
	 * Returns the integer value or values (base decimal) of a desired attribute from the style of an element, computed or static:
	 *  @function
	 *  @param {Node} element - The element whose attribute value from its style we want to get.
	 *  @param {string} attribute - The name of the attribute whose value we want to get from the style.
	 *  @param {boolean} [computed=false] - If it is set to true, it will try to use the native function [window.getComputedStyle]{@link https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle} (if available).
	 *  @returns {array} Returns a numeric array with the values retrieved. If nothing could be retrieved, the first and unique index of the array will contain the value of zero (0).
	 *  @todo Think about supporting a boolean parameter to try to find the attribute having into account vendor prefixes (webkit, moz, ms, o, khtml).
	 */
	CB_Elements.getStylePropertyInteger = function(element, attribute, computed)
	{
		return CB_Elements.getStylePropertyNumeric(element, attribute, computed, true);
	}


	/**
	 * Returns the integer value or values (base decimal) of a desired attribute from the style of an element, computed or static (by its identifier):
	 *  @function
	 *  @param {string} elementId - The identifier of the element whose attribute value from its style we want to get.
	 *  @param {string} attribute - The name of the attribute whose value we want to get from the style.
	 *  @param {boolean} [computed=false] - If it is set to true, it will try to use the native function [window.getComputedStyle]{@link https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle} (if available).
	 *  @returns {array} Returns a numeric array with the values retrieved. If nothing could be retrieved, the first and unique index of the array will contain the value of zero (0).
	 *  @todo Think about supporting a boolean parameter to try to find the attribute having into account vendor prefixes (webkit, moz, ms, o, khtml).
	 */
	CB_Elements.getStylePropertyIntegerById = function(elementId, attribute, computed)
	{
		return CB_Elements.getStylePropertyInteger(CB_Elements.id(elementId), attribute, computed);
	}


	/**
	 * Returns the numeric value or values (base decimal) of a desired attribute from the style of an element, computed or static:
	 *  @function
	 *  @param {Node} element - The element whose attribute value from its style we want to get.
	 *  @param {string} attribute - The name of the attribute whose value we want to get from the style.
	 *  @param {boolean} [computed=false] - If it is set to true, it will try to use the native function [window.getComputedStyle]{@link https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle} (if available).
	 *  @param {boolean} [parseToInteger=false] - If it is set to true, the value or values will be parsed to integer.
	 *  @returns {array} Returns a numeric array with the values retrieved. If nothing could be retrieved, the first and unique index of the array will contain the value of zero (0).
	 *  @todo Think about supporting a boolean parameter to try to find the attribute having into account vendor prefixes (webkit, moz, ms, o, khtml).
	 */
	CB_Elements.getStylePropertyNumeric = function(element, attribute, computed, parseToInteger)//, parseToFloat)
	{
		var propertyValue = CB_Elements.getStyleProperty(element, attribute, computed);
		var propertyValuesNumeric = [];

		if (typeof(propertyValue) !== "undefined" && propertyValue !== null)
		{
			var propertyValues = propertyValue.split(" "); 
			var propertyValuesLength = propertyValues.length;
			var y = 0;
			for (x = 0; x < propertyValues.length; x++)
			{
				propertyValue = parseFloat(propertyValues[x]);
				if (typeof(propertyValue) !== "undefined" && propertyValue !== null && !isNaN(propertyValue))
				{
					if (parseToInteger) { propertyValue = parseInt(propertyValue, 10); }
					//if (parseToFloat) { propertyValue = parseFloat(propertyValue); }
					//else { propertyValue = parseFloat(propertyValue); }
					
					propertyValuesNumeric[y++] = propertyValue;
					//break;
				}
			}
		}
		
		//if (propertyValue === null || CB_trim(propertyValue) === "") { propertyValue = 0; }
		if (propertyValuesNumeric.length === 0) { propertyValuesNumeric[0] = 0; } //If there are no values, it will returns 0 as the unique one.
		//if (isNaN(propertyValue)) { propertyValue = 0; }
		//if (isNaN(propertyValue)) { propertyValue = 0; }
		
		//return propertyValue;
		return propertyValuesNumeric;
	}


	/**
	 * Returns the numeric value or values (base decimal) of a desired attribute from the style of an element, computed or static (by its identifier):
	 *  @function
	 *  @param {string} elementId - The identifier of the element whose attribute value from its style we want to get.
	 *  @param {string} attribute - The name of the attribute whose value we want to get from the style.
	 *  @param {boolean} [computed=false] - If it is set to true, it will try to use the native function [window.getComputedStyle]{@link https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle} (if available).
	 *  @param {boolean} [parseToInteger=false] - If it is set to true, the value or values will be parsed to integer.
	 *  @returns {array} Returns a numeric array with the values retrieved. If nothing could be retrieved, the first and unique index of the array will contain the value of zero (0).
	 *  @todo Think about supporting a boolean parameter to try to find the attribute having into account vendor prefixes (webkit, moz, ms, o, khtml).
	 */
	CB_Elements.getStylePropertyNumericById = function(elementId, attribute, computed, parseToInteger, parseToFloat)
	{
		return CB_Elements.getStylePropertyNumeric(CB_Elements.id(elementId), attribute, computed, parseToInteger, parseToFloat);
	}


	/**
	 * Toggles the [display]{@link https://developer.mozilla.org/en-US/docs/Web/CSS/display} property (from "none" to the desired value or vice versa) of a given element, to show or hide it.
	 * If the element is hidden (its [display]{@link https://developer.mozilla.org/en-US/docs/Web/CSS/display} is "none"), it will call {@link CB_Elements.show} internally to show it. Otherwise, it will call {@link CB_Elements.hide} internally. Note that these two functions will also change the [visibility]{@link https://developer.mozilla.org/en-US/docs/Web/CSS/visibility} property (setting it to either "visible" or "hidden", respectively) of the element.
	 *  @function
	 *  @param {Node} element - The element whose [display]{@link https://developer.mozilla.org/en-US/docs/Web/CSS/display} property we want to toggle.
	 *  @param {string} [displayValue='block'] - The [display]{@link https://developer.mozilla.org/en-US/docs/Web/CSS/display} value when we want to show the element (it will be used only if the element is currently hidden, when it calls {@link CB_Elements.show} internally). The [display]{@link https://developer.mozilla.org/en-US/docs/Web/CSS/display} value to hide the element is always "none".
	 *  @param {boolean} [checkValues=false] - This parameter will be used when it calls either {@link CB_Elements.show} or {@link CB_Elements.hide} internally.
	 *  @param {boolean} [computed=false] - This parameter will be used to get the current style and also when it calls either {@link CB_Elements.show} or {@link CB_Elements.hide} internally.
	 *  @param {function} [onToggleDisplay] - This parameter will be used when it calls either {@link CB_Elements.show} if "onShow" is not provided or {@link CB_Elements.hide} if "onHide" is not provided, internally.
	 *  @param {function} [onShow] - This parameter will be used when it calls {@link CB_Elements.show} internally. If not provided but "onToggleDisplay" is provided, it will use the latter instead.
	 *  @param {function} [onHide] - This parameter will be used when it calls {@link CB_Elements.hide} internally. If not provided but "onToggleDisplay" is provided, it will use the latter instead.
	 *  @returns {Node} Returns the given element again.
	 */
	CB_Elements.showHide = function(element, displayValue, checkValues, computed, onToggleDisplay, onShow, onHide)
	{
		var style = CB_Elements.getStyle(element, computed);
		if (style !== null)
		{
			if (style.display === "none") { CB_Elements.show(element, displayValue, checkValues, computed, typeof(onToggleDisplay) === "function" ? onToggleDisplay : onShow); }
			else { CB_Elements.hide(element, checkValues, computed, typeof(onToggleDisplay) === "function" ? onToggleDisplay : onHide); }
		}
		return element;
	}


	/**
	 * Toggles the [display]{@link https://developer.mozilla.org/en-US/docs/Web/CSS/display} property (from "none" to the desired value or vice versa) of a given element, to show or hide it (by its identifier).
	 * If the element is hidden (its [display]{@link https://developer.mozilla.org/en-US/docs/Web/CSS/display} is "none"), it will call {@link CB_Elements.show} internally to show it. Otherwise, it will call {@link CB_Elements.hide} internally. Note that these two functions will also change the [visibility]{@link https://developer.mozilla.org/en-US/docs/Web/CSS/visibility} property (setting it to either "visible" or "hidden", respectively) of the element.
	 *  @function
	 *  @param {string} elementId - The identifier of the element whose [display]{@link https://developer.mozilla.org/en-US/docs/Web/CSS/display} property we want to toggle.
	 *  @param {string} [displayValue='block'] - The [display]{@link https://developer.mozilla.org/en-US/docs/Web/CSS/display} value when we want to show the element (it will be used only if the element is currently hidden, when it calls {@link CB_Elements.show} internally). The [display]{@link https://developer.mozilla.org/en-US/docs/Web/CSS/display} value to hide the element is always "none".
	 *  @param {boolean} [checkValues=false] - This parameter will be used when it calls either {@link CB_Elements.show} or {@link CB_Elements.hide} internally.
	 *  @param {boolean} [computed=false] - This parameter will be used to get the current style and also when it calls either {@link CB_Elements.show} or {@link CB_Elements.hide} internally.
	 *  @param {function} [onToggleDisplay] - This parameter will be used when it calls either {@link CB_Elements.show} if "onShow" is not provided or {@link CB_Elements.hide} if "onHide" is not provided, internally.
	 *  @param {function} [onShow] - This parameter will be used when it calls {@link CB_Elements.show} internally. If not provided but "onToggleDisplay" is provided, it will use the latter instead.
	 *  @param {function} [onHide] - This parameter will be used when it calls {@link CB_Elements.hide} internally. If not provided but "onToggleDisplay" is provided, it will use the latter instead.
	 *  @returns {Node|null} Returns the affected element (if any) or null otherwise.
	 */
	CB_Elements.showHideById = function(elementId, displayValue, checkValues, computed, onToggleDisplay, onShow, onHide)
	{
		return CB_Elements.showHide(CB_Elements.id(elementId), displayValue, checkValues, computed, onToggleDisplay, onShow, onHide);
	}


	/**
	 * Changes the [display]{@link https://developer.mozilla.org/en-US/docs/Web/CSS/display} property to the desired value of a given element, to show it. Its [visibility]{@link https://developer.mozilla.org/en-US/docs/Web/CSS/visibility} property will be set to "visible".
	 *  @function
	 *  @param {Node} element - The element whose [display]{@link https://developer.mozilla.org/en-US/docs/Web/CSS/display} property we want to change.
	 *  @param {string} [displayValue='block'] - The [display]{@link https://developer.mozilla.org/en-US/docs/Web/CSS/display} value we want to set. If not provided or "none" is provided, it will use "block" instead.
	 *  @param {boolean} [checkValues=false] - If it is set to true, it will only perform the change if either the current [visibility]{@link https://developer.mozilla.org/en-US/docs/Web/CSS/visibility} property is not "visible" or the current [display]{@link https://developer.mozilla.org/en-US/docs/Web/CSS/display} property is different from the given one.
	 *  @param {boolean} [computed=false] - This parameter will be used when it calls {@link CB_Elements.getStyle} internally.
	 *  @param {function} [onShow] - Callback function that will be called if the change has been performed, after doing it (this will happens always if "checkValues" is false). The first parameter passed will be the affected element itself and the second and last parameter will be the new value of the [display]{@link https://developer.mozilla.org/en-US/docs/Web/CSS/display} property (not computed).
	 *  @returns {Node} Returns the given element again.
	 */
	CB_Elements.show = function(element, displayValue, checkValues, computed, onShow)
	{
		var style = CB_Elements.getStyle(element, computed);
		if (style !== null)
		{
			displayValue = CB_trim(displayValue);
			if (displayValue === "" || displayValue.toLowerCase() === "none") { displayValue = "block"; }
			if (!checkValues || style.visibility !== "visible" || style.display !== displayValue)
			{
				element.style.visibility = "visible";	
				element.style.display = displayValue;
				if (typeof(onShow) === "function") { onShow(element, element.style.display); }
			}
		}
		return element;
	}


	/**
	 * Changes the [display]{@link https://developer.mozilla.org/en-US/docs/Web/CSS/display} property to the desired value of a given element, to show it (by its identifier). Its [visibility]{@link https://developer.mozilla.org/en-US/docs/Web/CSS/visibility} property will be set to "visible".
	 *  @function
	 *  @param {string} elementId - The identifier of the element whose [display]{@link https://developer.mozilla.org/en-US/docs/Web/CSS/display} property we want to change.
	 *  @param {string} [displayValue='block'] - The [display]{@link https://developer.mozilla.org/en-US/docs/Web/CSS/display} value we want to set. If not provided or "none" is provided, it will use "block" instead.
	 *  @param {boolean} [checkValues=false] - If it is set to true, it will only perform the change if either the current [visibility]{@link https://developer.mozilla.org/en-US/docs/Web/CSS/visibility} property is not "visible" or the current [display]{@link https://developer.mozilla.org/en-US/docs/Web/CSS/display} property is different from the given one.
	 *  @param {boolean} [computed=false] - This parameter will be used when it calls {@link CB_Elements.getStyle} internally.
	 *  @param {function} [onShow] - Callback function that will be called if the change has been performed, after doing it (this will happens always if "checkValues" is false). The first parameter passed will be the affected element itself and the second and last parameter will be the new value of the [display]{@link https://developer.mozilla.org/en-US/docs/Web/CSS/display} property (not computed).
	 *  @returns {Node|null} Returns the affected element (if any) or null otherwise.
	 */
	CB_Elements.showById = function(elementId, displayValue, checkValues, computed, onShow)
	{
		return CB_Elements.show(CB_Elements.id(elementId), displayValue, checkValues, computed, onShow);
	}


	/**
	 * Hides a given element by changing its [display]{@link https://developer.mozilla.org/en-US/docs/Web/CSS/display} property to "none" and its [visibility]{@link https://developer.mozilla.org/en-US/docs/Web/CSS/visibility} to "hidden".
	 *  @function
	 *  @param {Node} element - The element that we want to hide.
	 *  @param {boolean} [checkValues=false] - If it is set to true, it will only perform the change if either the current [visibility]{@link https://developer.mozilla.org/en-US/docs/Web/CSS/visibility} property is not "hidden" or the current [display]{@link https://developer.mozilla.org/en-US/docs/Web/CSS/display} property is not "none".
	 *  @param {boolean} [computed=false] - This parameter will be used when it calls {@link CB_Elements.getStyle} internally.
	 *  @param {function} [onHide] - Callback function that will be called if the element has been hidden, after doing it (this will happens always if "checkValues" is false). The first parameter passed will be the affected element itself and the second and last parameter will be the new value of the [display]{@link https://developer.mozilla.org/en-US/docs/Web/CSS/display} property (not computed) which should be "none".
	 *  @returns {Node} Returns the given element again.
	 */
	CB_Elements.hide = function(element, checkValues, computed, onHide)
	{
		var style = CB_Elements.getStyle(element, computed);
		if (style !== null)
		{
			if (!checkValues || style.visibility !== "hidden" || style.display !== "none")
			{
				element.style.visibility = "hidden";
				element.style.display = "none";
				if (typeof(onHide) === "function") { onHide(element, element.style.display); }
			}
		}
		return element;
	}


	/**
	 * Hides a given element by changing its [display]{@link https://developer.mozilla.org/en-US/docs/Web/CSS/display} property to "none" and its [visibility]{@link https://developer.mozilla.org/en-US/docs/Web/CSS/visibility} to "hidden" (by its identifier).
	 *  @function
	 *  @param {string} elementId - The identifier of the element that we want to hide.
	 *  @param {boolean} [checkValues=false] - If it is set to true, it will only perform the change if either the current [visibility]{@link https://developer.mozilla.org/en-US/docs/Web/CSS/visibility} property is not "hidden" or the current [display]{@link https://developer.mozilla.org/en-US/docs/Web/CSS/display} property is not "none".
	 *  @param {boolean} [computed=false] - This parameter will be used when it calls {@link CB_Elements.getStyle} internally.
	 *  @param {function} [onHide] - Callback function that will be called if the element has been hidden, after doing it (this will happens always if "checkValues" is false). The first parameter passed will be the affected element itself and the second and last parameter will be the new value of the [display]{@link https://developer.mozilla.org/en-US/docs/Web/CSS/display} property (not computed) which should be "none".
	 *  @returns {Node|null} Returns the affected element (if any) or null otherwise.
	 */
	CB_Elements.hideById = function(elementId, checkValues, computed, onHide)
	{
		return CB_Elements.hide(CB_Elements.id(elementId), checkValues, computed, onHide);
	}


	/**
	 * Toggles the class of a given element between two given classes or adds/removes the given class. The element can contain other classes and they will be kept.
	 *  @function
	 *  @param {Node} element - The element whose class we want to toggle.
	 *  @param {string} classA - The class that will be used in the case that the element is not using it already.
	 *  @param {string} [classB=''] - The class that will be used in the case that the given "classA" is being used by the element. If not given or an empty string is given, it will just remove the "classA" in the case it is being used by the element.
	 *  @param {function} [onToggleClass] - Callback function that will be called if the class of the element has been toggled or removed, after doing it. The first parameter passed will be the affected element itself and the second and last parameter will be the class used this time (or an empty string).
	 *  @returns {Node} Returns the given element again.
	 */
	CB_Elements.toggleClass = function(element, classA, classB, onToggleClass)
	{
		if (typeof(element) !== "undefined" && element !== null)
		{
			classA = CB_trim(classA).toLowerCase();
			classB = CB_trim(classB).toLowerCase();
			if (classA === "" && classB === "") { return element; }
			else if (classA === "") { classA = classB; classB = ""; }
			
			var classesUsed = " " + CB_trim(element.className).toLowerCase() + " ";
			if (classesUsed.indexOf(" " + classA + " ") === -1)
			{
				if (classB !== "" && classesUsed.indexOf(" " + classB + " ") !== -1) { classesUsed = classesUsed.replace(CB_regularExpressionString(" " + classB + " ", true, true), " " + classA + " "); }
				else { classesUsed += " " + classA; }
				element.className = CB_trim(classesUsed);
				if (typeof(onToggleClass) === "function") { onToggleClass(element, classA); }
			}
			else
			{
				classesUsed = classesUsed.replace(CB_regularExpressionString(" " + classA + " ", true, true), " ");
				if (classB !== "" && classesUsed.indexOf(" " + classB + " ") === -1) { classesUsed += " " + classB; }
				element.className = CB_trim(classesUsed);
				if (typeof(onToggleClass) === "function") { onToggleClass(element, classB); }
			}
		}
		return element;
	}


	/**
	 * Toggles the class of a given element between two given classes (by its identifier). The element can contain other classes and they will be kept.
	 *  @function
	 *  @param {string} elementId - The identifier of the element whose class we want to toggle.
	 *  @param {string} classA - The class that will be used in the case that the element is not using it already.
	 *  @param {string} [classB=''] - The class that will be used in the case that the given "classA" is being used by the element. If not given or an empty string is given, it will just remove the "classA" in the case it is being used by the element.
	 *  @param {function} [onToggleClass] - Callback function that will be called if the class of the element has been toggled or removed, after doing it. The first parameter passed will be the affected element itself and the second and last parameter will be the class used this time (or an empty string).
	 *  @returns {Node|null} Returns the affected element (if any) or null otherwise.
	 */
	CB_Elements.toggleClassById = function(elementId, classA, classB, onToggleClass)
	{
		return CB_Elements.toggleClass(CB_Elements.id(elementId), classA, classB, onToggleClass);
	}


	/**
	 * Removes a desired class from a given element. The element can contain other classes and they will be kept.
	 *  @function
	 *  @param {Node} element - The element whose class we want to remove.
	 *  @param {string} className - The class that will be removed if the element is using it.
	 *  @param {boolean} [checkValues=false] - If it is set to true, it will only try to perform the action if the given "className" is being used. The result will be the same with either true or false, but depending on the client used it could gain or lose performance.
	 *  @param {function} [onRemoveClass] - Callback function that will be called if the class of the element has been tried to be removed, after doing it (this will happens always if "checkValues" is false). The first and unique parameter passed will be the affected element itself.
	 *  @returns {Node} Returns the given element again.
	 *  @todo Think about allowing to remove more than once class at the same time, regardless of the order given and order set.
	 */
	CB_Elements.removeClass = function(element, className, checkValues, onRemoveClass)
	{
		if (typeof(element) !== "undefined" && element !== null)
		{
			className = CB_trim(className).toLowerCase();
			if (className === "") { return element; }
			var classesUsed = " " + CB_trim(element.className).toLowerCase() + " ";
			if (!checkValues || classesUsed.indexOf(" " + className + " ") !== -1)
			{
				element.className = CB_trim(classesUsed.replace(CB_regularExpressionString(" " + className + " ", true, true), " "));
				if (typeof(onRemoveClass) === "function") { onRemoveClass(element); }
			}
		}
		return element;
	}


	/**
	 * Removes a desired class from a given element (by its identifier). The element can contain other classes and they will be kept.
	 *  @function
	 *  @param {string} elementId - The identifier of the element whose class we want to remove.
	 *  @param {string} className - The class that will be removed if the element is using it.
	 *  @param {boolean} [checkValues=false] - If it is set to true, it will only try to perform the action if the given "className" is being used. The result will be the same with either true or false, but depending on the client used it could gain or lose performance.
	 *  @param {function} [onRemoveClass] - Callback function that will be called if the class of the element has been tried to be removed, after doing it (this will happens always if "checkValues" is false). The first and unique parameter passed will be the affected element itself.
	 *  @returns {Node|null} Returns the affected element (if any) or null otherwise.
	 *  @todo Think about allowing to remove more than once class at the same time, regardless of the order given and order set.
	 */
	CB_Elements.removeClassById = function(elementId, className, checkValues, onRemoveClass)
	{
		return CB_Elements.removeClass(CB_Elements.id(elementId), className, checkValues, onRemoveClass);
	}


	/**
	 * Adds a desired class to a given element. The element can contain other classes and they will be kept.
	 *  @function
	 *  @param {Node} element - The element that will get the new given class.
	 *  @param {string} className - The class that will be added.
	 *  @param {boolean} [checkValues=false] - If it is set to true, it will only try to add the given class if it is not being used already. It is recommended to use true to prevent some old clients from adding the same class multiple times.
	 *  @param {function} [onAddClass] - Callback function that will be called if the class of the element has been added, after doing it (this will happens always if "checkValues" is false). The first and unique parameter passed will be the affected element itself.
	 *  @returns {Node} Returns the given element again.
	 *  @todo Think about allowing to use more than once class (and think how many times the "onAddClass" function should be called).
	 */
	CB_Elements.addClass = function(element, className, checkValues, onAddClass)
	{
		if (typeof(element) !== "undefined" && element !== null)
		{
			className = CB_trim(className).toLowerCase();
			if (className === "") { return element; }
			var classesUsed = " " + CB_trim(element.className).toLowerCase() + " ";
			if (!checkValues || classesUsed.indexOf(" " + className + " ") === -1)
			{
				element.className = CB_trim(CB_trim(classesUsed) + " " + className);
				if (typeof(onAddClass) === "function") { onAddClass(element); }
			}
		}
		return element;
	}


	/**
	 * Adds a desired class to a given element (by its identifier). The element can contain other classes and they will be kept.
	 *  @function
	 *  @param {string} elementId - The identifier of the element that will get the new given class.
	 *  @param {string} className - The class that will be added.
	 *  @param {boolean} [checkValues=false] - If it is set to true, it will only try to add the given class if it is not being used already. It is recommended to use true to prevent some old clients from adding the same class multiple times.
	 *  @param {function} [onAddClass] - Callback function that will be called if the class of the element has been added, after doing it (this will happens always if "checkValues" is false). The first and unique parameter passed will be the affected element itself.
	 *  @returns {Node|null} Returns the affected element (if any) or null otherwise.
	 *  @todo Think about allowing to use more than once class (and think how many times the "onAddClass" function should be called).
	 */
	CB_Elements.addClassById = function(elementId, className, checkValues, onAddClass)
	{
		return CB_Elements.addClass(CB_Elements.id(elementId), className, checkValues, onAddClass);
	}


	/**
	 * Sets a desired class or classes to a given element. All previous classes (if any) will be replaced by the new one or new ones.
	 *  @function
	 *  @param {Node} element - The element that will get the new given class or classes.
	 *  @param {string} classNames - The class or classes that will be set. More than one class can be given (separated by blank spaces).
	 *  @param {boolean} [checkValues=false] - If it is set to true, it will only try to set the given class or classes if they are not being used already.
	 *  @param {function} [onSetClass] - Callback function that will be called if the class or classes of the element have been set, after doing it (this will happens always if "checkValues" is false). The first and unique parameter passed will be the affected element itself.
	 *  @returns {Node} Returns the given element again.
	 */
	CB_Elements.setClass = function(element, classNames, checkValues, onSetClass)
	{
		if (typeof(element) !== "undefined" && element !== null)
		{
			if (!checkValues || element.className !== classNames)
			{
				element.className = classNames;
				if (typeof(onSetClass) === "function") { onSetClass(element); }
			}
		}
		return element;
	}


	/**
	 * Sets a desired class or classes to a given element (by its identifier). All previous classes (if any) will be replaced by the new one or new ones.
	 *  @function
	 *  @param {string} elementId - The identifier of the element that will get the new given class or classes.
	 *  @param {string} classNames - The class or classes that will be set. More than one class can be given (separated by blank spaces).
	 *  @param {boolean} [checkValues=false] - If it is set to true, it will only try to set the given class or classes if they are not being used already.
	 *  @param {function} [onSetClass] - Callback function that will be called if the class or classes of the element have been set, after doing it (this will happens always if "checkValues" is false). The first and unique parameter passed will be the affected element itself.
	 *  @returns {Node|null} Returns the affected element (if any) or null otherwise.
	 */
	CB_Elements.setClassById = function(elementId, classNames, checkValues, onSetClass)
	{
		return CB_Elements.setClass(CB_Elements.id(elementId), classNames, checkValues, onSetClass);
	}


	/**
	 * Returns the left position of an element (having in mind [getBoundingClientRect]{@link https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect} if available, its parents, etc.).
	 *  @function
	 *  @param {Node} element - The element whose data we are interested in.
	 *  @param {boolean} [ignoreScroll=true] - If it is set to false, it will have in mind the current scroll position to calculate the result.
	 *  @param {function} [returnNullOnFail=false] - If it is set to true, it will return null instead of zero (0) in the case that something goes wrong.
	 *  @param {boolean} [computed=false] - This parameter will be used when it calls {@link CB_Elements.getStyleProperty} and {@link CB_Elements.getStylePropertyInteger} internally.
	 *  @returns {*} It could return zero (0) or even a non-numeric value if something fails (use "returnNullOnFail" set to true to return null when it fails).
	 */
	CB_Elements.getLeft = function(element, ignoreScroll, returnNullOnFail, computed)
	{
		if (typeof(element) === "undefined" || element === null) { return returnNullOnFail ? null : 0; }
		
		//If it's not set, we mind scroll as default:
		if (typeof(ignoreScroll) === "undefined" || ignoreScroll === null) { ignoreScroll = true; }

		var elementLeft = 0;
		var originalElement = true;

		if (typeof(element.getBoundingClientRect) !== "undefined" && element.getBoundingClientRect !== null)
		{
			var rect = element.getBoundingClientRect();
			if (typeof(rect.left) !== "undefined" && rect.left !== null && !isNaN(rect.left))
			{
				elementLeft = rect.left;
				elementLeft -= CB_Client.getBoundingClientRectMargin("left");
				if (ignoreScroll) { elementLeft += CB_Screen.getScrollLeft(); }
				return elementLeft;
			}
		}

		//Gets the left position having in mind its parents (if any) and adds them:
		do
		{
			if (typeof(element) !== "undefined" && element !== null)
			{
				var elementPosition = CB_Elements.getStyleProperty(element, "position", computed);
				if (elementPosition === "absolute")
				{
					if (typeof(getComputedStyle) !== "undefined" && getComputedStyle !== null)
					{
						if (element !== document && !isNaN(parseInt(getComputedStyle(element, "").getPropertyValue("left"))))
						{
							elementLeft += parseInt(getComputedStyle(element, "").getPropertyValue("left"));
						}
						else if (!isNaN(parseInt(getComputedStyle(document.body, "").getPropertyValue("left"))))
						{
							elementLeft += parseInt(getComputedStyle(document.body, "").getPropertyValue("left"));
						}
					
						////////elementLeft += CB_Elements.getStylePropertyInteger(element, "borderLeftWidth")[0];
						////////elementLeft += CB_Elements.getStylePropertyInteger(element, "paddingLeft")[0];
						elementLeft += CB_Elements.getStylePropertyInteger(element, "borderLeftWidth", computed)[0];
						elementLeft += CB_Elements.getStylePropertyInteger(element, "paddingLeft", computed)[0];

						
						if (originalElement)
						{
							///////elementLeft -= CB_Elements.getStylePropertyInteger(element, "border")[0];
							elementLeft -= CB_Elements.getStylePropertyInteger(element, "border", computed)[0];
							originalElement = false;
						}
					}
					else if (typeof(element.offsetLeft) !== "undefined" && element.offsetLeft !== null && !isNaN(parseInt(element.offsetLeft)))
					{
						elementLeft += parseInt(element.offsetLeft, 10);
					}
				}
				else
				{
					if (typeof(element.offsetLeft) !== "undefined" && element.offsetLeft !== null && !isNaN(parseInt(element.offsetLeft)))
					{
						elementLeft += parseInt(element.offsetLeft, 10);
					}
				}
			}

			if (typeof(element.offsetParent) !== "undefined" && element.offsetParent !== null)
			{
				element = element.offsetParent;
			}
			/*
			else if (typeof(element.parentNode) !== "undefined" && element.parentNode !== null)
			{
				element = element.parentNode;
			}
			else if (typeof(element.parentElement) !== "undefined" && element.parentElement !== null)
			{
				element = element.parentElement;
			}
			*/
			else 
			{
				var elementParent = CB_Elements.getParent(element);
				if (typeof(elementParent) !== "undefined" && elementParent !== null)
				{
					element = elementParent;
				}
				else { element = null; }
			}

		} while (element)

		if (!ignoreScroll) { elementLeft -= CB_Screen.getScrollLeft(); }

		return isNaN(elementLeft) && returnNullOnFail ? null : elementLeft;
	}


	/**
	 * Returns the left position of an element (having in mind [getBoundingClientRect]{@link https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect} if available, its parents, etc.), by its identifier.
	 *  @function
	 *  @param {string} elementId - The identifier of the element whose data we are interested in.
	 *  @param {boolean} [ignoreScroll=true] - If it is set to false, it will have in mind the current scroll position to calculate the result.
	 *  @param {function} [returnNullOnFail=false] - If it is set to true, it will return null instead of zero (0) in the case that something goes wrong.
	 *  @param {boolean} [computed=false] - This parameter will be used when it calls {@link CB_Elements.getStyleProperty} and {@link CB_Elements.getStylePropertyInteger} internally.
	 *  @returns {*} It could return zero (0) or even a non-numeric value if something fails (use "returnNullOnFail" set to true to return null when it fails).
	 */
	CB_Elements.getLeftById = function(elementId, ignoreScroll, returnNullOnFail, computed)
	{
		return CB_Elements.getLeft(CB_Elements.id(elementId), ignoreScroll, returnNullOnFail, computed);
	}


	/**
	 * Returns the top position of an element (having in mind [getBoundingClientRect]{@link https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect} if available, its parents, etc.).
	 *  @function
	 *  @param {Node} element - The element whose data we are interested in.
	 *  @param {boolean} [ignoreScroll=true] - If it is set to false, it will have in mind the current scroll position to calculate the result.
	 *  @param {function} [returnNullOnFail=false] - If it is set to true, it will return null instead of zero (0) in the case that something goes wrong.
	 *  @param {boolean} [computed=false] - This parameter will be used when it calls {@link CB_Elements.getStyleProperty} and {@link CB_Elements.getStylePropertyInteger} internally.
	 *  @returns {*} It could return zero (0) or even a non-numeric value if something fails (use "returnNullOnFail" set to true to return null when it fails).
	 */
	CB_Elements.getTop = function(element, ignoreScroll, returnNullOnFail, computed)
	{
		if (typeof(element) === "undefined" || element === null) { return returnNullOnFail ? null : 0; }
		
		//If it's not set, we mind scroll as default:
		if (typeof(ignoreScroll) === "undefined" || ignoreScroll === null) { ignoreScroll = true; }

		var elementTop = 0;
		var originalElement = true;

		if (typeof(element.getBoundingClientRect) !== "undefined" && element.getBoundingClientRect !== null)
		{
			var rect = element.getBoundingClientRect();
			if (typeof(rect.top) !== "undefined" && rect.top !== null && !isNaN(rect.top))
			{
				elementTop = rect.top;
				elementTop -= CB_Client.getBoundingClientRectMargin("top");
			
				if (ignoreScroll) { elementTop += CB_Screen.getScrollTop(); }
				
				return elementTop;
			}
		}

		//Gets the top position having in mind its parents (if any) and adds them:
		do
		{
			if (typeof(element) !== "undefined" && element !== null)
			{
				var elementPosition = CB_Elements.getStyleProperty(element, "position", computed);
				if (elementPosition === "absolute")
				{
					if (typeof(getComputedStyle) !== "undefined" && getComputedStyle !== null)
					{
						if (element !== document && !isNaN(parseInt(getComputedStyle(element, "").getPropertyValue("top"))))
						{
							elementTop += parseInt(getComputedStyle(element, "").getPropertyValue("top"));
						}
						else if (!isNaN(parseInt(getComputedStyle(document.body, "").getPropertyValue("top"))))
						{
							elementTop += parseInt(getComputedStyle(document.body, "").getPropertyValue("top"));
						}
					
						////////elementTop += CB_Elements.getStylePropertyInteger(element, "borderTopWidth")[0];
						////////elementTop += CB_Elements.getStylePropertyInteger(element, "paddingTop")[0];
						elementTop += CB_Elements.getStylePropertyInteger(element, "borderTopWidth", computed)[0];
						elementTop += CB_Elements.getStylePropertyInteger(element, "paddingTop", computed)[0];
					
						if (originalElement)
						{
							//////////elementTop -= CB_Elements.getStylePropertyInteger(element, "border")[0];
							elementTop -= CB_Elements.getStylePropertyInteger(element, "border", computed)[0];
							originalElement = false;
						}
					}
					else if (typeof(element.offsetTop) !== "undefined" && element.offsetTop !== null && !isNaN(parseInt(element.offsetTop)))
					{
						elementTop += parseInt(element.offsetTop, 10);
					}
				}
				else
				{
					if (typeof(element.offsetTop) !== "undefined" && element.offsetTop !== null && !isNaN(parseInt(element.offsetTop)))
					{
						elementTop += parseInt(element.offsetTop, 10);
					}
				}
			}

			if (typeof(element.offsetParent) !== "undefined" && element.offsetParent !== null)
			{
				element = element.offsetParent;
			}
			/*
			else if (typeof(element.parentNode) !== "undefined" && element.parentNode !== null)
			{
				element = element.parentNode;
			}
			else if (typeof(element.parentElement) !== "undefined" && element.parentElement !== null)
			{
				element = element.parentElement;
			}
			else { element = null; }
			*/
			else 
			{
				var elementParent = CB_Elements.getParent(element);
				if (typeof(elementParent) !== "undefined" && elementParent !== null)
				{
					element = elementParent;
				}
				else { element = null; }
			}
			
			
		} while (element)

		if (!ignoreScroll) { elementTop -= CB_Screen.getScrollTop(); }

		return isNaN(elementTop) && returnNullOnFail ? null : elementTop;
	}


	/**
	 * Returns the top position of an element (having in mind [getBoundingClientRect]{@link https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect} if available, its parents, etc.), by its identifier.
	 *  @function
	 *  @param {string} elementId - The identifier of the element whose data we are interested in.
	 *  @param {boolean} [ignoreScroll=true] - If it is set to false, it will have in mind the current scroll position to calculate the result.
	 *  @param {function} [returnNullOnFail=false] - If it is set to true, it will return null instead of zero (0) in the case that something goes wrong.
	 *  @param {boolean} [computed=false] - This parameter will be used when it calls {@link CB_Elements.getStyleProperty} and {@link CB_Elements.getStylePropertyInteger} internally.
	 *  @returns {*} It could return zero (0) or even a non-numeric value if something fails (use "returnNullOnFail" set to true to return null when it fails).
	 */
	CB_Elements.getTopById = function(elementId, ignoreScroll, returnNullOnFail, computed)
	{
		return CB_Elements.getTop(CB_Elements.id(elementId), ignoreScroll, returnNullOnFail, computed);
	}


	/**
	 * Returns the width of an element (having in mind its border).
	 *  @function
	 *  @param {Node} element - The element whose data we are interested in.
	 *  @param {function} [returnNullOnFail=false] - If it is set to true, it will return null instead of zero (0) in the case that something goes wrong.
	 *  @param {boolean} [computed=false] - This parameter will be used when it calls {@link CB_Elements.getStylePropertyInteger} internally.
	 *  @returns {*} It could return zero (0) or even a non-numeric value if something fails (use "returnNullOnFail" set to true to return null when it fails).
	 */
	CB_Elements.getWidth = function(element, returnNullOnFail, computed)
	{
		if (typeof(element) === "undefined" || element === null) { return returnNullOnFail ? null : 0; }
		
		var elementWidth = 0;

		if (typeof(element.getBoundingClientRect) !== "undefined" && element.getBoundingClientRect !== null)
		{
			var rect = element.getBoundingClientRect();
			if (typeof(rect.width) !== "undefined" && rect.width !== null && !isNaN(rect.width))
			{
				elementWidth += rect.width;
			}
		}

		if (typeof(elementWidth) === "undefined" || elementWidth === null || isNaN(elementWidth) || elementWidth === 0)
		{
			if (typeof(element.offsetWidth) !== "undefined" && element.offsetWidth !== null && !isNaN(parseInt(element.offsetWidth)))
			{
				elementWidth += parseInt(element.offsetWidth, 10);
			}
			else
			{
				/*
				elementWidth += CB_Elements.getStylePropertyInteger(element, "width")[0];
				//elementWidth += CB_Elements.getStylePropertyInteger(element, "border")[0];
				elementHeight += CB_Elements.getStylePropertyInteger(element, "borderLeftWidth")[0];
				elementHeight += CB_Elements.getStylePropertyInteger(element, "borderRightWidth")[0];
				elementWidth += CB_Elements.getStylePropertyInteger(element, "paddingLeft")[0];
				*/
				elementWidth += CB_Elements.getStylePropertyInteger(element, "width", computed)[0];
				//elementWidth += CB_Elements.getStylePropertyInteger(element, "border", computed)[0];
				elementWidth += CB_Elements.getStylePropertyInteger(element, "borderLeftWidth", computed)[0];
				elementWidth += CB_Elements.getStylePropertyInteger(element, "borderRightWidth", computed)[0];
				elementWidth += CB_Elements.getStylePropertyInteger(element, "paddingLeft", computed)[0];
			}
		}

		return isNaN(elementWidth) && returnNullOnFail ? null : elementWidth;
	}


	/**
	 * Returns the width of an element (having in mind its border), by its identifier.
	 *  @function
	 *  @param {string} elementId - The identifier of the element whose data we are interested in.
	 *  @param {function} [returnNullOnFail=false] - If it is set to true, it will return null instead of zero (0) in the case that something goes wrong.
	 *  @param {boolean} [computed=false] - This parameter will be used when it calls {@link CB_Elements.getStylePropertyInteger} internally.
	 *  @returns {*} It could return zero (0) or even a non-numeric value if something fails (use "returnNullOnFail" set to true to return null when it fails).
	 */
	CB_Elements.getWidthById = function(elementId, returnNullOnFail, computed)
	{
		return CB_Elements.getWidth(CB_Elements.id(elementId));
	}


	/**
	 * Returns the height of an element (having in mind its border).
	 *  @function
	 *  @param {Node} element - The element whose data we are interested in.
	 *  @param {function} [returnNullOnFail=false] - If it is set to true, it will return null instead of zero (0) in the case that something goes wrong.
	 *  @param {boolean} [computed=false] - This parameter will be used when it calls {@link CB_Elements.getStylePropertyInteger} internally.
	 *  @returns {*} It could return zero (0) or even a non-numeric value if something fails (use "returnNullOnFail" set to true to return null when it fails).
	 */
	CB_Elements.getHeight = function(element, returnNullOnFail, computed)
	{
		if (typeof(element) === "undefined" || element === null) { return returnNullOnFail ? null : 0; }
		
		var elementHeight = 0;

		if (typeof(element.getBoundingClientRect) !== "undefined" && element.getBoundingClientRect !== null)
		{
			var rect = element.getBoundingClientRect();
			if (typeof(rect.height) !== "undefined" && rect.height !== null && !isNaN(rect.height))
			{
				elementHeight += rect.height;
			}
		}

		if (typeof(elementHeight) === "undefined" || elementHeight === null || isNaN(elementHeight) || elementHeight === 0)
		{
			if (typeof(element.offsetHeight) !== "undefined" && element.offsetHeight !== null && !isNaN(parseInt(element.offsetHeight)))
			{
				elementHeight += parseInt(element.offsetHeight, 10);
			}
			else
			{
				/*
				elementHeight += CB_Elements.getStylePropertyInteger(element, "height")[0];
				//elementHeight += CB_Elements.getStylePropertyInteger(element, "border")[0];
				elementWidth += CB_Elements.getStylePropertyInteger(element, "borderTopWidth")[0];
				elementWidth += CB_Elements.getStylePropertyInteger(element, "borderBottomWidth")[0];
				elementHeight += CB_Elements.getStylePropertyInteger(element, "paddingTop")[0];
				*/
				elementHeight += CB_Elements.getStylePropertyInteger(element, "height", computed)[0];
				//elementHeight += CB_Elements.getStylePropertyInteger(element, "border", computed)[0];
				elementHeight += CB_Elements.getStylePropertyInteger(element, "borderTopWidth", computed)[0];
				elementHeight += CB_Elements.getStylePropertyInteger(element, "borderBottomWidth", computed)[0];
				elementHeight += CB_Elements.getStylePropertyInteger(element, "paddingTop", computed)[0];
			}
		}

		return isNaN(elementHeight) && returnNullOnFail ? null : elementHeight;
	}


	/**
	 * Returns the height of an element (having in mind its border), by its identifier.
	 *  @function
	 *  @param {string} elementId - The identifier of the element whose data we are interested in.
	 *  @param {function} [returnNullOnFail=false] - If it is set to true, it will return null instead of zero (0) in the case that something goes wrong.
	 *  @param {boolean} [computed=false] - This parameter will be used when it calls {@link CB_Elements.getStylePropertyInteger} internally.
	 *  @returns {*} It could return zero (0) or even a non-numeric value if something fails (use "returnNullOnFail" set to true to return null when it fails).
	 */
	CB_Elements.getHeightById = function(elementId, returnNullOnFail, computed)
	{
		return CB_Elements.getHeight(CB_Elements.id(elementId));
	}


	/**
	 * Prevents or allows the possibility of selecting the content of a given element (makes it unselectable).
	 *  @function
	 *  @param {Node} element - The element which we want to affect.
	 *  @param {boolean} [avoidSelection=true] - If set to false, it will allow selecting the content. Otherwise, it will prevent it to be selected.
	 *  @returns {Node|null} Returns the given element again or null.
	 */
	CB_Elements.preventSelection = function(element, avoidSelection)
	{
		if (typeof(element) === "undefined" || element === null) { return null; }
		if (avoidSelection !== true && avoidSelection !== false) { avoidSelection = true; }
		if (avoidSelection)
		{
			element.unselectable = "on";
			element.style.MozUserSelect = "none";
			element.style.WebkitUserSelect = "none";
			element.style.userSelect = "none";
			element.style.KhtmlUserSelect = "none";
			element.style.MsUserSelect = "none";
			element.style.MsTouchSelect = "none";
			element.style.touchSelect = "none";
			//-webkit-tap-highlight-color:rgba(0, 0, 0, 0);
			//-webkit-touch-callout:none;
			//-ms-touch-action:none;
			//-touch-action:none;
			element.onselectstart = function() { return false; };
		}
		else
		{
			element.unselectable = undefined;
			element.style.MozUserSelect = undefined;
			element.style.WebkitUserSelect = undefined;
			element.style.userSelect = undefined;
			element.style.KhtmlUserSelect = undefined;
			element.style.MsUserSelect = undefined;
			element.style.MsTouchSelect = undefined;
			element.style.touchSelect = undefined;
			//-webkit-tap-highlight-color:rgba(0, 0, 0, 0);
			//-webkit-touch-callout:none;
			//-ms-touch-action:none;
			//-touch-action:none;
			element.onselectstart = undefined;
		}
		return element;
	}


	/**
	 * Prevents or allows the possibility of selecting the content of a given element (makes it unselectable), by its ID.
	 *  @function
	 *  @param {string} elementId - The identifier of the element which we want to affect.
	 *  @param {boolean} [avoidSelection=true] - If set to false, it will allow selecting the content. Otherwise, it will prevent it to be selected.
	 *  @returns {Node|null} Returns the affected element (if any) or null otherwise.
	 */
	CB_Elements.preventSelectionById = function(elementId, allowSelection)
	{
		return CB_Elements.preventSelection(CB_Elements.id(elementId), allowSelection);
	}


	/**
	 * Disables or enables the contextual menu for a given element or in the whole document.
	 *  @function
	 *  @param {Node} [element=document] - The element whose contextual menu we want to disable or enable. If not given, it will affect the whole document.
	 *  @param {boolean} [disableContextMenu=true] - If set to false, it will allow showing the contextual menu. Otherwise, it will prevent it to show.
	 *  @returns {Node} Returns the affected element.
	 */
	CB_Elements.contextMenuDisable = function(element, disableContextMenu)
	{
		if (typeof(element) === "undefined" || element === null) { element = document; }
		if (disableContextMenu !== true && disableContextMenu !== false) { disableContextMenu = true; }
		if (disableContextMenu)
		{
			CB_Events.add(element, "contextmenu", function(e) { e = CB_Events.normalize(e); if (typeof(e.preventDefault) !== "undefined") { e.preventDefault(); } return false; }, true, true, false);
		}
		else
		{
			element.contextmenu = undefined;
		}
		return element;
	}


	/**
	 * Disables or enables the contextual menu for a given element (by its identifier).
	 *  @function
	 *  @param {string} elementId - The identifier of the element whose contextual menu we want to disable or enable.
	 *  @param {boolean} [disableContextMenu=true] - If set to false, it will allow showing the contextual menu. Otherwise, it will prevent it to show.
	 *  @returns {Node|null} Returns the affected element (if any) or null otherwise.
	 */
	CB_Elements.contextMenuDisableById = function(elementId, allowContextMenu)
	{
		var element = CB_Elements.id(elementId);
		if (element !== null)
		{
			return CB_Elements.contextMenuDisable(element, allowContextMenu);
		}
		return null;
	}


	/**
	 * Tries to get the body content of an [iframe]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe}. Depending on the client and the safety measures, this might fail.
	 *  @function
	 *  @param {HTMLIFrameElement} frameElement - The [iframe]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe} element whose body content we want to get.
	 *  @returns {string|null} Returns null if something goes wrong.
	 */
	//* Source: Jose Basilio and nekno @ http://stackoverflow.com/questions/926916/how-to-get-the-bodys-content-of-an-iframe-in-javascript
	CB_Elements.getFrameBodyContent = function(frameElement)
	{
		if (typeof(frameElement) !== "undefined" && frameElement !== null)
		{
			var frameBody = null;
			
			if (frameElement.contentDocument && typeof(frameElement.contentDocument.getElementsByTagName) !== "undefined")
			{
				frameBody = frameElement.contentDocument.getElementsByTagName("body");
				if (frameBody !== null && typeof(frameBody[0]) !== "undefined" && frameBody[0] !== null)
				{
					frameBody = frameBody[0];
				}
				else { frameBody = null; }
			}
			
			if (frameBody === null && frameElement.contentWindow && typeof(frameElement.contentWindow.document) !== "undefined" && typeof(frameElement.contentWindow.document.getElementsByTagName) !== "undefined")
			{
				frameBody = frameElement.contentWindow.document.getElementsByTagName("body");
				if (frameBody !== null && typeof(frameBody[0]) !== "undefined" && frameBody[0] !== null)
				{
					frameBody = frameBody[0];
				}
				else { frameBody = null; }
			}

			if (frameBody === null && frameElement !== "" && window.frames && window.frames[frameElement] && window.frames[frameElement].document && window.frames[frameElement].document.body)
			{
				frameBody = window.frames[frameElement].document.body;
			}
			
			if (typeof(frameBody) !== "undefined" && frameBody !== null && frameBody.innerHTML) { return frameBody.innerHTML; }
		}
	 
		return null;
	}
	 
	 
	/**
	 * Tries to get the body content of an [iframe]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe} (by its identifier). Depending on the client and the safety measures, this might fail.
	 *  @function
	 *  @param {string} frameElementId - The identifier of the [iframe]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe} element whose body content we want to get.
	 *  @returns {string|null} Returns null if something goes wrong.
	 */
	CB_Elements.getFrameBodyContentById = function(frameElementId)
	{
		CB_Elements.getFrameBodyContent(CB_Elements.id(frameElementId));
	}

	
	/**
	 * Callback that is used as the "onScrollLeftChanges" parameter for the {@link CB_Elements.getScrollLeftById} function or as the "onScrollTopChanges" parameter for the {@link CB_Elements.getScrollTopById} function. All values received should be checked since some could be not numbers.
	 *  @memberof CB_Elements
	 *  @callback CB_Elements.getScrollLeftById_getScrollTopById_ON_SCROLL_CHANGES
	 *  @param {*} scrollLeftOrTop - The scroll left or scroll top position.
	 *  @param {*} scrollLeftOrTopPrevious - The previous scroll left or scroll top position.
	 *  @param {*} scrollWidthOrHeight - The scroll width or scroll height.
	 *  @param {*} clientWidthOrHeight - The client width or client height ([element.clientWidth]{@link https://developer.mozilla.org/en-US/docs/Web/API/Element/clientWidth}/[element.offsetWidth]{@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetWidth} or [element.clientHeight]{@link https://developer.mozilla.org/en-US/docs/Web/API/Element/clientHeight}/[element.offsetHeight]{@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetHeight}, depending on the web client).
	 *  @param {*} scrollLeftOrTopRelative - The relative scroll left or scroll top position.
	 *  @param {*} scrollLeftOrTopRelativePrevious - The previous relative scroll left or scroll top position.
	 */
	
	CB_Elements._getScrollLeftByIdLastValue = {};
	CB_Elements._getScrollLeftByIdTimeout = {};
	CB_Elements._getScrollLeftByIdScrollRelativePrevious = {};
	/**
	 * Returns the horizontal scroll of a given element (by its identifier) and allows running a callback function (becoming recursive if desired). Any previous interval started by a previous call to this function, for the same "elementId", will be stopped.
	 *  @function
	 *  @param {string|window} [elementId=window] - The identifier of the element whose horizontal scroll position we want to get. If a string with the identifier is not given, the unique value allowed is the window object (which is the default value when a non-valid value or no value is given).
	 *  @param {CB_Elements.getScrollLeftById_getScrollTopById_ON_SCROLL_CHANGES} [onScrollLeftChanges] - The desired callback function. It will be called as an interval if "timeoutMs" is a valid integer value.
	 *  @param {boolean} [fireFirstTime=false] - If it is set to true, it will call the callback function (if any) as soon as this function is called.
	 *  @param {boolean} [fireAlways=false] - If it is set to true, it will call the callback function (if any) every interval even if the horizontal scroll value has not changed from the last call.
	 *  @param {integer} [timeoutMs] - The number of milliseconds between one call to the callback function (if any) and the next one. If not given, it will not perform any interval.
	 *  @param {function} [returnNullOnFail=false] - If it is set to true, it will return null instead of zero (0) in the case that something goes wrong.
	 *  @returns {number|null} Returns the horizontal scroll of the given element (by its identifier). It could return zero (0) if something fails (use "returnNullOnFail" set to true to return null when it fails).
	 */
	CB_Elements.getScrollLeftById = function(elementId, onScrollLeftChanges, fireFirstTime, fireAlways, timeoutMs, returnNullOnFail, timeout)
	{
		if (typeof(elementId) === "undefined" || elementId === null || elementId === window) { elementId === "_WHOLE_DOCUMENT_"; }
		if (typeof(CB_Elements._getScrollLeftByIdLastValue[elementId]) === "undefined") { CB_Elements._getScrollLeftByIdLastValue[elementId] = null; }
		if (typeof(timeout) === "undefined" || timeout === null)
		{
			if (typeof(CB_Elements._getScrollLeftByIdTimeout[elementId]) === "undefined") { CB_Elements._getScrollLeftByIdTimeout[elementId] = null; }
			timeout = CB_Elements._getScrollLeftByIdTimeout[elementId];
		}
		
		clearTimeout(timeout);

		var element = CB_isString(elementId) ? CB_Elements.id(elementId) : elementId;
		
		var scrollLeftValue = returnNullOnFail ? null : 0;
		if (typeof(element) === "undefined" || element === null || element === window)
		{
			element = CB_Elements.tag("body", document);
			if (element === null || typeof(element[0]) === "undefined" || element[0] === null) { return returnNullOnFail ? null : 0; }
			element = element[0];
			if (typeof(window.pageXOffset) !== "undefined")
			{
				scrollLeftValue = window.pageXOffset;
			}
			else if (typeof(window.scrollX) !== "undefined")
			{
				scrollLeftValue = window.scrollX;
			}
			else if (typeof(document.documentElement.scrollLeft) !== "undefined" && document.documentElement.scrollLeft !== null && !isNaN(document.documentElement.scrollLeft) && document.documentElement.scrollLeft > 0)
			{
				scrollLeftValue = document.documentElement.scrollLeft;
			}
			else if (typeof(document.body.scrollLeft) !== "undefined" && document.body.scrollLeft !== null)
			{
				scrollLeftValue = document.body.scrollLeft;
			}
		}
		else
		{
			if (typeof(element.scrollLeft) !== "undefined" && element.scrollLeft !== null && !isNaN(element.scrollLeft) && element.scrollLeft > 0)
			{
				scrollLeftValue = element.scrollLeft;
			}
			else if (typeof(element.scrollWidth) !== "undefined" && element.scrollWidth !== null && !isNaN(element.scrollWidth) && element.scrollWidth > 0)
			{
				scrollLeftValue = element.scrollWidth;
			}
		}

		if (isNaN(scrollLeftValue))
		{
			scrollLeftValue = 0;
			if (returnNullOnFail) { scrollLeftValue = null; }
		}			
		
		//If it's not the first time and scroll has been changed, calls the onScrollLeft function (if any):
		if (fireAlways || ((fireFirstTime || CB_Elements._getScrollLeftByIdLastValue[elementId] !== null) && CB_Elements._getScrollLeftByIdLastValue[elementId] !== scrollLeftValue))
		{
			//If there is any defined function:
			if (typeof(onScrollLeftChanges) === "function")
			{
				var scrollRelative = (scrollLeftValue + (element.clientWidth || element.offsetWidth)) / element.scrollWidth * 100;
				if (isNaN(scrollRelative))
				{
					scrollRelative = 0;
					if (returnNullOnFail) { scrollRelative = null; }
				}

				//Sets the new position (to avoid possible infinite recursive loop in the case fireAlways is false):
				CB_Elements._getScrollLeftByIdLastValue[elementId] = scrollLeftValue;
				
				//Executes the function:
				onScrollLeftChanges(scrollLeftValue, CB_Elements._getScrollLeftByIdLastValue[elementId], element.scrollWidth, element.clientWidth || element.offsetWidth, scrollRelative, CB_Elements._getScrollLeftByIdScrollRelativePrevious[elementId]);
				CB_Elements._getScrollLeftByIdScrollRelativePrevious[elementId] = scrollRelative;
			}
		}
		
		//Sets the new position:
		CB_Elements._getScrollLeftByIdLastValue[elementId] = scrollLeftValue;

		
		if (typeof(timeoutMs) !== "undefined" && timeoutMs !== null && !isNaN(timeoutMs) && timeoutMs >= 0)
		{
			CB_Elements._getScrollLeftByIdTimeout[elementId] = timeout =
				setTimeout
				(
					function()
					{
						CB_Elements.getScrollLeftById(elementId, onScrollLeftChanges, fireFirstTime, timeoutMs, returnNullOnFail, timeout);
					}, timeoutMs
				);
		}
		
		return scrollLeftValue;
	}


	CB_Elements._getScrollTopByIdLastValue = {};
	CB_Elements._getScrollTopByIdTimeout = {};
	CB_Elements._getScrollTopByIdScrollRelativePrevious = {};
	/**
	 * Returns the vertical scroll of a given element (by its identifier) and allows running a callback function (becoming recursive if desired). Any previous interval started by a previous call to this function, for the same "elementId", will be stopped.
	 *  @function
	 *  @param {string|window} [elementId=window] - The identifier of the element whose vertical scroll position we want to get. If a string with the identifier is not given, the unique value allowed is the window object (which is the default value when a non-valid value or no value is given).
	 *  @param {CB_Elements.getScrollLeftById_getScrollTopById_ON_SCROLL_CHANGES} [onScrollTopChanges] - The desired callback function. It will be called as an interval if "timeoutMs" is a valid integer value.
	 *  @param {boolean} [fireFirstTime=false] - If it is set to true, it will call the callback function (if any) as soon as this function is called.
	 *  @param {boolean} [fireAlways=false] - If it is set to true, it will call the callback function (if any) every interval even if the vertical scroll value has not changed from the last call.
	 *  @param {integer} [timeoutMs] - The number of milliseconds between one call to the callback function (if any) and the next one. If not given, it will not perform any interval.
	 *  @param {function} [returnNullOnFail=false] - If it is set to true, it will return null instead of zero (0) in the case that something goes wrong.
	 *  @returns {number|null} Returns the vertical scroll of the given element (by its identifier). It could return zero (0) if something fails (use "returnNullOnFail" set to true to return null when it fails).
	 */
	CB_Elements.getScrollTopById = function(elementId, onScrollTopChanges, fireFirstTime, fireAlways, timeoutMs, returnNullOnFail, timeout)
	{
		if (typeof(elementId) === "undefined" || elementId === null || elementId === window) { elementId === "_WHOLE_DOCUMENT_"; }
		if (typeof(CB_Elements._getScrollTopByIdLastValue[elementId]) === "undefined") { CB_Elements._getScrollTopByIdLastValue[elementId] = null; }
		if (typeof(timeout) === "undefined" || timeout === null)
		{
			if (typeof(CB_Elements._getScrollTopByIdTimeout[elementId]) === "undefined") { CB_Elements._getScrollTopByIdTimeout[elementId] = null; }
			timeout = CB_Elements._getScrollTopByIdTimeout[elementId];
		}
		
		clearTimeout(timeout);

		var element = CB_isString(elementId) ? CB_Elements.id(elementId) : elementId;
		
		var scrollTopValue = returnNullOnFail ? null : 0;
		if (typeof(element) === "undefined" || element === null || element === window)
		{
			element = CB_Elements.tag("body", document);
			if (element === null || typeof(element[0]) === "undefined" || element[0] === null) { return returnNullOnFail ? null : 0; }
			element = element[0];
			if (typeof(window.pageYOffset) !== "undefined")
			{
				scrollTopValue = window.pageYOffset;
			}
			else if (typeof(window.scrollY) !== "undefined")
			{
				scrollTopValue = window.scrollY;
			}
			else if (typeof(document.documentElement.scrollTop) !== "undefined" && document.documentElement.scrollTop !== null && !isNaN(document.documentElement.scrollTop) && document.documentElement.scrollTop > 0)
			{
				scrollTopValue = document.documentElement.scrollTop;
			}
			else if (typeof(document.body.scrollTop) !== "undefined" && document.body.scrollTop !== null)
			{
				scrollTopValue = document.body.scrollTop;
			}
		}
		else
		{
			if (typeof(element.scrollTop) !== "undefined" && element.scrollTop !== null && !isNaN(element.scrollTop) && element.scrollTop > 0)
			{
				scrollTopValue = element.scrollTop;
			}
			else if (typeof(element.scrollHeight) !== "undefined" && element.scrollHeight !== null && !isNaN(element.scrollHeight) && element.scrollHeight > 0)
			{
				scrollTopValue = element.scrollHeight;
			}
		}
			
		if (isNaN(scrollTopValue))
		{
			scrollTopValue = 0;
			if (returnNullOnFail) { scrollTopValue = null; }
		}			
			
		//If it's not the first time and scroll has been changed, calls the onScrollTop function (if any):
		if (fireAlways || ((fireFirstTime || CB_Elements._getScrollTopByIdLastValue[elementId] !== null) && CB_Elements._getScrollTopByIdLastValue[elementId] !== scrollTopValue))
		{
			//If there is any defined function:
			if (typeof(onScrollTopChanges) === "function")
			{
				var scrollRelative = (scrollTopValue + (element.clientHeight || element.offsetHeight)) / element.scrollHeight * 100;
				if (isNaN(scrollRelative))
				{
					scrollRelative = 0;
					if (returnNullOnFail) { scrollRelative = null; }
				}

				//Sets the new position (to avoid possible infinite recursive loop in the case fireAlways is false):
				CB_Elements._getScrollTopByIdLastValue[elementId] = scrollTopValue;
				
				//Executes the function:
				onScrollTopChanges(scrollTopValue, CB_Elements._getScrollTopByIdLastValue[elementId], element.scrollHeight, element.clientHeight || element.offsetHeight, scrollRelative, CB_Elements._getScrollTopByIdScrollRelativePrevious[elementId]);
				CB_Elements._getScrollTopByIdScrollRelativePrevious[elementId] = scrollRelative;
			}
		}
		
		//Sets the new position:
		CB_Elements._getScrollTopByIdLastValue[elementId] = scrollTopValue;

		
		if (typeof(timeoutMs) !== "undefined" && timeoutMs !== null && !isNaN(timeoutMs) && timeoutMs >= 0)
		{
			CB_Elements._getScrollTopByIdTimeout[elementId] = timeout =
				setTimeout
				(
					function()
					{
						CB_Elements.getScrollTopById(elementId, onScrollTopChanges, fireFirstTime, timeoutMs, returnNullOnFail, timeout);
					}, timeoutMs
				);
		}
		
		return scrollTopValue;
	}

}