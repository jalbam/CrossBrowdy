/* This file belongs to a CrossBrowdy.com example, made by Joan Alba Maldonado. Creative Commons Attribution 4.0 International License. */

/*
	Symbols meaning:
		" " (space)	=> Blank space. It will be filled randomly with non-walkable and non-buildable symbols (just decoration).
		"@"			=> Destiny (there can only be one). Enemies will want to reach this target.
		NOTE: Check symbols below ('_LEVELS_SYMBOLS' object) to see the rest.
*/


var _LEVELS_SYMBOLS =
{
	//Symbols for walkable path:
	//NOTE: the ones attached to the borders will allow enemies to appear from there.
	"{Game.Levels.SYMBOL_TYPES.SOIL_WALKABLE}":
	[
		"0",	//Soil (default).
		"1"		//Water.
	],
	
	//Symbols for non-walkable and buildable tiles:
	"{Game.Levels.SYMBOL_TYPES.SOIL_UNWALKABLE_BUILDABLE}":
	[
		"0",	//Soil (default).
		"1"		//Water.
	],
	
	//Symbols for non-walkable and non-buildable tiles (decoration):
	"{Game.Levels.SYMBOL_TYPES.SOIL_UNWALKABLE_UNBUILDABLE}":
	[
		"0",	//Soil (default).
		"1"		//Water.
	]
};


//Levels array:
var _LEVELS =
[
	//Level 0:
	{
		//Map:
		map:
		[
			"       *          ".split(""),
			"       $-  -   ---".split(""),
			"      -$$$ *$$$$$*".split(""),
			"  -$$$-$-$-$- -$-!".split(""),
			"*$$$-$$$-$$$- -$$@".split(""),
			"    -$-$$$ $$$$$--".split(""),
			"     *            ".split("")
		],
		//Enemy waves:
		enemyWaves:
		[
			//Wave 0:
			{
				timeBetweenEnemies: 10000, //Time for the next enemy to appear after previous one (milliseconds).
				timeFromLastEnemyToNextWave: 5000, //Time to wait until next wave (milliseconds).
				enemies: //Enemies, each array value is an object with the enemy type and its level (set to null a property to use default one):
				[
					{ type: 0, level: 0 }, { type: 0, level: 0 }, { type: 0, level: 0 }
				]
			},
			//Wave 1:
			{
				timeBetweenEnemies: 8000, //Time for the next enemy to appear after previous one (milliseconds).
				timeFromLastEnemyToNextWave: 4000, //Time to wait until next wave (milliseconds).
				enemies:
				[
					{ type: 0, level: 0 }, { type: 0, level: 0 }, { type: 0, level: 0 },
					{ type: 0, level: 1 }, { type: 0, level: 1 }, { type: 0, level: 1 }
				]
			},
			//Wave 2:
			{
				timeBetweenEnemies: 6000, //Time for the next enemy to appear after previous one (milliseconds).
				timeFromLastEnemyToNextWave: 3000, //Time to wait until next wave (milliseconds).
				enemies:
				[
					{ type: 0, level: 0 }, { type: 0, level: 0 }, { type: 0, level: 0 },
					{ type: 0, level: 1 }, { type: 0, level: 1 }, { type: 0, level: 1 },
					{ type: 1, level: 0 }, { type: 1, level: 0 }, { type: 1, level: 0 }
				]
			},
			//Wave 3:
			{
				timeBetweenEnemies: 4000, //Time for the next enemy to appear after previous one (milliseconds).
				timeFromLastEnemyToNextWave: 2000, //Time to wait until next wave (milliseconds).
				enemies:
				[
					{ type: 0, level: 0 }, { type: 0, level: 0 }, { type: 0, level: 0 },
					{ type: 0, level: 1 }, { type: 0, level: 1 }, { type: 0, level: 1 },
					{ type: 1, level: 0 }, { type: 1, level: 0 }, { type: 1, level: 0 },
					{ type: 1, level: 1 }, { type: 1, level: 1 }, { type: 1, level: 1 }
				]
			},
			//Wave 4:
			{
				timeBetweenEnemies: 2000, //Time for the next enemy to appear after previous one (milliseconds).
				timeFromLastEnemyToNextWave: 1000, //Time to wait until next wave (milliseconds).
				enemies:
				[
					{ type: 0, level: 0 }, { type: 0, level: 0 }, { type: 0, level: 0 },
					{ type: 1, level: 0 }, { type: 1, level: 0 }, { type: 1, level: 0 },
					{ type: 0, level: 1 }, { type: 0, level: 1 }, { type: 0, level: 1 },
					{ type: 1, level: 1 }, { type: 1, level: 1 }, { type: 1, level: 1 },
					{ type: 0, level: 2 }, { type: 0, level: 2 }, { type: 0, level: 2 },
					{ type: 1, level: 2 }, { type: 1, level: 2 }, { type: 1, level: 2 }
				]
			},
			//Wave 5:
			{
				timeBetweenEnemies: 1000, //Time for the next enemy to appear after previous one (milliseconds).
				timeFromLastEnemyToNextWave: 500, //Time to wait until next wave (milliseconds).
				enemies:
				[
					{ type: 0, level: 0 }, { type: 0, level: 0 }, { type: 0, level: 0 },
					{ type: 1, level: 0 }, { type: 1, level: 0 }, { type: 1, level: 0 },
					{ type: 0, level: 1 }, { type: 0, level: 1 }, { type: 0, level: 1 },
					{ type: 1, level: 1 }, { type: 1, level: 1 }, { type: 1, level: 1 },
					{ type: 0, level: 2 }, { type: 0, level: 2 }, { type: 0, level: 2 },
					{ type: 1, level: 2 }, { type: 1, level: 2 }, { type: 1, level: 2 },
					{ type: 0, level: 3 }, { type: 0, level: 3 }, { type: 0, level: 3 },
					{ type: 1, level: 3 }, { type: 1, level: 3 }, { type: 1, level: 3 }
				]
			},
			//Wave 6:
			{
				timeBetweenEnemies: 500, //Time for the next enemy to appear after previous one (milliseconds).
				timeFromLastEnemyToNextWave: 0, //Time to wait until next wave (milliseconds). Last wave does not needed!
				enemies:
				[
					{ type: 0, level: 0 }, { type: 0, level: 0 }, { type: 0, level: 0 },
					{ type: 1, level: 0 }, { type: 1, level: 0 }, { type: 1, level: 0 },
					{ type: 0, level: 1 }, { type: 0, level: 1 }, { type: 0, level: 1 },
					{ type: 1, level: 1 }, { type: 1, level: 1 }, { type: 1, level: 1 },
					{ type: 0, level: 2 }, { type: 0, level: 2 }, { type: 0, level: 2 },
					{ type: 1, level: 2 }, { type: 1, level: 2 }, { type: 1, level: 2 },
					{ type: 0, level: 3 }, { type: 0, level: 3 }, { type: 0, level: 3 },
					{ type: 1, level: 3 }, { type: 1, level: 3 }, { type: 1, level: 3 },
					{ type: 0, level: 4 }, { type: 0, level: 4 }, { type: 0, level: 4 },
					{ type: 1, level: 4 }, { type: 1, level: 4 }, { type: 1, level: 4 }
				]
			}
		]
	}
];