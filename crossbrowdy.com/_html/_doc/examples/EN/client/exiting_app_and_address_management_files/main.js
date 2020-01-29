/* This file belongs to a CrossBrowdy.com example, made by Joan Alba Maldonado. Creative Commons Attribution 4.0 International License. */

CB_init(main); //It will call the "main" function when ready.


//This function will be called when CrossBrowdy is ready:
function main()
{
	//Gets the current address (location):
	CB_Elements.insertContentById("location_current", CB_Client.getLocation());
	CB_Elements.insertContentById("location_current_no_file", CB_Client.getLocationWithoutFile());
	
	//Tells whether it is running locally (using the "file:" protocol):
	CB_Elements.insertContentById("running_locally", CB_Client.isRunningLocally() ? "Yes" : "No");
}


//Exits the app:
function exit()
{
	CB_Client.exit(); //By default, it will use internal fallbacks and workarounds if standard methods fail.
}


//Redirects the app:
function redirectTo(data)
{
	//If the first URI already has data, the data given will be attached to it (stripping/adding "&" and "?" symbols automatically):
	CB_Client.redirectTo("https://crossbrowdy.com/", data);
}