/* This file belongs to a CrossBrowdy.com example, made by Joan Alba Maldonado. */

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
				return ROMContentToString(ROMContent).indexOf("iÿ¢ðÖq¢êÚ¶ÜÖ`") !== -1;
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
			}
		},
		"Space Invaders":
		{
			author: "David Winter",
			year: null,
			file: "Space Invaders [David Winter].ch8",
			cyclesPerLoop: 6,
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
			}
		},
		"Tetris":
		{
			author: "Fran Dachille",
			year: 1991,
			file: "Tetris [Fran Dachille, 1991].ch8",
			cyclesPerLoop: 1,
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