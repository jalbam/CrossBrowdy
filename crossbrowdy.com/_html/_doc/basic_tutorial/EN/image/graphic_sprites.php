<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	Here is an example of image sprites management:
</p>
<pre><code class="language-javascript">
	//Defines the sprites group information:
	var spritesGroup =
	{
		//'my_sprites_1':
		id: "my_sprites_1",
		src: "path/to/image.gif",
		srcType: "image",
		srcLeft: 10,
		srcTop: 20,
		srcWidth: 64,
		srcHeight: 32,
		left: 10,
		top: 20,
		width: 64,
		height: 32,
		zIndex: 1,
		data:
		{
			datum_1: "value_1",
			datum_2: 2,
			datum_3: [ "a", "b", "c" ],
			getType: function() { return this.this.type; },
			getParent: function() { return this.this.parent; }
		},
		sprites:
		[
			//'my_sprite_1':
			{
				id: "my_sprite_1",
				src: undefined,
				srcType: undefined,
				srcLeft: undefined,
				srcTop: undefined,
				srcWidth: undefined,
				srcHeight: undefined,
				left: undefined,
				top: undefined,
				width: undefined,
				height: undefined,
				zIndex: undefined,
				data: undefined,
				subSprites:
				[
					//'my_subsprite_1':
					{
						id: "my_subsprite_1",
						src: undefined,
						srcType: undefined,
						srcLeft: 10,
						srcTop: 20,
						srcWidth: undefined,
						srcHeight: undefined,
						left: undefined,
						top: undefined,
						width: undefined,
						height: undefined,
						zIndex: undefined,
						data: undefined,
					},
					//'my_subsprite_2':
					{
						id: "my_subsprite_2",
						src: undefined,
						srcType: undefined,
						srcLeft: 20,
						srcTop: 40,
						srcWidth: undefined,
						srcHeight: undefined,
						left: undefined,
						top: undefined,
						width: undefined,
						height: undefined,
						zIndex: 2,
						data: undefined,
					}
				]
			},
			//'my_sprite_2':
			{
				id: "my_sprite_2",
				src: undefined,
				srcType: undefined,
				srcLeft: undefined,
				srcTop: undefined,
				srcWidth: undefined,
				srcHeight: undefined,
				left: undefined,
				top: undefined,
				width: undefined,
				height: undefined,
				zIndex: undefined,
				data: undefined,
				subSprites:
				[
					//'my_subsprite_3':
					{
						id: "my_subsprite_3",
						src: undefined,
						srcType: undefined,
						srcLeft: 30,
						srcTop: 60,
						srcWidth: undefined,
						srcHeight: undefined,
						left: undefined,
						top: undefined,
						width: undefined,
						height: undefined,
						zIndex: undefined,
						data: undefined,
					},
					//'my_subsprite_4':
					{
						id: "my_subsprite_4",
						src: undefined,
						srcType: undefined,
						srcLeft: 40,
						srcTop: 80,
						srcWidth: undefined,
						srcHeight: undefined,
						left: undefined,
						top: undefined,
						width: undefined,
						height: undefined,
						zIndex: 2,
						data: undefined,
					}
				]
			}
		]
	};
	
	//Creates the sprites group:
	var myGraphicSprites = new CB_GraphicSprites(spritesGroup);

	CB_GraphicSprites.SRC_TYPE_DEFAULT
	CB_GraphicSprites.WIDTH_SOURCE_DEFAULT
	CB_GraphicSprites.HEIGHT_SOURCE_DEFAULT
	CB_GraphicSprites.LEFT_SOURCE_DEFAULT
	CB_GraphicSprites.TOP_SOURCE_DEFAULT
	CB_GraphicSprites.WIDTH_DEFAULT
	CB_GraphicSprites.HEIGHT_DEFAULT
	CB_GraphicSprites.LEFT_DEFAULT
	CB_GraphicSprites.TOP_DEFAULT
	CB_GraphicSprites.ZINDEX_DEFAULT

	myGraphicSprites.getSprites(returnValueOnFail); //Same as 'myGraphicSprites.getSpritesAll' and 'myGraphicSprites.getSpritesGroup'. Similar to 'myGraphicSprites.spritesGroup'.

	myGraphicSprites.get(index, returnValueOnFail); //Same as 'myGraphicSprites.getSprite'.
	myGraphicSprites.getById(id, returnValueOnFail); //Same as 'myGraphicSprites.getSpriteById'.

	myGraphicSprites.getIndexById(id); //Same as 'myGraphicSprites.getSpriteIndexById'.

	myGraphicSprites.getSubSprites(sprite, returnValueOnFail);

	myGraphicSprites.getSubSprite(index, sprite, returnValueOnFail);
	myGraphicSprites.getSubSpriteById(id, sprite, returnValueOnFail);

	myGraphicSprites.getSubSpriteIndexById(id, sprite);

	myGraphicSprites.getPointer(); //Similar to 'myGraphicSprites.pointer'.
	myGraphicSprites.setPointer(position, loop);

	myGraphicSprites.getCurrent(); //Same as 'myGraphicSprites.current' and 'myGraphicSprites.now'.
	myGraphicSprites.getPrevious(loop); //Same as 'myGraphicSprites.previous'.
	myGraphicSprites.getNext(loop); //Same as 'myGraphicSprites.next'.

	myGraphicSprites.getTime();
	myGraphicSprites.setTime(time);
	myGraphicSprites.getTimeElapsed(timeToCompare);

	myGraphicSprites.insertSprites(spritesGroup); //Same as 'myGraphicSprites.insertSpritesGroup'.
	myGraphicSprites.removeSprites(); //Same as 'myGraphicSprites.removeSpritesAll' and 'myGraphicSprites.removeSpritesGroup'.

	myGraphicSprites.insert(sprite); //Same as 'myGraphicSprites.insertSprite'.
	myGraphicSprites.remove(index); //Same as 'myGraphicSprites.removeSprite'.
	myGraphicSprites.removeById(id); //Same as 'myGraphicSprites.removeSpriteById'.

	myGraphicSprites.insertSubSprites(subSprites, sprite);
	myGraphicSprites.removeSubSprites(sprite); //Same as 'myGraphicSprites.removeSubSpritesAll'.

	myGraphicSprites.insertSubSprite(subSprite, sprite);
	myGraphicSprites.removeSubSprite(index, sprite);
	myGraphicSprites.removeSubSpriteById(id, sprite);

	myGraphicSprites.destructor();
	
	
	//TODO: explain the properties of the sprites groups, sprites and sub-sprites como type, src, etc.
	//TODO: explain that data has "this".
</code></pre>


<p>
	Check the <a href="_html/_doc/api/index.html" target="_blank">API documentation</a> to read more about the <a href="_html/_doc/api/CB_GraphicSprites.html" target="_blank">CB_GraphicSprites</a> class.
</p>