CB_init(main); //It will call the "main" function when ready.


//This function will be called when CrossBrowdy is ready:
function main()
{
	processString();
}


var myDataStringLast = null;
function processString()
{
	//Example of data compression and decompression management:
	var myDataString = CB_Elements.id("text").value;
	
	//If the text introduced the same one or it is empty, exits calling itself again:
	if (myDataString === myDataStringLast || myDataString.length === 0) { setTimeout(processString, 1); return; }

	CB_Elements.insertContentById("content", "Original length: " + myDataString.length + "<br /><br />");

	//Gets the 'LZString' object:
	var lz = CB_getLZStringObject();

	//Compressing and decompressing (can produce invalid UTF-16 strings):
	var myDataStringCompressed = lz.compress(myDataString);
	var myDataStringDecompressed = lz.decompress(myDataStringCompressed); //Returns 'myDataString' again.
	CB_Elements.appendContentById("content", "LZ compression: " + (myDataStringDecompressed === myDataString ? "CORRECT" : "<b>FAILED</b>") + "<br />");
	CB_Elements.appendContentById("content", "LZ compression result: " + myDataStringCompressed + "<br />");
	CB_Elements.appendContentById("content", "LZ compression result length: " + myDataStringCompressed.length + "<br />");
	CB_Elements.appendContentById("content", "LZ compression ratio: " + CB_numberFormat((myDataStringCompressed.length / myDataString.length - 1) * 100 * -1, 2, true) + "%<br /><br />");

	//Compressing and decompressing using "valid" UTF-16 (useful for local storage):
	var myDataStringCompressed_UTF16 = lz.compressToUTF16(myDataString); //Compressed in valid UTF-16.
	var myDataStringDecompressed_2 = lz.decompressFromUTF16(myDataStringCompressed_UTF16); //Decompressed from UTF-16 valid data. Returns 'myDataString' again.
	CB_Elements.appendContentById("content", "LZ UTF-16 compression: " + (myDataStringDecompressed_2 === myDataString ? "CORRECT" : "<b>FAILED</b>") + "<br />");
	CB_Elements.appendContentById("content", "LZ UTF-16 compression result: " + myDataStringCompressed_UTF16 + "<br />");
	CB_Elements.appendContentById("content", "LZ UTF-16 compression result length: " + myDataStringCompressed_UTF16.length + "<br />");
	CB_Elements.appendContentById("content", "LZ UTF-16 compression ratio: " + CB_numberFormat((myDataStringCompressed_UTF16.length / myDataString.length - 1) * 100 * -1, 2, true) + "%<br /><br />");

	//Encoding and decoding in base 64:
	var myDataStringEncoded_base64 = lz.compressToBase64(myDataString); //Compressed encoding in base 64.
	var myDataStringDecoded_base64 = lz.decompressFromBase64(myDataStringEncoded_base64); //Decompressed data encoded in base 64. Returns 'myDataString' again.
	CB_Elements.appendContentById("content", "LZ Base 64 encoding: " + (myDataStringDecoded_base64 === myDataString ? "CORRECT" : "<b>FAILED</b>") + "<br />");
	CB_Elements.appendContentById("content", "LZ Base 64 encoding result: " + myDataStringEncoded_base64 + "<br />");
	CB_Elements.appendContentById("content", "LZ Base 64 encoding result length: " + myDataStringEncoded_base64.length + "<br />");
	CB_Elements.appendContentById("content", "LZ Base 64 encoding ratio: " + CB_numberFormat((myDataStringEncoded_base64.length / myDataString.length - 1) * 100 * -1, 2, true) + "%<br /><br />");

	//Compressing and decompressing base 64 data (using the 'Base64String' object):
	var lzBase64 = CB_getBase64StringObject(); //Gets the 'Base64String' object.
	var myDataStringCompressed_UTF16_base64_2 = lzBase64.compress(myDataStringEncoded_base64); //Compresses data which is already in base 64.
	var myDataString_base64 = lzBase64.decompress(myDataStringCompressed_UTF16_base64_2); //Decompressed the encoded base 64 data. Returns 'myDataStringEncoded_base64' again.
	var myDataStringDecompressed_4 = lz.decompressFromBase64(myDataString_base64); //Decodes the base 64 data. Returns 'myDataString' again.
	CB_Elements.appendContentById("content", "LZ Base 64 compression (Base64String): " + (myDataStringDecompressed_4 === myDataString ? "CORRECT" : "<b>FAILED</b>") + "<br />");
	CB_Elements.appendContentById("content", "LZ Base 64 compression (Base64String) result: " + myDataStringCompressed_UTF16_base64_2 + "<br />");
	CB_Elements.appendContentById("content", "LZ Base 64 compression (Base64String) result length: " + myDataStringCompressed_UTF16_base64_2.length + "<br />");
	CB_Elements.appendContentById("content", "LZ Base 64 compression (Base64String) ratio: " + CB_numberFormat((myDataStringCompressed_UTF16_base64_2.length / myDataString.length - 1) * 100 * -1, 2, true) + "%<br /><br />");

	//Compressing and decompressing using base 64 and valid for URI components:
	var myDataStringCompressed_UTF16_base64_URIComponent = lz.compressToEncodedURIComponent(myDataString); //Compressed encoding in base 64 and encoded for URI components.
	var myDataStringDecompressed_5 = lz.decompressFromEncodedURIComponent(myDataStringCompressed_UTF16_base64_URIComponent); //Decompressed from data encoded in base 64 and encoded for URI components. Returns 'myDataString' again.
	CB_Elements.appendContentById("content", "LZ compression (valid URI components): " + (myDataStringDecompressed_5 === myDataString ? "CORRECT" : "<b>FAILED</b>") + "<br />");
	CB_Elements.appendContentById("content", "LZ compression result (valid URI components): " + myDataStringCompressed_UTF16_base64_URIComponent + "<br />");
	CB_Elements.appendContentById("content", "LZ compression result length (valid URI components): " + myDataStringCompressed_UTF16_base64_URIComponent.length + "<br />");
	CB_Elements.appendContentById("content", "LZ compression ratio (valid URI components): " + CB_numberFormat((myDataStringCompressed_UTF16_base64_URIComponent.length / myDataString.length - 1) * 100 * -1, 2, true) + "%<br /><br />");

	//Compressing and decompressing using 'uint8Array':
	var myDataStringCompressed_Uint8Array = lz.compressToUint8Array(myDataString); //Compressed in a 'uint8Array'.
	try //Prevents IE6 error.
	{
		var myDataStringDecompressed_6 = lz.decompressFromUint8Array(myDataStringCompressed_Uint8Array); //Decompressed from a 'uint8Array'. Returns 'myDataString' again.	
	} catch (E) { var myDataStringDecompressed_6 = ""; }
	CB_Elements.appendContentById("content", "LZ compression (uint8Array): " + (myDataStringDecompressed_6 === myDataString ? "CORRECT" : "<b>FAILED</b>") + "<br />");
	CB_Elements.appendContentById("content", "LZ compression result (uint8Array): " + myDataStringCompressed_Uint8Array + "<br />");
	CB_Elements.appendContentById("content", "LZ compression result length (uint8Array): " + myDataStringCompressed_Uint8Array.length + "<br />");
	CB_Elements.appendContentById("content", "LZ compression ratio (uint8Array): " + CB_numberFormat((myDataStringCompressed_Uint8Array.length / myDataString.length - 1) * 100 * -1, 2, true) + "%<br /><br />");

	//Calls itself again:
	setTimeout(processString, 1);
}