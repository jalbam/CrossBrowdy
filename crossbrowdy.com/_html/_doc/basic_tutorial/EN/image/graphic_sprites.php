<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	When managing graphic sprites in CrossBrowdy, it is important to note that each graphic sprites object (<a href="_html/_doc/api/CB_GraphicSprites.html" target="_blank">CB_GraphicSprites</a> object) contains only one sprites group.
	Sprites groups (<a href="_html/_doc/api/CB_GraphicSprites.html" target="_blank">CB_GraphicSprites</a> objects) are useful objects to manage multiple sprites (and their sub-sprites) for the same graphic entity, allowing to point only one sprite at a time. The sprite pointed will represent the current state of this sprites group (which is the current state of the graphic entity).
	To manage multiple graphic entities, you should use one sprites group (a <a href="_html/_doc/api/CB_GraphicSprites.html" target="_blank">CB_GraphicSprites</a> object) for each of them.
	This can be done thanks to the <a href="_html/_doc/api/CB_GraphicSpritesScene.html" target="_blank">CB_GraphicSpritesScene</a> class
	(read more in the <a href="<?php echo basicTutorialLink("image", "graphic_sprites_scene"); ?>" target="_blank"><?php echo $basicTutorial["image"]["topics"]["graphic_sprites_scene"][$language]; ?></a> topic of the basic tutorial).
</p>

<p>
	Each sprites group (there is only one inside each <a href="_html/_doc/api/CB_GraphicSprites.html" target="_blank">CB_GraphicSprites</a> object) can contain multiple sprites and each sprite can contain multiple sub-sprites (which will compose the sprite and will be inside of it).
	Their source ("src" property) can be a text, an image, a bitmap, a 3D object, etc. So they can be used for any kind of source you may think of, including (but not limited to) one sprites sheet or more, one atlas or more, etc. or even a mix of all of them.
</p>

<p>
	It is important to understand that the <a href="_html/_doc/api/CB_GraphicSprites.html" target="_blank">CB_GraphicSprites</a> objects just provide a low-level way to manage different sprites (and their sub-sprites) for the same graphic entity and accept any kind of source and additional data (which can even include code), without providing advanced high-level features as graphic rendering.
	This makes these objects powerful enough to be adapted to virtually any rendering engine you may want (2D or 3D), having to manage most of the logic yourself.
</p>

<p>
	Here is an example of graphic sprites group management:
</p>
<pre><code class="language-javascript">
	//Defines the sprites group information ('CB_GraphicSprites.SPRITES_OBJECT' object):
	//Note: sprites and sub-sprites are always automatically ordered internally by their z-index, ascending order (remember to use the 'setZIndex' method of each if you want to modify it).
	var spritesGroupData =
	{
		//Sprites group ('CB_GraphicSprites.SPRITES_OBJECT' object). Some missing or non-valid properties will get a default value:
		src: "path/to/image.gif", //Source of origin. Can be a path or identifier of an image, text, bitmap, 3D object, etc. Optional but recommended. Default: "".
		srcWidth: 32, //Width of the original source. Unit agnostic (only numeric values allowed). Default: CB_GraphicSprites.WIDTH_SOURCE_DEFAULT.
		srcHeight: 64, //Height of the original source. Unit agnostic (only numeric values allowed). Default: CB_GraphicSprites.HEIGHT_SOURCE_DEFAULT.
		width: 64, //Width of the destiny. Unit agnostic (only numeric values allowed). Default: CB_GraphicSprites.WIDTH_DEFAULT.
		height: 128, //Height of the destiny. Unit agnostic (only numeric values allowed). Default: CB_GraphicSprites.HEIGHT_DEFAULT.
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
	};
	
	//Creates the graphic sprites object:
	var myGraphicSprites = new CB_GraphicSprites(spritesGroupData);
</code></pre>
<p>
	Note that many of the properties of the sub-sprites which were not provided or were not valid, will be inherited from the properties of their parent sprite.
	At the same time, when also not provided or not valid, the sprites will also inherit their properties but from their sprites group.
	Some properties are optional and will have a default value when not provided in the sprites group.
</p>

<p>
	Here is an extended example creating a graphic sprites object using more options:
</p>
<pre><code class="language-javascript">
	//Defines the sprites group information ('CB_GraphicSprites.SPRITES_OBJECT' object):
	//Note: sprites and sub-sprites are always automatically ordered internally by their z-index, ascending order (remember to use the 'setZIndex' method of each if you want to modify it).
	var spritesGroupData =
	{
		//'my_sprites_1' ('CB_GraphicSprites.SPRITES_OBJECT' object). Some missing or non-valid properties will get a default value:
		id: "my_sprites_1", //Identifier of the sprites group (also used for the 'CB_GraphicSprites' object). Optional but recommended. It should be unique. If not provided, it will be calculated automatically.
		parent: null, //Parent for the sprites group. It could be a 'CB_GraphicSpritesScene' object. Default: undefined.
		src: "path/to/image.gif", //Source of origin. Can be a path or identifier of an image, text, bitmap, 3D object, etc. Optional but recommended. Default: "".
		srcType: CB_GraphicSprites.SRC_TYPES.IMAGE, //Type of the source of origin. Optional. Default: CB_GraphicSprites.SRC_TYPES.DEFAULT. You can use other values of the 'CB_GraphicSprites.SRC_TYPES' object or create new ones.
		srcLeft: 10, //Left (horizontal) position in the original source (having in mind its real width and height). Unit agnostic (only numeric values allowed). Default: CB_GraphicSprites.LEFT_SOURCE_DEFAULT.
		srcTop: 20, //Top (vertical) position in the original source (having in mind its real width and height). Unit agnostic (only numeric values allowed). Default: CB_GraphicSprites.TOP_SOURCE_DEFAULT.
		srcWidth: 64, //Width of the original source. Unit agnostic (only numeric values allowed). Default: CB_GraphicSprites.WIDTH_SOURCE_DEFAULT.
		srcHeight: 32, //Height of the original source. Unit agnostic (only numeric values allowed). Default: CB_GraphicSprites.HEIGHT_SOURCE_DEFAULT.
		left: 10, //Left (horizontal) position in the destiny. Unit agnostic (only numeric values allowed). Default: CB_GraphicSprites.LEFT_DEFAULT.
		top: 20, //Top (vertical) position in the destiny. Unit agnostic (only numeric values allowed). Default: CB_GraphicSprites.TOP_DEFAULT.
		width: 64, //Width of the destiny. Unit agnostic (only numeric values allowed). Default: CB_GraphicSprites.WIDTH_DEFAULT.
		height: 32, //Height of the destiny. Unit agnostic (only numeric values allowed). Default: CB_GraphicSprites.HEIGHT_DEFAULT.
		zIndex: 1, //The z-index for the destiny. Only numeric values allowed. Default: CB_GraphicSprites.ZINDEX_DEFAULT.
		disabled: false, //Tells whether this sprites group (and the 'CB_GraphicSprites' object itself) is disabled or not. Default: false.
		//Object with any additional data desired which can be any kind:
		//NOTE: it will always have a "that" property pointing to the 'CB_GraphicSprites.SPRITES_OBJECT' object where it belongs to and a function in its "getThis" property returning the same value (added automatically).
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
		//Numeric array containing 'CB_GraphicSprites.SPRITE_OBJECT' objects with all the sprites that will be used:
		sprites:
		[
			//'my_sprite_1' ('CB_GraphicSprites.SPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the sprites group:
			{
				id: "my_sprite_1", //Identifier for the sprite. Optional but recommended. It should be unique. If not provided, it will be calculated automatically.
				src: undefined, //Source of origin. Can be a path or identifier of an image, text, bitmap, 3D object, etc. Optional but recommended. Default: this.parent.src || "".
				srcType: undefined, //Type of the source of origin. Optional. Default: this.parent.srcType || CB_GraphicSprites.SRC_TYPES.DEFAULT. You can use other values of the 'CB_GraphicSprites.SRC_TYPES' object or create new ones.
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
						srcType: undefined, //Type of the source of origin. Optional. Default: this.parent.srcType || CB_GraphicSprites.SRC_TYPES.DEFAULT. You can use other values of the 'CB_GraphicSprites.SRC_TYPES' object or create new ones.
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
						srcType: undefined, //Type of the source of origin. Optional. Default: this.parent.srcType || CB_GraphicSprites.SRC_TYPES.DEFAULT. You can use other values of the 'CB_GraphicSprites.SRC_TYPES' object or create new ones.
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
				srcType: undefined, //Type of the source of origin. Optional. Default: this.parent.srcType || CB_GraphicSprites.SRC_TYPES.DEFAULT. You can use other values of the 'CB_GraphicSprites.SRC_TYPES' object or create new ones.
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
						srcType: undefined, //Type of the source of origin. Optional. Default: this.parent.srcType || CB_GraphicSprites.SRC_TYPES.DEFAULT. You can use other values of the 'CB_GraphicSprites.SRC_TYPES' object or create new ones.
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
						srcType: undefined, //Type of the source of origin. Optional. Default: this.parent.srcType || CB_GraphicSprites.SRC_TYPES.DEFAULT. You can use other values of the 'CB_GraphicSprites.SRC_TYPES' object or create new ones.
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
	};
	
	//Creates the graphic sprites object:
	var myGraphicSprites = new CB_GraphicSprites(spritesGroupData);
</code></pre>
<p>
	The "data" property of each element (sprites group, sprite or sub-sprite) is an object which can be very useful. Inside you can store different values or even code to process each element accordingly, for example.
	This feature can be very powerful for adapting the graphic elements to any rendering engine or for any other purpose you may imagine.
	This object inside the "data" property will always have a "that" property pointing to the object which owns the "data" property and a function in its "getThis" property returning the same value (added automatically).
	These properties ("that" and "getThis") cannot be overridden.
</p>

<p>
	After creating the graphic sprites object (<a href="_html/_doc/api/CB_GraphicSprites.html" target="_blank">CB_GraphicSprites</a> object), we can start managing its sprites:
</p>
<pre><code class="language-javascript">
	CB_console(myGraphicSprites.isSprites); //Always returns true (since it is a 'CB_GraphicSprites' object).
	
	//Sets the desired value of a given property name to the 'CB_GraphicSprites.SPRITES_OBJECT' object as well to its children elements ('CB_GraphicSprites.SPRITE_OBJECT' and 'CB_GraphicSprites.SUBSPRITE_OBJECT' objects):
	myGraphicSprites.setPropertyCascade("width", 120);
	myGraphicSprites.setPropertyCascade("height", 200, true); //Only affects current sprite being pointed and its sub-sprites (and the 'CB_GraphicSprites.SPRITES_OBJECT' object too).
	
	//Tells whether the sprites group object (and the 'CB_GraphicSprites' object itself) is disabled or not:
	CB_console(myGraphicSprites.isDisabled()); //Internally, it checks the 'myGraphicSprites.spritesGroup.disabled' property.
	
	//Sets whether the sprites group object (and the 'CB_GraphicSprites' object itself) is disabled or enabled (internally, it edits the 'myGraphicSprites.spritesGroup.disabled' property):
	/* Note:
		Set the first parameter ("disabled") to true to disable it or to false to enable it. Default: false.
		Set the second parameter ("affectChildren") to true to also affect all the existing sprites and sub-sprites in the 'CB_GraphicSprites' object. Default: disabled (the "disabled" parameter).
	*/
	myGraphicSprites.setDisabled(); //Enables it.
	myGraphicSprites.setDisabled(false); //Enables it.
	myGraphicSprites.setDisabled(false, false); //Enables it.
	myGraphicSprites.setDisabled(false, true); //Enables it. It also affects all the sprites and sub-sprites.
	myGraphicSprites.setDisabled(true); //Disables it. It also affects all the sprites and sub-sprites.
	myGraphicSprites.setDisabled(true, false); //Disables it.
	myGraphicSprites.setDisabled(true, true); //Disables it. It also affects all the sprites and sub-sprites.
	
	//Gets the sprites group which is the internal 'CB_GraphicSprites.SPRITES_OBJECT' object (similar to accessing the 'myGraphicSprites.spritesGroup' property):
	var spritesGroup = myGraphicSprites.getSpritesGroup(); //Returns undefined if not found.
	var spritesGroup_2 = myGraphicSprites.getSpritesGroup(null); //Returns null if not found.

	//Gets information of the properties of the sprites group object:
	if (spritesGroup)
	{
		CB_console(spritesGroup.isSpritesGroup); //Always returns true (since it is a 'CB_GraphicSprites.SPRITES_OBJECT' object).
		CB_console(spritesGroup.type); //The type of element. Always contains the "spritesGroup" string. Read-only property. Not the same as 'myGraphicSprites.type' (the 'type' property of 'CB_GraphicSprites' objects always contains the "sprites" string).
		CB_console(spritesGroup.container); //Points to the 'CB_GraphicSprites' object which contains it.
		CB_console(spritesGroup.parent); //Parent for the sprites group.
		CB_console(spritesGroup.id); //Identifier of the group of graphic sprites (the same value will be in 'myGraphicSprites.id'). It should be unique.
		CB_console(spritesGroup.position); //Read-only property indicating the position of this {@link CB_GraphicSprites} object in the array which is set the "items" property inside the 'CB_GraphicSpritesScene#spritesGroups' object which is in the 'CB_GraphicSpritesScene' object parent (if any).
		CB_console(spritesGroup.positionByZIndex); //Read-only property indicating the position of this {@link CB_GraphicSprites} object in the array which is set the "itemsByZIndex" property inside the 'CB_GraphicSpritesScene#spritesGroups' object which is in the 'CB_GraphicSpritesScene' object parent (if any).
		CB_console(spritesGroup.src); //Source of origin. Can be a path or identifier of an image, text, bitmap, 3D object, etc.
		CB_console(spritesGroup.srcType); //Type of the source of origin. It should point to a property of the 'CB_GraphicSprites.SRC_TYPES' object. You can use other values of the 'CB_GraphicSprites.SRC_TYPES' object or create new ones.
		CB_console(spritesGroup.srcLeft); //Left (horizontal) position in the original source (having in mind its real width and height). Unit agnostic (numeric).
		CB_console(spritesGroup.srcTop); //Top (vertical) position in the original source (having in mind its real width and height). Unit agnostic (numeric)
		CB_console(spritesGroup.srcWidth); //Width of the original source. Unit agnostic (numeric).
		CB_console(spritesGroup.srcHeight); //Height of the original source. Unit agnostic (numeric)
		CB_console(spritesGroup.left); //Left (horizontal) position in the destiny. Unit agnostic (numeric).
		CB_console(spritesGroup.top); //Top (vertical) position in the destiny. Unit agnostic (numeric).
		CB_console(spritesGroup.width); //Width of the destiny. Unit agnostic (numeric).
		CB_console(spritesGroup.height); //Height of the destiny. Unit agnostic (numeric).
		CB_console(spritesGroup.zIndex); //The z-index for the destiny (numeric). The same value will be in 'myGraphicSprites.zIndex'. To set this property (or 'myGraphicSprites.zIndex' one), use the 'myGraphicSprites.setZIndex' method which will update automatically the internal array with elements ordered by their "zIndex".
		CB_console(spritesGroup.data); //Object with additional data. It will always have a "that" property pointing to the 'CB_GraphicSprites.SPRITES_OBJECT' object where it belongs to and a function in its "getThis" property returning the same value (added automatically).
		CB_console(spritesGroup.data.that); //Returns the 'spritesGroup' object.
		CB_console(spritesGroup.data.getThis()); //Returns the same as 'spritesGroup.data.that'.
		CB_console(spritesGroup.data.datum_1); //Returns "value_1".
		CB_console(spritesGroup.data.datum_2); //Returns 2.
		CB_console(spritesGroup.data.datum_3); //Returns [ "a", "b", "c" ].
		CB_console(spritesGroup.data.getType()); //Returns the same as 'spritesGroup.type'.
		CB_console(spritesGroup.data.getGraphicSpritesObject()); //Returns the same as 'spritesGroup.container'.
		CB_console(spritesGroup.data.getParent()); //Returns the same as 'spritesGroup.parent'.
		CB_console(spritesGroup.sprites); //Array with all the sprites ('CB_GraphicSprites.SPRITE_OBJECT' objects).
		
		//Changes the z-index of the sprites group and of the CB_GraphicSprites object itself:
		myGraphicSprites.setZIndex(123); //It will update automatically the internal array with elements ordered by their "zIndex".
	}
	
	//Gets an array with all the sprites ('CB_GraphicSprites.SPRITE_OBJECT' objects), same as 'myGraphicSprites.getSpritesAll' and 'myGraphicSprites.getAll':
	//NOTE: this will return the same as the "sprites" property of the object returned by 'myGraphicSprites.getSpritesGroup'.
	var sprites = myGraphicSprites.getSprites(); //Returns undefined if not found.
	var sprites = myGraphicSprites.getSprites(true); //Sorted by their z-index. Returns undefined if not found.
	var sprites_2 = myGraphicSprites.getSprites(false, null); //Returns null if not found.
	var sprites = myGraphicSprites.getSprites(true, true); //Sorted by their z-index. Returns null if not found.
	
	//Gets information of each sprite object:
	var showSpriteInfo = function(sprite)
	{
		if (sprite)
		{
			CB_console(sprite.isSprite); //Always returns true (since it is a 'CB_GraphicSprites.SPRITE_OBJECT' object).
			CB_console(sprite.type); //The type of element. Always contains the "sprite" string. Read-only property.
			CB_console(sprite.container); //Points to the 'CB_GraphicSprites' object which contains it.
			CB_console(sprite.parent); //Read-only property pointing to its sprites group parent ('CB_GraphicSprites.SPRITES_OBJECT' object).
			CB_console(sprite.id); //Identifier of the sprite. It should be unique.
			CB_console(spritesGroup.position); //Read-only property indicating the position of this sub-sprite in the array which is set the "sprites" property of the sprite parent ('CB_GraphicSprites.SPRITES_OBJECT' object).
			CB_console(sprite.positionByZIndex); //Read-only property indicating the position of this sub-sprite in the array which is set the "spritesByZIndex" property of the sprite parent ('CB_GraphicSprites.SPRITES_OBJECT' object).
			CB_console(sprite.src); //Source of origin. Can be a path or identifier of an image, text, bitmap, 3D object, etc.
			CB_console(sprite.srcType); //Type of the source of origin. It should point to a property of the 'CB_GraphicSprites.SRC_TYPES' object. You can use other values of the 'CB_GraphicSprites.SRC_TYPES' object or create new ones.
			CB_console(sprite.srcLeft); //Left (horizontal) position in the original source (having in mind its real width and height). Unit agnostic (numeric).
			CB_console(sprite.srcTop); //Top (vertical) position in the original source (having in mind its real width and height). Unit agnostic (numeric).
			CB_console(sprite.srcWidth); //Width of the original source. Unit agnostic (numeric).
			CB_console(sprite.srcHeight); //Height of the original source. Unit agnostic (numeric).
			CB_console(sprite.left); //Left (horizontal) position in the destiny (inside the sprites group). Unit agnostic (numeric).
			CB_console(sprite.top); //Top (vertical) position in the destiny (inside the sprites group). Unit agnostic (numeric).
			CB_console(sprite.width); //Width of the destiny (inside the sprites group). Unit agnostic (numeric).
			CB_console(sprite.height); //Height of the destiny (inside the sprites group). Unit agnostic (numeric).
			CB_console(sprite.zIndex); //The z-index for the destiny inside the sprites group (numeric). To set this property, use the 'setIndex' method of the sprite object (or the 'myGraphicSprites.setZIndexSprite' method) which will update automatically the internal array with elements ordered by their "zIndex".
			CB_console(sprite.data); //Object with additional data. It will always have a "that" property pointing to the 'CB_GraphicSprites.SPRITES_OBJECT' object where it belongs to and a function in its "getThis" property returning the same value (added automatically).
			CB_console(sprite.data.that); //Returns the 'sprite' object.
			CB_console(sprite.data.getThis()); //Returns the same as 'sprite.data.that'.
			CB_console(sprite.data.datum_1); //Returns "value_1".
			CB_console(sprite.data.datum_2); //Returns 2.
			CB_console(sprite.data.datum_3); //Returns [ "a", "b", "c" ].
			CB_console(sprite.data.getType()); //Returns the same as 'sprite.type'.
			CB_console(sprite.data.getGraphicSpritesObject()); //Returns the same as 'sprite.container'.
			CB_console(sprite.data.getParent()); //Returns the same as 'sprite.parent'.
			CB_console(sprite.subSprites); //Array containing all the sub-sprites ('CB_GraphicSprites.SUBSPRITE_OBJECT' objects) that this sprite uses.
			
			//Changes the z-index of the sprite object:
			sprite.setZIndex(123); //It will update automatically the internal array with elements ordered by their "zIndex". Calls 'myGraphicSprites.setZIndexSprite' internally.
		}
	}
	if (sprites)
	{
		for (var x = sprites.length - 1; x >= 0; x--)
		{
				CB_console("Sprite object in position #" + x + ":");
				showSpriteInfo(sprites[x]);
		}
	}

	//Another way to perform an action (execute a function) for each sprite (being able to introduce a delay between each call):
	myGraphicSprites.forEach //Same as 'myGraphicSprites.forEachSprite', 'myGraphicSprites.executeAll' and 'myGraphicSprites.executeFunctionAll'.
	(
		function(sprite, position, spritesArray, delay) //functionEach. 
		{
			CB_console("Sprite object in position #" + position + ":");
			showSpriteInfo(sprite);
		},
		false, //orderedByZIndex. Optional. Default: false.
		1000, //delayBetweenEach. Optional. Default: 0. Can be either a positive number or a function returning a positive number.
		undefined, //sprites. Optional. Default: myGraphicSprites.getSprites().
		true, //returnSetTimeoutsArray. Optional. Default: false.
		false, //delayBetweenEachAffectsFirst. Optional. Default: false.
		function(array, totalItemsLooped, delayMaximum) { CB_console("All iterations finished!"); } //functionFinish. Optional.
	);
	
	//Gets a desired sprite ('CB_GraphicSprites.SPRITE_OBJECT' object, containing all the properties) through its position in the array (the same array which is returned by 'myGraphicSprites.getSprites'):
	//NOTE: same as 'myGraphicSprites.getSprite'.
	var sprite = myGraphicSprites.get(); //Gets the first sprite object (same as using the position zero). Returns undefined if not found.
	var sprite_1 = myGraphicSprites.get(undefined, null); //Gets the first sprite object (same as using the position zero). Returns null if not found.
	var sprite_2 = myGraphicSprites.get(1); //Gets the sprite object in the position 1. Returns undefined if not found.
	var sprite_3 = myGraphicSprites.get(5, null); //Gets the sprite object in the position 5. Returns null if not found.
	
	//Gets a desired sprite ('CB_GraphicSprites.SPRITE_OBJECT' object, containing all the properties) through its identifier:
	//NOTE: same as 'myGraphicSprites.getSpriteById'.
	var sprite_4 = myGraphicSprites.getById("my_sprite_1"); //Gets the sprite object whose ID is "my_sprite_1". Returns undefined if not found.
	var sprite_5 = myGraphicSprites.getById("my_sprite_id", null); //Gets the sprite object whose ID is "my_sprite_id". Returns null if not found.
	
	//Sets the desired value of a given property name to the sprite ('CB_GraphicSprites.SPRITE_OBJECT' object) and its sub-sprites ('CB_GraphicSprites.SUBSPRITE_OBJECT' objects):
	sprite.setPropertyCascade("width", 120);
	
	//Gets information of the sprite object:
	showSpriteInfo(sprite);
	
	//We can also know the position of a sprite in the array (the same array which is returned by 'myGraphicSprites.getSprites') through its identifier:
	var spriteIndex = myGraphicSprites.getIndexById("my_sprite_2"); //Returns -1 if not found. Same as 'myGraphicSprites.getSpriteIndexById'.
	
	//Tells whether a sprite is disabled or not. Internally, it checks its "disabled" property and also the 'myGraphicSprites.spritesGroup.disabled' property (calling the 'myGraphicSprites.isDisabled' method internally):
	//Note: a sprite is considered disabled if its sprites group parent is also disabled.
	var spriteDisabled = sprite.isDisabled();
	var spriteDisabled_2 = myGraphicSprites.isDisabledSprite(sprite); //Another way to check whether it is disabled or not.
	
	//Sets a desired sprite disabled or enabled (internally, it edits its "disabled" property):
	/* Note:
		The first parameter ("sprite") is the sprite we want to affect (do not provide one to default in the current one being pointed).
		Set the second parameter ("disabled") to true to disable it or to false to enable it. Default: false.
		Set the third parameter ("affectSubSprites") to true to also affect all the sub-sprites of the sprite (if the "affectParentsChildren" parameter if set to true, they will be affected anyway). Default: disabled (the "disabled" parameter).
		Set the fourth parameter ("affectParent") to true to also affect the sprites group object (which is considered the status of the whole 'CB_GraphicSprites' object). Default: affectParentChildren || !disabled (the "disabled" parameter).
		Set the fifth parameter ("affectParentChildren") to true also affect the sprites and sub-sprites of the sprites group object (which is considered the status of the whole 'CB_GraphicSprites' object). Default: !disabled (the "disabled" parameter).
		If "affectParentChildren" is set to true and the "affectParents" is also set to true, it will also modify the "disabled" property of all the existing sprites and sub-sprites in the 'CB_GraphicSprites' object.
		The "affectParentChildren" parameter is ignored if the "affectParents" parameter is set to false.
	*/
	myGraphicSprites.setDisabledSprite(sprite); //Enables it. Also affects the sprites group object (and the 'CB_GraphicSprites' object itself), including all the sprites and sub-sprites.
	myGraphicSprites.setDisabledSprite(sprite, false); //Enables it. Also affects the sprites group object (and the 'CB_GraphicSprites' object itself), including all the sprites and sub-sprites.
	myGraphicSprites.setDisabledSprite(sprite, false, false); //Enables it. Also affects the sprites group object (and the 'CB_GraphicSprites' object itself), including all the sprites and sub-sprites.
	myGraphicSprites.setDisabledSprite(sprite, false, true); //Enables it. Also affects the sprites group object (and the 'CB_GraphicSprites' object itself), including all the sprites and sub-sprites.
	myGraphicSprites.setDisabledSprite(sprite, false, true, false); //Enables it. It also affects all its sub-sprites.
	myGraphicSprites.setDisabledSprite(sprite, false, true, false, false); //Enables it. It also affects all its sub-sprites.
	myGraphicSprites.setDisabledSprite(sprite, false, true, false, true); //Enables it. It also affects all its sub-sprites.
	myGraphicSprites.setDisabledSprite(sprite, false, true, true); //Enables it. Also affects the sprites group object (and the 'CB_GraphicSprites' object itself), including all the sprites and sub-sprites.
	myGraphicSprites.setDisabledSprite(sprite, false, true, true, false); //Enables it. Also affects its sub-scripts and the sprites group object (and the 'CB_GraphicSprites' object itself), but not all the rest of sprites and sub-sprites.
	myGraphicSprites.setDisabledSprite(sprite, false, true, true, true); //Enables it. Also affects the sprites group object (and the 'CB_GraphicSprites' object itself), including all the sprites and sub-sprites.
	myGraphicSprites.setDisabledSprite(sprite, true); //Disables it. It also affects all its sub-sprites.
	myGraphicSprites.setDisabledSprite(sprite, true, false); //Disables it.
	myGraphicSprites.setDisabledSprite(sprite, true, false, false); //Disables it.
	myGraphicSprites.setDisabledSprite(sprite, true, false, true); //Disables it. Also affects its sub-scripts and the sprites group object (and the 'CB_GraphicSprites' object itself), but not all the rest of sprites and sub-sprites.
	myGraphicSprites.setDisabledSprite(sprite, true, false, true, false); //Disables it. Also affects its sub-scripts and the sprites group object (and the 'CB_GraphicSprites' object itself), but not all the rest of sprites and sub-sprites.
	myGraphicSprites.setDisabledSprite(sprite, true, false, true, true); //Disables it. Also affects the sprites group object (and the 'CB_GraphicSprites' object itself), including all the sprites and sub-sprites.
	myGraphicSprites.setDisabledSprite(sprite, true, true); //Disables it. It also affects all its sub-sprites.
	myGraphicSprites.setDisabledSprite(sprite, true, true, false); //Disables it. It also affects all its sub-sprites.
	myGraphicSprites.setDisabledSprite(sprite, true, true, false, false); //Disables it. It also affects all its sub-sprites.
	myGraphicSprites.setDisabledSprite(sprite, true, true, false, true); //Disables it. It also affects all its sub-sprites.
	myGraphicSprites.setDisabledSprite(sprite, true, true, true); //Disables it. It also affects the sprites group object (and the 'CB_GraphicSprites' object itself), but not all the rest of sprites and sub-sprites.
	myGraphicSprites.setDisabledSprite(sprite, true, true, true, false); //Disables it. It also affects its sub-scripts and the sprites group object (and the 'CB_GraphicSprites' object itself), but not all the rest of sprites and sub-sprites.
	myGraphicSprites.setDisabledSprite(sprite, true, true, true, true); //Disables it. It also affects the sprites group object (and the 'CB_GraphicSprites' object itself), including all the sprites and sub-sprites.

	//Another way to sets a desired sprite disabled or enabled (internally, it calls the 'myGraphicSprites.setDisabledSprite' method):
	/* Note:
		Set the first parameter ("disabled") to true to disable it or to false to enable it. Default: false.
		Set the second parameter ("affectSubSprites") to true to also affect all the sub-sprites of the sprite (if the "affectParentsChildren" parameter if set to true, they will be affected anyway). Default: disabled (the "disabled" parameter).
		Set the third parameter ("affectParent") to true to also affect the sprites group object (which is considered the status of the whole 'CB_GraphicSprites' object). Default: affectParentChildren || !disabled (the "disabled" parameter).
		Set the fourth parameter ("affectParentChildren") to true also affect the sprites and sub-sprites of the sprites group object (which is considered the status of the whole 'CB_GraphicSprites' object). Default: !disabled (the "disabled" parameter).
		If "affectParentChildren" is set to true and the "affectParents" is also set to true, it will also modify the "disabled" property of all the existing sprites and sub-sprites in the 'CB_GraphicSprites' object.
		The "affectParentChildren" parameter is ignored if the "affectParents" parameter is set to false.
	*/
	sprite.setDisabled(); //Enables it. Also affects the sprites group object (and the 'CB_GraphicSprites' object itself), including all the sprites and sub-sprites.
	sprite.setDisabled(false); //Enables it. Also affects the sprites group object (and the 'CB_GraphicSprites' object itself), including all the sprites and sub-sprites.
	sprite.setDisabled(false, false); //Enables it. Also affects the sprites group object (and the 'CB_GraphicSprites' object itself), including all the sprites and sub-sprites.
	sprite.setDisabled(false, true); //Enables it. Also affects the sprites group object (and the 'CB_GraphicSprites' object itself), including all the sprites and sub-sprites.
	sprite.setDisabled(false, true, false); //Enables it. It also affects all its sub-sprites.
	sprite.setDisabled(false, true, false, false); //Enables it. It also affects all its sub-sprites.
	sprite.setDisabled(false, true, false, true); //Enables it. It also affects all its sub-sprites.
	sprite.setDisabled(false, true, true); //Enables it. Also affects the sprites group object (and the 'CB_GraphicSprites' object itself), including all the sprites and sub-sprites.
	sprite.setDisabled(false, true, true, false); //Enables it. Also affects its sub-scripts and the sprites group object (and the 'CB_GraphicSprites' object itself), but not all the rest of sprites and sub-sprites.
	sprite.setDisabled(false, true, true, true); //Enables it. Also affects the sprites group object (and the 'CB_GraphicSprites' object itself), including all the sprites and sub-sprites.
	sprite.setDisabled(true); //Disables it. It also affects all its sub-sprites.
	sprite.setDisabled(true, false); //Disables it.
	sprite.setDisabled(true, false, false); //Disables it.
	sprite.setDisabled(true, false, true); //Disables it. Also affects its sub-scripts and the sprites group object (and the 'CB_GraphicSprites' object itself), but not all the rest of sprites and sub-sprites.
	sprite.setDisabled(true, false, true, false); //Disables it. Also affects its sub-scripts and the sprites group object (and the 'CB_GraphicSprites' object itself), but not all the rest of sprites and sub-sprites.
	sprite.setDisabled(true, false, true, true); //Disables it. Also affects the sprites group object (and the 'CB_GraphicSprites' object itself), including all the sprites and sub-sprites.
	sprite.setDisabled(true, true); //Disables it. It also affects all its sub-sprites.
	sprite.setDisabled(true, true, false); //Disables it. It also affects all its sub-sprites.
	sprite.setDisabled(true, true, false, false); //Disables it. It also affects all its sub-sprites.
	sprite.setDisabled(true, true, false, true); //Disables it. It also affects all its sub-sprites.
	sprite.setDisabled(true, true, true); //Disables it. It also affects the sprites group object (and the 'CB_GraphicSprites' object itself), but not all the rest of sprites and sub-sprites.
	sprite.setDisabled(true, true, true, false); //Disables it. It also affects its sub-scripts and the sprites group object (and the 'CB_GraphicSprites' object itself), but not all the rest of sprites and sub-sprites.
	sprite.setDisabled(true, true, true, true); //Disables it. It also affects the sprites group object (and the 'CB_GraphicSprites' object itself), including all the sprites and sub-sprites.
</code></pre>

<p>
	We can also manage the sub-sprites of a sprite:
</p>
<pre><code class="language-javascript">
	//Gets an array with all the sub-sprites ('CB_GraphicSprites.SUBSPRITE_OBJECT' objects) of a given sprite ('CB_GraphicSprites.SPRITE_OBJECT' object):
	var sprite = myGraphicSprites.get(1); //Gets the sprite object in the position 1.
	var subSprites = myGraphicSprites.getSubSprites(sprite); //Returns undefined if not found.
	var subSprites_2 = myGraphicSprites.getSubSprites(sprite, null); //Returns null if not found.

	//Another way to get all the sub-sprites:
	var subSprites_3 = sprite.getAll(); //Same as 'sprite.getSubSprites'.

	//Gets information of each sub-sprite object:
	var showSubSpriteInfo = function(subSprite)
	{
		if (subSprite)
		{
			CB_console(subSprite.isSubSprite); //Always returns true (since it is a 'CB_GraphicSprites.SUBSPRITE_OBJECT' object).
			CB_console(subSprite.type); //The type of element. Always contains the "subSprite" string. Read-only property.
			CB_console(subSprite.container); //Points to the 'CB_GraphicSprites' object which contains it.
			CB_console(subSprite.parent); //Read-only property pointing to its sprite parent ('CB_GraphicSprites.SPRITE_OBJECT' object).
			CB_console(subSprite.id); //Identifier of the sub-sprite. It should be unique.
			CB_console(subSprite.position); //Read-only property indicating the position of this sub-sprite in the array which is set the "subSprites" property of the sprite parent ('CB_GraphicSprites.SPRITE_OBJECT' object).
			CB_console(subSprite.positionByZIndex); //Read-only property indicating the position of this sub-sprite in the array which is set the "subSpritesByZIndex" property of the sprite parent ('CB_GraphicSprites.SPRITE_OBJECT' object).
			CB_console(subSprite.src); //Source of origin. Can be a path or identifier of an image, text, bitmap, 3D object, etc.
			CB_console(subSprite.srcType); //Type of the source of origin. It should point to a property of the 'CB_GraphicSprites.SRC_TYPES' object. You can use other values of the 'CB_GraphicSprites.SRC_TYPES' object or create new ones.
			CB_console(subSprite.srcLeft); //Left (horizontal) position in the original source (having in mind its real width and height). Unit agnostic (numeric).
			CB_console(subSprite.srcTop); //Top (vertical) position in the original source (having in mind its real width and height). Unit agnostic (numeric).
			CB_console(subSprite.srcWidth); //Width of the original source. Unit agnostic (numeric).
			CB_console(subSprite.srcHeight); //Height of the original source. Unit agnostic (numeric).
			CB_console(subSprite.left); //Left (horizontal) position in the destiny (inside the sprite). Unit agnostic (numeric).
			CB_console(subSprite.top); //Top (vertical) position in the destiny (inside the sprite). Unit agnostic (numeric).
			CB_console(subSprite.width); //Width of the destiny (inside the sprite). Unit agnostic (numeric).
			CB_console(subSprite.height); //Height of the destiny (inside the sprite). Unit agnostic (numeric).
			CB_console(subSprite.zIndex); //The z-index for the destiny inside the sprite (numeric). To set this property, use the 'setIndex' method of the sub-sprite object (or the 'myGraphicSprites.setZIndexSubSprite' method) which will update automatically the internal array with elements ordered by their "zIndex".
			CB_console(subSprite.data); //Object with additional data. It will always have a "that" property pointing to the 'CB_GraphicSprites.SPRITES_OBJECT' object where it belongs to and a function in its "getThis" property returning the same value (added automatically).
			CB_console(subSprite.data.that); //Returns the 'subSprite' object.
			CB_console(subSprite.data.getThis()); //Returns the same as 'subSprite.data.that'.
			CB_console(subSprite.data.datum_1); //Returns "value_1".
			CB_console(subSprite.data.datum_2); //Returns 2.
			CB_console(subSprite.data.datum_3); //Returns [ "a", "b", "c" ].
			CB_console(subSprite.data.getType()); //Returns the same as 'subSprite.type'.
			CB_console(subSprite.data.getParent()); //Returns the same as 'subSprite.parent'.
			CB_console(subSprite.data.getGraphicSpritesObject()); //Returns the same as 'subSprite.container'.
			
			//Changes the z-index of the sub-sprite object:
			subSprite.setZIndex(999); //It will update automatically the internal array with elements ordered by their "zIndex". Calls 'myGraphicSprites.setZIndexSubSprite' internally.
		}
	}
	if (subSprites)
	{
		for (var x = subSprites.length - 1; x >= 0; x--)
		{
			CB_console("Sub-sprite object in position #" + x + ":");
			showSubSpriteInfo(subSprites[x]);
		}
	}

	//Another way to perform an action (execute a function) for each sub-sprite (being able to introduce a delay between each call):
	myGraphicSprites.forEach //Same as 'myGraphicSprites.forEachSprite', 'myGraphicSprites.executeAll' and 'myGraphicSprites.executeFunctionAll'.
	(
		function(sprite, positionSprite)
		{
			myGraphicSprites.forEachSubSprite //Same as 'myGraphicSprites.executeAllSubSprites' and 'myGraphicSprites.executeFunctionAllSubSprites'.
			(
				function(subSprite, position, subSpritesArray, delay) //functionEach. 
				{
					CB_console("Sub-sprite object in position #" + positionSprite + "." + position + ":");
					showSubSpriteInfo(subSprite);
				},
				false, //orderedByZIndex. Optional. Default: false.
				1000, //delayBetweenEach. Optional. Default: 0. Can be either a positive number or a function returning a positive number.
				this, //sprite. Optional. Default: myGraphicSprites.getCurrent().
				true, //returnSetTimeoutsArray. Optional. Default: false.
				false, //delayBetweenEachAffectsFirst. Optional. Default: false.
				function(array, totalItemsLooped, delayMaximum) { CB_console("All iterations finished!"); } //functionFinish. Optional.
			)
		}
	);
	
	//Another way more to perform an action (execute a function) for each sub-sprite (being able to introduce a delay between each call)
	myGraphicSprites.forEach //Same as 'myGraphicSprites.forEachSprite', 'myGraphicSprites.executeAll' and 'myGraphicSprites.executeFunctionAll'.
	(
		function(sprite, positionSprite)
		{
			sprite.forEach //Same as 'sprite.executeAll' and 'sprite.executeFunctionAll'.
			(
				function(subSprite, position, subSpritesArray, delay) //functionEach. 
				{
					CB_console("Sub-sprite object in position #" + positionSprite + "." + position + ":");
					showSubSpriteInfo(subSprite);
				},
				false, //orderedByZIndex. Optional. Default: false.
				1000, //delayBetweenEach. Optional. Default: 0. Can be either a positive number or a function returning a positive number.
				true, //returnSetTimeoutsArray. Optional. Default: false.
				false, //delayBetweenEachAffectsFirst. Optional. Default: false.
				function(array, totalItemsLooped, delayMaximum) { CB_console("All iterations finished!"); } //functionFinish. Optional.
			)
		}
	);

	//Gets a desired sub-sprite ('CB_GraphicSprites.SUBSPRITE_OBJECT' object) through its index which is its position in the array which is in the "subSprites" property of the given sprite ('CB_GraphicSprites.SPRITE_OBJECT' object):
	var subSprite = myGraphicSprites.getSubSprite(); //Gets the first sub-sprite object (same as using the position zero) from the current sprite (which is being pointed). Returns undefined if not found.
	var subSprite_2 = myGraphicSprites.getSubSprite(undefined, undefined, null); //Gets the first sub-sprite object (same as using the position zero) from the current sprite (which is being pointed). Returns null if not found.
	var subSprite_3 = myGraphicSprites.getSubSprite(3, undefined); //Gets the sub-sprite object from the current sprite (which is being pointed) which is in the position 3. Returns undefined if not found.
	var subSprite_4 = myGraphicSprites.getSubSprite(3, undefined, null); //Gets the sub-sprite object from the current sprite (which is being pointed) which is in the position 3. Returns null if not found.
	var subSprite_5 = myGraphicSprites.getSubSprite(1, sprite); //Gets the sub-sprite object from the given sprite which is in the position 1. Returns undefined if not found.
	var subSprite_6 = myGraphicSprites.getSubSprite(1, sprite, null); //Gets the sub-sprite object from the given sprite which is in the position 1. Returns null if not found.
	var subSprite_7 = myGraphicSprites.getSubSprite(undefined, sprite); //Gets the first sub-sprite object (same as using the position zero) from the given sprite which is in the position 1. Returns undefined if not found.
	var subSprite_8 = myGraphicSprites.getSubSprite(undefined, sprite, null); //Gets the first sub-sprite object (same as using the position zero) from the given sprite which is in the position 1. Returns null if not found.
	
	//Another way to get a desired sub-sprite ('CB_GraphicSprites.SUBSPRITE_OBJECT' object) through its index which is its position in the array which is in the "subSprites" property of the given sprite ('CB_GraphicSprites.SPRITE_OBJECT' object):
	var subSprite_9 = sprite.get(); //Gets the first sub-sprite object (same as using the position zero) from "sprite" (which must be a 'CB_GraphicSprites.SPRITE_OBJECT' object). Returns null if not found.
	var subSprite_10 = sprite.get(1); //Gets the sub-sprite object (same as using the position zero) which is in the position 1 from "sprite" (which must be a 'CB_GraphicSprites.SPRITE_OBJECT' object). Returns null if not found.
	var subSprite_11 = sprite.get(3, null); //Gets the sub-sprite object (same as using the position zero) which is in the position 3 from "sprite" (which must be a 'CB_GraphicSprites.SPRITE_OBJECT' object). Returns null if not found.
	
	//Gets a desired sub-sprite ('CB_GraphicSprites.SUBSPRITE_OBJECT' object) through its identifier from the given sprite ('CB_GraphicSprites.SPRITE_OBJECT' object):
	var subSprite_12 = myGraphicSprites.getSubSpriteById("my_subsprite_id"); //Gets the sub-sprite object whose ID is "my_subsprite_id" from the current sprite (which is being pointed). Returns undefined if not found.
	var subSprite_13 = myGraphicSprites.getSubSpriteById("my_subsprite_id", undefined, null); //Gets the sub-sprite object whose ID is "my_subsprite_id" from the current sprite (which is being pointed). Returns null if not found.
	var subSprite_14 = myGraphicSprites.getSubSpriteById("my_subsprite_3", sprite); //Gets the sub-sprite object whose ID is "my_subsprite_3" from the given sprite. Returns undefined if not found.
	var subSprite_15 = myGraphicSprites.getSubSpriteById("my_subsprite_3", sprite, null); //Gets the sub-sprite object whose ID is "my_subsprite_3" from the given sprite. Returns null if not found.

	//Another way to get a desired sub-sprite ('CB_GraphicSprites.SUBSPRITE_OBJECT' object) through its identifier from the given sprite ('CB_GraphicSprites.SPRITE_OBJECT' object):
	var subSprite_16 = sprite.getById("my_subsprite_3"); //Gets the sub-sprite object whose ID is "my_subsprite_3" from "sprite" (which must be a 'CB_GraphicSprites.SPRITE_OBJECT' object). Returns undefined if not found.
	var subSprite_17 = sprite.getById("my_subsprite_id", null); //Gets the sub-sprite object whose ID is "my_subsprite_id" from "sprite" (which must be a 'CB_GraphicSprites.SPRITE_OBJECT' object). Returns null if not found.

	//We can also know the position of a sub-sprite in the array through its identifier:
	var subSpriteIndex = myGraphicSprites.getSubSpriteIndexById("my_subsprite_3", sprite); //Searches in the array which is in the "subSprites" property of the given sprite ('CB_GraphicSprites.SPRITE_OBJECT' object). Returns -1 if not found.
	
	//Another way to know the position of a sub-sprite in the array through its identifier:
	var subSpriteIndex_2 = sprite.getIndexById("my_subsprite_3"); //Searches in the array which is in the "subSprites" property of the "sprite" (which must be a 'CB_GraphicSprites.SPRITE_OBJECT' object). Returns -1 if not found.
	
	//Tells whether a sub-sprite is disabled or not. Internally, it checks its "disabled" property and also whether its sprite parent is disabled (calling the 'myGraphicSprites.isDisabledSprite' method internally, for its sprite parent):
	//Note: a sub-sprite is considered disabled if its sprite parent is disabled (a sprite is considered disabled if its sprites group parent is also disabled).
	var subSpriteDisabled = subSprite.isDisabled();
	var subSpriteDisabled_2 = myGraphicSprites.isDisabledSubSprite(subSprite); //Another way to check whether it is disabled or not.

	//Sets a desired sub-sprite disabled or enabled (internally, it edits its "disabled" property):
	/* Note:
		The first parameter ("subSprite") is the sub-sprite we want to affect.
		Set the second parameter ("disabled") to true to disable it or to false to enable it. Default: false.
		Set the third parameter ("affectParents") to true to also affect the sprite parent and of the the sprites group object (which is considered the status of the whole 'CB_GraphicSprites' object). Default: affectParentsChildren || !disabled (the "disabled" parameter).
		Set the fourth parameter ("affectParentsChildren") to true also affect the sprites and sub-sprites of the sprite parent and its sprites group object (which is considered the status of the whole 'CB_GraphicSprites' object). Default: !disabled (the "disabled" parameter).
		If "affectParentsChildren" is set to true and the "affectParents" is also set to true, it will also modify the "disabled" property of all the existing sprites and sub-sprites in the 'CB_GraphicSprites' object.
		The "affectParentsChildren" parameter is ignored if the "affectParents" parameter is set to false.
	*/
	myGraphicSprites.setDisabledSubSprite(subSprite); //Enables it. Also affects its parent sprite and the sprites group object (and the 'CB_GraphicSprites' object itself), including all the sprites and sub-sprites.
	myGraphicSprites.setDisabledSubSprite(subSprite, false); //Enables it. Also affects its parent sprite and the sprites group object (and the 'CB_GraphicSprites' object itself), including all the sprites and sub-sprites.
	myGraphicSprites.setDisabledSubSprite(subSprite, false, false); //Enables it.
	myGraphicSprites.setDisabledSubSprite(subSprite, false, false, false); //Enables it.
	myGraphicSprites.setDisabledSubSprite(subSprite, false, false, true); //Enables it.
	myGraphicSprites.setDisabledSubSprite(subSprite, false, true); //Enables it. Also affects its parent sprite and the sprites group object (and the 'CB_GraphicSprites' object itself), including all the sprites and sub-sprites.
	myGraphicSprites.setDisabledSubSprite(subSprite, false, true, false); //Enables it. Also affects its parent sprite and the sprites group object (and the 'CB_GraphicSprites' object itself), but not all the rest of sprites and sub-sprites.
	myGraphicSprites.setDisabledSubSprite(subSprite, false, true, true); //Enables it. Also affects its parent sprite and the sprites group object (and the 'CB_GraphicSprites' object itself), including all the sprites and sub-sprites.
	myGraphicSprites.setDisabledSubSprite(subSprite, true); //Disables it.
	myGraphicSprites.setDisabledSubSprite(subSprite, true, false); //Disables it.
	myGraphicSprites.setDisabledSubSprite(subSprite, true, false, false); //Disables it.
	myGraphicSprites.setDisabledSubSprite(subSprite, true, false, true); //Disables it.
	myGraphicSprites.setDisabledSubSprite(subSprite, true, true); //Disables it. Also affects its sprite parent and the sprites group object (and the 'CB_GraphicSprites' object itself), but not all the rest of sprites and sub-sprites.
	myGraphicSprites.setDisabledSubSprite(subSprite, true, true, false); //Disables it. Also affects its sprite parent and the sprites group object (and the 'CB_GraphicSprites' object itself), but not all the rest of sprites and sub-sprites.
	myGraphicSprites.setDisabledSubSprite(subSprite, true, true, true); //Disables it. Also affects its sprite parent and the sprites group object (and the 'CB_GraphicSprites' object itself), including all the sprites and sub-sprites.

	//Another way to sets a desired sub-sprite disabled or enabled (internally, it calls the 'myGraphicSprites.setDisabledSubSprite' method):
	/* Note:
		Set the first parameter ("disabled") to true to disable it or to false to enable it. Default: false.
		Set the second parameter ("affectParents") to true to also affect the sprite parent and of the the sprites group object (which is considered the status of the whole 'CB_GraphicSprites' object). Default: affectParentsChildren || !disabled (the "disabled" parameter).
		Set the third parameter ("affectParentsChildren") to true also affect the sprites and sub-sprites of the sprite parent and its sprites group object (which is considered the status of the whole 'CB_GraphicSprites' object). Default: !disabled (the "disabled" parameter).
		If "affectParentsChildren" is set to true and the "affectParents" is also set to true, it will also modify the "disabled" property of all the existing sprites and sub-sprites in the 'CB_GraphicSprites' object.
		The "affectParentsChildren" parameter is ignored if the "affectParents" parameter is set to false.
	*/
	subSprite.setDisabled(); //Enables it. Also enables its parent sprite and the sprites group object (and the 'CB_GraphicSprites' object itself), including all the sprites and sub-sprites.
	subSprite.setDisabled(false); //Enables it. Also affects its parent sprite and the sprites group object (and the 'CB_GraphicSprites' object itself), including all the sprites and sub-sprites.
	subSprite.setDisabled(false, false); //Enables it.
	subSprite.setDisabled(false, false, false); //Enables it.
	subSprite.setDisabled(false, false, true); //Enables it.
	subSprite.setDisabled(false, true); //Enables it. Also affects its parent sprite and the sprites group object (and the 'CB_GraphicSprites' object itself), including all the sprites and sub-sprites.
	subSprite.setDisabled(false, true, false); //Enables it. Also affects its parent sprite and the sprites group object (and the 'CB_GraphicSprites' object itself), but not all the rest of sprites and sub-sprites.
	subSprite.setDisabled(false, true, true); //Enables it. Also affects its parent sprite and the sprites group object (and the 'CB_GraphicSprites' object itself), including all the sprites and sub-sprites.
	subSprite.setDisabled(true); //Disables it.
	subSprite.setDisabled(true, false); //Disables it.
	subSprite.setDisabled(true, false, false); //Disables it.
	subSprite.setDisabled(true, false, true); //Disables it.
	subSprite.setDisabled(true, true); //Disables it. Also affects its sprite parent and the sprites group object (and the 'CB_GraphicSprites' object itself), but not all the rest of sprites and sub-sprites.
	subSprite.setDisabled(true, true, false); //Disables it. Also affects its sprite parent and the sprites group object (and the 'CB_GraphicSprites' object itself), but not all the rest of sprites and sub-sprites.
	subSprite.setDisabled(true, true, true); //Disables it. Also affects its sprite parent and the sprites group object (and the 'CB_GraphicSprites' object itself), including all the sprites and sub-sprites.
</code></pre>

<p>
	Each graphic sprites object (<a href="_html/_doc/api/CB_GraphicSprites.html" target="_blank">CB_GraphicSprites</a> object) has an internal pointer that points to the current sprite. We can manage the current sprite, go to previous or next one or even modify this pointer to jump to the desired sprite:
</p>
<pre><code class="language-javascript">
	//Gets the current position of the pointer (it belongs to an index of the 'myGraphicSprites.spritesGroup.sprites' array where a 'CB_GraphicSprites.SPRITE_OBJECT' object is placed, containing a sprite):
	var pointerPosition = myGraphicSprites.getPointer(); //The same as 'myGraphicSprites.getCurrentPosition'. Similar to accessing the 'myGraphicSprites.pointer' property.

	//Another way to get the current position of the pointer ('sprite' must be a 'CB_GraphicSprites.SPRITE_OBJECT'):
	var pointerPosition_3 = sprite.getPointer(); //The same as 'sprite.getCurrentPosition'. 
	
	//Sets the pointer to the desired position, if possible, and returns the pointer (same as 'myGraphicSprites.setCurrentPosition'):
	var pointerPosition_4 = myGraphicSprites.setPointer(1); //Jumps to the position 1.
	var pointerPosition_5 = myGraphicSprites.setPointer(-20); //Jumps to the position 0 (ignores values lower than zero).
	var pointerPosition_6 = myGraphicSprites.setPointer(31, true); //Jumps to the position 1, treating the internal array as a circle (it will cycle, looping through the sprites from the end to the beginning, until it counts 31).
	var pointerPosition_7 = myGraphicSprites.setPointer(-20, true); //Jumps to the position 0 (considers the position a positive number), treating the internal array as a circle (it will cycle, looping through the sprites from the end to the beginning, until it counts 20).

	//Another way to set the pointer to the desired position, if possible, but returns the current sprite being pointed instead of the pointer value. Same as 'sprite.setCurrentPosition' ('sprite' must be a 'CB_GraphicSprites.SPRITE_OBJECT'):
	var sprite = sprite.setPointer(1); //Jumps to the position 1.
	var sprite_2 = sprite.setPointer(-20); //Jumps to the position 0 (ignores values lower than zero).
	var sprite_3 = sprite.setPointer(31, true); //Jumps to the position 1, treating the internal array as a circle (it will cycle, looping through the sprites from the end to the beginning, until it counts 31).
	var sprite_4 = sprite.setPointer(-20, true); //Jumps to the position 0 (considers the position a positive number), treating the internal array as a circle (it will cycle, looping through the sprites from the end to the beginning, until it counts 20).

	//Gets the sprite (a 'CB_GraphicSprites.SPRITE_OBJECT' object) which is being currently pointed:
	var sprite_5 = myGraphicSprites.getCurrent(); //Same as 'myGraphicSprites.current' and 'myGraphicSprites.now'.

	//Another way to get the sprite (a 'CB_GraphicSprites.SPRITE_OBJECT' object) which is being currently pointed. Same as 'sprite.current' and 'sprite.now' ('sprite' must be a 'CB_GraphicSprites.SPRITE_OBJECT'):
	var sprite_6 = sprite.getCurrent();
	
	//Makes the pointer to go back to the previous position and returns the sprite located there (if any), if possible (same as 'myGraphicSprites.previous' and 'myGraphicSprites.setPrevious'):
	var sprite_7 = myGraphicSprites.getPrevious(); //If it was at the beginning, it will return null.
	var sprite_8 = myGraphicSprites.getPrevious(true); //If it was in the beginning, it will jump to the last position of the array.
	
	//Another way to make the pointer to go back to the previous position and return the sprite located there (if any), if possible. Same as 'sprite.previous' and 'sprite.setPrevious' ('sprite' must be a 'CB_GraphicSprites.SPRITE_OBJECT'):
	var sprite_9 = sprite.getPrevious(); //If it was at the beginning, it will return null.
	var sprite_10 = sprite.getPrevious(true); //If it was in the beginning, it will jump to the last position of the array.
	
	//Makes the pointer to advance to the next position and returns the sprite located there (if any), if possible (same as 'myGraphicSprites.next' and 'myGraphicSprites.setNext'):
	var sprite_11 = myGraphicSprites.getNext(); //If it was at the end, it will return null.
	var sprite_12 = myGraphicSprites.getNext(true); //If it was in the end, it will go back to the first position of the array.
	
	//Another way to make the pointer to advance to the next position and return the sprite located there (if any), if possible. Same as 'sprite.next' and 'sprite.setNext' ('sprite' must be a 'CB_GraphicSprites.SPRITE_OBJECT'):
	var sprite_13 = sprite.getNext(); //If it was at the end, it will return null.
	var sprite_14 = sprite.getNext(true); //If it was in the end, it will go back to the first position of the array.

	//Gets the time in milliseconds when the current sprite started being pointed (time elapsed since the "time origin" which was obtained calling the 'CB_Device.getTiming' function internally):
	var timestampWhenPointed = myGraphicSprites.getTime(); //Similar to accessing the 'myGraphicSprites.time' property.

	//Gets the time in milliseconds when a sprite (must be a 'CB_GraphicSprites.SPRITE_OBJECT' object) started being pointed (although maybe it is not currently being pointed):
	//The sub-sprites of each sprite also have a 'setTime', 'getTime' (using "time" of the sub-sprite and falling back to the "time" of its sprint parent if not found) and 'getTimeElapsed' methods that work with their 'time' property. Normally, the 'time' property of a sub-sprite has the same value as the "time" property of its sprite parent but they can be modified independently.
	var timestampWhenPointed_2 = sprite.getTime(); //Similar to accessing the 'sprite.time' property. Note that maybe "sprite" is not the current sprite being pointed.
	
	//Sets (updates) the time in milliseconds when the current sprite started being pointed and returns the time set:
	var timestampWhenPointed_3 = myGraphicSprites.setTime(); //Sets the current time.
	var timestampWhenPointed_4 = myGraphicSprites.setTime(CB_Device.getTiming() + 3000); //Sets the given time (adds 3 seconds to the current time).
	var timestampWhenPointed_5 = myGraphicSprites.setTime(1563184841857); //Sets the given time (time elapsed since the "time origin" which can obtained calling the 'CB_Device.getTiming' function).
	
	//Sets (updates) the time in milliseconds when a sprite (must be a 'CB_GraphicSprites.SPRITE_OBJECT' object) started being pointed and returns the time set:
	var timestampWhenPointed_6 = sprite.setTime(); //Sets the current time.
	var timestampWhenPointed_7 = sprite.setTime(CB_Device.getTiming() + 3000); //Sets the given time (adds 3 seconds to the current time).
	var timestampWhenPointed_8 = sprite.setTime(1563184841857); //Sets the given time (time elapsed since the "time origin" which can be obtained calling the 'CB_Device.getTiming' function).
	
	//Tells how many milliseconds elapsed since the current sprite was or will be pointed, comparing with the time given in milliseconds (time elapsed since the "time origin" which can be obtained calling the 'CB_Device.getTiming' function) or with the current one if none is given:
	var timePointedMs = myGraphicSprites.getTimeElapsed(); //Returns how many milliseconds the sprite has been pointed until now.
	var timePointedMs_2 = myGraphicSprites.getTimeElapsed(1563184841857); //Returns how many milliseconds the sprite was or will be pointed until the time given.
	
	//Tells how many milliseconds elapsed since a sprite (must be a 'CB_GraphicSprites.SPRITE_OBJECT' object) was or will be pointed, comparing with the time given in milliseconds (time elapsed since the "time origin" which can be obtained calling the 'CB_Device.getTiming' function) or with the current one if none is given:
	var timePointedMs_3 = sprite.getTimeElapsed(); //Returns how many milliseconds the sprite has been pointed until now (although maybe it not being pointed currently).
	var timePointedMs_4 = sprite.getTimeElapsed(1563184841857); //Returns how many milliseconds the sprite was or will be pointed until the time given (although maybe it not being pointed currently).
</code></pre>
<p>
	Knowing the time a sprite has been pointed can be useful for different purposes as for example perform animations, etc.
</p>

<p>
	It is possible to insert more sprites or sub-sprites as well as removing them. Here are some examples:
</p>
<pre><code class="language-javascript">
	//Adds the desired group of graphic sprites (same as 'myGraphicSprites.insertSpritesGroup'):
	myGraphicSprites.insertSprites(spritesGroupData); //The 'spritesGroupData' parameter must be a 'CB_GraphicSprites.SPRITES_OBJECT' object (same parameter as the constructor of the 'CB_GraphicSprites' class).
	
	//Removes all the sprites by clearing the 'myGraphicSprites.spritesGroup' property (same as 'myGraphicSprites.removeSpritesAll', 'myGraphicSprites.removeSpritesGroup' and 'myGraphicSprites.removeAll'):
	myGraphicSprites.removeSprites();

	//Adds the desired graphic sprite (same as 'myGraphicSprites.insertSprite'). If a sprite with the same identifier already exists, it will be replaced by the new one in its same position:
	myGraphicSprites.insert(sprite); //The 'sprite' parameter must be a 'CB_GraphicSprites.SPRITE_OBJECT' object.
	
	//Removes a sprite by its index which is its position in the 'myGraphicSprites.spritesGroup.sprites' array (same as 'myGraphicSprites.removeSprite'):
	var spriteRemoved = myGraphicSprites.remove(1); //Tries to remove the sprite in the position 1. Returns true if it gets removed or false otherwise.
	
	//Removes a sprite by its ID (same as 'myGraphicSprites.removeSpriteById'):
	var spriteRemoved_2 = myGraphicSprites.removeById("my_sprite_1"); //Tries to remove the sprite whose identifier is "my_sprite_1". Returns true if it gets removed or false otherwise.

	//Adds the given sub-sprites to the desired sprite:
	myGraphicSprites.insertSubSprites(subSprites, sprite); //The 'subSprites' parameter must be an array of 'CB_GraphicSprites.SUBSPRITE_OBJECT' objects. The "sprite" parameter must be a 'CB_GraphicSprites.SPRITE_OBJECT' object.
	
	//Another way to add sub-sprites to a sprite ('CB_GraphicSprites.SPRITE_OBJECT' object):
	sprite.insertSubSprites(subSprites);
	
	//Removes all the sub-sprites from a given sprite object by clearing its "subSprites" property, leaving an empty array (same as 'myGraphicSprites.removeSubSpritesAll'):
	myGraphicSprites.removeSubSprites(sprite); //The "sprite" parameter must be a 'CB_GraphicSprites.SPRITE_OBJECT' object.

	//Another way to remove all the sub-sprites from a sprite ('CB_GraphicSprites.SPRITE_OBJECT' object):
	sprite.removeAll(); //Same as 'sprite.removeSubSprites'.

	//Adds the given sub-sprite to the desired sprite. If a sub-sprite with the same identifier already exists, it will be replaced by the new one in its same position:
	myGraphicSprites.insertSubSprite(subSprite, sprite); //The 'subSprites' parameter must be an array of 'CB_GraphicSprites.SUBSPRITE_OBJECT' objects. The "sprite" parameter must be a 'CB_GraphicSprites.SPRITE_OBJECT' object.
	
	//Another way to add a sub-sprite to a sprite ('CB_GraphicSprites.SPRITE_OBJECT' object):
	sprite.insert(subSprite);
	
	//Removes a sub-sprite from a given sprite by its index (its position in the array which is in the "subSprites" property of the given sprite object):
	var subSpriteRemoved = myGraphicSprites.removeSubSprite(1, sprite); //Tries to remove the sub-sprite in the position 1. The "sprite" parameter must be a 'CB_GraphicSprites.SPRITE_OBJECT' object. Returns true if it gets removed or false otherwise.
	
	//Another way to remove a sub-sprite from a sprite ('CB_GraphicSprites.SPRITE_OBJECT' object):
	var subSpriteRemoved_2 = sprite.remove(0); //Tries to remove the sub-sprite in the position 0. Returns true if it gets removed or false otherwise.
	
	//Removes a sub-sprite from a given sprite by its identifier:
	var subSpriteRemoved_3 = myGraphicSprites.removeSubSpriteById("my_subsprite_1", sprite); //Tries to remove the sub-sprite whose ID is "my_subsprite_1". The "sprite" parameter must be a 'CB_GraphicSprites.SPRITE_OBJECT' object. Returns true if it gets removed or false otherwise.
	
	//Another way to remove a sub-sprite by its identifier from a sprite ('CB_GraphicSprites.SPRITE_OBJECT' object):
	var subSpriteRemoved_4 = myGraphicSprites.removeById("my_subsprite_3"); //Tries to remove the sub-sprite whose ID is "my_subsprite_3". Returns true if it gets removed or false otherwise.
</code></pre>

<p>
	It is also possible to get a copy of a graphic sprites object:
</p>
<pre><code class="language-javascript">
	//Gets a copy of the 'CB_GraphicSprites' object:
	//Note: to copy sprites and sub-sprites, you can also use the 'CB_copyObject' function.
	var myGraphicSpritesCopy = myGraphicSprites.getCopy();
</code></pre>

<p>
	In order to free memory and resources, it is possible to destroy the graphic sprites object:
</p>
<pre><code class="language-javascript">
	//Destroys the graphic sprites object (removing all sprites and their sub-sprites, etc.) and frees memory:
	myGraphicSprites.destructor();	
</code></pre>

<p>
	Check the <a href="_html/_doc/api/index.html" target="_blank">API documentation</a> to read more about the <a href="_html/_doc/api/CB_GraphicSprites.html" target="_blank">CB_GraphicSprites</a> class.
</p>