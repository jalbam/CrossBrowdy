<?php
	define("CB_PROXY_DEBUG_MODE", TRUE); //Sets debug mode.
	define("CB_PROXY_SESSION_NAME", "CB_PROXY"); //Session name to start or continue when the proxy is called (CHANGE THIS!).
	define("CB_PROXY_SESSION_COOKIE_LIFETIME", 60 * 24 * 365); //Session cookie lifetime (in seconds).
	
	define("CB_PROXY_ZLIB_COMPRESSION", TRUE); //Enables or disables compression.
	define("CB_PROXY_ZLIB_COMPRESSION_LEVEL", 9); //Compression level (0 to 9 as maximum). Use -1 to let the server decide it.
	define("CB_PROXY_ZLIB_COMPRESSION_CHECK_SIZE", TRUE); //Defines whether to check size or not after compression (performance can be decreased but it can save bandwidth).
	
	//List of headers we desire to accept (set to NULL to accept all) when using transparent headers mode:
	$headersDesired = NULL;
	
	//List of headers we do not want to overwrite when using transparent headers mode:
	$headersToAvoid = Array("HTTP_CODE", "CONTENT-LENGTH", "CONTENT-TYPE", "CONTENT-ENCODING", "DATE", "EXPIRES", "PRAGMA", "CACHE-CONTROL", "CONNECTION", "TRANSFER-ENCODING");