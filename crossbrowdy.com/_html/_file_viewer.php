<?php
	if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); }

	$dirPath = "_html/_doc/" . $category . "/" . $language . "/" . $subcategory . "/" . $topic . "_files/";

	
	//Shows the content of a given file:
	function getFileCode($file = "index.html", $path, $codeClass = "language-html")
	{
		//$fileContent = file_get_contents($path . $file);
		//if ($fileContent === FALSE) { return ""; }
		$fileContentArray = file($path . $file); //file_get_contents($path . $file);
		if ($fileContentArray === FALSE) { return ""; }

		$fileContent = "";
		foreach ($fileContentArray as $line)
		{
			if (strpos($line, 'name="twitter:') !== FALSE) { continue; }
			else if (strpos($line, 'property="og:') !== FALSE) { continue; }
			else if (strpos($line, 'property="article:') !== FALSE) { continue; }
			$fileContent .= $line;
		}

		$output = "";
		
		$output .= '<p><b><a href="' . $path . $file . '" target="_blank">' . $file . '</a></b>:</p>';
		$output .= '<pre><code class="' . $codeClass . ' line-numbers match-braces rainbow-braces">';
			$output .= $fileContent !== "" ? htmlspecialchars($fileContent) : "(empty file)";
		$output .= '</code></pre>';
		
		return $output;
	}

	
	//Shows the content of the files with the given extension (avoiding non desired files):
	function getFilesCode($filesExtension = "js", $files, $codeClass = "language-javascript", $filesToAvoid = Array())
	{
		global $dirPath;
		
		$output = "";
		
		$filesExtension = str_replace(".", "", $filesExtension);
		foreach ($files as $file)
		{
			if (array_search($file, $filesToAvoid) !== FALSE) { continue; }
			if ($file === "." || $file === "..") { continue; }
			
			$fileExtension = explode(".", $file);
			if (sizeof($fileExtension) === 1) { continue; }
			
			$fileExtension = $fileExtension[sizeof($fileExtension)-1];
			if ($fileExtension === $filesExtension)
			{
				$output .= getFileCode($file, $dirPath, $codeClass);
			}
		}
		
		return $output;
	}

	
	//Shows all files:
	function getFilesCodeAll()
	{
		global $dirPath, $category, $subcategory, $topic, $language, $projectURLDefault;
		
		$dirPath = "_html/_doc/" . $category . "/" . $language . "/" . $subcategory . "/" . $topic . "_files/";
		
		$output = "";
		
		if (file_exists($dirPath))
		{
			$files = scandir("_html/_doc/" . $category . "/" . $language . "/" . $subcategory . "/" . $topic . "_files/");

			$indexHTMLPosition = array_search("index.html", $files);
			$onlineLinkingAdvice = "\r\n\t\t&lt;!-- Note: it is recommended to download CrossBrowdy instead of hotlinking the online version. This is just for the example! --&gt;";
			if ($indexHTMLPosition !== FALSE)
			{
				$fileCode = getFileCode("index.html", $dirPath, "language-html");
				//$output = str_replace("../../../../../../CrossBrowdy", "CrossBrowdy", $fileCode);
				$output = str_replace("../../../../../../CrossBrowdy/", $projectURLDefault . "CrossBrowdy/", $fileCode);
				
				$output = str_replace
				(
					"&lt;!-- Loads FlashCanvas (Flash emulation) before CrossBrowdy. Needed also to use ExplorerCanvas (VML emulation) without problems: --&gt;",
					"&lt;!-- Loads FlashCanvas (Flash emulation) before CrossBrowdy. Needed also to use ExplorerCanvas (VML emulation) without problems: --&gt;" . $onlineLinkingAdvice,
					$output
				);

				$output = str_replace
				(
					"&lt;!-- Loads CrossBrowdy.js (main file): --&gt;",
					"&lt;!-- Loads CrossBrowdy.js (main file): --&gt;" . $onlineLinkingAdvice,
					$output
				);
								
				$output = str_replace("../../../../../../guides", "/guides", $output);
				
			}

			$output .= getFilesCode("html", $files, "language-html", Array("index.html"));

			$output .= getFilesCode("css", $files, "language-css");

			$output .= getFilesCode("js", $files, "language-javascript");
		}
		
		return $output;
	}
	
	
	function getTryExampleLink()
	{
		global $dirPath, $category, $subcategory, $topic;
		if (file_exists($dirPath . "index.html"))
		{
			//return '<a href="' . $dirPath . 'index.html" target="_blank">Try this example</a>';
			return '<a href="' . $category . '/' . $subcategory . '/' . $topic . '/try" target="_blank">Try this example</a>';
		}
		return '<p class="general_text" style="text-align:center;">File not found</p>';
	}
	
	
	function getTryExampleButton()
	{
		global $dirPath, $category, $subcategory, $topic;
		if (file_exists($dirPath . "index.html"))
		{
			//return '<a href="' . $dirPath . 'index.html" target="_blank" class="try_example_floating">Try this example</a>';
			return '<a href="' . $category . '/' . $subcategory . '/' . $topic . '/try" target="_blank" class="try_example_floating">Try this example</a>';
		}
		return '<p class="general_text" style="text-align:center;">File not found</p>';
	}
	