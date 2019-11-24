<?php
	if (!isset($vars)) { $vars = Array(); }

	//If possible, allows infinite time for loading the script:
	if (!ini_get("safe_mode")) { @set_time_limit(0); }

	//If the endRequest function does not exist, creates it:
	if (!function_exists("endRequest"))
	{
		//Sends a desired HTTP status and message (and exits if wanted):
		function endRequest($status, $message, $exit = TRUE)
		{
			http_response_code($status);
			$message = trim($message);
			if ($message !== "") { echo $message; }
			if ($exit) { exit(); }
		}
	}

	//Includes required files:
	require "CB_proxy.functions.php";
	require "CB_proxy.config.php";

	//Starts or restores the session:
	@session_name(CB_PROXY_SESSION_NAME);
	@session_set_cookie_params(CB_PROXY_SESSION_COOKIE_LIFETIME);
	@session_start();
	setcookie(session_name(), session_id(), time() + CB_PROXY_SESSION_COOKIE_LIFETIME); //Updates session cookie lifetime to start again.

	//Gets the desired URL:
	$url = getVar("p_url");
	if ($url === "")
	{
		if (CB_PROXY_DEBUG_MODE) { $errorMessage = "URL not sent!"; }
		endRequest(400, $errorMessage);
	}
	$url = urldecode($url);
	
	//Gets the desired method:
	$method = strtoupper(getVar("p_method"));

	//Gets whether we want to force JSON response or not:
	$forceJSON = strtoupper(getVar("p_force_json"));
	$forceJSON = ($forceJSON === "YES") ? TRUE : FALSE;

	//Gets whether we want to get headers of the response or not:
	$getHeaders = strtoupper(getVar("p_get_headers"));
	$getHeaders = ($getHeaders === "YES") ? TRUE : FALSE;
	
	//Gets whether we want to get the headers in one dimension or not:
	$getHeadersOneDimension = strtoupper(getVar("p_get_headers_on_dimension"));
	$getHeadersOneDimension = ($getHeaders && $getHeadersOneDimension === "YES") ? TRUE : FALSE;

	//Gets whether we want to get the value of the headers in one dimension (just one value per key) or not:
	$getHeadersOneDimensionValues = strtoupper(getVar("p_get_headers_on_dimension_values"));
	$getHeadersOneDimensionValues = ($getHeaders && $getHeadersOneDimensionValues === "YES") ? TRUE : FALSE;
	
	//Gets whetehr we want transparent HTTP status (send it from server to client transparently) or not:
	$transparentStatus = strtoupper(getVar("p_transparent_status"));
	$transparentStatus = ($transparentStatus === "YES") ? TRUE : FALSE;

	//Gets whetehr we want transparent headers (send them from server to client transparently) or not:
	$transparentHeaders = strtoupper(getVar("p_transparent_headers"));
	$transparentHeaders = ($transparentHeaders === "YES") ? TRUE : FALSE;

	//Gets the desired headers:
	$headers = getVar("p_headers");
	if ($headers !== "")
	{
		$headers = json_decode($headers, TRUE); //The headers must be received in JSON.
	}
	if ($headers && is_array($headers) && sizeof($headers) > 0)
	{
		//Prepares the headers for CURL:
		$headersNew = Array();
		foreach ($headers as $index => $value)
		{
			$index = trim($index);
			$value = trim($value);
			if ($index !== "" && $value !== "")
			{
				$headersNew[] = $index . ":" . $value;
			}
		}
		$headers = $headersNew;
	}
	if (!is_array($headers) || sizeof($headers) <= 0 || sizeof($headers) === 1 && $headers[0] === "") { $headers = NULL; }

	//Gets the received parameters from "parameters" and parse them (if any):
	$fields = getVar("p_data");
	if ($fields === "")
	{
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
		
		//Gets the desired fields to be sent:
		$data = Array();
		if (isset($_GET) && isset($_POST)) { $data = Array($_GET, $_POST); }
		else if (isset($HTTP_GET_VARS) && isset($HTTP_POST_VARS)) { $data = Array($HTTP_GET_VARS, $HTTP_POST_VARS); }
		$fields = "";
		for ($x = 0; $x < sizeof($data); $x++)
		{
			foreach ($data[$x] as $key => $value)
			{
				$key = strtolower($key);
				if ($key === "p_data" || $key === "p_url" || $key === "p_method" || $key === "p_headers" || $key === "p_force_json" || $key === "p_get_headers" || $key === "p_get_headers_on_dimension" || $key === "p_get_headers_on_dimension_values" || $key === "p_transparent_status" || $key === "p_transparent_headers") { continue; }
				$fields .= $key . "=" . $value . "&";
			}
		}
		$fields = trim($fields, "&");
	}
		
	//Gets the result:
	function callbackFunction($response, $info, $callbackError = NULL)
	{
		global $transparentStatus, $transparentHeaders;
		
		if (!$transparentStatus) { return; }
		
		$statusCode = getStatusCode($info);
		http_response_code($statusCode === 0 ? 500 : $statusCode); //Prevents PHP to send HTTP status 200 when the status code is 0. NOTE: maybe this would also happen with 100, 101 and 102 (needs to be checked).
	}
	function callbackHeaders($headers)
	{
		global $transparentHeaders, $headersDesired, $headersToAvoid;
		
		if (!$transparentHeaders) { return; }
		
		return setHeadersFromHeadersResponse($headers, $headersDesired, $headersToAvoid, FALSE);
	}
	$result = getSslPage($url, $method, $fields, $headers, $forceJSON, $getHeaders, "callbackFunction", "callbackFunction", "callbackHeaders", NULL, $getHeadersOneDimension, $getHeadersOneDimensionValues);
	
	//If the compression is enabled, tries to compress the result to check whether it will be smaller or not and sends the needed headers if so:
	if (CB_PROXY_ZLIB_COMPRESSION) //ZLIB compression enabled.
	{
		$result = enableCompressionIfCompressesSmaller($result, CB_PROXY_ZLIB_COMPRESSION_LEVEL, TRUE, !CB_PROXY_ZLIB_COMPRESSION_CHECK_SIZE);
	}
	
	//Prints the result:
	echo $result;