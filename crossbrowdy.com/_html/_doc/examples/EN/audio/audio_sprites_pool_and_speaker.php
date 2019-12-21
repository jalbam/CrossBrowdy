<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	This is an example managing audio sprites pool and speaker(s):
</p>

<?php
	//Show all files:
	echo getFilesCodeAll();
?>

<p>
	Additional files used (inside the &quot;audio&quot; folder):
	<a href="<?php echo $dirPath; ?>audio/arriba_el_ritmo_valencia.m4a" target="_blank">arriba_el_ritmo_valencia.m4a</a>,
	<a href="<?php echo $dirPath; ?>audio/arriba_el_ritmo_valencia.mp3" target="_blank">arriba_el_ritmo_valencia.mp3</a>,
	<a href="<?php echo $dirPath; ?>audio/arriba_el_ritmo_valencia.ogg" target="_blank">arriba_el_ritmo_valencia.ogg</a>,
	<a href="<?php echo $dirPath; ?>audio/arriba_el_ritmo_valencia.wav" target="_blank">arriba_el_ritmo_valencia.wav</a>,
	<a href="<?php echo $dirPath; ?>audio/numeros.m4a" target="_blank">numeros.m4a</a>,
	<a href="<?php echo $dirPath; ?>audio/numeros.mp3" target="_blank">numeros.mp3</a>,
	<a href="<?php echo $dirPath; ?>audio/numeros.ogg" target="_blank">numeros.ogg</a> and
	<a href="<?php echo $dirPath; ?>audio/numeros.wav" target="_blank">numeros.wav</a>.
</p>

<?php	
	//Let's try the example:
	echo '<p class="try_example">' . getTryExampleLink() . '</p>';
?>

<p>
	You can check the <a href="guides<?php echo $PHPExtension; ?>" target="_blank">Guides & Tutorials</a> category as well as the <a href="_html/_doc/api/index.html" target="_blank">API documentation</a> in the case you need more information.
</p>