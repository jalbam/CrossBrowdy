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
Tower.prototype.id = null;
Tower.prototype.type = 0; //Tower type (0 by default).
Tower.prototype.level = 0; //Tower level (0 is the first one).
Tower.prototype.x = 0; //Tower horizontal position.
Tower.prototype.y = 0; //Tower vertical position.
Tower.prototype.rotation = 0; //Tower rotation (they rotate to point to a target).
Tower.prototype.levelSpeed = [ 1, 1.5, 2 ]; //Tower speed (1 is normal speed), separated by level.
Tower.prototype.levelRadiusSeen = [ 3, 5, 8 ]; //Radius that the tower can see targets (each unit represents the height of a tile), separated by level.
Tower.prototype.isRotating = false; //Determines whether the tower is currently rotating to point to a target.
Tower.prototype.isFiring = false; //Determines whether the tower is currently attacking to a target.
Tower.prototype.levelCosts = [ 100, 200, 300 ]; //Cost of each level (from 0, when the tower is first built) and their upgrades.
Tower.prototype.targetCurrent = null; //Keeps the current target to be attacked or being attacked already.
Tower.prototype._spriteCurrent = null; //Tower current sprite used.


//Internal constructor:
Tower.prototype._init = function(x, y, type)
{
	//Sets the given parameters or fallback to the default ones:
	this.id = Tower._idCounter++;
	this.x = x || this.x;
	this.y = y || this.y;
	this.type = type || this.type;
	
	logMessage("Creating tower #" + this.id + " of type " + this.type + " on (" + this.x + ", " + this.y + ")...");
	
	return this;
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

//TO DO: implement different tower types (1 can use default properties/methods).