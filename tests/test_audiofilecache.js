var currentURL = location.href;
currentURL = currentURL.substring(0, currentURL.indexOf("test_audiofilecache.htm"));

//Audio files:
var filesURIs =
	{
		"coins" :
		{
			"audio/mp4" :
			[
				currentURL + "audio/coins/coins.m4a", //Absolute path.
				"audio/coins/coins.m4a", //Relative path.
				
				currentURL + "audio/coins/coins.mp4", //Absolute path.
				"audio/coins/coins.mp4" //Relative path.
			],
			"audio/ogg" :
			[
				"audio/coins/coins.opus", //Relative path.
				currentURL + "audio/coins/coins.opus", //Absolute path.
				
				currentURL + "audio/coins/coins.ogg", //Absolute path.
				"audio/coins/coins.ogg" //Relative path.
			],
			"audio/mpeg" :
			[
				currentURL + "audio/coins/coins.mp3", //Absolute path.
				"audio/coins/coins.mp3" //Relative path.
				
			],
			"audio/wav" :
			[
				"audio/coins/coins.wav", //Relative path.
				currentURL + "audio/coins/coins.wav" //Absolute path.
			]
		},
		"horse" :
		{
			"audio/mp4" :
			[
				currentURL + "audio/horse/horse.mp4", //Absolute path.
				"audio/horse/horse.mp4", //Relative path.
				
				currentURL + "audio/horse/horse.m4a", //Absolute path.
				"audio/horse/horse.m4a" //Relative path.
			],
			"audio/ogg" :
			[
				currentURL + "audio/horse/horse.ogg", //Absolute path.
				"audio/horse/horse.ogg", //Relative path.
				
				currentURL + "audio/horse/horse.opus", //Absolute path.
				"audio/horse/horse.opus" //Relative path.
			],
			"audio/mpeg" :
			[
				currentURL + "audio/horse/horse.mp3", //Absolute path.
				"audio/horse/horse.mp3" //Relative path.
			],
			"audio/wav" :
			[
				currentURL + "audio/horse/horse.wav", //Absolute path.
				"audio/horse/horse.wav" //Relative path.
			]
		},
		"welcome" :
		{
			"audio/mp4" :
			[
				files["welcome/welcome.m4a"], //Data URI.
				currentURL + "audio/welcome/welcome.m4a", //Absolute path.
				"audio/welcome/welcome.m4a", //Relative path.
				
				files["welcome/welcome.mp4"], //Data URI.
				currentURL + "audio/welcome/welcome.mp4", //Absolute path.
				"audio/welcome/welcome.mp4" //Relative path.
			],
			"audio/mpeg" :
			[
				files["welcome/welcome.mp3"], //Data URI.
				currentURL + "audio/welcome/welcome.mp3", //Absolute path.
				"audio/welcome/welcome.mp3" //Relative path.
			],
			"audio/ogg" :
			[
				files["welcome/welcome.ogg"], //Data URI.
				currentURL + "audio/welcome/welcome.ogg", //Absolute path.
				"audio/welcome/welcome.ogg", //Relative path.
				
				files["welcome/welcome.opus"], //Data URI.
				currentURL + "audio/welcome/welcome.opus", //Absolute path.
				"audio/welcome/welcome.opus" //Relative path.
			],
			"audio/wav" :
			[
				files["welcome/welcome.wav"], //Data URI.
				currentURL + "audio/welcome/welcome.wav", //Absolute path.
				"audio/welcome/welcome.wav" //Relative path.
			]
		},
		"numeros" :
		{
			"audio/mpeg" :
			[
				currentURL + "audio/numeros/numeros.mp3", //Absolute path.
				"audio/numeros/numeros.mp3", //Relative path.
				files["numeros/numeros.mp3"] //Data URI.
			],
			"audio/ogg" :
			[
				files["numeros/numeros.ogg"], //Data URI.				
				currentURL + "audio/numeros/numeros.ogg", //Absolute path.
				"audio/numeros/numeros.ogg" //Relative path.

			],
			"audio/mp4" :
			[
				currentURL + "audio/numeros/numeros.m4a", //Absolute path.
				"audio/numeros/numeros.m4a", //Relative path.
				files["numeros/numeros.m4a"] //Data URI.
			],
			"audio/wav" :
			[
				currentURL + "audio/numeros/numeros.wav", //Absolute path.
				"audio/numeros/numeros.wav", //Relative path.
				files["numeros/numeros.wav"] //Data URI.
			]
		},
		"pista_1" :
		{
			"audio/mp4" :
			[
				"audio/pista_1/pista_1.m4a", //Relative path.
				currentURL + "audio/pista_1/pista_1.m4a" //Absolute path.
			],
			"audio/mpeg" :
			[
				"audio/pista_1/pista_1.mp3", //Relative path.
				currentURL + "audio/pista_1/pista_1.mp3" //Absolute path.
			],
			"audio/ogg" :
			[
				"audio/pista_1/pista_1.ogg", //Relative path.
				currentURL + "audio/pista_1/pista_1.ogg" //Absolute path.
			],
			"audio/wav" :
			[
				"audio/pista_1/pista_1.wav", //Relative path.
				currentURL + "audio/pista_1/pista_1.wav" //Absolute path.
			]
		},
		"yupi_dream_chinaz_love" :
		{
			"audio/mp4" :
			[
				"audio/yupi_dream_chinaz_love/yupi_dream_chinaz_love.m4a", //Relative path.
				currentURL + "audio/yupi_dream_chinaz_love/yupi_dream_chinaz_love.m4a" //Absolute path.
			],
			"audio/mpeg" :
			[
				"audio/yupi_dream_chinaz_love/yupi_dream_chinaz_love.mp3", //Relative path.
				currentURL + "audio/yupi_dream_chinaz_love/yupi_dream_chinaz_love.mp3" //Absolute path.
			],
			"audio/ogg" :
			[
				"audio/yupi_dream_chinaz_love/yupi_dream_chinaz_love.ogg", //Relative path.
				currentURL + "audio/yupi_dream_chinaz_love/yupi_dream_chinaz_love.ogg" //Absolute path.
			],
			"audio/wav" :
			[
				"audio/yupi_dream_chinaz_love/yupi_dream_chinaz_love.wav", //Relative path.
				currentURL + "audio/yupi_dream_chinaz_love/yupi_dream_chinaz_love.wav" //Absolute path.
			]
		},
		"arriba_el_ritmo_valencia" :
		{
			"audio/mp4" :
			[
				currentURL + "audio/arriba_el_ritmo_valencia/arriba_el_ritmo_valencia.m4a", //Absolute path.
				"audio/arriba_el_ritmo_valencia/arriba_el_ritmo_valencia.m4a" //Relative path.
			],
			"audio/mpeg" :
			[
				currentURL + "audio/arriba_el_ritmo_valencia/arriba_el_ritmo_valencia.mp3", //Absolute path.
				"audio/arriba_el_ritmo_valencia/arriba_el_ritmo_valencia.mp3" //Relative path.
			],
			"audio/ogg" :
			[
				currentURL + "audio/arriba_el_ritmo_valencia/arriba_el_ritmo_valencia.ogg", //Absolute path.
				"audio/arriba_el_ritmo_valencia/arriba_el_ritmo_valencia.ogg" //Relative path.
				
			],
			"audio/wav" :
			[
				currentURL + "audio/arriba_el_ritmo_valencia/arriba_el_ritmo_valencia.wav", //Absolute path.
				"audio/arriba_el_ritmo_valencia/arriba_el_ritmo_valencia.wav" //Relative path.
			]
		},
		"digestive_mix" :
		{
			"audio/mp4" :
			[
				currentURL + "audio/digestive_mix/digestive_mix.m4a", //Absolute path.
				"audio/digestive_mix/digestive_mix.m4a" //Relative path.
			],
			"audio/mpeg" :
			[
				currentURL + "audio/digestive_mix/digestive_mix.mp3", //Absolute path.
				"audio/digestive_mix/digestive_mix.mp3" //Relative path.
			],
			"audio/ogg" :
			[
				currentURL + "audio/digestive_mix/digestive_mix.ogg", //Absolute path.
				"audio/digestive_mix/digestive_mix.ogg" //Relative path.
				
			],
			"audio/wav" :
			[
				currentURL + "audio/digestive_mix/digestive_mix.wav", //Absolute path.
				"audio/digestive_mix/digestive_mix.wav" //Relative path.
			]
		},
		"SOME_UNEXISTING_FILES" :
		{
			"audio/mp4" :
			[
				currentURL + "non_existing.m4a", //Absolute path.
				"non_existing.m4a", //Relative path.

				currentURL + "non_existing.mp4", //Absolute path.
				"non_existing.mp4", //Relative path.

				files["welcome/welcome.m4a"], //Data URI.
				currentURL + "audio/welcome/welcome.m4a", //Absolute path.
				"audio/welcome/welcome.m4a", //Relative path.
				
				files["welcome/welcome.mp4"], //Data URI.
				currentURL + "audio/welcome/welcome.mp4", //Absolute path.
				"audio/welcome/welcome.mp4" //Relative path.
			],
			"audio/mpeg" :
			[
				currentURL + "non_existing.mp3", //Absolute path.
				"non_existing.mp3", //Relative path.
				
				files["welcome/welcome.mp3"], //Data URI.
				currentURL + "audio/welcome/welcome.mp3", //Absolute path.
				"audio/welcome/welcome.mp3" //Relative path.
			],
			"audio/ogg" :
			[
				currentURL + "non_existing.ogg", //Absolute path.
				"non_existing.ogg", //Relative path.
				
				currentURL + "non_existing.opus", //Absolute path.
				"non_existing.opus", //Relative path.
				
				files["welcome/welcome.ogg"], //Data URI.
				currentURL + "audio/welcome/welcome.ogg", //Absolute path.
				"audio/welcome/welcome.ogg", //Relative path.
				
				files["welcome/welcome.opus"], //Data URI.
				currentURL + "audio/welcome/welcome.opus", //Absolute path.
				"audio/welcome/welcome.opus" //Relative path.
			],
			"audio/wav" :
			[
				currentURL + "non_existing.wav", //Absolute path.
				"non_existing.wav", //Relative path.
				
				files["welcome/welcome.wav"], //Data URI.
				currentURL + "audio/welcome/welcome.wav", //Absolute path.
				"audio/welcome/welcome.wav" //Relative path.
			]
		},
		"UNEXISTING_FILES" :
		{
			"audio/mp4" :
			[
				currentURL + "non_existing.m4a", //Absolute path.
				"non_existing.m4a", //Relative path.

				currentURL + "non_existing.mp4", //Absolute path.
				"non_existing.mp4" //Relative path.
			],
			"audio/mpeg" :
			[
				currentURL + "non_existing.mp3", //Absolute path.
				"non_existing.mp3" //Relative path.
			],
			"audio/ogg" :
			[
				currentURL + "non_existing.ogg", //Absolute path.
				"non_existing.ogg", //Relative path.
				
				currentURL + "non_existing.opus", //Absolute path.
				"non_existing.opus" //Relative path.
			],
			"audio/wav" :
			[
				currentURL + "non_existing.wav", //Absolute path.
				"non_existing.wav" //Relative path.
			]
		},
		"ERRONEOUS_FILES" :
		{
			"audio/mp4" :
			[
				currentURL + "audio/erroneous/erroneous.m4a", //Absolute path.
				"audio/erroneous/erroneous.m4a", //Relative path.
				
				currentURL + "audio/erroneous/erroneous.mp4", //Absolute path.
				"audio/erroneous/erroneous.mp4" //Relative path.
			],
			"audio/ogg" :
			[
				"audio/erroneous/erroneous.opus", //Relative path.
				currentURL + "audio/erroneous/erroneous.opus", //Absolute path.
				
				currentURL + "audio/erroneous/erroneous.ogg", //Absolute path.
				"audio/erroneous/erroneous.ogg" //Relative path.
			],
			"audio/mpeg" :
			[
				currentURL + "audio/erroneous/erroneous.mp3", //Absolute path.
				"audio/erroneous/erroneous.mp3" //Relative path.
				
			],
			"audio/wav" :
			[
				"audio/erroneous/erroneous.wav", //Relative path.
				currentURL + "audio/erroneous/erroneous.wav" //Absolute path.
			]
		},
		"ERRONEOUS_DATA_URIS" :
		{
			"audio/mp4" :
			[
				"data:audio/mp4;base64,erroneous" //Data URI.
			],
			"audio/mpeg" :
			[
				"data:audio/mpeg;base64,erroneous" //Data URI.
			],
			"audio/ogg" :
			[
				"data:audio/ogg;base64,erroneous" //Data URI.
			],
			"audio/wav" :
			[
				"data:audio/wav;base64,erroneous" //Data URI.
			]
		},
		"ONLY_DATA_URIS" :
		{
			"audio/mp4" :
			[
				files["welcome/welcome.m4a"], //Data URI.
				files["welcome/welcome.mp4"] //Data URI.
			],
			"audio/mpeg" :
			[
				files["welcome/welcome.mp3"] //Data URI.
			],
			"audio/ogg" :
			[
				files["welcome/welcome.ogg"], //Data URI.
				files["welcome/welcome.opus"] //Data URI.
			],
			"audio/wav" :
			[
				files["welcome/welcome.wav"] //Data URI.
			]
		}
	};