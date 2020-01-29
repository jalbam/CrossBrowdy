/* This file belongs to a CrossBrowdy.com example, made by Joan Alba Maldonado. Creative Commons Attribution 4.0 International License. */

//ROMs list and their data:
var ROMsPath = "ROMs/"; //Path where the ROMs are stored.
var ROMs = null; //It will keep the ROM information.


//Sets the ROM data (needed for listing ROMs as well as useful for ROM identification, key mapping, etc.):
function setROMsData()
{
	ROMs = ROMs ||
	{
		"Blinky":
		{
			author: "Hans Christian Egeberg",
			year: 1991,
			file: "Blinky [Hans Christian Egeberg, 1991].ch8",
			cyclesPerLoop: 10,
			contentMatches: function(ROMContent) //Returns true if the given ROM content matches this ROM. Used to identify ROMs.
			{
				return ROMContentToString(ROMContent).indexOf("2.00 C. Egeberg 18/8-'91") !== -1;
			},
			keysMapping:
			{
				0x1: { keys: null, controllers: null },
				0x2: { keys: null, controllers: null },
				0x4: { keys: null, controllers: null },
				0x3:
				{
					keys: [ CB_Keyboard.keys._3, CB_Keyboard.keys.UP ],
					controllers: { gamepadIndex: "", axis: { index: 1, min: -1, max: -0.5 }	}
				},
				0x6:
				{
					keys: [ CB_Keyboard.keys.E, CB_Keyboard.keys.DOWN ],
					controllers: { gamepadIndex: "", axis: { index: 1, min: 0.5, max: 1 } }
				},
				0x7:
				{
					keys: [ CB_Keyboard.keys.A, CB_Keyboard.keys.LEFT ],
					controllers: { gamepadIndex: "", axis: { index: 0, min: -1, max: -0.5 }	}
				},
				0x8:
				{
					keys: [ CB_Keyboard.keys.S, CB_Keyboard.keys.RIGHT ],
					controllers: { gamepadIndex: "", axis: { index: 0, min: 0.5, max: 1 } }
				},
				0xF:
				{
					keys: [ CB_Keyboard.keys.V, CB_Keyboard.keys.SPACE, CB_Keyboard.keys.ENTER ],
					controllers: { gamepadIndex: "", buttons: [ 0, 1, 2, 3 ] }
				}
			},
			//Called for each pixel before drawing it, to colourize the screen according to the ROM (to use personalized theme):
			pixelsColorizer: function(element, canvasContext, canvasBufferContext, useBuffer, CB_GraphicSpritesSceneObject, drawingMap, x, y, mapElement)
			{
				//NOTE: theme not personalized for this game to keep the example simpler.
				return null; //It will use default style (set on 'CB_GEM.data.PIXELS_COLOR_FIRST' and 'CB_GEM.data.PIXELS_COLOR_LAST').
			}
		},
		"Brix":
		{
			author: "Andreas Gustafsson",
			year: 1990,
			file: "Brix [Andreas Gustafsson, 1990].ch8",
			cyclesPerLoop: 3,
			contentMatches: function(ROMContent) //Returns true if the given ROM content matches this ROM. Used to identify ROMs.
			{
				var ROMContentString = ROMContentToString(ROMContent);
				return ROMContentString.indexOf("ÞxÿHþhÿ") !== -1 && ROMContentString.indexOf("õ3òeñ)c7d") !== -1;
			},
			keysMapping:
			{
				0x4:
				{
					keys: [ CB_Keyboard.keys.Q, CB_Keyboard.keys.LEFT ],
					controllers: { gamepadIndex: "", axis: { index: 0, min: -1, max: -0.5 }	}
				},
				0x6:
				{
					keys: [ CB_Keyboard.keys.E, CB_Keyboard.keys.RIGHT ],
					controllers: { gamepadIndex: "", axis: { index: 0, min: 0.5, max: 1 } }
				}
			},
			//Called for each pixel before drawing it, to colourize the screen according to the ROM (to use personalized theme):
			pixelsColorizer: function(element, canvasContext, canvasBufferContext, useBuffer, CB_GraphicSpritesSceneObject, drawingMap, x, y, mapElement)
			{
				//Lives and score:
				if (y >= 0 && y < 5)
				{
					CB_GEM.data._pixelsStyleTemp.first = "#00aaaa";
					CB_GEM.data._pixelsStyleTemp.last = "#aa00aa";
				}
				//Paddle (player):
				else if (y === 31)
				{
					CB_GEM.data._pixelsStyleTemp.first = "#aa0000";
					CB_GEM.data._pixelsStyleTemp.last = "#aa0000";
				}
				//Others (bricks and ball):
				else { return { stroke: true }; } //It will use default style (set on 'CB_GEM.data.PIXELS_COLOR_FIRST' and 'CB_GEM.data.PIXELS_COLOR_LAST') but using stroke.
				
				return CB_GEM.data._pixelsStyleTemp;
			}
		},
		"Pong":
		{
			author: "Paul Vervalin",
			year: 1990,
			file: "Pong [Paul Vervalin, 1990].ch8",
			cyclesPerLoop: 2,
			contentMatches: function(ROMContent) //Returns true if the given ROM content matches this ROM. Used to identify ROMs.
			{
				return ROMContentToString(ROMContent).indexOf("iÿ¢ðÖq¢êÚ¶ÜÖ") !== -1;
			},
			keysMapping:
			{
				0x1:
				{
					keys: [ CB_Keyboard.keys._1, CB_Keyboard.keys.UP ],
					controllers: { gamepadIndex: 1, axis: { index: 1, min: -1, max: -0.5 }	}
				},
				0x4:
				{
					keys: [ CB_Keyboard.keys.Q, CB_Keyboard.keys.DOWN ],
					controllers: { gamepadIndex: 1, axis: { index: 1, min: 0.5, max: 1 } }
				},
				0xC:
				{
					keys: [ CB_Keyboard.keys._4, CB_Keyboard.keys.LEFT ],
					controllers: { gamepadIndex: 0, axis: { index: 1, min: -1, max: -0.5 }	}
				},
				0xD:
				{
					keys: [ CB_Keyboard.keys.R, CB_Keyboard.keys.RIGHT ],
					controllers: { gamepadIndex: 0, axis: { index: 1, min: 0.5, max: 1 } }
				}
			},
			//Called for each pixel before drawing it, to colourize the screen according to the ROM (to use personalized theme):
			pixelsColorizer: function(element, canvasContext, canvasBufferContext, useBuffer, CB_GraphicSpritesSceneObject, drawingMap, x, y, mapElement)
			{
				//Player 1's paddle:
				if (x === 2)
				{
					CB_GEM.data._pixelsStyleTemp.first = "#aa0000";
					CB_GEM.data._pixelsStyleTemp.last = "#0000aa";
				}
				//Player 2's paddle:
				else if (x === 63)
				{
					CB_GEM.data._pixelsStyleTemp.first = "#aa0000";
					CB_GEM.data._pixelsStyleTemp.last = "#aa0000";
				}
				//Others (scored goals and ball):
				else { return { stroke: true }; } //It will use default style (set on 'CB_GEM.data.PIXELS_COLOR_FIRST' and 'CB_GEM.data.PIXELS_COLOR_LAST') but using stroke.
				
				return CB_GEM.data._pixelsStyleTemp;
			}
		},
		"Space Intercept":
		{
			author: "Joseph Weisbecker",
			year: 1978,
			file: "Space Intercept [Joseph Weisbecker, 1978].ch8",
			cyclesPerLoop: 4,
			contentMatches: function(ROMContent) //Returns true if the given ROM content matches this ROM. Used to identify ROMs.
			{
				return ROMContentToString(ROMContent).indexOf("¢´õe¢ÀóU¢Àf") !== -1;
			},
			keysMapping:
			{
				0x4:
				{
					keys: [ CB_Keyboard.keys.Q, CB_Keyboard.keys.LEFT ],
					controllers: { gamepadIndex: "", axis: { index: 0, min: -1, max: -0.5 }	}
				},
				0x5:
				{
					keys: [ CB_Keyboard.keys.W, CB_Keyboard.keys.UP ],
					controllers: { gamepadIndex: "", axis: { index: 1, min: -1, max: -0.5 }	}
				},
				0x6:
				{
					keys: [ CB_Keyboard.keys.E, CB_Keyboard.keys.RIGHT ],
					controllers: { gamepadIndex: "", axis: { index: 0, min: 0.5, max: 1 } }
				}
			},
			//Called for each pixel before drawing it, to colourize the screen according to the ROM (to use personalized theme):
			pixelsColorizer: function(element, canvasContext, canvasBufferContext, useBuffer, CB_GraphicSpritesSceneObject, drawingMap, x, y, mapElement)
			{
				if (y > 26)
				{
					//Left numbers:
					if (x >= 0 && x < 14)
					{
						CB_GEM.data._pixelsStyleTemp.first = "#aa0000";
						CB_GEM.data._pixelsStyleTemp.last = "#0000aa";
					}
					//Right numbers:
					else if (x > 49)
					{
						CB_GEM.data._pixelsStyleTemp.first = "#aa0000";
						CB_GEM.data._pixelsStyleTemp.last = "#cc0000";
					}
					//Player:
					else if (y === 31)
					{
						CB_GEM.data._pixelsStyleTemp.first = "#aaaa00";
						CB_GEM.data._pixelsStyleTemp.last = "#00cccc";
						CB_GEM.data._pixelsStyleTemp.stroke = true;
					}
					//Others:
					else { return null; } //It will use default style (set on 'CB_GEM.data.PIXELS_COLOR_FIRST' and 'CB_GEM.data.PIXELS_COLOR_LAST').
				}
				else { return null; } //It will use default style (set on 'CB_GEM.data.PIXELS_COLOR_FIRST' and 'CB_GEM.data.PIXELS_COLOR_LAST').
				
				return CB_GEM.data._pixelsStyleTemp;
			}
		},
		"Space Invaders":
		{
			author: "David Winter",
			year: null,
			file: "Space Invaders [David Winter].ch8",
			cyclesPerLoop: 10,
			contentMatches: function(ROMContent) //Returns true if the given ROM content matches this ROM. Used to identify ROMs.
			{
				return ROMContentToString(ROMContent).indexOf("SPACE INVADERS 0.91 By David WINTER") !== -1;
			},
			keysMapping:
			{
				0x4:
				{
					keys: [ CB_Keyboard.keys.Q, CB_Keyboard.keys.LEFT ],
					controllers: { gamepadIndex: "", axis: { index: 0, min: -1, max: -0.5 }	}
				},
				0x5:
				{
					keys: [ CB_Keyboard.keys.W, CB_Keyboard.keys.UP, CB_Keyboard.keys.SPACEBAR, CB_Keyboard.keys.ENTER ],
					controllers: { gamepadIndex: "", axis: { index: 1, min: -1, max: -0.5 }, buttons: [ 0, 1, 2, 3 ] }
				},
				0x6:
				{
					keys: [ CB_Keyboard.keys.E, CB_Keyboard.keys.RIGHT ],
					controllers: { gamepadIndex: "", axis: { index: 0, min: 0.5, max: 1 } }
				}
			},
			//Called for each pixel before drawing it, to colourize the screen according to the ROM (to use personalized theme):
			pixelsColorizer: function(element, canvasContext, canvasBufferContext, useBuffer, CB_GraphicSpritesSceneObject, drawingMap, x, y, mapElement)
			{
				//NOTE: theme not personalized for this game to keep the example simpler.
				return null; //It will use default style (set on 'CB_GEM.data.PIXELS_COLOR_FIRST' and 'CB_GEM.data.PIXELS_COLOR_LAST').
			}
		},
		"Syzygy":
		{
			author: "Roy Trevino",
			year: 1990,
			file: "Syzygy [Roy Trevino, 1990].ch8",
			cyclesPerLoop: 3,
			contentMatches: function(ROMContent) //Returns true if the given ROM content matches this ROM. Used to identify ROMs.
			{
				var ROMContentString = ROMContentToString(ROMContent);
				return ROMContentString.indexOf(" ©1990 RTT") !== -1 && ROMContentString.indexOf("vÿ¥LÑ!Öqdði") !== -1;
			},
			keysMapping:
			{
				0x3:
				{
					keys: [ CB_Keyboard.keys.W, CB_Keyboard.keys.UP ],
					controllers: { gamepadIndex: "", axis: { index: 1, min: -1, max: -0.5 } }
				},
				0x6:
				{
					keys: [ CB_Keyboard.keys.E, CB_Keyboard.keys.DOWN ],
					controllers: { gamepadIndex: "", axis: { index: 1, min: 0.5, max: 1 } }
				},
				0x7:
				{
					keys: [ CB_Keyboard.keys.Q, CB_Keyboard.keys.LEFT ],
					controllers: { gamepadIndex: "", axis: { index: 0, min: -1, max: -0.5 }	}
				},
				0x8:
				{
					keys: [ CB_Keyboard.keys.S, CB_Keyboard.keys.RIGHT ],
					controllers: { gamepadIndex: "", axis: { index: 0, min: 0.5, max: 1 } }
				},
				0xB:
				{
					keys: [ CB_Keyboard.keys.F, CB_Keyboard.keys.ENTER, CB_Keyboard.keys.SPACEBAR ],
					controllers: { gamepadIndex: "", buttons: [ 0, 1, 2, 3 ] }
				},
				0xE:
				{
					keys: [ CB_Keyboard.keys.F, CB_Keyboard.keys.ENTER ],
					controllers: { gamepadIndex: "", buttons: [ 0, 1 ] }
				},
				0xF:
				{
					keys: [ CB_Keyboard.keys.V, CB_Keyboard.keys.SPACEBAR ],
					controllers: { gamepadIndex: "", buttons: [ 2, 3 ] }
				}
			},
			//Called for each pixel before drawing it, to colourize the screen according to the ROM (to use personalized theme):
			pixelsColorizer: function(element, canvasContext, canvasBufferContext, useBuffer, CB_GraphicSpritesSceneObject, drawingMap, x, y, mapElement)
			{
				//NOTE: theme not personalized for this game to keep the example simpler.
				return { stroke: true }; //It will use default style (set on 'CB_GEM.data.PIXELS_COLOR_FIRST' and 'CB_GEM.data.PIXELS_COLOR_LAST') but using stroke.
			}
		},
		"Tetris":
		{
			author: "Fran Dachille",
			year: 1991,
			file: "Tetris [Fran Dachille, 1991].ch8",
			cyclesPerLoop: 2,
			contentMatches: function(ROMContent) //Returns true if the given ROM content matches this ROM. Used to identify ROMs.
			{
				var ROMContentString = ROMContentToString(ROMContent);
				return ROMContentString.indexOf("¢´#æ") !== -1 && ROMContentString.indexOf("ò)Ýå§") !== -1;
			},
			keysMapping:
			{
				0x4:
				{
					keys: [ CB_Keyboard.keys.Q, CB_Keyboard.keys.UP, CB_Keyboard.keys.ENTER, CB_Keyboard.keys.SPACEBAR ],
					controllers: { gamepadIndex: "", axis: { index: 1, min: -1, max: -0.5 }, buttons: [ 0, 1, 2, 3 ] }
				},
				0x5:
				{
					keys: [ CB_Keyboard.keys.W, CB_Keyboard.keys.LEFT ],
					controllers: { gamepadIndex: "", axis: { index: 0, min: -1, max: -0.5 }	}
				},
				0x6:
				{
					keys: [ CB_Keyboard.keys.E, CB_Keyboard.keys.RIGHT ],
					controllers: { gamepadIndex: "", axis: { index: 0, min: 0.5, max: 1 } }
				}
			},
			//Called for each pixel before drawing it, to colourize the screen according to the ROM (to use personalized theme):
			pixelsColorizer: function(element, canvasContext, canvasBufferContext, useBuffer, CB_GraphicSpritesSceneObject, drawingMap, x, y, mapElement)
			{
				//Field border:
				if (y === 31 || x === 26 || x === 37)
				{
					CB_GEM.data._pixelsStyleTemp.first = "#aa0000";
					CB_GEM.data._pixelsStyleTemp.last = "#0000aa";
				}
				//Others:
				else { return { stroke: true }; } //It will use default style (set on 'CB_GEM.data.PIXELS_COLOR_FIRST' and 'CB_GEM.data.PIXELS_COLOR_LAST') but using stroke.
				
				return CB_GEM.data._pixelsStyleTemp;
			}
		},
		"Tic-Tac-Toe":
		{
			author: "David Winter",
			year: null,
			file: "Tic-Tac-Toe [David Winter].ch8",
			cyclesPerLoop: 5,
			contentMatches: function(ROMContent) //Returns true if the given ROM content matches this ROM. Used to identify ROMs.
			{
				return ROMContentToString(ROMContent).indexOf("TICTAC by David WINTERk") !== -1;
			},
			keysMapping:
			{
				0x0: { keys: null, controllers: null },
				0x1:
				{
					keys: [ CB_Keyboard.keys.Q, CB_Keyboard.keys._7, CB_Keyboard.keys.UP ],
					controllers: { gamepadIndex: "", axis: { index: 1, min: -1, max: -0.5 } }
				},
				0x2:
				{
					keys: [ CB_Keyboard.keys.W, CB_Keyboard.keys._8, CB_Keyboard.keys.DOWN ],
					controllers: { gamepadIndex: "", axis: { index: 1, min: 0.5, max: 1 } }
				},
				0x3:
				{
					keys: [ CB_Keyboard.keys.E, CB_Keyboard.keys._9, CB_Keyboard.keys.LEFT ],
					controllers: { gamepadIndex: "", axis: { index: 0, min: -1, max: -0.5 }	}
				},
				0x4:
				{
					keys: [ CB_Keyboard.keys.A, CB_Keyboard.keys._4, CB_Keyboard.keys.RIGHT ],
					controllers: { gamepadIndex: "", axis: { index: 0, min: 0.5, max: 1 } }
				},
				0x5:
				{
					keys: [ CB_Keyboard.keys.S, CB_Keyboard.keys._5, CB_Keyboard.keys.ENTER ],
					controllers: { gamepadIndex: "", buttons: [ 0 ] }
				},
				0x6:
				{
					keys: [ CB_Keyboard.keys.D, CB_Keyboard.keys._6, CB_Keyboard.keys.SPACEBAR ],
					controllers: { gamepadIndex: "", buttons: [ 1 ] }
				},
				0x7:
				{
					keys: [ CB_Keyboard.keys.Z, CB_Keyboard.keys._1, CB_Keyboard.keys.SHIFT ],
					controllers: { gamepadIndex: "", buttons: [ 2 ] }
				},
				0x8:
				{
					keys: [ CB_Keyboard.keys.X, CB_Keyboard.keys._2, CB_Keyboard.keys.CTRL ],
					controllers: { gamepadIndex: "", buttons: [ 3 ] }
				},
				0x9:
				{
					keys: [ CB_Keyboard.keys.C, CB_Keyboard.keys._3, CB_Keyboard.keys.TAB ],
					controllers: { gamepadIndex: "", buttons: [ 4 ] }
				}
			},
			//Called for each pixel before drawing it, to colourize the screen according to the ROM (to use personalized theme):
			pixelsColorizer: function(element, canvasContext, canvasBufferContext, useBuffer, CB_GraphicSpritesSceneObject, drawingMap, x, y, mapElement)
			{
				//Left side:
				if (x > 1 && x < 16)
				{
					//Left cross ('X'):
					if (y > 9 && y < 15)
					{
						CB_GEM.data._pixelsStyleTemp.first = "#aa0000";
						CB_GEM.data._pixelsStyleTemp.last = "#0000aa";
					}
					//Left score:
					else
					{
						CB_GEM.data._pixelsStyleTemp.first = "#00aaaa";
						CB_GEM.data._pixelsStyleTemp.last = "#00dddd";
						CB_GEM.data._pixelsStyleTemp.stroke = true;
					}
				}
				//Right side:
				else if (x > 46 && x < 61)
				{
					//Left circle ('O'):
					if (y > 9 && y < 15)
					{
						CB_GEM.data._pixelsStyleTemp.first = "#0000aa";
						CB_GEM.data._pixelsStyleTemp.last = "#aa0000";
					}
					//Right score:
					else
					{
						CB_GEM.data._pixelsStyleTemp.first = "#00aaaa";
						CB_GEM.data._pixelsStyleTemp.last = "#00dddd";
						CB_GEM.data._pixelsStyleTemp.stroke = true;
					}
				}
				//Board:
				else if (y === 3 || y === 11 || y === 19 || y === 27 || x === 19 || x === 27 || x === 35 || x === 43)
				{
					CB_GEM.data._pixelsStyleTemp.first = "#aa00aa";
					CB_GEM.data._pixelsStyleTemp.last = "#dd00dd";
				}
				//Others:
				else { return null; } //It will use default style (set on 'CB_GEM.data.PIXELS_COLOR_FIRST' and 'CB_GEM.data.PIXELS_COLOR_LAST').
				
				return CB_GEM.data._pixelsStyleTemp;
			}
		},
		"Vertical Brix":
		{
			author: "Paul Robson",
			year: 1996,
			file: "Vertical Brix [Paul Robson, 1996].ch8",
			cyclesPerLoop: 5,
			contentMatches: function(ROMContent) //Returns true if the given ROM content matches this ROM. Used to identify ROMs.
			{
				var ROMContentString = ROMContentToString(ROMContent);
				return ROMContentString.indexOf("Ô£dK") !== -1 && ROMContentString.indexOf("°pÞqÿbÿcÿd") !== -1;
			},
			keysMapping:
			{
				0x1:
				{
					keys: [ CB_Keyboard.keys._1, CB_Keyboard.keys.UP ],
					controllers: { gamepadIndex: "", axis: { index: 1, min: -1, max: -0.5 }	}
				},
				0x4:
				{
					keys: [ CB_Keyboard.keys.Q, CB_Keyboard.keys.DOWN ],
					controllers: { gamepadIndex: "", axis: { index: 1, min: 0.5, max: 1 } }
				},
				0x7:
				{
					keys: [ CB_Keyboard.keys.A, CB_Keyboard.keys.UP, CB_Keyboard.keys.DOWN, CB_Keyboard.keys.SPACEBAR, CB_Keyboard.keys.ENTER ],
					controllers: { gamepadIndex: "", buttons: [ 0, 1, 2, 3 ] }
				}
			},
			//Called for each pixel before drawing it, to colourize the screen according to the ROM (to use personalized theme):
			pixelsColorizer: function(element, canvasContext, canvasBufferContext, useBuffer, CB_GraphicSpritesSceneObject, drawingMap, x, y, mapElement)
			{
				//Border:
				if (y === 0 || y === 31 || x === 63)
				{
					CB_GEM.data._pixelsStyleTemp.first = "#00aaaa";
					CB_GEM.data._pixelsStyleTemp.last = "#00dddd";
				}
				//Paddle (player):
				else if (x === 2)
				{
					CB_GEM.data._pixelsStyleTemp.first = "#aa0000";
					CB_GEM.data._pixelsStyleTemp.last = "#dd0000";
				}
				//Others:
				else { return null; } //It will use default style (set on 'CB_GEM.data.PIXELS_COLOR_FIRST' and 'CB_GEM.data.PIXELS_COLOR_LAST').
				
				return CB_GEM.data._pixelsStyleTemp;
			}
		},
		"Wipe Off":
		{
			author: "Joseph Weisbecker",
			year: null,
			file: "Wipe Off [Joseph Weisbecker].ch8",
			cyclesPerLoop: 5,
			contentMatches: function(ROMContent) //Returns true if the given ROM content matches this ROM. Used to identify ROMs.
			{
				var ROMContentString = ROMContentToString(ROMContent);
				return ROMContentString.indexOf("¢ËÒ1eÿÄ") !== -1 && ROMContentString.indexOf("¢ËÒ1sÿ") !== -1;
			},
			keysMapping:
			{
				0x4:
				{
					keys: [ CB_Keyboard.keys.Q, CB_Keyboard.keys.LEFT ],
					controllers: { gamepadIndex: "", axis: { index: 0, min: -1, max: -0.5 }	}
				},
				0x6:
				{
					keys: [ CB_Keyboard.keys.E, CB_Keyboard.keys.RIGHT ],
					controllers: { gamepadIndex: "", axis: { index: 0, min: 0.5, max: 1 } }
				}
			},
			//Called for each pixel before drawing it, to colourize the screen according to the ROM (to use personalized theme):
			pixelsColorizer: function(element, canvasContext, canvasBufferContext, useBuffer, CB_GraphicSpritesSceneObject, drawingMap, x, y, mapElement)
			{
				//Paddle (player):
				//NOTE: we could check 'screenBitMap' to prevent detecting the ball as the paddle when it is in the same horizontal line. Not done to keep the example simpler.
				if (y === 30)
				{
					CB_GEM.data._pixelsStyleTemp.first = "#aa0000";
					CB_GEM.data._pixelsStyleTemp.last = "#dd0000";
				}
				//Others:
				else { return null; } //It will use default style (set on 'CB_GEM.data.PIXELS_COLOR_FIRST' and 'CB_GEM.data.PIXELS_COLOR_LAST').
				
				return CB_GEM.data._pixelsStyleTemp;
			}
		},
		"Worm V4":
		{
			author: "RB-Revival Studios",
			year: 2007,
			file: "Worm V4 [RB-Revival Studios, 2007].ch8",
			cyclesPerLoop: 2,
			contentMatches: function(ROMContent) //Returns true if the given ROM content matches this ROM. Used to identify ROMs.
			{
				return ROMContentToString(ROMContent).indexOf("Worm v.4, by: RB, Chip-8 version by: Martijn Wenting / Revival Studios") !== -1;
			},
			keysMapping:
			{
				0x2:
				{
					keys: [ CB_Keyboard.keys._2, CB_Keyboard.keys.UP ],
					controllers: { gamepadIndex: "", axis: { index: 1, min: -1, max: -0.5 }	}
				},
				0x4:
				{
					keys: [ CB_Keyboard.keys.Q, CB_Keyboard.keys.LEFT ],
					controllers: { gamepadIndex: "", axis: { index: 0, min: -1, max: -0.5 }	}
				},
				0x6:
				{
					keys: [ CB_Keyboard.keys.E, CB_Keyboard.keys.RIGHT ],
					controllers: { gamepadIndex: "", axis: { index: 0, min: 0.5, max: 1 } }
				},
				0x8:
				{
					keys: [ CB_Keyboard.keys.S, CB_Keyboard.keys.DOWN ],
					controllers: { gamepadIndex: "", axis: { index: 1, min: 0.5, max: 1 } }
				}
			},
			//Called for each pixel before drawing it, to colourize the screen according to the ROM (to use personalized theme):
			pixelsColorizer: function(element, canvasContext, canvasBufferContext, useBuffer, CB_GraphicSpritesSceneObject, drawingMap, x, y, mapElement)
			{
				//Score:
				if (x > 59)
				{
					CB_GEM.data._pixelsStyleTemp.first = "#00aaaa";
					CB_GEM.data._pixelsStyleTemp.last = "#00dddd";
				}
				//Border:
				else if (x === 0 || x === 58 || y === 0 || y === 31)
				{
					CB_GEM.data._pixelsStyleTemp.first = "#aa0000";
					CB_GEM.data._pixelsStyleTemp.last = "#dd0000";
				}
				//Others:
				else { return null; } //It will use default style (set on 'CB_GEM.data.PIXELS_COLOR_FIRST' and 'CB_GEM.data.PIXELS_COLOR_LAST').
				
				return CB_GEM.data._pixelsStyleTemp;
			}
		},
		"ZeroPong":
		{
			author: "zeroZshadow",
			year: 2007,
			file: "ZeroPong [zeroZshadow, 2007].ch8",
			cyclesPerLoop: 5,
			contentMatches: function(ROMContent) //Returns true if the given ROM content matches this ROM. Used to identify ROMs.
			{
				var ROMContentString = ROMContentToString(ROMContent);
				return ROMContentString.indexOf("<Ù¦zÿÙ¦¢") !== -1 && ROMContentString.indexOf("eÿÓA`È") !== -1;
			},
			keysMapping:
			{
				0x2:
				{
					keys: [ CB_Keyboard.keys._2, CB_Keyboard.keys.LEFT ],
					controllers: { gamepadIndex: 0, axis: { index: 1, min: -1, max: -0.5 }	}
				},
				0x8:
				{
					keys: [ CB_Keyboard.keys.S, CB_Keyboard.keys.RIGHT ],
					controllers: { gamepadIndex: 0, axis: { index: 1, min: 0.5, max: 1 } }
				},
				0xB:
				{
					keys: [ CB_Keyboard.keys.C, CB_Keyboard.keys.UP ],
					controllers: { gamepadIndex: 1, axis: { index: 1, min: -1, max: -0.5 }	}
				},
				0xA:
				{
					keys: [ CB_Keyboard.keys.Z, CB_Keyboard.keys.DOWN ],
					controllers: { gamepadIndex: 1, axis: { index: 1, min: 0.5, max: 1 } }
				},
				0xF:
				{
					keys: [ CB_Keyboard.keys.V, CB_Keyboard.keys.SPACE, CB_Keyboard.keys.ENTER ],
					controllers: { gamepadIndex: "", buttons: [ 0, 1, 2, 3 ] }
				}
			},
			//Called for each pixel before drawing it, to colourize the screen according to the ROM (to use personalized theme):
			pixelsColorizer: function(element, canvasContext, canvasBufferContext, useBuffer, CB_GraphicSpritesSceneObject, drawingMap, x, y, mapElement)
			{
				//NOTE: we could check 'screenBitMap' to prevent detecting the ball as the paddles when it is in the same vertical line. Not done to keep the example simpler.
				
				//Player 1's paddle:
				if (x === 2)
				{
					CB_GEM.data._pixelsStyleTemp.first = "#aa0000";
					CB_GEM.data._pixelsStyleTemp.last = "#0000aa";
				}
				//Player 2's paddle:
				else if (x === 62)
				{
					CB_GEM.data._pixelsStyleTemp.first = "#aa0000";
					CB_GEM.data._pixelsStyleTemp.last = "#aa0000";
				}
				//Others:
				else { return null; } //It will use default style (set on 'CB_GEM.data.PIXELS_COLOR_FIRST' and 'CB_GEM.data.PIXELS_COLOR_LAST').
				
				return CB_GEM.data._pixelsStyleTemp;
			}
		}
	};
}


//Identifies and returns the ROM identifier through the given ROM content (if possible):
function getROMIdFromROMContent(ROMContent)
{
	if (ROMs)
	{
		for (var ROMId in ROMs)
		{
			if (ROMs[ROMId] && typeof(ROMs[ROMId].contentMatches) === "function" && ROMs[ROMId].contentMatches(ROMContent))
			{
				return ROMId;
			}
		}
	}
	return null; //Returns null when it could not be identified.
}


//Returns the given ROM content as a string:
function ROMContentToString(ROMContent)
{
	var ROMContentString = "";
	for (var x = 0; x < ROMContent.length; x++)
	{
		ROMContentString += String.fromCharCode(ROMContent[x]);
	}
	return ROMContentString;
}