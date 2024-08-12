//Class to manage towers:
var Tower = function(x, y, type)
{
	//Creates an instance of this object and returns it in the case that it is being called from an unexpected context:
	if (this === window || !(this instanceof Tower)) { return new Tower(x, y, type); }
	
	//Calls the internal constructor of the object when creates an instance, with the given parameters:
	return this._init(x, y, type);
}


//Properties:
Tower._idCounter = 0; //Internal counter to manage an unique internal ID for each tower.
Tower._typeEntities = { "TOWER": 0, "ENEMY" : 1 }; //Entity types.
Tower.prototype.id = null; //Identifier. It will be calculated automatically internally.
Tower.prototype.typeEntity = Tower._typeEntities.TOWER; //Entity type, according to the "Tower._typeEntities" object.
Tower.prototype.type = 0; //Tower type (0 by default).
Tower.prototype.level = 0; //Tower level (0 is the first one).
Tower.prototype.position = { x: 0, y: 0, xScreen: 0, yScreen: 0 }; //Tower position.
//Tower.prototype.x = 0; //Tower horizontal position.
//Tower.prototype.y = 0; //Tower vertical position.
Tower.prototype.rotation = 0; //Tower rotation (they rotate to point to a target).
Tower.prototype.levelVitality = [ 100, 150, 300, 600, 1200 ]; //Tower vitality, separated by level.
Tower.prototype.levelSpeed = [ 1, 1.5, 2 ]; //Tower speed (1 is normal speed), separated by level.
Tower.prototype.levelDamage = [ 1, 2, 3, 5, 8 ]; //Tower damage to enemy's vitality when it reaches it, separated by level.
Tower.prototype.levelRadiusSeen = [ 1, 2, 3 ]; //Radius that the tower can see targets (each unit represents the height of a tile), separated by level.
Tower.prototype.isRotating = false; //Determines whether the tower is currently rotating to point to a target.
Tower.prototype.isFiring = false; //Determines whether the tower is currently attacking to a target.
Tower.prototype.levelCosts = [ 100, 200, 300 ]; //Cost of each level (from 0, when the tower is first built) and their upgrades.
Tower.prototype.targetCurrent = null; //Keeps the current target to be attacked or being attacked already.
Tower.prototype._spriteCurrent = null; //Tower current sprite used.


//Internal constructor:
Tower.prototype._init = function(x, y, type, level)
{
	//Sets the given parameters or fallback to the default ones:
	this.id = Tower._idCounter++;
	this.type = type || this.type;
	this.position = {};
	this.position.x = typeof(x) !== "undefined" && x !== null ? x : this.position.x || 0;
	this.position.y = typeof(y) !== "undefined" && y !== null ? y : this.position.y || 0;
	this.level = level || this.level;
	this._levelMax = this._levelMax || Math.min(this.levelVitality.length, this.levelSpeed.length, this.levelDamage.length, this.levelRadiusSeen.length) - 1;
	if (this._levelMax < 0)
	{
		logMessage("ERROR: Maximum level for the tower is a negative number!");
		this.isDead = true;
		return this;
	}
	else if (this.level > this._levelMax) { this.level = this._levelMax; }
	this.vitality = this.levelVitality[this.level];

	logMessage("Creating tower #" + this.id + " of type " + this.type + " with level " + this.level + ", position: (" + this.position.x + ", " + this.position.y + ")...");
	
	//Loads its sprites:
	var spritesLoaded = this._spritesLoad(null);
	if (!spritesLoaded)
	{
		logMessage("* Failed to load sprites for this tower.");
	}
	else
	{
		logMessage("* Tower set at position (" + this.position.x + ", " + this.position.y + ")");
	}

	return this;
}





//Returns the sprites involved with the tower:
Tower.prototype._getSprites = function(returnOnFail)
{
	var spritesGroup = CB_GEM.graphicSpritesSceneObject.getById("tower_" + this.type + "_sprites_group", null);
	if (spritesGroup === null)
	{
		spritesGroup = CB_GEM.graphicSpritesSceneObject.getById("tower_0_sprites_group", null); //Default tower sprites group.
	}
	var sprite = null;
	var subSprite = null;
	if (spritesGroup !== null)
	{
		sprite = spritesGroup.getById("tower_" + this.type + "_sprites", null);
		if (sprite === null)
		{
			sprite = spritesGroup.getById("tower_0_sprites", null); //Default tower sprite.
		}

		if (sprite !== null)
		{
			subSprite = sprite.getById("tower_" + this.type + "_subsprites_" + this.id, null);
			if (subSprite === null)
			{
				subSprite = sprite.getById("tower_" + this.type + "_subsprites", null);
				if (subSprite === null)
				{
					subSprite = sprite.getSubSprites()[0]; //Default tower subSprite.
				}
			}

			subSpriteVitality = sprite.getById("tower_" + this.type + "_subsprites_vitality_" + this.id, null);
			if (subSpriteVitality === null)
			{
				subSpriteVitality = sprite.getById("tower_" + this.type + "_subsprites_vitality", null);
				if (subSpriteVitality === null)
				{
					subSpriteVitality = sprite.getSubSprites()[1]; //Default tower vitality subSprite.
				}
			}

			subSpriteBackground = sprite.getById("tower_" + this.type + "_subsprites_background_" + this.id, null);
			if (subSpriteBackground === null)
			{
				subSpriteBackground = sprite.getById("tower_" + this.type + "_subsprites_background", null);
				if (subSpriteBackground === null)
				{
					subSpriteBackground = sprite.getSubSprites()[2]; //Default tower background subSprite.
				}
			}
		}
	}
	
	if (spritesGroup === null) { logMessage("No sprites object could be found!"); return returnOnFail; }
	else if (sprite === null) { logMessage("No sprite object could be found!"); return returnOnFail; }
	else if (subSprite === null) { logMessage("No subSprite object could be found!"); return returnOnFail; }
	else if (subSpriteVitality === null) { logMessage("No vitality subSprite object could be found!"); return returnOnFail; }
	else if (subSpriteBackground === null) { logMessage("No background subSprite object could be found!"); return returnOnFail; }

	return { spritesGroup: spritesGroup, sprite: sprite, subSprite: subSprite, subSpriteVitality: subSpriteVitality, subSpriteBackground: subSpriteBackground };
}


//Loads the sprite for the first time:
Tower.prototype._spritesLoad = function(returnOnFail)
{
	var sprites = this._getSprites(null);
	if (sprites === null) { return returnOnFail; }
 
	sprites.spritesGroup = CB_copyObject(sprites.spritesGroup);
	sprites.spritesGroup += "_" + this.id;
	sprites.spritesGroup.disabled = false;
 
	sprites.subSprite = CB_copyObject(sprites.subSprite);
	sprites.subSprite.id += "_" + this.id;
	sprites.subSprite.disabled = false;

	sprites.subSpriteVitality = CB_copyObject(sprites.subSpriteVitality);
	sprites.subSpriteVitality.id += "_" + this.id;
	sprites.subSpriteVitality.disabled = false;

	sprites.subSpriteBackground = CB_copyObject(sprites.subSpriteBackground);
	sprites.subSpriteBackground.id += "_" + this.id;
	sprites.subSpriteBackground.disabled = false;
	
	//this._spritesUpdateCoordinates(this.position.x, this.position.y, sprites, null);
	
	//sprites.sprite.insertSubSprite(sprites.subSprite); //It also updates the internal "subSpritesByZIndex" array.
	//sprites.sprite.insertSubSprite(sprites.subSpriteVitality); //It also updates the internal "subSpritesByZIndex" array.
	//sprites.sprite.insertSubSprite(sprites.subSpriteBackground); //It also updates the internal "subSpritesByZIndex" array.

	sprites.subSprite.data._entityObject = sprites.subSpriteVitality.data._entityObject = sprites.subSpriteBackground.data._entityObject = this;
	
	CB_console("Added entity object to " + sprites.subSpriteBackground.id);

	return sprites;
}


//Disables the sprite:
Tower.prototype._spritesDisable = function(returnOnFail)
{
	var sprites = this._getSprites(null);
	if (sprites === null) { return returnOnFail; }

	//sprites.subSprite = CB_copyObject(sprites.subSprite);
	sprites.subSprite.disabled = true;

	sprites.sprite.insertSubSprite(sprites.subSprite); //It also updates the internal "subSpritesByZIndex" array.

	//sprites.subSpriteVitality = CB_copyObject(sprites.subSpriteVitality);
	sprites.subSpriteVitality.disabled = true;
	sprites.subSpriteBackground.disabled = true;
	
	sprites.sprite.insertSubSprite(sprites.subSpriteVitality); //It also updates the internal "subSpritesByZIndex" array.
	sprites.sprite.insertSubSprite(sprites.subSpriteBackground); //It also updates the internal "subSpritesByZIndex" array.

	return sprites;
}


//Updates the coordinates for the subSprite:
/*
Tower.prototype._spritesUpdateCoordinates = function(x, y, sprites, returnOnFail, mapCoordinates)
{
	x = typeof(x) !== "undefined" && x !== null ? x : this.position.x || 0;
	y = typeof(y) !== "undefined" && y !== null ? y : this.position.y || 0;
	sprites = sprites || this._getSprites(null);
	if (sprites === null) { return returnOnFail; }

	//this.position.xScreen = sprites.subSprite.left = sprites.subSpriteVitality.left = sprites.subSpriteBackground.left = mapCoordinates ? x : Game.Levels.getRealScreenLeft(x);
	//this.position.yScreen = sprites.subSprite.top = sprites.subSpriteBackground.top = mapCoordinates ? y : Game.Levels.getRealScreenTop(y);
	//sprites.subSpriteVitality.top = sprites.subSprite.top + sprites.subSprite.height - sprites.subSpriteVitality.height;

	return sprites;
}
*/


//Rotates the sprite according to the given direction:
Tower.prototype._spritesRotate = function(direction, sprites)
{
	sprites = sprites || this._getSprites(null);

	if (direction === "up")
	{
		sprites.subSprite.data.rotation = 90;
	}
	else if (direction === "down")
	{
		sprites.subSprite.data.rotation = 270;
	}
	else if (direction === "left")
	{
		sprites.subSprite.data.rotation = 0;
	}
	else if (direction === "right")
	{
		sprites.subSprite.data.rotation = 180;
	}
}






//Tower behaviour (called each loop):
Tower.prototype.loopStep = function()
{
	if (this.isFiring) { return; } //Does not perform the action if it is currently firing.
	
	//If there is no current target or is already reachable, tries to find another possible target:
	if (this.targetCurrent === null || !this.isTargetReachable(this.targetCurrent.x, this.targetCurrent.y))
	{
		//Looks for another target:
		this.lookForTarget();
		
		//If another target was found, performs the step again:
		if (this.targetCurrent !== null)
		{
			return this.loopStep();
		}
	}
	//...otherwise, if the current target is still reachable:
	else
	{
		//If needs to rotate towards the target, does it:
		if (this.needsRotateToTarget(this.targetCurrent.x, this.targetCurrent.y))
		{
			this.pointTarget(this.targetCurrent.x, this.targetCurrent.y);
		}
		//...otherwise, if does not need to rotate anymore, just attacks the target:
		else
		{
			this.fireTarget(this.targetCurrent.x, this.targetCurrent.y);
		}
	}
}


//Tells whether a given target is reachable or not (it is considered reachable even when the tower would need to rotate):
Tower.prototype.isTargetReachable = function(targetX, targetY)
{
	var reachable = false;
	
	// TO DO: have into account the seen radius per current level.
	
	return reachable;
}


//Looks for a possible target:
Tower.prototype.lookForTarget = function()
{
	var targetFound = null;
	
	//TO DO: find a target having into account the seen radius per current level.
	
	this.targetCurrent = targetFound || null;
	
	return this.targetCurrent;
}


//Tells whether the tower needs to rotate in order to reach a given target or not:
Tower.prototype.needsRotateToTarget = function(targetX, targetY)
{
		
}


//Rotates the tower to point to a target (if possible):
Tower.prototype.pointTarget = function(targetX, targetY)
{
	this.isFiring = false; //The tower stops firing when rotates.
	this.isRotating = true;
	
	//TO DO: do stuff.
}


//Fires the tower to attack a given target:
Tower.prototype.fireTarget = function(targetX, targetY)
{
	this.isRotating = false; //The tower stops rotating when fires.
	this.isFiring = true;
	
	//TO DO: do stuff.
}


//Returns radius seen (enemies inside this radiu will be seen), returning pixels if desired
Tower.prototype.getRadiusSeen = function(pixels)
{
	return pixels ? this.levelRadiusSeen[this.level] * ((Visual._ELEMENTS_WIDTH + Visual._ELEMENTS_HEIGHT) / 2) : this.levelRadiusSeen[this.level];
}


//TO DO: implement different tower types (1 can use default properties/methods).