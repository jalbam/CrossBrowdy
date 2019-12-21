/* This file belongs to a CrossBrowdy.com example, made by Joan Alba Maldonado. */
/* Using Hammer.js library internally: https://hammerjs.github.io/ */

CB_init(main); //It will call the "main" function when ready.


//This function will be called when CrossBrowdy is ready:
function main()
{
	//Managing some touch gestures:
	//* Hammer.js source: https://hammerjs.github.io/ and https://github.com/hammerjs/hammer.js 
	//NOTE: Check Hammer.js documentation for more information.
	
	var HammerJS = CB_Touch.getHammerJSObject();
	if (HammerJS === null)
	{
		var message = "The 'HammerJS' object (used by the Hammer.js library) could not be found. Probably not supported.";
		CB_Elements.insertContentById("messages", message);
		CB_console(message);
		return;
	}
	
	var element = CB_Elements.id("my_element");
	if (element === null)
	{
		var message = "The 'my_element' element could not be found!";
		CB_Elements.insertContentById("messages", message);
		CB_console(message);
		return;
	}
	
	CB_console("Setting touch gestures for 'my_element' using Hammer.js library...");
	
	element.style.width = (CB_Screen.getWindowWidth() / 4) + "px";
	element.style.height = (CB_Screen.getWindowHeight() / 4) + "px";
	element.style.left = (parseInt(element.style.width) * 1.5) + "px";
	element.style.top = (parseInt(element.style.height) * 1.5) + "px";

	var mananger = new HammerJS.Manager(CB_Elements.id("container") || document.body);
	
	var pinch = new HammerJS.Pinch();
	var rotate = new HammerJS.Rotate();
	pinch.recognizeWith(rotate);
	
	mananger.add([pinch, rotate]);
	
	//Function when rotating:
	mananger.on
	(
		"rotate",
		function(e)
		{
			element.style.transform = "rotate(" + Math.round(e.rotation) + "deg)";
		}
	);
	
	//Function when pinching:
	mananger.on
	(
		"pinchin pinchout",
		function(e)
		{
			var elementWidth = parseInt(element.style.width);
			var elementHeight = parseInt(element.style.height);
			element.style.backgroundColor = (element.style.backgroundColor === "orange") ? "purple" : "orange";
			if (e.type === "pinchout" && elementWidth < 500 && elementHeight < 500)
			{
				element.style.width = (elementWidth + (e.distance * 0.05)) + "px";
				element.style.height = (elementHeight + (e.distance * 0.05)) + "px";
			}
			else //"pinchin":
			{
				if (elementWidth > 50 && elementHeight > 50)
				{
					element.style.width = (elementWidth - (e.distance * 0.05)) + "px";
					element.style.height = (elementHeight - (e.distance * 0.05)) + "px";
				}
			}
		}
	);
	
	//Hides any messages:
	CB_Elements.hideById("messages");

	//Shows the container (with the element that can be managed with gestures):
	CB_Elements.showById("container");
}