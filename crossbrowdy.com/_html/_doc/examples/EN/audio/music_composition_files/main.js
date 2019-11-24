//Using Band.js library internally: https://github.com/meenie/band.js


CB_init(main); //It will call the "main" function when ready.


//Global 'BandJS' object to play the sounds:
var bandJSObject = null;


//This function will be called when CrossBrowdy is ready:
function main()
{
	//Music composition example (taken from https://github.com/meenie/band.js):
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


//Plays the music:
function play()
{
	//Creates an instrument and adds notes:
	var piano = bandJSObject.createInstrument();
	piano.note("quarter", "C4");
	piano.note("quarter", "D4");
	piano.note("quarter", "E4");
	piano.note("quarter", "F4");

	//Finishes and plays it:
	//Note: at least the first time, it is recommended to do it through a user-driven event (as "onClick", "onTouchStart", etc.) in order to maximize compatibility (as some clients could block sounds otherwise).
	var player = bandJSObject.finish();
	player.play()
}