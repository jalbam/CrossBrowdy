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
Enemy.prototype.position = { x: 0, y: 0, xScreen: 0, yScreen: 0 }; //Enemy position.
Enemy.prototype.rotation = 0; //Enemy rotation (they rotate to follow their path).
Enemy.prototype.vitality = 100; //Enemy vitality (100 maximum).
Enemy.prototype.levelSpeed = [ 1, 1.5, 2, 3 ]; //Enemy speed (1 is normal speed), separated by level.
Enemy.prototype.levelDamage = [ 1, 2, 3, 5 ]; //Enemy damage to user's vitality when it reaches the objective, separated by level.
Enemy.prototype._levelMax = 3; //Maximum enemy leveal which can be reached. It will be re-calculated in the constructor automatically.
Enemy.prototype.isWalking = false; //Determines whether the enemy is currently walking through its path.
Enemy.prototype.isRotating = false; //Determines whether the enemy is currently rotating to follow its path.
Enemy.prototype.isDead = false; //Determines whether the enemy is dead or not.
Enemy.prototype.succeeded = false; //Determines whether the enemy succeeded to reach the objective or not.
Enemy.prototype._pathCurrent = //Keeps the current path to be followed:
{
	points: [], //Format: [ { x: 0, y: 0}, { x: 10, y: 10 }, ... ]
	pathPointer: 0
};


//Internal constructor:
Enemy.prototype._init = function(type, level, x, y, map)
{
	//Sets the given parameters or fallback to the default ones:
	this.id = Enemy._idCounter++;
	this.type = type || this.type;
	this.position.x = x || this.position.x;
	this.position.y = y || this.position.y;
	this.level = level || this.level;
	if (this.level > this._levelMax) { this.level = this._levelMax; }
	this._levelMax = this._levelMax || Math.min(this.levelSpeed.length, this.levelDamage.length) - 1;
	if (this._levelMax < 0)
	{
		CB_console("ERROR: Maximum level for the enemy is a negative number!");
		this.isDead = true;
		return this;
	}

	CB_console("Creating enemy #" + this.id + " of type " + this.type + " with level " + this.level + "...");
	
	//If no coordinates were given, finds the starting point and locates the enemy there to start its way:
	if (typeof(x) === "undefined" || typeof(y) === "undefined") { this.position = Enemy._findStartingPoint(map); }
	
	//Calculates the path which will be followed to reach the destiny:
	this._pathCurrentCalculate(this.position.x, this.position.y, map);
	this._pathCurrent.pathPointer = 0; //Resets the path pointer.
	
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


//Disables the sprite:
Enemy.prototype._spritesDisable = function(returnOnFail)
{
	var sprites = this._getSprites(null);
	if (sprites === null) { return returnOnFail; }

	sprites.subSprite = CB_copyObject(sprites.subSprite);
	sprites.subSprite.disabled = true;

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
	sprites.subSprite.disabled = false;

	CB_console("Updating coordinates for #" + (this.id) + " => " + sprites.subSprite.id);

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
Enemy._getPathPointsToDestinyCache = {};
Enemy._getPathPointsToDestiny = function(x, y, map)
{
	var levelCurrent = Game.data.level;

	x = x || 0;
	y = y || 0;
	map = map || Game.Levels.data[levelCurrent].map;

	var cacheIndex = levelCurrent + "_" + x + "_" + y;

	if (typeof(Enemy._getPathPointsToDestinyCache[cacheIndex]) !== "undefined")
	{
		return Enemy._getPathPointsToDestinyCache[cacheIndex].pointsToDestiny;
	}
	else
	{
		Enemy._getPathPointsToDestinyCache[cacheIndex] = {};
		Enemy._getPathPointsToDestinyCache[cacheIndex].originX = x;
		Enemy._getPathPointsToDestinyCache[cacheIndex].originY = y;
	}
	
	//Finds the destiny coordinates (assumes there is only one):
	var destinyCoordinates = Game.Levels._findDestinyOnMap(levelCurrent);
	if (destinyCoordinates !== null)
	{
		Enemy._getPathPointsToDestinyCache[cacheIndex].destinyX = destinyCoordinates.x;
		Enemy._getPathPointsToDestinyCache[cacheIndex].destinyY = destinyCoordinates.y;
	}
	else
	{
		CB_console("No destiny could be found on the given map! Cannot calculate path for the enemy.");
		return [];
	}
	
	//Calculates the path points from origin to the destiny:
	var pathPointsToDestiny = Game.Levels._calculatePathPointsToDestiny(x, y, destinyCoordinates.x, destinyCoordinates.y, map, levelCurrent);
	if (pathPointsToDestiny === null)
	{
		CB_console("No path to the destiny could be found on the given map! Cannot calculate path for the enemy.");
		return [];
	}
	
	Enemy._getPathPointsToDestinyCache[cacheIndex].pointsToDestiny = pathPointsToDestiny.pathPointsTotal;
	
	return pathPointsToDestiny.pathPointsTotal;
}


//Calcultes and returns the path which will be followed to reach its destiny:
Enemy.prototype._pathCurrentCalculate = function(x, y, map, level)
{
	x = x || this.position.x || 0;
	y = y || this.position.y || 0;
	map = map || Game.Levels.data[Game.data.level].map;

	this._pathCurrent.points = Enemy._getPathPointsToDestiny(x, y, map);
	
	return this._pathCurrent.points;
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
	if (this._isObjectiveReached())
	{
		CB_console("Enemy #" + this.id + " reached destiny!");
		Game.data.vitality -= this.levelDamage[this.level];
		this.succeeded = true;
		this.die();
	}
	//...otherwise, continues its way:
	else
	{
		this._walk(this._pathCurrent.points[this._pathCurrent.pathPointer].x, this._pathCurrent.points[this._pathCurrent.pathPointer].y);
	}
}


//Tells whether the objective has been reached or not yet:
Enemy.prototype._isObjectiveReached = function()
{
	return (this._pathCurrent.pathPointer >= this._pathCurrent.points.length - 1);
}


//Walks trough its way:
Enemy.prototype._walkLastTime = null;
Enemy.prototype._walk = function(pathX, pathY)
{
	//Having into account the enemy speed, does not walk if it still should not move:
	// TO DO.
	if (this._walkLastTime && this.levelSpeed[this.level] > 0)
	{
		//this._walkLastTime = CB_Device.getTiming()
		if (this._walkLastTime + (1000 / this.levelSpeed[this.level]) > CB_Device.getTiming())
		{
			return false;
		}
	}
	
	this.isWalking = true;
	
	if (this._needsRotateToFollow(pathX, pathY))
	{
		this._pointPath(pathX, pathY);
	}
	else
	{
		this.isRotating = false;
	}
	
	//If reached the current point, follows to the next one (if any):
	if (this.position.x === this._pathCurrent.points[this._pathCurrent.pathPointer].x && this.position.y === this._pathCurrent.points[this._pathCurrent.pathPointer].y)
	{
		if (this._pathCurrent.pathPointer < this._pathCurrent.points.length - 1) { this._pathCurrent.pathPointer++; }
	}
	
	//TO DO: stop moving once the desired coordinates have been reached.
	
	//TO DO: use screen coordinates (xScreen/yScreen) instead of map ones.
	
	if (this._pathCurrent.points[this._pathCurrent.pathPointer].direction === "up")
	{
		this.position.y--;
	}
	else if (this._pathCurrent.points[this._pathCurrent.pathPointer].direction === "down")
	{
		this.position.y++;
	}
	else if (this._pathCurrent.points[this._pathCurrent.pathPointer].direction === "left")
	{
		this.position.x--;
	}
	else if (this._pathCurrent.points[this._pathCurrent.pathPointer].direction === "right")
	{
		this.position.x++;
	}

	//Stores the time when it has moved:
	this._walkLastTime = CB_Device.getTiming();

	
	//Updates the sprite with the new position:
	this._spritesUpdateCoordinates(this.position.x, this.position.y);
	
	return true;
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
	CB_console("Enemy #" + this.id + " died!");
	this.isDead = true;
	this._spritesDisable();	
}



//TO DO: implement different enemy types (1 can use default properties/methods).