/* This file belongs to a CrossBrowdy.com example, made by Joan Alba Maldonado. Creative Commons Attribution 4.0 International License. */

CB_init(main); //It will call the "main" function when ready.


//This function will be called when CrossBrowdy is ready:
function main()
{
	//Gets the content through Fetch:
	CB_Net.Fetch.get("data/test_fetch_text.txt").then
	(
		//Treats the response as text:
		function(response) { return response.text(); }
	).then
	(
		//Displays the content received:
		function(content)
		{
			CB_console("Content received: " + content);
			CB_Elements.insertContentById("content", content);
		}
	)["catch"] //This way we prevent errors because of using "catch" since it is a reserved word.
	(
		//Displays the error:
		function(error)
		{
			CB_console("Error:");
			CB_console(error);
			CB_Elements.insertContentById("content", "ERROR: " + content);
		}
	);	
}