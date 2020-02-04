<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<header><h1 class="category_title">Download <?php echo $projectName; ?></h1></header>
<div class="category_text">
	<div style="text-align:center;">
		<div class="download_container">
			<p>
				<?php
					if (file_exists(CB_FILENAME_PATH_ZIP_REAL_LATEST))
					{
				?>
						<a href="get_file<?php echo $PHPExtension; ?>?id=current" class="download_button">
							Download <strong><?php echo CB_VERSION_CURRENT; ?></strong> version
						</a>
						<p class="download_button_footer">
							Includes the API documentation
						</p>
						<div class="download_size download_size_first">(<?php echo number_format(filesize(CB_FILENAME_PATH_ZIP_REAL_LATEST) / 1014, 2); ?> KB)</div>
				<?php
					}
					else { echo "Download for normal version coming soon!"; }
				?>
			</p>
		</div>
		<div class="download_container">
			<p>
				<?php
					if (file_exists(CB_FILENAME_PATH_ZIP_REAL_LATEST_DIST))
					{
				?>
						<a href="get_file<?php echo $PHPExtension; ?>?id=current&dist=yes" class="download_button">
							Download <strong><?php echo CB_VERSION_CURRENT; ?>.dist</strong> version
						</a>
						<p class="download_button_footer">
							Just essential files, for distribution
						</p>
						<div class="download_size">(<?php echo number_format(filesize(CB_FILENAME_PATH_ZIP_REAL_LATEST_DIST) / 1014, 2); ?> KB)</div>
				<?php
					}
					else { echo "Download for distribution version coming soon!"; }
				?>
			</p>
		</div>
		<p class="download_old">
			<a href="<?php echo "download" . $PHPExtension; ?>#old_versions" class="download_old">Download old versions</a>
		</p>
		<p class="download_examples">
			<a href="get_file<?php echo $PHPExtension; ?>?id=examples" class="download_examples">Download working examples</a><br />
			<a href="guides<?php echo $PHPExtension; ?>#examples" class="download_examples" target="_blank">...or try them on-line!</a><br />
		</p>
	</div>

	
	<h4>Download the latest version from the command line (shell):</h4>

	<p>
		Using <strong><a href="https://yarnpkg.com/en/package/crossbrowdy" target="_blank">Yarn</a></strong>:
	</p>
	<div class="shell_command_line"><code class="language-shell">
		<strong>yarn</strong> add crossbrowdy
	</code></div>

	<p>
		Using <strong><a href="https://www.npmjs.com/package/crossbrowdy" target="_blank">npm</a></strong>:
	</p>
	<div class="shell_command_line"><code class="language-shell">
		<strong>npm</strong> i crossbrowdy
	</code></div>

	<p>
		Using <strong>Bower</strong>:
	</p>
	<div class="shell_command_line"><code class="language-shell">
		<strong>bower</strong> install jalbam/crossbrowdy --save
	</code></div>
	<p>
		Note: <a href="https://yarnpkg.com/en/package/crossbrowdy" target="_blank">Yarn</a>, <a href="https://www.npmjs.com/package/crossbrowdy" target="_blank">npm</a> and Bower will also download the <a href="api<?php echo $PHPExtension; ?>" target="_blank">API documentation</a>.
	</p>

	
	<a name="cdn_providers"></a>
	<h3>CDN Providers</h3>
	<p>
		Alternatively, instead of downloading CrossBrowdy, you can <a href="https://en.wikipedia.org/wiki/Inline_linking" target="_blank">hotlink</a> its main JavaScript file (which is called <i>CrossBrowdy.js</i>) by directly pointing to a version available online.
	</p>
	<p>
		Thanks to the <a href="https://en.wikipedia.org/wiki/Content_delivery_network" target="_blank">CDN providers</a>, you will be able to always use the last up-to-date version or even to point to a specific version you may prefer.
	</p>
	
	<p>
		Using <strong><a href="https://cdn.jsdelivr.net/npm/crossbrowdy/" target="_blank">jsDelivr</a></strong>:
	</p>
	<p class="cdn_item">
		Last version:
		<a href="https://cdn.jsdelivr.net/npm/crossbrowdy/CrossBrowdy/CrossBrowdy.js" target="_blank">https://cdn.jsdelivr.net/npm/crossbrowdy/CrossBrowdy/CrossBrowdy.js</a>
	</p>
	<p class="cdn_item">
		Specific vesion (example):
		<a href="https://cdn.jsdelivr.net/npm/crossbrowdy@0.99.9-6.1/CrossBrowdy/CrossBrowdy.js" target="_blank">https://cdn.jsdelivr.net/npm/crossbrowdy@0.99.9-6.1/CrossBrowdy/CrossBrowdy.js</a>
	</p>

	<p>
		Using <strong><a href="https://unpkg.com/browse/crossbrowdy/" target="_blank">UNPKG</a></strong>:
	</p>
	<p class="cdn_item">
		Last version:
		<a href="https://unpkg.com/crossbrowdy/CrossBrowdy/CrossBrowdy.js" target="_blank">https://unpkg.com/crossbrowdy/CrossBrowdy/CrossBrowdy.js</a>
	</p>
	<p class="cdn_item">
		Last version through <a href="https://npmcdn.com/" target="_blank">npmcdn.com</a>:
		<a href="https://npmcdn.com/crossbrowdy/CrossBrowdy/CrossBrowdy.js" target="_blank">https://npmcdn.com/crossbrowdy/CrossBrowdy/CrossBrowdy.js</a>
	</p>
	<p class="cdn_item">
		Specific vesion (example):
		<a href="https://unpkg.com/crossbrowdy@0.99.9-6.1/CrossBrowdy/CrossBrowdy.js" target="_blank">https://unpkg.com/crossbrowdy@0.99.9-6.1/CrossBrowdy/CrossBrowdy.js</a>
	</p>
	<p class="cdn_item">
		Specific vesion (example) through <a href="https://npmcdn.com/" target="_blank">npmcdn.com</a>:
		<a href="https://npmcdn.com/crossbrowdy@0.99.9-6.1/CrossBrowdy/CrossBrowdy.js" target="_blank">https://npmcdn.com/crossbrowdy@0.99.9-6.1/CrossBrowdy/CrossBrowdy.js</a>
	</p>

	<p>
		Using <strong><a href="https://crossbrowdy.com/" target="_blank">CrossBrowdy.com</a></strong> (not recommended):
	</p>
	<p class="cdn_item">
		Last version:
		<a href="https://crossbrowdy.com/CrossBrowdy/CrossBrowdy.js" target="_blank">https://crossbrowdy.com/CrossBrowdy/CrossBrowdy.js</a>
	</p>
	
	
	<p>
		Have in mind that including the CrossBrowdy main file from a <a href="https://en.wikipedia.org/wiki/Content_delivery_network" target="_blank">CDN provider</a> should never be done for production. This <a href="https://en.wikipedia.org/wiki/Inline_linking" target="_blank">hotlinking method</a> can be useful just for testing purposes. Some features might not work properly using this way and availability cannot be always guaranteed.
	</p>


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
		<a href="files/" target="_blank">Click here</a> to download old CrossBrowdy (formerly known as <i>CrossBase</i>) versions.
	</p>
</div>
<?php
	//TODO: Poner data type de software: https://developers.google.com/search/docs/data-types/software-app