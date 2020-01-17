<?php
	define("ACCOUNTS_FILE", "_code/data/accounts.php");
	define("TOKENS_CONFIRM_EMAIL_FILE", "_code/data/tokens_confirm_email.php");
	define("TOKENS_CHANGE_PASSWORD_FILE", "_code/data/tokens_change_password.php");
	define("TOKENS_SESSION_FILE", "_code/data/tokens_session.php");

	//Creates an array with the user accounts:
	$accounts = Array();
	$accountsPointer = 0;
	$accountsLines = file(ACCOUNTS_FILE);
	foreach ($accountsLines as $accountsLine)
	{
		$accountsLine = trim($accountsLine);
		$lineElements = explode(" | ", $accountsLine);
		if (sizeof($lineElements) === 4)
		{
			$accounts[$accountsPointer]["username"] = strtolower(trim($lineElements[0]));
			$accounts[$accountsPointer]["email"] = strtolower(trim($lineElements[1]));
			$accounts[$accountsPointer]["password"] = trim($lineElements[2]);
			$accounts[$accountsPointer++]["locked"] = !!intval(trim($lineElements[3]));
		}
	}

	//List of valid tokens to confirm email:
	$tokensConfirmEmail = getTokensConfirmEmail();

	//List of valid tokens to change password:
	$tokensChangePassword = getTokensChangePassword();

	//List of valid tokens to identify users after they login:
	$tokensSession = getTokensSession();