/**
 * @file Groups of graphic sprites management (2D or 3D). Internally, it manages {@link CB_GraphicSprites} objects. Contains the {@link CB_GraphicSpritesScene} class.
 *  @author Joan Alba Maldonado <workindalian@gmail.com>
 *  @license Creative Commons Attribution 4.0 International. See more at {@link https://crossbrowdy.com/about#what_is_the_crossbrowdy_copyright_and_license}.
 */


/**
 * An object with the information that belongs to a group of graphic sprites.
 * @example
 {
	//'my_sprites_scene_1':
	id: "my_sprites_scene_1",
	srcType: CB_GraphicSprites.SRC_TYPES.IMAGE,
	srcLeft: 10,
	srcTop: 20,
	srcWidth: 64,
	srcHeight: 32,
	left: 10,
	top: 20,
	width: 64,
	height: 32,
	data: { datum_1: "value_1", datum_2: 2, datum_3: [ "a", "b", "c" ] },
	//Sprites groups:
	spritesGroups:
	[
		//'my_sprites_1':
		{
			id: "my_sprites_1",
			src: "path/to/image.gif",
			sprites:
			[
				//'my_sprite_1':
				{
					id: "my_sprite_1",
					subSprites:
					[
						//'my_subsprite_1':
						{ id: "my_subsprite_1", srcLeft: 10, srcTop: 20, zIndex: 1 },
						//'my_subsprite_2':
						{ id: "my_subsprite_2", srcLeft: 20, srcTop: 40, zIndex: 2 }
					]
				},
				//'my_sprite_2':
				{
					id: "my_sprite_2",
					subSprites:
					[
						//'my_subsprite_3':
						{ id: "my_subsprite_3", srcLeft: 30, srcTop: 60, zIndex: 1 },
						//'my_subsprite_4':
						{ id: "my_subsprite_4", srcLeft: 40, srcTop: 80, zIndex: 2 }
					]
				}
			]
		 },
		//'my_sprites_2':
		{
			id: "my_sprites_2",
			src: "path/to/image2.gif",
			sprites:
			[
				//'my_sprite_3':
				{
					id: "my_sprite_3",
					subSprites:
					[
						//'my_subsprite_1':
						{ id: "my_subsprite_5", srcLeft: 10, srcTop: 20, zIndex: 1 },
						//'my_subsprite_2':
						{ id: "my_subsprite_6", srcLeft: 20, srcTop: 40, zIndex: 2 }
					]
				},
				//'my_sprite_4':
				{
					id: "my_sprite_4",
					subSprites:
					[
						//'my_subsprite_3':
						{ id: "my_subsprite_7", srcLeft: 30, srcTop: 60, zIndex: 1 },
						//'my_subsprite_4':
						{ id: "my_subsprite_8", srcLeft: 40, srcTop: 80, zIndex: 2 }
					]
				}
			]
		}
	]
 }
 *  @memberof CB_GraphicSpritesScene
 *  @typedef {Object} CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT
 *  @property {string|*} [id='CB_GraphicSpritesScene_' + CB_GraphicSpritesScene._idUnique++] - Identifier of the sprites groups object and also for the graphic sprites scene (also used as the {@link CB_GraphicSprites.id} property for the {@link CB_GraphicSpritesScene} object). It should be unique. Recommended. It must be a value which evaluates to true. By default, it is generated automatically (with an internal counter).
 *  @property {*} [src=""] - The value for the "src" property which will be used as default if not provided (or the provided one was wrong) in the given {@link CB_GraphicSprites.SPRITES_OBJECT} objects (in the "spritesGroups" property), when creating the internal {@link CB_GraphicSprites} objects.
 *  @property {string} [srcType={@link CB_GraphicSprites.SRC_TYPES_DEFAULT}] - The value for the "srcType" property which will be used as default if not provided (or the provided one was wrong) in the given {@link CB_GraphicSprites.SPRITES_OBJECT} objects (in the "spritesGroups" property), when creating the internal {@link CB_GraphicSprites} objects. It should point to a property of the {@link CB_GraphicSprites.SRC_TYPES} object. You can use other values of the {@link CB_GraphicSprites.SRC_TYPES} object or create new ones.
 *  @property {number} [srcLeft={@link CB_GraphicSprites.LEFT_SOURCE_DEFAULT}] - The value for the "srcLeft" property which will be used as default if not provided (or the provided one was wrong) in the given {@link CB_GraphicSprites.SPRITES_OBJECT} objects (in the "spritesGroups" property), when creating the internal {@link CB_GraphicSprites} objects.
 *  @property {number} [srcTop={@link CB_GraphicSprites.TOP_SOURCE_DEFAULT}] - The value for the "srcTop" property which will be used as default if not provided (or the provided one was wrong) in the given {@link CB_GraphicSprites.SPRITES_OBJECT} objects (in the "spritesGroups" property), when creating the internal {@link CB_GraphicSprites} objects.
 *  @property {number} [srcWidth={@link CB_GraphicSprites.WIDTH_SOURCE_DEFAULT}] - The value for the "srcWidth" property which will be used as default if not provided (or the provided one was wrong) in the given {@link CB_GraphicSprites.SPRITES_OBJECT} objects (in the "spritesGroups" property), when creating the internal {@link CB_GraphicSprites} objects.
 *  @property {number} [srcHeight={@link CB_GraphicSprites.HEIGHT_SOURCE_DEFAULT}] - The value for the "srcHeight" property which will be used as default if not provided (or the provided one was wrong) in the given {@link CB_GraphicSprites.SPRITES_OBJECT} objects (in the "spritesGroups" property), when creating the internal {@link CB_GraphicSprites} objects.
 *  @property {number} [left={@link CB_GraphicSprites.LEFT_DEFAULT}] - The value for the "left" property which will be used as default if not provided (or the provided one was wrong) in the given {@link CB_GraphicSprites.SPRITES_OBJECT} objects (in the "spritesGroups" property), when creating the internal {@link CB_GraphicSprites} objects.
 *  @property {number} [top={@link CB_GraphicSprites.TOP_DEFAULT}] - The value for the "top" property which will be used as default if not provided (or the provided one was wrong) in the given {@link CB_GraphicSprites.SPRITES_OBJECT} objects (in the "spritesGroups" property), when creating the internal {@link CB_GraphicSprites} objects.
 *  @property {number} [width={@link CB_GraphicSprites.WIDTH_DEFAULT}] - The value for the "width" property which will be used as default if not provided (or the provided one was wrong) in the given {@link CB_GraphicSprites.SPRITES_OBJECT} objects (in the "spritesGroups" property), when creating the internal {@link CB_GraphicSprites} objects.
 *  @property {number} [height={@link CB_GraphicSprites.HEIGHT_DEFAULT}] - The value for the "height" property which will be used as default if not provided (or the provided one was wrong) in the given {@link CB_GraphicSprites.SPRITES_OBJECT} objects (in the "spritesGroups" property), when creating the internal {@link CB_GraphicSprites} objects.
 *  @property {number} [zIndex={@link CB_GraphicSprites.ZINDEX_DEFAULT}] - The value for the "zIndex" property which will be used as default if not provided (or the provided one was wrong) in the given {@link CB_GraphicSprites.SPRITES_OBJECT} objects (in the "spritesGroups" property), when creating the internal {@link CB_GraphicSprites} objects.
 *  @property {boolean} [disabled=false] - The value for the "disabled" property which will be used as default if not provided (or the provided one was wrong) in the given {@link CB_GraphicSprites.SPRITES_OBJECT} objects (in the "spritesGroups" property), when creating the internal {@link CB_GraphicSprites} objects.
 *  @property {object} [data={ 'that' : CB_GraphicSprites.SPRITES_GROUPS_OBJECT, 'getThis' = function() { return this.that; } }] - Object with any additional data desired which can be any kind. It will always have a "that" property pointing to the {@link CB_GraphicSprites.SPRITES_GROUPS_OBJECT} object where it belongs to and a function in its "getThis" property returning the same value (added automatically). These properties ("that" and "getThis") cannot be overridden. The value given will also be used for the "data" property which will be used as default if not provided (or the provided one was wrong) in the given {@link CB_GraphicSprites.SPRITES_OBJECT} objects (in the "spritesGroups" property), when creating the internal {@link CB_GraphicSprites} objects.
 *  @property {array} [spritesGroups=[]] - Numeric array containing {@link CB_GraphicSprites.SPRITES_OBJECT} objects with all the sprites groups that are useful for creating the internal {@link CB_GraphicSprites} objects. Recommended at least to provide one {@link CB_GraphicSprites.SPRITES_OBJECT} object in the first index.
 *  @property {*} [parent=undefined] - Property pointing to or containing its parent (also used as the {@link CB_GraphicSpritesScene.parent} property for the {@link CB_GraphicSpritesScene} object).
 *  @property {array} items - Read-only numeric array containing {@link CB_GraphicSprites} objects created internally. Their "parent" property will be set to point the current {@link CB_GraphicSpritesScene} object which contains them.
 *  @property {array} itemsByZIndex - Read-only property containing a numeric array of all the {@link CB_GraphicSprites} objects ordered by their z-index ("zIndex" property). It is updated automatically when the z-index of a sprite is set with its {@link CB_GraphicSprites#setZIndex} method or when inserting/removing {@link CB_GraphicSprites} objects through the {@link CB_GraphicSpritesScene#insertSpritesGroups}, {@link CB_GraphicSpritesScene#insertSpritesGroup}, {@link CB_GraphicSpritesScene#removeSpritesGroup} or {@link CB_GraphicSpritesScene#removeSpritesGroupById} methods.
 *  @property {boolean} [byReference_DEFAULT=false] - Default value to use as the "byReference" parameter for the constructor and for the {@link CB_GraphicSpritesScene#insertSpritesGroups} method. If a boolean value is not provided, it will be parsed to boolean (resulting undefined to be false).
 *  @property {CB_GraphicSpritesScene} container - Read-only property pointing to the {@link CB_GraphicSpritesScene} object which contains it.
 *  @property {boolean} isSpritesGroups - Read-only property which is always set to true to help identify this type of object.
 *  @property {'spritesGroups'} type - Read-only property indicating the type of object (always "spritesGroups"). 
 */

 
/**
 * Class to manage different groups of graphic sprites (2D or 3D). Internally, it manages {@link CB_GraphicSprites} objects.
 *  @class
 *  @classdesc Class to manage different groups of graphic sprites (2D or 3D). Internally, it manages {@link CB_GraphicSprites} objects.
 *  @param {CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT} [spritesGroups] - Object with the desired groups of sprites. The information will be used for the {@link CB_GraphicSpritesScene#spritesGroups} property. Used as the "spritesGroups" parameter when calling the {@link CB_GraphicSpritesScene#insertSpritesGroups} method internally.
 *  @param {boolean} [byReference=false] - This value will be used as the "byReference" parameter of the constructor when creating the new internal {@link CB_GraphicSprites} objects. If a boolean value is not provided, it will use the value of the {@link CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT.byReference_DEFAULT} property of the given {@link CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT} object (parsed to boolean).
 *  @returns {CB_GraphicSpritesScene} Returns a new {@link CB_GraphicSpritesScene} object.
 *  @todo Think about a "createCopy" parameter on different the insert methods (to insert sprites groups/graphic sprites objects, etc.) so it will make a copy of the object to avoid using/modifying the original one. If the "createCopy" is set to false, it should always use the object as reference (using/modifying it).
 *  @todo Think about a method to remove a sprite group object when the same sprite group is received by parameter. The same to remove a {@link CB_GraphicSprites} object, receiving a {@link CB_GraphicSprites} object by parameter. The same to remove the sprites groups object, receiving a sprites groups object by parameter. Only remove them if they match exactly.
 *  @todo Think about a method to insert {@link CB_GraphicSprites} object directly. The same with a method that inserts many {@link CB_GraphicSprites} objects (receiving an array with them).
 */
var CB_GraphicSpritesScene = function(spritesGroups, byReference)
{
	//Creates an instance of this object and returns it in the case that it is being called from an unexpected context:
	if (this === window || !(this instanceof CB_GraphicSpritesScene)) { return new CB_GraphicSpritesScene(spritesGroups, byReference); }
	
	//Properties and variables:
	/**
     * Identifier of the sprites groups object (the "id" property of the {@link CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT} stored in the {@link CB_GraphicSpritesScene#spritesGroups} property) and the {@link CB_GraphicSpritesScene} object itself (same one). It should be unique. It must be a value which evaluates to true. By default, it is generated automatically (with an internal counter).
	 *	@var
	 *  @readonly
	 *  @type {string|*}
	 *  @default 'CB_GraphicSpritesScene_' + CB_GraphicSpritesScene._idUnique++
	 */
	this.id = "";

	/**
     * Property pointing to or containing its parent. It is the same as the "parent" property of the {@link CB_GraphicSprites.SPRITES_GROUPS_OBJECT} stored in the {@link CB_GraphicSprites#spritesGroups} property.
	 *	@var
	 *  @readonly
	 *  @type {*}
	 *  @default
	 */
	this.parent = undefined;


	/**
	 * Object containing all the internally-created {@link CB_GraphicSprites} objects and their information.
	 *	@var
	 *  @readonly
	 *  @type {SPRITES_GROUPS_OBJECT}
	 *  @default
	 */
	this.spritesGroups = {};

	//Calls the constructor of the object when creates an instance:
	return this._init(spritesGroups, byReference);
}


//Constants:
/**
 * Property which is always set to true to help identify this type of object.
 *	@constant
 *  @type {boolean}
 *  @default
 */
CB_GraphicSpritesScene.prototype.isSpritesScene = true;


/**
 * Indicates the type of object (always "spritesScene").
 *	@constant
 *  @type {string}
 *  @default
 */
CB_GraphicSpritesScene.prototype.type = "spritesScene";


//Variables:
CB_GraphicSpritesScene._idUnique = 0; //Counter to make the sprites group id unique.


//Constructor:
CB_GraphicSpritesScene.prototype._init = function(spritesGroups, byReference)
{
	this.insertSpritesGroups(spritesGroups, byReference);
	return this;
}


/**
 * Destroys the graphic sprites scene object (removing all the sprites groups and the internal {@link CB_GraphicSprites} objects, etc.) and frees memory.
 *  @function
 */
CB_GraphicSpritesScene.prototype.destructor = function()
{
	//Destroys all the internal CB_GraphicSprites objects:
	this.executeFunctionAll(function() { this.destructor(); });
	
	//Resets properties to their default value:
	this.removeSpritesGroups();
}


/**
 * Alias for {@link CB_GraphicSpritesScene#removeSpritesGroups}.
 *  @function CB_GraphicSpritesScene#removeAll
 *  @see {@link CB_GraphicSpritesScene#removeSpritesGroups}
 */
/**
 * Alias for {@link CB_GraphicSpritesScene#removeSpritesGroups}.
 *  @function CB_GraphicSpritesScene#removeSpritesGroupsAll
 *  @see {@link CB_GraphicSpritesScene#removeSpritesGroups}
 */
/**
 * Removes all the sprites groups (and all the {@link CB_GraphicSprites} objects) by clearing the {@link CB_GraphicSprites#spritesGroups} property.
 *  @function
 */
CB_GraphicSpritesScene.prototype.removeSpritesGroups = CB_GraphicSpritesScene.prototype.removeSpritesGroupsAll = CB_GraphicSpritesScene.prototype.removeAll = function()
{
	this.spritesGroups = {};
}


/**
 * Adds the desired groups of graphic sprites. Calls the {@link CB_GraphicSpritesScene#insertSpritesGroup} and {@link CB_GraphicSpritesScene#updateGraphicSpritesByZIndex} methods internally.
 *  @function
 *  @param {CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT} [spritesGroups] - Object with the desired sprites groups. They will be stored in the "{@link CB_GraphicSpritesScene#spritesGroups}.spritesGroups" property and the {@link CB_GraphicSprites} objects created internally will be stored in the "{@link CB_GraphicSpritesScene#spritesGroups}.items" property.
 *  @param {boolean} [byReference=!!{@link CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT.byReference_DEFAULT}] - This value will be used as the "byReference" parameter of the constructor when creating the new internal {@link CB_GraphicSprites} objects. If a boolean value is not provided, it will use the value of the {@link CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT.byReference_DEFAULT} property of the given {@link CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT} object (parsed to boolean).
 *  @returns {CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT} Returns the {@link CB_GraphicSpritesScene#spritesGroups} property after updating it.
 */
CB_GraphicSpritesScene.prototype.insertSpritesGroups = function(spritesGroups, byReference)
{
	//Sets the properties (sanitizing them):
	this.spritesGroups = this.spritesGroups || {};
	spritesGroups = spritesGroups || {};
	this.spritesGroups.isSpritesGroups = true;
	this.spritesGroups.type = "spritesGroups";
	this.spritesGroups.container = this;
	this.parent = this.spritesGroups.parent = spritesGroups.parent;
	this.id = this.spritesGroups.id = spritesGroups.id = spritesGroups.id || "CB_GraphicSpritesScene_" + CB_GraphicSpritesScene._idUnique++;
	this.spritesGroups.src = spritesGroups.src = spritesGroups.src || !isNaN(spritesGroups.src) && spritesGroups.src !== null ? spritesGroups.src : "";
	this.spritesGroups.srcType = spritesGroups.srcType = spritesGroups.srcType || CB_GraphicSprites.SRC_TYPES_DEFAULT;
	spritesGroups.srcLeft = parseFloat(spritesGroups.srcLeft);
	this.spritesGroups.srcLeft = spritesGroups.srcLeft = !isNaN(spritesGroups.srcLeft) ? spritesGroups.srcLeft : parseFloat(CB_GraphicSprites.LEFT_SOURCE_DEFAULT) || 0;
	spritesGroups.left = parseFloat(spritesGroups.left);
	this.spritesGroups.left = spritesGroups.left = !isNaN(spritesGroups.left) ? spritesGroups.left : parseFloat(CB_GraphicSprites.LEFT_DEFAULT) || 0;
	spritesGroups.srcTop = parseFloat(spritesGroups.srcTop);
	this.spritesGroups.srcTop = spritesGroups.srcTop = !isNaN(spritesGroups.srcTop) ? spritesGroups.srcTop : parseFloat(CB_GraphicSprites.TOP_SOURCE_DEFAULT) || 0;
	spritesGroups.top = parseFloat(spritesGroups.top);
	this.spritesGroups.top = spritesGroups.top = !isNaN(spritesGroups.top) ? spritesGroups.top : parseFloat(CB_GraphicSprites.TOP_DEFAULT) || 0;
	spritesGroups.srcWidth = parseFloat(spritesGroups.srcWidth);
	this.spritesGroups.srcWidth = spritesGroups.srcWidth = !isNaN(spritesGroups.srcWidth) ? spritesGroups.srcWidth : parseFloat(CB_GraphicSprites.WIDTH_SOURCE_DEFAULT) || 0;
	spritesGroups.width = parseFloat(spritesGroups.width);
	this.spritesGroups.width = spritesGroups.width = !isNaN(spritesGroups.width) ? spritesGroups.width : parseFloat(CB_GraphicSprites.WIDTH_DEFAULT) || 0;
	spritesGroups.srcHeight = parseFloat(spritesGroups.srcHeight);
	this.spritesGroups.srcHeight = spritesGroups.srcHeight = !isNaN(spritesGroups.srcHeight) ? spritesGroups.srcHeight : parseFloat(CB_GraphicSprites.HEIGHT_SOURCE_DEFAULT) || 0;
	spritesGroups.height = parseFloat(spritesGroups.height);
	this.spritesGroups.height = spritesGroups.height = !isNaN(spritesGroups.height) ? spritesGroups.height : parseFloat(CB_GraphicSprites.HEIGHT_DEFAULT) || 0;
	spritesGroups.zIndex = parseFloat(spritesGroups.zIndex);
	this.spritesGroups.zIndex = spritesGroups.zIndex = !isNaN(spritesGroups.zIndex) ? spritesGroups.zIndex : parseFloat(CB_GraphicSprites.ZINDEX_DEFAULT) || 0;
	this.spritesGroups.data = typeof(spritesGroups.data) === "object" && spritesGroups.data !== null ? CB_copyObject(spritesGroups.data, false) : {}; //Accepts any object but not other values.
	this.spritesGroups.data.that = this.spritesGroups;
	this.spritesGroups.data.getThis = function() { return this.that; };
	
	spritesGroups.spritesGroups = CB_isArray(spritesGroups.spritesGroups) ? spritesGroups.spritesGroups : [];
	
	//Inserts the given sprites groups, one by one:
	byReference = (byReference === true || byReference === false) ? byReference : !!spritesGroups.byReference_DEFAULT;
	var spritesGroupsLength = spritesGroups.spritesGroups.length;
	for (var x = 0; x < spritesGroupsLength; x++)
	{
		this.insertSpritesGroup(spritesGroups.spritesGroups[x], true, byReference);
	}

	//Updates the array with the CB_GraphicSprites ordered by z-index:
	this.updateGraphicSpritesByZIndex();
	
	//Returns the sprites:
	return this.spritesGroups;
}


/**
 * Alias for {@link CB_GraphicSpritesScene#updateGraphicSpritesByZIndex}.
 *  @function CB_GraphicSpritesScene#updateItemsByZIndex
 *  @see {@link CB_GraphicSpritesScene#updateGraphicSpritesByZIndex}
 */
/**
 * Updates (sorts again) the "itemsByZIndex" property (which is an array with the {@link CB_GraphicSprites} objects ordered by z-index, whose data comes from the array in the "items" property of the {@link CB_GraphicSpritesScene#spritesGroups} object) of the {@link CB_GraphicSpritesScene#spritesGroups} object.
 *  @function
 *  @returns {array} Returns the "itemsByZIndex" array of the {@link CB_GraphicSpritesScene#spritesGroups} object after updating it. Returns null if the property could not be obtained or updated.
 */
CB_GraphicSpritesScene.prototype.updateGraphicSpritesByZIndex = CB_GraphicSpritesScene.prototype.updateItemsByZIndex = function()
{
	this.spritesGroups.items = this.spritesGroups.items || null;
	if (this.spritesGroups.items)
	{
		var spritesGroupLength = this.spritesGroups.items.length;
		if (spritesGroupLength)
		{
			var elementIndex = null;
			this.spritesGroups.itemsByZIndex = [];
			for (var x = 0; x < spritesGroupLength; x++)
			{
				elementIndex = CB_GraphicSpritesScene._choosePositionByZIndex(this.spritesGroups.itemsByZIndex, this.spritesGroups.items[x]);
				this.spritesGroups.itemsByZIndex = CB_Arrays.insertElement(this.spritesGroups.itemsByZIndex, elementIndex, this.spritesGroups.items[x]);
				this.spritesGroups.items[x].positionByZIndex = elementIndex;
			}
			return this.spritesGroups.itemsByZIndex;
		}
	}
	return null;
}


/**
 * Alias for {@link CB_GraphicSpritesScene#removeSpritesGroup}.
 *  @function CB_GraphicSpritesScene#remove
 *  @see {@link CB_GraphicSpritesScene#removeSpritesGroup}
 */
/**
 * Alias for {@link CB_GraphicSpritesScene#removeSpritesGroup}.
 *  @function CB_GraphicSpritesScene#removeGraphicSprites
 *  @see {@link CB_GraphicSpritesScene#removeSpritesGroup}
 */
/**
 * Removes a sprites group and its {@link CB_GraphicSprites} object by its index (its position in the {@link CB_GraphicSpritesScene#spritesGroups.items} array). Calls the {@link CB_GraphicSpritesScene#updateGraphicSpritesByZIndex} method internally.
 *  @function
 *  @param {integer} [index=0] - The index where the {@link CB_GraphicSprites} object is located (its position in the {@link CB_GraphicSpritesScene#spritesGroups.items} array).
 *  @returns {boolean} Returns true if the {@link CB_GraphicSprites} object has been deleted from the graphic sprites scene object or false otherwise.
 */
CB_GraphicSpritesScene.prototype.removeSpritesGroup = CB_GraphicSpritesScene.prototype.removeGraphicSprites = CB_GraphicSpritesScene.prototype.remove = function(index)
{
	var removed = false;
	var spritesGroupsLeft = CB_Arrays.removeElementByPosition(this.spritesGroups.items, index, function() { removed = true; });
	if (removed)
	{
		this.spritesGroups.spritesGroups = CB_Arrays.removeElementByPosition(this.spritesGroups.spritesGroups, index);
		this.spritesGroups.items = spritesGroupsLeft;
		
		//Updates the array with the CB_GraphicSprites ordered by z-index:
		this.updateGraphicSpritesByZIndex();
	}
	return removed;
}


/**
 * Alias for {@link CB_GraphicSpritesScene#removeSpritesGroupById}.
 *  @function CB_GraphicSpritesScene#removeById
 *  @see {@link CB_GraphicSpritesScene#removeSpritesGroupById}
 */
/**
 * Alias for {@link CB_GraphicSpritesScene#removeSpritesGroupById}.
 *  @function CB_GraphicSpritesScene#removeGraphicSpritesById
 *  @see {@link CB_GraphicSpritesScene#removeSpritesGroupById}
 */
/**
 * Removes a sprites group and its {@link CB_GraphicSprites} object by its identifier. Calls the {@link CB_GraphicSpritesScene#updateGraphicSpritesByZIndex} method internally.
 *  @function
 *  @param {string|*} [id=undefined] - The identifier of the {@link CB_GraphicSprites} object.
 *  @returns {boolean} Returns true if the {@link CB_GraphicSprites} object has been deleted from the graphic sprites scene object or false otherwise.
 *  @todo Optimize it (perhaps using a cache matching the IDs with their position, maybe using the "position" or "positionByZIndex" properties).
 */
CB_GraphicSpritesScene.prototype.removeSpritesGroupById = CB_GraphicSpritesScene.prototype.removeGraphicSpritesById = CB_GraphicSpritesScene.prototype.removeById = function(id)
{
	var removed = false;
	var index = null;
	var spritesGroupsLeft = CB_Arrays.removeDuplicated(this.spritesGroups.items, function(value, position, array) { if (value && value.id === id) { removed = true; index = position; return true; }; return false; }, true);
	if (removed)
	{
		if (index !== null) { this.spritesGroups.spritesGroups = CB_Arrays.removeElementByPosition(this.spritesGroups.spritesGroups, index); }
		this.spritesGroups.items = spritesGroupsLeft;
		
		//Updates the array with the CB_GraphicSprites ordered by z-index:
		this.updateGraphicSpritesByZIndex();
	}
	return removed;
}


/**
 * Object used as the returning value of the {@link CB_GraphicSpritesScene#insertSpritesGroup} method.
 *  @memberof CB_GraphicSpritesScene
 *  @typedef {Object} CB_GraphicSpritesScene.insertSpritesGroup_OBJECT
 *  @property {CB_GraphicSprites.SPRITES_OBJECT} spritesGroup - The {@link CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT} which has been inserted (it could have been modified/sanitized from the given one and some missing properties or those which were wrong could have been inherited) and was used to create the internal {@link CB_GraphicSprites} object when calling its constructor.
 *  @property {CB_GraphicSprites} item - The {@link CB_GraphicSprites} object created and inserted from the {@link CB_GraphicSprites.SPRITES_OBJECT}.
 */

/**
 * Alias for {@link CB_GraphicSpritesScene#insertSpritesGroup}.
 *  @function CB_GraphicSpritesScene#insert
 *  @see {@link CB_GraphicSpritesScene#insertSpritesGroup}
 */	
/**
 * Adds the desired group of graphic sprites. Creates internal {@link CB_GraphicSprites} objects.
 *  @function
 *  @param {CB_GraphicSprites.SPRITES_OBJECT} [spritesGroup] - Object with the desired sprites group. It will be stored in the "{@link CB_GraphicSpritesScene#spritesGroups}.spritesGroups" property and the {@link CB_GraphicSprites} object created internally will be stored in the "{@link CB_GraphicSpritesScene#spritesGroups}.items" property.
 *  @param {boolean} [avoidUpdatingGraphicSpritesByZIndex=false] - If set to true, it will not call the {CB_GraphicSpritesScene#updateGraphicSpritesByZIndex} method internally. Internal usage recommended only.
 *  @param {boolean} [byReference=false] - This value will be used as the "byReference" parameter of the constructor when creating the new internal {@link CB_GraphicSprites} objects.
 *  @returns {CB_GraphicSpritesScene.insertSpritesGroup_OBJECT} Returns an object whose "spritesGroup" property contains the {@link CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT} which has been inserted (it could have been modified/sanitized from the given one and some missing properties or those which were wrong could have been inherited) and was used to create the internal {@link CB_GraphicSprites} object when calling its constructor and the "item" property contains the {@link CB_GraphicSprites} object created and inserted.
 */
CB_GraphicSpritesScene.prototype.insertSpritesGroup = CB_GraphicSpritesScene.prototype.insert = function(spritesGroup, avoidUpdatingGraphicSpritesByZIndex, byReference)
{
	//Sets the properties (sanitizing them):
	this.spritesGroups = this.spritesGroups || {};
	spritesGroup = spritesGroup || {};
	spritesGroup.parent = this; //Overwrites the parent to point to the CB_GraphicSprites itself which will contain it.
	spritesGroup.src = spritesGroup.src || !isNaN(spritesGroup.src) && spritesGroup.src !== null ? spritesGroup.src : this.spritesGroups.src || !isNaN(this.spritesGroups.src) && this.spritesGroups.src !== null ? this.spritesGroups.src : "";
	spritesGroup.srcType = spritesGroup.srcType || this.spritesGroups.srcType || CB_GraphicSprites.SRC_TYPES_DEFAULT;
	spritesGroup.srcLeft = parseFloat(spritesGroup.srcLeft);
	spritesGroup.srcLeft = !isNaN(spritesGroup.srcLeft) ? spritesGroup.srcLeft : parseFloat(this.spritesGroups.srcLeft);
	spritesGroup.srcLeft = !isNaN(spritesGroup.srcLeft) ? spritesGroup.srcLeft : parseFloat(CB_GraphicSprites.LEFT_SOURCE_DEFAULT) || 0;
	spritesGroup.left = parseFloat(spritesGroup.left);
	spritesGroup.left = !isNaN(spritesGroup.left) ? spritesGroup.left : parseFloat(this.spritesGroups.left);
	spritesGroup.left = !isNaN(spritesGroup.left) ? spritesGroup.left : parseFloat(CB_GraphicSprites.LEFT_DEFAULT) || 0;
	spritesGroup.srcTop = parseFloat(spritesGroup.srcTop);
	spritesGroup.srcTop = !isNaN(spritesGroup.srcTop) ? spritesGroup.srcTop : parseFloat(this.spritesGroups.srcTop);
	spritesGroup.srcTop = !isNaN(spritesGroup.srcTop) ? spritesGroup.srcTop : parseFloat(CB_GraphicSprites.TOP_SOURCE_DEFAULT) || 0;
	spritesGroup.top = parseFloat(spritesGroup.top);
	spritesGroup.top = !isNaN(spritesGroup.top) ? spritesGroup.top : parseFloat(this.spritesGroups.top);
	spritesGroup.top = !isNaN(spritesGroup.top) ? spritesGroup.top : parseFloat(CB_GraphicSprites.TOP_DEFAULT) || 0;
	spritesGroup.srcWidth = parseFloat(spritesGroup.srcWidth);
	spritesGroup.srcWidth = !isNaN(spritesGroup.srcWidth) ? spritesGroup.srcWidth : parseFloat(this.spritesGroups.srcWidth);
	spritesGroup.srcWidth = !isNaN(spritesGroup.srcWidth) ? spritesGroup.srcWidth : parseFloat(CB_GraphicSprites.WIDTH_SOURCE_DEFAULT) || 0;
	spritesGroup.width = parseFloat(spritesGroup.width);
	spritesGroup.width = !isNaN(spritesGroup.width) ? spritesGroup.width : parseFloat(this.spritesGroups.width);
	spritesGroup.width = !isNaN(spritesGroup.width) ? spritesGroup.width : parseFloat(CB_GraphicSprites.WIDTH_DEFAULT) || 0;
	spritesGroup.srcHeight = parseFloat(spritesGroup.srcHeight);
	spritesGroup.srcHeight = !isNaN(spritesGroup.srcHeight) ? spritesGroup.srcHeight : parseFloat(this.spritesGroups.srcHeight);
	spritesGroup.srcHeight = !isNaN(spritesGroup.srcHeight) ? spritesGroup.srcHeight : parseFloat(CB_GraphicSprites.HEIGHT_SOURCE_DEFAULT);
	spritesGroup.height = parseFloat(spritesGroup.height);
	spritesGroup.height = !isNaN(spritesGroup.height) ? spritesGroup.height : parseFloat(this.spritesGroups.height);
	spritesGroup.height = !isNaN(spritesGroup.height) ? spritesGroup.height : parseFloat(CB_GraphicSprites.HEIGHT_DEFAULT) || 0;
	spritesGroup.zIndex = parseFloat(spritesGroup.zIndex);
	spritesGroup.zIndex = !isNaN(spritesGroup.zIndex) ? spritesGroup.zIndex : parseFloat(this.spritesGroups.zIndex);
	spritesGroup.zIndex = !isNaN(spritesGroup.zIndex) ? spritesGroup.zIndex : parseFloat(CB_GraphicSprites.ZINDEX_DEFAULT) || 0;
	spritesGroup.disabled = !!spritesGroup.disabled || false;
	spritesGroup.data = typeof(spritesGroup.data) === "object" && spritesGroup.data !== null ? spritesGroup.data : {}; //this.spritesGroups.data;
	if (typeof(this.spritesGroups.data) === "object" && this.spritesGroups.data !== null) { spritesGroup.data = CB_combineJSON(this.spritesGroups.data, spritesGroup.data); } //Combine objects.
	spritesGroup.data = typeof(spritesGroup.data) === "object" && spritesGroup.data !== null ? CB_copyObject(spritesGroup.data, false) : {}; //Note: the CB_GraphicSprites class will add the "that" and "getThis" properties to the "data".
	
	//Creates and inserts the sprites group:
	this.spritesGroups.items = this.spritesGroups.items || [];
	this.spritesGroups.spritesGroups = this.spritesGroups.spritesGroups || [];
	var item = new CB_GraphicSprites(spritesGroup, byReference);
	var position = this.getGraphicSpritesIndexById(item.id); //If there is a sprites group with the same ID, it will be replaced by the new one (in the same position).
	position = position !== -1 ? position : this.spritesGroups.items.length;
	item.position = position;
	this.spritesGroups.items[position] = item;
	spritesGroup.isSpritesGroup = true; //Adds the "isSpritesGroup" property to the sprites groups object.
	spritesGroup.type = "spritesGroup"; //Adds the "type" property to the sprites groups object.
	this.spritesGroups.spritesGroups[position] = spritesGroup; //Overrides the sprites groups object, sanitized.
	
	if (!avoidUpdatingGraphicSpritesByZIndex) { this.updateGraphicSpritesByZIndex(); }
	
	//Returns the sprites:
	return { "spritesGroup" : spritesGroup, "item" : item };
}


//Returns the position that an element (subsprites group, sprite or sub-sprite) should have in a given array, having in mind that they are sorted by z-index in that array (ascending order):
CB_GraphicSpritesScene._choosePositionByZIndex = function(array, element)
{
	if (array && element)
	{
		var arrayLength = array.length;
		if (arrayLength)
		{
			for (var x = 0; x < arrayLength; x++)
			{
				if (array[x] && array[x].zIndex > element.zIndex) { return x; }
			}
			return array.length; //By default, best position is at the end of the array (as a new element).
		}
	}
	return 0;
}


/**
 * Alias for {@link CB_GraphicSpritesScene#getSpritesGroups}.
 *  @function CB_GraphicSpritesScene#getSpritesGroupsAll
 *  @see {@link CB_GraphicSpritesScene#getSpritesGroups}
 */
/**
 * Gets the sprites groups object (the {@link CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT} object which is in the {@link CB_GraphicSpritesScene#spritesGroups} property), if any.
 *  @function
 *  @param {*} [returnValueOnFail=undefined] - The value we want it to return in the case that no value is found. If not provided, undefined will be returned.
 *  @returns {CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT|*} Returns the sprites groups object (the {@link CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT} object which is in the {@link CB_GraphicSpritesScene#spritesGroups} property), if any, or the value of "returnValueOnFail" otherwise.
 */
CB_GraphicSpritesScene.prototype.getSpritesGroups = CB_GraphicSpritesScene.prototype.getSpritesGroupsAll = function(returnValueOnFail)
{
	return this.spritesGroups ? this.spritesGroups : returnValueOnFail;
}


/**
 * Alias for {@link CB_GraphicSpritesScene#getGraphicSpritesAll}.
 *  @function CB_GraphicSpritesScene#getAll
 *  @see {@link CB_GraphicSpritesScene#getGraphicSpritesAll}
 */
/**
 * Gets all the sprites graphic objects (the "items" property of the internal {@link CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT} object, if any).
 *  @function
 *  @param {boolean} [orderedByZIndex=false] - If set to true, it will return the {@link CB_GraphicSprites} objects sorted by their z-index (ascending order).
 *  @param {*} [returnValueOnFail=undefined] - The value we want it to return in the case that no value is found. If not provided, undefined will be returned.
 *  @returns {array|*} Returns an array with all the {@link CB_GraphicSprites} objects or the value of "returnValueOnFail" otherwise.
 */
CB_GraphicSpritesScene.prototype.getGraphicSpritesAll = CB_GraphicSpritesScene.prototype.getAll = function(orderedByZIndex, returnValueOnFail)
{
	if (this.spritesGroups)
	{
		if (!orderedByZIndex)
		{
			return (this.spritesGroups.items) ? this.spritesGroups.items : returnValueOnFail;
		}
		else
		{
			return (this.spritesGroups.itemsByZIndex) ? this.spritesGroups.itemsByZIndex : returnValueOnFail;
		}
	}
	return returnValueOnFail;
}


/**
 * Alias for {@link CB_GraphicSpritesScene#getGraphicSprites}.
 *  @function CB_GraphicSpritesScene#get
 *  @see {@link CB_GraphicSpritesScene#getGraphicSprites}
 */	
/**
 * Gets a desired {@link CB_GraphicSprites} object through its index (its position in the {@link CB_GraphicSpritesScene#spritesGroups.items} array). Faster than getting it through its identifier with the {@link CB_GraphicSpritesScene#getGraphicSpritesById} method.
 *  @function
 *  @param {integer} [index=0] - The index where the desired {@link CB_GraphicSprites} object must be located (its position in the {@link CB_GraphicSpritesScene#spritesGroups.items} array).
 *  @param {*} [returnValueOnFail=undefined] - The value we want it to return in the case that no value is found. If not provided, undefined will be returned.
 *  @returns {CB_GraphicSprites|*} Returns a {@link CB_GraphicSprites} object if found or the value of "returnValueOnFail" otherwise.
 */
CB_GraphicSpritesScene.prototype.getGraphicSprites = CB_GraphicSpritesScene.prototype.get = function(index, returnValueOnFail)
{
	index = parseInt(index);
	index = isNaN(index) ? 0 : index;
	if (index < 0) { index *= -1; } //It must be a positive integer.
	return this.spritesGroups && this.spritesGroups.items && this.spritesGroups.items[index] ? this.spritesGroups.items[index] : returnValueOnFail;
}


/**
 * Alias for {@link CB_GraphicSpritesScene#getGraphicSpritesById}.
 *  @function CB_GraphicSpritesScene#getById
 *  @see {@link CB_GraphicSpritesScene#getGraphicSpritesById}
 */	
/**
 * Gets a desired {@link CB_GraphicSprites} object through its identifier. Slower than getting it through its index with the {@link CB_GraphicSpritesScene#getGraphicSprites} method.
 *  @function
 *  @param {string|*} [id=undefined] - The identifier of the {@link CB_GraphicSprites} object that we want to get.
 *  @param {*} [returnValueOnFail=undefined] - The value we want it to return in the case that no value is found. If not provided, undefined will be returned.
 *  @returns {CB_GraphicSprites|*} Returns a {@link CB_GraphicSprites} object if found or the value of "returnValueOnFail" otherwise.
 */
CB_GraphicSpritesScene.prototype.getGraphicSpritesById = CB_GraphicSpritesScene.prototype.getById = function(id, returnValueOnFail)
{
	var index = this.getGraphicSpritesIndexById(id);
	return index !== -1 ? this.spritesGroups.items[index] : returnValueOnFail;
}


/**
 * Alias for {@link CB_GraphicSpritesScene#getGraphicSpritesIndexById}.
 *  @function CB_GraphicSpritesScene#getIndexById
 *  @see {@link CB_GraphicSpritesScene#getGraphicSpritesIndexById}
 */	
/**
 * Gets the index (the position in the {@link CB_GraphicSpritesScene#spritesGroups.items} array) of a desired {@link CB_GraphicSprites} object by its identifier.
 *  @function
 *  @param {string|*} [id=undefined] - The identifier of the {@link CB_GraphicSprites} object whose index we want to get.
 *  @returns {integer} Returns the index (the position in the {@link CB_GraphicSpritesScene#spritesGroups.items} array) of the desired {@link CB_GraphicSprites} object or -1 if not found.
 *  @todo Optimize it (perhaps using a cache matching the IDs with their position, maybe using the "position" or "positionByZIndex" properties).
 */
CB_GraphicSpritesScene.prototype.getGraphicSpritesIndexById = CB_GraphicSpritesScene.prototype.getIndexById = function(id)
{
	if (this.spritesGroups && this.spritesGroups.items)
	{
		var spritesGroupsLength = this.spritesGroups.items.length;
		for (var x = 0; x < spritesGroupsLength; x++)
		{
			if (this.spritesGroups.items[x].id === id) { return x; }
		}
	}
	return -1;
}


/**
 * Alias for {@link CB_GraphicSpritesScene#executeFunctionAll}.
 *  @function CB_GraphicSpritesScene#executeAll
 *  @see {@link CB_GraphicSpritesScene#executeFunctionAll}
 */	
 /**
 * Alias for {@link CB_GraphicSpritesScene#executeFunctionAll}.
 *  @function CB_GraphicSpritesScene#forEach
 *  @see {@link CB_GraphicSpritesScene#executeFunctionAll}
 */	
 /**
 * Alias for {@link CB_GraphicSpritesScene#executeFunctionAll}.
 *  @function CB_GraphicSpritesScene#forEachGraphicSprites
 *  @see {@link CB_GraphicSpritesScene#executeFunctionAll}
 */	
 /**
 * Performs a desired action, using the provided function, on all the existing {@link CB_GraphicSprites} objects or on the desired ones (if provided). Calls the {@link CB_Arrays.executeFunctionAll} function internally and returns its returning value.
 *  @function
 *  @param {CB_Arrays.executeFunctionAll_ON_LOOP_CALLBACK} functionEach - Function that will be called for each {@link CB_GraphicSprites} object. As the first parameter it receives the {@link CB_GraphicSprites} object of the "graphicSpritesObjects" being looped, as the second parameter the position of this {@link CB_GraphicSprites} object in the "graphicSpritesObjects" array provided (or, if not provided, in the array returned by the {@link CB_GraphicSpritesScene#getGraphicSpritesAll} method), the third parameter is the array being looped and the fourth parameter will be the "delayBetweenEach" being used, being "this" the {@link CB_GraphicSprites} object itself.
 *  @param {boolean} [orderedByZIndex=false] - If set to true, it will loop the {@link CB_GraphicSprites} sorted by their z-index (ascending order).
 *  @param {number|CB_Arrays.executeFunctionAll_ON_LOOP_CALLBACK} [delayBetweenEach=0] - If a value greater than zero is used, it will be used as the delay desired between each call to the "functionEach" function (calling them using the [setTimeout]{@link https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout} function internally). If not provided or the value is 0 (zero) or lower, each call to the "functionEach" function will be performed immediately one after the other. If a function is provided, it will be called with the same parameters as the "functionEach" function and its returning value will be used as the delay (executed every loop for each {@link CB_GraphicSprites} object).
 *  @param {array} [graphicSpritesObjects={@link CB_GraphicSpritesScene#getGraphicSpritesAll}()] - A numeric array containing the {@link CB_GraphicSprites} objects that we want to loop. It should contain only {@link CB_GraphicSprites} objects which are already in the current {@link CB_GraphicSpritesScene} object. If not provided, it will use all the {@link CB_GraphicSprites} objects contained in the {@link CB_GraphicSpritesScene} object.
 *  @param {boolean} [returnSetTimeoutsArray=false] - Defines whether we want the method to return an integer or a numeric array with information of each [setTimeout]{@link https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout} call. Returning an array with information of each [setTimeout]{@link https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout} call is only useful when the [setTimeout]{@link https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout} function is called internally, which happens when the "delayBetweenEach" parameter is greater than 0 (zero).
 *  @param {boolean} [delayBetweenEachAffectsFirst=false] - If set to true, the desired delay (if any) will also affect the first call to the "functionEach" function.
 *  @param {CB_Arrays.executeFunctionAll_ON_FINISH_CALLBACK} [functionFinish] - Function that will be called for when it has finished looping all the items. The first parameter will be the array which was looped, the second parameter will be the number of times that the "functionEach" callback was called (the most likely, matches the number of elements unless they are undefined or null), and the third parameter will be the maximum "delay" used, being "this" the array itself.
 *  @returns {integer|array} If the "returnSetTimeoutsArray" parameter is set to false, it will return the number of calls to the "functionEach" function that were performed (which should be the same number as the {@link CB_GraphicSprites} objects given in the "graphicSpritesObjects" parameter). Otherwise, if the "returnSetTimeoutsArray" is set to true, it will return a numeric array with a {@link CB_Arrays.executeFunctionAll_OBJECT} object for each {@link CB_GraphicSprites} given. The length of this array will also be the number of calls to the "functionEach" function that were performed. Note that if a value greater than 0 (zero) for the "delayBetweenEach" parameter has been provided, perhaps not all calls of the "functionEach" function will have been performed yet when exiting this method because of the asynchronous nature of the [setTimeout]{@link https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout} function.
 *  @todo Think about only allowing {@link CB_GraphicSprites} objects (in the "graphicSpritesObjects" parameter) which are already in the {@link CB_GraphicSpritesScene} (identify them by their ID), to avoid problems.
 */
CB_GraphicSpritesScene.prototype.executeFunctionAll = CB_GraphicSpritesScene.prototype.executeAll = CB_GraphicSpritesScene.prototype.forEachGraphicSprites = CB_GraphicSpritesScene.prototype.forEach = function(functionEach, orderedByZIndex, delayBetweenEach, graphicSpritesObjects, returnSetTimeoutsArray, delayBetweenEachAffectsFirst, functionFinish)
{
	return CB_Arrays.executeFunctionAll(CB_isArray(graphicSpritesObjects) ? graphicSpritesObjects : this.getGraphicSpritesAll(orderedByZIndex, []), functionEach, delayBetweenEach, returnSetTimeoutsArray, delayBetweenEachAffectsFirst, functionFinish);
}


/**
 * Sets the desired value of a given property name to the {@link CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT} object as well to its {@link CB_GraphicSprites} objects and their children (their {@link CB_GraphicSprites.SPRITES_OBJECT} object, including their {@link CB_GraphicSprites.SPRITE_OBJECT} and their {@link CB_GraphicSprites.SUBSPRITE_OBJECT} objects). Calls the {@link CB_GraphicSprites#setPropertyCascade} method internally.
 *  @function
 *  @param {number} propertyName - The name of the property we want to affect. Also used as the "propertyName" parameter when calling the {@link CB_GraphicSprites#setPropertyCascade} method internally.
 *  @param {*} [value=undefined] - The value desired for the given property. Also used as the "value" parameter when calling the {@link CB_GraphicSprites#setPropertyCascade} method internally.
 *  @param {boolean} [onlyCurrent=false] - If set to true, it will only affect the current sprite and its sub-sprites of each {@link CB_GraphicSprites} object (and also the {@link CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT} object and the {@link CB_GraphicSprites.SPRITES_OBJECT} object of each {@link CB_GraphicSprites} object). Used as the "propertyName" parameter when calling the {@link CB_GraphicSprites#setPropertyCascade} method internally.
 *  @returns {integer} Returns the number of elements affected (counting the {@link CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT} object and the {@link CB_GraphicSprites.SPRITES_OBJECT} objects).
 */
CB_GraphicSpritesScene.prototype.setPropertyCascade = function(propertyName, value, onlyCurrent)
{
	if (!propertyName) { return; }
	
	this.spritesGroups[propertyName] = value;
	var affected = 1;
	
	this.forEachGraphicSprites(function() { affected += this.setPropertyCascade(propertyName, value, onlyCurrent); });
	
	return affected;
}


/**
 * Gets a new copy of this object with the same attributes (all sub-objects will be a copy, they will not use the same reference).
 *  @function
 *  @param {boolean} [avoidCopyingPointers=false] - If set to true, it will not copy the {@link CB_GraphicSprites#pointer} property of each {@link CB_GraphicSprites} object.
 *  @param {boolean} [avoidCopyingTimes=false] - If set to true, it will not copy neither the {@link CB_GraphicSprites#time} property of each {@link CB_GraphicSprites} object nor the "time" property of each of their sprites ({@link CB_GraphicSprites.SPRITE_OBJECT} objects).
 *  @param {boolean} [clearReferences=false] - If set to true, it will not copy neither the "container" nor the "parent" nor the "data.that" nor the "data.getThis" properties of any element. Useful to be able to stringify the object preventing the "TypeError: cyclic object value" error. When set to true, calls the {@link CB_GraphicSprites.clearReferences} function internally. If set to true and the "filterProperties" parameter is also set to true, the {@link CB_GraphicSprites.filterProperties} will always be called before calling the {@link CB_GraphicSprites.clearReferences} function.
 *  @param {boolean} [filterProperties=false] - If set to true, it will call the {@link CB_GraphicSprites.filterProperties} function internally to filter the properties that we do not want to keep (using the given "propertiesToKeepObject" as the parameter to call it). When set to true, calls the {@link CB_GraphicSprites.filterProperties} function internally. If set to true and the "clearReferences" parameter is also set to true, the {@link CB_GraphicSprites.filterProperties} will always be called before calling the {@link CB_GraphicSprites.clearReferences} function.
 *  @param {CB_GraphicSprites.filterProperties_propertiesToKeepObject_TYPE} [propertiesToKeepObject=CB_GraphicSprites.filterProperties_DEFAULT_PROPERTIES] - The object with the properties that we want to keep. Only used when the "filterProperties" parameter is set to true, as the "propertiesToKeepObject" when calling the {@link CB_GraphicSprites.filterProperties} function internally.
 *  @returns {CB_GraphicSpritesScene} Returns a copy of this object with the same attributes (all sub-objects will be a copy, not the same reference).
 */
CB_GraphicSpritesScene.prototype.getCopy = function(avoidCopyingPointers, avoidCopyingTimes, clearReferences, filterProperties, propertiesToKeepObject)
{
	var spritesGroupsCopy = CB_copyObject(this.spritesGroups);
	
	var newCopy = new CB_GraphicSpritesScene(spritesGroupsCopy, false);

	CB_GraphicSprites._copyNeededProperties(newCopy, this) //Copies the needed properties from the original element.
	CB_GraphicSprites._copyNeededProperties(newCopy.spritesGroups, this.spritesGroups) //Copies the needed properties from the original element.
	
	this.forEach
	(
		function(CB_GraphicSpritesObject, index)
		{
			CB_GraphicSprites._copyNeededProperties(newCopy.get(index), CB_GraphicSpritesObject) //Copies the needed properties from the original element.
			CB_GraphicSprites._copyNeededProperties(newCopy.get(index).spritesGroup, CB_GraphicSpritesObject.spritesGroup) //Copies the needed properties from the original element.
			
			//If desired, sets the same pointers of each CB_GraphicSprites object:
			if (!avoidCopyingPointers) { newCopy.get(index).pointer = this.pointer; newCopy.get(index).pointerPrevious = this.pointerPrevious; }
			if (!avoidCopyingTimes) { newCopy.get(index).time = this.time; }
			newCopy.get(index).time = this.time;
			this.forEach
			(
				function(sprite, spriteIndex)
				{
					if (!avoidCopyingTimes) { newCopy.get(index).get(spriteIndex).time = this.time; }
					
					CB_GraphicSprites._copyNeededProperties(newCopy.get(index).get(spriteIndex), sprite) //Copies the needed properties from the original element.
					
					sprite.forEach
					(
						function(subSprite, subSpriteIndex)
						{
							CB_GraphicSprites._copyNeededProperties(newCopy.get(index).get(spriteIndex).get(subSpriteIndex), subSprite) //Copies the needed properties from the original element.
							
							//If desired, sets the same times:
							if (!avoidCopyingTimes) { sprite.get(subSpriteIndex).time = this.time; }
						}
					);
				}
			);
		}
	);

	//Sets the same parent:
	newCopy.parent = this.parent;

	//If we want to, filters the properties keeping just the desired ones:
	if (filterProperties) { newCopy = CB_GraphicSprites.filterProperties(newCopy, propertiesToKeepObject); }

	//If we want to, clears the references:
	if (clearReferences) { CB_GraphicSprites.clearReferences(newCopy); }

	return newCopy;
}