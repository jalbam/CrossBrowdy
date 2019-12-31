<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	CrossBrowdy includes the <a href="http://pieroxy.net/blog/pages/lz-string/index.html" target="_blank">lz-string library</a> for managing data compression and decompression. Here is an example:
</p>
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Example of data compression and decompression management:
	var myDataString = "Hello, CrossBrowdy! This is my data to test compression."; //Length: 56.
	
	//Gets the 'LZString' object:
	var lz = CB_getLZStringObject();
	
	//Compressing and decompressing (can produce invalid UTF-16 strings):
	var myDataStringCompressed = lz.compress(myDataString); //Length: 31.
	var myDataStringDecompressed = lz.decompress(myDataStringCompressed); //Returns 'myDataString' again.
	
	//Compressing and decompressing using "valid" UTF-16 (useful for local storage):
	var myDataStringCompressed_UTF16 = lz.compressToUTF16(myDataString); //Compressed in valid UTF-16. Length: 34.
	var myDataStringDecompressed_2 = lz.decompressFromUTF16(myDataStringCompressed_UTF16); //Decompressed from UTF-16 valid data. Returns 'myDataString' again.
	
	//Encoding and decoding in base 64:
	var myDataStringEncoded_base64 = lz.compressToBase64(myDataString); //Compressed encoding in base 64. Length: 84.
	var myDataStringDecoded_base64 = lz.decompressFromBase64(myDataStringEncoded_base64); //Decompressed data encoded in base 64. Returns 'myDataString' again.
	
	//Compressing and decompressing base 64 data (using the 'Base64String' object):
	var lzBase64 = CB_getBase64StringObject(); //Gets the 'Base64String' object.
	var myDataStringCompressed_UTF16_base64_2 = lzBase64.compress(myDataStringEncoded_base64); //Compresses data which is already in base 64. Length: 32.
	var myDataString_base64 = lzBase64.decompress(myDataStringCompressed_UTF16_base64_2); //Decompressed the encoded base 64 data. Returns 'myDataStringEncoded_base64' again.
	var myDataStringDecompressed_4 = lz.decompressFromBase64(myDataString_base64); //Decodes the base 64 data. Returns 'myDataString' again.
	
	//Compressing and decompressing using base 64 and valid for URI components:
	var myDataStringCompressed_UTF16_base64_URIComponent = lz.compressToEncodedURIComponent(myDataString); //Compressed encoding in base 64 and encoded for URI components. Length: 83.
	var myDataStringDecompressed_5 = lz.decompressFromEncodedURIComponent(myDataStringCompressed_UTF16_base64_URIComponent); //Decompressed from data encoded in base 64 and encoded for URI components. Returns 'myDataString' again.
	
	//Compressing and decompressing using 'uint8Array':
	var myDataStringCompressed_Uint8Array = lz.compressToUint8Array(myDataString); //Compressed in a 'uint8Array'. Length: 62.
	var myDataStringDecompressed_6 = lz.decompressFromUint8Array(myDataStringCompressed_Uint8Array); //Decompressed from a 'uint8Array'. Returns 'myDataString' again.
</code></pre>

<p>
	You can get more information in the <a href="http://pieroxy.net/blog/pages/lz-string/guide.html" target="_blank">lz-string library documentation</a>.
</p>

<p>
	Check the <a href="_html/_doc/api/index.html" target="_blank">API documentation</a> to read more about some <a href="_html/_doc/api/global.html" target="_blank">global functions and variables</a>.
</p>