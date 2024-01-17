//Class to manage enemies:
var Enemy = function(type, level, x, y, map)
{
	//Creates an instance of this object and returns it in the case that it is being called from an unexpected context:
	if (this === window || !(this instanceof Enemy)) { return new Enemy(type, level, x, y, map); }
	
	//Calls the internal constructor of the object when creates an instance, with the given parameters:
	return this._init(type, level, x, y, map);
}


//Properties:
Enemy._idCounter = 0; //Internal counter to manage an unique internal ID for each enemy.
Enemy.prototype.type = 0; //Enemy type (0 by default).
Enemy.prototype.level = 0; //Enemy level (0 is the first one).
Enemy.prototype.position = { x: 0, y: 0 }; //Enemy position.
Enemy.prototype.rotation = 0; //Enemy rotation (they rotate to follow their path).
Enemy.prototype.vitality = 100; //Enemy vitality (100 maximum).
Enemy.prototype.levelSpeed = [ 1, 1.5, 2 ]; //Enemy speed (1 is normal speed), separated by level.
Enemy.prototype.levelDamage = [ 1, 2, 3 ]; //Enemy damage to user's vitality when it reaches the objective, separated by level.
Enemy.prototype.isWalking = false; //Determines whether the enemy is currently walking through its path.
Enemy.prototype.isRotating = false; //Determines whether the enemy is currently rotating to follow its path.
Enemy.prototype.isDead = false; //Determines whether the enemy is dead or not.
Enemy.prototype.succeeded = false; //Determines whether the enemy succeeded to reach the objective or not.
Enemy.prototype._pathCurrent = //Keeps the current path to be followed:
{
	points: [ { x: 0, y: 0}, { x: 10, y: 10 } ],
	pathPointer: 0
};


//Internal constructor:
Enemy.prototype._init = function(type, level, x, y, map)
{
	//Sets the given parameters or fallback to the default ones:
	this.id = Enemy._idCounter++;
	this.type = type || this.type;
	this.level = level || this.level;
	this.position.x = x || this.position.x;
	this.position.y = y || this.position.y;

	CB_console("Creating enemy #" + this.id + " of type " + this.type + " with level " + this.level + "...");
	
	//If no coordinates were given, finds the starting point and locates the enemy there to start its way:
	if (typeof(x) === "undefined" || typeof(y) === "undefined") { this.position = Enemy._findStartingPoint(map); }
	
	//Calculates the path which will be followed to reach the destiny:
	this._pathCurrent = Enemy._pathCurrentCalculate(this.position.x, this.position.y, map);
	
	var spritesLoaded = this._spritesLoad(null);
	
	if (!spritesLoaded)
	{
		CB_console("* Failed to load sprites for this enemy.");
	}
	else
	{
		CB_console("* Enemy set at position (" + this.position.x + ", " + this.position.y + ")");
	}
	
	return this;
}


//Returns the sprites involved with the tower:
Enemy.prototype._getSprites = function(returnOnFail)
{
	var spritesGroup = CB_GEM.graphicSpritesSceneObject.getById("enemy_" + this.type + "_sprites_group", null);
	if (spritesGroup === null)
	{
		spritesGroup = CB_GEM.graphicSpritesSceneObject.getById("enemy_0_sprites_group", null); //Default enemy sprites group.
	}
	var sprite = null;
	var subSprite = null;
	if (spritesGroup !== null)
	{
		sprite = spritesGroup.getById("enemy_" + this.type + "_sprites", null);
		if (sprite === null)
		{
			sprite = spritesGroup.getById("enemy_0_sprites", null); //Default enemy sprite.
		}

		if (sprite !== null)
		{
			subSprite = sprite.getById("enemy_" + this.type + "_subsprites_" + this.id, null);
			if (subSprite === null)
			{
				subSprite = sprite.getById("enemy_" + this.type + "_subsprites", null);
				if (subSprite === null)
				{
					subSprite = sprite.getSubSprites()[0]; //Default enemy subSprite.
				}
			}
		}
	}

	if (spritesGroup === null) { CB_console("No sprites object could be found!"); return returnOnFail; }
	else if (sprite === null) { CB_console("No sprite object could be found!"); return returnOnFail; }
	else if (subSprite === null) { CB_console("No subSprite object could be found!"); return returnOnFail; }

	return { spritesGroup: spritesGroup, sprite: sprite, subSprite: subSprite };
}


//Loads the sprite for the first time:
Enemy.prototype._spritesLoad = function(returnOnFail)
{
	var sprites = this._getSprites(null);
	if (sprites === null) { return returnOnFail; }

	sprites.subSprite = CB_copyObject(sprites.subSprite);
	sprites.subSprite.id += "_" + this.id;
	sprites.subSprite.disabled = false;
	
	this._spritesUpdateCoordinates(this.position.x, this.position.y, sprites, null);
	
	sprites.sprite.insertSubSprite(sprites.subSprite); //It also updates the internal "subSpritesByZIndex" array.

	return sprites;
}


//Updates the coordinates for the subSprite:
Enemy.prototype._spritesUpdateCoordinates = function(x, y, sprites, returnOnFail)
{
	x = x || this.position.x;
	y = y || this.position.y;
	sprites = sprites || this._getSprites(null);
	if (sprites === null) { return returnOnFail; }
	
	sprites.subSprite.left = Game.Levels.getRealScreenLeft(x);
	sprites.subSprite.top = Game.Levels.getRealScreenTop(y);

	return sprites;
}


//Finds a starting point for the enemy to appear on the map and start its way:
Enemy._findStartingPoint = function(map)
{
	map = map || Game.Levels.data[Game.data.level].map;
	
	var startingPointsFound = [];
	
	//Looks for origin points:
	for (var r = 0; r < map.length; r++)
	{
		for (var c = 0; c < map[r].length; c++)
		{
			if (Game.Levels.getTypeFromSymbols(map[r][c]) === Game.Levels.SYMBOL_TYPES.ORIGIN)
			{
				startingPointsFound[startingPointsFound.length] = { x: c, y: r };
			}
		}
	}	
	
	//If could not be found, uses (0, 0) coordinates by default:
	if (startingPointsFound.length === 0) { startingPointsFound[0] = { x: 0, y: 0 }; }

	return startingPointsFound[Math.floor(Math.random() * startingPointsFound.length)];
}


//Calcultes and returns the path which will be followed to reach its destiny:
Enemy._pathCurrentCalculate = function(x, y, map)
{
	x = x || 0;
	y = y || 0;
	map = map || Game.data.levelMap;

	//TO DO: Return the path according to this.position.x and this.position.y.
}


//Enemy behaviour (called each loop):
Enemy.prototype.loopStep = function()
{
	if (this.isDead) { return; } //Does not perform the action if it is already dead.

	//If the enemy does not have more vitality, dies:
	if (this.vitality <= 0)
	{
		this.die();		
	}
	//...otherwise, if the objective has been reached:
	if (this._isObjectiveReached(this._pathCurrent.points[this._pathCurrent.pathPointer].x, this._pathCurrent.points[this._pathCurrent.pathPointer].y))
	{
		Game.data.vitality -= this.levelDamage[this.level];
		
		this.succeeded = true;
	}
	//...otherwise, continues its way:
	else
	{
		this._walk(this._pathCurrent.points[this._pathCurrent.pathPointer].x, this._pathCurrent.points[this._pathCurrent.pathPointer].y);
	}
	
	//Manages the sprite:
	//TO DO: this._spritesCurrent;
	
}


//Tells whether the objective has been reached or not yet:
Enemy.prototype._isObjectiveReached = function(pathX, pathY)
{
	var reached = false;
	
	// TO DO.
	
	return reached;
}


//Walks trough its way:
Enemy.prototype._walk = function(pathX, pathY)
{
	this.isWalking = true;
	
	if (this._needsRotateToFollow(pathX, pathY))
	{
		this._pointPath(pathX, pathY);
	}
	else
	{
		this.isRotating = false;
	}
	
	// TO DO: follow path (update this._pathCurrent.pathPointer).
}


//Rotates the enemy to follow its way:
Enemy.prototype._pointPath = function(pathX, pathY)
{
	this.isRotating = true;
	
	//TO DO: do stuff.
}


//Tells whether the enemy needs to rotate in order to folow their path or not:
Enemy.prototype._needsRotateToFollow = function(pathX, pathY)
{
	
}


//Makes the enemy to die:
Enemy.prototype.die = function()
{
	this.isDead = true;
	
	// TO DO.
}



//TO DO: implement different enemy types (1 can use default properties/methods).