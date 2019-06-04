<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	CrossBrowdy can manage audio files and even audio data URI (depending on the API and client used) through the <a href="_html/_doc/api/CB_AudioFile.html" target="_blank">CB_AudioFile</a> class.
	This class will detect automatically the best API to reproduce the audio but it can also be forced to use a desired API.
</p>

<p>
	Depending on the API used, the internal audio management will be done through
	the <a href="_html/_doc/api/CB_AudioFile_API.WAAPI.html" target="_blank">CB_AudioFile_API.WAAPI</a>
	(using <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API" target="_blank">HTML5 Web Audio API</a>),
	the <a href="_html/_doc/api/CB_AudioFile_API.AAPI.html" target="_blank">CB_AudioFile_API.AAPI</a>
	(using <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio" target="_blank">HTML5 Audio API</a>),
	the <a href="_html/_doc/api/CB_AudioFile_API.ACMP.html" target="_blank">CB_AudioFile_API.ACMP</a>
	(using <a href="https://github.com/apache/cordova-plugin-media" target="_blank">Apache Cordova Media Plugin</a>) and
	the <a href="_html/_doc/api/CB_AudioFile_API.SM2.html" target="_blank">CB_AudioFile_API.SM2</a>
	(using <a href="http://schillmania.com/projects/soundmanager2/" target="_blank">SoundManager 2</a>)
	classes. You do not need to worry about these classes and the internal management as all will be done automatically.
</p>

<p>
	Here is an example of audio files management with CrossBrowdy:
</p>
<pre><code class="language-javascript">
	var audioFile = new CB_AudioFile(filePath [, audioId] [, options] [, audioAPI] [, callbackOk] [, callbackError]) → {CB_AudioFile}
	
	audioFile.id :string
	audioFile.filePath :string
	audioFile.audioAPI :string
	
	audioFile.load(filePath [, audioAPI] [, autoPlay] [, callbackOk] [, callbackError] [, ignoreOldValues] [, forceReload]) → {CB_AudioFile_API.WAAPI|CB_AudioFile_API.SM2|CB_AudioFile_API.ACMP|CB_AudioFile_API.AAPI|null}
	audioFile.checkPlaying( [callbackOk] [, callbackError] [, ignoreStatus] [, ignoreQueue] [, useCache]) → {boolean}
	audioFile.destructor( [stopSound] [, keepStoppedUnaltered] [, avoidOnStop] [, forceOnStop])

	audioFile.getStatus( [realStatus]) → {number}
	audioFile.getStatusString( [realStatus]) → {string}
	CB_AudioFile.ABORTED :integer
	CB_AudioFile.CHECKING :integer
	CB_AudioFile.FAILED :integer
	CB_AudioFile.LOADED :integer
	CB_AudioFile.LOADING :integer
	CB_AudioFile.UNCHECKED :integer
	CB_AudioFile.UNLOADED :integer
	
	audioFile.getProgress() → {number}
	
	audioFile.getDuration() → {number}
	audioFile.getCurrentTime() → {number}
	
	audioFile.getVolume() → {number}
	audioFile.getVolumeBeforeMute() → {number}
	audioFile.setVolume( [volume] [, forceSetVolumeProperty] [, onSetVolume]) → {number}
	audioFile.mute( [onMute]) → {number}
	audioFile.unmute( [onUnmute]) → {number}
	
	audioFile.loop :boolean
	
	audioFile.play( [startAt] [, stopAt] [, loop] [, avoidDelayedPlay] [, allowedRecursiveDelay] [, onPlayStart] [, onLoadError] [, isResume]) → {boolean|integer}
	audioFile.getStartAt( [numeric]) → {number|*}
	audioFile.getStopAt( [numeric]) → {number|*}

	audioFile.setAudioAPI( [audioAPI] [, autoLoad] [, autoPlay] [, callbackOk] [, callbackError] [, ignoreOldValues] [, filePath] [, forceReload]) → {string}
	
	audioFile.pause( [onPause] [, keepPausedUnaltered]) → {boolean}

	audioFile.resume( [loop] [, avoidDelayedPlay] [, allowedRecursiveDelay] [, onPlayStart] [, onLoadError]) → {boolean|integer}
	
	audioFile.onStop(callbackFunction [, keepOldFunction]) → {boolean}
	audioFile.stop( [keepStoppedUnaltered] [, avoidOnStop] [, forceOnStop]) → {boolean}

	audioFile.isPaused() → {boolean}
	audioFile.isPlaying() → {boolean}
	audioFile.isStopped() → {boolean}

	
	audioFile.audioFileObject :Object
	audioFile.audioFileObjectLast :CB_AudioFile_API.WAAPI|CB_AudioFile_API.SM2|CB_AudioFile_API.ACMP|CB_AudioFile_API.AAPI
	audioFile.audioFileObjects :Object
	audioFile.DEFAULT_OPTIONS :CB_AudioFile.OPTIONS
	audioFile.DEFAULT_VOLUME :number
</code></pre>

<p>
	Note that, most of the times, it is recommended to deal with audio files using always the
	<a href="_html/_doc/api/CB_Speaker.html" target="_blank">CB_Speaker</a> static class
	which can contain a
	<a href="_html/_doc/api/CB_AudioFileSpritesPool.html" target="_blank">CB_AudioFileSpritesPool</a> object
	(mainly using the
	<a href="_html/_doc/api/CB_Speaker.html#.setAudioFileSpritesPool" target="_blank">CB_Speaker.setAudioFileSpritesPool</a> and
	the <a href="_html/_doc/api/CB_Speaker.html#.getAudioFileSpritesPool" target="_blank">CB_Speaker.getAudioFileSpritesPool</a>
	functions).
	The <a href="_html/_doc/api/CB_AudioFileSpritesPool.html" target="_blank">CB_AudioFileSpritesPool</a> class uses audio files cache
	and provides multiple sprites groups management as well as many other advanced methods.
</p>

<p>
	Check the <a href="_html/_doc/api/index.html" target="_blank">API documentation</a> to read more about the <a href="_html/_doc/api/CB_AudioFile.html" target="_blank">CB_AudioFile</a>, the <a href="_html/_doc/api/CB_AudioFile_API.WAAPI.html" target="_blank">CB_AudioFile_API.WAAPI</a>, the <a href="_html/_doc/api/CB_AudioFile_API.AAPI.html" target="_blank">CB_AudioFile_API.AAPI</a>, the <a href="_html/_doc/api/CB_AudioFile_API.ACMP.html" target="_blank">CB_AudioFile_API.ACMP</a> and the <a href="_html/_doc/api/CB_AudioFile_API.SM2.html" target="_blank">CB_AudioFile_API.SM2</a> classes.
</p>