var CB_supportedPHP = "<?php echo 'YES' ?>"; //It will contain "YES" if PHP is supported.
var CB_PHPVersion = 0; //It will keep the PHP version (if any).
var CB_PHPAcceptedLanguages = null; //It will keep a list of the accepted languages detected by PHP (if any), ordered by preference.
if (CB_supportedPHP === "YES")
{
	CB_PHPVersion = "<?php echo @phpversion(); ?>";
	/*
	<?php
		//Detects languages by order of preference:
		//* Source: Noel Whitemore based on Xeoncross code at http://stackoverflow.com/questions/3770513/detect-browser-language-in-php
		//preg_match_all('~([\w-]+)(?:[^,\d]+([\d.]+))?~', isset($_SERVER["HTTP_ACCEPT_LANGUAGE"]) ? strtolower($_SERVER["HTTP_ACCEPT_LANGUAGE"]) : Array(), $matches, PREG_SET_ORDER);
		preg_match_all('~([\w-]+)(?:[^,\d]+([\d.]+))?~', isset($_SERVER["HTTP_ACCEPT_LANGUAGE"]) ? $_SERVER["HTTP_ACCEPT_LANGUAGE"] : Array(), $matches, PREG_SET_ORDER);
		$availableLanguages = array();
		foreach ($matches as $match)
		{
		    //list($language_code, $language_region) = explode('-', $match[1]) + array('', '');
		    $priority = isset($match[2]) ? (float) $match[2] : 1.0;
			$availableLanguages[$match[1]] = $priority;
		}
		//Orders the array by the priority value:
		arsort($availableLanguages, SORT_NUMERIC);
		$availableLanguagesClean = "";
		foreach ($availableLanguages as $languageCode => $priority) { $availableLanguagesClean .= $languageCode . ","; }
		$availableLanguagesClean = rtrim($availableLanguagesClean, ",");
	?>
	*/
	CB_PHPAcceptedLanguages = "<?php echo $availableLanguagesClean; ?>".split(",");
}