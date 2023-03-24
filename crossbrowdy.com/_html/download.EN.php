<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<header><h1 class="category_title">Download <?php echo $projectName; ?></h1></header>
<main>
	<div class="category_text">
		<div style="text-align:center;">
			<div class="download_container">
				<?php
					if (file_exists(CB_FILENAME_PATH_ZIP_REAL_LATEST))
					{
				?>
						<span itemscope itemtype="https://schema.org/SoftwareApplication">
							<meta itemprop="name" content="CrossBrowdy" />
							<meta itemprop="softwareVersion" content="<?php echo CB_VERSION_CURRENT; ?>" />
							<meta itemprop="author" content="Joan Alba Maldonado (aka Juan Alba Maldonado)" />
							<meta itemprop="image" content="<?php echo $projectURLDefault; ?>img/logo.png" />
							<link itemprop="license" href="https://choosealicense.com/licenses/bsd-2-clause/" />
							<link itemprop="applicationCategory" href="https://schema.org/DeveloperApplication" />
							<meta itemprop="applicationCategory" content="Framework" />
							<meta itemprop="description" content="<?php echo $projectDescription[$language]; ?>" />
							<meta itemprop="fileFormat" content="application/zip" />
							<link itemprop="downloadURL" href="<?php echo $projectURLDefault; ?>get_file<?php echo $PHPExtension; ?>?id=current" />
							<meta itemprop="price" content="0" />
							<meta itemprop="priceCurrency" content="USD" />
							<a href="get_file<?php echo $PHPExtension; ?>?id=current" class="download_button">
								Download <strong><?php echo CB_VERSION_CURRENT; ?></strong> version
							</a>
							<p class="download_button_footer">
								Includes the API documentation
							</p>
							<div class="download_size download_size_first">(<span itemprop="fileSize"><?php echo number_format(filesize(CB_FILENAME_PATH_ZIP_REAL_LATEST) / 1014, 2); ?> KB</span>)</div>
						</span>
				<?php
					}
					else { echo "<p>Download for normal version coming soon!</p>"; }
				?>
			</div>
			<div class="download_container">
				<?php
					if (file_exists(CB_FILENAME_PATH_ZIP_REAL_LATEST_DIST))
					{
				?>
						<span itemscope itemtype="https://schema.org/SoftwareApplication">
							<meta itemprop="name" content="CrossBrowdy (distribution)" />
							<meta itemprop="softwareVersion" content="<?php echo CB_VERSION_CURRENT; ?>" />
							<meta itemprop="author" content="Joan Alba Maldonado (aka Juan Alba Maldonado)" />
							<meta itemprop="image" content="<?php echo $projectURLDefault; ?>img/logo.png" />
							<link itemprop="license" href="https://choosealicense.com/licenses/bsd-2-clause/" />
							<link itemprop="applicationCategory" href="https://schema.org/DeveloperApplication" />
							<meta itemprop="applicationCategory" content="Framework" />
							<meta itemprop="description" content="<?php echo $projectDescription[$language]; ?>. Just essential files, for distribution." />
							<meta itemprop="fileFormat" content="application/zip" />
							<link itemprop="downloadURL" href="<?php echo $projectURLDefault; ?>get_file<?php echo $PHPExtension; ?>?id=current" />
							<meta itemprop="price" content="0" />
							<meta itemprop="priceCurrency" content="USD" />
							<a href="get_file<?php echo $PHPExtension; ?>?id=current&amp;dist=yes" class="download_button">
								Download <strong><?php echo CB_VERSION_CURRENT; ?>.dist</strong> version
							</a>
							<p class="download_button_footer">
								Just essential files, for distribution
							</p>
							<div class="download_size">(<span itemprop="fileSize"><?php echo number_format(filesize(CB_FILENAME_PATH_ZIP_REAL_LATEST_DIST) / 1014, 2); ?> KB</span>)</div>
						</span>
				<?php
					}
					else { echo "<p>Download for distribution version coming soon!</p>"; }
				?>
			</div>
			<p class="download_old">
				<a href="<?php echo "download" . $PHPExtension; ?>#old_versions" class="download_old">Download old versions</a>
			</p>
			<p class="download_examples">
				<a href="get_file<?php echo $PHPExtension; ?>?id=examples" class="download_examples">Download working examples</a><br />
				<a href="guides<?php echo $PHPExtension; ?>#examples" class="download_examples" target="_blank">...or try them on-line!</a><br />
			</p>
		</div>

		<section>
			<header><h4>Download the latest version from the command line (shell):</h4></header>

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
				Using <strong>pnpm</strong>:
			</p>
			<div class="shell_command_line"><code class="language-shell">
				<strong>pnpm</strong> i crossbrowdy
			</code></div>

			<p>
				Using <strong>Bower</strong>:
			</p>
			<div class="shell_command_line"><code class="language-shell">
				<strong>bower</strong> install jalbam/crossbrowdy --save
			</code></div>
			<p>
				<strong>Note</strong>: <a href="https://yarnpkg.com/en/package/crossbrowdy" target="_blank">Yarn</a>, <a href="https://www.npmjs.com/package/crossbrowdy" target="_blank">npm</a>, pnpm and Bower will also download the <a href="api<?php echo $PHPExtension; ?>" target="_blank">API documentation</a>.
			</p>
		</section>

		<section>
			<a name="cdn_providers"></a>
			<header><h3>CDN Providers</h3></header>
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
		</section>

		<section>
			<header><h3>Source code</h3></header>
			<p>
				The entire source code of the CrossBrowdy project can be found on GitHub:
				<br />
				<a href="https://github.com/jalbam/CrossBrowdy" target="_blank">https://github.com/jalbam/CrossBrowdy</a>
			</p>
		</section>
		
		<section>
			<header><h3>Change Log</h3></header>
			<p>
				Read the <a href="https://github.com/jalbam/CrossBrowdy/blob/master/CHANGELOG.md" target="_blank">CHANGELOG.md</a> file on GitHub.
			</p>
		</section>
		
		<section>
			<a name="old_versions"></a>
			<header><h3>Old versions</h3></header>
			<p>
				<a href="files/" target="_blank">Click here</a> to download old CrossBrowdy (formerly known as <i>CrossBase</i>) versions.
			</p>
		</section>
	</div>
</main>