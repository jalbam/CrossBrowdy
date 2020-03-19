/* This file belongs to a CrossBrowdy.com example, made by Joan Alba Maldonado. Creative Commons Attribution 4.0 International License. */

/*
	Symbols meaning:
		" " (space)	=> Blank space. It will be filled randomly with non-walkable and non-buildable symbols (just decoration).
		"@"			=> Destiny (there can only be one). Enemies will want to reach this target.
		NOTE: Check symbols below ('_LEVELS_SYMBOLS' object) to see the rest.
*/


var _LEVELS_SYMBOLS =
{
	//Symbols for walkable path:
	//NOTE: the ones attached to the borders will allow enemies to appear from there.
	"walkable":
	[
		"$",	//Soil.
		"%"		//Water.
	],
	
	//Symbols for non-walkable and buildable tiles:
	"unwalkable_buildable":
	[
		"!",	//Soil.
		"="		//Water.
	],
	
	//Symbols for non-walkable and non-buildable tiles (decoration):
	"unwalkable_unbuildable":
	[
		"?",	//Soil.
		"_"		//Water.
	]
};


//Levels array:
var _LEVELS =
[
	//Level 0:
	[
		"$$$$$$$$$$$$$$$$$$$$$$$$$$$$$@".split("")
	],


	//Level 1:
	[
		"$".split(""),
		"$".split(""),
		"$".split(""),
		"$".split(""),
		"$".split(""),
		"$".split(""),
		"$".split(""),
		"$".split(""),
		"$".split(""),
		"$".split(""),
		"$".split(""),
		"$".split(""),
		"$".split(""),
		"$".split(""),
		"$".split(""),
		"@".split(""),
		"$".split(""),
		"$".split(""),
		"$".split(""),
		"$".split(""),
		"$".split(""),
		"$".split(""),
		"$".split(""),
		"$".split(""),
		"$".split(""),
		"$".split(""),
		"$".split(""),
		"$".split(""),
		"$".split(""),
		"$".split(""),
		"$".split("")
	],


	//Level 2:
	[
		"############  ".split(""),
		"#--  #     ###".split(""),
		"#--  # $  $  #".split(""),
		"#--  #$####  #".split(""),
		"#--    @ ##  #".split(""),
		"#--  # #  $ ##".split(""),
		"###### ##$ $ #".split(""),
		"  # $  $ $ $ #".split(""),
		"  #    #     #".split(""),
		"  ############".split("")
	],
	
	//Level 3:
	[
		"##   #   #  ##".split(""),
		"#            #".split(""),
		"##### $@$ ####".split(""),
		"-   ##$$$##  -".split(""),
		"#        #   #".split(""),
		"--   #      --".split(""),
		"--  ##$$$ # --".split(""),
		"##### $ $ ####".split(""),
		"##            ".split(""),
		"###   #  #  ##".split("")
	],
	
	//Level 4:
	[
		"        ######## ".split(""),
		"        #     @# ".split(""),
		"        # $#$ ## ".split(""),
		"        # $  $#  ".split(""),
		"        ##$ $ #  ".split(""),
		"######### $ # ###".split(""),
		"#----  ## $  $  #".split(""),
		"##---    $  $   #".split(""),
		"#----  ##########".split(""),
		"########         ".split("")
	],
	
	//Level 5:
	[
		"# # # #     # # #".split(""),
		"   $      #      ".split(""),
		"#        $  -   #".split(""),
		" $ $ $ $  #$ # $ ".split(""),
		" # # # # #-      ".split(""),
		"  -   -   $# #-#-".split(""),
		"# $ $  #$#- $ $ $".split(""),
		" - -  -       -  ".split(""),
		"   #$#$#  $      ".split(""),
		"#- - -  #-#-#-#*#".split("")
	],
	
	//Level 6:
	[
		"           ########".split(""),
		"           #  ----#".split(""),
		"############  ----#".split(""),
		"#    #  $ $   ----#".split(""),
		"# $$$#$  $ #  ----#".split(""),
		"#  $     $ #  ----#".split(""),
		"# $$ #$ $ $########".split(""),
		"#  $ #     #       ".split(""),
		"## #########       ".split(""),
		"#    #    ##       ".split(""),
		"#     $   ##       ".split(""),
		"#  $$#$$  @#       ".split(""),
		"#    #    ##       ".split(""),
		"###########        ".split("")
	],
	
	//Level 7:
	[
		"#  ####  #### #### ".split(""),
		"####--####--###--##".split(""),
		"*                  ".split(""),
		"#  #  #  #  # #  ##".split(""),
		"#  #  #  #  # #   #".split(""),
		"#     #          ##".split(""),
		"#  #   #  #  #$$$ #".split(""),
		"#     $     #  #  #".split(""),
		"##### $   ###  #  #".split(""),
		"#    $$$ $  #  $$$#".split(""),
		"##  # #  #  #  #  #".split(""),
		"      #  #     #   ".split(""),
		" ####-####--####--#".split(""),
		"##  ###  ####  ####".split("")
	],
	
	//Level 8:
	[
		"        #####    ".split(""),
		"        #   #####".split(""),
		"        # #$##  #".split(""),
		"        #     $ #".split(""),
		"######### ###   #".split(""),
		"#----  ## $  $###".split(""),
		"#----    $ $$ ## ".split(""),
		"#----  ##$  $ @# ".split(""),
		"#########  $  ## ".split(""),
		"        # $ $  # ".split(""),
		"        ### ## # ".split(""),
		"          #    # ".split(""),
		"          ###### ".split("")
	],
	
	//Level 9:
	[
		"################ ".split(""),
		" * #-            ".split(""),
		"  ##$#########   ".split(""),
		"#             # #".split(""),
		"#  # #######  # #".split(""),
		"# $       - $ #$#".split(""),
		"# #  ###### # # #".split(""),
		"# # #  $ -  #   #".split(""),
		"###  # ####$  # #".split(""),
		"# #           # #".split(""),
		"#  ##########-#  ".split(""),
		"#--         $-$  ".split(""),
		" ############### ".split("")
	],
		
	//Level 10:
	[
		"######  ### ".split(""),
		"#--  # ##@##".split(""),
		"#--  ###   #".split(""),
		"#--     $$ #".split(""),
		"#--  # # $ #".split(""),
		"#--### # $ #".split(""),
		"#### $ #$  #".split(""),
		"   #  $# $ #".split(""),
		"   # $  $  #".split(""),
		"   #  ##   #".split(""),
		"   #########".split("")
	],
		
	//Level 11:
	[
		"    #     ##".split(""),
		" -- #$#$ #  ".split(""),
		" #    #@ #- ".split(""),
		" # - $$$ # #".split(""),
		"  #    -#-$ ".split(""),
		"  $  #  #-$ ".split(""),
		"   ## - ##$ ".split(""),
		"  # $  $ #  ".split(""),
		"  #-    -# $".split(""),
		"  #######   ".split(""),
		"--       $ -".split("")
	],
		
	//Level 12:
	[
		"       ##### ".split(""),
		" #######   ##".split(""),
		"## # @## $$ #".split(""),
		"#    $      #".split(""),
		"#  $  ###   #".split(""),
		"### #####$###".split(""),
		"# $  ### --# ".split(""),
		"# $ $ $ ---# ".split(""),
		"#    ###---# ".split(""),
		"# $$ # #---# ".split(""),
		"#  ### ##### ".split(""),
		"####         ".split("")
	],
		
	//Level 13:
	[
		"#   #   # ###".split(""),
		" # # # # #   ".split(""),
		"- #  -#- -#  ".split(""),
		"$ # $ # $ #  ".split(""),
		" #  -$   #-- ".split(""),
		" $-  $* $ $++".split(""),
		"   $- #$     ".split(""),
		" # #   $ # $ ".split(""),
		"  #-$$# $ #--".split(""),
		"  #   #  -#$ ".split(""),
		" # #-# #-##  ".split(""),
		"#   #   #  ##".split("")
	],
		
	//Level 14:
	[
		"  ####          ".split(""),
		"  #  ###########".split(""),
		"  #    $   $ $ #".split(""),
		"  # $# $ #  $  #".split(""),
		"  #  $ $  #    #".split(""),
		"### $# #  #### #".split(""),
		"#@#$ $ $  ##   #".split(""),
		"#    $ #$#   # #".split(""),
		"#   $    $ $ $ #".split(""),
		"#####  #########".split(""),
		"  #      #      ".split(""),
		"  #      #      ".split(""),
		"  #------#      ".split(""),
		"  #------#      ".split(""),
		"  #------#      ".split(""),
		"  ########      ".split("")
	]
];