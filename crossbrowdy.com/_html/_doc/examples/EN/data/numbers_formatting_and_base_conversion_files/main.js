CB_init(main); //It will call the "main" function when ready.


//This function will be called when CrossBrowdy is ready:
function main()
{
	//Process the number at the beginning:
	processNumber();
}


//Checks and processes the number introduced:
var numLast = null;
function processNumber()
{
	//If the number introduced has not changed, exits (calling itself again soon):
	var numIntroduced = CB_Elements.get("number").value;
	if (numIntroduced == numLast)
	{
		//Calls itself again and exits:
		setTimeout(processNumber, 1);
		return;
	}
	
	//Stores the current number introduced as the last number checked:
	numLast = numLast;

	//Gets the number:
	var num = parseFloat(CB_Elements.get("number").value) || 0;
	var numInteger = parseInt(num);
	CB_Elements.insertContentById("num", num);
	CB_Elements.insertContentById("num_integer", numInteger);
	CB_Elements.insertContentById("num_length", (num + "").length);
	
	//Number formatting:
	CB_Elements.insertContentById("two_decimals", CB_numberFormat(num, 2));
	CB_Elements.insertContentById("two_decimals_string", CB_numberFormat(num, 2, true));
	CB_Elements.insertContentById("six_decimals", CB_numberFormat(num, 6));
	CB_Elements.insertContentById("six_decimals_string", CB_numberFormat(num, 6, true));

	//Converting an integer into a desired base (string result) with 'CB_intToBase':
	var baseABCSymbols = ["A", "B", "C"];
	var baseABCMinusSymbols = "@*";
	var baseABCPrefix = "!x";
	CB_Elements.insertContentById("base_abc", num_baseABC = CB_intToBase(num, baseABCSymbols)); //Returns the number in base ABC with our own symbols.
	CB_Elements.appendContentById("base_abc", " [length: " + num_baseABC.length + "]");
	CB_Elements.insertContentById("base_abc_minus", num_baseABCMinus = CB_intToBase(num, baseABCSymbols, false, baseABCMinusSymbols)); //Returns the number in base ABC with our own symbols, using desired minus symbols.
	CB_Elements.appendContentById("base_abc_minux", " [length: " + num_baseABCMinus.length + "]");
	CB_Elements.insertContentById("base_abc_minus_prefix", num_baseABCMinusPrefix = CB_intToBase(num, baseABCSymbols, false, baseABCMinusSymbols, baseABCPrefix)); //Returns the number in base ABC with our own symbols, using desired minus symbols and prefix.
	CB_Elements.appendContentById("base_abc_minus_prefix", " [length: " + num_baseABCMinusPrefix.length + "]");
	CB_Elements.insertContentById("base_2", num_base2NoPrefix = CB_intToBase(num, 2)); //Returns the number in base 2 (binary) without prefix (string).
	CB_Elements.appendContentById("base_2", " [length: " + num_base2NoPrefix.length + "]");
	CB_Elements.insertContentById("base_2_prefix", num_base2 = CB_intToBase(num, 2, false, '-', "0b")); //Returns the number in base 2 (binary), with '0b' prefix (string).
	CB_Elements.appendContentById("base_2_prefix", " [length: " + num_base2.length + "]");
	CB_Elements.insertContentById("base_8", num_base8NoPrefix = CB_intToBase(num, 8, false, '-', '')); //Returns the number in base 8 (octal) without prefix (string).
	CB_Elements.appendContentById("base_8", " [length: " + num_base8NoPrefix.length + "]");
	CB_Elements.insertContentById("base_8_prefix", num_base8 = CB_intToBase(num, 8)); //Returns the number in base 8 (octal), with '0' prefix (string).
	CB_Elements.appendContentById("base_8_prefix", " [length: " + num_base8.length + "]");
	CB_Elements.insertContentById("base_16", num_base16NoPrefix = CB_intToBase(num, 16, false, '-', '')); //Returns the number in base 16 (hexadecimal) without prefix (string).
	CB_Elements.appendContentById("base_16", " [length: " + num_base16NoPrefix.length + "]");
	CB_Elements.insertContentById("base_16_prefix", num_base16 = CB_intToBase(num, 16)); //Returns the number in base 16 (hexadecimal), with '0x' prefix (string).
	CB_Elements.appendContentById("base_16_prefix", " [length: " + num_base16.length + "]");
	CB_Elements.insertContentById("base_64", num_base64 = CB_intToBase(num, 64)); //Returns the number in base 64 (string).
	CB_Elements.appendContentById("base_64", " [length: " + num_base64.length + "]");
	CB_Elements.insertContentById("base_66", num_base66 = CB_intToBase(num, 66)); //Returns the number in base 66 (string).
	CB_Elements.appendContentById("base_66", " [length: " + num_base66.length + "]");
	CB_Elements.insertContentById("base_71", num_base71 = CB_intToBase(num, 71)); //Returns the number in base 71 (string).
	CB_Elements.appendContentById("base_71", " [length: " + num_base71.length + "]");
	CB_Elements.insertContentById("base_87", num_base87 = CB_intToBase(num, 87)); //Returns the number in base 87 (string).
	CB_Elements.appendContentById("base_87", " [length: " + num_base87.length + "]");
	CB_Elements.insertContentById("base_88", num_base88 = CB_intToBase(num, 88)); //Returns the number in base 88 (string).
	CB_Elements.appendContentById("base_88", " [length: " + num_base88.length + "]");
	CB_Elements.insertContentById("base_128", num_base128 = CB_intToBase(num, 128)); //Returns the number in base 128 (string).
	CB_Elements.appendContentById("base_128", " [length: " + num_base128.length + "]");
	CB_Elements.insertContentById("base_256", num_base256 = CB_intToBase(num, 256)); //Returns the number in base 256 (string).
	CB_Elements.appendContentById("base_256", " [length: " + num_base256.length + "]");
	CB_Elements.insertContentById("base_512", num_base512 = CB_intToBase(num, 512)); //Returns the number in base 512 (string).
	CB_Elements.appendContentById("base_512", " [length: " + num_base512.length + "]");
	CB_Elements.insertContentById("base_1024", num_base1024 = CB_intToBase(num, 1024)); //Returns the number in base 1024 (string).
	CB_Elements.appendContentById("base_1024", " [length: " + num_base1024.length + "]");
	CB_Elements.insertContentById("base_2048", num_base2048 = CB_intToBase(num, 2048)); //Returns the number in base 2048 (string).
	CB_Elements.appendContentById("base_2048", " [length: " + num_base2048.length + "]");
	CB_Elements.insertContentById("base_4096", num_base4096 = CB_intToBase(num, 4096)); //Returns the number in base 4096 (string).
	CB_Elements.appendContentById("base_4096", " [length: " + num_base4096.length + "]");

	//Converting a number in a specific base (as string) into a decimal integer with 'CB_baseToInt' (all will return the same integer number):
	var numInteger = parseInt(num);
	CB_Elements.insertContentById("base_abc_to_decimal", num_fromBaseABC = CB_baseToInt(num_baseABC, baseABCSymbols, false));
	CB_Elements.appendContentById("base_abc_to_decimal", " [correct conversion: " + ((num_fromBaseABC === numInteger) ? "Yes" : "<b>No</b>") + "]");
	CB_Elements.insertContentById("base_abc_minus_to_decimal", num_fromBaseABC = CB_baseToInt(num_baseABCMinus, baseABCSymbols, false, baseABCMinusSymbols));
	CB_Elements.appendContentById("base_abc_minus_to_decimal", " [correct conversion: " + ((num_fromBaseABC === numInteger) ? "Yes" : "<b>No</b>") + "]");
	CB_Elements.insertContentById("base_abc_minus_prefix_to_decimal", num_fromBaseABC = CB_baseToInt(num_baseABCMinusPrefix, baseABCSymbols, false, baseABCMinusSymbols, baseABCPrefix));
	CB_Elements.appendContentById("base_abc_minus_prefix_to_decimal", " [correct conversion: " + ((num_fromBaseABC === numInteger) ? "Yes" : "<b>No</b>") + "]");
	CB_Elements.insertContentById("base_2_to_decimal",  num_fromBase2NoPrefix = CB_baseToInt(num_base2NoPrefix, 2));
	CB_Elements.appendContentById("base_2_to_decimal", " [correct conversion: " + ((num_fromBase2NoPrefix === numInteger) ? "Yes" : "<b>No</b>") + "]");
	CB_Elements.insertContentById("base_2_prefix_to_decimal",  num_fromBase2 = CB_baseToInt(num_base2, 2));
	CB_Elements.appendContentById("base_2_prefix_to_decimal", " [correct conversion: " + ((num_fromBase2 === numInteger) ? "Yes" : "<b>No</b>") + "]");
	CB_Elements.insertContentById("base_8_to_decimal",  num_fromBase8NoPrefix = CB_baseToInt(num_base8NoPrefix, 8));
	CB_Elements.appendContentById("base_8_to_decimal", " [correct conversion: " + ((num_fromBase8NoPrefix === numInteger) ? "Yes" : "<b>No</b>") + "]");
	CB_Elements.insertContentById("base_8_prefix_to_decimal",  num_fromBase8 = CB_baseToInt(num_base8, 8));
	CB_Elements.appendContentById("base_8_prefix_to_decimal", " [correct conversion: " + ((num_fromBase8 === numInteger) ? "Yes" : "<b>No</b>") + "]");
	CB_Elements.insertContentById("base_16_to_decimal",  num_fromBase16NoPrefix = CB_baseToInt(num_base16NoPrefix, 16));
	CB_Elements.appendContentById("base_16_to_decimal", " [correct conversion: " + ((num_fromBase16NoPrefix === numInteger) ? "Yes" : "<b>No</b>") + "]");
	CB_Elements.insertContentById("base_16_prefix_to_decimal",  num_fromBase16 = CB_baseToInt(num_base16, 16));
	CB_Elements.appendContentById("base_16_prefix_to_decimal", " [correct conversion: " + ((num_fromBase16 === numInteger) ? "Yes" : "<b>No</b>") + "]");
	CB_Elements.insertContentById("base_64_to_decimal", num_fromBase64 = CB_baseToInt(num_base64, 64));
	CB_Elements.appendContentById("base_64_to_decimal", " [correct conversion: " + ((num_fromBase64 === numInteger) ? "Yes" : "<b>No</b>") + "]");
	CB_Elements.insertContentById("base_66_to_decimal", num_fromBase66 = CB_baseToInt(num_base66, 66));
	CB_Elements.appendContentById("base_66_to_decimal", " [correct conversion: " + ((num_fromBase66 === numInteger) ? "Yes" : "<b>No</b>") + "]");
	CB_Elements.insertContentById("base_71_to_decimal", num_fromBase71 = CB_baseToInt(num_base71, 71));
	CB_Elements.appendContentById("base_71_to_decimal", " [correct conversion: " + ((num_fromBase71 === numInteger) ? "Yes" : "<b>No</b>") + "]");
	CB_Elements.insertContentById("base_87_to_decimal", num_fromBase87 = CB_baseToInt(num_base87, 87));
	CB_Elements.appendContentById("base_87_to_decimal", " [correct conversion: " + ((num_fromBase87 === numInteger) ? "Yes" : "<b>No</b>") + "]");
	CB_Elements.insertContentById("base_88_to_decimal", num_fromBase88 = CB_baseToInt(num_base88, 88));
	CB_Elements.appendContentById("base_88_to_decimal", " [correct conversion: " + ((num_fromBase88 === numInteger) ? "Yes" : "<b>No</b>") + "]");
	CB_Elements.insertContentById("base_128_to_decimal", num_fromBase128 = CB_baseToInt(num_base128, 128));
	CB_Elements.appendContentById("base_128_to_decimal", " [correct conversion: " + ((num_fromBase128 === numInteger) ? "Yes" : "<b>No</b>") + "]");
	CB_Elements.insertContentById("base_256_to_decimal", num_fromBase256 = CB_baseToInt(num_base256, 256));
	CB_Elements.appendContentById("base_256_to_decimal", " [correct conversion: " + ((num_fromBase256 === numInteger) ? "Yes" : "<b>No</b>") + "]");
	CB_Elements.insertContentById("base_512_to_decimal", num_fromBase512 = CB_baseToInt(num_base512, 512));
	CB_Elements.appendContentById("base_512_to_decimal", " [correct conversion: " + ((num_fromBase512 === numInteger) ? "Yes" : "<b>No</b>") + "]");
	CB_Elements.insertContentById("base_1024_to_decimal", num_fromBase1024 = CB_baseToInt(num_base1024, 1024));
	CB_Elements.appendContentById("base_1024_to_decimal", " [correct conversion: " + ((num_fromBase1024 === numInteger) ? "Yes" : "<b>No</b>") + "]");
	CB_Elements.insertContentById("base_2048_to_decimal", num_fromBase2048 = CB_baseToInt(num_base2048, 2048));
	CB_Elements.appendContentById("base_2048_to_decimal", " [correct conversion: " + ((num_fromBase2048 === numInteger) ? "Yes" : "<b>No</b>") + "]");
	CB_Elements.insertContentById("base_4096_to_decimal", num_fromBase4096 = CB_baseToInt(num_base4096, 4096));
	CB_Elements.appendContentById("base_4096_to_decimal", " [correct conversion: " + ((num_fromBase4096 === numInteger) ? "Yes" : "<b>No</b>") + "]");

	//Converting a float number into a specific base and vice versa:
	var numDecimals = CB_numberOfDecimals(num);
	var numWithoutDecimals = num * Math.pow(10, numDecimals); //Returns the number without the decimal symbol.
	CB_Elements.insertContentById("num_decimals", numDecimals);
	CB_Elements.insertContentById("num_no_decimals", numWithoutDecimals);
	CB_Elements.insertContentById("base_4096_no_decimals", num_base4096NoDecimals = CB_intToBase(numWithoutDecimals, CB_baseSymbols.get(4096))); //Returns 'numWithoutDecimals' in base 4096.
	CB_Elements.appendContentById("base_4096_no_decimals", " [length: " + num_base4096NoDecimals.length + "]");
	CB_Elements.insertContentById("base_4096_no_decimals_to_decimal", numWithoutDecimals_fromBase4096 = CB_baseToInt(num_base4096NoDecimals, CB_baseSymbols.get(4096))); //Returns 'numWithoutDecimals' again.
	var numFloat = numWithoutDecimals_fromBase4096 / Math.pow(10, numDecimals); //Returns 'num' again.
	CB_Elements.appendContentById("base_4096_no_decimals_to_decimal", " [correct conversion: " + ((numFloat === num) ? "Yes" : "<b>No</b>") + "]");
	
	//Calls itself again:
	setTimeout(processNumber, 1);
}