/**
 * @file Group of graphic sprites management (2D or 3D). Contains the {@link CB_GraphicSprites} class.
 *  @author Joan Alba Maldonado <workindalian@gmail.com>
 *  @license Creative Commons Attribution 4.0 International. See more at {@link https://crossbrowdy.com/about#what_is_the_crossbrowdy_copyright_and_license}.
 */


/**
 * An object with the information that belongs to a sub-sprite (data which belongs to a certain source) used by a graphic sprite.
 * @example
 {
	id: "my_subsprite_1",
	src: "path/to/image.gif",
	srcType: CB_GraphicSprites.SRC_TYPES.IMAGE,
	srcLeft: 10,
	srcTop: 20,
	srcWidth: 64,
	srcHeight: 32,
	left: 10,
	top: 20,
	width: 64,
	height: 32,
	zIndex: 1,
	disabled: false,
	data: { datum_1: "value_1", datum_2: 2, datum_3: [ "a", "b", "c" ] }
 }
 *  @memberof CB_GraphicSprites
 *  @typedef {Object} CB_GraphicSprites.SUBSPRITE_OBJECT
 *  @property {string|*} [id='CB_GraphicSprites.subSprite_' + CB_GraphicSprites._idSubSpriteUnique++] - Identifier of the sub-sprite. It should be unique. It must be a value which evaluates to true. By default, it is generated automatically (with an internal counter).
 *  @property {*} [src=this.parent.src|""] - Source of origin. Can be a path or identifier of an image, text, bitmap, 3D object, etc. They can be used for any kind of source you may think of, including (but not limited to) one sprites sheet or more, one atlas or more, etc. or even a mix of all of them. If not provided, as default it will use the value from the sprite that it belongs to.
 *  @property {string} [srcType=this.parent.srcType|{@link CB_GraphicSprites.SRC_TYPES_DEFAULT}] - Type of the source of origin. If not provided, as default it will use the value from the sprite that it belongs to. It should point to a property of the {@link CB_GraphicSprites.SRC_TYPES} object. You can use other values of the {@link CB_GraphicSprites.SRC_TYPES} object or create new ones.
 *  @property {number} [srcLeft=this.parent.srcLeft|{@link CB_GraphicSprites.LEFT_SOURCE_DEFAULT}] - Left (horizontal) position in the original source (having in mind its real width and height). Unit agnostic (only numeric values are allowed). If not provided, as default it will use the value from the sprite that it belongs to.
 *  @property {number} [srcTop=this.parent.srcTop|{@link CB_GraphicSprites.TOP_SOURCE_DEFAULT}] - Top (vertical) position in the original source (having in mind its real width and height). Unit agnostic (only numeric values are allowed). If not provided, as default it will use the value from the sprite that it belongs to.
 *  @property {number} [srcWidth=this.parent.srcWidth|{@link CB_GraphicSprites.WIDTH_SOURCE_DEFAULT}] - Width of the original source. Unit agnostic (only numeric values are allowed). If not provided, as default it will use the value from the sprite that it belongs to.
 *  @property {number} [srcHeight=this.parent.srcHeight|{@link CB_GraphicSprites.HEIGHT_SOURCE_DEFAULT}] - Height of the original source. Unit agnostic (only numeric values are allowed). If not provided, as default it will use the value from the sprite that it belongs to.
 *  @property {number} [left={@link CB_GraphicSprites.LEFT_DEFAULT}] - Left (horizontal) position in the destiny (inside the sprite). Unit agnostic (only numeric values are allowed).
 *  @property {number} [top={@link CB_GraphicSprites.TOP_DEFAULT}] - Top (vertical) position in the destiny (inside the sprite). Unit agnostic (only numeric values are allowed).
 *  @property {number} [width=this.parent.width|{@link CB_GraphicSprites.WIDTH_DEFAULT}] - Width of the destiny (inside the sprite). Unit agnostic (only numeric values are allowed). If not provided, as default it will use the value from the sprite that it belongs to.
 *  @property {number} [height=this.parent.height|{@link CB_GraphicSprites.HEIGHT_DEFAULT}] - Height of the destiny (inside the sprite). Unit agnostic (only numeric values are allowed). If not provided, as default it will use the value from the sprite that it belongs to.
 *  @property {number} [zIndex=this.parent.zIndex|{@link CB_GraphicSprites.ZINDEX_DEFAULT}] - The z-index for the destiny (inside the sprite). Only numeric values which are not zero (0) are allowed. If not provided, as default it will use the value from the sprite that it belongs to. To change the value of this property, use the "setZIndex" method of the sub-sprite or the {@link CB_GraphicSprites#setZIndexSubSprite} method (which will call the {@link CB_GraphicSpritesScene#updateSubSpritesByZIndex} method internally).
 *  @property {boolean} [disabled=this.parent.disabled|false] - Tells whether this sub-sprite is disabled or not. Regardless its value, it will be considered disabled if its sprite parent is also disabled. If not provided, as default it will use the value from the sprite that it belongs to.
 *  @property {object} [data=CB_combineJSON(this.parent.data, this.data)||this.parent.data||{ 'that' : CB_GraphicSprites.SPRITES_OBJECT, 'getThis' = function() { return this.that; } }] - Object with any additional data desired which can be any kind. If not provided, missing properties as default will use the value from the sprite that it belongs to. It will always have a "that" property pointing to the {@link CB_GraphicSprites.SUBSPRITE_OBJECT} object where it belongs to and a function in its "getThis" property returning the same value (added automatically). These properties ("that" and "getThis") cannot be overridden.
 *  @property {boolean} [byReference=false] - If set to true, when inserting the sub-sprite, the same sub-sprite itself ({@link CB_GraphicSprites.SUBSPRITE_OBJECT} object) will be inserted internally directly without making a copy of itself.
 *  @property {CB_GraphicSprites.SPRITE_OBJECT} parent - Read-only property pointing to its parent ({@link CB_GraphicSprites.SPRITE_OBJECT} object).
 *  @property {CB_GraphicSprites} container - Read-only property pointing to the {@link CB_GraphicSprites} object which contains it.
 *  @property {boolean} isSubSprite - Read-only property which is always set to true to help identify this type of object.
 *  @property {'subSprite'} type - Read-only property indicating the type of object (always "subSprite").
 *  @property {integer} position - Read-only property indicating the position of this sub-sprite in the array which is set the "subSprites" property of the sprite parent ({@link CB_GraphicSprites.SPRITE_OBJECT} object).
 *  @property {integer} positionByZIndex - Read-only property indicating the position of this sub-sprite in the array which is set the "subSpritesByZIndex" property of the sprite parent ({@link CB_GraphicSprites.SPRITE_OBJECT} object).
 *  @property {integer} time - Property which stores the time in milliseconds when its parent sprite was started being pointed for the last time (time elapsed since the [time origin]{@link https://developer.mozilla.org/en-US/docs/Web/API/DOMHighResTimeStamp#The_time_origin} which was obtained calling the {@link CB_Device.getTiming} function internally). Note that the parent could being not pointed anymore. If it has never being pointed before, it will be set to 0. It normally has the same value as the "time" property of its parent object but they can be modified independently.
 *  @property {function} setTime - Read-only property which is a method that updates the "time" property of the sub-sprite (calls {@link CB_GraphicSprites#setTime} internally and returns its returning value). With only one parameter which belongs to the "time" parameter of the {@link CB_GraphicSprites#setTime} method.
 *  @property {function} getTime - Read-only property which is a method that returns the "time" property of the sub-sprite (calls {@link CB_GraphicSprites#getTime} internally and returns its returning value). With only one parameter which belongs to the "returnValueOnFail" parameter of the {@link CB_GraphicSprites#getTime} method. If the "time" property of the sub-sprite is not found, it will use the "time" property from its sprite parent.
 *  @property {function} getTimeElapsed - Read-only property which is a method that returns how many milliseconds elapsed since the sprite was or will be pointed (checking its "time" property), comparing with the time given in milliseconds (time elapsed since the [time origin]{@link https://developer.mozilla.org/en-US/docs/Web/API/DOMHighResTimeStamp#The_time_origin} which can be obtained calling the {@link CB_Device.getTiming} function) or with the current one if none is given (calls {@link CB_GraphicSprites#getTimeElapsed} internally and returns its returning value). With only one parameter which belongs to the "timeToCompare" parameter of the {@link CB_GraphicSprites#getTimeElapsed} method. If the "time" property of the sub-sprite is not found, it will use the "time" property from its sprite parent.
 *  @property {function} getZIndex - Read-only property which is a method that returns the z-index ("z-index" property) of the sub-sprite (calls {@link CB_GraphicSprites#getZIndexSubSprite} internally and returns its returning value). With only one parameter which belongs to the "returnValueOnFail" parameter of the {@link CB_GraphicSprites#getZIndexSubSprite} method.
 *  @property {function} setZIndex - Read-only property which is a method to set the z-index ("z-index" property) of the sub-sprite (calls {@link CB_GraphicSprites#setZIndexSubSprite} internally and returns its returning value). With only one parameter which belongs to the "zIndex" parameter of the {@link CB_GraphicSprites#setZIndexSubSprite} method.
 *  @property {function} isDisabled - Read-only property which is a method that tells whether the sub-sprite is disabled or not (calls {@link CB_GraphicSprites#isDisabledSubSprite} internally and returns its returning value). With no parameters. A sub-sprite is considered disabled if its sprite parent is disabled (a sprite is considered disabled if its sprites group parent is also disabled).
 *  @property {function} setDisabled - Read-only property which is a method to disable or enable the sub-sprite (calls {@link CB_GraphicSprites#setDisabledSubSprite} internally and returns its returning value). With three parameters ("disabled", "affectParents" and "affectParentsChildren") which belong to the parameters with the same name of the {@link CB_GraphicSprites#setDisabledSubSprite} method.
  */


/**
 * An object with the information that belongs to a certain graphic sprite, being able to contain more than one source used by this graphic sprite (inside sub-sprites).
 * @example
 {
	//'my_sprite_1':
	id: "my_sprite_1",
	src: "path/to/image.gif",
	srcType: CB_GraphicSprites.SRC_TYPES.IMAGE,
	srcLeft: 10,
	srcTop: 20,
	srcWidth: 64,
	srcHeight: 32,
	left: 10,
	top: 20,
	width: 64,
	height: 32,
	disabled: false,
	data: { datum_1 : "value_1", datum_2 : 2, datum_3: [ "a", "b", "c" ] },
	subSprites:
	[
		//'my_subsprite_1':
		{ id: "my_subsprite_1", srcLeft: 10, srcTop: 20, zIndex: 1 },
		//'my_subsprite_2':
		{ id: "my_subsprite_2", srcLeft: 20, srcTop: 40, zIndex: 2 }
	]
 }
 *  @memberof CB_GraphicSprites
 *  @typedef {Object} CB_GraphicSprites.SPRITE_OBJECT
 *  @property {string|*} [id='CB_GraphicSprites.sprite_' + CB_GraphicSprites._idSpriteUnique++] - Identifier of the sprite. It should be unique. Recommended. It must be a value which evaluates to true. By default, it is generated automatically (with an internal counter).
 *  @property {*} [src=this.parent.src|""] - Source of origin. Can be a path or identifier of an image, text, bitmap, 3D object, etc. They can be used for any kind of source you may think of, including (but not limited to) one sprites sheet or more, one atlas or more, etc. or even a mix of all of them. If not provided, as default it will use the value from the sprites group that it belongs to.
 *  @property {string} [srcType=this.parent.srcType|{@link CB_GraphicSprites.SRC_TYPES_DEFAULT}] - Type of the source of origin. If not provided, as default it will use the value from the sprites group that it belongs to. It should point to a property of the {@link CB_GraphicSprites.SRC_TYPES} object. You can use other values of the {@link CB_GraphicSprites.SRC_TYPES} object or create new ones.
 *  @property {number} [srcLeft=this.parent.srcLeft|{@link CB_GraphicSprites.LEFT_SOURCE_DEFAULT}] - Left (horizontal) position in the original source (having in mind its real width and height). Unit agnostic (only numeric values are allowed). If not provided, as default it will use the value from the sprites group that it belongs to.
 *  @property {number} [srcTop=this.parent.srcTop|{@link CB_GraphicSprites.TOP_SOURCE_DEFAULT}] - Top (vertical) position in the original source (having in mind its real width and height). Unit agnostic (only numeric values are allowed). If not provided, as default it will use the value from the sprites group that it belongs to.
 *  @property {number} [srcWidth=this.parent.srcWidth|{@link CB_GraphicSprites.WIDTH_SOURCE_DEFAULT}] - Width of the original source. Unit agnostic (only numeric values are allowed). If not provided, as default it will use the value from the sprites group that it belongs to.
 *  @property {number} [srcHeight=this.parent.srcHeight|{@link CB_GraphicSprites.HEIGHT_SOURCE_DEFAULT}] - Height of the original source. Unit agnostic (only numeric values are allowed). If not provided, as default it will use the value from the sprites group that it belongs to.
 *  @property {number} [left={@link CB_GraphicSprites.LEFT_DEFAULT}] - Left (horizontal) position in the destiny (inside the sprites group). Unit agnostic (only numeric values are allowed).
 *  @property {number} [top={@link CB_GraphicSprites.TOP_DEFAULT}] - Top (vertical) position in the destiny (inside the sprites group). Unit agnostic (only numeric values are allowed).
 *  @property {number} [width=this.parent.width|{@link CB_GraphicSprites.WIDTH_DEFAULT}] - Width of the destiny (inside the sprites group). Unit agnostic (only numeric values are allowed). If not provided, as default it will use the value from the sprites group that it belongs to.
 *  @property {number} [height=this.parent.height|{@link CB_GraphicSprites.HEIGHT_DEFAULT}] - Height of the destiny (inside the sprites group). Unit agnostic (only numeric values are allowed). If not provided, as default it will use the value from the sprites group that it belongs to.
 *  @property {number} [zIndex=this.parent.zIndex|{@link CB_GraphicSprites.ZINDEX_DEFAULT}] - The z-index for the destiny (inside the sprites group). Only numeric values which are not zero (0) are allowed. If not provided, as default it will use the value from the sprites group that it belongs to. To change the value of this property, use the "setZIndex" method of the sprite or the {@link CB_GraphicSprites#setZIndexSprite} method (which will call the {@link CB_GraphicSpritesScene#updateSpritesByZIndex} method internally).
 *  @property {boolean} [disabled=this.parent.disabled|false] - Tells whether this sprite is disabled or not. Regardless its value, it will be considered disabled if its sprites group parent is also disabled. If not provided, as default it will use the value from the sprites group that it belongs to.
 *  @property {object} [data=CB_combineJSON(this.parent.data, this.data)||this.parent.data||{ 'that' : CB_GraphicSprites.SPRITES_OBJECT, 'getThis' = function() { return this.that; } }] - Object with any additional data desired which can be any kind. If not provided, missing properties as default will use the value from the sprites group that it belongs to. It will always have a "that" property pointing to the {@link CB_GraphicSprites.SPRITE_OBJECT} object where it belongs to and a function in its "getThis" property returning the same value (added automatically). These properties ("that" and "getThis") cannot be overridden.
 *  @property {array} [subSprites=[]] - Numeric array containing {@link CB_GraphicSprites.SUBSPRITE_OBJECT} objects with the sub-sprites that this sprite uses.
 *  @property {array} subSpritesByZIndex - Read-only property containing a numeric array of all the {@link CB_GraphicSprites.SUBSPRITE_OBJECT} objects of the sprite ordered by their z-index ("zIndex" property). It is updated automatically when the z-index of a sub-sprite is set with its "setZIndex" method (or when calling the {@link CB_GraphicSprites#setZIndexSubSprite} method) or when inserting/removing sub-sprites through the {@link CB_GraphicSprites#insertSubSprites}, {@link CB_GraphicSprites#insertSubSprite}, {@link CB_GraphicSprites#removeSubSprite} or {@link CB_GraphicSprites#removeSubSpriteById} methods.
 *  @property {boolean} [byReference=false] - If set to true, when inserting the sprite, its "subSprites" property will use exactly the object given for that property (without making a copy) and the same sprite itself ({@link CB_GraphicSprites.SPRITE_OBJECT} object) will be inserted internally directly without making a copy of itself.
 *  @property {CB_GraphicSprites.SPRITES_OBJECT} parent - Read-only property pointing to its parent ({@link CB_GraphicSprites.SPRITES_OBJECT} object).
 *  @property {CB_GraphicSprites} container - Read-only property pointing to the {@link CB_GraphicSprites} object which contains it.
 *  @property {boolean} isSprite - Read-only property which is always set to true to help identify this type of object.
 *  @property {'sprite'} type - Read-only property indicating the type of object (always "sprite").
 *  @property {integer} position - Read-only property indicating the position of this sprite in the array which is set the "sprites" property of the sprites group parent ({@link CB_GraphicSprites.SPRITES_OBJECT} object).
 *  @property {integer} positionByZIndex - Read-only property indicating the position of this sprite in the array which is set the "spritesByZIndex" property of the sprites group parent ({@link CB_GraphicSprites.SPRITES_OBJECT} object).
 *  @property {integer} time - Property which stores the time in milliseconds when the sprite was started being pointed for the last time (time elapsed since the [time origin]{@link https://developer.mozilla.org/en-US/docs/Web/API/DOMHighResTimeStamp#The_time_origin} which was obtained calling the {@link CB_Device.getTiming} function internally). Note that it could being not pointed anymore. If it has never being pointed before, it will be set to 0.
 *  @property {function} setTime - Read-only property which is a method that updates the "time" property of the sprite (calls {@link CB_GraphicSprites#setTime} internally and returns its returning value). With only one parameter which belongs to the "time" parameter of the {@link CB_GraphicSprites#setTime} method.
 *  @property {function} getTime - Read-only property which is a method that returns the "time" property of the sprite (calls {@link CB_GraphicSprites#getTime} internally and returns its returning value). With only one parameter which belongs to the "returnValueOnFail" parameter of the {@link CB_GraphicSprites#getTime} method.
 *  @property {function} getTimeElapsed - Read-only property which is a method that returns how many milliseconds elapsed since the sprite was or will be pointed (checking its "time" property), comparing with the time given in milliseconds (time elapsed since the [time origin]{@link https://developer.mozilla.org/en-US/docs/Web/API/DOMHighResTimeStamp#The_time_origin} which can be obtained calling the {@link CB_Device.getTiming} function) or with the current one if none is given (calls {@link CB_GraphicSprites#getTimeElapsed} internally and returns its returning value). With only one parameter which belongs to the "timeToCompare" parameter of the {@link CB_GraphicSprites#getTimeElapsed} method.
 *  @property {function} removeAll - Read-only property which is a method that removes all the internal sub-sprites ({@link CB_GraphicSprites.SUBSPRITE_OBJECT} objects) from the sprite which are in the "subSprites" property (calls {@link CB_GraphicSprites#removeSubSprites} internally and returns its returning value). With no parameters.
 *  @property {function} removeSubSprites - Alias for the "removeAll" method.
 *  @property {function} insertSubSprites - Read-only property which is a method that inserts the given sub-sprites ({@link CB_GraphicSprites.SUBSPRITE_OBJECT} objects) in the sprite, adding them to the "subSprites" property (calls {@link CB_GraphicSprites#insertSubSprites} internally and returns its returning value). With only one parameter which belongs to the "subSprites" parameter of the {@link CB_GraphicSprites#insertSubSprites} method.
 *  @property {function} remove - Read-only property which is a method that removes an internal sub-sprite ({@link CB_GraphicSprites.SUBSPRITE_OBJECT} object) by its index (position in the "subSprites" array) from the sprite, removing it from the "subSprites" property (calls {@link CB_GraphicSprites#removeSubSprite} internally and returns its returning value). With only one parameter which belongs to the "index" parameter of the {@link CB_GraphicSprites#removeSubSprite} method.
 *  @property {function} removeById - Read-only property which is a method that removes an internal sub-sprite ({@link CB_GraphicSprites.SUBSPRITE_OBJECT} object) by its identifier from the sprite, removing it from the "subSprites" property (calls {@link CB_GraphicSprites#removeSubSpriteById} internally and returns its returning value). With only one parameter which belongs to the "id" parameter of the {@link CB_GraphicSprites#removeSubSpriteById} method.
 *  @property {function} insertSubSprite - Read-only property which is a method that inserts a given sub-sprite ({@link CB_GraphicSprites.SUBSPRITE_OBJECT} object) in the sprite, adding it to the "subSprites" property (calls {@link CB_GraphicSprites#insertSubSprite} internally and returns its returning value). With only one parameter which belongs to the "subSprite" parameter of the {@link CB_GraphicSprites#insertSubSprite} method.
 *  @property {function} insert - Alias for the "insertSubSprite" method.
 *  @property {function} getAll - Read-only property which is a method that returns all the internal sub-sprites ({@link CB_GraphicSprites.SUBSPRITE_OBJECT} objects) in the sprite, getting them from the "subSprites" property (calls {@link CB_GraphicSprites#getAll} internally and returns its returning value). With two parameters ("orderedByZIndex" and "returnValueOnFail") which belong to the parameters with the same name of the {@link CB_GraphicSprites#getAll} method.
 *  @property {function} getSubSprites - Alias for the "getAll" method.
 *  @property {function} get - Read-only property which is a method that returns a sub-sprite ({@link CB_GraphicSprites.SUBSPRITE_OBJECT} object) by its index (position in the "subSprites" array) from the sprite, getting it from the "subSprites" property (calls {@link CB_GraphicSprites#getSubSprite} internally and returns its returning value). With two parameters ("index" and "returnValueOnFail") which belong to the parameters with the same name of the {@link CB_GraphicSprites#getSubSprite} method.
 *  @property {function} getById - Read-only property which is a method that returns a sub-sprite ({@link CB_GraphicSprites.SUBSPRITE_OBJECT} object) by its identifier from the sprite, getting it from the "subSprites" property (calls {@link CB_GraphicSprites#getSubSpriteById} internally and returns its returning value). With two parameters ("id" and "returnValueOnFail") which belong to the parameters with the same name of the {@link CB_GraphicSprites#getSubSpriteById} method.
 *  @property {function} getIndexById - Read-only property which is a method that returns the index (position in the "subSprites" array) of a sub-sprite ({@link CB_GraphicSprites.SUBSPRITE_OBJECT} object) by its identifier (calls {@link CB_GraphicSprites#getSubSpriteIndexById} internally and returns its returning value). With only one parameter which belongs to the "id" parameter of the {@link CB_GraphicSprites#getSubSpriteIndexById} method.
 *  @property {function} executeFunctionAll - Read-only property which is a method that executes the desired function for each sub-sprite ({@link CB_GraphicSprites.SUBSPRITE_OBJECT} objects which are in the "subSprites" property) in the sprite (calls {@link CB_GraphicSprites#executeFunctionAllSubSprites} internally and returns its returning value). With five parameters ("functionEach", "orderedByZIndex", "delayBetweenEach", "returnSetTimeoutsArray", "delayBetweenEachAffectsFirst" and "functionFinish") which belong to the parameters with the same name of the {@link CB_GraphicSprites#executeFunctionAllSubSprites} method.
 *  @property {function} executeAll - Alias for the "executeFunctionAll" method.
 *  @property {function} forEach - Alias for the "executeFunctionAll" method.
 *  @property {function} getZIndex - Read-only property which is a method that returns the z-index ("z-index" property) of the sprite (calls {@link CB_GraphicSprites#getZIndexSprite} internally and returns its returning value). With only one parameter which belongs to the "returnValueOnFail" parameter of the {@link CB_GraphicSprites#getZIndexSprite} method.
 *  @property {function} setZIndex - Read-only property which is a method to set the z-index ("z-index" property) of the sprite (calls {@link CB_GraphicSprites#setZIndexSprite} internally and returns its returning value). With only one parameter which belongs to the "zIndex" parameter of the {@link CB_GraphicSprites#setZIndexSprite} method.
 *  @property {function} isDisabled - Read-only property which is a method that tells whether the sprite is disabled or not (calls {@link CB_GraphicSprites#isDisabledSprite} internally and returns its returning value). With no parameters. A sprite is considered disabled if its sprites group parent is also disabled.
 *  @property {function} setDisabled - Read-only property which is a method to disable or enable the sprite (calls {@link CB_GraphicSprites#setDisabledSprite} internally and returns its returning value). With four parameters ("disabled", "affectSubSprites", "affectParent" and "affectParentChildren") which belong to the parameters with the same name of the {@link CB_GraphicSprites#setDisabledSprite} method.
 *  @property {function} getPointer - Read-only property which is a method that gets the current position of the pointer. It belongs to an index of the {@link CB_GraphicSprites#spritesGroup.sprites} array where a {@link CB_GraphicSprites.SPRITE_OBJECT} object is placed (containing a sprite). Internally, it uses the {@link CB_GraphicSprites#pointer} property. Calls {@link CB_GraphicSprites#getPointer} internally and returns its returning value. With no parameters.
 *  @property {function} getCurrentPosition - Alias for the "getPointer" method.
 *  @property {function} getPointerPrevious - Read-only property which is a method that gets the previous position of the pointer. Internally, it uses the {@link CB_GraphicSprites#pointerPrevious} property. Calls {@link CB_GraphicSprites#getPointerPrevious} internally and returns its returning value. With no parameters.
 *  @property {function} getPreviousPosition - Alias for the "getPointerPrevious" method.
 *  @property {function} setPointer - Read-only property which is a method that sets the pointer to the desired position (if possible). The position should belong to an index of the {@link CB_GraphicSprites#spritesGroup.sprites} array where a {@link CB_GraphicSprites.SPRITE_OBJECT} object is placed (containing a sprite). Internally, it modifies the {@link CB_GraphicSprites#pointer} property (if possible). If the position was updated, it will also reset the {@link CB_GraphicSprites#time} property (setting the current time in milliseconds). Calls {@link CB_GraphicSprites#setPointer} internally and returns the sprite (a {@link CB_GraphicSprites.SPRITE_OBJECT} object) which is being currently pointed (by the pointer set in the {@link CB_GraphicSprites#pointer} property). With two parameters ("position" and "loop") which belong to the parameters with the same name of the {@link CB_GraphicSprites#setPointer} method.
 *  @property {function} setCurrentPosition - Alias for the "setPointer" method.
 *  @property {function} getCurrent - Read-only property which is a method that gets the sprite (a {@link CB_GraphicSprites.SPRITE_OBJECT} object) which is being currently pointed (by the pointer set in the {@link CB_GraphicSprites#pointer} property). Calls {@link CB_GraphicSprites#getCurrent} internally and returns its returning value. With no parameters.
 *  @property {function} current - Alias for the "getCurrent" method.
 *  @property {function} now - Alias for the "getCurrent" method.
 *  @property {function} getPrevious - Read-only property which is a method that gets the sprite which was previously pointed if any or returns null otherwise. It does not modify the {@link CB_GraphicSprites#pointer} property. Calls {@link CB_GraphicSprites#getPrevious} internally and returns its returning value. With no parameters.
 *  @property {function} setPrevious - Read-only property which is a method that makes the pointer to go back to the previous position (if possible) and returns the sprite located there (if any). The position should belong to an index of the {@link CB_GraphicSprites#spritesGroup.sprites} array where a {@link CB_GraphicSprites.SPRITE_OBJECT} object is placed (containing a sprite) and it will be returned if found. Internally, it modifies the {@link CB_GraphicSprites#pointer} property (if possible). If the position was updated, it will update also the {@link CB_GraphicSprites#time} property (setting the current time in milliseconds). Calls {@link CB_GraphicSprites#setPrevious} internally and returns its returning value. With only one parameter which belongs to the "loop" parameter of the {@link CB_GraphicSprites#setPrevious} method.
 *  @property {function} previous - Alias for the "setPrevious" method.
 *  @property {function} setNext - Read-only property which is a method that makes the pointer to advance to the next position (if possible) and returns the sprite located there (if any). The position should belong to an index of the {@link CB_GraphicSprites#spritesGroup.sprites} array where a {@link CB_GraphicSprites.SPRITE_OBJECT} object is placed (containing a sprite) and it will be returned if found. Internally, it modifies the {@link CB_GraphicSprites#pointer} property (if possible). If the position was updated, it will also update the {@link CB_GraphicSprites#time} property (setting the current time in milliseconds). Calls {@link CB_GraphicSprites#setNext} internally and returns its returning value. With only one parameter which belongs to the "loop" parameter of the {@link CB_GraphicSprites#setNext} method.
 *  @property {function} next - Alias for the "setNext" method.
 *  @property {function} setPropertyCascade - Read-only property which is a method that sets the desired value of a given property name to the sprite itself and all of its sub-sprites (if any). Calls {@link CB_GraphicSprites#setPropertyCascade} internally and returns its returning value. With two parameters ("propertyName" and "value") which belong to the parameters with the same name of the {@link CB_GraphicSprites#setPropertyCascade} method.
 */

 
/**
 * An object with the information that belongs to a group of graphic sprites.
 * @example
 {
	//'my_sprites_1':
	id: "my_sprites_1",
	src: "path/to/image.gif",
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
 } 
 *  @memberof CB_GraphicSprites
 *  @typedef {Object} CB_GraphicSprites.SPRITES_OBJECT
 *  @property {string|*} [id='CB_GraphicSprites_' + CB_GraphicSprites._idUnique++] - Identifier of the group of graphic sprites (also used as the {@link CB_GraphicSprites.id} property for the {@link CB_GraphicSprites} object). It should be unique. Recommended. It must be a value which evaluates to true. By default, it is generated automatically (with an internal counter).
 *  @property {*} [src=""] - Source of origin. Can be a path or identifier of an image, text, bitmap, 3D object, etc. They can be used for any kind of source you may think of, including (but not limited to) one sprites sheet or more, one atlas or more, etc. or even a mix of all of them.
 *  @property {string} [srcType={@link CB_GraphicSprites.SRC_TYPES_DEFAULT}] - Type of the source of origin. It should point to a property of the {@link CB_GraphicSprites.SRC_TYPES} object. You can use other values of the {@link CB_GraphicSprites.SRC_TYPES} object or create new ones.
 *  @property {number} [srcLeft={@link CB_GraphicSprites.LEFT_SOURCE_DEFAULT}] - Left (horizontal) position in the original source (having in mind its real width and height). Unit agnostic (only numeric values are allowed). If not provided, as default it will use the value from {@link CB_GraphicSprites.LEFT_SOURCE_DEFAULT}.
 *  @property {number} [srcTop={@link CB_GraphicSprites.TOP_SOURCE_DEFAULT}] - Top (vertical) position in the original source (having in mind its real width and height). Unit agnostic (only numeric values are allowed). If not provided, as default it will use the value from {@link CB_GraphicSprites.TOP_SOURCE_DEFAULT}.
 *  @property {number} [srcWidth={@link CB_GraphicSprites.WIDTH_SOURCE_DEFAULT}] - Width of the original source. Unit agnostic (only numeric values are allowed). If not provided, as default it will use the value from {@link CB_GraphicSprites.WIDTH_SOURCE_DEFAULT}.
 *  @property {number} [srcHeight={@link CB_GraphicSprites.HEIGHT_SOURCE_DEFAULT}] - Height of the original source. Unit agnostic (only numeric values are allowed). If not provided, as default it will use the value from {@link CB_GraphicSprites.HEIGHT_SOURCE_DEFAULT}.
 *  @property {number} [left={@link CB_GraphicSprites.LEFT_DEFAULT}] - Left (horizontal) position in the destiny. Unit agnostic (only numeric values are allowed). If not provided, as default it will use the value from {@link CB_GraphicSprites.LEFT_DEFAULT}.
 *  @property {number} [top={@link CB_GraphicSprites.TOP_DEFAULT}] - Top (vertical) position in the destiny. Unit agnostic (only numeric values are allowed). If not provided, as default it will use the value from {@link CB_GraphicSprites.TOP_DEFAULT}.
 *  @property {number} [width={@link CB_GraphicSprites.WIDTH_DEFAULT}] - Width of the destiny. Unit agnostic (only numeric values are allowed). If not provided, as default it will use the value from {@link CB_GraphicSprites.WIDTH_DEFAULT}.
 *  @property {number} [height={@link CB_GraphicSprites.HEIGHT_DEFAULT}] - Height of the destiny. Unit agnostic (only numeric values are allowed). If not provided, as default it will use the value from {@link CB_GraphicSprites.HEIGHT_DEFAULT}.
 *  @property {number} [zIndex={@link CB_GraphicSprites.ZINDEX_DEFAULT}] - The z-index for the destiny (only numeric values which are not zero (0) are allowed). Also used as the {@link CB_GraphicSprites.zIndex} property for the {@link CB_GraphicSprites} object. If not provided, as default it will use the value from {@link CB_GraphicSprites.ZINDEX_DEFAULT}. To change the value of this property, use the {@link CB_GraphicSprites#setZIndex} method (which will call the {@link CB_GraphicSpritesScene#updateGraphicSpritesByZIndex} method internally if there is a {@link CB_GraphicSpritesScene} parent object).
 *  @property {boolean} [disabled=false] - Tells whether this sprites group (and the {@link CB_GraphicSprites} object itself) is disabled or not. If not provided, as default it will be false (which means it is enabled).
 *  @property {object} [data={ 'that' : CB_GraphicSprites.SPRITES_OBJECT, 'getThis' = function() { return this.that; } }] - Object with any additional data desired which can be any kind. It will always have a "that" property pointing to the {@link CB_GraphicSprites.SPRITES_OBJECT} object where it belongs to and a function in its "getThis" property returning the same value (added automatically). These properties ("that" and "getThis") cannot be overridden.
 *  @property {array} [sprites=[]] - Numeric array containing {@link CB_GraphicSprites.SPRITE_OBJECT} objects with all the sprites that will be used. Recommended at least to provide one {@link CB_GraphicSprites.SPRITE_OBJECT} object in the first index.
 *  @property {array} spritesByZIndex - Read-only property containing a numeric array of all the {@link CB_GraphicSprites.SPRITE_OBJECT} objects ordered by their z-index ("zIndex" property). It is updated automatically when the z-index of a sprite is set with its "setZIndex" method (or when calling the {@link CB_GraphicSprites#setZIndexSprite} method) or when inserting/removing sprites through the {@link CB_GraphicSprites#insertSprites}, {@link CB_GraphicSprites#insertSprite}, {@link CB_GraphicSprites#removeSprite} or {@link CB_GraphicSprites#removeSpriteById} methods.
 *  @property {boolean} [byReference_DEFAULT=false] - Default value to use as the "byReference" parameter for the constructor and for the {@link CB_GraphicSprites#insertSprites} method. If a boolean value is not provided, it will be parsed to boolean (resulting undefined to be false).
 *  @property {*} [parent=undefined|{@link CB_GraphicSpritesScene}] - Property pointing to or containing its parent (also used as the {@link CB_GraphicSprites.parent} property for the {@link CB_GraphicSprites} object). It could be a {@link CB_GraphicSpritesScene} object.
 *  @property {CB_GraphicSprites} container - Read-only property pointing to the {@link CB_GraphicSprites} object which contains it.
 *  @property {boolean} isSpritesGroup - Read-only property which is always set to true to help identify this type of object.
 *  @property {'spritesGroup'} type - Read-only property indicating the type of object (always "spritesGroup"). 
 *  @property {integer} [position=undefined] - Read-only property indicating the position of this {@link CB_GraphicSprites} object in the array which is set the "items" property inside the {@link CB_GraphicSpritesScene#spritesGroups} object which is in the {@link CB_GraphicSpritesScene} object parent (if any).
 *  @property {integer} [positionByZIndex=undefined] - Read-only property indicating the position of this {@link CB_GraphicSprites} object in the array which is set the "itemsByZIndex" property inside the {@link CB_GraphicSpritesScene#spritesGroups} object which is in the {@link CB_GraphicSpritesScene} object parent (if any).
 */


/**
 * Class to manage a group of graphic sprites (2D or 3D).
 *  @class
 *  @classdesc Class to manage a group of graphic sprites (2D or 3D).
 *  @param {CB_GraphicSprites.SPRITES_OBJECT} [spritesGroup] - Object with the desired sprites. The information will be used for the {@link CB_GraphicSprites#spritesGroup} property. Used as the "spritesGroup" parameter when calling the {@link CB_GraphicSprites#insertSprites} method internally.
 *  @param {boolean} [byReference=!!{@link CB_GraphicSprites.SPRITES_OBJECT.byReference_DEFAULT}] - This value will be used as the default value when the "byReference" property is not given in the sprites ({@link CB_GraphicSprites.SPRITE_OBJECT} objects) or sub-sprites ({@link CB_GraphicSprites.SUBSPRITE_OBJECT} objects). The value will be stored in the {@link CB_GraphicSprites#byReference_DEFAULT} property. If a boolean value is not provided, it will use the value of the {@link CB_GraphicSprites.SPRITES_OBJECT.byReference_DEFAULT} property of the given {@link CB_GraphicSprites.SPRITES_OBJECT} object (parsed to boolean).
 *  @returns {CB_GraphicSprites} Returns a new {@link CB_GraphicSprites} object.
 *  @todo Think about a "createCopy" parameter on different the insert methods (to insert sprites groups/graphic sprites objects, etc.) so it will make a copy of the object to avoid using/modifying the original one. If the "createCopy" is set to false, it should always use the object as reference (using/modifying it).
 *  @todo Think about a method to remove a sprite when the same sprite is received by parameter. The same with sub-sprites, receiving the sub-sprite by parameter. The same to remove the sprites group object, receiving a sprites group object by parameter. Only remove them if they match exactly.
 */
var CB_GraphicSprites = function(spritesGroup, byReference)
{
	//Creates an instance of this object and returns it in the case that it is being called from an unexpected context:
	if (this === window || !(this instanceof CB_GraphicSprites)) { return new CB_GraphicSprites(spritesGroup, byReference); }
	
	//Properties and variables:
	/**
     * Identifier of the sprites group object (the "id" property of the {@link CB_GraphicSprites.SPRITES_OBJECT} stored in the {@link CB_GraphicSprites#spritesGroup} property) and the {@link CB_GraphicSprites} object itself (same one). It should be unique. It must be a value which evaluates to true. By default, it is generated automatically (with an internal counter).
	 *	@var
	 *  @readonly
	 *  @type {string|*}
	 *  @default 'CB_GraphicSprites_' + CB_GraphicSprites._idUnique++
	 */
	this.id = "";

	/**
     * Property pointing to or containing its parent. It could be a {@link CB_GraphicSpritesScene} object. It is the same as the "parent" property of the {@link CB_GraphicSprites.SPRITES_OBJECT} stored in the {@link CB_GraphicSprites#spritesGroup} property.
	 *	@var
	 *  @readonly
	 *  @type {*}
	 *  @default
	 */
	this.parent = undefined;

	/**
     * Z-index of the sprites group object (the "zIndex" property of the {@link CB_GraphicSprites.SPRITES_OBJECT} stored in the {@link CB_GraphicSprites#spritesGroup} property) and the {@link CB_GraphicSprites} object itself (same one). To change the value of this property, use the {@link CB_GraphicSprites#setZIndex} method (which will call the {@link CB_GraphicSpritesScene#updateGraphicSpritesByZIndex} method internally if there is a {@link CB_GraphicSpritesScene} parent object). Only numeric values which are not zero (0) are allowed.
	 *	@var
	 *  @readonly
	 *  @type {number}
	 *  @default CB_GraphicSprites.ZINDEX_DEFAULT
	 */
	this.zIndex = CB_GraphicSprites.ZINDEX_DEFAULT;
	
	/**
     * Object with information about the sprites.
	 *	@var
	 *  @readonly
	 *  @type {CB_GraphicSprites.SPRITES_OBJECT}
	 *  @default
	 */
	this.spritesGroup = {};

	/**
     * Pointer with the position of the current sprite (belongs to an index of the {@link CB_GraphicSprites#spritesGroup.sprites} array).
	 *	@var
	 *  @readonly
	 *  @type {integer}
	 *  @default
	 */
	this.pointer = -1;


	/**
     * Keeps the previous value of the {@link CB_GraphicSprites#pointer} property (if any).
	 *	@var
	 *  @readonly
	 *  @type {integer}
	 *  @default
	 */
	this.pointerPrevious = -1;


	/**
     * Stores the time in milliseconds when the current sprite was started being pointed (time elapsed since the [time origin]{@link https://developer.mozilla.org/en-US/docs/Web/API/DOMHighResTimeStamp#The_time_origin} which will be obtained calling the {@link CB_Device.getTiming} function internally).
	 *	@var
	 *  @readonly
	 *  @type {integer}
	 *  @default
	 */
	this.time = 0;


	/**
     * This value will be used as the default value when the "byReference" property is not given in the sprites ({@link CB_GraphicSprites.SPRITE_OBJECT} objects) or sub-sprites ({@link CB_GraphicSprites.SUBSPRITE_OBJECT} objects).
	 *	@var
	 *  @type {boolean}
	 *  @default
	 */
	this.byReference_DEFAULT = false;


	//Calls the constructor of the object when creates an instance:
	return this._init(spritesGroup, byReference);
}


//Constants:
/**
 * Property which is always set to true to help identify this type of object.
 *	@constant
 *  @type {boolean}
 *  @default
 */
CB_GraphicSprites.prototype.isSprites = true;


/**
 * Indicates the type of object (always "sprites").
 *	@constant
 *  @type {string}
 *  @default
 */
CB_GraphicSprites.prototype.type = "sprites";


/**
 * Object with some "srcType". Each property of this object belong to one source type, having an integer as value which represents it. You can define more source types here.
 *	@constant
 *  @type {object}
 *  @default
 */
CB_GraphicSprites.SRC_TYPES =
{
	DEFAULT: 0,
	IMAGE: 0,
	TEXT: 1,
	SEGMENT: 2,
	PIXEL: 3,
	RECTANGLE: 4,
	CIRCLE: 5,
	ARC: 6,
	ELLIPSE: 7,
	TRIANGLE: 8,
	BEZIER_CURVE: 9,
	QUADRATIC_BEZIER_CURVE: 10,
	BITMAP: 11,
	MAP: 12
}
/**
 * Alias for {@link CB_GraphicSprites.SRC_TYPES_DEFAULT}.
 *  @constant CB_GraphicSprites.SRC_TYPES.DEFAULT
 *  @see {@link CB_GraphicSprites.SRC_TYPES_DEFAULT}
 */
/**
 * Default "srcType", the type of the original source.
 *	@constant
 *  @type {integer}
 *  @default {@link CB_GraphicSprites.SRC_TYPES.IMAGE}
 */
CB_GraphicSprites.SRC_TYPES_DEFAULT = CB_GraphicSprites.SRC_TYPES.DEFAULT = CB_GraphicSprites.SRC_TYPES.IMAGE;

/**
 * Default width ("srcWidth") of the original source. Unit agnostic.
 *	@constant
 *  @type {number}
 *  @default
 */
CB_GraphicSprites.WIDTH_SOURCE_DEFAULT = 32;
/**
 * Default height ("srcHeight") of the original source. Unit agnostic.
 *	@constant
 *  @type {number}
 *  @default
 */
CB_GraphicSprites.HEIGHT_SOURCE_DEFAULT = 32;

/**
 * Default left ("srcLeft", horizontal position) in the original source. Unit agnostic.
 *	@constant
 *  @type {number}
 *  @default
 */
CB_GraphicSprites.LEFT_SOURCE_DEFAULT = 0;
/**
 * Default top ("srcTop", vertical position) in the original source. Unit agnostic.
 *	@constant
 *  @type {number}
 *  @default
 */
CB_GraphicSprites.TOP_SOURCE_DEFAULT = 0;

/**
 * Default "width" of the destiny. Unit agnostic.
 *	@constant
 *  @type {number}
 *  @default
 */
CB_GraphicSprites.WIDTH_DEFAULT = CB_GraphicSprites.WIDTH_SOURCE_DEFAULT;
/**
 * Default "height" of the destiny. Unit agnostic.
 *	@constant
 *  @type {number}
 *  @default
 */
CB_GraphicSprites.HEIGHT_DEFAULT = CB_GraphicSprites.HEIGHT_SOURCE_DEFAULT;

/**
 * Default "left" (horizontal position) in the destiny. Unit agnostic.
 *	@constant
 *  @type {number}
 *  @default
 */
CB_GraphicSprites.LEFT_DEFAULT = 0;
/**
 * Default "top" (vertical position) in the destiny. Unit agnostic.
 *	@constant
 *  @type {number}
 *  @default
 */
CB_GraphicSprites.TOP_DEFAULT = 0;

/**
 * Default "zIndex" in the destiny.
 *	@constant
 *  @type {number}
 *  @default
 */
CB_GraphicSprites.ZINDEX_DEFAULT = 1;



//Variables:
CB_GraphicSprites._idUnique = 0; //Counter to make the sprites group id unique.
CB_GraphicSprites._idSpriteUnique = 0; //Counter to make the sprite id unique.
CB_GraphicSprites._idSubSpriteUnique = 0; //Counter to make the sub-sprite id unique.


//Constructor:
CB_GraphicSprites.prototype._init = function(spritesGroup, byReference)
{
	this.insertSprites(spritesGroup, byReference); //Inserts the given sprites group.
	return this;
}


/**
 * Destroys the graphic sprites object (removing all the sprites and their sub-sprites, etc.) and frees memory.
 *  @function
 */
CB_GraphicSprites.prototype.destructor = function()
{
	//Resets properties to their default value:
	this.removeSprites();
}


/**
 * Alias for {@link CB_GraphicSprites#removeSprites}.
 *  @function CB_GraphicSprites#removeAll
 *  @see {@link CB_GraphicSprites#removeSprites}
 */
/**
 * Alias for {@link CB_GraphicSprites#removeSprites}.
 *  @function CB_GraphicSprites#removeSpritesGroup
 *  @see {@link CB_GraphicSprites#removeSprites}
 */
/**
 * Alias for {@link CB_GraphicSprites#removeSprites}.
 *  @function CB_GraphicSprites#removeSpritesAll
 *  @see {@link CB_GraphicSprites#removeSprites}
 */	
/**
 * Removes all the sprites by clearing the {@link CB_GraphicSprites#spritesGroup} property.
 *  @function
 */
CB_GraphicSprites.prototype.removeSprites = CB_GraphicSprites.prototype.removeSpritesAll = CB_GraphicSprites.prototype.removeSpritesGroup = CB_GraphicSprites.prototype.removeAll = function()
{
	this.spritesGroup = {};
	this.pointer = this.pointerPrevious = -1;
}


/**
 * Alias for {@link CB_GraphicSprites#insertSprites}.
 *  @function CB_GraphicSprites#insertSpritesGroup
 *  @see {@link CB_GraphicSprites#insertSprites}
 */	
/**
 * Adds the desired group of graphic sprites. Calls the {@link CB_GraphicSprites#insertSprite} and {@link CB_GraphicSprites#updateSpritesByZIndex} methods internally.
 *  @function
 *  @param {CB_GraphicSprites.SPRITES_OBJECT} [spritesGroup] - Object with the desired sprites. They will be stored in the {@link CB_GraphicSprites#spritesGroup} property.
 *  @param {boolean} [byReference=!!{@link CB_GraphicSprites.SPRITES_OBJECT.byReference_DEFAULT}] - This value will be used as the default value when the "byReference" property is not given in the sprites ({@link CB_GraphicSprites.SPRITE_OBJECT} objects) or sub-sprites ({@link CB_GraphicSprites.SUBSPRITE_OBJECT} objects). The value will be stored in the {@link CB_GraphicSprites#byReference_DEFAULT} property. If a boolean value is not provided, it will use the value of the {@link CB_GraphicSprites.SPRITES_OBJECT.byReference_DEFAULT} property of the given {@link CB_GraphicSprites.SPRITES_OBJECT} object (parsed to boolean).
 *  @returns {CB_GraphicSprites.SPRITES_OBJECT} Returns the {@link CB_GraphicSprites#spritesGroup} property after updating it.
 */
CB_GraphicSprites.prototype.insertSprites = CB_GraphicSprites.prototype.insertSpritesGroup = function(spritesGroup, byReference)
{
	//Sets the properties (sanitizing them):
	this.byReference_DEFAULT = (byReference === true || byReference === false) ? byReference : !!spritesGroup.byReference_DEFAULT;
	this.spritesGroup = this.spritesGroup || {};
	spritesGroup = spritesGroup || {};
	this.spritesGroup.isSpritesGroup = true;
	this.spritesGroup.type = "spritesGroup";
	this.spritesGroup.container = this;
	this.parent = this.spritesGroup.parent = spritesGroup.parent;
	this.id = this.spritesGroup.id = spritesGroup.id = spritesGroup.id || "CB_GraphicSprites_" + CB_GraphicSprites._idUnique++;
	this.spritesGroup.src = spritesGroup.src = spritesGroup.src || !isNaN(spritesGroup.src) && spritesGroup.src !== null ? spritesGroup.src : "";
	this.spritesGroup.srcType = spritesGroup.srcType = spritesGroup.srcType || CB_GraphicSprites.SRC_TYPES_DEFAULT;
	spritesGroup.srcLeft = parseFloat(spritesGroup.srcLeft);
	this.spritesGroup.srcLeft = spritesGroup.srcLeft = !isNaN(spritesGroup.srcLeft) ? spritesGroup.srcLeft : parseFloat(CB_GraphicSprites.LEFT_SOURCE_DEFAULT) || 0;
	spritesGroup.left = parseFloat(spritesGroup.left);
	this.spritesGroup.left = spritesGroup.left = !isNaN(spritesGroup.left) ? spritesGroup.left : parseFloat(CB_GraphicSprites.LEFT_DEFAULT) || 0;
	spritesGroup.srcTop = parseFloat(spritesGroup.srcTop);
	this.spritesGroup.srcTop = spritesGroup.srcTop = !isNaN(spritesGroup.srcTop) ? spritesGroup.srcTop : parseFloat(CB_GraphicSprites.TOP_SOURCE_DEFAULT) || 0;
	spritesGroup.top = parseFloat(spritesGroup.top);
	this.spritesGroup.top = spritesGroup.top = !isNaN(spritesGroup.top) ? spritesGroup.top : parseFloat(CB_GraphicSprites.TOP_DEFAULT) || 0;
	spritesGroup.srcWidth = parseFloat(spritesGroup.srcWidth);
	this.spritesGroup.srcWidth = spritesGroup.srcWidth = !isNaN(spritesGroup.srcWidth) ? spritesGroup.srcWidth : parseFloat(CB_GraphicSprites.WIDTH_SOURCE_DEFAULT) || 0;
	spritesGroup.width = parseFloat(spritesGroup.width);
	this.spritesGroup.width = spritesGroup.width = !isNaN(spritesGroup.width) ? spritesGroup.width : CB_GraphicSprites.WIDTH_DEFAULT;
	spritesGroup.srcHeight = parseFloat(spritesGroup.srcHeight);
	this.spritesGroup.srcHeight = spritesGroup.srcHeight = !isNaN(spritesGroup.srcHeight) ? spritesGroup.srcHeight : parseFloat(CB_GraphicSprites.HEIGHT_SOURCE_DEFAULT) || 0;
	spritesGroup.height = parseFloat(spritesGroup.height);
	this.spritesGroup.height = spritesGroup.height = !isNaN(spritesGroup.height) ? spritesGroup.height : parseFloat(CB_GraphicSprites.HEIGHT_DEFAULT) || 0;
	this.zIndex = spritesGroup.zIndex = parseFloat(spritesGroup.zIndex);
	this.spritesGroup.disabled = !!spritesGroup.disabled;
	this.spritesGroup.zIndex = spritesGroup.zIndex = !isNaN(spritesGroup.zIndex) ? spritesGroup.zIndex : parseFloat(CB_GraphicSprites.ZINDEX_DEFAULT) || 0;
	this.spritesGroup.data = typeof(spritesGroup.data) === "object" && spritesGroup.data !== null ? CB_copyObject(spritesGroup.data, false) : {}; //Accepts any object but not other values.
	this.spritesGroup.data.that = this.spritesGroup;
	this.spritesGroup.data.getThis = function() { return this.that; };
	
	spritesGroup.sprites = CB_isArray(spritesGroup.sprites) ? spritesGroup.sprites : [];
	
	//Inserts the given sprites, one by one:
	var spritesGroupLength = spritesGroup.sprites.length;
	for (var x = 0; x < spritesGroupLength; x++)
	{
		this.insertSprite(spritesGroup.sprites[x], true);
	}
	
	//Updates the array with the sprites ordered by z-index:
	this.updateSpritesByZIndex();
	
	//Returns the sprites:
	return this.spritesGroup;
}


/**
 * Updates (sorts again) the "spritesByZIndex" property (which is an array with the sprites ordered by z-index, whose data comes from the array in the "sprites" property of the {@link CB_GraphicSprites#spritesGroup} object) of the {@link CB_GraphicSprites#spritesGroup} object.
 *  @function
 *  @returns {array} Returns the "spritesByZIndex" array of the {@link CB_GraphicSprites#spritesGroup} object after updating it. Returns null if the property could not be obtained or updated.
 */
CB_GraphicSprites.prototype.updateSpritesByZIndex = function()
{
	this.spritesGroup.sprites = this.spritesGroup.sprites || null;
	if (this.spritesGroup.sprites)
	{
		var spritesGroupLength = this.spritesGroup.sprites.length;
		if (spritesGroupLength)
		{
			var elementIndex = null;
			this.spritesGroup.spritesByZIndex = [];
			for (var x = 0; x < spritesGroupLength; x++)
			{
				elementIndex = CB_GraphicSpritesScene._choosePositionByZIndex(this.spritesGroup.spritesByZIndex, this.spritesGroup.sprites[x]);
				this.spritesGroup.spritesByZIndex = CB_Arrays.insertElement(this.spritesGroup.spritesByZIndex, elementIndex, this.spritesGroup.sprites[x]);
				this.spritesGroup.sprites[x].positionByZIndex = elementIndex;
			}
			return this.spritesGroup.spritesByZIndex;
		}
	}
	return null;
}


/**
 * Alias for {@link CB_GraphicSprites#removeSprite}.
 *  @function CB_GraphicSprites#remove
 *  @see {@link CB_GraphicSprites#removeSprite}
 */
/**
 * Removes a sprite by its index (its position in the {@link CB_GraphicSprites#spritesGroup.sprites} array). Calls the {@link CB_GraphicSprites#updateSpritesByZIndex} method internally.
 *  @function
 *  @param {integer} [index=0] - The index where the sprite is located (its position in the {@link CB_GraphicSprites#spritesGroup.sprites} array).
 *  @returns {boolean} Returns true if the sprite has been deleted or false otherwise.
 */
CB_GraphicSprites.prototype.removeSprite = CB_GraphicSprites.prototype.remove = function(index)
{
	var removed = false;
	var spritesLeft = CB_Arrays.removeElementByPosition(this.spritesGroup.sprites, index, function() { removed = true; });
	if (removed)
	{
		this.spritesGroup.sprites = spritesLeft;
		//Keeps the pointer if the position is valid or sets to the last position if the position was greater than the current limit or uses the first position otherwise:
		this.setPointer(this.getPointer());
		
		//Updates the array with the sprites ordered by z-index:
		this.updateSpritesByZIndex();
	}
	return removed;
}


/**
 * Alias for {@link CB_GraphicSprites#removeSpriteById}.
 *  @function CB_GraphicSprites#removeById
 *  @see {@link CB_GraphicSprites#removeSpriteById}
 */
/**
 * Removes a sprite by its identifier. Calls the {@link CB_GraphicSprites#updateSpritesByZIndex} method internally.
 *  @function
 *  @param {string|*} [id=undefined] - The identifier of the sprite.
 *  @returns {boolean} Returns true if the sprite has been deleted or false otherwise.
 *  @todo Optimize it (perhaps using a cache matching the IDs with their position, maybe using the "position" or "positionByZIndex" properties).
 */
CB_GraphicSprites.prototype.removeSpriteById = CB_GraphicSprites.prototype.removeById = function(id)
{
	var removed = false;
	var spritesLeft = CB_Arrays.removeDuplicated(this.spritesGroup.sprites, function(value, position, array) { if (value && value.id === id) { removed = true; return true; }; return false; }, true);
	if (removed)
	{
		this.spritesGroup.sprites = spritesLeft;
		//Keeps the pointer if the position is valid or sets to the last position if the position was greater than the current limit or uses the first position otherwise:
		this.setPointer(this.getPointer());
		
		//Updates the array with the sprites ordered by z-index:
		this.updateSpritesByZIndex();
	}
	return removed;
}


/**
 * Alias for {@link CB_GraphicSprites#insertSprite}.
 *  @function CB_GraphicSprites#insert
 *  @see {@link CB_GraphicSprites#insertSprite}
 */
/**
 * Adds the desired graphic sprite. Calls {@link CB_GraphicSprites#insertSubSprites} internally. If a sprite with the same identifier already exists, it will be replaced by the new one in its same position.
 *  @function
 *  @param {CB_GraphicSprites.SPRITE_OBJECT} [sprite] - Object with the desired sprite. It will be stored inside the {@link CB_GraphicSprites#spritesGroup} property.
 *  @param {boolean} [avoidUpdatingSpritesByZIndex=false] - If set to true, it will not call the {CB_GraphicSprites#updateSpritesByZIndex} method internally. Internal usage recommended only.
 *  @returns {CB_GraphicSprites.SPRITE_OBJECT} Returns the {@link CB_GraphicSprites.SPRITE_OBJECT} object which has been inserted (it could have been modified/sanitized from the given one and some missing properties or those which were wrong could have been inherited).
 */
CB_GraphicSprites.prototype.insertSprite = CB_GraphicSprites.prototype.insert = function(sprite, avoidUpdatingSpritesByZIndex)
{
	//Sets the properties (sanitizing them):
	this.spritesGroup = this.spritesGroup || {};
	sprite = sprite || {};
	if (sprite.byReference !== true && sprite.byReference !== false) { sprite.byReference = this.byReference_DEFAULT; }
	sprite = sprite.byReference ? sprite : CB_copyObject(sprite);
	sprite.isSprite = true;
	sprite.type = "sprite";
	sprite.container = this;
	sprite.parent = this.spritesGroup;
	sprite.time = !isNaN(parseInt(sprite.time)) ? parseInt(sprite.time) : 0;
	sprite.id = sprite.id || "CB_GraphicSprites.sprite_" + CB_GraphicSprites._idSpriteUnique++;
	sprite.src = sprite.src || !isNaN(sprite.src) && sprite.src !== null ? sprite.src : this.spritesGroup.src || !isNaN(this.spritesGroup.src) && this.spritesGroup.src !== null ? this.spritesGroup.src : "";
	sprite.srcType = sprite.srcType || this.spritesGroup.srcType || CB_GraphicSprites.SRC_TYPES_DEFAULT;
	sprite.srcLeft = parseFloat(sprite.srcLeft);
	sprite.srcLeft = !isNaN(sprite.srcLeft) ? sprite.srcLeft : parseFloat(this.spritesGroup.srcLeft);
	sprite.srcLeft = !isNaN(sprite.srcLeft) ? sprite.srcLeft : parseFloat(CB_GraphicSprites.LEFT_SOURCE_DEFAULT) || 0;
	sprite.left = parseFloat(sprite.left);
	//sprite.left = !isNaN(sprite.left) ? sprite.left : parseFloat(this.spritesGroup.left);
	sprite.left = !isNaN(sprite.left) ? sprite.left : parseFloat(CB_GraphicSprites.LEFT_DEFAULT) || 0;
	sprite.srcTop = parseFloat(sprite.srcTop);
	sprite.srcTop = !isNaN(sprite.srcTop) ? sprite.srcTop : parseFloat(this.spritesGroup.srcTop);
	sprite.srcTop = !isNaN(sprite.srcTop) ? sprite.srcTop : parseFloat(CB_GraphicSprites.TOP_SOURCE_DEFAULT) || 0;
	sprite.top = parseFloat(sprite.top);
	//sprite.top = !isNaN(sprite.top) ? sprite.top : parseFloat(this.spritesGroup.top);
	sprite.top = !isNaN(sprite.top) ? sprite.top : parseFloat(CB_GraphicSprites.TOP_DEFAULT) || 0;
	sprite.srcWidth = parseFloat(sprite.srcWidth);
	sprite.srcWidth = !isNaN(sprite.srcWidth) ? sprite.srcWidth : parseFloat(this.spritesGroup.srcWidth);
	sprite.srcWidth = !isNaN(sprite.srcWidth) ? sprite.srcWidth : parseFloat(CB_GraphicSprites.WIDTH_SOURCE_DEFAULT) || 0;
	sprite.width = parseFloat(sprite.width);
	sprite.width = !isNaN(sprite.width) ? sprite.width : parseFloat(this.spritesGroup.width);
	sprite.width = !isNaN(sprite.width) ? sprite.width : parseFloat(CB_GraphicSprites.WIDTH_DEFAULT) || 0;
	sprite.srcHeight = parseFloat(sprite.srcHeight);
	sprite.srcHeight = !isNaN(sprite.srcHeight) ? sprite.srcHeight : parseFloat(this.spritesGroup.srcHeight);
	sprite.srcHeight = !isNaN(sprite.srcHeight) ? sprite.srcHeight : parseFloat(CB_GraphicSprites.HEIGHT_SOURCE_DEFAULT) || 0;
	sprite.height = parseFloat(sprite.height);
	sprite.height = !isNaN(sprite.height) ? sprite.height : parseFloat(this.spritesGroup.height);
	sprite.height = !isNaN(sprite.height) ? sprite.height : parseFloat(CB_GraphicSprites.HEIGHT_DEFAULT) || 0;
	sprite.zIndex = parseFloat(sprite.zIndex);
	sprite.zIndex = !isNaN(sprite.zIndex) ? sprite.zIndex : parseFloat(this.spritesGroup.zIndex);
	sprite.zIndex = !isNaN(sprite.zIndex) ? sprite.zIndex : parseFloat(CB_GraphicSprites.ZINDEX_DEFAULT) || 0;
	sprite.disabled = !!sprite.disabled || !!this.spritesGroup.disabled;
	if (!sprite.disabled && this.isDisabled()) { this.setDisabled(false); } //If it is enabled and its sprites group parent is not, all the sprites group must be enabled.
	sprite.data = typeof(sprite.data) === "object" && sprite.data !== null ? sprite.data : this.spritesGroup.data;
	if (typeof(this.spritesGroup.data) === "object" && this.spritesGroup.data !== null) { sprite.data = CB_combineJSON(this.spritesGroup.data, sprite.data); } //Combine objects.
	sprite.data = typeof(sprite.data) === "object" && sprite.data !== null ? CB_copyObject(sprite.data, false) : {};
	sprite.data.that = sprite;
	sprite.data.getThis = function() { return this.that; };
	sprite.subSprites = CB_isArray(sprite.subSprites) ? (sprite.byReference ? sprite.subSprites : CB_Arrays.copy(sprite.subSprites)) : [];

	//Inserts the methods:
	sprite.removeAll = sprite.removeSubSprites = function() { return CB_GraphicSprites.prototype.removeSubSprites.call(this.container, sprite); }
	sprite.insertSubSprites = function(subSprites) { return CB_GraphicSprites.prototype.insertSubSprites.call(this.container, subSprites, sprite); }
	sprite.remove = function(index) { return CB_GraphicSprites.prototype.removeSubSprite.call(this.container, index, sprite); }
	sprite.removeById = function(id) { return CB_GraphicSprites.prototype.removeSubSpriteById.call(this.container, id, sprite); }
	sprite.insert = sprite.insertSubSprite = function(subSprite) { return CB_GraphicSprites.prototype.insertSubSprite.call(this.container, subSprite, sprite); }
	sprite.getAll = sprite.getSubSprites = function(orderedByZIndex, returnValueOnFail) { return CB_GraphicSprites.prototype.getSubSprites.call(this.container, sprite, orderedByZIndex, returnValueOnFail); }
	sprite.get = function(index, returnValueOnFail) { return CB_GraphicSprites.prototype.getSubSprite.call(this.container, index, sprite, returnValueOnFail); }
	sprite.getById = function(id, returnValueOnFail) { return CB_GraphicSprites.prototype.getSubSpriteById.call(this.container, id, sprite, returnValueOnFail); }
	sprite.getIndexById = function(id) { return CB_GraphicSprites.prototype.getSubSpriteIndexById.call(this.container, id, sprite); }
	sprite.executeFunctionAll = sprite.executeAll = sprite.forEach = function(functionEach, orderedByZIndex, delayBetweenEach, returnSetTimeoutsArray, delayBetweenEachAffectsFirst, functionFinish) { return CB_GraphicSprites.prototype.executeFunctionAllSubSprites.call(this.container, functionEach, orderedByZIndex, delayBetweenEach, sprite, returnSetTimeoutsArray, delayBetweenEachAffectsFirst, functionFinish); }
	sprite.getZIndex = function(returnValueOnFail) { return CB_GraphicSprites.prototype.getZIndexSprite.call(this.container, sprite, returnValueOnFail); }
	sprite.setZIndex = function(zIndex) { return CB_GraphicSprites.prototype.setZIndexSprite.call(this.container, sprite, zIndex); }
	sprite.isDisabled = function() { return CB_GraphicSprites.prototype.isDisabledSprite.call(this.container, sprite); }
	sprite.setDisabled = function(disabled, affectSubSprites, affectParent, affectParentChildren) { return CB_GraphicSprites.prototype.setDisabledSprite.call(this.container, sprite, disabled, affectSubSprites, affectParent, affectParentChildren); }
	sprite.setTime = function(time) { return CB_GraphicSprites.prototype.setTime.call(this, time, false, false); }
	sprite.getTime = function(returnValueOnFail) { return CB_GraphicSprites.prototype.getTime.call(this, returnValueOnFail); }
	sprite.getTimeElapsed = function(timeToCompare) { return CB_GraphicSprites.prototype.getTimeElapsed.call(this, timeToCompare); }
	sprite.getPointer = sprite.getCurrentPosition = function() { return CB_GraphicSprites.prototype.getPointer.call(this.container); }
	sprite.getPointerPrevious = sprite.getPreviousPosition = function() { return CB_GraphicSprites.prototype.getPointerPrevious.call(this.container); }
	sprite.setPointer = sprite.setCurrentPosition = function(position, loop) { CB_GraphicSprites.prototype.setPointer.call(this.container, position, loop); return this.getCurrent(); }
	sprite.getCurrent = sprite.current = sprite.now = function() { return CB_GraphicSprites.prototype.getCurrent.call(this.container); }
	sprite.setNext = sprite.next = function(loop) { return CB_GraphicSprites.prototype.setNext.call(this.container, loop); }
	sprite.setPrevious = sprite.previous = function(loop) { return CB_GraphicSprites.prototype.setPrevious.call(this.container, loop); }
	sprite.getPrevious = function() { return CB_GraphicSprites.prototype.getPrevious.call(this.container); }
	sprite.setPropertyCascade = function(propertyName, value) { return CB_GraphicSprites.prototype.setPropertyCascade.call(this, propertyName, value, false); }
	
	//Inserts the given sub-sprites, one by one:
	this.insertSubSprites(sprite.subSprites, sprite);

	//Inserts the sprite:
	this.spritesGroup.sprites = this.spritesGroup.sprites || []; ////CB_Arrays.copy(this.spritesGroup.sprites);
	var position = this.getSpriteIndexById(sprite.id); //If there is a sprite with the same ID, it will be replaced by the new one (in the same position):
	position = position !== -1 ? position : this.spritesGroup.sprites.length;
	sprite.position = position;
	this.spritesGroup.sprites[position] = sprite;
	
	//If desired, updates the array with the sprites ordered by z-index:
	if (!avoidUpdatingSpritesByZIndex) { this.updateSpritesByZIndex(); }
	
	this.spritesGroup.sprites = this.spritesGroup.sprites;
	
	//Keeps the pointer if the position is valid or sets to the last position if the position was greater than the current limit or uses the first position otherwise:
	this.setPointer(this.getPointer());
	
	//Returns the sprite:
	return sprite;
}


/**
 * Alias for {@link CB_GraphicSprites#removeSubSprites}.
 *  @function CB_GraphicSprites#removeSubSpritesAll
 *  @see {@link CB_GraphicSprites#removeSubSprites}
 */	
/**
 * Removes all the sub-sprites from a given sprite ({@link CB_GraphicSprites.SPRITE_OBJECT} object) by clearing its "subSprites" property (leaving an empty array).
 *  @function
 *  @param {CB_GraphicSprites.SPRITE_OBJECT} [sprite=CB_GraphicSprites#getCurrent()] - Object with the sprite whose sub-sprites we want to remove. If not provided, it will use the {@link CB_GraphicSprites.SPRITE_OBJECT} object which the pointer (set in the {@link CB_GraphicSprites#pointer} property) is currently pointing to (using the returning value of the {@link CB_GraphicSprites#getCurrent} method internally).
 *  @returns {boolean} Returns true if the sub-sprites have been deleted or false otherwise.
 */
CB_GraphicSprites.prototype.removeSubSprites = CB_GraphicSprites.prototype.removeSubSpritesAll = function(sprite)
{
	var removed = false;
	sprite = sprite || this.getCurrent();
	if (sprite)
	{
		if (this.spritesGroup && this.spritesGroup.sprites)
		{
			var spritesLength = this.spritesGroup.sprites.length;
			for (var x = 0; x < spritesLength; x++)
			{
				if (this.spritesGroup.sprites[x] === sprite) { this.spritesGroup.sprites[x].subSprites = []; this.spritesGroup.sprites[x].subSpritesByZIndex = []; removed = true; break; } //Just removes one.
			}
		}
	}
	return removed;
}


/**
 * Adds the given sub-sprites to the desired sprite. Calls the {@link CB_GraphicSprites#insertSubSprite} and {@link CB_GraphicSprites#updateSubSpritesByZIndex} methods internally.
 *  @function
 *  @param {array} subSprites - Numeric array with the desired sub-sprites ({@link CB_GraphicSprites.SUBSPRITE_OBJECT} objects). They will be stored inside the given sprite. If a value which is not an array is provided, it will be tried to be processed internally as the first and unique value of an array.
 *  @param {CB_GraphicSprites.SPRITE_OBJECT} [sprite=CB_GraphicSprites#getCurrent()] - Object with the desired sprite. If not provided, it will use the {@link CB_GraphicSprites.SPRITE_OBJECT} object which the pointer (set in the {@link CB_GraphicSprites#pointer} property) is currently pointing to (using the returning value of the {@link CB_GraphicSprites#getCurrent} method internally).
 *  @returns {array} Returns an array with the {@link CB_GraphicSprites.SUBSPRITE_OBJECT} objects which have been inserted (they could have been modified/sanitized from the given one and some missing properties or those which were wrong could have been inherited).
 */
CB_GraphicSprites.prototype.insertSubSprites = function(subSprites, sprite)
{
	//Sets the properties (sanitizing them):
	sprite = sprite || this.getCurrent();
	if (subSprites === null || typeof(subSprites) !== "object") { subSprites = []; }
	subSprites = CB_isArray(subSprites) ? subSprites : [ subSprites ];
	
	//Inserts the given sub-sprites, one by one:
	var subSpritesInserted = [];
	var subSpritesLength = subSprites.length;
	for (var x = 0; x < subSpritesLength; x++)
	{
		subSpritesInserted[subSpritesInserted.length] = this.insertSubSprite(subSprites[x], sprite, true);
	}
	
	//Updates the array with the sub-sprites ordered by z-index:
	this.updateSubSpritesByZIndex(sprite);
	
	return subSpritesInserted;
}


/**
 * Updates (sorts again) the "subSpritesByZIndex" property (which is an array with the sub-sprites ordered by z-index, whose data comes from the array in the "subSprites" property of the given {@link CB_GraphicSprites.SPRITE_OBJECT} object)) of the desired sprite.
 *  @function
 *  @param {CB_GraphicSprites.SPRITE_OBJECT} [sprite=CB_GraphicSprites#getCurrent()] - Object with the sprite whose sub-sprites we want to remove. If not provided, it will use the {@link CB_GraphicSprites.SPRITE_OBJECT} object which the pointer (set in the {@link CB_GraphicSprites#pointer} property) is currently pointing to (using the returning value of the {@link CB_GraphicSprites#getCurrent} method internally).
 *  @returns {array} Returns the "subSpritesByZIndex" array after updating it. Returns null if the property could not be obtained or updated.
 */
CB_GraphicSprites.prototype.updateSubSpritesByZIndex = function(sprite)
{
	sprite = sprite || this.getCurrent();
	if (sprite && sprite.subSprites)
	{
		var subSpritesLength = sprite.subSprites.length;
		if (subSpritesLength)
		{
			var elementIndex = null;
			sprite.subSpritesByZIndex = [];
			for (var x = 0; x < subSpritesLength; x++)
			{
				indexElement = CB_GraphicSpritesScene._choosePositionByZIndex(sprite.subSpritesByZIndex, sprite.subSprites[x]);
				sprite.subSpritesByZIndex = CB_Arrays.insertElement(sprite.subSpritesByZIndex, indexElement, sprite.subSprites[x]);
				sprite.subSprites[x].positionByZIndex = indexElement;
			}
			return sprite.subSpritesByZIndex;
		}
	}
	return null;
}


/**
 * Removes a sub-sprite from a given sprite ({@link CB_GraphicSprites.SPRITE_OBJECT} object) by its index (its position in the array which is in the "subSprites" property of the given {@link CB_GraphicSprites.SPRITE_OBJECT} object). Calls the {@link CB_GraphicSprites#updateSubSpritesByZIndex} method internally.
 *  @function
 *  @param {integer} [index=0] - The index where the sub-sprite is located (its position in the array which is in the "subSprites" property of the given {@link CB_GraphicSprites.SPRITE_OBJECT} object).
 *  @param {CB_GraphicSprites.SPRITE_OBJECT} [sprite=CB_GraphicSprites#getCurrent()] - Object with the sprite whose sub-sprites we want to remove. If not provided, it will use the {@link CB_GraphicSprites.SPRITE_OBJECT} object which the pointer (set in the {@link CB_GraphicSprites#pointer} property) is currently pointing to (using the returning value of the {@link CB_GraphicSprites#getCurrent} method internally).
 *  @returns {boolean} Returns true if the sub-sprite has been deleted or false otherwise.
 */
CB_GraphicSprites.prototype.removeSubSprite = function(index, sprite)
{
	var removed = false;
	if (this.spritesGroup && this.spritesGroup.sprites)
	{
		sprite = sprite || this.getCurrent();
		if (sprite)
		{
			index = parseInt(index);
			index = isNaN(index) ? 0 : index;
			if (index < 0) { index *= -1; } //It must be a positive integer.
			var subSpritesLeft = null;
			var spritesLength = this.spritesGroup.sprites.length;
			for (var x = 0; x < spritesLength; x++)
			{
				if (this.spritesGroup.sprites[x] === sprite)
				{
					removed = false;
					subSpritesLeft = CB_Arrays.removeElementByPosition(this.spritesGroup.sprites[x].subSprites, index, function() { removed = true; });
					if (removed)
					{
						this.spritesGroup.sprites[x].subSprites = subSpritesLeft;
	
						//Updates the array with the sub-sprites ordered by z-index:
						this.updateSubSpritesByZIndex(sprite);
						
						break; //Just removes it from one.
					}
				}
			}
		}
	}
	return removed;
}


/**
 * Removes a sub-sprite from a given sprite ({@link CB_GraphicSprites.SPRITE_OBJECT} object) by its identifier. Calls the {@link CB_GraphicSprites#updateSubSpritesByZIndex} method internally.
 *  @function
 *  @param {string|*} [id=undefined] - The identifier of the sprite.
 *  @param {CB_GraphicSprites.SPRITE_OBJECT} [sprite=CB_GraphicSprites#getCurrent] - Object with the sprite whose sub-sprites we want to remove.
 *  @returns {boolean} Returns true if the sub-sprite has been deleted or false otherwise.
 *  @todo Optimize it (perhaps using a cache matching the IDs with their position, maybe using the "position" or "positionByZIndex" properties).
 */
CB_GraphicSprites.prototype.removeSubSpriteById = function(id, sprite)
{
	var removed = false;
	if (this.spritesGroup && this.spritesGroup.sprites)
	{
		sprite = sprite || this.getCurrent();
		if (sprite)
		{
			var subSpritesLeft = null;
			var spritesLength = this.spritesGroup.sprites.length;
			for (var x = 0; x < spritesLength; x++)
			{
				if (this.spritesGroup.sprites[x] === sprite)
				{
					removed = false;
					subSpritesLeft = CB_Arrays.removeDuplicated(this.spritesGroup.sprites[x].subSprites, function(value, position, array) { if (value && value.id === id) { removed = true; return true; }; return false; }, true);
					if (removed)
					{
						this.spritesGroup.sprites[x].subSprites = subSpritesLeft;
					
						//Updates the array with the sub-sprites ordered by z-index:
						this.updateSubSpritesByZIndex(sprite);
					
						break; //Just removes it from one.
					}
				}
			}
		}
	}
	return removed;
}


/**
 * Adds the given sub-sprite to the desired sprite. If a sub-sprite with the same identifier already exists, it will be replaced by the new one in its same position.
 *  @function
 *  @param {CB_GraphicSprites.SUBSPRITE_OBJECT} subSprite - Object with the desired sub-sprite. It will be stored inside the given sprite.
 *  @param {CB_GraphicSprites.SPRITE_OBJECT} sprite - Object with the desired sprite.
 *  @param {boolean} [avoidUpdatingSubSpritesByZIndex=false] - If set to true, it will not call the {CB_GraphicSprites#updateSubSpritesByZIndex} method internally. Internal usage recommended only.
 *  @returns {CB_GraphicSprites.SUBSPRITE_OBJECT} Returns the {@link CB_GraphicSprites.SUBSPRITE_OBJECT} object which has been inserted (it could have been modified/sanitized from the given one and some missing properties or those which were wrong could have been inherited).
 */
CB_GraphicSprites.prototype.insertSubSprite = function(subSprite, sprite, avoidUpdatingSubSpritesByZIndex)
{
	//Sets the properties (sanitizing them):
	this.spritesGroup = this.spritesGroup || {};
	sprite = sprite || {};
	subSprite = subSprite || {};
	if (sprite.byReference !== true && sprite.byReference !== false) { sprite.byReference = this.byReference_DEFAULT; }
	subSprite = subSprite.byReference ? subSprite : CB_copyObject(subSprite);
	sprite.isSubSprite = true;
	subSprite.type = "subSprite";
	subSprite.container = this;
	subSprite.parent = sprite;
	subSprite.time = !isNaN(parseInt(subSprite.time)) ? parseInt(subSprite.time) : !isNaN(parseInt(sprite.time)) ? parseInt(sprite.time) : 0;
	subSprite.id = subSprite.id || "CB_GraphicSprites.subSprite_" + CB_GraphicSprites._idSubSpriteUnique++;
	subSprite.src = subSprite.src || !isNaN(subSprite.src) && subSprite.src !== null ? subSprite.src : sprite.src || !isNaN(sprite.src) && sprite.src !== null ? sprite.src : this.spritesGroup.src || !isNaN(this.spritesGroup.src) && this.spritesGroup.src !== null ? this.spritesGroup.src : "";
	subSprite.srcType = subSprite.srcType || sprite.srcType || this.spritesGroup.srcType || CB_GraphicSprites.SRC_TYPES_DEFAULT;
	subSprite.srcLeft = parseFloat(subSprite.srcLeft);
	subSprite.srcLeft = !isNaN(subSprite.srcLeft) ? subSprite.srcLeft : parseFloat(sprite.srcLeft);
	subSprite.srcLeft = !isNaN(subSprite.srcLeft) ? subSprite.srcLeft : parseFloat(this.spritesGroup.srcLeft);
	subSprite.srcLeft = !isNaN(subSprite.srcLeft) ? subSprite.srcLeft : parseFloat(CB_GraphicSprites.LEFT_SOURCE_DEFAULT) || 0;
	subSprite.left = parseFloat(subSprite.left);
	//subSprite.left = !isNaN(subSprite.left) ? subSprite.left : parseFloat(sprite.left);
	//subSprite.left = !isNaN(subSprite.left) ? subSprite.left : parseFloat(this.spritesGroup.left);
	subSprite.left = !isNaN(subSprite.left) ? subSprite.left : parseFloat(CB_GraphicSprites.LEFT_DEFAULT) || 0;
	subSprite.srcTop = parseFloat(subSprite.srcTop);
	subSprite.srcTop = !isNaN(subSprite.srcTop) ? subSprite.srcTop : parseFloat(sprite.srcTop);
	subSprite.srcTop = !isNaN(subSprite.srcTop) ? subSprite.srcTop : parseFloat(this.spritesGroup.srcTop);
	subSprite.srcTop = !isNaN(subSprite.srcTop) ? subSprite.srcTop : parseFloat(CB_GraphicSprites.TOP_SOURCE_DEFAULT) || 0;
	subSprite.top = parseFloat(subSprite.top);
	//subSprite.top = !isNaN(subSprite.top) ? subSprite.top : parseFloat(sprite.top);
	//subSprite.top = !isNaN(subSprite.top) ? subSprite.top : parseFloat(this.spritesGroup.top);
	subSprite.top = !isNaN(subSprite.top) ? subSprite.top : parseFloat(CB_GraphicSprites.TOP_DEFAULT) || 0;
	subSprite.srcWidth = parseFloat(subSprite.srcWidth);
	subSprite.srcWidth = !isNaN(subSprite.srcWidth) ? subSprite.srcWidth : parseFloat(sprite.srcWidth);
	subSprite.srcWidth = !isNaN(subSprite.srcWidth) ? subSprite.srcWidth : parseFloat(this.spritesGroup.srcWidth);
	subSprite.srcWidth = !isNaN(subSprite.srcWidth) ? subSprite.srcWidth : parseFloat(CB_GraphicSprites.WIDTH_SOURCE_DEFAULT) || 0;
	subSprite.width = parseFloat(subSprite.width);
	subSprite.width = !isNaN(subSprite.width) ? subSprite.width : parseFloat(sprite.width);
	subSprite.width = !isNaN(subSprite.width) ? subSprite.width : parseFloat(this.spritesGroup.width);
	subSprite.width = !isNaN(subSprite.width) ? subSprite.width : parseFloat(CB_GraphicSprites.WIDTH_DEFAULT) || 0;
	subSprite.srcHeight = parseFloat(subSprite.srcHeight);
	subSprite.srcHeight = !isNaN(subSprite.srcHeight) ? subSprite.srcHeight : parseFloat(sprite.srcHeight);
	subSprite.srcHeight = !isNaN(subSprite.srcHeight) ? subSprite.srcHeight : parseFloat(this.spritesGroup.srcHeight);
	subSprite.srcHeight = !isNaN(subSprite.srcHeight) ? subSprite.srcHeight : parseFloat(CB_GraphicSprites.HEIGHT_SOURCE_DEFAULT) || 0;
	subSprite.height = parseFloat(subSprite.height);
	subSprite.height = !isNaN(subSprite.height) ? subSprite.height : parseFloat(sprite.height);
	subSprite.height = !isNaN(subSprite.height) ? subSprite.height : parseFloat(this.spritesGroup.height);
	subSprite.height = !isNaN(subSprite.height) ? subSprite.height : parseFloat(CB_GraphicSprites.HEIGHT_DEFAULT) || 0;
	subSprite.zIndex = parseFloat(subSprite.zIndex);
	subSprite.zIndex = !isNaN(subSprite.zIndex) ? subSprite.zIndex : parseFloat(sprite.zIndex);
	subSprite.zIndex = !isNaN(subSprite.zIndex) ? subSprite.zIndex : parseFloat(this.spritesGroup.zIndex);
	subSprite.zIndex = !isNaN(subSprite.zIndex) ? subSprite.zIndex : parseFloat(CB_GraphicSprites.ZINDEX_DEFAULT) || 0;
	subSprite.disabled = !!subSprite.disabled || !!sprite.disabled || !!this.spritesGroup.disabled;
	if (!subSprite.disabled && this.isDisabledSprite(sprite)) { this.setDisabled(false); } //If it is enabled but its sprite parent is not, all the sprites group must be enabled.
	subSprite.data = typeof(subSprite.data) === "object" && subSprite.data !== null ? subSprite.data : sprite.data;
	if (typeof(sprite.data) === "object" && sprite.data !== null) { subSprite.data = CB_combineJSON(sprite.data, subSprite.data); } //Combine objects.
	subSprite.data = typeof(subSprite.data) === "object" && subSprite.data !== null ? subSprite.data : this.spritesGroup.data;
	if (typeof(this.spritesGroup.data) === "object" && this.spritesGroup.data !== null) { subSprite.data = CB_combineJSON(this.spritesGroup.data, subSprite.data); } //Combine objects.
	subSprite.data = typeof(subSprite.data) === "object" && subSprite.data !== null ? CB_copyObject(subSprite.data, false) : {};
	subSprite.data.that = subSprite;
	subSprite.data.getThis = function() { return this.that; };

	//Inserts the methods:
	subSprite.getZIndex = function(returnValueOnFail) { return CB_GraphicSprites.prototype.getZIndexSubSprite.call(this.container, subSprite, returnValueOnFail); }
	subSprite.setZIndex = function(zIndex) { return CB_GraphicSprites.prototype.setZIndexSubSprite.call(this.container, subSprite, zIndex); }
	subSprite.isDisabled = function() { return CB_GraphicSprites.prototype.isDisabledSubSprite.call(this.container, subSprite); }
	subSprite.setDisabled = function(disabled, affectParents, affectParentsChildren) { return CB_GraphicSprites.prototype.setDisabledSubSprite.call(this.container, subSprite, disabled, affectParents, affectParentsChildren); }
	subSprite.setTime = function(time) { return CB_GraphicSprites.prototype.setTime.call(this, time, false, false); }
	subSprite.getTime = function(returnValueOnFail) { return CB_GraphicSprites.prototype.getTime.call(this, returnValueOnFail, true); }
	subSprite.getTimeElapsed = function(timeToCompare) { return CB_GraphicSprites.prototype.getTimeElapsed.call(this, timeToCompare, true); }

	//Inserts the sub-sprite:
	sprite.subSprites = CB_isArray(sprite.subSprites) ? (sprite.byReference ? sprite.subSprites : CB_Arrays.copy(sprite.subSprites)) : [];
	var position = this.getSubSpriteIndexById(subSprite.id, sprite); //If there is a sub-sprite with the same ID, it will be replaced by the new one (in the same position).
	position = position !== -1 ? position : sprite.subSprites.length;
	subSprite.position = position;
	sprite.subSprites[position] = subSprite;
	
	//If desired, updates the array with the sub-sprites ordered by z-index:
	if (!avoidUpdatingSubSpritesByZIndex) { this.updateSubSpritesByZIndex(sprite); }
	
	//Returns the sub-sprite:
	return subSprite;
}


/**
 * Gets the sprites group object (the internal {@link CB_GraphicSprites.SPRITES_OBJECT} object, if any).
 *  @function
 *  @param {*} [returnValueOnFail=undefined] - The value we want it to return in the case that no value is found. If not provided, undefined will be returned.
 *  @returns {CB_GraphicSprites.SPRITES_OBJECT|*} Returns a {@link CB_GraphicSprites.SPRITES_OBJECT} object with all the sprites or the value of "returnValueOnFail" otherwise.
 */
CB_GraphicSprites.prototype.getSpritesGroup = function(returnValueOnFail)
{
	return this.spritesGroup || returnValueOnFail;
}


/**
 * Alias for {@link CB_GraphicSprites#getSprites}.
 *  @function CB_GraphicSprites#getAll
 *  @see {@link CB_GraphicSprites#getSprites}
 */
/**
 * Alias for {@link CB_GraphicSprites#getSprites}.
 *  @function CB_GraphicSprites#getSpritesAll
 *  @see {@link CB_GraphicSprites#getSprites}
 */
/**
 * Gets all the sprites (the "sprites" property of the internal {@link CB_GraphicSprites.SPRITES_OBJECT} object, if any).
 *  @function
 *  @param {boolean} [orderedByZIndex=false] - If set to true, it will return the sprites sorted by their z-index (ascending order).
 *  @param {*} [returnValueOnFail=undefined] - The value we want it to return in the case that no value is found. If not provided, undefined will be returned.
 *  @returns {array|*} Returns an array with all the {@link CB_GraphicSprites.SPRITE_OBJECT} objects or the value of "returnValueOnFail" otherwise.
 */
CB_GraphicSprites.prototype.getSprites = CB_GraphicSprites.prototype.getSpritesAll = CB_GraphicSprites.prototype.getAll = function(orderedByZIndex, returnValueOnFail)
{
	if (this.spritesGroup)
	{
		if (!orderedByZIndex)
		{
			return (this.spritesGroup.sprites) ? this.spritesGroup.sprites : returnValueOnFail;
		}
		else
		{
			return (this.spritesGroup.spritesByZIndex) ? this.spritesGroup.spritesByZIndex : returnValueOnFail;
		}
	}
	return returnValueOnFail;
}


/**
 * Alias for {@link CB_GraphicSprites#getSprite}.
 *  @function CB_GraphicSprites#get
 *  @see {@link CB_GraphicSprites#getSprite}
 */	
/**
 * Gets a desired sprite object through its index (its position in the {@link CB_GraphicSprites#spritesGroup.sprites} array). Faster than getting it through its identifier with the {@link CB_GraphicSprites#getSpriteById} method.
 *  @function
 *  @param {integer} [index=0] - The index where the desired sprite must be located (its position in the {@link CB_GraphicSprites#spritesGroup.sprites} array).
 *  @param {*} [returnValueOnFail=undefined] - The value we want it to return in the case that no value is found. If not provided, undefined will be returned.
 *  @returns {CB_GraphicSprites.SPRITE_OBJECT|*} Returns a {@link CB_GraphicSprites.SPRITE_OBJECT} object if found or the value of "returnValueOnFail" otherwise.
 */
CB_GraphicSprites.prototype.getSprite = CB_GraphicSprites.prototype.get = function(index, returnValueOnFail)
{
	index = parseInt(index);
	index = isNaN(index) ? 0 : index;
	if (index < 0) { index *= -1; } //It must be a positive integer.
	return this.spritesGroup && this.spritesGroup.sprites && this.spritesGroup.sprites[index] ? this.spritesGroup.sprites[index] : returnValueOnFail;
}


/**
 * Alias for {@link CB_GraphicSprites#getSpriteById}.
 *  @function CB_GraphicSprites#getById
 *  @see {@link CB_GraphicSprites#getSpriteById}
 */	
/**
 * Gets a desired sprite object through its identifier. Slower than getting it through its index with the {@link CB_GraphicSprites#getSprite} method.
 *  @function
 *  @param {string|*} [id=undefined] - The identifier of the sprite that we want to get.
 *  @param {*} [returnValueOnFail=undefined] - The value we want it to return in the case that no value is found. If not provided, undefined will be returned.
 *  @returns {CB_GraphicSprites.SPRITE_OBJECT|*} Returns a {@link CB_GraphicSprites.SPRITE_OBJECT} object if found or the value of "returnValueOnFail" otherwise.
 */
CB_GraphicSprites.prototype.getSpriteById = CB_GraphicSprites.prototype.getById = function(id, returnValueOnFail)
{
	var index = this.getSpriteIndexById(id);
	return index !== -1 ? this.spritesGroup.sprites[index] : returnValueOnFail;
}


/**
 * Alias for {@link CB_GraphicSprites#getSpriteIndexById}.
 *  @function CB_GraphicSprites#getIndexById
 *  @see {@link CB_GraphicSprites#getSpriteIndexById}
 */	
/**
 * Gets the index (the position in the {@link CB_GraphicSprites#spritesGroup.sprites} array) of a desired sprite by its identifier.
 *  @function
 *  @param {string|*} [id=undefined] - The identifier of the sprite whose index we want to get.
 *  @returns {integer} Returns the index (the position in the {@link CB_GraphicSprites#spritesGroup.sprites} array) of the desired sprite or -1 if not found.
 *  @todo Optimize it (perhaps using a cache matching the IDs with their position, maybe using the "position" or "positionByZIndex" properties).
 */
CB_GraphicSprites.prototype.getSpriteIndexById = CB_GraphicSprites.prototype.getIndexById = function(id)
{
	if (this.spritesGroup && this.spritesGroup.sprites)
	{
		var spritesLength = this.spritesGroup.sprites.length;
		for (var x = 0; x < spritesLength; x++)
		{
			if (this.spritesGroup.sprites[x].id === id) { return x; }
		}
	}
	return -1;
}


/**
 * Gets an array with all the {@link CB_GraphicSprites.SUBSPRITE_OBJECT} objects of a given {@link CB_GraphicSprites.SPRITE_OBJECT} object.
 *  @function
 *  @param {CB_GraphicSprites.SPRITE_OBJECT} [sprite=CB_GraphicSprites#getCurrent()] - The {@link CB_GraphicSprites.SPRITE_OBJECT} object which contains the sprite and its sub-sprites. If not provided, it will use the {@link CB_GraphicSprites.SPRITE_OBJECT} object which the pointer (set in the {@link CB_GraphicSprites#pointer} property) is currently pointing to (using the returning value of the {@link CB_GraphicSprites#getCurrent} method internally).
 *  @param {boolean} [orderedByZIndex=false] - If set to true, it will return the sub-sprites sorted by their z-index (ascending order).
 *  @param {*} [returnValueOnFail=undefined] - The value we want it to return in the case that no value is found. If not provided, undefined will be returned.
 *  @returns {array|*} Returns an array with all the {@link CB_GraphicSprites.SUBSPRITE_OBJECT} objects of the given {@link CB_GraphicSprites.SPRITE_OBJECT} object or the value of "returnValueOnFail" otherwise.
 */
CB_GraphicSprites.prototype.getSubSprites = function(sprite, orderedByZIndex, returnValueOnFail)
{
	sprite = sprite || this.getCurrent();
	
	if (sprite)
	{
		if (!orderedByZIndex)
		{
			return sprite.subSprites ? sprite.subSprites : returnValueOnFail;
		}
		else
		{
			return sprite.subSpritesByZIndex ? sprite.subSpritesByZIndex : returnValueOnFail;
		}
	}
	return returnValueOnFail;
}


/**
 * Gets a desired sub-sprite object through its index (its position in the array which is in the "subSprites" property of the given {@link CB_GraphicSprites.SPRITE_OBJECT} object). Faster than getting it through its identifier with the {@link CB_GraphicSprites#getSubSpriteById} method.
 *  @function
 *  @param {integer} [index=0] - The index where the desired sub-sprite must be located (its position in the array which is in the "subSprites" property of the given {@link CB_GraphicSprites.SPRITE_OBJECT} object).
 *  @param {CB_GraphicSprites.SPRITE_OBJECT} [sprite=CB_GraphicSprites#getCurrent()] - The {@link CB_GraphicSprites.SPRITE_OBJECT} object which contains the sprite and its sub-sprites. If not provided, it will use the {@link CB_GraphicSprites.SPRITE_OBJECT} object which the pointer (set in the {@link CB_GraphicSprites#pointer} property) is currently pointing to (using the returning value of the {@link CB_GraphicSprites#getCurrent} method internally).
 *  @param {*} [returnValueOnFail=undefined] - The value we want it to return in the case that no value is found. If not provided, undefined will be returned.
 *  @returns {CB_GraphicSprites.SUBSPRITE_OBJECT|*} Returns a {@link CB_GraphicSprites.SUBSPRITE_OBJECT} object if found or the value of "returnValueOnFail" otherwise.
 */
CB_GraphicSprites.prototype.getSubSprite = function(index, sprite, returnValueOnFail)
{
	index = parseInt(index);
	index = isNaN(index) ? 0 : index;
	if (index < 0) { index *= -1; } //It must be a positive integer.
	sprite = sprite || this.getCurrent();
	return sprite && sprite.subSprites && sprite.subSprites[index] ? sprite.subSprites[index] : returnValueOnFail;
}


/**
 * Gets a desired sub-sprite object through its identifier from the given {@link CB_GraphicSprites.SPRITE_OBJECT} object. Slower than getting it through its index with the {@link CB_GraphicSprites#getSubSprite} method.
 *  @function
 *  @param {string|*} [id=undefined] - The identifier of the sub-sprite that we want to get.
 *  @param {CB_GraphicSprites.SPRITE_OBJECT} [sprite=CB_GraphicSprites#getCurrent()] - The {@link CB_GraphicSprites.SPRITE_OBJECT} object which contains the sprite and its sub-sprites. If not provided, it will use the {@link CB_GraphicSprites.SPRITE_OBJECT} object which the pointer (set in the {@link CB_GraphicSprites#pointer} property) is currently pointing to (using the returning value of the {@link CB_GraphicSprites#getCurrent} method internally).
 *  @param {*} [returnValueOnFail=undefined] - The value we want it to return in the case that no value is found. If not provided, undefined will be returned.
 *  @returns {CB_GraphicSprites.SUBSPRITE_OBJECT|*} Returns a {@link CB_GraphicSprites.SUBSPRITE_OBJECT} object if found or the value of "returnValueOnFail" otherwise.
 */
CB_GraphicSprites.prototype.getSubSpriteById = function(id, sprite, returnValueOnFail)
{
	sprite = sprite || this.getCurrent();
	var index = this.getSubSpriteIndexById(id, sprite);
	return index !== -1 ? sprite.subSprites[index] : returnValueOnFail;
}


/**
 * Gets the index (its position in the array which is in the "subSprites" property of the given {@link CB_GraphicSprites.SPRITE_OBJECT} object) of a desired sub-sprite by its identifier.
 *  @function
 *  @param {string|*} [id=undefined] - The identifier of the sub-sprite whose index we want to get.
 *  @param {CB_GraphicSprites.SPRITE_OBJECT} [sprite=CB_GraphicSprites#getCurrent()] - The {@link CB_GraphicSprites.SPRITE_OBJECT} object which contains the sprite and its sub-sprites. If not provided, it will use the {@link CB_GraphicSprites.SPRITE_OBJECT} object which the pointer (set in the {@link CB_GraphicSprites#pointer} property) is currently pointing to (using the returning value of the {@link CB_GraphicSprites#getCurrent} method internally).
 *  @returns {integer} Returns the index (its position in the array which is in the "subSprites" property of the given {@link CB_GraphicSprites.SPRITE_OBJECT} object) of the desired sub-sprite or -1 if not found.
 *  @todo Optimize it (perhaps using a cache matching the IDs with their position, maybe using the "position" or "positionByZIndex" properties).
 */
CB_GraphicSprites.prototype.getSubSpriteIndexById = function(id, sprite)
{
	sprite = sprite || this.getCurrent();
	if (sprite && sprite.subSprites)
	{
		var subSpritesLength = sprite.subSprites.length;
		for (var x = 0; x < subSpritesLength; x++)
		{
			if (sprite.subSprites[x].id === id) { return x; }
		}
	}
	return -1;
}


/**
 * Alias for {@link CB_GraphicSprites#executeFunctionAll}.
 *  @function CB_GraphicSprites#executeAll
 *  @see {@link CB_GraphicSprites#executeFunctionAll}
 */	
 /**
 * Alias for {@link CB_GraphicSprites#executeFunctionAll}.
 *  @function CB_GraphicSprites#forEach
 *  @see {@link CB_GraphicSprites#executeFunctionAll}
 */	
 /**
 * Alias for {@link CB_GraphicSprites#executeFunctionAll}.
 *  @function CB_GraphicSprites#forEachSprite
 *  @see {@link CB_GraphicSprites#executeFunctionAll}
 */	
 /**
 * Performs a desired action, using the provided function, on all the existing sprites ({@link CB_GraphicSprites.SPRITE_OBJECT} objects) or on the desired ones (if provided). Calls the {@link CB_Arrays.executeFunctionAll} function internally and returns its returning value.
 *  @function
 *  @param {CB_Arrays.executeFunctionAll_ON_LOOP_CALLBACK} functionEach - Function that will be called for each sprite ({@link CB_GraphicSprites.SPRITE_OBJECT} object). As the first parameter it receives the {@link CB_GraphicSprites.SPRITE_OBJECT} object of the "sprites" being looped, as the second parameter the position of this {@link CB_GraphicSprites.SPRITE_OBJECT} object in the "sprites" array provided (or, if not provided, in the array returned by the {@link CB_GraphicSprites#getSprites} method), the third parameter is the array being looped and the fourth parameter will be the "delayBetweenEach" being used, being "this" the {@link CB_GraphicSprites.SPRITE_OBJECT} object itself.
 *  @param {boolean} [orderedByZIndex=false] - If set to true, it will loop the sprites sorted by their z-index (ascending order).
 *  @param {number|CB_Arrays.executeFunctionAll_ON_LOOP_CALLBACK} [delayBetweenEach=0] - If a value greater than zero is used, it will be used as the delay desired between each call to the "functionEach" function (calling them using the [setTimeout]{@link https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout} function internally). If not provided or the value is 0 (zero) or lower, each call to the "functionEach" function will be performed immediately one after the other. If a function is provided, it will be called with the same parameters as the "functionEach" function and its returning value will be used as the delay (executed every loop for each {@link CB_GraphicSprites.SPRITE_OBJECT} object).
 *  @param {array} [sprites={@link CB_GraphicSprites#getSprites}()] - A numeric array containing the sprites ({@link CB_GraphicSprites.SPRITE_OBJECT} objects) that we want to loop. It should contain only {@link CB_GraphicSprites.SPRITE_OBJECT} objects which are already in the current {@link CB_GraphicSprites} object. If not provided, it will use all the {@link CB_GraphicSprites.SPRITE_OBJECT} objects contained in the {@link CB_GraphicSprites} object.
 *  @param {boolean} [returnSetTimeoutsArray=false] - Defines whether we want the method to return an integer or a numeric array with information of each [setTimeout]{@link https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout} call. Returning an array with information of each [setTimeout]{@link https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout} call is only useful when the [setTimeout]{@link https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout} function is called internally, which happens when the "delayBetweenEach" parameter is greater than 0 (zero).
 *  @param {boolean} [delayBetweenEachAffectsFirst=false] - If set to true, the desired delay (if any) will also affect the first call to the "functionEach" function.
 *  @param {CB_Arrays.executeFunctionAll_ON_FINISH_CALLBACK} [functionFinish] - Function that will be called for when it has finished looping all the items. The first parameter will be the array which was looped, the second parameter will be the number of times that the "functionEach" callback was called (the most likely, matches the number of elements unless they are undefined or null), and the third parameter will be the maximum "delay" used, being "this" the array itself.
 *  @returns {integer|array} If the "returnSetTimeoutsArray" parameter is set to false, it will return the number of calls to the "functionEach" function that were performed (which should be the same number as the {@link CB_GraphicSprites.SPRITE_OBJECT} objects given in the "sprites" parameter). Otherwise, if the "returnSetTimeoutsArray" is set to true, it will return a numeric array with a {@link CB_Arrays.executeFunctionAll_OBJECT} object for each {@link CB_GraphicSprites.SPRITE_OBJECT} given. The length of this array will also be the number of calls to the "functionEach" function that were performed. Note that if a value greater than 0 (zero) for the "delayBetweenEach" parameter has been provided, perhaps not all calls of the "functionEach" function will have been performed yet when exiting this method because of the asynchronous nature of the [setTimeout]{@link https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout} function.
 *  @todo Think about only allowing {@link CB_GraphicSprites.SPRITE_OBJECT} objects (in the "sprites" parameter) which are already in the {@link CB_GraphicSprites} (identify them by their ID), to avoid problems.
 */
CB_GraphicSprites.prototype.executeFunctionAll = CB_GraphicSprites.prototype.executeAll = CB_GraphicSprites.prototype.forEachSprite = CB_GraphicSprites.prototype.forEach = function(functionEach, orderedByZIndex, delayBetweenEach, sprites, returnSetTimeoutsArray, delayBetweenEachAffectsFirst, functionFinish)
{
	return CB_Arrays.executeFunctionAll(CB_isArray(sprites) ? sprites : this.getSprites(orderedByZIndex, []), functionEach, delayBetweenEach, returnSetTimeoutsArray, delayBetweenEachAffectsFirst, functionFinish);
}


/**
 * Alias for {@link CB_AudioFileSpritesPool#executeFunctionAllSubSprites}.
 *  @function CB_AudioFileSpritesPool#executeAllSubSprites
 *  @see {@link CB_AudioFileSpritesPool#executeFunctionAllSubSprites}
 */	
 /**
 * Alias for {@link CB_AudioFileSpritesPool#executeFunctionAllSubSprites}.
 *  @function CB_AudioFileSpritesPool#forEachSubSprite
 *  @see {@link CB_AudioFileSpritesPool#executeFunctionAllSubSprites}
 */
 /**
 * Performs a desired action, using the provided function, on all the existing sub-sprites ({@link CB_GraphicSprites.SUBSPRITE_OBJECT} objects) from a given sprite ({@link CB_GraphicSprites.SPRITE_OBJECT} object). Calls the {@link CB_Arrays.executeFunctionAll} function internally and returns its returning value.
 *  @function
 *  @param {CB_Arrays.executeFunctionAll_ON_LOOP_CALLBACK} functionEach - Function that will be called for each sub-sprite ({@link CB_GraphicSprites.SUBSPRITE_OBJECT} object) from the given sprite ({@link CB_GraphicSprites.SPRITE_OBJECT} object). As the first parameter it receives the {@link CB_GraphicSprites.SUBSPRITE_OBJECT} object of the sub-sprites being looped, as the second parameter the position of this {@link CB_GraphicSprites.SUBSPRITE_OBJECT} object in the "subSprites" property of the sprite ({@link CB_GraphicSprites.SPRITE_OBJECT} object) provided (which is an array), the third parameter is the array being looped and the fourth parameter will be the "delayBetweenEach" being used, being "this" the {@link CB_GraphicSprites.SUBSPRITE_OBJECT} object itself.
 *  @param {boolean} [orderedByZIndex=false] - If set to true, it will loop the sub-sprites sorted by their z-index (ascending order).
 *  @param {number|CB_Arrays.executeFunctionAll_ON_LOOP_CALLBACK} [delayBetweenEach=0] - If a value greater than zero is used, it will be used as the delay desired between each call to the "functionEach" function (calling them using the [setTimeout]{@link https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout} function internally). If not provided or the value is 0 (zero) or lower, each call to the "functionEach" function will be performed immediately one after the other. If a function is provided, it will be called with the same parameters as the "functionEach" function and its returning value will be used as the delay (executed every loop for each {@link CB_GraphicSprites.SUBSPRITE_OBJECT} object).
 *  @param {CB_GraphicSprites.SPRITE_OBJECT} [sprite=CB_GraphicSprites#getCurrent()] - The {@link CB_GraphicSprites.SPRITE_OBJECT} object which contains the sprite and its sub-sprites. If not provided, it will use the {@link CB_GraphicSprites.SPRITE_OBJECT} object which the pointer (set in the {@link CB_GraphicSprites#pointer} property) is currently pointing to (using the returning value of the {@link CB_GraphicSprites#getCurrent} method internally).
 *  @param {boolean} [returnSetTimeoutsArray=false] - Defines whether we want the method to return an integer or a numeric array with information of each [setTimeout]{@link https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout} call. Returning an array with information of each [setTimeout]{@link https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout} call is only useful when the [setTimeout]{@link https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout} function is called internally, which happens when the "delayBetweenEach" parameter is greater than 0 (zero).
 *  @param {boolean} [delayBetweenEachAffectsFirst=false] - If set to true, the desired delay (if any) will also affect the first call to the "functionEach" function.
 *  @param {CB_Arrays.executeFunctionAll_ON_FINISH_CALLBACK} [functionFinish] - Function that will be called for when it has finished looping all the items. The first parameter will be the array which was looped, the second parameter will be the number of times that the "functionEach" callback was called (the most likely, matches the number of elements unless they are undefined or null), and the third parameter will be the maximum "delay" used, being "this" the array itself.
 *  @returns {integer|array} If the "returnSetTimeoutsArray" parameter is set to false, it will return the number of calls to the "functionEach" function that were performed (which should be the same number as the existing {@link CB_GraphicSprites.SUBSPRITE_OBJECT} objects in the given {@link CB_GraphicSprites.SPRITE_OBJECT} object). Otherwise, if the "returnSetTimeoutsArray" is set to true, it will return a numeric array with a {@link CB_Arrays.executeFunctionAll_OBJECT} object for each {@link CB_GraphicSprites.SUBSPRITE_OBJECT}. The length of this array will also be the number of calls to the "functionEach" function that were performed. Note that if a value greater than 0 (zero) for the "delayBetweenEach" parameter has been provided, perhaps not all calls of the "functionEach" function will have been performed yet when exiting this method because of the asynchronous nature of the [setTimeout]{@link https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout} function.
 *  @todo Think about only allowing {@link CB_GraphicSprites.SPRITE_OBJECT} objects (in the "sprite" parameter) which are already in the {@link CB_GraphicSprites.SPRITE_OBJECT} (identify them by their ID), to avoid problems.
 */
CB_GraphicSprites.prototype.executeFunctionAllSubSprites = CB_GraphicSprites.prototype.executeAllSubSprites = CB_GraphicSprites.prototype.forEachSubSprite = function(functionEach, orderedByZIndex, delayBetweenEach, sprite, returnSetTimeoutsArray, delayBetweenEachAffectsFirst, functionFinish)
{
	return CB_Arrays.executeFunctionAll(this.getSubSprites(sprite, orderedByZIndex, []), functionEach, delayBetweenEach, returnSetTimeoutsArray, delayBetweenEachAffectsFirst, functionFinish);
}


/**
 * Alias for {@link CB_GraphicSprites#getPointerPrevious}.
 *  @function CB_GraphicSprites#getPreviousPosition
 *  @see {@link CB_GraphicSprites#getPointerPrevious}
 */
/**
 * Gets the previous position of the pointer. It belongs to an index of the {@link CB_GraphicSprites#spritesGroup.sprites} array where a {@link CB_GraphicSprites.SPRITE_OBJECT} object is placed (containing a sprite). Internally, it uses the {@link CB_GraphicSprites#pointerPrevious} property.
 *  @function
 *  @returns {integer} Returns the position where the pointer was previously pointing to. It belongs to an index of the {@link CB_GraphicSprites#spritesGroup.sprites} array where a {@link CB_GraphicSprites.SPRITE_OBJECT} object is placed (containing a sprite). If not found, returns -1 by default.
 */
CB_GraphicSprites.prototype.getPointerPrevious = CB_GraphicSprites.prototype.getPreviousPosition = function()
{
	return this.pointerPrevious === 0 || parseInt(this.pointerPrevious) && this.pointerPrevious > 0 ? this.pointerPrevious : -1;
}


/**
 * Alias for {@link CB_GraphicSprites#getPointer}.
 *  @function CB_GraphicSprites#getCurrentPosition
 *  @see {@link CB_GraphicSprites#getPointer}
 */
/**
 * Gets the current position of the pointer. It belongs to an index of the {@link CB_GraphicSprites#spritesGroup.sprites} array where a {@link CB_GraphicSprites.SPRITE_OBJECT} object is placed (containing a sprite). Internally, it uses the {@link CB_GraphicSprites#pointer} property.
 *  @function
 *  @returns {integer} Returns the position where the pointer is currently pointing to. It belongs to an index of the {@link CB_GraphicSprites#spritesGroup.sprites} array where a {@link CB_GraphicSprites.SPRITE_OBJECT} object is placed (containing a sprite). If not found, returns zero (0) by default.
 */
CB_GraphicSprites.prototype.getPointer = CB_GraphicSprites.prototype.getCurrentPosition = function()
{
	return parseInt(this.pointer) && this.pointer > 0 ? this.pointer : 0;
}


/**
 * Alias for {@link CB_GraphicSprites#setPointer}.
 *  @function CB_GraphicSprites#setCurrentPosition
 *  @see {@link CB_GraphicSprites#setPointer}
 */
/**
 * Sets the pointer to the desired position (if possible). The position should belong to an index of the {@link CB_GraphicSprites#spritesGroup.sprites} array where a {@link CB_GraphicSprites.SPRITE_OBJECT} object is placed (containing a sprite). Internally, it modifies the {@link CB_GraphicSprites#pointer} property (if possible). If the position was updated, it will also reset the {@link CB_GraphicSprites#time} property (setting the current time in milliseconds).
 *  @function
 *  @param {integer} [position=0|CB_GraphicSprites#spritesGroup.sprites.length-1|position%CB_GraphicSprites#spritesGroup.sprites.length] - The position that we want the pointer to use. The position should belong to an index of the {@link CB_GraphicSprites#spritesGroup.sprites} array where a {@link CB_GraphicSprites.SPRITE_OBJECT} object is placed (containing a sprite).
 *  @param {boolean} [loop=false] - If set to false and the "position" given is greater than the current number of sprites, the "position" used will be the one which belongs to the last sprite. If set to false and the "position" given is lower than zero, the "position" used will be zero (the first position). Otherwise, if set to true and the "position" given is greater than the current number of sprites or lower than zero, it will modify the given "position" making it cycle (from the end to the beginning) treating always the "position" as a positive number. This parameter is ignored when the given "position" has not reached the limit.
 *  @returns {integer} Returns the position where the pointer is currently pointing to. It belongs to an index of the {@link CB_GraphicSprites#spritesGroup.sprites} array where a {@link CB_GraphicSprites.SPRITE_OBJECT} object is placed (containing a sprite).
 */
CB_GraphicSprites.prototype.setPointer = CB_GraphicSprites.prototype.setCurrentPosition = function(position, loop)
{
	if (this.spritesGroup && this.spritesGroup.sprites && this.spritesGroup.sprites.length)
	{
		position = position || 0;
		if (loop)
		{
			if (position < 0) { position = position * -1; } //Converts it to a positive number.
			position %= this.spritesGroup.sprites.length;
		}
		else if (position < 0) { position = 0; }
		else if (position >= this.spritesGroup.sprites.length) { position = this.spritesGroup.sprites.length - 1; }
		if (this.pointer !== position) { this.pointerPrevious = this.pointer; this.pointer = position; this.setTime(undefined, true, true); } //Updates the pointer and "resets" the time.
	}
	return this.pointer || 0;
}


/**
 * Gets the sprite (a {@link CB_GraphicSprites.SPRITE_OBJECT} object) which was previously pointed (by the previous value of the pointer set in the {@link CB_GraphicSprites#pointer} property, whose value is now in the {@link CB_GraphicSprites#pointerPrevious} property).
 *  @function
 *  @returns {CB_GraphicSprites.SPRITE_OBJECT|null} Returns the {@link CB_GraphicSprites.SPRITE_OBJECT} object which was previously pointed by the pointer (by the previous value of the pointer set in the {@link CB_GraphicSprites#pointer} property, whose value is now in the {@link CB_GraphicSprites#pointerPrevious} property). Returns null if not found.
 */
CB_GraphicSprites.prototype.getPrevious = function()
{
	if (this.pointerPrevious === 0 || parseInt(this.pointerPrevious) && this.pointerPrevious > 0) { return this.getSprite(this.pointerPrevious, null); }
	else { return null; }
}


/**
 * Alias for {@link CB_GraphicSprites#getCurrent}.
 *  @function CB_GraphicSprites#now
 *  @see {@link CB_GraphicSprites#getCurrent}
 */	
/**
 * Alias for {@link CB_GraphicSprites#getCurrent}.
 *  @function CB_GraphicSprites#current
 *  @see {@link CB_GraphicSprites#getCurrent}
 */	
/**
 * Gets the sprite (a {@link CB_GraphicSprites.SPRITE_OBJECT} object) which is being currently pointed (by the pointer set in the {@link CB_GraphicSprites#pointer} property).
 *  @function
 *  @returns {CB_GraphicSprites.SPRITE_OBJECT|null} Returns the {@link CB_GraphicSprites.SPRITE_OBJECT} object which is currently pointed by the pointer (set in the {@link CB_GraphicSprites#pointer} property). Returns null if not found.
 */
CB_GraphicSprites.prototype.getCurrent = CB_GraphicSprites.prototype.current = CB_GraphicSprites.prototype.now = function()
{
	return this.getSprite(this.getPointer(), null);
}


/**
 * Alias for {@link CB_GraphicSprites#setPrevious}.
 *  @function CB_GraphicSprites#previous
 *  @see {@link CB_GraphicSprites#setPrevious}
 */
/**
 * Makes the pointer to go back to the previous position (if possible) and returns the sprite located there (if any). The position should belong to an index of the {@link CB_GraphicSprites#spritesGroup.sprites} array where a {@link CB_GraphicSprites.SPRITE_OBJECT} object is placed (containing a sprite) and it will be returned if found. Internally, it modifies the {@link CB_GraphicSprites#pointer} property (if possible). If the position was updated, it will update also the {@link CB_GraphicSprites#time} property (setting the current time in milliseconds).
 *  @function
 *  @param {boolean} [loop=false] - If set to false and the previous position is lower than zero, it will return null. Otherwise, if set to true and the position is lower than zero, it will modify the position making it cycle (from the beginning to the end). This parameter is ignored when the position has not reached the limit.
 *  @returns {CB_GraphicSprites.SPRITE_OBJECT|null} Makes it to point to the previous {@link CB_GraphicSprites.SPRITE_OBJECT} object (making it the current one) and returns it. Returns null if it cannot be found.
 */
CB_GraphicSprites.prototype.setPrevious = CB_GraphicSprites.prototype.previous = function(loop)
{
	var pointer = this.getPointer() - 1;
	if (pointer < 0)
	{
		if (loop && this.spritesGroup && this.spritesGroup.sprites && this.spritesGroup.sprites.length) { pointer = this.spritesGroup.sprites.length + pointer; }
		else { return null; }
	}
	var sprite = this.getSprite(pointer, null);
	if (sprite !== null && this.pointer !== pointer) { this.pointerPrevious = this.pointer; this.pointer = pointer; this.setTime(undefined, true, true); } //Updates the pointer and "resets" the time.
	return sprite;
}


/**
 * Alias for {@link CB_GraphicSprites#setNext}.
 *  @function CB_GraphicSprites#next
 *  @see {@link CB_GraphicSprites#setNext}
 */
/**
 * Makes the pointer to advance to the next position (if possible) and returns the sprite located there (if any). The position should belong to an index of the {@link CB_GraphicSprites#spritesGroup.sprites} array where a {@link CB_GraphicSprites.SPRITE_OBJECT} object is placed (containing a sprite) and it will be returned if found. Internally, it modifies the {@link CB_GraphicSprites#pointer} property (if possible). If the position was updated, it will also update the {@link CB_GraphicSprites#time} property (setting the current time in milliseconds).
 *  @function
 *  @param {boolean} [loop=false] - If set to false and the next position is greater than the current number of sprites, it will return null. Otherwise, if set to true and the position is greater than the current number of sprites, it will modify the position making it cycle (from the end to the beginning). This parameter is ignored when the position has not reached the limit.
 *  @returns {CB_GraphicSprites.SPRITE_OBJECT|null} Makes it to point to the next {@link CB_GraphicSprites.SPRITE_OBJECT} object (making it the current one) and returns it. Returns null if it cannot be found.
 */
CB_GraphicSprites.prototype.setNext = CB_GraphicSprites.prototype.next = function(loop)
{
	var pointer = this.getPointer() + 1;
	if (loop && this.spritesGroup && this.spritesGroup.sprites && this.spritesGroup.sprites.length) { pointer %= this.spritesGroup.sprites.length; }
	var sprite = this.getSprite(pointer, null);
	if (sprite !== null && this.pointer !== pointer) { this.pointerPrevious = this.pointer; this.pointer = pointer; this.setTime(undefined, true, true); } //Updates the pointer and "resets" the time.
	return sprite;
}


/**
 * Gets the z-index ("zIndex" property) of the sprites group object (and the {@CB_GraphicSprites} object itself).
 *  @function
 *  @param {*} [returnValueOnFail=undefined] - The value we want it to return in the case that no value is found. If not provided, undefined will be returned.
 *  @returns {number} Returns the z-index ("zIndex") of the sprites group object (and the {@CB_GraphicSprites} object itself). If not found, returns the value of the {@link CB_GraphicSprites.ZINDEX_DEFAULT} property of evaluates to true or "returnValueOnFail" otherwise.
 */
CB_GraphicSprites.prototype.getZIndex = function(returnValueOnFail)
{
	return parseFloat(this.zIndex) || CB_GraphicSprites.ZINDEX_DEFAULT || returnValueOnFail;
}


/**
 * Sets the desired z-index ("zIndex" property) of the sprites group object (and the {@CB_GraphicSprites} object itself). If there is a {@link CB_GraphicSpritesScene} parent object (set in the {@link CB_GraphicSprites.parent} property), it will also call its {@link CB_GraphicSpritesScene#updateGraphicSpritesByZIndex} method internally.
 *  @function
 *  @param {number} [zIndex=parseFloat(zIndex)||CB_GraphicSprites.ZINDEX_DEFAULT||1] - The z-index value we want. It must be a number but never zero (0). If no valid number is given, it will use the value of the {@link CB_GraphicSprites.ZINDEX_DEFAULT} property of evaluates to true or 1 otherwise.
 *  @returns {number} Returns the z-index ("zIndex") of the sprites group object (and the {@CB_GraphicSprites} object itself) after setting it  (it could have been sanitized).
 */
CB_GraphicSprites.prototype.setZIndex = function(zIndex)
{
	this.zIndex = parseFloat(zIndex) || CB_GraphicSprites.ZINDEX_DEFAULT || 1;
	if (this.spritesGroup) { this.spritesGroup.zIndex = this.zIndex; }
	
	//If there is a parent (CB_GraphicSpritesScene object), updates the array with its CB_GraphicSprites ordered by z-index:
	if (this.parent && typeof(this.parent.updateGraphicSpritesByZIndex) === "function") { this.parent.updateGraphicSpritesByZIndex.call(this.parent); }
	
	return this.zIndex;
}


/**
 * Gets the z-index ("zIndex" property) of a given sprite object.
 *  @function
 *  @param {CB_GraphicSprites.SPRITE_OBJECT} [sprite=CB_GraphicSprites#getCurrent()] - The {@link CB_GraphicSprites.SPRITE_OBJECT} object which contains the sprite. If not provided, it will use the {@link CB_GraphicSprites.SPRITE_OBJECT} object which the pointer (set in the {@link CB_GraphicSprites#pointer} property) is currently pointing to (using the returning value of the {@link CB_GraphicSprites#getCurrent} method internally).
 *  @param {*} [returnValueOnFail=undefined] - The value we want it to return in the case that no value is found. If not provided, undefined will be returned.
 *  @returns {number} Returns the z-index ("zIndex") of the given sprite. If not found, returns the value of the {@link CB_GraphicSprites.ZINDEX_DEFAULT} property of evaluates to true or "returnValueOnFail" otherwise.
 */
CB_GraphicSprites.prototype.getZIndexSprite = function(sprite, returnValueOnFail)
{
	sprite = sprite || this.getCurrent();
	return sprite && parseFloat(sprite.zIndex) ? sprite.zIndex : CB_GraphicSprites.ZINDEX_DEFAULT || returnValueOnFail;
}


/**
 * Sets the desired z-index ("zIndex") of the given sprite object. Calls the {@link CB_GraphicSprites#updateSpritesByZIndex} method internally.
 *  @function
 *  @param {CB_GraphicSprites.SPRITE_OBJECT} [sprite=CB_GraphicSprites#getCurrent()] - The {@link CB_GraphicSprites.SPRITE_OBJECT} object which contains the sprite. If not provided, it will use the {@link CB_GraphicSprites.SPRITE_OBJECT} object which the pointer (set in the {@link CB_GraphicSprites#pointer} property) is currently pointing to (using the returning value of the {@link CB_GraphicSprites#getCurrent} method internally).
 *  @param {number} [zIndex=parseFloat(zIndex)||CB_GraphicSprites.ZINDEX_DEFAULT||1] - The z-index value we want. It must be a number but never zero (0). If no valid number is given, it will use the value of the {@link CB_GraphicSprites.ZINDEX_DEFAULT} property of evaluates to true or 1 otherwise.
 *  @returns {number} Returns the z-index ("zIndex") of the given sprite after setting it (it could have been sanitized).
 */
CB_GraphicSprites.prototype.setZIndexSprite = function(sprite, zIndex)
{
	sprite = sprite || this.getCurrent();
	if (sprite && sprite.parent)
	{
		sprite.zIndex = parseFloat(zIndex) || CB_GraphicSprites.ZINDEX_DEFAULT || 1;

		//Updates the array with the sprites ordered by z-index:
		this.updateSpritesByZIndex();
	}
	return sprite.zIndex;
}


/**
 * Gets the z-index ("zIndex" property) of a given sub-sprite object.
 *  @function
 *  @param {CB_GraphicSprites.SUBSPRITE_OBJECT} subSprite - The {@link CB_GraphicSprites.SUBSPRITE_OBJECT} object which contains the sub-sprite.
 *  @param {*} [returnValueOnFail=undefined] - The value we want it to return in the case that no value is found. If not provided, undefined will be returned.
 *  @returns {number} Returns the z-index ("zIndex") of the given sub-sprite. If not found, returns the value of the {@link CB_GraphicSprites.ZINDEX_DEFAULT} property of evaluates to true or "returnValueOnFail" otherwise.
 */
CB_GraphicSprites.prototype.getZIndexSubSprite = function(subSprite, returnValueOnFail)
{
	return subSprite && parseFloat(subSprite.zIndex) ? subSprite.zIndex : CB_GraphicSprites.ZINDEX_DEFAULT || returnValueOnFail;
}


/**
 * Sets the desired z-index ("zIndex") of the given sub-sprite object. Calls the {@link CB_GraphicSprites#updateSubSpritesByZIndex} method internally.
 *  @function
 *  @param {CB_GraphicSprites.SUBSPRITE_OBJECT} sprite - The {@link CB_GraphicSprites.SUBSPRITE_OBJECT} object which contains the sub-sprite.
 *  @param {number} [zIndex=parseFloat(zIndex)||CB_GraphicSprites.ZINDEX_DEFAULT||0] - The z-index value we want. It must be a number but never zero (0). If no valid number is given, it will use the value of the {@link CB_GraphicSprites.ZINDEX_DEFAULT} property of evaluates to true or 1 otherwise.
 *  @returns {number} Returns the z-index ("zIndex") of the given sub-sprite after setting it (it could have been sanitized).
 */
CB_GraphicSprites.prototype.setZIndexSubSprite = function(subSprite, zIndex)
{
	if (subSprite && subSprite.parent)
	{
		subSprite.zIndex = parseFloat(zIndex) || CB_GraphicSprites.ZINDEX_DEFAULT || 1;
	
		//Updates the array with the sub-sprites ordered by z-index:
		this.updateSubSpritesByZIndex(subSprite.parent);
	}
	return subSprite.zIndex;
}


/**
 * Tells whether the sprites group object (and the {@CB_GraphicSprites} object itself) is disabled or not. Internally, it checks the "{@link CB_GraphicSprites.spritesGroup}.disabled" property.
 *  @function
 *  @returns {boolean} Returns whether the sprites group object (and the {@link CB_GraphicSprites} object itself) is disabled or not.
 */
CB_GraphicSprites.prototype.isDisabled = function()
{
	return !!this.getSpritesGroup({}).disabled;
}


/**
 * Sets whether the sprites group object (and the {@CB_GraphicSprites} object itself) is disabled or enabled. Internally, it edits the "{@link CB_GraphicSprites.spritesGroup}.disabled" property.
 *  @function
 *  @param {boolean} [disabled=false] - Set to true to disable it or false to enable it.
 *  @param {boolean} [affectChildren=disabled] - If this parameter is set to true, it will also modify the "disabled" property of all the sprites and their sub-sprites. By default, it is false if the "disabled" parameter is set to false or it is true otherwise.
 */
CB_GraphicSprites.prototype.setDisabled = function(disabled, affectChildren)
{
	disabled = !!disabled;
	if (typeof(affectChildren) === "undefined" || affectChildren === null) { affectChildren = disabled; }
	this.spritesGroup = this.spritesGroup || {};
	this.spritesGroup.disabled = disabled;
	if (affectChildren)
	{
		this.executeFunctionAll(function() { if (this.setDisabled && typeof(this.setDisabled) === "function") { this.setDisabled(disabled, true, false, false); } });
	}
}



/**
 * Tells whether the given sprite is disabled or not. Internally, it checks its "disabled" property and also the "{@link CB_GraphicSprites.spritesGroup}.disabled" property (calling the {@link CB_GraphicSprites#isDisabled} method internally). A sprite is considered disabled if its sprites group parent is also disabled.
 *  @function
 *  @param {CB_GraphicSprites.SPRITE_OBJECT} [sprite=CB_GraphicSprites#getCurrent()] - The {@link CB_GraphicSprites.SPRITE_OBJECT} object which contains the sprite. If not provided, it will use the {@link CB_GraphicSprites.SPRITE_OBJECT} object which the pointer (set in the {@link CB_GraphicSprites#pointer} property) is currently pointing to (using the returning value of the {@link CB_GraphicSprites#getCurrent} method internally).
 *  @returns {boolean} Returns whether the sprite is disabled or not. A sprite is considered disabled if its sprites group parent is also disabled.
 */
CB_GraphicSprites.prototype.isDisabledSprite = function(sprite)
{
	sprite = sprite || this.getCurrent() || {};
	return !!sprite.disabled || this.isDisabled();
}


/**
 * Sets a given sprite disabled or enabled. Internally, it edits its "disabled" property.
 *  @function
 *  @param {CB_GraphicSprites.SPRITE_OBJECT} [sprite=CB_GraphicSprites#getCurrent()] - The {@link CB_GraphicSprites.SPRITE_OBJECT} object which contains the sprite. If not provided, it will use the {@link CB_GraphicSprites.SPRITE_OBJECT} object which the pointer (set in the {@link CB_GraphicSprites#pointer} property) is currently pointing to (using the returning value of the {@link CB_GraphicSprites#getCurrent} method internally).
 *  @param {boolean} [disabled=false] - Set to true to disable it or false to enable it.
 *  @param {boolean} [affectSubSprites=disabled] - If this parameter is set to true, it will also modify the "disabled" property of all the sub-sprites of the given sprite. This parameter will be ignored if the "affectParent" parameter is set to true (as all existing sprites and sub-sprites in the {@link CB_GraphicSprites} object will be affected anyway). By default, it is false if the "disabled" parameter is set to false or it is true otherwise.
 *  @param {boolean} [affectParent=affectParentChildren|!disabled] - If this parameter is set to true, it will also modify the "disabled" property of the sprites group object (which is considered the status of the whole {@CB_GraphicSprites} object). By default, it is true if either the "affectParentChildren" parameter is set to true or the "disabled" parameter is set to false and it is false otherwise.
 *  @param {boolean} [affectParentChildren=!disabled] - Defines whether to also affect the sprites and sub-sprites of the sprites group object (which is considered the status of the whole {@CB_GraphicSprites} object) or not. If it is set to true and the "affectParent" is also set to true, it will also modify the "disabled" property of all the existing sprites and sub-sprites in the {@link CB_GraphicSprites} object. This parameter is ignored if the "affectParent" parameter is set to false. By default, it is false if the "disabled" parameter is set to true or it is false otherwise.
 */
CB_GraphicSprites.prototype.setDisabledSprite = function(sprite, disabled, affectSubSprites, affectParent, affectParentChildren)
{
	disabled = !!disabled;
	if (typeof(affectParentChildren) === "undefined" || affectParentChildren === null) { affectParentChildren = !disabled; }
	if (typeof(affectParent) === "undefined" || affectParent === null) { affectParent = affectParentChildren || !disabled; }
	sprite = sprite || this.getCurrent();
	
	if (sprite)
	{
		sprite.disabled = disabled;
		if (typeof(affectSubSprites) === "undefined" || affectSubSprites === null) { affectSubSprites = disabled; }
		if (affectSubSprites)
		{
			if (typeof(sprite.executeFunctionAll) === "function")
			{
				sprite.executeFunctionAll(function() { if (this.setDisabled && typeof(this.setDisabled) === "function") { this.setDisabled(disabled, false, false); } });
			}
		}

		if (affectParent && sprite && sprite.parent)
		{
			return this.setDisabled(disabled, affectParentChildren); //Disables/enables the sprites group parent (and also its children).
		}
	}
}


/**
 * Tells whether the given sub-sprite is disabled or not. Internally, it checks its "disabled" property and also whether its sprite parent is disabled (calling the {@link CB_GraphicSprites#isDisabledSprite} method internally, for its sprite parent). A sub-sprite is considered disabled if its sprite parent is disabled (a sprite is considered disabled if its sprites group parent is also disabled).
 *  @function
 *  @param {CB_GraphicSprites.SUBSPRITE_OBJECT} subSprite - The {@link CB_GraphicSprites.SUBSPRITE_OBJECT} object which contains the sub-sprite.
 *  @returns {boolean} Returns whether the sub-sprite is disabled or not. A sub-sprite is considered disabled if its sprite parent is disabled (a sprite is considered disabled if its sprites group parent is also disabled).
 */
CB_GraphicSprites.prototype.isDisabledSubSprite = function(subSprite)
{
	subSprite = subSprite || {};
	return !!subSprite.disabled || this.isDisabledSprite(subSprite.parent || {});
}


/**
 * Sets a given sub-sprite disabled or enabled. Internally, it edits its "disabled" property.
 *  @function
 *  @param {CB_GraphicSprites.SUBSPRITE_OBJECT} subSprite - The {@link CB_GraphicSprites.SUBSPRITE_OBJECT} object which contains the sub-sprite.
 *  @param {boolean} [disabled=false] - Set to true to disable it or false to enable it.
 *  @param {boolean} [affectParents=affectParentsChildren|!disabled] - If this parameter is set to true, it will also modify the "disabled" property of the sprite parent and of the sprites group object (which is considered the status of the whole {@CB_GraphicSprites} object). By default, it is true if either the "affectParentChildren" parameter is set to true or the "disabled" parameter is set to false and it is false otherwise.
 *  @param {boolean} [affectParentsChildren=!disabled] - Defines whether to also affect the sprites and sub-sprites of the sprite parent and its sprites group object (which is considered the status of the whole {@CB_GraphicSprites} object) or not. If it is set to true and the "affectParents" is also set to true, it will also modify the "disabled" property of all the existing sprites and sub-sprites in the {@link CB_GraphicSprites} object. This parameter is ignored if the "affectParents" parameter is set to false. By default, it is false if the "disabled" parameter is set to true or it is false otherwise.
 */
CB_GraphicSprites.prototype.setDisabledSubSprite = function(subSprite, disabled, affectParents, affectParentsChildren)
{
	disabled = !!disabled;
	if (typeof(affectParentsChildren) === "undefined" || affectParentsChildren === null) { affectParentsChildren = !disabled; }
	if (typeof(affectParents) === "undefined" || affectParents === null) { affectParents = affectParentsChildren || !disabled; }
	if (subSprite)
	{
		subSprite.disabled = disabled;
		if (affectParents && subSprite.parent)
		{
			return this.setDisabledSprite(subSprite.parent, disabled, affectParentsChildren, true, affectParentsChildren);
		}
	}
}


/**
 * Sets (updates) the time in milliseconds when the current sprite or a sub-sprite started being pointed.
 *  @function
 *  @param {number} [time=CB_Device.getTiming()] - The time that we want to set, in milliseconds (time elapsed since the [time origin]{@link https://developer.mozilla.org/en-US/docs/Web/API/DOMHighResTimeStamp#The_time_origin} which can be obtained calling the {@link CB_Device.getTiming} function). It must be a positive number (or zero). If not provided, it will use the current time (by calling the {@link CB_Device.getTiming} function internally).
 *  @param {boolean} [updateTimeCurrentSprite=false] - If set to true, it will also update the "time" property of the {@link CB_GraphicSprites.SPRITE_OBJECT} object which is currently pointed by the pointer (set in the {@link CB_GraphicSprites#pointer} property).
 *  @param {boolean} [updateTimeCurrentSpriteSubSprites=false] - If set to true and the "updateTimeCurrentSprite" is set to true, it will also update the "time" property of the {@link CB_GraphicSprites.SUBSPRITE_OBJECT} objects that belong to the sprite which is currently pointed by the pointer (set in the {@link CB_GraphicSprites#pointer} property). This parameter is ignored if the "updateTimeCurrentSprite" parameter is set to false.
 *  @returns {number} Returns the time in milliseconds when the current sprite or a sub-sprite started being pointed (time elapsed since the [time origin]{@link https://developer.mozilla.org/en-US/docs/Web/API/DOMHighResTimeStamp#The_time_origin} which can be obtained calling the {@link CB_Device.getTiming} function).
 */
CB_GraphicSprites.prototype.setTime = function(time, updateTimeCurrentSprite, updateTimeCurrentSpriteSubSprites)
{
	time = parseFloat(time);
	time = !isNaN(time) && time >= 0 ? time : CB_Device.getTiming();
	this.time = time;
	if (updateTimeCurrentSprite)
	{
		var sprite = this.getSprite(this.getPointer(), null);
		if (sprite !== null)
		{
			sprite.time = time;
			if (updateTimeCurrentSpriteSubSprites)
			{
				sprite.forEach(function() { this.time = time; });
			}
		}
	}
	return this.time;
}


/**
 * Gets the time in milliseconds when the current sprite or a sub-sprite started being pointed (time elapsed since the [time origin]{@link https://developer.mozilla.org/en-US/docs/Web/API/DOMHighResTimeStamp#The_time_origin} which was obtained calling the {@link CB_Device.getTiming} function internally).
 *  @function
 *  @param {*} [returnValueOnFail=undefined] - The value we want it to return in the case that no value is found. If not provided, undefined will be returned.
 *  @param {boolean} [parentTimeFallback=false] - If the "time" property of "this" is not found, it will try to get the "time" property of "this.time" before returning "returnValueOnFail".
 *  @returns {number} Returns the time in milliseconds when the current sprite or a sub-sprite started being pointed (time elapsed since the [time origin]{@link https://developer.mozilla.org/en-US/docs/Web/API/DOMHighResTimeStamp#The_time_origin} which was obtained calling the {@link CB_Device.getTiming} function internally). If it could not be found, it will return "returnValueOnFail".
 */
CB_GraphicSprites.prototype.getTime = function(returnValueOnFail, parentTimeFallback)
{
	if (parentTimeFallback) { returnValueOnFail = this.parent.time || returnValueOnFail; }
	return this.time || returnValueOnFail;
}


/**
 * Tells how many milliseconds elapsed since the current sprite or a sub-sprite was or will be pointed (checking the {@link CB_GraphicSprites#time} property), comparing with the time given in milliseconds (time elapsed since the [time origin]{@link https://developer.mozilla.org/en-US/docs/Web/API/DOMHighResTimeStamp#The_time_origin} which can be obtained calling the {@link CB_Device.getTiming} function) or with the current one if none is given.
 *  @function
 *  @param {number} [timeToCompare=CB_Device.getTiming()] - The time (time elapsed since the [time origin]{@link https://developer.mozilla.org/en-US/docs/Web/API/DOMHighResTimeStamp#The_time_origin} which can obtained calling the {@link CB_Device.getTiming} function) that we want to compare to (normally, it will be a newer time than the one stored in the {@link CB_GraphicSprites#time} property). It must be a positive number (or zero). If not provided, it will use the current time (by calling the {@link CB_Device.getTiming} function internally).
 *  @param {boolean} [parentTimeFallback=false] - If the "time" property of "this" is not found, it will try to get the "time" property of "this.time" before using "returnValueOnFail".
 *  @returns {number} Returns how many milliseconds elapsed since the current sprite or a sub-sprite was or will be pointed, comparing with the time given (in milliseconds) or with the current one if none was given. This is just the given "timeToCompare" minus the returning value of calling the {@link CB_GraphicSprites#getTime} method.
 */
CB_GraphicSprites.prototype.getTimeElapsed = function(timeToCompare, parentTimeFallback)
{
	timeToCompare = parseFloat(timeToCompare);
	timeToCompare = !isNaN(timeToCompare) && timeToCompare >= 0 ? timeToCompare : CB_Device.getTiming();
	return timeToCompare - this.getTime(timeToCompare, parentTimeFallback);
}


/**
 * Sets the desired value of a given property name to the {@link CB_GraphicSprites.SPRITES_OBJECT} object as well to its children elements ({@link CB_GraphicSprites.SPRITE_OBJECT} and {@link CB_GraphicSprites.SUBSPRITE_OBJECT} objects).
 *  @function
 *  @param {number} propertyName - The name of the property we want to affect.
 *  @param {*} [value=undefined] - The value desired for the given property.
 *  @param {boolean} [onlyCurrent=false] - If set to true, it will only affect the current sprite and its sub-sprites (and also the {@link CB_GraphicSprites.SPRITES_OBJECT} object).
 *  @returns {integer} Returns the number of elements affected (counting the {@link CB_GraphicSprites.SPRITES_OBJECT} object).
 */
CB_GraphicSprites.prototype.setPropertyCascade = function(propertyName, value, onlyCurrent)
{
	if (!propertyName) { return; }
	
	if (this.spritesGroup)
	{
		this.spritesGroup[propertyName] = value;
	}
	else
	{
		this[propertyName] = value;
	}

	var affected = 1;
	
	if (onlyCurrent)
	{
		var currentSprite = this.getCurrent();
		if (currentSprite !== null)
		{
			currentSprite[propertyName] = value;
			affected++;
			currentSprite.forEach(function(subSprite) { subSprite[propertyName] = value; affected++; });
		}
	}
	else
	{
		this.forEach
		(
			function(element)
			{
				element[propertyName] = value;
				affected++;
				if (typeof(element.forEach) === "function")
				{
					element.forEach(function(subElement) { subElement[propertyName] = value; affected++; });
				}
			}
			
		);
	}
	
	return affected;
}


/**
 * Gets a new copy of this object with the same attributes (all sub-objects will be a copy, they will not use the same reference).
 *  @function
 *  @param {boolean} [avoidCopyingPointer=false] - If set to true, it will not copy the {@link CB_GraphicSprites#pointer} property of the object.
 *  @param {boolean} [avoidCopyingTimes=false] - If set to true, it will not copy neither the {@link CB_GraphicSprites#time} property property of the object nor the "time" property of each of its sprites ({@link CB_GraphicSprites.SPRITE_OBJECT} objects).
 *  @param {boolean} [clearReferences=false] - If set to true, it will not copy neither the "container" nor the "parent" nor the "data.that" nor the "data.getThis" properties of any element. Useful to be able to stringify the object preventing the "TypeError: cyclic object value" error. When set to true, calls the {@link CB_GraphicSprites.clearReferences} function internally. If set to true and the "filterProperties" parameter is also set to true, the {@link CB_GraphicSprites.filterProperties} will always be called before calling the {@link CB_GraphicSprites.clearReferences} function.
 *  @param {boolean} [filterProperties=false] - If set to true, it will call the {@link CB_GraphicSprites.filterProperties} function internally to filter the properties that we do not want to keep (using the given "propertiesToKeepObject" as the parameter to call it). When set to true, calls the {@link CB_GraphicSprites.filterProperties} function internally. If set to true and the "clearReferences" parameter is also set to true, the {@link CB_GraphicSprites.filterProperties} will always be called before calling the {@link CB_GraphicSprites.clearReferences} function.
 *  @param {CB_GraphicSprites.filterProperties_propertiesToKeepObject_TYPE} [propertiesToKeepObject=CB_GraphicSprites.filterProperties_DEFAULT_PROPERTIES] - The object with the properties that we want to keep. Only used when the "filterProperties" parameter is set to true, as the "propertiesToKeepObject" when calling the {@link CB_GraphicSprites.filterProperties} function internally.
 *  @returns {CB_GraphicSprites} Returns a copy of this object with the same attributes (all sub-objects will be a copy, not the same reference).
 */
CB_GraphicSprites.prototype.getCopy = function(avoidCopyingPointer, avoidCopyingTimes, clearReferences, filterProperties, propertiesToKeepObject)
{
	var spritesGroupCopy = CB_copyObject(this.spritesGroup);
	var newCopy = new CB_GraphicSprites(spritesGroupCopy, false);
	
	//If desired, sets the same pointer:
	if (!avoidCopyingPointer) { newCopy.pointer = this.pointer; newCopy.pointerPrevious = this.pointerPrevious; }
	
	//If desired, sets the same times:
	if (!avoidCopyingTimes)
	{
		newCopy.time = this.time;
	}

	CB_GraphicSprites._copyNeededProperties(newCopy, this) //Copies the needed properties from the original element.
	CB_GraphicSprites._copyNeededProperties(newCopy.spritesGroup, this.spritesGroup) //Copies the needed properties from the original element.

	this.forEach
	(
		function(sprite, index)
		{
			//If desired, sets the same times:
			if (!avoidCopyingTimes) { newCopy.get(index).time = this.time; }
			
			CB_GraphicSprites._copyNeededProperties(newCopy.get(index), sprite) //Copies the needed properties from the original element.
			
			sprite.forEach
			(
				function(subSprite, subSpriteIndex)
				{
					CB_GraphicSprites._copyNeededProperties(newCopy.get(index).get(subSpriteIndex), subSprite) //Copies the needed properties from the original element.
					
					//If desired, sets the same times:
					if (!avoidCopyingTimes) { sprite.get(subSpriteIndex).time = this.time; }
				}
			);
		}
	);
	
	//Sets the same parent and positions:
	newCopy.parent = this.parent;
	newCopy.position = this.position;
	newCopy.positionByZIndex = this.positionByZIndex;

	//If we want to, filters the properties keeping just the desired ones:
	if (filterProperties) { newCopy = CB_GraphicSprites.filterProperties(newCopy, propertiesToKeepObject); }

	//If we want to, clears the references:
	if (clearReferences) { CB_GraphicSprites.clearReferences(newCopy); }

	return newCopy;
}


CB_GraphicSprites._copyNeededPropertiesData =
{
	spritesScene: ["id"],
	spritesGroups: ["id", "byReference_DEFAULT", "src", "srcType", "srcLeft", "left", "srcTop", "top", "srcWidth", "width", "srcHeight", "height", "zIndex"],
	sprites: ["id", "byReference_DEFAULT", "zIndex", "pointer", "pointerPrevious", "pointer", "pointerPrevious", "position", "positionByZIndex", "_attributes"],
	spritesGroup: ["id", "byReference_DEFAULT", "src", "srcType", "srcLeft", "left", "srcTop", "top", "srcWidth", "width", "srcHeight", "height", "zIndex", "disabled"],
	sprite: ["id", "byReference", "src", "srcType", "srcLeft", "left", "srcTop", "top", "srcWidth", "width", "srcHeight", "height", "zIndex", "disabled", "position", "positionByZIndex", "_timeDisappeared", "_usingRelativePosition", "_clearPreviousFirstPerformed", "_widthOriginal", "_heightOriginal", "_leftOriginal", "_topOriginal", "_attributes"],
	subSprite: ["id", "byReference", "time", "src", "srcType", "srcLeft", "left", "srcTop", "top", "srcWidth", "width", "srcHeight", "height", "zIndex", "disabled", "position", "positionByZIndex", "_timeDisappeared", "_usingRelativePosition", "_attributes"]
};
CB_GraphicSprites._copyNeededProperties = function(element, elementOriginal)
{
	if (!element || !element.type || element.type !== elementOriginal.type) { return; }
	if (!CB_isArray(CB_GraphicSprites._copyNeededPropertiesData[element.type])) { return; }
	
	for (var x = CB_GraphicSprites._copyNeededPropertiesData[element.type].length; x >= 0; x--)
	{
		propertyName = CB_GraphicSprites._copyNeededPropertiesData[element.type][x];
		element[propertyName] = elementOriginal[propertyName];
	}
	
	return element;
}


/**
 * Clears the "container", the "parent" and the "data.that" properties (sets to null) of the given object and its sub-objects (works recursively, internally).
 *  @function
 *  @param {*} element - The object whose properties we want to clear. It can be different kinds ({@link CB_GraphicSpritesScene}, {@link CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT}, {@link CB_GraphicSprites}, {@link CB_GraphicSprites.SPRITES_OBJECT}, {@link CB_GraphicSprites.SPRITE_OBJECT}, {@link CB_GraphicSprites.SUBSPRITE_OBJECT}, etc.).
 *  @returns {*} Returns the same object with the the "container", the "parent", "data.that" and the "data.getThis" properties cleared (set to null), if possible.
 */
CB_GraphicSprites.clearReferences = function(element)
{
	if (typeof(element) !== "object" || element === null) { return element; }
	if (typeof(element.forEach) === "function")
	{
		element.forEach.call
		(
			element,
			function(subElement)
			{
				CB_GraphicSprites.clearReferences(subElement);
			}
		);
	}
	if (element.container) { element.container = null; }
	if (element.parent) { element.container = null; }
	if (element.data)
	{
		if (element.data.that) { element.data.that = null; }
		if (element.data.getThis) { element.data.getThis = null; }
	}
	return element;
}


/**
 * Object used to know what properties keep when calling the {@link CB_GraphicSprites.filterProperties} function (type used for its "propertiesToKeepObject" parameter). Its properties must have the name that matches the value returned by the "type" property of each element, being their value an array of strings with the name of the properties we want to keep. The property names which start with a "_" symbol will not considered inherited from the element's parent and will always be copied. The other properties (which do not start with the "_" symbol) will only be copied when the element contains a value which is different from the same property of its parent.
 *  @memberof CB_GraphicSprites
 *  @typedef {Object} CB_GraphicSprites.filterProperties_propertiesToKeepObject_TYPE
 *  @property {array} [spritesScene] Array of strings with the name of the properties to keep for the {@link CB_GraphicSpritesScene} objects. If no provided, no properties will be kept for this kind of element.
 *  @property {array} [spritesGroups] Array of strings with the name of the properties to keep for the {@link CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT} objects. If no provided, no properties will be kept for this kind of element.
 *  @property {array} [sprites] Array of strings with the name of the properties to keep for the {@link CB_GraphicSprites} objects. If no provided, no properties will be kept for this kind of element.
 *  @property {array} [spritesGroup] Array of strings with the name of the properties to keep for the {@link CB_GraphicSprites.SPRITES_OBJECT} objects. If no provided, no properties will be kept for this kind of element.
 *  @property {array} [sprite] Array of strings with the name of the properties to keep for the {@link CB_GraphicSprites.SPRITE_OBJECT} objects. If no provided, no properties will be kept for this kind of element.
 *  @property {array} [subSprite] Array of strings with the name of the properties to keep for the {@link CB_GraphicSprites.SUBSPRITE_OBJECT} objects. If no provided, no properties will be kept for this kind of element.
 */
 
 /**
 * Object used as the default value for the "propertiesToKeepObject" parameter if not provided when calling the {@link CB_GraphicSprites.filterProperties} function.
 *	@constant
 *  @type {CB_GraphicSprites.filterProperties_propertiesToKeepObject_TYPE}
 *  @default
 */
CB_GraphicSprites.filterProperties_DEFAULT_PROPERTIES =
{
	spritesScene: ["id", "spritesGroups"],
	spritesGroups: ["id", "byReference_DEFAULT", "src", "srcType", "srcLeft", "left", "srcTop", "top", "srcWidth", "width", "srcHeight", "height", "zIndex", "data", "spritesGroups", "items"],
	sprites: ["id", "byReference_DEFAULT", "spritesGroup", "zIndex", "pointer", "pointerPrevious", "time", "pointer", "pointerPrevious", "position", "positionByZIndex", "_attributes"],
	spritesGroup: ["id", "byReference_DEFAULT", "src", "srcType", "srcLeft", "left", "srcTop", "top", "srcWidth", "width", "srcHeight", "height", "zIndex", "data", "disabled", "sprites"],
	sprite: ["id", "byReference", "time", "src", "srcType", "srcLeft", "left", "srcTop", "top", "srcWidth", "width", "srcHeight", "height", "zIndex", "data", "disabled", "position", "positionByZIndex", "subSprites", "_timeDisappeared", "_usingRelativePosition", "_clearPreviousFirstPerformed", "_widthOriginal", "_heightOriginal", "_leftOriginal", "_topOriginal", "_attributes"],
	subSprite: ["id", "byReference", "time", "src", "srcType", "srcLeft", "left", "srcTop", "top", "srcWidth", "width", "srcHeight", "height", "zIndex", "data", "disabled", "position", "positionByZIndex", "_timeDisappeared", "_usingRelativePosition", "_attributes"]
};

//Object to detect type of elements in an array according to the property name they belong to (which contains the array):
CB_GraphicSprites.filterProperties_types =
{
	"spritesGroups": "spritesGroup",
	"items": "sprites",
	"sprites": "sprite",
	"subSprites": "subSprite"
};

/**
 * Gets a new object with the properties filtered of a given element and its sub-elements, keeping only the ones that are in the given "propertiesToKeepObject" (works recursively, internally).
 *  @function
 *  @param {*} element - The object whose properties we want to clear. It can be different kinds ({@link CB_GraphicSpritesScene}, {@link CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT}, {@link CB_GraphicSprites}, {@link CB_GraphicSprites.SPRITES_OBJECT}, {@link CB_GraphicSprites.SPRITE_OBJECT}, {@link CB_GraphicSprites.SUBSPRITE_OBJECT}, etc.).
 *  @param {CB_GraphicSprites.filterProperties_propertiesToKeepObject_TYPE} [propertiesToKeepObject=CB_GraphicSprites.filterProperties_DEFAULT_PROPERTIES] - The object with the properties that we want to keep.
 *  @returns {*} Returns a new object with the properties filtered of a given element and its sub-elements, keeping only the ones that are in the given "propertiesToKeepObject". If no valid "element" is provided, returns null.
 *  @todo Implement a boolean property and when it is true it will not keep the properties whose values are the default ones (for example, if "byReference" property is false it will not be kept as it is its default value). So the output can be reduced this way.
 */
CB_GraphicSprites.filterProperties = function(element, propertiesToKeepObject)
{
	if (typeof(element) !== "object" || element === null) { return null; }
	
	propertiesToKeepObject = (typeof(propertiesToKeepObject) === "object" && propertiesToKeepObject !== null) ? propertiesToKeepObject : CB_GraphicSprites.filterProperties_DEFAULT_PROPERTIES;
	
	if (element.type === "spritesGroup") { element.isSpritesGroup = true; }
	else if (element.type === "sprites") { element.isSprites = true; }
	else if (element.type === "sprite") { element.isSprite = true; }
	else if (element.type === "subSprite") { element.isSubSprite = true; }
	
	var newObject = {};
	
	for (var propertyName in element)
	{
		if (propertiesToKeepObject[element.type] && CB_Arrays.indexOf(propertiesToKeepObject[element.type], propertyName) !== -1)
		{
			//If the property starts with "_", or there is no parent or the value of the property of the parent is different from the value of the current element, copies the value:
			if (propertyName.charAt(0) === "_" || !element.parent || element._avoidParent || element.parent && element.parent[propertyName] !== element[propertyName]) //The hidden properties (which start with "_") are not inherited.
			{
				if (element.isSpritesScene && propertyName === "spritesGroups")
				{
					element.spritesGroups.type = "spritesGroups";
					element._avoidParent = true; //It will not let it inherit from its parent.
					newObject.spritesGroups = CB_GraphicSprites.filterProperties(element.spritesGroups, propertiesToKeepObject);
					element._avoidParent = undefined;
				}
				else if (element.isSpritesGroups && (propertyName === "spritesGroups" || propertyName === "items") || element.isSpritesGroup && propertyName === "sprites" || element.isSprite && propertyName === "subSprites")
				{
					var type = CB_GraphicSprites.filterProperties_types[propertyName];
					var currentElement = null;
					newObject[propertyName] = [];
					if (CB_isArray(element[propertyName]))
					{
						for (var x = 0; x < element[propertyName].length; x++)
						{
							element[propertyName][x].type = type;
							element[propertyName][x]._avoidParent = true; //It will not let it inherit from its parent.
							newObject[propertyName][x] = CB_GraphicSprites.filterProperties(element[propertyName][x], propertiesToKeepObject);
							element[propertyName][x]._avoidParent = undefined;
						}
					}
				}
				else if (element.isSprites && propertyName === "spritesGroup")
				{
					element.spritesGroup.type = "spritesGroup";
					element._avoidParent = true; //It will not let it inherit from its parent.
					newObject.spritesGroup = CB_GraphicSprites.filterProperties(element.spritesGroup, propertiesToKeepObject);
					element._avoidParent = undefined;
				}
				else if (propertyName === "data" && element.data)
				{
					newObject.data = {};
					for (var dataPropertyName in element.data)
					{
						if (dataPropertyName === "that" || dataPropertyName === "getThis") { continue; }
						newObject.data[dataPropertyName] = element.data[dataPropertyName];
					}
				}
				else
				{
					newObject[propertyName] = element[propertyName];
				}
			}
		}
	}
	
	propertyName = element.isSprites ? "sprites" : element.isSprite ? "subSprites" : "";
	if (propertyName !== "" && CB_Arrays.indexOf(propertiesToKeepObject[element.type], propertyName) !== -1 && typeof(element.forEach) === "function")
	{
		newObject[propertyName] = [];
		element.forEach.call
		(
			element,
			function(subElement)
			{
				//subElement._avoidParent = true; //It will not let it inherit from its parent.
				newObject[propertyName][newObject[propertyName].length] = CB_GraphicSprites.filterProperties(subElement, propertiesToKeepObject);
				//subElement._avoidParent = undefined;
			}
		);
	}
	
	return newObject;
}