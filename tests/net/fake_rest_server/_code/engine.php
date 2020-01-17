<?php
	//Enables any error displaying:
	error_reporting(E_ALL);
	ini_set("display_errors", "On");
	
	define("USING_REST_SERVER", TRUE);
	
	//Includes needed files:
	include "_code/functions.php"; //Functions needed.
	include "_code/config.php"; //Configuration needed.
	include "_code/data/data.php"; //Data needed.

	//Prepares the received data:
	$method = $_SERVER['REQUEST_METHOD']; //Gets method desired.
	$debugMode = !!getVariable("debug"); //Checks whether we want to use debug mode or not.
	$methodDebug = getVariable("method");
	if ($debugMode && $methodDebug !== "") { $method = $methodDebug; } //In the debug mode, the method sent by post or get overwrites the real one.
	$method = strtoupper(trim($method));
	
	//If the method has not been sent, just exits:
	if ($method === "") { endRequest(400, "NO METHOD SENT!"); }
	
	$path = strtolower(trim(substr(@$_SERVER['PATH_INFO'], 1))); //Gets path (route) requested.
	$pathArray = explode("/", $path); //Creates an array from the path requested.
	for ($x = 0; $x < 50; $x++) { if (!isset($pathArray[$x])) { $pathArray[$x] = ""; } }
	$path =  "/" . $path; //Adds the needed slash at the beginning of the path.

	//If the path has not been sent, just exits:
	if ($path === "/") { endRequest(400, "NO PATH OR ROOT SENT!"); }
	
	//In the case the data cannot be get from POST method, tries to get it from the PHP's input stream:
	if (isset($HTTP_POST_VARS) && is_array($HTTP_POST_VARS) && sizeof($HTTP_POST_VARS) === 0 || isset($_POST) && is_array($_POST) && sizeof($_POST) === 0)
	{
		$dataReceived = file_get_contents("php://input");
		//If the content is JSON, tries to parse it:
		if (isset($_SERVER["CONTENT_TYPE"]) && strtolower($_SERVER["CONTENT_TYPE"]) === "application/json" && isset($dataReceived))
		{
			$dataReceivedJSON = json_decode($dataReceived, TRUE);
			if (isset($dataReceivedJSON)) { $_POST = $dataReceivedJSON; }
		}
		//...otherwise, tries to fill the POST array with the data string sent:
		else { parse_str($dataReceived, $_POST); }
	}
	
	//Performs the REST actions depending on the requested path (route):
	$processPath = trim($path, "/") . "/";
	$processFile = $processPath . "index.php";
	if (file_exists($processFile))
	{
		include $processFile; //It will contain variables normally.
		$processFileMethod = $processPath . strtolower($method) . ".php";
		if (file_exists($processFileMethod)) { include $processFileMethod; } //It will contain the logic normally.
		else { endRequest(405, "METHOD NOT ALLOWED!"); }
	}
	else { endRequest(404, "NOT FOUND!"); /* echo DEFAULT_RESPONSE; */ }