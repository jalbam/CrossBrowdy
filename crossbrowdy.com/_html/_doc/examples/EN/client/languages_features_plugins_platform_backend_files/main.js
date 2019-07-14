CB_init(main); //It will call the "main" function when ready.


//This function will be called when CrossBrowdy is ready:
function main()
{
	//Sets the desired text as the document title:
	CB_Client.setTitle("Client: Languages, features, plug-ins, platform and back-end - Example");
	
	//Shows general client information:
	CB_Elements.insertContentById("document_title", CB_Client.getTitle());
	CB_Elements.insertContentById("client_name", CB_Client.get());
	CB_Elements.insertContentById("client_version", CB_Client.getVersion());
	CB_Elements.insertContentById("client_version_main", CB_Client.getVersionMain()); //Just the first number.
	
	//Support of native "canvas" element:
	CB_Elements.insertContentById("canvas_support", CB_Client.supportsCanvas() ? "Yes" : "No");
	
	//Support of CSS3 transform:
	CB_Elements.insertContentById("css3_transform_support", CB_Client.supportsCSS3Transform() ? "Yes" : "No");

	//Flash plug-in detection:
	CB_Elements.insertContentById("flash_plugin", CB_Client.supportsFlash() ? CB_Client.getFlashVersion(true) : "No"); //Using "true" to force it to return a string.

	//Silverlight plug-in detection:
	CB_Elements.insertContentById("silverlight_plugin", CB_Client.supportsSilverlight() ? CB_Client.getSilverlightVersion(true) : "No"); //Using "true" to force it to return a string.

	//Node.js detection:
	CB_Elements.insertContentById("nodejs_available", CB_Client.supportsNodeJS() ? CB_Client.getNodeJSVersion(true) : "No"); //Using "true" to force it to return a string.

	//PHP detection:
	CB_Elements.insertContentById("php_available", CB_Client.getPHPVersion() ? CB_Client.getPHPVersion(true) : "No"); //Using "true" to force it to return a string.

	//Electron detection:
	CB_Elements.insertContentById("electron_detected", CB_Client.isRunningOnElectron() ? "Yes" : "No");

	//NW.js (formerly node-webkit) detection:
	CB_Elements.insertContentById("nwjs_detected", CB_Client.isRunningOnNWjs() ? "Yes" : "No");
	
	//Shows language information:
	showLanguageInformation();
	
	//Setting a function to call whenever the client language is changed:
	CB_Client.onLanguageChanges(function(e) { CB_console("Language changed!"); showLanguageInformation(e); });
}


//Shows language information:
function showLanguageInformation(e)
{
	//String with the first preferred language detected, with the default options:
	CB_Elements.insertContentById("preferred_language", CB_Client.getLanguage());

	//String with the first preferred language detected, using 'window.navigator.languages' if possible:
	CB_Elements.insertContentById("preferred_language_navigator", CB_Client.getLanguage(true, false));

	//String with the first preferred language detected, without using 'window.navigator.languages' but still using client language:
	CB_Elements.insertContentById("preferred_language_client", CB_Client.getLanguage(false, false));
	
	//Array of strings with the supported languages detected, with the default options:
	CB_Elements.insertContentById("preferred_languages", CB_Client.getLanguages());
	
	//Array of strings with the supported languages detected, using 'window.navigator.languages' if possible:
	CB_Elements.insertContentById("preferred_languages_navigator", CB_Client.getLanguages(true, false));
	
	//Array of strings with the supported languages detected, without using 'window.navigator.languages' but still using client languages:
	CB_Elements.insertContentById("preferred_languages_client", CB_Client.getLanguages(false, false));
}