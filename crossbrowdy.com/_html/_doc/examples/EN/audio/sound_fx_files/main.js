/* This file belongs to a CrossBrowdy.com example, made by Joan Alba Maldonado. */
/* Using jsfx library internally: https://github.com/loov/jsfx */

CB_init(main); //It will call the "main" function when ready.


//Global object to play the sounds:
var sfx = null;


//This function will be called when CrossBrowdy is ready:
function main()
{
	//Sound effects example:
	var jsfxObject = CB_Speaker.getJsfxObject(); //Gets the 'jsfx' object.
	if (jsfxObject !== null)
	{
		//Defines the sound effects:
		var library =
		{
			"select":
			{
				"Volume":
				{
					"Sustain": 0.1,
					"Decay": 0.15,
					"Punch": 0.55
				}
			},
			"jump":
			{
				"Frequency":
				{
					"Start": 632.5719976385375,
					"Slide": 0.23934902059283936
				},
				"Generator":
				{
					"Func": "square",
					"A": 0.4414022634702427
				},
				"Filter":
				{
					"HP":0.08955229309222913
				},
				"Volume":
				{
					"Sustain": 0.3053579728670927,
					"Decay": 0.23659526483594398
				}
			},
			"dynamic":
				function()
				{
					return { "Frequency": { "Start": Math.random() * 440 + 220 } };
				},
			"coin_preset":
				jsfx.Preset.Coin,
			"reset_preset":
				jsfx.Preset.Reset,
			"laser_preset":
				jsfx.Preset.Laser,
			"explosion_preset":
				jsfx.Preset.Explosion,
			"powerup_preset":
				jsfx.Preset.Powerup,
			"hit_preset":
				jsfx.Preset.Hit,
			"jump_preset":
				jsfx.Preset.Jump,
			"select_preset":
				jsfx.Preset.Select,
			"lucky_preset":
				jsfx.Preset.Lucky
		};

		//Loads the sound effects:
		sfx = CB_AudioDetector.isAPISupported("WAAPI") ? jsfxObject.Live(library) : jsfxObject.Sounds(library); //Uses AudioContext (Web Audio API) if available.
		
		//Hides any messages:
		CB_Elements.hideById("messages");
		
		//Shows the controls:
		CB_Elements.showById("controls");
	}
	else
	{
		var message = "The 'jsfx' (used by the jsfx library) object is null. Probably not supported.";
		CB_Elements.insertContentById("messages", message); //Hides any messages.
		CB_console(message);
	}
}


//Plays the desired sound effect (by its identifier):
function play(id)
{
	//Note: at least the first time, it is recommended to do it through a user-driven event (as "onClick", "onTouchStart", etc.) in order to maximize compatibility (as some clients could block sounds otherwise).
	try { sfx[id](); }
	catch(E)
	{
		var message = "Error playing sound with '" + id + "' ID: " + E;
		CB_Elements.insertContentById("messages", message);
		CB_Elements.showById("messages");
		CB_console(message);
	}
}