<?php
	//Returns a variable (GET or POST):
	function getGetOrPost($getOrPost, $index, $trim = TRUE)
	{
        global $HTTP_GET_VARS, $HTTP_POST_VARS;

        //If we wanted to and able, gets the value by GET:
        $getOrPost = strtoupper($getOrPost);
		if ($getOrPost === "GET")
		{
			if (isset($HTTP_GET_VARS[$index])) { $value = $HTTP_GET_VARS[$index]; }
			else if (isset($_GET[$index])) { $value = $_GET[$index]; }
			else { $value = ""; }
		}
		//...otherwise, if we wanted to and able, gets the value by POST:
		else if ($getOrPost === "POST")
		{
			if (isset($HTTP_POST_VARS[$index])) { $value = $HTTP_POST_VARS[$index]; }
			else if (isset($_POST[$index])) { $value = $_POST[$index]; }
			else { $value = ""; }
		}
		else { $value = ""; }
		
        //If it is an array, treats each value one by one:
        if (is_array($value))
        {
            foreach ($value as $index => $valueReal)
            {
                //Decodes and trims it:
				if ($getOrPost === "GET") { $valueReal = urldecode($valueReal); }
				if ($trim) { $valueReal = trim($valueReal); }
				$value[$index] = $valueReal;
        
                //If necessary (magic_quotes_gpc is enabled), removes the dashes:
                if (function_exists("get_magic_quotes_gpc") && get_magic_quotes_gpc()) { $value[$index] = stripslashes($valueReal); }
            }
        }
        //...otherwise, it is a normal variable:
        else
        {
			//Decodes and trims it:
			if ($getOrPost === "GET") { $value = urldecode($value); }
			if ($trim) { $value = trim($value); }

			//If necessary (magic_quotes_gpc is enabled), removes the dashes:
			if (function_exists("get_magic_quotes_gpc") && get_magic_quotes_gpc()) { $value = stripslashes($value); }

			//$value = str_replace("%27", "", $value);
			//$value = str_replace("'", "", $value);
				
			//$value = @mysql_real_escape_string($value);
		}
	
        //Returns the value:
        return $value;
	}

	
	//Returns an URL variable (GET):
	function getGet($index, $trim = TRUE)
	{
        //Returns the value:
        return getGetOrPost("GET", $index, $trim);
	}

	
	//Returns an URL variable (POST):
	function getPost($index, $trim = TRUE)
	{
        //Returns the value:
        return getGetOrPost("POST", $index, $trim);
	}


	//Function that gets the data from post and tries to get by get if debug mode is active:
	function getVar($index, $useTwoModes = TRUE, $trim = TRUE)
	{
		$var = getPost($index, $trim);
		if (($useTwoModes || CB_PROXY_DEBUG_MODE) && $var === "") { $var = getGet($index, $trim); }
		return $var;
	}

	
	//Enables compression if the given string is smaller when compressed:
	function enableCompressionIfCompressesSmaller($string, $compressionLevel, $fastMode = FALSE, $avoidCheckingSize = FALSE)
	{
		global $HTTP_SERVER_VARS;
		if ($fastMode)
		{
			//TODO: for performance reasons, just return the string if the string is smaller than "X" characters (maybe 1000).
			
			$headers = Array();
			if (isset($_SERVER) && is_array($_SERVER) && sizeof($_SERVER) > 0) { $headers = $_SERVER; }
			if (sizeof($headers) === 0 && isset($HTTP_SERVER_VARS) && is_array($HTTP_SERVER_VARS) && sizeof($HTTP_SERVER_VARS) > 0) { $headers = $HTTP_SERVER_VARS; }
			
			//If the server supports GZIP compression:
			if (isset($headers) && isset($headers['HTTP_ACCEPT_ENCODING']) && stristr($headers['HTTP_ACCEPT_ENCODING'], "gzip"))
			{
				//Compresses the string:
				//$stringCompressed = gzcompress($string, $compressionLevel);
				$stringCompressed = gzencode($string, $compressionLevel);
				
				//If the compressed string is smaller:
				if ($avoidCheckingSize || strlen($stringCompressed) < strlen($string))
				{
					//Enables compression by sending the corresponding headers:
					header("Content-Encoding: gzip");
					
					//Returns the string compressed:
					return $stringCompressed;
				}
			}
			return $string;
		}
		else
		{
			//TODO: for performance reasons, just return FALSE if the string is smaller than "X" characters (maybe 1000).
			
			$stringCompressed = gzencode($string, $compressionLevel);
			//If the compressed string is smaller, enables compression:
			if ($avoidCheckingSize || strlen($stringCompressed) < strlen($string))
			{
				@ini_set('zlib.output_compression', "On"); //ini_set("zlib.output_compression", 4096);
				@ini_set('zlib.output_compression_level', $compressionLevel);
				return TRUE;
			}
			return FALSE;
		}
	}
	
	
	//Gets the desired property of a JSON object:
	function getJSONPropertyValue($response, $property = NULL, $returnResponseOnFail = FALSE)
	{
		$responseOriginal = $response;
		
		//If it is not an array, we assume it is JSON data and try to convert it into an array:
		if (is_string($response))
		{
			$response = @json_decode($response, TRUE);
		}
		
		if ($response === NULL || !is_array($response))
		{
			if (!$property || $returnResponseOnFail) { return $responseOriginal; }
			else { return NULL; }
		}
		else if ($property && isset($response[$property])) { return $response[$property]; }
		else if (!$property || $returnResponseOnFail) { return $responseOriginal; }
		else { return NULL; } //Returns NULL as the status if no status is found.
	}


	//Gets the status code from info array or from JSON response (generated by getSslPage function):
	function getStatusCode($response, $statusDefault = -1, $sanitize = TRUE)
	{
		$statusCode = getJSONPropertyValue($response, "status", false);
		if ($statusCode === NULL || !is_numeric($statusCode)) { $statusCode = getJSONPropertyValue($response, "http_code", false); }
		if ($sanitize && ($statusCode === NULL || !is_numeric($statusCode))) { return $statusDefault; } //If the property is not found or null and we want to sanitize, returns the default value.
		return intval($statusCode); //Can be NULL.
	}

	
	//Gets a header as string and returns it as an array:
	//* Source: Markus Knappen Johansson @ http://stackoverflow.com/questions/10589889/returning-header-as-array-using-curl
	function headersStringToArray($headerContent, $forceOneDimension = TRUE, $forceOneDimensionValues = FALSE)
	{
		$headers = array();

		//Split the string on every "double" new line:
		$arrRequests = explode("\r\n\r\n", $headerContent);

		//Loop of response headers. The "count() -1" is to avoid an empty row for the extra line break before the body of the response:
		$indexDesired = 0;
		for ($index = 0; $index < count($arrRequests) -1; $index++)
		{
			$indexDesired = $forceOneDimension ? 0 : $index;
			foreach (explode("\r\n", $arrRequests[$index]) as $i => $line)
			{
				if ($i === 0)
				{
					$headers[$indexDesired]['http_code'] = $line;
				}
				else
				{
					/////////list ($key, $value) = explode(': ', $line);
					
					///////list ($key, $value) = explode(':', $line);
					//$key = trim($key);
					//$value = trim($value);
					
					$colonPosition = strpos($line, ":");
					if ($colonPosition === FALSE) { continue; }
					$key = trim(substr($line, 0, $colonPosition));
					$value = trim(substr($line, $colonPosition + 1));
					
					if (!$forceOneDimensionValues)
					{
						if (!isset($headers[$indexDesired][$key])) { $headers[$indexDesired][$key] = Array(); }
						$headers[$indexDesired][$key][] = $value;
					}
					else
					{
						$headers[$indexDesired][$key] = $value;
					}
				}
			}
		}

		//If there is only one headers, use just one dimension if we want to force it:
		if ($forceOneDimension && sizeof($headers) === 1)
		{
			$headers = $headers[0];
		}
		
		return $headers;
	}
	

	//Gets an array with the headers desired from a headers array (generated by headersStringToArray function):
	function getHeadersDesired($headers, $headersDesired, $headersAvoid = NULL, $overwriteValues = FALSE)
	{
		$headersFound = Array();
		if (!is_array($headers) || sizeof($headers) === 0) { return $headersFound; }
		if (!is_array($headersDesired) || sizeof($headersDesired) === 0) { $headersDesired = NULL; }
		else
		{
			//Turns all headers desired to upper-case:
			$headersDesired = array_map("strtoupper", $headersDesired);
		}
		
		//Sends the received headers transparently (avoiding to send the ones we want to keep):
		foreach ($headers as $index => $headersLoop)
		{
			if (!is_array($headersLoop))
			{
				if ($headersDesired === NULL || in_array(strtoupper($index), $headersDesired))
				{
					if ($overwriteValues) { $headersFound[$index] = $headersLoop; }
					else
					{
						if (!isset($headersFound[$index])) { $headersFound[$index] = Array(); }
						$headersFound[$index][] = $headersLoop;
					}
				}
			}
			else
			{
				foreach ($headersLoop as $key => $value)
				{
					$key = trim($key);
					
					if (!is_array($value))
					{
						$value = trim($value);
						if ($headersDesired === NULL || in_array(strtoupper($key), $headersDesired))
						{
							if ($overwriteValues) { $headersFound[$key] = $value; }
							else
							{
								if (!isset($headersFound[$key])) { $headersFound[$key] = Array(); }
								$headersFound[$key][] = $value;
							}
						}
					}
					else
					{
						foreach ($value as $valueLoop)
						{
							$valueLoop = trim($valueLoop);
							if ($headersDesired === NULL || in_array(strtoupper($key), $headersDesired))
							{
								if ($overwriteValues) { $headersFound[$key] = $valueLoop; }
								else
								{
									if (!isset($headersFound[$key])) { $headersFound[$key] = Array(); }
									$headersFound[$key][] = $valueLoop;
								}
							}
						}
					}
				}
			}
		}
		
		if (is_array($headersAvoid))
		{
			foreach ($headersAvoid as $headerAvoid)
			{
				foreach ($headersFound as $index => $value)
				{
					if (strtoupper($headerAvoid) === strtoupper($index)) { unset($headersFound[$index]); }	
				}
				
			}
		}
		
		return $headersFound;
	}
	
	
	//Sets (send) the desired headers from the array of headers (generated by headersStringToArray function):
	function setHeadersFromHeadersResponse($headers, $headersDesired = NULL, $headersAvoid = NULL, $replace = FALSE)
	{
		//TODO: have an array of the headers we allow to send in the case the framework does not send them (because now we do not send them if they are in headersAvoid even if they are not duplicated).
		
		$headersArray = getHeadersDesired($headers, $headersDesired, NULL, FALSE);
		
		$replace = !!$replace;
		
		if (!is_array($headersAvoid)) { $headersAvoid = Array(); }
		
		//Turns all headers to avoid to upper-case:
		$headersAvoid = array_map("strtoupper", $headersAvoid);
		
		$headersApplied = Array();
		
		foreach ($headersArray as $headerName => $headerValues)
		{
			if (in_array(strtoupper($headerName), $headersAvoid)) { continue; }
			if (!is_array($headerValues))
			{
				header($headerName . ":" . $headerValues, $replace);
				if (!isset($headersApplied[$headerName])) { $headersApplied[$headerName] = Array(); }
				$headersApplied[$headerName][] = $headerValues;
			}
			else
			{
				foreach ($headerValues as $value)
				{
					header($headerName . ":" . $value, $replace);
					if (!isset($headersApplied[$headerName])) { $headersApplied[$headerName] = Array(); }
					$headersApplied[$headerName][] = $value;
				}
			}
		}

		return $headersApplied;
	}
	

	//Calls an external page (by desired request method) and sends desired data:
	//* TODO: add support for multiple asynchronous requests using curl_multi_* functions.
	function getSslPage($url, $method = "POST", $fields, $header = NULL, $forceJSON = FALSE, $getHeadersResponse = FALSE, $callbackOk = NULL, $callbackError = NULL, $callbackHeaders = NULL, $allowedSuccessStatuses = NULL, $headersForceOneDimension = FALSE, $headersForceOneDimensionValues = FALSE)
	{
		$method = strtoupper($method);
		$fields = trim($fields);
		$sendDataByPost = FALSE;
		
		$ch = curl_init();

		if ($method === "GET")
		{
			if ($fields !== "")
			{
				$url = rtrim($url, "?& ");
				if (strpos($url, "?") !== FALSE) { $url .= "&" . $fields; }
				else { $url .= "?" . $fields; }
			}
		}
	    else if ($method === "POST")
	    {
	    	//curl_setopt($ch, CURLOPT_POST, true);
			curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
			$sendDataByPost = TRUE;
	    }
		else if ($method === "HEAD")
		{
			//curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
			curl_setopt($ch, CURLOPT_NOBODY, true);
			$sendDataByPost = TRUE;
		}
		else
		{
			curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
			////curl_setopt($curl, CURLOPT_HTTPHEADER, array('Content-Type: application/json',"OAuth-Token: $token"));
			//curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($data));
			//curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($fields));
			$sendDataByPost = TRUE;
		}
		
	    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
	    curl_setopt($ch, CURLOPT_HEADER, $getHeadersResponse || is_callable($callbackHeaders));
	    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, TRUE);
	    curl_setopt($ch, CURLOPT_URL, $url);
	    curl_setopt($ch, CURLOPT_REFERER, $url);
	    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);

		if (is_array($header) && sizeof($header) > 0) { curl_setopt($ch, CURLOPT_HTTPHEADER, $header); }
		
		if ($fields !== "" && $sendDataByPost) { curl_setopt($ch, CURLOPT_POSTFIELDS, $fields); }

	    $result = curl_exec($ch);
		
		$info = curl_getinfo($ch);

		//If we want the headers of the response:
		if ($getHeadersResponse || is_callable($callbackHeaders))
		{
			$headersResultSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
			$headersResult = substr($result, 0, $headersResultSize);
			$headersResult = headersStringToArray($headersResult, $headersForceOneDimension, $headersForceOneDimensionValues);
		}

		//Creates a JSON object to return in the case we want to force JSON response:
		$resultOriginal = $result;

		$result =
			Array
			(
				"status" => $info["http_code"],
				"response" => $result
			);
		if ($getHeadersResponse)
		{
			$result["response"] = substr($result["response"], $headersResultSize);
			//$result["response"] = htmlentities($result["response"], ENT_SUBSTITUTE); //Needed to escape some characters that would make the json_encode function fail.
			$result["response"] = utf8_encode($result["response"]); //Needed to escape some characters that would make the json_encode function fail.
			$result["headers"] = $headersResult;
		}
		else if (is_callable($callbackHeaders))
		{
			$result["response"] = substr($result["response"], $headersResultSize);
			//$result["response"] = htmlentities($result["response"], ENT_SUBSTITUTE); //Needed to escape some characters that would make the json_encode function fail.
			$result["response"] = utf8_encode($result["response"]); //Needed to escape some characters that would make the json_encode function fail.
			$callbackHeaders($headersResult);
		}

		//If the response is JSON, converts it into an array:
		$responseJSON = json_decode($result["response"], TRUE);
		if (isset($responseJSON)) { $result["response"] = $responseJSON; }

		//Converts all to JSON:
		$result = json_encode($result);
		
		//If the connection is successful:
		$info["http_code"] = intval($info["http_code"]);
		if ($resultOriginal !== FALSE && (is_array($allowedSuccessStatuses) && in_array($info["http_code"], $allowedSuccessStatuses) || !is_array($allowedSuccessStatuses) && $info["http_code"] >= 200 && $info["http_code"] <= 208 || $info["http_code"] === 226))
		{
			//Calls the "ok" function (if any):
			if (is_callable($callbackOk)) { $callbackOk($forceJSON ? json_decode($result, TRUE) : $resultOriginal, $info, $callbackError); }
		}
		//...otherwise, if the connection has failed:
		else
		{
			//Calls the "error" function (if any):
			if (is_callable($callbackError)) { $callbackError($forceJSON ? json_decode($result, TRUE) : $resultOriginal, $info); }
		}

	    curl_close($ch);

		if ($forceJSON) { return $result; }
		else if (isset($headersResult) && !$getHeadersResponse) { return substr($resultOriginal, $headersResultSize); }
		else { return $resultOriginal; }
	}