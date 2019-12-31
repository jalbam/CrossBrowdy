<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	Here is an example of some other data functions:
</p>
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Check whether a given string is an E-Mail:
	var email = "whoever_user@crossbrowdy.com";
	if (CB_isEmail(email)) { CB_console(email + " is a valid E-Mail address!"); }
	else { CB_console(email + " is not a valid E-Mail address!"); }
	
	//Tries to guess whether a given file path (absolute or relative) is a local address or not:
	var filePath = "file://watever"; //This will be considered local always.
	if (CB_isFileLocal(filePath)) { CB_console("The path is local!"); }
	else { CB_console("The path is remote (not local)!"); }
	var filePath_2 = "http://wherever/address,html"; //This will be considered not local (remote) always.
	if (CB_isFileLocal(filePath_2)) { CB_console("The path is local!"); }
	else { CB_console("The path is remote (not local)!"); }
	var filePath_3 = "/wherever/address.html"; //This will be considered local only if CrossBrowdy is running locally.
	if (CB_isFileLocal(filePath_3)) { CB_console("The path is local!"); }
	else { CB_console("The path is remote (not local)!"); }
	
	//Combines two kinds of elements (booleans, objects, arrays, strings, etc.) using 'CB_combineAutomatically':
	// 1) If both values are either undefined or null, returns null.
	// 2) If both values are boolean, returns the AND operation for the two of them (a && b).
	// 3) If either of the two is a string (not empty) and is not JSON valid, combines them as URL (GET) parameters using 'CB_combineURIParameters'.
	// 4) If either of them is JSON valid, combines them as JSON using 'CB_combineJSON' (passing the received "avoidDuplicatedValuesInArray" value as a parameter).
	// 5) Otherwise, combines them as arrays or objects using 'CB_combineArraysOrObjects' (passing the received "avoidDuplicatedValuesInArray" value as a parameter).
	var combination = CB_combineAutomatically(null, null); //Returns: null.
	var combination_2 = CB_combineAutomatically(undefined, undefined); //Returns: null.
	var combination_3 = CB_combineAutomatically(null, undefined); //Returns: null.
	var combination_4 = CB_combineAutomatically(undefined, null); //Returns: null.
	var combination_5 = CB_combineAutomatically(true, true); //Returns: true.
	var combination_6 = CB_combineAutomatically(true, false); //Returns: false.
	var combination_7 = CB_combineAutomatically(false, true); //Returns: false.
	var combination_8 = CB_combineAutomatically(false, false); //Returns: false.
	var combination_9 = CB_combineAutomatically("?p1=v1&amp;p2=v2", "?p2=v2_alt&amp;p3=v3"); //Returns: "p1=v1&amp;p2=v2&amp;p2=v2_alt&amp;p3=v3".
	var combination_10 = CB_combineAutomatically("?p2=v2_alt&amp;p3=v3", "?p1=v1&amp;p2=v2"); //Returns: "p2=v2_alt&amp;p3=v3&amp;p1=v1&amp;p2=v2".
	var combination_11 = CB_combineAutomatically("&amp;p1=v1&amp;p2=v2", "&amp;p2=v2_alt&amp;p3=v3"); //Returns: "p1=v1&amp;p2=v2&amp;p2=v2_alt&amp;p3=v3".
	var combination_12 = CB_combineAutomatically("&amp;p2=v2_alt&amp;p3=v3", "&amp;p1=v1&amp;p2=v2"); //Returns: "p2=v2_alt&amp;p3=v3&amp;p1=v1&amp;p2=v2".
	var combination_13 = CB_combineAutomatically("{ \"a\" : 123 }", "{ \"a\" : 987, \"b\" : \"xyz\" }"); //Returns: {a: 987, b: "xyz"}.
	var combination_14 = CB_combineAutomatically("{ \"a\" : 123 }", "{ \"a\" : 987, \"b\" : \"xyz\" }", true); //Returns: {a: 987, b: "xyz"}.
	var combination_15 = CB_combineAutomatically("{ \"a\" : 987, \"b\" : \"xyz\" }", "{ \"a\" : 123 }"); //Returns: {a: 123, b: "xyz"}.
	var combination_16 = CB_combineAutomatically("{ \"a\" : 987, \"b\" : \"xyz\" }", "{ \"a\" : 123 }", true); //Returns: {a: 123, b: "xyz"}.
	var combination_17 = CB_combineAutomatically(567, "{ \"a\" : 123 }"); //Returns: {a: 123}.
	var combination_18 = CB_combineAutomatically(567, "{ \"a\" : 123 }", true); //Returns: {a: 123}.
	var combination_19 = CB_combineAutomatically("{ \"a\" : 987, \"b\" : \"xyz\" }", 568); //Returns: {a: 987, b: "xyz"}.
	var combination_20 = CB_combineAutomatically("{ \"a\" : 987, \"b\" : \"xyz\" }", 568, true); //Returns: {a: 987, b: "xyz"}.
	var combination_21 = CB_combineAutomatically("hello", "{ \"a\" : 123 }"); //Returns: 'hello&amp;{ "a" : 123 }' (string).
	var combination_22 = CB_combineAutomatically("hello", "{ \"a\" : 123 }", true); //Returns: 'hello&amp;{ "a" : 123 }' (string).
	var combination_23 = CB_combineAutomatically("{ \"a\" : 987, \"b\" : \"xyz\" }", "hello"); //Returns: '{ "a" : 987, "b" : "xyz" }&amp;hello' (string).
	var combination_24 = CB_combineAutomatically("{ \"a\" : 987, \"b\" : \"xyz\" }", "hello", true); //Returns: '{ "a" : 987, "b" : "xyz" }&amp;hello' (string).
	var combination_25 = CB_combineAutomatically(false, "{ \"a\" : 123 }"); //Returns: {a: 123}.
	var combination_26 = CB_combineAutomatically(false, "{ \"a\" : 123 }", true); //Returns: {a: 123}.
	var combination_27 = CB_combineAutomatically("{ \"a\" : 987, \"b\" : \"xyz\" }", false); //Returns: {a: 987, b: "xyz"}.
	var combination_28 = CB_combineAutomatically("{ \"a\" : 987, \"b\" : \"xyz\" }", false, true); //Returns: {a: 987, b: "xyz"}.
	var combination_29 = CB_combineAutomatically(true, "{ \"a\" : 123 }"); //Returns: {a: 123}.
	var combination_30 = CB_combineAutomatically(true, "{ \"a\" : 123 }", true); //Returns: {a: 123}.
	var combination_31 = CB_combineAutomatically("{ \"a\" : 987, \"b\" : \"xyz\" }", true); //Returns: {a: 987, b: "xyz"}.
	var combination_32 = CB_combineAutomatically("{ \"a\" : 987, \"b\" : \"xyz\" }", true, true); //Returns: {a: 987, b: "xyz"}.
	var combination_33 = CB_combineAutomatically(null, "{ \"a\" : 123 }"); //Returns: {a: 123}.
	var combination_34 = CB_combineAutomatically(null, "{ \"a\" : 123 }", true); //Returns: {a: 123}.
	var combination_35 = CB_combineAutomatically("{ \"a\" : 987, \"b\" : \"xyz\" }", null); //Returns: {a: 987, b: "xyz"}.
	var combination_36 = CB_combineAutomatically("{ \"a\" : 987, \"b\" : \"xyz\" }", null, true); //Returns: {a: 987, b: "xyz"}.
	var combination_37 = CB_combineAutomatically(undefined, "{ \"a\" : 123 }"); //Returns: {a: 123}.
	var combination_38 = CB_combineAutomatically(undefined, "{ \"a\" : 123 }", true); //Returns: {a: 123}.
	var combination_39 = CB_combineAutomatically("{ \"a\" : 987, \"b\" : \"xyz\" }", undefined); //Returns: {a: 987, b: "xyz"}.
	var combination_40 = CB_combineAutomatically("{ \"a\" : 987, \"b\" : \"xyz\" }", undefined, true); //Returns: {a: 987, b: "xyz"}.
	var combination_41 = CB_combineAutomatically("{}", "{ \"a\" : 123 }"); //Returns: {a: 123}.
	var combination_42 = CB_combineAutomatically("{}", "{ \"a\" : 123 }", true); //Returns: {a: 123}.
	var combination_43 = CB_combineAutomatically("{ \"a\" : 987, \"b\" : \"xyz\" }", "{}"); //Returns: {a: 987, b: "xyz"}.
	var combination_44 = CB_combineAutomatically("{ \"a\" : 987, \"b\" : \"xyz\" }", "{}", true); //Returns: {a: 987, b: "xyz"}.
	var combination_45 = CB_combineAutomatically({}, "{ \"a\" : 123 }"); //Returns: {a: 123}.
	var combination_46 = CB_combineAutomatically({}, "{ \"a\" : 123 }", true); //Returns: {a: 123}.
	var combination_47 = CB_combineAutomatically("{ \"a\" : 987, \"b\" : \"xyz\" }", {}); //Returns: {a: 987, b: "xyz"}.
	var combination_48 = CB_combineAutomatically("{ \"a\" : 987, \"b\" : \"xyz\" }", {}, true); //Returns: {a: 987, b: "xyz"}.
	var combination_49 = CB_combineAutomatically({ a: 123 }, { a : 987, b: "xyz" }); //Returns: {a: 987, b: "xyz"}.
	var combination_50 = CB_combineAutomatically({ a: 123 }, { a : 987, b: "xyz" }, true); //Returns: {a: 987, b: "xyz"}.
	var combination_51 = CB_combineAutomatically({ a : 987, b: "xyz" }, { a: 123 }); //Returns: {a: 123, b: "xyz"}.
	var combination_52 = CB_combineAutomatically({ a : 987, b: "xyz" }, { a: 123 }, true); //Returns: {a: 123, b: "xyz"}.
	var combination_53 = CB_combineAutomatically("hello", { a: 123 }); //Returns: 'hello&amp;{"a":123}' (string).
	var combination_54 = CB_combineAutomatically("hello", { a: 123 }, true); //Returns: 'hello&amp;{"a":123}' (string).
	var combination_55 = CB_combineAutomatically({ a: 123 }, "hello"); //Returns: '{"a":123}&amp;hello' (string).
	var combination_56 = CB_combineAutomatically({ a: 123 }, "hello", true); //Returns: '{"a":123}&amp;hello' (string).
	var combination_57 = CB_combineAutomatically(false, { a: 123 }); //Returns: {a: 123}.
	var combination_58 = CB_combineAutomatically(false, { a: 123 }, true); //Returns: {a: 123}.
	var combination_59 = CB_combineAutomatically({ a: 123 }, false); //Returns: {a: 123}.
	var combination_60 = CB_combineAutomatically({ a: 123 }, false, true); //Returns: {a: 123}.
	var combination_61 = CB_combineAutomatically(true, { a: 123 }); //Returns: {a: 123}.
	var combination_62 = CB_combineAutomatically(true, { a: 123 }, true); //Returns: {a: 123}.
	var combination_63 = CB_combineAutomatically({ a: 123 }, true); //Returns: {a: 123}.
	var combination_64 = CB_combineAutomatically({ a: 123 }, true, true); //Returns: {a: 123}.
	var combination_65 = CB_combineAutomatically(null, { a: 123 }); //Returns: {a: 123}.
	var combination_66 = CB_combineAutomatically(null, { a: 123 }, true); //Returns: {a: 123}.
	var combination_67 = CB_combineAutomatically({ a: 123 }, null); //Returns: {a: 123}.
	var combination_68 = CB_combineAutomatically({ a: 123 }, null, true); //Returns: {a: 123}.
	var combination_69 = CB_combineAutomatically(undefined, { a: 123 }); //Returns: {a: 123}.
	var combination_70 = CB_combineAutomatically(undefined, { a: 123 }, true); //Returns: {a: 123}.
	var combination_71 = CB_combineAutomatically({ a: 123 }, undefined); //Returns: {a: 123}.
	var combination_72 = CB_combineAutomatically({ a: 123 }, undefined, true); //Returns: {a: 123}.
	var combination_73 = CB_combineAutomatically([ "a", "b" ], { "0": 12, a: 123 }); //Returns: {0: 12, 1: "b", a: 123}.
	var combination_74 = CB_combineAutomatically([ "a", "b" ], { "0": 12, a: 123 }, true); //Returns: {0: 12, 1: "b", a: 123}.
	var combination_75 = CB_combineAutomatically([ "a", "b" ], { 0: 12, a: 123 }); //Returns: {0: 12, 1: "b", a: 123}.
	var combination_76 = CB_combineAutomatically([ "a", "b" ], { 0: 12, a: 123 }, true); //Returns: {0: 12, 1: "b", a: 123}.
	var combination_77 = CB_combineAutomatically({ "0": 12, a: 123 }, [ "a", "b" ]); //Returns: {0: "a", 1: "b", a: 123}.
	var combination_78 = CB_combineAutomatically({ "0": 12, a: 123 }, [ "a", "b" ], true); //Returns: {0: "a", 1: "b", a: 123}.
	var combination_79 = CB_combineAutomatically({ 0: 12, a: 123 }, [ "a", "b" ]); //Returns: {0: "a", 1: "b", a: 123}.
	var combination_80 = CB_combineAutomatically({ 0: 12, a: 123 }, [ "a", "b" ], true); //Returns: {0: "a", 1: "b", a: 123}.
	var combination_81 = CB_combineAutomatically([ "a", "b" ], [ "a", "b", "c" ]); //Returns: ["a", "b", "a", "b", "c"].
	var combination_82 = CB_combineAutomatically([ "a", "b" ], [ "a", "b", "c" ], true); //Returns: ["a", "b", "c"].
	var combination_83 = CB_combineAutomatically([ "a", "b", "c" ], [ "a", "b" ]); //Returns: ["a", "b", "c", "a", "b"].
	var combination_84 = CB_combineAutomatically([ "a", "b", "c" ], [ "a", "b" ], true); //Returns: ["a", "b", "c"].
</code></pre>

<p>
	Check the <a href="_html/_doc/api/index.html" target="_blank">API documentation</a> to read more about some <a href="_html/_doc/api/global.html" target="_blank">global functions and variables</a>.
</p>