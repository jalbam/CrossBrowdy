<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<header><h1 class="category_title">Download <?php echo $projectName; ?></h1></header>
<div class="category_text">
	<?php
		define("CB_VERSION_CURRENT", "0.99.95.3");
		define("CB_FILENAME_BASE", "CrossBrowdy_" . CB_VERSION_CURRENT);
		define("CB_FILENAME_PATH_ZIP", "download/" . CB_FILENAME_BASE . ".zip");
		define("CB_FILENAME_PATH_ZIP_REAL", "files/" . CB_FILENAME_BASE . ".zip");
	?>
	<div style="text-align:center;">
		<p>
			<a href="<?php echo CB_FILENAME_PATH_ZIP; ?>" class="download_button">
				Download <?php echo CB_VERSION_CURRENT; ?> version
			</a>
			<?php
				/*<div class="download_size">(<?php echo number_format(filesize(CB_FILENAME_PATH_ZIP_REAL) / 1014, 2); ?> KB)</div>*/
			?>
		</p>
		<p>
			<a href="<?php echo "download" . $PHPExtension; ?>#old_versions" class="download_old">Download old versions</a>
		</p>
	</div>

	<h4>Download the latest version from the comman line (shell):</h4>

	<p>
		Using <strong>Bower</strong>:
	</p>
	<div class="shell_command_line"><code class="language-shell">
		<strong>bower</strong> install crossbrowdy
	</code></div>
	
	<p>
		Using <strong>npm</strong>:
	</p>
	<div class="shell_command_line"><code class="language-shell">
		<strong>npm</strong> i crossbrowdy
	</code></div>
	
	<p>
		Using <strong>Yarn</strong>:
	</p>
	<div class="shell_command_line"><code class="language-shell">
		<strong>yarn</strong> add crossbrowdy
	</code></div>

	<h3>Source code</h3>
	<p>
		The entire source code of the CrossBrowdy project can be found on GitHub:
		<br />
		<a href="https://github.com/jalbam/CrossBrowdy" target="_blank">https://github.com/jalbam/CrossBrowdy</a>
	</p>
	
	<h3>Change Log</h3>
	<p>
		Coming soon
	</p>
	
	<a name="old_versions"></a>
	<h3>Old versions</h3>
	<p>
		Coming soon
	</p>
</div>
<?php
	//TODO: Poner data type de software: https://developers.google.com/search/docs/data-types/software-app
	
	//TODO: Poner enlace a old versions (directory files/). Rellenar el directory con todas las versiones (buscar en emails, FTP, etc.).