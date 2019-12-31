<?php
	$dirPath = "_html/_doc/" . $category . "/" . $language . "/" . $subcategory . "/" . $topic . "_files/";

	
	//Shows the content of a given file:
	function getFileCode($file = "index.html", $path, $codeClass = "language-html")
	{
		$fileContent = file_get_contents($path . $file);
		if ($fileContent === FALSE) { return ""; }

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
		global $dirPath, $category, $subcategory, $topic, $language;
		
		$dirPath = "_html/_doc/" . $category . "/" . $language . "/" . $subcategory . "/" . $topic . "_files/";
		
		$output = "";
		
		if (file_exists($dirPath))
		{
			$files = scandir("_html/_doc/" . $category . "/" . $language . "/" . $subcategory . "/" . $topic . "_files/");

			$indexHTMLPosition = array_search("index.html", $files);
			if ($indexHTMLPosition !== FALSE)
			{
				$fileCode = getFileCode("index.html", $dirPath, "language-html");
				$output .= str_replace("../../../../../../CrossBrowdy", "CrossBrowdy", $fileCode);
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
		return "File not found";
	}
	
	
	function getTryExampleButton()
	{
		global $dirPath, $category, $subcategory, $topic;
		if (file_exists($dirPath . "index.html"))
		{
			//return '<a href="' . $dirPath . 'index.html" target="_blank" class="try_example_floating">Try this example</a>';
			return '<a href="' . $category . '/' . $subcategory . '/' . $topic . '/try" target="_blank" class="try_example_floating">Try this example</a>';
		}
		return "File not found";
	}
	