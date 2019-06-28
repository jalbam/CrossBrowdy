<?php
	//Returns a variable (GET or POST):
	function getGetOrPost($getOrPost, $index, $trim = TRUE)
	{
        global $HTTP_GET_VARS, $HTTP_POST_VARS;

        //If we wanted to and able, gets the value by GET:
        $getOrPost = strtoupper($getOrPost);
		if ($getOrPost == "GET")
		{
			if (isset($HTTP_GET_VARS[$index])) { $value = $HTTP_GET_VARS[$index]; }
			else if (isset($_GET[$index])) { $value = $_GET[$index]; }
			else { $value = ""; }
		}
		//...otherwise, if we wanted to and able, gets the value by POST:
		else if ($getOrPost == "POST")
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
                if (get_magic_quotes_gpc()) { $value[$index] = stripslashes($valueReal); }
            }
        }
        //...otherwise, it is a normal variable:
        else
        {
			//Decodes and trims it:
			if ($getOrPost === "GET") { $value = urldecode($value); }
			if ($trim) { $value = trim($value); }

			//If necessary (magic_quotes_gpc is enabled), removes the dashes:
			if (get_magic_quotes_gpc()) { $value = stripslashes($value); }

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

	
	//Returns the link to the subcategory/topic of the guide:
	function guideLink($category = "basic_tutorial",  $subcategory = "", $topic = "")
	{
		global $PHPExtension;
		$subcategory = trim($subcategory);
		$topic = trim($topic);
		return rtrim($category . $PHPExtension . "/" . $subcategory . "/" . $topic . "/", "/") . "/";
	}
	
	
	//Returns the link to a subcategory/topic of the examples:
	function examplesLink($subcategory = "", $topic = "")
	{
		return guideLink("examples", $subcategory, $topic);
	}
	
	
	//Returns the link to a subcategory/topic of the basic tutorial:
	function basicTutorialLink($subcategory = "", $topic = "")
	{
		return guideLink("basic_tutorial", $subcategory, $topic);
	}