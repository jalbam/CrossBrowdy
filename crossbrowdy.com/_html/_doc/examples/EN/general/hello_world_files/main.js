/* This file belongs to a CrossBrowdy.com example, made by Joan Alba Maldonado. */

CB_init(main); //It will call the "main" function when ready.


//This function will be called when CrossBrowdy is ready:
function main()
{
	CB_console("CrossBrowdy started!"); //Shows the text into the console (or in the DOM element if not available).
	CB_Elements.insertContentById("container", "Hello, World! CrossBrowdy version: " + CB_VERSION); //Inserts the given content into the desired element.
}