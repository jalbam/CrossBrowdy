<?php
	//Sends a desired HTTP status and message (and exits if wanted):
	function endRequest($status, $message, $showMethodAndPath = TRUE, $exit = TRUE)
	{
		global $method, $path;
		http_response_code($status);
		$message = trim($message);
		if ($message !== "") { echo $message; }
		if ($showMethodAndPath) { echo " \r\nMethod: " . $method . ", Path: " . $path; }
		if ($exit) { exit(); }
	}
	

	//Returns a COOKIE:
	function getCookie($index, $trim = TRUE) //Example to set a cookie: setCookie("cookie_name", $cookieValue, mktime().time() + 60 * 60 * 24 * 30, "/");
	{
		global $HTTP_COOKIE_VARS;

		if (isset($HTTP_COOKIE_VARS[$index])) { $value = $HTTP_COOKIE_VARS[$index]; }
		else if (isset($_COOKIE[$index])) { $value = $_COOKIE[$index]; }
		else { $value = ""; }
		
		if ($trim) { $value = trim($value); }
	
        //Returns the value:
        return $value;
	}

	
	//Returns a desired var received by POST:
	function getVariablePost($index, $trim = TRUE, $urldecode = TRUE)
	{
		global $HTTP_POST_VARS;
		$value = "";
		if (isset($HTTP_POST_VARS) && isset($HTTP_POST_VARS[$index])) { $value = $HTTP_POST_VARS[$index]; }
		else if (isset($_POST) && isset($_POST[$index])) { $value = $_POST[$index]; }
		if ($trim) { $value = trim($value); }
		if ($urldecode) { $value = urldecode($value); }
		return $value;
	}

	
	//Returns a desired var received by GET:
	function getVariableGet($index, $trim = TRUE)
	{
		global $HTTP_GET_VARS;
		$value = "";
		if (isset($HTTP_GET_VARS) && isset($HTTP_GET_VARS[$index])) { $value = $HTTP_GET_VARS[$index]; }
		else if (isset($_GET) && isset($_GET[$index])) { $value = $_GET[$index]; }
		if ($trim) { $value = trim($value); }
		return $value;
	}
	

	//Returns desired var by POST or GET:
	function getVariable($index, $trim = TRUE)
	{
		$value = getVariablePost($index, $trim);
		if (!isset($value) || $value === "") { $value = getVariableGet($index, $trim); }
		return $value;
	}

	
	//Checks whether an email is correct format or not:
	function checkEmailFormat($email)
	{
		return (filter_var($email, FILTER_VALIDATE_EMAIL) !== FALSE);
	}
	

	//Checks whether an username is wrong format or not:
	function checkUsernameFormat($username)
	{
		if (!is_string($username)) { return FALSE; }
		//TODO: check format also (not only size).
		return checkUsernameSize($username);
	}


	//Checks whether the username is wrong size or not:
	function checkUsernameSize($username)
	{
		if (!is_string($username)) { return FALSE; }
		$usernameLength = strlen($username);
		return ($usernameLength >= 3 && $usernameLength <= 16);
	}
	
	
	//Checks whether a password is wrong format or not:
	function checkPasswordFormat($password)
	{
		if (!is_string($password)) { return FALSE; }
		//TODO: check format also (not only size).
		return checkPasswordSize($password);
	}
	

	//Checks whether the password is wrong size or not:
	function checkPasswordSize($password)
	{
		if (!is_string($password)) { return FALSE; }
		$passwordLength = strlen($password);
		return ($passwordLength >= 3 && $passwordLength <= 20);
	}
	
	
	//Checks whether an key and value given matches in the accounts array:
	function accountsKeyMatchesValue($keySearched, $valueSearched, $caseSensitive = TRUE)
	{
		global $accounts;
		
		if (!$caseSensitive) { $valueSearched = strtolower($valueSearched); }
		
		//Loops through the accounts array:
		foreach ($accounts as $key => $accountArray)
		{
			if (!$caseSensitive) { $valueSearched = strtolower($valueSearched); }
			if (is_array($accountArray) && isset($accountArray[$keySearched]))
			{
				if (!$caseSensitive) { $accountArray[$keySearched] = strtolower($accountArray[$keySearched]); }
				if ($accountArray[$keySearched] === $valueSearched) { return $key; }
			}
		}
		return FALSE;
	}

	
	//Checks whether an username or a password already exists or not in the accounts array:
	function usernameOrEmailAndPasswordMatch($usernameOrEmail, $password)
	{
		global $accounts;
		
		//Finds the username and the email and returns their keys in the accounts array (or FALSE if not found):
		$keyUsername = accountsKeyMatchesValue("username", strtolower($usernameOrEmail), FALSE);
		$keyEmail = accountsKeyMatchesValue("email", strtolower($usernameOrEmail), FALSE);
		
		if ($keyUsername !== FALSE && $accounts[$keyUsername]["password"] === $password) { return TRUE; }
		if ($keyEmail !== FALSE && $accounts[$keyEmail]["password"] === $password) { return TRUE; }
		
		return FALSE;
	}
	
	
	function modifyFile($file, $callbackStart, $callbackPerLine, $callbackEnd, $trim = TRUE)
	{
		//Tries to opens the file for reading and writing:
		$fp = fopen($file, "a+");
		if ($fp === FALSE) { return FALSE; } //If the file cannot be opened, return false.
		if (flock($fp, LOCK_EX) == FALSE) { return FALSE; } //If the file cannot be locked, returns false.
		
		$buffer = "";
		
		//Inserts into the buffer the result of the start function (if any):
		if (is_callable($callbackStart))
		{
			$result = $callbackStart();
			if (is_string($result)) { $buffer .= $result; }
		}
		
		//Reads the file and keeps the desired lines:
		$lineNumber = 0;
		$callbackPerLineCallable = FALSE;
		$changeFile = TRUE;
		if (is_callable($callbackPerLine)) { $callbackPerLineCallable = TRUE; }
		while ($line = fgets($fp))
		{
			if ($line === FALSE) { break; } //Stops the loop when the end is reached.
			//Inserts into the buffer the result of the per-line function (if any):
			if ($callbackPerLineCallable)
			{
				$result = $callbackPerLine($line, $lineNumber);
				if (is_string($result)) { $buffer .= $result; }
				else if ($result === FALSE) { $buffer = ""; } //If it returns FALSE, cleans the buffer.
				else if ($result === NULL) { $buffer = ""; break; } //If it returns NULL, cleans the buffer and exits the loop.
				else if ($result === TRUE) { $changeFile = FALSE; break; } //If it returns TRUE, exits the loop and will not modify the file.
			}
			$lineNumber++;
		}
		
		//Inserts into the buffer the result of the end function (if any):
		if (is_callable($callbackEnd) && $changeFile)
		{
			$result = $callbackEnd();
			if (is_string($result)) { $buffer .= $result; }
			else if ($result === FALSE || $result === NULL) { $buffer = ""; } //If it returns FALSE or NULL, cleans the buffer.
			else if ($result === TRUE) { $changeFile = FALSE; } //If it returns TRUE, will not modify the file.
		}

		if ($changeFile)
		{
			//Writes the buffer into the file:
			ftruncate($fp, 0); //Truncates all the previous content of the file:
			rewind($fp); //Rewinds the pointer to the beginning of the file.
			fwrite($fp, $trim ? trim($buffer) : $trim);
			fflush($fp); //Flushes the output.
		}
		
		//Releases the lock:
		flock($fp, LOCK_UN);

		fclose($fp); //Closes the pointer.
		
		return TRUE;
	}
	
	
	//Creates a new token associated with an email given to let the user change password later:
	function createTokenConfirmEmail($email, $length = 25)
	{
		//Creates the new token:
		$email = strtolower(trim($email));
		return modifyFile
		(
			TOKENS_CONFIRM_EMAIL_FILE, //$file
			function() { return AUTHORIZATION_CODE . "\n"; },//$callbackStart
			function($line, $lineNumber) use($email) //callbackPerLine
			{
				$line = trim($line);
				$lineElements = explode(" | ", $line);
				if (sizeof($lineElements) === 2)
				{
					//If the current email is not the desired one, saves the line in the buffer to keep the line:
					$emailLine = strtolower(trim($lineElements[1]));
					if ($emailLine !== $email)
					{
						return $line . "\n";
					}
				}
				return "";
			},
			function() use($email, $length) { return generateToken($length, TOKENS_CONFIRM_EMAIL_FILE) . " | " . $email; } //$callbackEnd
		);
	}

	
	//Creates a new token associated with an email given to let the user change password later:
	function createTokenChangePassword($email, $length = 25)
	{
		//Creates the new token:
		$email = strtolower(trim($email));
		return modifyFile
		(
			TOKENS_CHANGE_PASSWORD_FILE, //$file
			function() { return AUTHORIZATION_CODE . "\n"; },//$callbackStart
			function($line, $lineNumber) use($email) //callbackPerLine
			{
				$line = trim($line);
				$lineElements = explode(" | ", $line);
				if (sizeof($lineElements) === 2)
				{
					//If the current email is not the desired one, saves the line in the buffer to keep the line:
					$emailLine = strtolower(trim($lineElements[1]));
					if ($emailLine !== $email)
					{
						return $line . "\n";
					}
				}
				return "";
			},
			function() use($email, $length) { return generateToken($length, TOKENS_CHANGE_PASSWORD_FILE) . " | " . $email; } //$callbackEnd
		);
	}


	//Creates a new user account:
	function registerUser($username, $email, $password, $lockedValue = NULL, $onlyUpdate = FALSE)
	{
		$username = strtolower(trim($username));
		$email = strtolower(trim($email));
		
		//Creates the new account:
		return modifyFile
		(
			ACCOUNTS_FILE, //$file
			function() { return AUTHORIZATION_CODE . "\n"; },//$callbackStart
			function($line, $lineNumber) use($username, $email, $lockedValue) //callbackPerLine
			{
				$line = trim($line);
				$lineElements = explode(" | ", $line);
				if (sizeof($lineElements) === 4)
				{
					$usernameLine = strtolower(trim($lineElements[0]));
					$emailLine = strtolower(trim($lineElements[1]));
					//If the user or email exists already:
					if ($username === $usernameLine || $email === $emailLine)
					{
						//If we do not want to update the locked value, exits without modifying the file:
						if ($lockedValue === NULL) { return TRUE; }
						//...otherwise, updates the line with the new locked value:
						else
						{
							return $usernameLine . " | " . $emailLine . " | " . strtolower(trim($lineElements[2])) . " | " . ($lockedValue ? "1" : "0") . "\n";
						}
					}
					//...otherwise, keeps the line:
					else
					{
						return $line . "\n";
					}
				}
				return "";
			},
			function() use($username, $email, $password, $lockedValue, $onlyUpdate) //$callbackEnd.
			{
				if ($onlyUpdate) { return ""; }
				else { return $username . " | " . $email . " | " . $password . " | " . ($lockedValue ? "1" : "0"); }
			}
		);
	}
	
	
	//Creates a new token associated with a username given to identify the user during its login session lasts:
	function createTokenLoginUser($username, $length = 25)
	{
		//Creates the new token:
		$username = strtolower(trim($username));
		return modifyFile
		(
			TOKENS_SESSION_FILE, //$file
			function() { return AUTHORIZATION_CODE . "\n"; },//$callbackStart
			function($line, $lineNumber) use($username) //callbackPerLine
			{
				$line = trim($line);
				$lineElements = explode(" | ", $line);
				if (sizeof($lineElements) === 2)
				{
					//If the current username is not the desired one, saves the line in the buffer to keep the line:
					$usernameLine = strtolower(trim($lineElements[1]));
					if ($usernameLine !== $username)
					{
						return $line . "\n";
					}
				}
				return "";
			},
			function() use($username, $length) { return generateToken($length, TOKENS_SESSION_FILE) . " | " . $username; } //$callbackEnd
		);
	}
	
	
	//Function that generates a unique token:
	function generateToken($length = 25, $file)
	{
		if (!is_numeric($length) || $length <= 0) { $length = 25; }
		$tokensFile = file_get_contents($file);
		do
		{
			$token = "";
			while (strlen($token) < $length)
			{
				$token .= substr(md5(rand()), 0, $length);
			}
			$token = substr($token, 0, $length);
		} while (strpos($tokensFile, $token) !== FALSE);
		return $token;
	}
	
	
	//Gets an array of tokens from a file:
	function getTokensFile($file, $emailAsKey = FALSE)
	{
		$tokens = Array();
		if (!file_exists($file)) { return $tokens; }
		$tokensLines = file($file);
		foreach ($tokensLines as $tokensLine)
		{
			$tokensLine = trim($tokensLine);
			$lineElements = explode(" | ", $tokensLine);
			if (sizeof($lineElements) === 2)
			{
				if (!$emailAsKey) { $tokens[trim($lineElements[0])] = strtolower(trim($lineElements[1])); }
				else { $tokens[strtolower(trim($lineElements[1]))] = trim($lineElements[0]); }
			}
		}
		return $tokens;
	}
	

	//Returns an array with the existing tokens to change password:
	function getTokensConfirmEmail($emailAsKey = FALSE)
	{
		return getTokensFile(TOKENS_CONFIRM_EMAIL_FILE, $emailAsKey);
	}

	
	//Returns an array with the existing tokens to change password:
	function getTokensChangePassword($emailAsKey = FALSE)
	{
		return getTokensFile(TOKENS_CHANGE_PASSWORD_FILE, $emailAsKey);
	}
	
	
	//Returns an array with the existing tokens to change password:
	function getTokensSession($emailAsKey = FALSE)
	{
		return getTokensFile(TOKENS_SESSION_FILE, $emailAsKey);
	}