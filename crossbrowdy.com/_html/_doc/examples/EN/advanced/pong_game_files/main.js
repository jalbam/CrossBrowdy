//Path to the graphic rendering engine module:
var CB_GEM_PATH = CB_GEM_PATH || "../simple_game_engine_files/";

var CB_GEM_DEBUG_MESSAGES = true; //Shows debug messages.

//Adds the game engine module to CrossBrowdy:
var CB_GEM_MODULE_NEEDED_MODULES = {};
CB_GEM_MODULE_NEEDED_MODULES[CB_GEM_PATH + "game_engine_module.js"] = { load: true, mandatory: true, absolutePath: true };
CB_Modules.addNeededModule(CB_NAME, "GAME_ENGINE_MODULE", CB_GEM_MODULE_NEEDED_MODULES);

CB_init(main); //It will call the "main" function when ready


//This function will be called when CrossBrowdy is ready:
function main()
{
	CB_console("CrossBrowdy and all needed modules loaded. Starting game...");
	
	//Prepares the background music (to play it later):
	prepareMusic();
	
	//Defines needed data:
	var goalsToNextLevel = 3;
	var ballSpeedMsInitial = 16;
	var ballSpeedMsDecrement = 1; //The number of milliseconds needed to move the ball each step which will be decremented in each level (so it will be faster).
	var ballMovePercentageHorizontalInitial = 0.006; //Number of percentage of the field that the ball will move horizontally at the beginning, in each step.
	var ballMovePercentageVerticalInitial = 0.003; //Number of percentage of the field to move the ball vertically at the beginning, in each step.
	CB_GEM.data = //Data stored in the game engine module (can be exported to save the game status):
	{
		//Note: most of the data will be calculated automatically and dynamically.
		soundEnabled: true, //Set to false to disable sound.
		gameStarted: false,
		level: 1,
		field:
		{
			top: 0,
			left: 0,
			width: 0,
			height: 0
		},
		player1:
		{
			goals: 0,
			x: 0,
			y: 0,
			width: 0,
			height: 0
		},
		player2:
		{
			goals: 0,
			x: 0,
			y: 0,
			width: 0,
			height: 0
		},
		ball:
		{
			speedMsInitial: ballSpeedMsInitial,
			speedMs: ballSpeedMsInitial,
			movePercentageHorizontalInitial: ballMovePercentageHorizontalInitial,
			movePercentageHorizontal: ballMovePercentageHorizontalInitial,
			movePercentageVerticalInitial: ballMovePercentageVerticalInitial,
			movePercentageVertical: ballMovePercentageVerticalInitial,
			x: 0,
			y: 0,
			radius: 0,
			direction: 0, //0 = not moving (stuck to a paddle), 1 = left to right, 2 = right to left.
			firstPlayer: Math.floor(Math.random() * 2) + 1 //1 or 2 (random).
		}
	};
	
	//Sets the desired sprites scene data (can be modified dynamically):
	var fieldLineWidth = 10;
	CB_GEM.spritesGroupsData =
	{
		//'my_sprites_groups_1' ('CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT' object). Some missing or non-valid properties will get a default value:
		id: "my_sprites_groups_1", //Identifier of the sprites groups object (also used for the 'CB_GraphicSpritesScene' object). Optional but recommended. It should be unique. By default, it is generated automatically.
		//Numeric array containing 'CB_GraphicSprites.SPRITES_OBJECT' objects with all the sprites groups that will be used (their "parent" property will be set to point the current 'CB_GraphicSpritesScene' object which contains them):
		spritesGroups:
		[
			{
				id: "info",
				srcType: CB_GraphicSprites.SRC_TYPES.TEXT,
				top: 15,
				zIndex: 3,
				data:
				{
					fontSize: "16px",
					fontFamily: "courier",
					style: "#ffff00",
					fontWeight: "bold"
				},
				sprites: [ { id: "info_sprite" } ]
			},
			{
				id: "field_group",
				srcType: CB_GraphicSprites.SRC_TYPES.RECTANGLE,
				sprites:
				[
					{
						id: "field",
						left: null, //It will be calculated dynamically.
						top: null, //It will be calculated dynamically.
						width: null, //It will be calculated dynamically.
						height: null, //It will be calculated dynamically.
						data:
						{
							stroke: true,
							lineWidth: fieldLineWidth,
							style: function(element, canvasContext, canvasBufferContext, userBuffer) { return getGradientStyle("#aa0000", "#aaaa00", element, canvasContext); }
						},
						subSprites:
						[
							{
								id: "field_middle",
								srcType: CB_GraphicSprites.SRC_TYPES.SEGMENT,
								data:
								{
									x1: null, //It will be calculated dynamically.
									y1: null, //It will be calculated dynamically.
									x2: null, //It will be calculated dynamically.
									y2: null, //It will be calculated dynamically.
									style: function(element, canvasContext, canvasBufferContext, userBuffer) { return getGradientStyle("#aa4400", "#aa6600", element, canvasContext); }
								}
							}
						]
					}
				]
			},
			{
				id: "paddles_group",
				srcType: CB_GraphicSprites.SRC_TYPES.RECTANGLE,
				sprites:
				[
					{
						id: "paddles",
						data:
						{
							hidden: true,
							lineWidth: fieldLineWidth,
							style: function(element, canvasContext, canvasBufferContext, userBuffer) { return getGradientStyle("#00aa00", "#aaaa00", element, canvasContext); }
						},
						subSprites:
						[
							{
								id: "paddle_1",
								left: null, //It will be calculated dynamically.
								top: null, //It will be calculated dynamically.
								width: null, //It will be calculated dynamically.
								height: null, //It will be calculated dynamically
								data: { hidden: false }
							},
							{
								id: "paddle_2",
								left: null, //It will be calculated dynamically.
								top: null, //It will be calculated dynamically.
								width: null, //It will be calculated dynamically.
								height: null, //It will be calculated dynamically
								data: { hidden: false }
							}
						]
					}
				]
			},
			{
				id: "ball_group",
				srcType: CB_GraphicSprites.SRC_TYPES.CIRCLE,
				sprites:
				[
					{
						id: "ball",
						data:
						{
							radius: null, //It will be calculated dynamically.
							opacity: 0.5,
							style: function(element, canvasContext, canvasBufferContext, userBuffer) { return getGradientStyle("#00aa00", "#aaaa00", element, canvasContext); }
						}
					}
				]
			}
		]
	};
	
	//Defines the events to detect the pointer input and capture the coordinates:
	setPointerEvents();

	//Defines the callbacks for the game loop:
	var timingLastTime = 0;
	var timingNow = null;
	CB_GEM.onLoopStart = function(graphicSpritesSceneObject, CB_REM_dataObject, expectedCallingTime) //When the game loop starts (before rendering the graphics):
	{
		//Manages input:
		manageInput();
		
		//If the game has not started, exits:
		if (!CB_GEM.data.gameStarted) { return; }
		//...otherwise, if the ball is stuck to a paddle, exits:
		else if (CB_GEM.data.ball.direction === 0) { return; } //0 = not moving (stuck to a paddle), 1 = left to right, 2 = right to left.
		//...otherwise (the ball is released, not stuck to a paddle), the ball should be moving so proceeds:
		else
		{
			//Gets the current timing:
			timingNow = CB_Device.getTiming();
			
			//If enough time has elapsed, moves the ball:
			if (timingNow - timingLastTime >= CB_GEM.data.ball.speedMs)
			{
				//Moves the ball vertically:
				graphicSpritesSceneObject.getById("ball_group").getById("ball").top = CB_GEM.data.ball.y += CB_GEM.data.ball.movePercentageVertical * CB_GEM.data.field.height;

				//Calculates goals and collisions with the paddles:
				if (CB_GEM.data.ball.direction === 1) //Ball goes left to right.
				{
					//Moves the ball horizontally:
					graphicSpritesSceneObject.getById("ball_group").getById("ball").left = CB_GEM.data.ball.x += CB_GEM.data.ball.movePercentageHorizontal * CB_GEM.data.field.width;
					
					//Calculates if a goal was scored:
					if (CB_GEM.data.ball.x + CB_GEM.data.ball.radius >= CB_GEM.data.field.left + CB_GEM.data.field.width)
					{
						CB_GEM.data.player1.goals++; //Winner scores a goal.
						CB_GEM.data.ball.direction = 0; //Stops the ball.
						CB_GEM.data.ball.movePercentageVertical = CB_GEM.data.ball.movePercentageVerticalInitial;
						if (Math.floor(Math.random() * 2) === 0) { CB_GEM.data.ball.movePercentageVertical *= -1; } //It starts moving down or up, randomly.
						CB_GEM.data.ball.firstPlayer = 2; //Next turn will be started by the loser.
						//Sticks the ball to the loser's paddle:
						graphicSpritesSceneObject.getById("ball_group").getById("ball").left = CB_GEM.data.ball.x = CB_GEM.data.player2.x - CB_GEM.data.ball.radius; //Sets the ball horizontally to the limit allowed.
						graphicSpritesSceneObject.getById("ball_group").getById("ball").top = CB_GEM.data.ball.y = CB_GEM.data.player2.y + CB_GEM.data.player2.height / 2; //Sets the ball vertically in the middle of the paddle.
						
						playSoundFx("goal"); //Plays the goal sound.
					}
					//...otherwise, calculates collision with the front part of the player 2's paddle:
					else if (CB_Collisions.isLineTouchingCircle(CB_GEM.data.player2.x, CB_GEM.data.player2.y, CB_GEM.data.player2.x, CB_GEM.data.player2.y + CB_GEM.data.player2.height, CB_GEM.data.ball.x, CB_GEM.data.ball.y, CB_GEM.data.ball.radius))
					{
						graphicSpritesSceneObject.getById("ball_group").getById("ball").left = CB_GEM.data.ball.x = CB_GEM.data.player2.x - CB_GEM.data.ball.radius; //Sets the ball horizontally to the limit allowed.
						
						//The ball direction changes:
						CB_GEM.data.ball.direction = 2; //Ball will go from right to left.
						
						//Inclination of the ball depends on the part of the paddle hit:
						var verticalDistance = CB_Collisions.getDistancePoints(0, CB_GEM.data.ball.y, 0, CB_GEM.data.player2.y + CB_GEM.data.player2.height / 2);
						var verticalIncination = 5;
						if (verticalDistance <= CB_GEM.data.player2.height / 16) { verticalIncination = 1; }
						else if (verticalDistance <= CB_GEM.data.player2.height / 8) { verticalIncination = 2; }
						else if (verticalDistance <= CB_GEM.data.player2.height / 6) { verticalIncination = 3; }
						else if (verticalDistance <= CB_GEM.data.player2.height / 4) { verticalIncination = 4; }
						if (CB_GEM.data.ball.movePercentageVertical < 0) { verticalIncination *= -1; }
						CB_GEM.data.ball.movePercentageVertical = verticalIncination * Math.abs(CB_GEM.data.ball.movePercentageVerticalInitial);
						
						playSoundFx("hit_paddle"); //Plays the paddle hit sound.
					}
					//...otherwise, calculates collision with the upper part (horizontal side) of the player 2's paddle:
					else if (CB_Collisions.isLineTouchingCircle(CB_GEM.data.player2.x, CB_GEM.data.player2.y, CB_GEM.data.player2.x + CB_GEM.data.player2.width, CB_GEM.data.player2.y, CB_GEM.data.ball.x, CB_GEM.data.ball.y, CB_GEM.data.ball.radius))
					{
						graphicSpritesSceneObject.getById("ball_group").getById("ball").top = CB_GEM.data.ball.y = CB_GEM.data.player2.y - CB_GEM.data.ball.radius; //Sets the ball vertically to the limit allowed.
						
						//If the ball was going down, changes its direction to go up:
						if (CB_GEM.data.ball.movePercentageVertical < 0) { CB_GEM.data.ball.movePercentageVertical *= -1; }
						//...otherwise, if the ball was going up:
						else {  } //TO DO: not done to keep the example simpler.
						
						playSoundFx("hit_paddle"); //Plays the paddle hit sound.
					}
					//...otherwise, calculates collision with the bottom part (horizontal side) of the player 2's paddle:
					else if (CB_Collisions.isLineTouchingCircle(CB_GEM.data.player2.x, CB_GEM.data.player2.y + CB_GEM.data.player2.height, CB_GEM.data.player2.x + CB_GEM.data.player2.width, CB_GEM.data.player2.y + CB_GEM.data.player2.height, CB_GEM.data.ball.x, CB_GEM.data.ball.y, CB_GEM.data.ball.radius))
					{
						graphicSpritesSceneObject.getById("ball_group").getById("ball").top = CB_GEM.data.ball.y = CB_GEM.data.player2.y + CB_GEM.data.player2.height + CB_GEM.data.ball.radius; //Sets the ball vertically to the limit allowed.
						
						//If the ball was going up, changes its direction to go down:
						if (CB_GEM.data.ball.movePercentageVertical > 0) { CB_GEM.data.ball.movePercentageVertical *= -1; }
						//...otherwise, if the ball was going down:
						else {  } //TO DO: not done to keep the example simpler.
						
						playSoundFx("hit_paddle"); //Plays the paddle hit sound.
					}
				}
				else if (CB_GEM.data.ball.direction === 2) //Ball goes right to left.
				{
					//Moves the ball horizontally:
					graphicSpritesSceneObject.getById("ball_group").getById("ball").left = CB_GEM.data.ball.x -= CB_GEM.data.ball.movePercentageHorizontal * CB_GEM.data.field.width;
					
					//Calculates if a goal was scored:
					if (CB_GEM.data.ball.x + CB_GEM.data.ball.radius <= CB_GEM.data.field.left)
					{
						CB_GEM.data.player2.goals++; //Winner scores a goal.
						CB_GEM.data.ball.direction = 0; //Stops the ball.
						CB_GEM.data.ball.movePercentageVertical = CB_GEM.data.ball.movePercentageVerticalInitial;
						if (Math.floor(Math.random() * 2) === 0) { CB_GEM.data.ball.movePercentageVertical *= -1; } //It starts moving down or up, randomly.
						CB_GEM.data.ball.firstPlayer = 1; //Next turn will be started by the loser.
						//Sticks the ball to the loser's paddle:
						graphicSpritesSceneObject.getById("ball_group").getById("ball").left = CB_GEM.data.ball.x = CB_GEM.data.player1.x + CB_GEM.data.player1.width + CB_GEM.data.ball.radius; //Sets the ball horizontally to the limit allowed.
						graphicSpritesSceneObject.getById("ball_group").getById("ball").top = CB_GEM.data.ball.y = CB_GEM.data.player1.y + CB_GEM.data.player1.height / 2; //Sets the ball vertically in the middle of the paddle.

						playSoundFx("goal"); //Plays the goal sound.
					}
					//...otherwise, calculates collision with the front part of the  player 1's paddle:
					else if (CB_Collisions.isLineTouchingCircle(CB_GEM.data.player1.x + CB_GEM.data.player1.width, CB_GEM.data.player1.y, CB_GEM.data.player1.x + CB_GEM.data.player1.width, CB_GEM.data.player1.y + CB_GEM.data.player1.height, CB_GEM.data.ball.x, CB_GEM.data.ball.y, CB_GEM.data.ball.radius))
					{
						graphicSpritesSceneObject.getById("ball_group").getById("ball").left = CB_GEM.data.ball.x = CB_GEM.data.player1.x + CB_GEM.data.player1.width + CB_GEM.data.ball.radius; //Sets the ball horizontally to the limit allowed.
						
						//The ball direction changes:
						CB_GEM.data.ball.direction = 1; //Ball will go from left to right.

						//Inclination of the ball depends on the part of the paddle hit:
						var verticalDistance = CB_Collisions.getDistancePoints(0, CB_GEM.data.ball.y, 0, CB_GEM.data.player1.y + CB_GEM.data.player1.height / 2);
						var verticalIncination = 5;
						if (verticalDistance <= CB_GEM.data.player2.height / 16) { verticalIncination = 1; }
						else if (verticalDistance <= CB_GEM.data.player2.height / 8) { verticalIncination = 2; }
						else if (verticalDistance <= CB_GEM.data.player2.height / 6) { verticalIncination = 3; }
						else if (verticalDistance <= CB_GEM.data.player2.height / 4) { verticalIncination = 4; }
						if (CB_GEM.data.ball.movePercentageVertical < 0) { verticalIncination *= -1; }
						CB_GEM.data.ball.movePercentageVertical = verticalIncination * Math.abs(CB_GEM.data.ball.movePercentageVerticalInitial);
						
						playSoundFx("hit_paddle"); //Plays the paddle hit sound.
					}
					//...otherwise, calculates collision with the upper part (horizontal side) of the player 1's paddle:
					else if (CB_Collisions.isLineTouchingCircle(CB_GEM.data.player1.x, CB_GEM.data.player1.y, CB_GEM.data.player1.x + CB_GEM.data.player1.width, CB_GEM.data.player1.y, CB_GEM.data.ball.x, CB_GEM.data.ball.y, CB_GEM.data.ball.radius))
					{
						graphicSpritesSceneObject.getById("ball_group").getById("ball").top = CB_GEM.data.ball.y = CB_GEM.data.player1.y - CB_GEM.data.ball.radius; //Sets the ball vertically to the limit allowed.
						
						//If the ball was going down, changes its direction to go up:
						if (CB_GEM.data.ball.movePercentageVertical < 0) { CB_GEM.data.ball.movePercentageVertical *= -1; }
						//...otherwise, if the ball was going up:
						else {  } //TO DO: not done to keep the example simpler.
						
						playSoundFx("hit_paddle"); //Plays the paddle hit sound.
					}
					//...otherwise, calculates collision with the bottom part (horizontal side) of the player 1's paddle:
					else if (CB_Collisions.isLineTouchingCircle(CB_GEM.data.player1.x, CB_GEM.data.player1.y + CB_GEM.data.player1.height, CB_GEM.data.player1.x + CB_GEM.data.player1.width, CB_GEM.data.player1.y + CB_GEM.data.player1.height, CB_GEM.data.ball.x, CB_GEM.data.ball.y, CB_GEM.data.ball.radius))
					{
						graphicSpritesSceneObject.getById("ball_group").getById("ball").top = CB_GEM.data.ball.y = CB_GEM.data.player1.y + CB_GEM.data.player1.height + CB_GEM.data.ball.radius; //Sets the ball vertically to the limit allowed.
						
						//If the ball was going up, changes its direction to go down:
						if (CB_GEM.data.ball.movePercentageVertical > 0) { CB_GEM.data.ball.movePercentageVertical *= -1; }
						//...otherwise, if the ball was going down:
						else {  } //TO DO: not done to keep the example simpler.
						
						playSoundFx("hit_paddle"); //Plays the paddle hit sound.
					}
				}
				
				//Calculates ball collision with the top or bottom parts of the field:
				if (CB_GEM.data.ball.movePercentageVertical < 0 && CB_GEM.data.ball.y - CB_GEM.data.ball.radius <= CB_GEM.data.field.top + CB_GEM.data.field.fieldLineWidth / 2) //The ball has hit the top part.
				{
					graphicSpritesSceneObject.getById("ball_group").getById("ball").top = CB_GEM.data.ball.y = CB_GEM.data.field.top + CB_GEM.data.field.fieldLineWidth / 2 + CB_GEM.data.ball.radius; //Sets the ball vertically to the limit allowed.
					CB_GEM.data.ball.movePercentageVertical *= -1; //Reverts it (from up to down).
					playSoundFx("hit_border"); //Plays the border hit sound.
				}
				if (CB_GEM.data.ball.movePercentageVertical > 0 && CB_GEM.data.ball.y + CB_GEM.data.ball.radius >= CB_GEM.data.field.top + CB_GEM.data.field.height - CB_GEM.data.field.fieldLineWidth / 2) //The ball has hit the bottom part.
				{
					graphicSpritesSceneObject.getById("ball_group").getById("ball").top = CB_GEM.data.ball.y = CB_GEM.data.field.top + CB_GEM.data.field.height - CB_GEM.data.field.fieldLineWidth / 2 - CB_GEM.data.ball.radius; //Sets the ball vertically to the limit allowed.
					CB_GEM.data.ball.movePercentageVertical *= -1; //Reverts it (from down to up).
					playSoundFx("hit_border"); //Plays the border hit sound.
				}
				
				timingLastTime = timingNow; //Updates the last timing when the ball was moved for the last time.
				updateInfo(graphicSpritesSceneObject); //Updates the information shown.
			}
		}
	};
	
	CB_GEM.onLoopEnd = function(graphicSpritesSceneObject, CB_REM_dataObject, expectedCallingTime) //When the game loop ends (after rendering the graphics):
	{
		if (!CB_GEM.data.gameStarted) { return; }
		
		//If any of the players has reached the needed goals to jump to the next level, proceeds:
		if (CB_GEM.data.player1.goals >= goalsToNextLevel || CB_GEM.data.player2.goals >= goalsToNextLevel)
		{
			CB_GEM.data.player1.goals = CB_GEM.data.player2.goals = 0; //Resets goals for everyone.
			CB_GEM.data.level++; //Increases the level.
			CB_GEM.data.ball.speedMs -= ballSpeedMsDecrement; //Decrements the milliseconds needed to move the ball each step (increments speed).
			if (CB_GEM.data.ball.speedMs < 0) { CB_GEM.data.ball.speedMs = 0; }
			updateInfo(graphicSpritesSceneObject); //Updates the information shown.
		}
	};
	
	//Starts the game engine module:
	CB_GEM.begin
	(
		//onStart:
		function(graphicSpritesSceneObject, CB_CanvasObject, CB_CanvasObjectBuffer, FPSSprites) //'FPSSprites' contains the 'CB_GraphicSprites.SPRITES_OBJECT' object used to display the FPS counter.
		{
			FPSSprites.setDisabled(false); //Set to true to hide FPS counter.
	
			resizeElements(graphicSpritesSceneObject, true); //Updates all visual elements according to the screen size.

			updateInfo(graphicSpritesSceneObject); //Shows the information for the first time.
	
			//Updates all when the screen is resized:
			CB_Screen.onResize(function() {	resizeElements(graphicSpritesSceneObject); updateInfo(graphicSpritesSceneObject); });
			
			CB_Elements.hideById("loading"); //Hides the loading message.
			CB_Elements.showById("start_button"); //Shows the start button.
		},
		
		//onError:
		function(error) { CB_console("Error: " + error); }
	);
}


//Starts the game:
function gameStart(graphicSpritesSceneObject)
{
	if (CB_GEM.data.gameStarted) { return; }

	graphicSpritesSceneObject = graphicSpritesSceneObject || CB_GEM.graphicSpritesSceneObject;
	if (!graphicSpritesSceneObject) { return; }
	
	//Hides the start button:
	CB_Elements.hideById("start_button");
	
	//Resets data:
	CB_GEM.data.player1.goals = CB_GEM.data.player2.goals = 0;
	CB_GEM.data.level = 1;
	CB_GEM.data.ball.speedMs = CB_GEM.data.ball.speedMsInitial; 
	CB_GEM.data.ball.movePercentageHorizontal = CB_GEM.data.ball.movePercentageHorizontalInitial;
	CB_GEM.data.ball.movePercentageVertical = CB_GEM.data.ball.movePercentageVerticalInitial;
	if (Math.floor(Math.random() * 2) === 0) { CB_GEM.data.ball.movePercentageVertical *= -1; } //It starts moving down or up, randomly.
	CB_GEM.data.ball.direction = 0; //0 = not moving (stuck to a paddle), 1 = left to right, 2 = right to left.
	CB_GEM.data.ball.firstPlayer = Math.floor(Math.random() * 2) + 1; //1 or 2 (random).
	
	//Updates all visual elements according to the screen size:
	resizeElements(graphicSpritesSceneObject, true);

	//Shows the information for the first time:
	updateInfo(graphicSpritesSceneObject);
	
	//Prepares the sound effects and plays one of them (recommended to do this through a user-driven event):
	prepareSoundFx(); //Prepares sound effects to be used later.
	playSoundFx("start");
	
	//Starts playing the background music (recommended to do this through a user-driven event):
	playMusic(); //If it was playing already, it will not do anything.
	
	//Sets the game as started:
	CB_GEM.data.gameStarted = true; //When set to true, starts the game automatically as the game loops detect it.
}


//Ends the game:
function gameEnd(message)
{
	if (!CB_GEM.data.gameStarted) { return; }
		
	message = CB_trim(message);
	CB_GEM.data.gameStarted = false;
	CB_Elements.insertContentById("start_button", (message !== "" ? message + "<br />" : "") + "Start game!")
	CB_Elements.showById("start_button"); //Shows the start button again.
}


//Updates the information shown:
var updateInfoDebug = true;
function updateInfo(graphicSpritesSceneObject)
{
	graphicSpritesSceneObject.getById("info").get(0).src =
		"Level: " + CB_GEM.data.level + "\n" +
		"Score: " + CB_GEM.data.player1.goals + " - " + CB_GEM.data.player2.goals + "\n" +
		"Ball update speed (ms): " + CB_GEM.data.ball.speedMs +
		(!CB_Screen.isLandscape() ? "\nLandscape screen recommended!" : "") +
		(
			(
				updateInfoDebug ?
					"\nBall: " + CB_GEM.data.ball.x + ", " + CB_GEM.data.ball.y + " (" + (CB_GEM.data.ball.direction === 0 ? "stuck" : "released: " + (CB_GEM.data.ball.direction === 1 ? "left to right" : "right to left"))
				: ""
			) + "), vertical inclination (%): " + CB_GEM.data.ball.movePercentageVertical
		);
}


//Resizes all visual elements according to the screen size:
var _fieldLeftPrevious = null;
var _fieldTopPrevious = null;
var _fieldWidthPrevious = null;
var _fieldHeightPrevious = null;
function resizeElements(graphicSpritesSceneObject, firstTime)
{
	if (graphicSpritesSceneObject instanceof CB_GraphicSpritesScene)
	{
		//Calculates the sized and position of the visual elements according to the screen size:
		var fieldWidth = CB_Screen.getWindowWidth() - 150;
		var fieldHeight = fieldWidth / 3;
		var decrementPixelsHeight = 150;
		while (fieldHeight > CB_Screen.getWindowHeight() - 120)
		{
			fieldWidth = CB_Screen.getWindowWidth() - decrementPixelsHeight;
			fieldHeight = fieldWidth / 3;
			decrementPixelsHeight += 1;
		}
		var fieldLeft = (CB_Screen.getWindowWidth() - fieldWidth) / 2;
		var fieldTop = (CB_Screen.getWindowHeight() - fieldHeight) / 2;
		var fieldLineWidth = fieldWidth / 200;
	
		//Updates the size and position of the field:
		graphicSpritesSceneObject.getById("field_group").getById("field").left = CB_GEM.data.field.left = fieldLeft;

		graphicSpritesSceneObject.getById("field_group").getById("field").top = CB_GEM.data.field.top = fieldTop;
		graphicSpritesSceneObject.getById("field_group").getById("field").width = CB_GEM.data.field.width = fieldWidth;
		graphicSpritesSceneObject.getById("field_group").getById("field").height = CB_GEM.data.field.height = fieldHeight;
		CB_GEM.data.field.fieldLineWidth = fieldLineWidth;
		
		graphicSpritesSceneObject.getById("field_group").getById("field").getById("field_middle").data.x1 = fieldWidth / 2;
		graphicSpritesSceneObject.getById("field_group").getById("field").getById("field_middle").data.y1 = fieldLineWidth / 2;
		graphicSpritesSceneObject.getById("field_group").getById("field").getById("field_middle").data.x2 = fieldWidth / 2;
		graphicSpritesSceneObject.getById("field_group").getById("field").getById("field_middle").data.y2 = fieldHeight - fieldLineWidth / 2 + 1;
		
		graphicSpritesSceneObject.getById("field_group").getById("field").data.lineWidth = fieldLineWidth;
		graphicSpritesSceneObject.getById("field_group").getById("field").getById("field_middle").data.lineWidth = fieldLineWidth;
		
		//Updates the size and position of the ball and paddles (players):
		graphicSpritesSceneObject.getById("ball_group").getById("ball").data.radius = CB_GEM.data.ball.radius = fieldWidth / 180;
		var paddleHeight = fieldHeight / 5;
		graphicSpritesSceneObject.getById("paddles_group").getById("paddles").getById("paddle_1").width = graphicSpritesSceneObject.getById("paddles_group").getById("paddles").getById("paddle_2").width =
			CB_GEM.data.player1.width = CB_GEM.data.player2.width = fieldWidth / 60;
		graphicSpritesSceneObject.getById("paddles_group").getById("paddles").getById("paddle_1").height = graphicSpritesSceneObject.getById("paddles_group").getById("paddles").getById("paddle_2").height =
			CB_GEM.data.player1.height = CB_GEM.data.player2.height = paddleHeight;
		graphicSpritesSceneObject.getById("paddles_group").getById("paddles").getById("paddle_1").left = CB_GEM.data.player1.x = fieldLeft + fieldLineWidth / 2;
		graphicSpritesSceneObject.getById("paddles_group").getById("paddles").getById("paddle_2").left = CB_GEM.data.player2.x = fieldLeft - fieldLineWidth / 2 + fieldWidth - graphicSpritesSceneObject.getById("paddles_group").getById("paddles").getById("paddle_2").width;
		if (firstTime)
		{
			//Sets the position of the paddles:
			CB_GEM.data.player1.y = CB_GEM.data.player2.y =
				graphicSpritesSceneObject.getById("paddles_group").getById("paddles").getById("paddle_1").top = graphicSpritesSceneObject.getById("paddles_group").getById("paddles").getById("paddle_2").top =
				fieldTop + fieldLineWidth / 2 + fieldHeight / 2 - paddleHeight / 2;

			//Sets the position of the ball:
			graphicSpritesSceneObject.getById("ball_group").getById("ball").left = CB_GEM.data.ball.x =
				CB_GEM.data.ball.firstPlayer === 1 ?
					fieldLeft + graphicSpritesSceneObject.getById("paddles_group").getById("paddles").getById("paddle_1").width + CB_GEM.data.ball.radius + fieldLineWidth / 2 :
					fieldLeft + fieldWidth - graphicSpritesSceneObject.getById("paddles_group").getById("paddles").getById("paddle_2").width - CB_GEM.data.ball.radius - fieldLineWidth / 2
			graphicSpritesSceneObject.getById("ball_group").getById("ball").top = CB_GEM.data.ball.y =
				CB_GEM.data.player1.y + paddleHeight / 2;
		}
		else
		{
			//Sets the position of the paddles:
			CB_GEM.data.player1.y = graphicSpritesSceneObject.getById("paddles_group").getById("paddles").getById("paddle_1").top =
				(CB_GEM.data.player1.y - _fieldTopPrevious) / _fieldHeightPrevious * fieldHeight + fieldTop;
			CB_GEM.data.player2.y = graphicSpritesSceneObject.getById("paddles_group").getById("paddles").getById("paddle_2").top =
				(CB_GEM.data.player2.y - _fieldTopPrevious) / _fieldHeightPrevious * fieldHeight + fieldTop;
			
			//Sets the position of the ball:
			graphicSpritesSceneObject.getById("ball_group").getById("ball").left = CB_GEM.data.ball.x =
				(CB_GEM.data.ball.x - _fieldLeftPrevious) / _fieldWidthPrevious * fieldWidth + fieldLeft;
			graphicSpritesSceneObject.getById("ball_group").getById("ball").top = CB_GEM.data.ball.y =
				(CB_GEM.data.ball.y - _fieldTopPrevious) / _fieldHeightPrevious * fieldHeight + fieldTop;
		}
		
		//Stores the current data of the field (for next times):
		_fieldLeftPrevious = fieldLeft;
		_fieldTopPrevious = fieldTop;
		_fieldWidthPrevious = fieldWidth;
		_fieldHeightPrevious = fieldHeight;
	}
}


//Defines the events to detect the pointer input and capture the coordinates:
var pointerCoordinates = { x: null, y: null };
function setPointerEvents()
{
	//Gets and stores or removes the different touches (there can be more than one simultaneously):
	var touchesGet = function(e)
	{
		if (!e.touches) { return; }
		
		//Gets the touching points:
		var touchesCoordinates = {};
		var touchId = null;
		
		for (var x = e.touches.length - 1; x >= 0; x--)
		{
			touchId = typeof(e.touches[x].identifier) !== "undefined" ? e.touches[x].identifier : x;
			touchesCoordinates[touchId] = {};

			if (!pointerCoordinates.touchesCoordinates) { pointerCoordinates.touchesCoordinates = {}; }
			else if (pointerCoordinates.touchesCoordinates[touchId])
			{
				touchesCoordinates[touchId].xPrevious = pointerCoordinates.touchesCoordinates[touchId].x !== e.touches[x].clientX ? pointerCoordinates.touchesCoordinates[touchId].x : pointerCoordinates.touchesCoordinates[touchId].xPrevious;
				touchesCoordinates[touchId].yPrevious = pointerCoordinates.touchesCoordinates[touchId].y !== e.touches[x].clientY ? pointerCoordinates.touchesCoordinates[touchId].y : pointerCoordinates.touchesCoordinates[touchId].yPrevious;
			}

			touchesCoordinates[touchId].id = e.touches[x].identifier;
			touchesCoordinates[touchId].x = e.touches[x].clientX;
			touchesCoordinates[touchId].y = e.touches[x].clientY;
			touchesCoordinates[touchId].processed = false;

			pointerCoordinates.touchesCoordinates[touchId] = touchesCoordinates[touchId];
		}
		e.preventDefault(); //Prevents default behaviour (it will be polyfilled internally if needed, automatically).
	}
	CB_Touch.onStart(touchesGet);
	CB_Touch.onEnter(touchesGet);
	CB_Touch.onMove(touchesGet);
	var touchesClear = function(e) //Clears the touches coordinates:
	{
		//Only keeps the remaining touches:
		if (pointerCoordinates.touchesCoordinates)
		{
			var touchesCoordinates = {};
			for (var x = e.touches.length - 1; x >= 0; x--)
			{
				touchId = typeof(e.touches[x].identifier) !== "undefined" ? e.touches[x].identifier : x;
				touchesCoordinates[touchId] = {};
				touchesCoordinates[touchId].id = e.touches[x].identifier;
				touchesCoordinates[touchId].x = e.touches[x].clientX;
				touchesCoordinates[touchId].y = e.touches[x].clientY;
				touchesCoordinates[touchId].processed = pointerCoordinates.touchesCoordinates[touchId] ? pointerCoordinates.touchesCoordinates[touchId].processed : false;
			}
			pointerCoordinates.touchesCoordinates = touchesCoordinates;
		}
	}
	CB_Touch.onEnd(touchesClear);
	CB_Touch.onCancel(touchesClear);
	CB_Touch.onLeave(touchesClear);
	
	//Gets and stores or removes the pointer coordinates (only uses one touching point):
	var pointerCoordinatesGet = function(e) //Gets the pointer coordinates:
	{
		pointerCoordinates.isMouse = e.type === "mousedown" || e.type === "mousemove";
		pointerCoordinates.xPrevious = pointerCoordinates.x;
		pointerCoordinates.yPrevious = pointerCoordinates.y;
		pointerCoordinates.x = e.clientX;
		pointerCoordinates.y = e.clientY;
		pointerCoordinates.processed = false;
		e.preventDefault(); //Prevents default behaviour (it will be polyfilled internally if needed).
	}; 
	CB_Pointer.onDown(pointerCoordinatesGet);
	CB_Pointer.onMove(pointerCoordinatesGet); //Gets the pointer coordinates.
	var pointerCoordinatesClear = function (e) //Clears the pointer coordinates:
	{
		pointerCoordinates.x = pointerCoordinates.y = null;
	};
	CB_Pointer.onUp(pointerCoordinatesClear);
	CB_Pointer.onCancel(pointerCoordinatesClear);
	CB_Pointer.onLeave(pointerCoordinatesClear);
	CB_Pointer.onOut(pointerCoordinatesClear);
}


//Input management (some controllers can also fire keyboard events):
function manageInput()
{
	if (CB_Keyboard.isKeyDown(CB_Keyboard.keys.ESC)) { gameEnd("Game aborted"); } //After pressing the ESC key, ends the game.
	else
	{
		//If return, space or a button (button 1, 2 or 3) or axis from any gamepad is pressed, starts the game (if it has not stared already):
		if (!CB_GEM.data.gameStarted && (CB_Keyboard.isKeyDown(CB_Keyboard.keys.ENTER) || CB_Keyboard.isKeyDown(CB_Keyboard.keys.SPACEBAR) || CB_Controllers.isButtonDown([1, 2, 3]) || CB_Controllers.getAxesDown().length > 0 || CB_Controllers.getAxesDown("", -1).length > 0))
		{
			gameStart(CB_GEM.graphicSpritesSceneObject);
			return;
		}
		
		var touchingScreen = false;
		
		//Player 1 (uses gamepad #1):
		if (CB_Keyboard.isKeyDown(CB_Keyboard.keys.UP) || CB_Controllers.isAxisDown(1, 1, -1)) { movePaddle(1, 0, CB_GEM.graphicSpritesSceneObject); } //Moves up.
		if (CB_Keyboard.isKeyDown(CB_Keyboard.keys.DOWN) || CB_Controllers.isAxisDown(1, 1)) { movePaddle(1, 1, CB_GEM.graphicSpritesSceneObject); } //Moves down.

		//Player 2 (uses gamepad #0):
		if (CB_Keyboard.isKeyDown(CB_Keyboard.keys.Q) || CB_Controllers.isAxisDown(1, 0, -1)) { movePaddle(2, 0, CB_GEM.graphicSpritesSceneObject); } //Moves up.
		if (CB_Keyboard.isKeyDown(CB_Keyboard.keys.A) || CB_Controllers.isAxisDown(1, 0)) { movePaddle(2, 1, CB_GEM.graphicSpritesSceneObject); } //Moves down.
		
		//Mouse (if there is at least the coordinates of one point):
		if (pointerCoordinates.isMouse && pointerCoordinates.y !== null && pointerCoordinates.x !== null && !pointerCoordinates.processed) //Only if the information has been updated but it has not been processed yet.
		{
			var playerToMove = pointerCoordinates.x < CB_Screen.getWindowWidth() / 2 ? 1 : 2; //The player to move (1 or 2) will depend on the part of the screen touched.
			
			//Player 1 or 2, depending on the part of the screen touched (uses pointer which can be mouse or stylus/touch):
			movePaddleToPoint(playerToMove, pointerCoordinates.y - CB_GEM.data.player1.height / 2, CB_GEM.graphicSpritesSceneObject); //Moves up or down to the desired coordinates (centering the mouse coordinates in the middle of the paddle).
				
			pointerCoordinates.processed = true;
		}
		//Stylus/Touch:
		else if (pointerCoordinates.touchesCoordinates)// && !pointerCoordinates.processed) //Only if the information has been updated but it has not been processed yet.
		{
			var touchesProcessed = 0;
			var playerToMove = null;
			for (var touchId in pointerCoordinates.touchesCoordinates)
			{
				if (touchesProcessed >= 2) { break; }
				else if (!pointerCoordinates.touchesCoordinates[touchId]) { continue; } //Erased point.
				else if (pointerCoordinates.touchesCoordinates[touchId].processed) { touchesProcessed++; continue; } //Point already processed.
				else if (typeof(pointerCoordinates.touchesCoordinates[touchId].yPrevious) !== "undefined" && pointerCoordinates.touchesCoordinates[touchId].y !== pointerCoordinates.touchesCoordinates[touchId].yPrevious)
				{
					//Player 1 or 2, depending on the part of the screen touched (uses pointer which can be mouse or stylus/touch):
					playerToMove = pointerCoordinates.touchesCoordinates[touchId].x < CB_Screen.getWindowWidth() / 2 ? 1 : 2; //The player to move (1 or 2) will depend on the part of the screen touched.
					if (pointerCoordinates.touchesCoordinates[touchId].y < pointerCoordinates.touchesCoordinates[touchId].yPrevious) { movePaddle(playerToMove, 0, CB_GEM.graphicSpritesSceneObject, _paddlePixelsMoveTouchDefault); } //Moves up.
					else { movePaddle(playerToMove, 1, CB_GEM.graphicSpritesSceneObject, _paddlePixelsMoveTouchDefault); } //Moves down.
					
					pointerCoordinates.touchesCoordinates[touchId].processed = true;
					touchesProcessed++;
				}
			}
			if (touchesProcessed > 0) { pointerCoordinates.processed = true; touchingScreen = true; }
		}
		
		//Releases the ball if it was stuck on a paddle (and the game started):
		if (CB_GEM.data.gameStarted && CB_GEM.data.ball.direction === 0) //0 = not moving (stuck to a paddle), 1 = left to right, 2 = right to left.
		{
			//Player 1 (uses gamepad #1):
			if (CB_GEM.data.ball.firstPlayer === 1 && (touchingScreen || CB_Mouse.getButtons().LEFT || CB_Keyboard.isKeyDown(CB_Keyboard.keys.ENTER) || CB_Keyboard.isKeyDown(CB_Keyboard.keys.SPACEBAR) || CB_Controllers.isButtonDown([1, 2, 3], 1)))
			{
				//Releases the ball:
				CB_GEM.data.ball.direction = 1; //0 = not moving (stuck to a paddle), 1 = left to right, 2 = right to left.
				updateInfo(CB_GEM.graphicSpritesSceneObject); //Updates the information shown.
				playSoundFx("release_ball"); //Plays the release sound.
			}
			//Player 2 (uses gamepad #0):
			else if (CB_GEM.data.ball.firstPlayer === 2 && (touchingScreen || CB_Mouse.getButtons().RIGHT || CB_Keyboard.isKeyDown(CB_Keyboard.keys.SPACEBAR) || CB_Controllers.isButtonDown([1, 2, 3], 0)))
			{
				//Releases the ball:
				CB_GEM.data.ball.direction = 2; //0 = not moving (stuck to a paddle), 1 = left to right, 2 = right to left.
				updateInfo(CB_GEM.graphicSpritesSceneObject); //Updates the information shown.
				playSoundFx("release_ball"); //Plays the release sound.
			}
		}
	}
}


//Moves the desired paddle to the given direction:
var _paddlePixelsMoveDefault = 10;
var _paddlePixelsMoveTouchDefault = 5;
function movePaddle(paddleId, direction, graphicSpritesSceneObject, paddlePixelsMove) //The direction set to 0 (zero) is for going up.
{
	if (!CB_GEM.data.gameStarted) { return null; }
	
	if (typeof(paddlePixelsMove) === "undefined" || paddlePixelsMove === null || isNaN(paddlePixelsMove)) { paddlePixelsMove = _paddlePixelsMoveDefault; }
	
	var paddleTop = CB_GEM.data["player" + paddleId].y;
	var fieldLineWidth = CB_GEM.data.field.width / 200;
	
	if (direction === 0)
	{
		paddleTop -= paddlePixelsMove;
		if (paddleTop < CB_GEM.data.field.top + fieldLineWidth / 2) { paddleTop = CB_GEM.data.field.top + fieldLineWidth / 2; }
	}
	else
	{
		paddleTop += paddlePixelsMove;
		var paddleHeight = CB_GEM.data.field.height / 5;
		if (paddleTop > CB_GEM.data.field.top + CB_GEM.data.field.height - paddleHeight - fieldLineWidth / 2) { paddleTop = CB_GEM.data.field.top + CB_GEM.data.field.height - paddleHeight - fieldLineWidth / 2; }
	}
	
	//If there has not been any change, returns:
	if (paddleTop === CB_GEM.data["player" + paddleId].y) { return null; }
	
	//Moves the paddle:
	CB_GEM.data["player" + paddleId].y = graphicSpritesSceneObject.getById("paddles_group").getById("paddles").getById("paddle_" + paddleId).top = paddleTop;
	
	//If the ball is stuck to the paddle which is moving, also moves the ball:
	if (CB_GEM.data.ball.direction === 0 && CB_GEM.data.ball.firstPlayer === paddleId) //0 = not moving (stuck to a paddle), 1 = left to right, 2 = right to left.
	{
		//var paddleHeight = CB_GEM.data.field.height / 5;
		//graphicSpritesSceneObject.getById("ball_group").getById("ball").top = CB_GEM.data.ball.y = CB_GEM.data["player" + paddleId].y + paddleHeight / 2;
		graphicSpritesSceneObject.getById("ball_group").getById("ball").top = CB_GEM.data.ball.y = CB_GEM.data["player" + paddleId].y + CB_GEM.data["player" + paddleId].height / 2;
	}
	
	return paddleTop;
}


//Returns the desired gradient style:
function getGradientStyle(firstColour, lastColour, element, canvasContext)
{
	var gradient = canvasContext.createLinearGradient(element.left, element.top, element.left + element.width, element.top + element.height);
	gradient.addColorStop(0, firstColour);
	gradient.addColorStop(1, lastColour);
	return gradient;
}


//Moves the desired paddle to the desired point:
function movePaddleToPoint(paddleId, yDestiny, graphicSpritesSceneObject)
{
	var paddleTop = CB_GEM.data["player" + paddleId].y;
	var direction = paddleTop < yDestiny ? 1: 0;
	
	while (paddleTop !== null && Math.abs(paddleTop - yDestiny) >= _paddlePixelsMoveDefault)
	{
		paddleTop = movePaddle(paddleId, direction, graphicSpritesSceneObject);
	}
	
	return paddleTop;
}


//Prepares sound effects:
var sfx = null; //Global object to play the sounds.
var prepareSoundFxExecuted = false;
function prepareSoundFx()
{
	if (prepareSoundFxExecuted) { return; }

	prepareSoundFxExecuted = true;
	
	var jsfxObject = CB_Speaker.getJsfxObject(); //Gets the 'jsfx' object.
	if (jsfxObject !== null)
	{
		//Defines the sound effects:
		var library =
		{
			"start":
				jsfx.Preset.Coin,
			"hit_border":
				jsfx.Preset.Select,
			"hit_paddle":
				jsfx.Preset.Explosion,
			"goal":
				jsfx.Preset.Jump,
			"release_ball":
				jsfx.Preset.Reset
		};

		//Loads the sound effects:
		sfx = CB_AudioDetector.isAPISupported("WAAPI") ? jsfxObject.Live(library) : jsfxObject.Sounds(library); //Uses AudioContext (Web Audio API) if available.
	}
}


//Plays the desired sound effect (by its identifier):
function playSoundFx(id)
{
	if (!sfx || typeof(sfx[id]) !== "function") { return; }
	else if (!CB_GEM.data.soundEnabled) { return; }

	//Note: at least the first time, it is recommended to do it through a user-driven event (as "onClick", "onTouchStart", etc.) in order to maximize compatibility (as some clients could block sounds otherwise).
	sfx[id]();
}


//Prepares background music:
var bandJSObject = null; //Global 'BandJS' object to play the sounds.
function prepareMusic()
{
	bandJSObject = CB_Speaker.getBandJSObject(); //Gets a new 'BandJS' object.
	if (bandJSObject !== null)
	{
		//Sets a time signature:
		bandJSObject.setTimeSignature(4, 4);

		//Sets the tempo:
		bandJSObject.setTempo(80);

		//Shows the controls:
		CB_Elements.showById("controls");
	}
}


//Plays the background music:
//* Frog's Theme by Yasunori Mitsuda (version by Jarred Mack and Cody Lundquist using Band.js library). Taken from: https://github.com/meenie/band.js (example: http://plnkr.co/edit/vVrFxg?p=preview).
var playingMusic = false;
function playMusic()
{
	if (bandJSObject === null || playingMusic) { return; }
	else if (!CB_GEM.data.soundEnabled) { return; }

	playingMusic = true;
	
	//Creates an instrument and adds notes:
	var tempo = 126;
	bandJSObject.setTimeSignature(4, 4);
    bandJSObject.setTempo(tempo);

    var right = bandJSObject.createInstrument('square', 'oscillators');
	var left = bandJSObject.createInstrument('square', 'oscillators');
	
	right.setVolume(0.50);
	left.setVolume(0.50);

    right.note('tripletEighth', 'A4')
    .note('tripletEighth', 'G4')
    .note('tripletEighth', 'A4')
    .note('quarter', 'E4')
    .note('quarter', 'A4')
    .note('tripletQuarter', 'B4')
    .note('tripletEighth', 'C5');
    
    left.note('quarter', 'C4, A3')
    .note('quarter', 'C4, A3')
    .note('quarter', 'C4, A3')
    .note('quarter', 'C4, A3');
    
    right.note('tripletEighth', 'B4')
    .note('tripletEighth', 'A4')
    .note('tripletEighth', 'B4')
    .note('half', 'G4')
    .note('quarter', 'D4');
    
    left.note('quarter', 'B3, G3')
    .note('quarter', 'B3, G3')
    .note('quarter', 'B3, G3')
    .note('quarter', 'B3, G3');
    
    right.note('tripletEighth', 'A4')
    .note('tripletEighth', 'G4')
    .note('tripletEighth', 'A4')
    .note('quarter', 'E4')
    .note('quarter', 'A4')
    .note('tripletQuarter', 'B4')
    .note('tripletEighth', 'C5');
    
    left.note('quarter', 'A3, F3')
    .note('quarter', 'A3, F3')
    .note('quarter', 'A3, F3')
    .note('quarter', 'A3, F3');
    
    right.note('tripletEighth', 'B4')
    .note('tripletEighth', 'C5')
    .note('tripletEighth', 'D5')
    .note('dottedHalf', 'B4');
    
    left.note('quarter', 'B3, G3')
    .note('quarter', 'B3, G3')
    .note('quarter', 'B3, G3')
    .note('quarter', 'B3, G3');
    
    right.note('tripletEighth', 'A4')
    .note('tripletEighth', 'G4')
    .note('tripletEighth', 'A4')
    .note('quarter', 'E4')
    .note('quarter', 'A4')
    .note('tripletQuarter', 'B4')
    .note('tripletEighth', 'C5');
    
    left.note('quarter', 'C4, A3')
    .note('quarter', 'C4, A3')
    .note('quarter', 'C4, A3')
    .note('quarter', 'C4, A3');
    
    right.note('tripletEighth', 'B4')
    .note('tripletEighth', 'A4')
    .note('tripletEighth', 'B4')
    .note('half', 'G4')
    .note('quarter', 'D4');
    
    left.note('quarter', 'B3, G3')
    .note('quarter', 'B3, G3')
    .note('quarter', 'B3, G3')
    .note('quarter', 'B3, G3');
    
    right.note('tripletEighth', 'A4')
    .note('tripletEighth', 'G4')
    .note('tripletEighth', 'A4')
    .note('quarter', 'B4')
    .note('quarter', 'C5')
    .note('quarter', 'B4');
    
    left.note('quarter', 'A3, F3')
    .note('quarter', 'A3, F3')
    .note('quarter', 'B3, G3')
    .note('quarter', 'B3, G3');
    
    right.note('tripletEighth', 'A4')
    .note('tripletEighth', 'G4')
    .note('tripletEighth', 'A4')
    .note('tripletEighth', 'A4')
    .note('tripletEighth', 'G4')
    .note('tripletEighth', 'A4')
    .note('quarter', 'A4')
    .rest('quarter');
    
    left.note('quarter', 'C4, A3')
    .note('quarter', 'C4, A3')
    .note('quarter', 'C4, A3')
    .rest('quarter');
    
    right.note('tripletQuarter', 'E5')
    .note('tripletEighth', 'E5')
    .note('tripletEighth', 'E5')
    .note('tripletEighth', 'C5')
    .note('tripletEighth', 'D5')
    .note('quarter', 'E5')
    .note('quarter', 'A5');
    
    left.note('quarter', 'E4, C4, A3')
    .note('quarter', 'E4, C4, A3')
    .note('quarter', 'E4, C4, A3')
    .note('quarter', 'E4, C4, A3');
    
    right.note('half', 'G5')
    .note('dottedQuarter', 'E5')
    .note('eighth', 'C5');
    
    left.note('quarter', 'C4, G3, E3')
    .note('quarter', 'C4, G3, E3')
    .note('quarter', 'C4, G3, E3')
    .note('quarter', 'C4, G3, E3');
    
    right.note('dottedHalf', 'A4')
    .rest('quarter');
    
    left.note('quarter', 'C4, A3, F3')
    .note('quarter', 'C4, A3, F3')
    .note('quarter', 'C4, A3, F3')
    .note('quarter', 'C4, A3, F3');
    
    right.note('tripletEighth', 'A4')
    .note('tripletEighth', 'B4')
    .note('tripletEighth', 'C5')
    .note('tripletEighth', 'B4')
    .note('tripletEighth', 'C5')
    .note('tripletEighth', 'D5')
    .note('tripletEighth', 'C5')
    .note('tripletEighth', 'D5')
    .note('tripletEighth', 'E5')
    .note('tripletEighth', 'D5')
    .note('tripletEighth', 'E5')
    .note('tripletEighth', 'G5');
    
    left.note('quarter', 'D4, B3, G3')
    .note('quarter', 'D4, B3, G3')
    .rest('tripletEighth')
    .note('tripletEighth', 'D4, B3, G3')
    .rest('tripletEighth')
    .note('quarter', 'D4, B3, G3');
    
    right.note('tripletQuarter', 'E5')
    .note('tripletEighth', 'E5')
    .note('tripletEighth', 'E5')
    .note('tripletEighth', 'C5')
    .note('tripletEighth', 'D5')
    .note('quarter', 'E5')
    .note('quarter', 'A5');
    
    left.note('quarter', 'E4, C4, A3')
    .note('quarter', 'E4, C4, A3')
    .note('quarter', 'E4, C4, A3')
    .note('quarter', 'E4, C4, A3');
    
    right.note('quarter', 'B5', true)
    .note('tripletEighth', 'B5')
    .note('tripletEighth', 'C6')
    .note('tripletEighth', 'B5')
    .note('quarter', 'A5')
    .note('quarter', 'G5');
    
    left.note('quarter', 'D4, B3, G3')
    .note('quarter', 'D4, B3, G3')
    .note('quarter', 'D4, B3, G3')
    .note('quarter', 'D4, B3, G3');
    
    right.note('whole', 'A5');
    
    left.note('quarter', 'C4, A3, F3')
    .note('quarter', 'C4, A3, F3')
    .note('quarter', 'C4, A3, F3')
    .note('quarter', 'C4, A3, F3');
    
    right.note('half', 'A5')
    .note('half', 'B5');
    
    left.note('quarter', 'B3, A3, E3')
    .note('quarter', 'B3, A3, E3')
    .rest('tripletEighth')
    .note('tripletEighth', 'B3, G#3, E3')
    .rest('tripletEighth')
    .note('quarter', 'B3, G#3, E3');
    
    right.note('tripletQuarter', 'C6')
      .note('tripletEighth', 'C6')
      .note('tripletEighth', 'C6')
      .note('tripletEighth', 'B5')
      .note('tripletEighth', 'A5')
      .note('quarter', 'G5')
      .note('quarter', 'E5');
      
    left.note('quarter', 'F3')
      .note('quarter', 'C4, A3, F3')
      .note('quarter', 'G3')
      .note('quarter', 'D4, B3, G3');
      
    right.note('tripletQuarter', 'A5')
      .note('tripletEighth', 'A5')
      .note('tripletEighth', 'A5')
      .note('tripletEighth', 'G5')
      .note('tripletEighth', 'F5')
      .note('half', 'E5');
      
    left.note('quarter', 'F3')
      .note('quarter', 'C4, A3, F3')
      .note('quarter', 'A3')
      .note('quarter', 'E4, B3, A3');
      
    right.note('tripletQuarter', 'C6')
      .note('tripletEighth', 'C6')
      .note('tripletEighth', 'C6')
      .note('tripletEighth', 'B5')
      .note('tripletEighth', 'A5')
      .note('quarter', 'G5')
      .note('quarter', 'E5');
      
      
    left.note('quarter', 'F3')
      .note('quarter', 'C4, A3, F3')
      .note('quarter', 'G3')
      .note('quarter', 'D4, B3, G3');
      
    right.note('half', 'A5')
      .note('half', 'B5');
      
    left.note('quarter', 'A3, F#3, D3')
      .note('tripletEighth', 'A3, F#3, D3')
      .note('tripletEighth', 'A3, F#3, D3')
      .note('tripletEighth', 'A3, F#3, D3')
      .note('quarter', 'B3, G#3, E3')
      .note('tripletEighth', 'B3, G#3, E3')
      .note('tripletEighth', 'B3, G#3, E3')
      .note('tripletEighth', 'B3, G#3, E3');
      
    right.note('tripletQuarter', 'C6')
      .note('tripletEighth', 'C6')
      .note('tripletEighth', 'C6')
      .note('tripletEighth', 'B5')
      .note('tripletEighth', 'A5')
      .note('quarter', 'G5')
      .note('quarter', 'E5');
      
    left.note('quarter', 'F3')
      .note('quarter', 'C4, A3, F3')
      .note('quarter', 'G3')
      .note('quarter', 'D4, B3, G3');
      
    right.note('tripletQuarter', 'A5')
      .note('tripletEighth', 'A5')
      .note('tripletEighth', 'A5')
      .note('tripletEighth', 'G5')
      .note('tripletEighth', 'F5')
      .note('half', 'E5');
      
    left.note('quarter', 'F3')
      .note('quarter', 'C4, A3, F3')
      .note('quarter', 'A3')
      .note('quarter', 'E4, B3, A3');
      
    right.note('tripletQuarter', 'C6')
      .note('tripletEighth', 'C6')
      .note('tripletEighth', 'C6')
      .note('tripletEighth', 'B5')
      .note('tripletEighth', 'C6')
      .note('quarter', 'D6')
      .note('quarter', 'B5');
      
    left.note('quarter', 'F3')
      .note('quarter', 'C4, A3, F3')
      .note('quarter', 'G3')
      .note('quarter', 'D4, B3, G3');
      
    right.note('half', 'B5')
      .note('quarter', 'A5')
      .rest('quarter');
      
    left.note('quarter', 'E4, C4, A3')
      .note('tripletEighth', 'E4, C4, A3')
      .note('tripletEighth', 'E4, C4, A3')
      .note('tripletEighth', 'E4, C4, A3')
      .note('quarter', 'E4, C4, A3')
      .rest('quarter');
	
	bandJSObject.setMasterVolume(0.25);
	
	//Finishes and plays it:
	//Note: at least the first time, it is recommended to do it through a user-driven event (as "onClick", "onTouchStart", etc.) in order to maximize compatibility (as some clients could block sounds otherwise).
	var player = bandJSObject.finish();
	player.loop(true); //The music will loop constantly.
	player.play()
}