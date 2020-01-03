<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	Here is an example of numbers management (including formatting and base conversions):
</p>
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Number formatting:
	var num_1 = 123;
	var num_1_a = CB_numberFormat(num_1, 2); //Returns 123 (number).
	var num_1_b = CB_numberFormat(num_1, 2, true); //Returns '123.00' (string).
	var num_2 = 123.45;
	var num_2_a = CB_numberFormat(num_2, 2); //Returns 123.45 (number).
	var num_2_b = CB_numberFormat(num_2, 2, true); //Returns '123.45' (string).
	var num_3 = 123.456;
	var num_3_a = CB_numberFormat(num_3, 2); //Returns 123.46 (number).
	var num_3_b = CB_numberFormat(num_3, 2, true); //Returns '123.46' (string).
	var num_4 = 123.123;
	var num_4_a = CB_numberFormat(num_4, 2); //Returns 123.12 (number).
	var num_4_b = CB_numberFormat(num_4, 2, true); //Returns '123.12' (string).
	var num_5 = 567.89;
	var num_5_a = CB_numberFormat(num_5, 10); //Returns 567.89 (number).
	var num_5_b = CB_numberFormat(num_5, 2, true); //Returns '567.8900000000' (string).
	
	//Gets the number of decimals from a number (same as 'CB_countDecimalPart', 'CB_countDecimalDigits', 'CB_numberOfDecimals' and 'CB_numberOfDecimalDigits'):
	var numberOfDecimals = CB_countDecimals(12345.678); //Returns 3.
	var numberOfDecimals_2 = CB_countDecimals("1e-13"); //It also works for exponential notation (1e-13' would be 0.0000000000001). Returns: 13.
	
	//Gets the number of integer digits (the number of digits that belong to the integer part) from a number (same as 'CB_countIntegerDigits' and 'CB_numberOfIntegerDigits'):
	var numberOfIntegerDigits = CB_countIntegerPart(12345.678); //Returns 5.
	var numberOfIntegerDigits_2 = CB_countIntegerPart("1e-13"); //It also works for exponential notation (1e-13' would be 0.0000000000001). Returns: 0.
	var numberOfIntegerDigits_3 = CB_countIntegerPart(999999999999999999999999999); //Returns: 27.
	
	//Converting an integer into a desired base (string result) with 'CB_intToBase':
	var num = -1234567890123456; //Digits: 16.
	var num_base2 = CB_intToBase(num, 2, false, '-', "0b"); //Returns the number in base 2 (binary), with '0b' prefix (string, length/digits: 54).
	var num_base2NoPrefix = CB_intToBase(num, 2); //Returns the number in base 2 (binary) without prefix (string, length/digits: 52).
	var num_base8 = CB_intToBase(num, 8); //Returns the number in base 8 (octal), with '0' prefix (string, length/digits: 19).
	var num_base8NoPrefix = CB_intToBase(num, 8, false, '-', ''); //Returns the number in base 8 (octal) without prefix (string, length/digits: 18).
	var num_base16 = CB_intToBase(num, 16); //Returns the number in base 16 (hexadecimal), with '0x' prefix (string, length/digits: 16).
	var num_base16NoPrefix = CB_intToBase(num, 16, false, '-', ''); //Returns the number in base 16 (hexadecimal) without prefix (string, length/digits: 14).
	var num_base64 = CB_intToBase(num, 64); //Returns the number in base 64 (string, length/digits: 10).
	var num_base66 = CB_intToBase(num, 66); //Returns the number in base 66 (string, length/digits: 10).
	var num_base71 = CB_intToBase(num, 71); //Returns the number in base 71 (string, length/digits: 10).
	var num_base87 = CB_intToBase(num, 87); //Returns the number in base 87 (string, length/digits: 9).
	var num_base88 = CB_intToBase(num, 88); //Returns the number in base 88 (string, length/digits: 9).
	var num_base128 = CB_intToBase(num, 128); //Returns the number in base 128 (string, length/digits: 9).
	var num_base256 = CB_intToBase(num, 256); //Returns the number in base 256 (string, length/digits: 8).
	var num_base512 = CB_intToBase(num, 512); //Returns the number in base 512 (string, length/digits: 7).
	var num_base1024 = CB_intToBase(num, 1024); //Returns the number in base 1024 (string, length/digits: 7).
	var num_base2048 = CB_intToBase(num, 2048); //Returns the number in base 2048 (string, length/digits: 6).
	var num_base4096 = CB_intToBase(num, 4096); //Returns the number in base 4096 (string, length/digits: 6).
	
	//Converting a number in a specific base (as string) into a decimal integer with 'CB_baseToInt' (all will return the same integer number: 1234567890123456):
	var num_fromBase2 = CB_baseToInt(num_base2, 2);
	var num_fromBase2NoPrefix = CB_baseToInt(num_base2NoPrefix, 2);
	var num_fromBase8 = CB_baseToInt(num_base8, 8);
	var num_fromBase8NoPrefix = CB_baseToInt(num_base8NoPrefix, 8);
	var num_fromBase16 = CB_baseToInt(num_base16, 16);
	var num_fromBase16NoPrefix = CB_baseToInt(num_base16NoPrefix, 16);
	var num_fromBase64 = CB_baseToInt(num_base64, 64);
	var num_fromBase66 = CB_baseToInt(num_base66, 66);
	var num_fromBase71 = CB_baseToInt(num_base71, 71);
	var num_fromBase87 = CB_baseToInt(num_base87, 87);
	var num_fromBase88 = CB_baseToInt(num_base88, 88);
	var num_fromBase128 = CB_baseToInt(num_base128, 128);
	var num_fromBase256 = CB_baseToInt(num_base256, 256);
	var num_fromBase512 = CB_baseToInt(num_base512, 512);
	var num_fromBase1024 = CB_baseToInt(num_base1024, 1024);
	var num_fromBase2048 = CB_baseToInt(num_base2048, 2048);
	var num_fromBase4096 = CB_baseToInt(num_base4096, 4096);

	//It is also possible to do conversions treating the numbers as unsigned (absolute values):
	var num = -789;
	var num_base16_unsigned = CB_intToBase(num, 16, true); //Returns 'num' in base 16, unsigned.
	var num_fromBase16_unsigned = CB_baseToInt(num_base16_unsigned, 16, true); //Returns 'num' again but unsigned (789).
	
	//An array with the symbols used by the different bases can be gotten this way ('CB_baseSymbols.get' uses a cache):
	var symbolsBase64 = CB_baseSymbols.get(64);
	var symbolsBase256 = CB_baseSymbols.get(); //With no parameter, default is 256.
	var symbolsBase4096 = CB_baseSymbols.get(4096);
	var symbolsBase9999 = CB_baseSymbols.get(9999);

	//It is also possible to use a base with our own symbols:
	var num = 1234567890;
	var baseXSymbols = ["A", "B", "C"];
	var num_baseX = CB_intToBase(num, baseXSymbols); //Returns 'num' in base 3 with our own symbols.
	var num_fromBaseX = CB_baseToInt(num_baseX, baseXSymbols); //Returns 'num' again.
	
	//We can define which is the minus symbol (the symbol which marks a number as negative, as '-' normally):
	var num = -123;
	var num_baseX_2 = CB_intToBase(num, baseXSymbols, false, "@"); //Returns 'num' in base 3 with our own symbols and '@' in the beginning as it is negative.
	var num_fromBaseX_2 = CB_baseToInt(num_baseX_2, baseXSymbols, false, "@"); //Returns 'num' again.

	//We can define a prefix (a string that is in the beginning of the number to mark its type, as '0x' for hexadecimal or '0' for octal):
	var num = -312;
	var num_baseX_2 = CB_intToBase(num, baseXSymbols, false, "@", "!x"); //Returns 'num' in base 3 with our own symbols and '@' in the beginning as it is negative and then the "!x" prefix.
	var num_fromBaseX_2 = CB_baseToInt(num_baseX_2, baseXSymbols, false, "@", "!x"); //Returns 'num' again.

	//It is also possible to convert from one base to another one (with 'CB_baseToBase'):
	var num = "@*[PRE]MY_NUM!"; //Number.
	var num_base = 71; //Base used by 'num'.
	var num_minusSymbols = "@*"; //Minus symbols used by 'num'.
	var num_prefix = "[PRE]"; //Prefix used by 'num'.
	var num_base64 = CB_baseToBase(num, num_base, 64, false, num_minusSymbols, '%', num_prefix, "~"); //Returns 'num' in base 64 with "%" as minus symbol and "~" prefix.
	var num_2 = CB_baseToBase(num_base64, 64, num_base, false, '%', num_minusSymbols, "~", num_prefix); //Returns 'num' again.
	
	//Converting a float number into a specific base and vice versa:
	var numFloat = 123.45678;
	var numFloatDecimals = CB_numberOfDecimals(numFloat); //Returns the number of decimals (5).
	var num = numFloat * Math.pow(10, numFloatDecimals); //Returns the number without the decimal symbol (12345678).
	var num_base4096 = CB_intToBase(num, CB_baseSymbols.get(4096)); //Returns 'num' in base 4096.
	var num_fromBase4096 = CB_baseToInt(num_base4096, CB_baseSymbols.get(4096)); //Returns 'num' again.
	var numFloat_2 = num_fromBase4096 / Math.pow(10, numFloatDecimals); //Returns 'numFloat' again.
</code></pre>

<p>
	When using different bases it is important to have into account the following:
	<ul>
		<li>
			The symbols used by the <b>base 64</b> will not be encoded neither by the <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/escape" target="_blank">escape</a> function nor by the <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent" target="_blank">encodeURIComponent</a> function (<b>recommended for URI components for any client, JavaScript strings or HTML code in the case that we do not want to use base 66</b>). Includes all symbols from lower bases, respecting the same order (which is their value).
		</li>
		<li>
			The symbols used by the <b>base 66</b> will not be encoded neither by the <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/escape" target="_blank">escape</a> function nor by the <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent" target="_blank">encodeURIComponent</a> function (<b>recommended for URI components for any client, JavaScript strings or HTML code</b>). Includes all symbols from lower bases, respecting the same order (which is their value).
		</li>
		<li>
			The symbols used by the <b>base 71</b> will be encoded by the <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/escape" target="_blank">escape</a> function but not by the <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent" target="_blank">encodeURIComponent</a> function (<b>not recommended for URI components in old clients, but useful for URI components in new clients with <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent" target="_blank">encodeURIComponent</a> function support, for JavaScript strings or HTML code</b>). Includes all symbols from lower bases, respecting the same order (which is their value).
		</li>
		<li>
			The symbols used by the <b>base 87</b> will be encoded by the <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/escape" target="_blank">escape</a> function and also by the <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent" target="_blank">encodeURIComponent</a> function but they will not need to be encoded neither in JavaScript strings nor in HTML (<b>not recommended for URI components, but useful for JavaScript strings or HTML code</b>). Includes all symbols from lower bases, respecting the same order (which is their value).
		</li>	
		<li>
			The symbols used by the <b>base 88</b> will be encoded by the <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/escape" target="_blank">escape</a> function and also by the <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent" target="_blank">encodeURIComponent</a> function, but they will not need to be encoded in HTML (<b>not recommended for URI components or JavaScript strings, but useful for HTML code</b>).
		</li>
		<li>
			The symbols used by <b>base 128 and higher</b> will be encoded by the <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/escape" target="_blank">escape</a> function and also by the <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent" target="_blank">encodeURIComponent</a> function and they will need to be encoded in HTML (<b>not recommended for URI components or JavaScript strings or HTML code</b>).
		</li>
	 </ul>
</p>

<p>
	Check the <a href="api/index.html" target="_blank">API documentation</a> to read more about the <a href="api/CB_baseSymbols.html" target="_blank">CB_baseSymbols</a> static class and some <a href="api/global.html" target="_blank">global functions and variables</a>.
</p>