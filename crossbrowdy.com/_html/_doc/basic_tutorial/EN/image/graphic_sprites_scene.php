<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	The graphic sprites scene objects (<a href="api/CB_GraphicSpritesScene.html" target="_blank">CB_GraphicSpritesScene</a>) allows you to manage different groups of sprites (<a href="api/CB_GraphicSprites.html" target="_blank">CB_GraphicSprites</a> objects) easily.
</p>

<p>
	Each graphic scene object (<a href="api/CB_GraphicSpritesScene.html" target="_blank">CB_GraphicSpritesScene</a>) will contain one or more sprites groups (<a href="api/CB_GraphicSprites.html" target="_blank">CB_GraphicSprites</a> objects).
	Sprites groups (<a href="api/CB_GraphicSprites.html" target="_blank">CB_GraphicSprites</a> objects) are useful objects to manage multiple sprites (and their sub-sprites) for the same graphic entity, allowing to point only one sprite at a time. The sprite pointed will represent the current state of this sprites group (which is the current state of the graphic entity).
</p>

<p>
	A graphic scene object (<a href="api/CB_GraphicSpritesScene.html" target="_blank">CB_GraphicSpritesScene</a>) can be used, among other use cases, to represent a scene with its graphic entities (sprites and their sub-sprites). It can also be used as a buffer.
	The source ("src" property) of each sprite or each sub-sprite can be a text, an image, a bitmap, a 3D object, etc. So they can be used for any kind of source you may think of, including (but not limited to) one sprites sheet or more, one atlas or more, etc. or even a mix of all of them.
</p>

<p>
	It is important to understand that the <a href="api/CB_GraphicSpritesScene.html" target="_blank">CB_GraphicSpritesScene</a> objects just provide a low-level way to manage different groups of sprites (and their sub-sprites) through their internal <a href="api/CB_GraphicSprites.html" target="_blank">CB_GraphicSprites</a> objects and accept any kind of source and additional data (which can even include code), without providing advanced high-level features as graphic rendering.
	This makes these objects powerful enough to be adapted to virtually any rendering engine you may want (2D or 3D), having to manage most of the logic yourself.
</p>

<p>
	Here is an example of graphic sprites scene management:
</p>
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Defines the sprites groups information ('CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT' object):
	//Note: sprites groups, sprites and sub-sprites are always automatically ordered internally by their z-index, ascending order (remember to use the 'setZIndex' method of each if you want to modify it).
	var spritesGroupsData =
	{
		//Sprites groups ('CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT' object). Some missing or non-valid properties will get a default value:
		srcWidth: 64, //The value for the "srcWidth" property which will be used as default if not provided (or the provided one was wrong) in the given 'CB_GraphicSprites.SPRITES_OBJECT' objects. Default: CB_GraphicSprites.WIDTH_SOURCE_DEFAULT.
		srcHeight: 32, //The value for the "srcHeight" property which will be used as default if not provided (or the provided one was wrong) in the given 'CB_GraphicSprites.SPRITES_OBJECT' objects. Default: CB_GraphicSprites.HEIGHT_SOURCE_DEFAULT.
		width: 64, //The value for the "width" property which will be used as default if not provided (or the provided one was wrong) in the given 'CB_GraphicSprites.SPRITES_OBJECT' objects. Default: CB_GraphicSprites.WIDTH_DEFAULT.
		height: 32, //The value for the "height" property which will be used as default if not provided (or the provided one was wrong) in the given 'CB_GraphicSprites.SPRITES_OBJECT' objects. Default: CB_GraphicSprites.HEIGHT_DEFAULT.
		//Numeric array containing 'CB_GraphicSprites.SPRITES_OBJECT' objects with all the sprites groups that will be used (their "parent" property will be set to point the current 'CB_GraphicSpritesScene' object which contains them):
		spritesGroups:
		[
			//Sprites group #1 ('CB_GraphicSprites.SPRITES_OBJECT' object). Some missing or non-valid properties will be inherited from the parent ('CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT' object):
			{
				src: "path/to/image.gif", //Source of origin. Can be a path or identifier of an image, text, bitmap, 3D object, etc. Optional but recommended. Default: this.parent.zIndex || "".
				//Numeric array containing 'CB_GraphicSprites.SPRITE_OBJECT' objects with all the sprites that will be used:
				sprites:
				[
					//Sprite #1 ('CB_GraphicSprites.SPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the sprites group:
					{
						//Numeric array containing 'CB_GraphicSprites.SUBSPRITE_OBJECT' objects with the sub-sprites that this sprite uses:
						subSprites:
						[
							//Sub-sprite #1 ('CB_GraphicSprites.SUBSPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the parent sprite:
							{
								//Will inherit some missing properties (or when they are not valid).
							},
							//Sub-sprite #2 ('CB_GraphicSprites.SUBSPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the parent sprite:
							{
								srcTop: 40, //Top (vertical) position in the original source (having in mind its real width and height). Unit agnostic (only numeric values allowed). Default: this.parent.srcTop || CB_GraphicSprites.TOP_SOURCE_DEFAULT.
								zIndex: 2 //The z-index for the destiny (inside the sprite). Only numeric values allowed. Default: this.parent.zIndex || CB_GraphicSprites.ZINDEX_DEFAULT.
							}
						]
					},
					//Sprite #2 ('CB_GraphicSprites.SPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the sprites group:
					{
						//Numeric array containing 'CB_GraphicSprites.SUBSPRITE_OBJECT' objects with the sub-sprites that this sprite uses:
						subSprites:
						[
							//Sub-sprite #3 ('CB_GraphicSprites.SUBSPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the parent sprite:
							{
								srcLeft: 30, //Left (horizontal) position in the original source (having in mind its real width and height). Unit agnostic (only numeric values allowed). Default: this.parent.srcLeft || CB_GraphicSprites.LEFT_SOURCE_DEFAULT.
							},
							//Sub-sprite #4 ('CB_GraphicSprites.SUBSPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the parent sprite:
							{
								srcLeft: 40, //Left (horizontal) position in the original source (having in mind its real width and height). Unit agnostic (only numeric values allowed). Default: this.parent.srcLeft || CB_GraphicSprites.LEFT_SOURCE_DEFAULT.
								srcTop: 80, //Top (vertical) position in the original source (having in mind its real width and height). Unit agnostic (only numeric values allowed). Default: this.parent.srcTop || CB_GraphicSprites.TOP_SOURCE_DEFAULT.
								zIndex: 2 //The z-index for the destiny (inside the sprite). Only numeric values allowed. Default: this.parent.zIndex || CB_GraphicSprites.ZINDEX_DEFAULT.
							}
						]
					}
				]
			},
			//Sprites group #2 ('CB_GraphicSprites.SPRITES_OBJECT' object). Some missing or non-valid properties will be inherited from the parent ('CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT' object):
			{
				src: "path/to/image2.gif", //Source of origin. Can be a path or identifier of an image, text, bitmap, 3D object, etc. Optional but recommended. Default: this.parent.zIndex || "".
				//Numeric array containing 'CB_GraphicSprites.SPRITE_OBJECT' objects with all the sprites that will be used:
				sprites:
				[
					//Sprite #3 ('CB_GraphicSprites.SPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the sprites group:
					{
						//Numeric array containing 'CB_GraphicSprites.SUBSPRITE_OBJECT' objects with the sub-sprites that this sprite uses:
						subSprites:
						[
							//Sub-sprite #5 ('CB_GraphicSprites.SUBSPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the parent sprite:
							{
								//Will inherit some missing properties (or when they are not valid).
							},
							//Sub-sprite #6 ('CB_GraphicSprites.SUBSPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the parent sprite:
							{
								srcTop: 40, //Top (vertical) position in the original source (having in mind its real width and height). Unit agnostic (only numeric values allowed). Default: this.parent.srcTop || CB_GraphicSprites.TOP_SOURCE_DEFAULT.
								zIndex: 2 //The z-index for the destiny (inside the sprite). Only numeric values allowed. Default: this.parent.zIndex || CB_GraphicSprites.ZINDEX_DEFAULT.
							}
						]
					},
					//Sprite #4 ('CB_GraphicSprites.SPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the sprites group:
					{
						//Numeric array containing 'CB_GraphicSprites.SUBSPRITE_OBJECT' objects with the sub-sprites that this sprite uses:
						subSprites:
						[
							//Sub-sprite #7 ('CB_GraphicSprites.SUBSPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the parent sprite:
							{
								srcLeft: 30, //Left (horizontal) position in the original source (having in mind its real width and height). Unit agnostic (only numeric values allowed). Default: this.parent.srcLeft || CB_GraphicSprites.LEFT_SOURCE_DEFAULT.
							},
							//Sub-sprite #8 ('CB_GraphicSprites.SUBSPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the parent sprite:
							{
								srcLeft: 40, //Left (horizontal) position in the original source (having in mind its real width and height). Unit agnostic (only numeric values allowed). Default: this.parent.srcLeft || CB_GraphicSprites.LEFT_SOURCE_DEFAULT.
								srcTop: 80, //Top (vertical) position in the original source (having in mind its real width and height). Unit agnostic (only numeric values allowed). Default: this.parent.srcTop || CB_GraphicSprites.TOP_SOURCE_DEFAULT.
								zIndex: 2 //The z-index for the destiny (inside the sprite). Only numeric values allowed. Default: this.parent.zIndex || CB_GraphicSprites.ZINDEX_DEFAULT.
							}
						]
					}
				]
			}
		]
	 };
 
	//Creates the graphic sprites object:
	var myGraphicSpritesScene = new CB_GraphicSpritesScene(spritesGroupsData);
</code></pre>


<p>
	Note that many of the properties of the sub-sprites which were not provided or were not valid, will be inherited from the properties of their parent sprite.
	At the same time, when also not provided or not valid, the sprites will also inherit their properties but from their sprites group.
	When not provided in the sprites group, each sprites group will also get their properties from the sprites scene object ('CB_GraphicSprites.SPRITES_GROUPS_OBJECT' object).
	Some properties are optional and will have a default value when not provided in the sprites scene object ('CB_GraphicSprites.SPRITES_GROUPS_OBJECT' object).
</p>

<p>
	Here is an extended example creating a graphic sprites object using more options:
</p>
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Defines the sprites groups information ('CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT' object):
	//Note: sprites groups, sprites and sub-sprites are always automatically ordered internally by their z-index, ascending order (remember to use the 'setZIndex' method of each if you want to modify it).
	var spritesGroupsData =
	{
		//'my_sprites_groups_1' ('CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT' object). Some missing or non-valid properties will get a default value:
		id: "my_sprites_groups_1", //Identifier of the sprites groups object (also used for the 'CB_GraphicSpritesScene' object). Optional but recommended. It should be unique. By default, it is generated automatically.
		src: undefined, //The value for the "src" property which will be used as default if not provided (or the provided one was wrong) in the given 'CB_GraphicSprites.SPRITES_OBJECT' objects (in the "spritesGroups" property). Default: "".
		srcType: CB_GraphicSprites.SRC_TYPES.IMAGE, //The value for the "srcType" property which will be used as default if not provided (or the provided one was wrong) in the given 'CB_GraphicSprites.SPRITES_OBJECT' objects (in the "spritesGroups" property). Default: CB_GraphicSprites.SRC_TYPES_DEFAULT. You can use other values of the 'CB_GraphicSprites.SRC_TYPES' object or create new ones.
		srcLeft: 0, //The value for the "srcLeft" property which will be used as default if not provided (or the provided one was wrong) in the given 'CB_GraphicSprites.SPRITES_OBJECT' objects (in the "spritesGroups" property). Default: CB_GraphicSprites.LEFT_SOURCE_DEFAULT.
		srcTop: 0, //The value for the "srcTop" property which will be used as default if not provided (or the provided one was wrong) in the given 'CB_GraphicSprites.SPRITES_OBJECT' objects (in the "spritesGroups" property). Default: CB_GraphicSprites.TOP_SOURCE_DEFAULT.
		srcWidth: 64, //The value for the "srcWidth" property which will be used as default if not provided (or the provided one was wrong) in the given 'CB_GraphicSprites.SPRITES_OBJECT' objects. Default: CB_GraphicSprites.WIDTH_SOURCE_DEFAULT.
		srcHeight: 32, //The value for the "srcHeight" property which will be used as default if not provided (or the provided one was wrong) in the given 'CB_GraphicSprites.SPRITES_OBJECT' objects. Default: CB_GraphicSprites.HEIGHT_SOURCE_DEFAULT.
		left: 0, //The value for the "left" property which will be used as default if not provided (or the provided one was wrong) in the given 'CB_GraphicSprites.SPRITES_OBJECT' objects (in the "spritesGroups" property). Default: CB_GraphicSprites.LEFT_DEFAULT.
		top: 0, //The value for the "top" property which will be used as default if not provided (or the provided one was wrong) in the given 'CB_GraphicSprites.SPRITES_OBJECT' objects (in the "spritesGroups" property). Default: CB_GraphicSprites.TOP_DEFAULT.
		width: 64, //The value for the "width" property which will be used as default if not provided (or the provided one was wrong) in the given 'CB_GraphicSprites.SPRITES_OBJECT' objects. Default: CB_GraphicSprites.WIDTH_DEFAULT.
		height: 32, //The value for the "height" property which will be used as default if not provided (or the provided one was wrong) in the given 'CB_GraphicSprites.SPRITES_OBJECT' objects. Default: CB_GraphicSprites.HEIGHT_DEFAULT.
		zIndex: 1, //The value for the "zIndex" property which will be used as default if not provided (or the provided one was wrong) in the given 'CB_GraphicSprites.SPRITES_OBJECT' objects (in the "spritesGroups" property). Default: CB_GraphicSprites.ZINDEX_DEFAULT.
		disabled: false, //The value for the "disabled" property which will be used as default if not provided (or the provided one was wrong) in the given 'CB_GraphicSprites.SPRITES_OBJECT' objects (in the "spritesGroups" property). Default: false.
		data: //Object with any additional data desired which can be any kind. Default: { 'that' : CB_GraphicSprites.SPRITES_OBJECT, 'getThis' = function() { return this.that; } }.
		{
			//Example data object:
			datum_1: "value_1",
			datum_2: 2,
			datum_3: [ "a", "b", "c" ],
			getType: function() { return this.getThis().type; }, //To detect the type of an object we can also use the 'isSpritesScene', 'isSpritesGroups', 'isSprites', 'isSpritesGroup', 'isSprite' or 'isSubSprite' properties.
			getGraphicSpritesObject: function() { return this.getThis().container; },
			getParent: function() { return this.getThis().parent; }
		},
		//Numeric array containing 'CB_GraphicSprites.SPRITES_OBJECT' objects with all the sprites groups that will be used (their "parent" property will be set to point the current 'CB_GraphicSpritesScene' object which contains them):
		spritesGroups:
		[
			//'my_sprites_1' ('CB_GraphicSprites.SPRITES_OBJECT' object). Some missing or non-valid properties will will be inherited from the parent ('CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT' object):
			{
				id: "my_sprites_1", //Identifier of the sprites group (also used for the 'CB_GraphicSprites' object). Optional but recommended. It should be unique. If not provided, it will be calculated automatically.
				src: "path/to/image.gif", //Source of origin. Can be a path or identifier of an image, text, bitmap, 3D object, etc. Optional but recommended. Default: this.parent.src || "".
				srcType: undefined, //Type of the source of origin. Optional. Default: this.parent.srcType || CB_GraphicSprites.SRC_TYPES_DEFAULT. You can use other values of the 'CB_GraphicSprites.SRC_TYPES' object or create new ones.
				srcLeft: undefined, //Left (horizontal) position in the original source (having in mind its real width and height). Unit agnostic (only numeric values allowed). Default: this.parent.srcLeft || CB_GraphicSprites.LEFT_SOURCE_DEFAULT.
				srcTop: undefined, //Top (vertical) position in the original source (having in mind its real width and height). Unit agnostic (only numeric values allowed). Default: this.parent.srcTop || CB_GraphicSprites.TOP_SOURCE_DEFAULT.
				srcWidth: undefined, //Width of the original source. Unit agnostic (only numeric values allowed). Default: this.parent.srcWidth || CB_GraphicSprites.WIDTH_SOURCE_DEFAULT.
				srcHeight: undefined, //Height of the original source. Unit agnostic (only numeric values allowed). Default: this.parent.srcHeight || CB_GraphicSprites.HEIGHT_SOURCE_DEFAULT.
				left: undefined, //Left (horizontal) position in the destiny. Unit agnostic (only numeric values allowed). Default: CB_GraphicSprites.LEFT_DEFAULT.
				top: undefined, //Top (vertical) position in the destiny. Unit agnostic (only numeric values allowed). Default: CB_GraphicSprites.TOP_DEFAULT.
				width: undefined, //Width of the destiny. Unit agnostic (only numeric values allowed). Default: this.parent.width || CB_GraphicSprites.WIDTH_DEFAULT.
				height: undefined, //Height of the destiny. Unit agnostic (only numeric values allowed). Default: this.parent.height || CB_GraphicSprites.HEIGHT_DEFAULT.
				zIndex: undefined, //The z-index for the destiny. Only numeric values allowed. Default: this.parent.zIndex || CB_GraphicSprites.ZINDEX_DEFAULT.
				disabled: false, //Tells whether this sprites group (and the 'CB_GraphicSprites' object itself) is disabled or not. Default: this.parent.disabled || false.
				//Object with any additional data desired which can be any kind:
				//NOTE: it will always have a "that" property pointing to the 'CB_GraphicSprites.SPRITES_OBJECT' object where it belongs to and a function in its "getThis" property returning the same value (added automatically).
				data: undefined, //Object with any additional data desired which can be any kind. Default: CB_combineJSON(this.parent.data, this.data) || this.parent.data || { 'that' : CB_GraphicSprites.SPRITES_OBJECT, 'getThis' = function() { return this.that; } }.
				//Numeric array containing 'CB_GraphicSprites.SPRITE_OBJECT' objects with all the sprites that will be used:
				sprites:
				[
					//'my_sprite_1' ('CB_GraphicSprites.SPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the sprites group:
					{
						id: "my_sprite_1", //Identifier for the sprite. Optional but recommended. It should be unique. If not provided, it will be calculated automatically.
						src: undefined, //Source of origin. Can be a path or identifier of an image, text, bitmap, 3D object, etc. Optional but recommended. Default: this.parent.src || "".
						srcType: undefined, //Type of the source of origin. Optional. Default: this.parent.srcType || CB_GraphicSprites.SRC_TYPES_DEFAULT. You can use other values of the 'CB_GraphicSprites.SRC_TYPES' object or create new ones.
						srcLeft: undefined, //Left (horizontal) position in the original source (having in mind its real width and height). Unit agnostic (only numeric values allowed). Default: this.parent.srcLeft || CB_GraphicSprites.LEFT_SOURCE_DEFAULT.
						srcTop: undefined, //Top (vertical) position in the original source (having in mind its real width and height). Unit agnostic (only numeric values allowed). Default: this.parent.srcTop || CB_GraphicSprites.TOP_SOURCE_DEFAULT.
						srcWidth: undefined, //Width of the original source. Unit agnostic (only numeric values allowed). Default: this.parent.srcWidth || CB_GraphicSprites.WIDTH_SOURCE_DEFAULT.
						srcHeight: undefined, //Height of the original source. Unit agnostic (only numeric values allowed). Default: this.parent.srcHeight || CB_GraphicSprites.HEIGHT_SOURCE_DEFAULT.
						left: undefined, //Left (horizontal) position in the destiny (inside the sprites group). Unit agnostic (only numeric values allowed). Default: CB_GraphicSprites.LEFT_DEFAULT.
						top: undefined, //Top (vertical) position in the destiny (inside the sprites group). Unit agnostic (only numeric values allowed). Default: CB_GraphicSprites.TOP_DEFAULT.
						width: undefined, //Width of the destiny (inside the sprites group). Unit agnostic (only numeric values allowed). Default: this.parent.width || CB_GraphicSprites.WIDTH_DEFAULT.
						height: undefined, //Height of the destiny (inside the sprites group). Unit agnostic (only numeric values allowed). Default: this.parent.height || CB_GraphicSprites.HEIGHT_DEFAULT.
						zIndex: undefined, //The z-index for the destiny (inside the sprites group). Only numeric values allowed. Default: this.parent.zIndex || CB_GraphicSprites.ZINDEX_DEFAULT.
						disabled: false, //Tells whether this sprite is disabled or not. Regardless its value, it will be considered disabled if its sprites group parent is also disabled. Default: this.parent.disabled || false.
						//Object with any additional data desired which can be any kind:
						//NOTE: it will always have a "that" property pointing to the 'CB_GraphicSprites.SPRITES_OBJECT' object where it belongs to and a function in its "getThis" property returning the same value (added automatically).
						data: undefined, //Object with any additional data desired which can be any kind. Default: CB_combineJSON(this.parent.data, this.data) || this.parent.data || { 'that' : CB_GraphicSprites.SPRITES_OBJECT, 'getThis' = function() { return this.that; } }.
						//Numeric array containing 'CB_GraphicSprites.SUBSPRITE_OBJECT' objects with the sub-sprites that this sprite uses:
						subSprites:
						[
							//'my_subsprite_1' ('CB_GraphicSprites.SUBSPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the parent sprite:
							{
								id: "my_subsprite_1", //Identifier for the sub-sprite. Optional but recommended. It should be unique. If not provided, it will be calculated automatically.
								src: undefined, //Source of origin. Can be a path or identifier of an image, text, bitmap, 3D object, etc. Optional but recommended. Default: this.parent.src || "".
								srcType: undefined, //Type of the source of origin. Optional. Default: this.parent.srcType || CB_GraphicSprites.SRC_TYPES_DEFAULT. You can use other values of the 'CB_GraphicSprites.SRC_TYPES' object or create new ones.
								srcLeft: 10, //Left (horizontal) position in the original source (having in mind its real width and height). Unit agnostic (only numeric values allowed). Default: this.parent.srcLeft || CB_GraphicSprites.LEFT_SOURCE_DEFAULT.
								srcTop: 20, //Top (vertical) position in the original source (having in mind its real width and height). Unit agnostic (only numeric values allowed). Default: this.parent.srcTop || CB_GraphicSprites.TOP_SOURCE_DEFAULT.
								srcWidth: undefined, //Width of the original source. Unit agnostic (only numeric values allowed). Default: this.parent.srcWidth || CB_GraphicSprites.WIDTH_SOURCE_DEFAULT.
								srcHeight: undefined, //Height of the original source. Unit agnostic (only numeric values allowed). Default: this.parent.srcHeight || CB_GraphicSprites.HEIGHT_SOURCE_DEFAULT.
								left: undefined, //Left (horizontal) position in the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: CB_GraphicSprites.LEFT_DEFAULT.
								top: undefined, //Top (vertical) position in the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: CB_GraphicSprites.TOP_DEFAULT.
								width: undefined, //Width of the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: this.parent.width || CB_GraphicSprites.WIDTH_DEFAULT.
								height: undefined, //Height of the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: this.parent.height || CB_GraphicSprites.HEIGHT_DEFAULT.
								zIndex: undefined, //The z-index for the destiny (inside the sprite). Only numeric values allowed. Default: this.parent.zIndex || CB_GraphicSprites.ZINDEX_DEFAULT.
								disabled: false, //Tells whether this sub-sprite is disabled or not. Regardless its value, it will be considered disabled if its sprite parent is also disabled. Default: this.parent.disabled || false.
								//Object with any additional data desired which can be any kind:
								//NOTE: it will always have a "that" property pointing to the 'CB_GraphicSprites.SPRITES_OBJECT' object where it belongs to and a function in its "getThis" property returning the same value (added automatically).
								data: undefined, //Object with any additional data desired which can be any kind. Default: CB_combineJSON(this.parent.data, this.data) || this.parent.data || { 'that' : CB_GraphicSprites.SPRITES_OBJECT, 'getThis' = function() { return this.that; } }.
							},
							//'my_subsprite_2' ('CB_GraphicSprites.SUBSPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the parent sprite:
							{
								id: "my_subsprite_2", //Identifier for the sub-sprite. Optional but recommended. It should be unique. If not provided, it will be calculated automatically.
								src: undefined, //Source of origin. Can be a path or identifier of an image, text, bitmap, 3D object, etc. Optional but recommended. Default: this.parent.src || "".
								srcType: undefined, //Type of the source of origin. Optional. Default: this.parent.srcType || CB_GraphicSprites.SRC_TYPES_DEFAULT. You can use other values of the 'CB_GraphicSprites.SRC_TYPES' object or create new ones.
								srcLeft: 20, //Left (horizontal) position in the original source (having in mind its real width and height). Unit agnostic (only numeric values allowed). Default: this.parent.srcLeft || CB_GraphicSprites.LEFT_SOURCE_DEFAULT.
								srcTop: 40, //Top (vertical) position in the original source (having in mind its real width and height). Unit agnostic (only numeric values allowed). Default: this.parent.srcTop || CB_GraphicSprites.TOP_SOURCE_DEFAULT.
								srcWidth: undefined, //Width of the original source. Unit agnostic (only numeric values allowed). Default: this.parent.srcWidth || CB_GraphicSprites.WIDTH_SOURCE_DEFAULT.
								srcHeight: undefined, //Height of the original source. Unit agnostic (only numeric values allowed). Default: this.parent.srcHeight || CB_GraphicSprites.HEIGHT_SOURCE_DEFAULT.
								left: undefined, //Left (horizontal) position in the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: CB_GraphicSprites.LEFT_DEFAULT.
								top: undefined, //Top (vertical) position in the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: CB_GraphicSprites.TOP_DEFAULT.
								width: undefined, //Width of the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: this.parent.width || CB_GraphicSprites.WIDTH_DEFAULT.
								height: undefined, //Height of the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: this.parent.height || CB_GraphicSprites.HEIGHT_DEFAULT.
								zIndex: 2, //The z-index for the destiny (inside the sprite). Only numeric values allowed. Default: this.parent.zIndex || CB_GraphicSprites.ZINDEX_DEFAULT.
								disabled: false, //Tells whether this sub-sprite is disabled or not. Regardless its value, it will be considered disabled if its sprite parent is also disabled. Default: this.parent.disabled || false.
								//Object with any additional data desired which can be any kind:
								//NOTE: it will always have a "that" property pointing to the 'CB_GraphicSprites.SPRITES_OBJECT' object where it belongs to and a function in its "getThis" property returning the same value (added automatically).
								data: undefined, //Object with any additional data desired which can be any kind. Default: CB_combineJSON(this.parent.data, this.data) || this.parent.data || { 'that' : CB_GraphicSprites.SPRITES_OBJECT, 'getThis' = function() { return this.that; } }.
							}
						]
					},
					//'my_sprite_2' ('CB_GraphicSprites.SPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the sprites group:
					{
						id: "my_sprite_2", //Identifier for the sprite. Optional but recommended. It should be unique. If not provided, it will be calculated automatically.
						src: undefined, //Source of origin. Can be a path or identifier of an image, text, bitmap, 3D object, etc. Optional but recommended. Default: this.parent.src || "".
						srcType: undefined, //Type of the source of origin. Optional. Default: this.parent.srcType || CB_GraphicSprites.SRC_TYPES_DEFAULT. You can use other values of the 'CB_GraphicSprites.SRC_TYPES' object or create new ones.
						srcLeft: undefined, //Left (horizontal) position in the original source (having in mind its real width and height). Unit agnostic (only numeric values allowed). Default: this.parent.srcLeft || CB_GraphicSprites.LEFT_SOURCE_DEFAULT.
						srcTop: undefined, //Top (vertical) position in the original source (having in mind its real width and height). Unit agnostic (only numeric values allowed). Default: this.parent.srcTop || CB_GraphicSprites.TOP_SOURCE_DEFAULT.
						srcWidth: undefined, //Width of the original source. Unit agnostic (only numeric values allowed). Default: this.parent.srcWidth || CB_GraphicSprites.WIDTH_SOURCE_DEFAULT.
						srcHeight: undefined, //Height of the original source. Unit agnostic (only numeric values allowed). Default: this.parent.srcHeight || CB_GraphicSprites.HEIGHT_SOURCE_DEFAULT.
						left: undefined, //Left (horizontal) position in the destiny (inside the sprites group). Unit agnostic (only numeric values allowed). Default: CB_GraphicSprites.LEFT_DEFAULT.
						top: undefined, //Top (vertical) position in the destiny (inside the sprites group). Unit agnostic (only numeric values allowed). Default: CB_GraphicSprites.TOP_DEFAULT.
						width: undefined, //Width of the destiny (inside the sprites group). Unit agnostic (only numeric values allowed). Default: this.parent.width || CB_GraphicSprites.WIDTH_DEFAULT.
						height: undefined, //Height of the destiny (inside the sprites group). Unit agnostic (only numeric values allowed). Default: this.parent.height || CB_GraphicSprites.HEIGHT_DEFAULT.
						zIndex: undefined, //The z-index for the destiny (inside the sprites group). Only numeric values allowed. Default: this.parent.zIndex || CB_GraphicSprites.ZINDEX_DEFAULT.
						disabled: false, //Tells whether this sprite is disabled or not. Regardless its value, it will be considered disabled if its sprites group parent is also disabled. Default: this.parent.disabled || false.
						//Object with any additional data desired which can be any kind:
						//NOTE: it will always have a "that" property pointing to the 'CB_GraphicSprites.SPRITES_OBJECT' object where it belongs to and a function in its "getThis" property returning the same value (added automatically).
						data: undefined, //Object with any additional data desired which can be any kind. Default: CB_combineJSON(this.parent.data, this.data) || this.parent.data || { 'that' : CB_GraphicSprites.SPRITES_OBJECT, 'getThis' = function() { return this.that; } }.
						//Numeric array containing 'CB_GraphicSprites.SUBSPRITE_OBJECT' objects with the sub-sprites that this sprite uses:
						subSprites:
						[
							//'my_subsprite_3' ('CB_GraphicSprites.SUBSPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the parent sprite:
							{
								id: "my_subsprite_3", //Identifier for the sub-sprite. Optional but recommended. It should be unique. If not provided, it will be calculated automatically.
								src: undefined, //Source of origin. Can be a path or identifier of an image, text, bitmap, 3D object, etc. Optional but recommended. Default: this.parent.src || "".
								srcType: undefined, //Type of the source of origin. Optional. Default: this.parent.srcType || CB_GraphicSprites.SRC_TYPES_DEFAULT. You can use other values of the 'CB_GraphicSprites.SRC_TYPES' object or create new ones.
								srcLeft: 30, //Left (horizontal) position in the original source (having in mind its real width and height). Unit agnostic (only numeric values allowed). Default: this.parent.srcLeft || CB_GraphicSprites.LEFT_SOURCE_DEFAULT.
								srcTop: 60, //Top (vertical) position in the original source (having in mind its real width and height). Unit agnostic (only numeric values allowed). Default: this.parent.srcTop || CB_GraphicSprites.TOP_SOURCE_DEFAULT.
								srcWidth: undefined, //Width of the original source. Unit agnostic (only numeric values allowed). Default: this.parent.srcWidth || CB_GraphicSprites.WIDTH_SOURCE_DEFAULT.
								srcHeight: undefined, //Height of the original source. Unit agnostic (only numeric values allowed). Default: this.parent.srcHeight || CB_GraphicSprites.HEIGHT_SOURCE_DEFAULT.
								left: undefined, //Left (horizontal) position in the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: CB_GraphicSprites.LEFT_DEFAULT.
								top: undefined, //Top (vertical) position in the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: CB_GraphicSprites.TOP_DEFAULT.
								width: undefined, //Width of the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: this.parent.width || CB_GraphicSprites.WIDTH_DEFAULT.
								height: undefined, //Height of the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: this.parent.height || CB_GraphicSprites.HEIGHT_DEFAULT.
								zIndex: undefined, //The z-index for the destiny (inside the sprite). Only numeric values allowed. Default: this.parent.zIndex || CB_GraphicSprites.ZINDEX_DEFAULT.
								disabled: false, //Tells whether this sub-sprite is disabled or not. Regardless its value, it will be considered disabled if its sprite parent is also disabled. Default: this.parent.disabled || false.
								//Object with any additional data desired which can be any kind:
								//NOTE: it will always have a "that" property pointing to the 'CB_GraphicSprites.SPRITES_OBJECT' object where it belongs to and a function in its "getThis" property returning the same value (added automatically).
								data: undefined, //Object with any additional data desired which can be any kind. Default: CB_combineJSON(this.parent.data, this.data) || this.parent.data || { 'that' : CB_GraphicSprites.SPRITES_OBJECT, 'getThis' = function() { return this.that; } }.
							},
							//'my_subsprite_4' ('CB_GraphicSprites.SUBSPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the parent sprite:
							{
								id: "my_subsprite_4", //Identifier for the sub-sprite. Optional but recommended. It should be unique. If not provided, it will be calculated automatically.
								src: undefined, //Source of origin. Can be a path or identifier of an image, text, bitmap, 3D object, etc. Optional but recommended. Default: this.parent.src || "".
								srcType: undefined, //Type of the source of origin. Optional. Default: this.parent.srcType || CB_GraphicSprites.SRC_TYPES_DEFAULT. You can use other values of the 'CB_GraphicSprites.SRC_TYPES' object or create new ones.
								srcLeft: 40, //Left (horizontal) position in the original source (having in mind its real width and height). Unit agnostic (only numeric values allowed). Default: this.parent.srcLeft || CB_GraphicSprites.LEFT_SOURCE_DEFAULT.
								srcTop: 80, //Top (vertical) position in the original source (having in mind its real width and height). Unit agnostic (only numeric values allowed). Default: this.parent.srcTop || CB_GraphicSprites.TOP_SOURCE_DEFAULT.
								srcWidth: undefined, //Width of the original source. Unit agnostic (only numeric values allowed). Default: this.parent.srcWidth || CB_GraphicSprites.WIDTH_SOURCE_DEFAULT.
								srcHeight: undefined, //Height of the original source. Unit agnostic (only numeric values allowed). Default: this.parent.srcHeight || CB_GraphicSprites.HEIGHT_SOURCE_DEFAULT.
								left: undefined, //Left (horizontal) position in the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: CB_GraphicSprites.LEFT_DEFAULT.
								top: undefined, //Top (vertical) position in the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: CB_GraphicSprites.TOP_DEFAULT.
								width: undefined, //Width of the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: this.parent.width || CB_GraphicSprites.WIDTH_DEFAULT.
								height: undefined, //Height of the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: this.parent.height || CB_GraphicSprites.HEIGHT_DEFAULT.
								zIndex: 2, //The z-index for the destiny (inside the sprite). Only numeric values allowed. Default: this.parent.zIndex || CB_GraphicSprites.ZINDEX_DEFAULT.
								disabled: false, //Tells whether this sub-sprite is disabled or not. Regardless its value, it will be considered disabled if its sprite parent is also disabled. Default: this.parent.disabled || false.
								//Object with any additional data desired which can be any kind:
								//NOTE: it will always have a "that" property pointing to the 'CB_GraphicSprites.SPRITES_OBJECT' object where it belongs to and a function in its "getThis" property returning the same value (added automatically).
								data: undefined, //Object with any additional data desired which can be any kind. Default: CB_combineJSON(this.parent.data, this.data) || this.parent.data || { 'that' : CB_GraphicSprites.SPRITES_OBJECT, 'getThis' = function() { return this.that; } }.
							}
						]
					}
				]
			},
			//'my_sprites_2' ('CB_GraphicSprites.SPRITES_OBJECT' object). Some missing or non-valid properties will will be inherited from the parent ('CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT' object):
			{
				id: "my_sprites_2", //Identifier of the sprites group (also used for the 'CB_GraphicSprites' object). Optional but recommended. It should be unique. If not provided, it will be calculated automatically.
				src: "path/to/image2.gif", //Source of origin. Can be a path or identifier of an image, text, bitmap, 3D object, etc. Optional but recommended. Default: this.parent.src || "".
				srcType: undefined, //Type of the source of origin. Optional. Default: this.parent.srcType || CB_GraphicSprites.SRC_TYPES_DEFAULT. You can use other values of the 'CB_GraphicSprites.SRC_TYPES' object or create new ones.
				srcLeft: undefined, //Left (horizontal) position in the original source (having in mind its real width and height). Unit agnostic (only numeric values allowed). Default: this.parent.srcLeft || CB_GraphicSprites.LEFT_SOURCE_DEFAULT.
				srcTop: undefined, //Top (vertical) position in the original source (having in mind its real width and height). Unit agnostic (only numeric values allowed). Default: this.parent.srcTop || CB_GraphicSprites.TOP_SOURCE_DEFAULT.
				srcWidth: undefined, //Width of the original source. Unit agnostic (only numeric values allowed). Default: this.parent.srcWidth || CB_GraphicSprites.WIDTH_SOURCE_DEFAULT.
				srcHeight: undefined, //Height of the original source. Unit agnostic (only numeric values allowed). Default: this.parent.srcHeight || CB_GraphicSprites.HEIGHT_SOURCE_DEFAULT.
				left: undefined, //Left (horizontal) position in the destiny. Unit agnostic (only numeric values allowed). Default: CB_GraphicSprites.LEFT_DEFAULT.
				top: undefined, //Top (vertical) position in the destiny. Unit agnostic (only numeric values allowed). Default: CB_GraphicSprites.TOP_DEFAULT.
				width: undefined, //Width of the destiny. Unit agnostic (only numeric values allowed). Default: this.parent.width || CB_GraphicSprites.WIDTH_DEFAULT.
				height: undefined, //Height of the destiny. Unit agnostic (only numeric values allowed). Default: this.parent.height || CB_GraphicSprites.HEIGHT_DEFAULT.
				zIndex: undefined, //The z-index for the destiny. Only numeric values allowed. Default: this.parent.zIndex || CB_GraphicSprites.ZINDEX_DEFAULT.
				disabled: false, //Tells whether this sprites group (and the 'CB_GraphicSprites' object itself) is disabled or not. Default: this.parent.disabled || false.
				//Object with any additional data desired which can be any kind:
				//NOTE: it will always have a "that" property pointing to the 'CB_GraphicSprites.SPRITES_OBJECT' object where it belongs to and a function in its "getThis" property returning the same value (added automatically).
				data: undefined, //Object with any additional data desired which can be any kind. Default: CB_combineJSON(this.parent.data, this.data) || this.parent.data || { 'that' : CB_GraphicSprites.SPRITES_OBJECT, 'getThis' = function() { return this.that; } }.
				//Numeric array containing 'CB_GraphicSprites.SPRITE_OBJECT' objects with all the sprites that will be used:
				sprites:
				[
					//'my_sprite_3' ('CB_GraphicSprites.SPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the sprites group:
					{
						id: "my_sprite_3", //Identifier for the sprite. Optional but recommended. It should be unique. If not provided, it will be calculated automatically.
						src: undefined, //Source of origin. Can be a path or identifier of an image, text, bitmap, 3D object, etc. Optional but recommended. Default: this.parent.src || "".
						srcType: undefined, //Type of the source of origin. Optional. Default: this.parent.srcType || CB_GraphicSprites.SRC_TYPES_DEFAULT. You can use other values of the 'CB_GraphicSprites.SRC_TYPES' object or create new ones.
						srcLeft: undefined, //Left (horizontal) position in the original source (having in mind its real width and height). Unit agnostic (only numeric values allowed). Default: this.parent.srcLeft || CB_GraphicSprites.LEFT_SOURCE_DEFAULT.
						srcTop: undefined, //Top (vertical) position in the original source (having in mind its real width and height). Unit agnostic (only numeric values allowed). Default: this.parent.srcTop || CB_GraphicSprites.TOP_SOURCE_DEFAULT.
						srcWidth: undefined, //Width of the original source. Unit agnostic (only numeric values allowed). Default: this.parent.srcWidth || CB_GraphicSprites.WIDTH_SOURCE_DEFAULT.
						srcHeight: undefined, //Height of the original source. Unit agnostic (only numeric values allowed). Default: this.parent.srcHeight || CB_GraphicSprites.HEIGHT_SOURCE_DEFAULT.
						left: undefined, //Left (horizontal) position in the destiny (inside the sprites group). Unit agnostic (only numeric values allowed). Default: CB_GraphicSprites.LEFT_DEFAULT.
						top: undefined, //Top (vertical) position in the destiny (inside the sprites group). Unit agnostic (only numeric values allowed). Default: CB_GraphicSprites.TOP_DEFAULT.
						width: undefined, //Width of the destiny (inside the sprites group). Unit agnostic (only numeric values allowed). Default: this.parent.width || CB_GraphicSprites.WIDTH_DEFAULT.
						height: undefined, //Height of the destiny (inside the sprites group). Unit agnostic (only numeric values allowed). Default: this.parent.height || CB_GraphicSprites.HEIGHT_DEFAULT.
						zIndex: undefined, //The z-index for the destiny (inside the sprites group). Only numeric values allowed. Default: this.parent.zIndex || CB_GraphicSprites.ZINDEX_DEFAULT.
						disabled: false, //Tells whether this sprite is disabled or not. Regardless its value, it will be considered disabled if its sprites group parent is also disabled. Default: this.parent.disabled || false.
						//Object with any additional data desired which can be any kind:
						//NOTE: it will always have a "that" property pointing to the 'CB_GraphicSprites.SPRITES_OBJECT' object where it belongs to and a function in its "getThis" property returning the same value (added automatically).
						data: undefined, //Object with any additional data desired which can be any kind. Default: CB_combineJSON(this.parent.data, this.data) || this.parent.data || { 'that' : CB_GraphicSprites.SPRITES_OBJECT, 'getThis' = function() { return this.that; } }.
						//Numeric array containing 'CB_GraphicSprites.SUBSPRITE_OBJECT' objects with the sub-sprites that this sprite uses:
						subSprites:
						[
							//'my_subsprite_5' ('CB_GraphicSprites.SUBSPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the parent sprite:
							{
								id: "my_subsprite_5", //Identifier for the sub-sprite. Optional but recommended. It should be unique. If not provided, it will be calculated automatically.
								src: undefined, //Source of origin. Can be a path or identifier of an image, text, bitmap, 3D object, etc. Optional but recommended. Default: this.parent.src || "".
								srcType: undefined, //Type of the source of origin. Optional. Default: this.parent.srcType || CB_GraphicSprites.SRC_TYPES_DEFAULT. You can use other values of the 'CB_GraphicSprites.SRC_TYPES' object or create new ones.
								srcLeft: 10, //Left (horizontal) position in the original source (having in mind its real width and height). Unit agnostic (only numeric values allowed). Default: this.parent.srcLeft || CB_GraphicSprites.LEFT_SOURCE_DEFAULT.
								srcTop: 20, //Top (vertical) position in the original source (having in mind its real width and height). Unit agnostic (only numeric values allowed). Default: this.parent.srcTop || CB_GraphicSprites.TOP_SOURCE_DEFAULT.
								srcWidth: undefined, //Width of the original source. Unit agnostic (only numeric values allowed). Default: this.parent.srcWidth || CB_GraphicSprites.WIDTH_SOURCE_DEFAULT.
								srcHeight: undefined, //Height of the original source. Unit agnostic (only numeric values allowed). Default: this.parent.srcHeight || CB_GraphicSprites.HEIGHT_SOURCE_DEFAULT.
								left: undefined, //Left (horizontal) position in the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: CB_GraphicSprites.LEFT_DEFAULT.
								top: undefined, //Top (vertical) position in the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: CB_GraphicSprites.TOP_DEFAULT.
								width: undefined, //Width of the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: this.parent.width || CB_GraphicSprites.WIDTH_DEFAULT.
								height: undefined, //Height of the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: this.parent.height || CB_GraphicSprites.HEIGHT_DEFAULT.
								zIndex: undefined, //The z-index for the destiny (inside the sprite). Only numeric values allowed. Default: this.parent.zIndex || CB_GraphicSprites.ZINDEX_DEFAULT.
								disabled: false, //Tells whether this sub-sprite is disabled or not. Regardless its value, it will be considered disabled if its sprite parent is also disabled. Default: this.parent.disabled || false.
								//Object with any additional data desired which can be any kind:
								//NOTE: it will always have a "that" property pointing to the 'CB_GraphicSprites.SPRITES_OBJECT' object where it belongs to and a function in its "getThis" property returning the same value (added automatically).
								data: undefined, //Object with any additional data desired which can be any kind. Default: CB_combineJSON(this.parent.data, this.data) || this.parent.data || { 'that' : CB_GraphicSprites.SPRITES_OBJECT, 'getThis' = function() { return this.that; } }.
							},
							//'my_subsprite_6' ('CB_GraphicSprites.SUBSPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the parent sprite:
							{
								id: "my_subsprite_6", //Identifier for the sub-sprite. Optional but recommended. It should be unique. If not provided, it will be calculated automatically.
								src: undefined, //Source of origin. Can be a path or identifier of an image, text, bitmap, 3D object, etc. Optional but recommended. Default: this.parent.src || "".
								srcType: undefined, //Type of the source of origin. Optional. Default: this.parent.srcType || CB_GraphicSprites.SRC_TYPES_DEFAULT. You can use other values of the 'CB_GraphicSprites.SRC_TYPES' object or create new ones.
								srcLeft: 20, //Left (horizontal) position in the original source (having in mind its real width and height). Unit agnostic (only numeric values allowed). Default: this.parent.srcLeft || CB_GraphicSprites.LEFT_SOURCE_DEFAULT.
								srcTop: 40, //Top (vertical) position in the original source (having in mind its real width and height). Unit agnostic (only numeric values allowed). Default: this.parent.srcTop || CB_GraphicSprites.TOP_SOURCE_DEFAULT.
								srcWidth: undefined, //Width of the original source. Unit agnostic (only numeric values allowed). Default: this.parent.srcWidth || CB_GraphicSprites.WIDTH_SOURCE_DEFAULT.
								srcHeight: undefined, //Height of the original source. Unit agnostic (only numeric values allowed). Default: this.parent.srcHeight || CB_GraphicSprites.HEIGHT_SOURCE_DEFAULT.
								left: undefined, //Left (horizontal) position in the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: CB_GraphicSprites.LEFT_DEFAULT.
								top: undefined, //Top (vertical) position in the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: CB_GraphicSprites.TOP_DEFAULT.
								width: undefined, //Width of the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: this.parent.width || CB_GraphicSprites.WIDTH_DEFAULT.
								height: undefined, //Height of the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: this.parent.height || CB_GraphicSprites.HEIGHT_DEFAULT.
								zIndex: 2, //The z-index for the destiny (inside the sprite). Only numeric values allowed. Default: this.parent.zIndex || CB_GraphicSprites.ZINDEX_DEFAULT.
								disabled: false, //Tells whether this sub-sprite is disabled or not. Regardless its value, it will be considered disabled if its sprite parent is also disabled. Default: this.parent.disabled || false.
								//Object with any additional data desired which can be any kind:
								//NOTE: it will always have a "that" property pointing to the 'CB_GraphicSprites.SPRITES_OBJECT' object where it belongs to and a function in its "getThis" property returning the same value (added automatically).
								data: undefined, //Object with any additional data desired which can be any kind. Default: CB_combineJSON(this.parent.data, this.data) || this.parent.data || { 'that' : CB_GraphicSprites.SPRITES_OBJECT, 'getThis' = function() { return this.that; } }.
							}
						]
					},
					//'my_sprite_4' ('CB_GraphicSprites.SPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the sprites group:
					{
						id: "my_sprite_4", //Identifier for the sprite. Optional but recommended. It should be unique. If not provided, it will be calculated automatically.
						src: undefined, //Source of origin. Can be a path or identifier of an image, text, bitmap, 3D object, etc. Optional but recommended. Default: this.parent.src || "".
						srcType: undefined, //Type of the source of origin. Optional. Default: this.parent.srcType || CB_GraphicSprites.SRC_TYPES_DEFAULT. You can use other values of the 'CB_GraphicSprites.SRC_TYPES' object or create new ones.
						srcLeft: undefined, //Left (horizontal) position in the original source (having in mind its real width and height). Unit agnostic (only numeric values allowed). Default: this.parent.srcLeft || CB_GraphicSprites.LEFT_SOURCE_DEFAULT.
						srcTop: undefined, //Top (vertical) position in the original source (having in mind its real width and height). Unit agnostic (only numeric values allowed). Default: this.parent.srcTop || CB_GraphicSprites.TOP_SOURCE_DEFAULT.
						srcWidth: undefined, //Width of the original source. Unit agnostic (only numeric values allowed). Default: this.parent.srcWidth || CB_GraphicSprites.WIDTH_SOURCE_DEFAULT.
						srcHeight: undefined, //Height of the original source. Unit agnostic (only numeric values allowed). Default: this.parent.srcHeight || CB_GraphicSprites.HEIGHT_SOURCE_DEFAULT.
						left: undefined, //Left (horizontal) position in the destiny (inside the sprites group). Unit agnostic (only numeric values allowed). Default: CB_GraphicSprites.LEFT_DEFAULT.
						top: undefined, //Top (vertical) position in the destiny (inside the sprites group). Unit agnostic (only numeric values allowed). Default: CB_GraphicSprites.TOP_DEFAULT.
						width: undefined, //Width of the destiny (inside the sprites group). Unit agnostic (only numeric values allowed). Default: this.parent.width || CB_GraphicSprites.WIDTH_DEFAULT.
						height: undefined, //Height of the destiny (inside the sprites group). Unit agnostic (only numeric values allowed). Default: this.parent.height || CB_GraphicSprites.HEIGHT_DEFAULT.
						zIndex: undefined, //The z-index for the destiny (inside the sprites group). Only numeric values allowed. Default: this.parent.zIndex || CB_GraphicSprites.ZINDEX_DEFAULT.
						disabled: false, //Tells whether this sprite is disabled or not. Regardless its value, it will be considered disabled if its sprites group parent is also disabled. Default: this.parent.disabled || false.
						//Object with any additional data desired which can be any kind:
						//NOTE: it will always have a "that" property pointing to the 'CB_GraphicSprites.SPRITES_OBJECT' object where it belongs to and a function in its "getThis" property returning the same value (added automatically).
						data: undefined, //Object with any additional data desired which can be any kind. Default: CB_combineJSON(this.parent.data, this.data) || this.parent.data || { 'that' : CB_GraphicSprites.SPRITES_OBJECT, 'getThis' = function() { return this.that; } }.
						//Numeric array containing 'CB_GraphicSprites.SUBSPRITE_OBJECT' objects with the sub-sprites that this sprite uses:
						subSprites:
						[
							//'my_subsprite_7' ('CB_GraphicSprites.SUBSPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the parent sprite:
							{
								id: "my_subsprite_7", //Identifier for the sub-sprite. Optional but recommended. It should be unique. If not provided, it will be calculated automatically.
								src: undefined, //Source of origin. Can be a path or identifier of an image, text, bitmap, 3D object, etc. Optional but recommended. Default: this.parent.src || "".
								srcType: undefined, //Type of the source of origin. Optional. Default: this.parent.srcType || CB_GraphicSprites.SRC_TYPES_DEFAULT. You can use other values of the 'CB_GraphicSprites.SRC_TYPES' object or create new ones.
								srcLeft: 30, //Left (horizontal) position in the original source (having in mind its real width and height). Unit agnostic (only numeric values allowed). Default: this.parent.srcLeft || CB_GraphicSprites.LEFT_SOURCE_DEFAULT.
								srcTop: 60, //Top (vertical) position in the original source (having in mind its real width and height). Unit agnostic (only numeric values allowed). Default: this.parent.srcTop || CB_GraphicSprites.TOP_SOURCE_DEFAULT.
								srcWidth: undefined, //Width of the original source. Unit agnostic (only numeric values allowed). Default: this.parent.srcWidth || CB_GraphicSprites.WIDTH_SOURCE_DEFAULT.
								srcHeight: undefined, //Height of the original source. Unit agnostic (only numeric values allowed). Default: this.parent.srcHeight || CB_GraphicSprites.HEIGHT_SOURCE_DEFAULT.
								left: undefined, //Left (horizontal) position in the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: CB_GraphicSprites.LEFT_DEFAULT.
								top: undefined, //Top (vertical) position in the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: CB_GraphicSprites.TOP_DEFAULT.
								width: undefined, //Width of the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: this.parent.width || CB_GraphicSprites.WIDTH_DEFAULT.
								height: undefined, //Height of the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: this.parent.height || CB_GraphicSprites.HEIGHT_DEFAULT.
								zIndex: undefined, //The z-index for the destiny (inside the sprite). Only numeric values allowed. Default: this.parent.zIndex || CB_GraphicSprites.ZINDEX_DEFAULT.
								disabled: false, //Tells whether this sub-sprite is disabled or not. Regardless its value, it will be considered disabled if its sprite parent is also disabled. Default: this.parent.disabled || false.
								//Object with any additional data desired which can be any kind:
								//NOTE: it will always have a "that" property pointing to the 'CB_GraphicSprites.SPRITES_OBJECT' object where it belongs to and a function in its "getThis" property returning the same value (added automatically).
								data: undefined, //Object with any additional data desired which can be any kind. Default: CB_combineJSON(this.parent.data, this.data) || this.parent.data || { 'that' : CB_GraphicSprites.SPRITES_OBJECT, 'getThis' = function() { return this.that; } }.
							},
							//'my_subsprite_8' ('CB_GraphicSprites.SUBSPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the parent sprite:
							{
								id: "my_subsprite_8", //Identifier for the sub-sprite. Optional but recommended. It should be unique. If not provided, it will be calculated automatically.
								src: undefined, //Source of origin. Can be a path or identifier of an image, text, bitmap, 3D object, etc. Optional but recommended. Default: this.parent.src || "".
								srcType: undefined, //Type of the source of origin. Optional. Default: this.parent.srcType || CB_GraphicSprites.SRC_TYPES_DEFAULT. You can use other values of the 'CB_GraphicSprites.SRC_TYPES' object or create new ones.
								srcLeft: 40, //Left (horizontal) position in the original source (having in mind its real width and height). Unit agnostic (only numeric values allowed). Default: this.parent.srcLeft || CB_GraphicSprites.LEFT_SOURCE_DEFAULT.
								srcTop: 80, //Top (vertical) position in the original source (having in mind its real width and height). Unit agnostic (only numeric values allowed). Default: this.parent.srcTop || CB_GraphicSprites.TOP_SOURCE_DEFAULT.
								srcWidth: undefined, //Width of the original source. Unit agnostic (only numeric values allowed). Default: this.parent.srcWidth || CB_GraphicSprites.WIDTH_SOURCE_DEFAULT.
								srcHeight: undefined, //Height of the original source. Unit agnostic (only numeric values allowed). Default: this.parent.srcHeight || CB_GraphicSprites.HEIGHT_SOURCE_DEFAULT.
								left: undefined, //Left (horizontal) position in the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: CB_GraphicSprites.LEFT_DEFAULT.
								top: undefined, //Top (vertical) position in the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: CB_GraphicSprites.TOP_DEFAULT.
								width: undefined, //Width of the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: this.parent.width || CB_GraphicSprites.WIDTH_DEFAULT.
								height: undefined, //Height of the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: this.parent.height || CB_GraphicSprites.HEIGHT_DEFAULT.
								zIndex: 2, //The z-index for the destiny (inside the sprite). Only numeric values allowed. Default: this.parent.zIndex || CB_GraphicSprites.ZINDEX_DEFAULT.
								disabled: false, //Tells whether this sub-sprite is disabled or not. Regardless its value, it will be considered disabled if its sprite parent is also disabled. Default: this.parent.disabled || false.
								//Object with any additional data desired which can be any kind:
								//NOTE: it will always have a "that" property pointing to the 'CB_GraphicSprites.SPRITES_OBJECT' object where it belongs to and a function in its "getThis" property returning the same value (added automatically).
								data: undefined, //Object with any additional data desired which can be any kind. Default: CB_combineJSON(this.parent.data, this.data) || this.parent.data || { 'that' : CB_GraphicSprites.SPRITES_OBJECT, 'getThis' = function() { return this.that; } }.
							}
						]
					}
				]
			}
		]
	 };
 
	//Creates the graphic sprites object:
	var myGraphicSpritesScene = new CB_GraphicSpritesScene(spritesGroupsData);
</code></pre>


<p>
	After creating the graphic sprites scene object (<a href="api/CB_GraphicSpritesScene.html" target="_blank">CB_GraphicSpritesScene</a> object), which will contain internal graphic sprites objects (<a href="api/CB_GraphicSprites.html" target="_blank">CB_GraphicSprites</a> objects), we can start managing it:
</p>
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	CB_console(myGraphicSpritesScene.isSpritesScene); //Always returns true (since it is a 'CB_GraphicSpritesScene' object).
	
	//Sets the desired value of a given property name to the 'CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT' object as well to its 'CB_GraphicSprites' objects and their children (their 'CB_GraphicSprites.SPRITES_OBJECT' object, including their 'CB_GraphicSprites.SPRITE_OBJECT' and their 'CB_GraphicSprites.SUBSPRITE_OBJECT' objects). Calls the 'CB_GraphicSprites#setPropertyCascade' method internally.
	myGraphicSpritesScene.setPropertyCascade("width", 120);
	myGraphicSpritesScene.setPropertyCascade("height", 200, true); //Only affects current sprite being pointed and its sub-sprites (and also the 'CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT' object and the 'CB_GraphicSprites.SPRITES_OBJECT' object of each 'CB_GraphicSprites' object).
	
	//Gets the 'CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT' object with all the sprites groups objects (same as 'myGraphicSpritesScene.getSpritesGroupsAll', similar to access the 'myGraphicSpritesScene.spritesGroups' property)
	var spritesGroups = myGraphicSpritesScene.getSpritesGroups(); //Returns undefined if not found.
	var spritesGroups_2 = myGraphicSpritesScene.getSpritesGroups(null); //Returns null if not found.
	
	//Shows information about the sprites groups object:
	CB_console(spritesGroups.isSpritesGroups); //Always returns true (since it is a 'CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT' object).
	CB_console(spritesGroups.type); //The type of element. Always contains the "spritesGroups" string. Not the same as 'myGraphicSpritesScene.type' (the 'type' property of 'CB_GraphicSpritesScene' objects always contains the "spritesScene" string).
	CB_console(spritesGroups.container); //Points to the 'CB_GraphicSpritesScene' object which contains it.
	CB_console(spritesGroups.parent); //Parent for the sprites groups object. Default: undefined.
	CB_console(spritesGroups.id); //Identifier of this groups of graphic sprites object (the same value will be in 'myGraphicSpritesScene.id'). It should be unique.
	CB_console(spritesGroups.src); //The value for the "src" property which will be used as default if not provided (or the provided one was wrong) when creating internal 'CB_GraphicSprites' objects (in the "items" property).
	CB_console(spritesGroups.srcType); //The value for the "srcType" property which will be used as default if not provided (or the provided one was wrong) when creating internal 'CB_GraphicSprites' objects (in the "items" property). It should point to a property of the 'CB_GraphicSprites.SRC_TYPES' object. You can use other values of the 'CB_GraphicSprites.SRC_TYPES' object or create new ones.
	CB_console(spritesGroups.srcLeft); //The value for the "srcLeft" property which will be used as default if not provided (or the provided one was wrong) when creating internal 'CB_GraphicSprites' objects (in the "items" property).
	CB_console(spritesGroups.srcTop); //The value for the "srcTop" property which will be used as default if not provided (or the provided one was wrong) when creating internal 'CB_GraphicSprites' objects (in the "items" property).
	CB_console(spritesGroups.srcWidth); //The value for the "srcWidth" property which will be used as default if not provided (or the provided one was wrong) when creating internal 'CB_GraphicSprites' objects (in the "items" property).
	CB_console(spritesGroups.srcHeight); //The value for the "srcHeight" property which will be used as default if not provided (or the provided one was wrong) when creating internal 'CB_GraphicSprites' objects (in the "items" property).
	CB_console(spritesGroups.left); //The value for the "left" property which will be used as default if not provided (or the provided one was wrong) when creating internal 'CB_GraphicSprites' objects (in the "items" property).
	CB_console(spritesGroups.top); //The value for the "top" property which will be used as default if not provided (or the provided one was wrong) when creating internal 'CB_GraphicSprites' objects (in the "items" property).
	CB_console(spritesGroups.width); //The value for the "width" property which will be used as default if not provided (or the provided one was wrong) when creating internal 'CB_GraphicSprites' objects (in the "items" property).
	CB_console(spritesGroups.height); //The value for the "height" property which will be used as default if not provided (or the provided one was wrong) when creating internal 'CB_GraphicSprites' objects (in the "items" property).
	CB_console(spritesGroups.zIndex); //The value for the "zIndex" property which will be used as default if not provided (or the provided one was wrong) when creating internal 'CB_GraphicSprites' objects (in the "items" property).
	CB_console(spritesGroups.data); //The value for the "data" property which will be used as default if not provided (or the provided one was wrong) when creating internal 'CB_GraphicSprites' objects (in the "items" property).
	CB_console(spritesGroups.data.that); //Returns the 'spritesGroups' object.
	CB_console(spritesGroups.data.getThis()); //Returns the same as 'spritesGroups.data.that'.
	CB_console(spritesGroups.data.datum_1); //Returns "value_1".
	CB_console(spritesGroups.data.datum_2); //Returns 2.
	CB_console(spritesGroups.data.datum_3); //Returns [ "a", "b", "c" ].
	CB_console(spritesGroups.data.getType()); //Returns the same as 'spritesGroups.type'.
	CB_console(spritesGroups.data.getGraphicSpritesObject()); //Returns the same as 'spritesGroups.container'.
	CB_console(spritesGroups.data.getParent()); //Returns the same as 'spritesGroups.parent'.
	CB_console(spritesGroups.spritesGroups); //Numeric array containing 'CB_GraphicSprites.SPRITES_OBJECT' objects with all the sprites groups which were used to create the internal 'CB_GraphicSprites' objects (in the "items" property).
	CB_console(spritesGroups.items); //Numeric array containing 'CB_GraphicSprites' objects created internally. Their "parent" property will have been set to point the current 'CB_GraphicSpritesScene' object which contains them ('myGraphicSpritesScene').
	
	//Gets an array with all the 'CB_GraphicSprites' objects created internally (same as 'myGraphicSpritesScene.getGraphicSpritesAll', similar to access the 'myGraphicSpritesScene.items' property):
	//NOTE: all the internally-created 'CB_GraphicSprites' objects have their "parent" modified to point to the 'CB_GraphicSpritesScene' object ('myGraphicSpritesScene').
	var spriteGraphicObjects = myGraphicSpritesScene.getAll(); //Returns undefined if not found.
	var spriteGraphicObjects_2 = myGraphicSpritesScene.getAll(null); //Returns null if not found.

	//Gets a desired 'CB_GraphicSprites' object through its index which is its position in the 'myGraphicSpritesScene.spritesGroups.items' array (same as 'myGraphicSpritesScene.getGraphicSprites'):
	var graphicSprite = myGraphicSpritesScene.get(1); //Gets the graphic sprite object in the position 1. Returns undefined if not found.
	var graphicSprite_2 = myGraphicSpritesScene.get(3, null); //Gets the graphic sprite object in the position 3. Returns null if not found.

	//Gets a desired 'CB_GraphicSprites' object through its identifier (same as 'myGraphicSpritesScene.getGraphicSpritesById'):
	var graphicSprite_3 = myGraphicSpritesScene.getById("my_sprites_1"); //Gets the graphic sprite object whose ID is "my_sprites_1". Returns undefined if not found.
	var graphicSprite_4 = myGraphicSpritesScene.getById("my_sprites_2", null); //Gets the graphic sprite object whose ID is "my_sprites_2". Returns null if not found.

	//We can also know the position of a 'CB_GraphicSprites' object in the array (the same array which is returned by 'myGraphicSpritesScene.getAll') through its identifier:
	var graphicSpriteIndex = myGraphicSpritesScene.getIndexById("my_sprites_2"); //Same 'myGraphicSpritesScene.getGraphicSpritesIndexById'.

	//Perform an action (execute a function) for each 'CB_GraphicSprites' object (being able to introduce a delay between each call):
	myGraphicSpritesScene.forEach //Same as 'myGraphicSpritesScene.forEachGraphicSprites', 'myGraphicSpritesScene.executeAll' and 'myGraphicSpritesScene.executeFunctionAll'.
	(
		function(graphicSprites, position, graphicSpritesArray, delay) //functionEach. 
		{
			CB_console("'CB_GraphicSprites' object in position #" + position + ":");
			CB_console(this); //Both 'this' and 'graphicSprites' point to the current object.
		},
		false, //orderedByZIndex. Optional. Default: false.
		1000, //delayBetweenEach. Optional. Default: 0. Can be either a positive number or a function returning a positive number.
		undefined, //sprites. Optional. Default: myGraphicSprites.getGraphicSpritesAll().
		true, //returnSetTimeoutsArray. Optional. Default: false.
		false, //delayBetweenEachAffectsFirst. Optional. Default: false.
		function(array, totalItemsLooped, delayMaximum) { CB_console("All iterations finished!"); } //functionFinish. Optional.
	); 
</code></pre>
<p>
	To know how to manage <a href="api/CB_GraphicSprites.html" target="_blank">CB_GraphicSprites</a> objects (and their sprites and sub-sprites), check the
	<a href="<?php echo basicTutorialLink("image", "graphic_sprites"); ?>" target="_blank"><?php echo $basicTutorial["image"]["topics"]["graphic_sprites"][$language]; ?></a> topic of the basic tutorial.
</p>


<p>
	It is possible to insert more sprites groups (which will create new internal <a href="api/CB_GraphicSprites.html" target="_blank">CB_GraphicSprites</a> objects) as well as removing them (the internal <a href="api/CB_GraphicSprites.html" target="_blank">CB_GraphicSprites</a> objects will also be removed). Here are some examples:
</p>
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Inserts the desired sprites groups (it will create internal 'CB_GraphicSprites' objects):
	myGraphicSpritesScene.insertSpritesGroups(spritesGroupsData); //The 'spritesGroupsData' parameter must be a 'CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT' object (same parameter as the constructor of the 'CB_GraphicSpritesScene' class).

	//Removes all the sprites groups (and all the 'CB_GraphicSprites' objects) by clearing the 'myGraphicSpritesScene.spritesGroups' property:
	myGraphicSpritesScene.removeAll(); //Same as 'myGraphicSpritesScene.removeSpritesGroups' and 'myGraphicSpritesScene.removeSpritesGroupsAll'.

	//Adds the desired group of graphic sprites and creates internal 'CB_GraphicSprites' objects (same as 'myGraphicSpritesScene.insertSpritesGroup'):
	myGraphicSpritesScene.insert(spritesGroup); //The 'spritesGroup' parameter must be a 'CB_GraphicSprites.SPRITES_OBJECT' object.

	//Removes a sprites group and its 'CB_GraphicSprites' object by its position in the 'myGraphicSpritesScene.spritesGroups.items' array (same as 'myGraphicSpritesScene.removeSpritesGroup' and 'myGraphicSpritesScene.removeGraphicSprites'):
	var graphicSpritesSceneRemoved = myGraphicSpritesScene.remove(1); //Tries to remove the 'CB_GraphicSprites' object in the position 1. Returns true if it gets removed or false otherwise.

	//Removes a sprites group and its 'CB_GraphicSprites' object by its ID (same as 'myGraphicSpritesScene.removeSpritesGroupById' and 'myGraphicSpritesScene.removeGraphicSpritesById'):
	var graphicSpritesSceneRemoved_2 = myGraphicSpritesScene.removeById("my_sprites_1"); //Tries to remove the 'CB_GraphicSprites' object whose index is "my_sprites_1". Returns true if it gets removed or false otherwise.
</code></pre>


<p>
	It is also possible to get a copy of a graphic sprites scene object:
</p>
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Gets a copy of the 'CB_GraphicSpritesScene' object:
	//Note: to copy its internal 'CB_GraphicSprites' objects individually, you can use the 'getCopy' method of each. To copy sprites and sub-sprites, you can also use the 'CB_copyObject' function.
	var myGraphicSpritesSceneCopy = myGraphicSpritesScene.getCopy();
</code></pre>


<p>
	In order to free memory and resources, it is possible to destroy the graphic sprites scene object:
</p>
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Destroys the graphic sprites scene object (removing all sprites groups and 'CB_GraphicSprites' objects, etc.) and frees memory:
	myGraphicSpritesScene.destructor();
</code></pre>


<p>
	Check the <a href="api/index.html" target="_blank">API documentation</a> to read more about the <a href="api/CB_GraphicSpritesScene.html" target="_blank">CB_GraphicSpritesScene</a> class.
</p>