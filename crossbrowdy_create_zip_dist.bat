@echo off

echo Removing folder and creating empty structure...

rmdir /s /q dist\CrossBrowdy
xcopy /t /e CrossBrowdy\*.* dist\CrossBrowdy\


echo.
echo Copying necessary files...

REM main:
copy CrossBrowdy\LICENSE dist\CrossBrowdy\
copy CrossBrowdy\*.js dist\CrossBrowdy\
copy CrossBrowdy\CrossBase\*.js dist\CrossBrowdy\CrossBase\


REM audio:
copy CrossBrowdy\CrossBase\audiovisual\audio\*.js dist\CrossBrowdy\CrossBase\audiovisual\audio\

copy CrossBrowdy\CrossBase\audiovisual\audio\AudioContextMonkeyPatch\*.js dist\CrossBrowdy\CrossBase\audiovisual\audio\AudioContextMonkeyPatch\

copy CrossBrowdy\CrossBase\audiovisual\audio\band.js\band.min.js dist\CrossBrowdy\CrossBase\audiovisual\audio\band.js\

copy CrossBrowdy\CrossBase\audiovisual\audio\jsfx\jsfx.js dist\CrossBrowdy\CrossBase\audiovisual\audio\jsfx\

copy CrossBrowdy\CrossBase\audiovisual\audio\soundmanager2\script\soundmanager2-nodebug-jsmin.js dist\CrossBrowdy\CrossBase\audiovisual\audio\soundmanager2\script\
copy CrossBrowdy\CrossBase\audiovisual\audio\soundmanager2\swf\soundmanager2.swf dist\CrossBrowdy\CrossBase\audiovisual\audio\soundmanager2\swf\
copy CrossBrowdy\CrossBase\audiovisual\audio\soundmanager2\swf\soundmanager2_flash9.swf dist\CrossBrowdy\CrossBase\audiovisual\audio\soundmanager2\swf\

copy CrossBrowdy\CrossBase\audiovisual\audio\sounds\*.* dist\CrossBrowdy\CrossBase\audiovisual\audio\sounds\

copy CrossBrowdy\CrossBase\audiovisual\audio\timbre.js\timbre.js dist\CrossBrowdy\CrossBase\audiovisual\audio\timbre.js\
copy CrossBrowdy\CrossBase\audiovisual\audio\timbre.js\timbre.swf dist\CrossBrowdy\CrossBase\audiovisual\audio\timbre.js\
copy CrossBrowdy\CrossBase\audiovisual\audio\timbre.js\subcollider\subcollider.js dist\CrossBrowdy\CrossBase\audiovisual\audio\timbre.js\subcollider\

copy CrossBrowdy\CrossBase\audiovisual\audio\WAAPISim\waapisim.min.js dist\CrossBrowdy\CrossBase\audiovisual\audio\WAAPISim\
copy CrossBrowdy\CrossBase\audiovisual\audio\WAAPISim\waapisim.swf dist\CrossBrowdy\CrossBase\audiovisual\audio\WAAPISim\


REM image:
copy CrossBrowdy\CrossBase\audiovisual\image\*.js dist\CrossBrowdy\CrossBase\audiovisual\image\

copy CrossBrowdy\CrossBase\audiovisual\image\canvas\*.js dist\CrossBrowdy\CrossBase\audiovisual\image\canvas\

copy CrossBrowdy\CrossBase\audiovisual\image\canvas\canbox\canbox.0.2.1.js dist\CrossBrowdy\CrossBase\audiovisual\image\canvas\canbox\

copy CrossBrowdy\CrossBase\audiovisual\image\canvas\excanvas_with_canvas_text\*.js dist\CrossBrowdy\CrossBase\audiovisual\image\canvas\excanvas_with_canvas_text\

copy CrossBrowdy\CrossBase\audiovisual\image\canvas\FlashCanvas\pro\bin\flashcanvas.js dist\CrossBrowdy\CrossBase\audiovisual\image\canvas\FlashCanvas\pro\bin\
copy CrossBrowdy\CrossBase\audiovisual\image\canvas\FlashCanvas\pro\bin\*.swf dist\CrossBrowdy\CrossBase\audiovisual\image\canvas\FlashCanvas\pro\bin\

copy CrossBrowdy\CrossBase\audiovisual\image\canvas\slcanvas\*.js dist\CrossBrowdy\CrossBase\audiovisual\image\canvas\slcanvas\
copy CrossBrowdy\CrossBase\audiovisual\image\canvas\slcanvas\*.png dist\CrossBrowdy\CrossBase\audiovisual\image\canvas\slcanvas\
copy CrossBrowdy\CrossBase\audiovisual\image\canvas\slcanvas\ClientBin\*.xap dist\CrossBrowdy\CrossBase\audiovisual\image\canvas\slcanvas\ClientBin\

copy CrossBrowdy\CrossBase\audiovisual\image\detect_zoom\*.js dist\CrossBrowdy\CrossBase\audiovisual\image\detect_zoom\
copy CrossBrowdy\CrossBase\audiovisual\image\NoSleep\NoSleep.min.js dist\CrossBrowdy\CrossBase\audiovisual\image\NoSleep\


REM device:
copy CrossBrowdy\CrossBase\device\*.js dist\CrossBrowdy\CrossBase\device\


REM general:
copy CrossBrowdy\CrossBase\general\*.js dist\CrossBrowdy\CrossBase\general\

copy CrossBrowdy\CrossBase\general\bluebird\bluebird.min.js dist\CrossBrowdy\CrossBase\general\bluebird\

copy CrossBrowdy\CrossBase\general\JSON3\json3.min.js dist\CrossBrowdy\CrossBase\general\JSON3\

copy CrossBrowdy\CrossBase\general\localStorage\localStorage.min.js dist\CrossBrowdy\CrossBase\general\localStorage\
copy CrossBrowdy\CrossBase\general\localStorage\localStorage.swf dist\CrossBrowdy\CrossBase\general\localStorage\

copy CrossBrowdy\CrossBase\general\lz-string\lz-string.min.js dist\CrossBrowdy\CrossBase\general\lz-string\
copy CrossBrowdy\CrossBase\general\lz-string\base64-string.js dist\CrossBrowdy\CrossBase\general\lz-string\

copy CrossBrowdy\CrossBase\general\others\*.js dist\CrossBrowdy\CrossBase\general\others\

copy CrossBrowdy\CrossBase\general\PHP\*.* dist\CrossBrowdy\CrossBase\general\PHP\


REM input:
copy CrossBrowdy\CrossBase\input\*.js dist\CrossBrowdy\CrossBase\input\

copy CrossBrowdy\CrossBase\input\controllers\*.js dist\CrossBrowdy\CrossBase\input\controllers\

copy CrossBrowdy\CrossBase\input\controllers\gamepad-plus\*.js dist\CrossBrowdy\CrossBase\input\controllers\gamepad-plus\

copy CrossBrowdy\CrossBase\input\controllers\wii-js\wii.min.js dist\CrossBrowdy\CrossBase\input\controllers\wii-js\

copy CrossBrowdy\CrossBase\input\cursors\*.* dist\CrossBrowdy\CrossBase\input\cursors\

copy CrossBrowdy\CrossBase\input\hammer.js\hammer.min.js dist\CrossBrowdy\CrossBase\input\hammer.js\

copy CrossBrowdy\CrossBase\input\hammer.js\hammer-time\hammer-time.min.js dist\CrossBrowdy\CrossBase\input\hammer.js\hammer-time\

copy CrossBrowdy\CrossBase\input\pressure.js\pressure.min.js dist\CrossBrowdy\CrossBase\input\pressure.js\


REM net:
copy CrossBrowdy\CrossBase\net\*.js dist\CrossBrowdy\CrossBase\net\

copy CrossBrowdy\CrossBase\net\fetch\*.js dist\CrossBrowdy\CrossBase\net\fetch\

copy CrossBrowdy\CrossBase\net\fetch\fetch-ie8\fetch.js dist\CrossBrowdy\CrossBase\net\fetch\fetch-ie8\

copy CrossBrowdy\CrossBase\net\proxy\*.* dist\CrossBrowdy\CrossBase\net\proxy\

copy CrossBrowdy\CrossBase\net\REST\*.js dist\CrossBrowdy\CrossBase\net\REST\

copy CrossBrowdy\CrossBase\net\sockets\*.js dist\CrossBrowdy\CrossBase\net\sockets\

copy CrossBrowdy\CrossBase\net\sockets\SockJS\sockjs.min.js dist\CrossBrowdy\CrossBase\net\sockets\SockJS\
copy CrossBrowdy\CrossBase\net\sockets\SockJS\sockjs-0.3.4.min.js dist\CrossBrowdy\CrossBase\net\sockets\SockJS\
copy CrossBrowdy\CrossBase\net\sockets\SockJS\sockjs-1.1.1.min.js dist\CrossBrowdy\CrossBase\net\sockets\SockJS\

copy CrossBrowdy\CrossBase\net\XHR\*.js dist\CrossBrowdy\CrossBase\net\XHR\


REM removes empty folders:
echo.
echo Removing empty folders...
ROBOCOPY dist\CrossBrowdy\ dist\CrossBrowdy\ /s /move /njh /njs


REM Compresses all generating a ZIP file (source: cam029 @ https://superuser.com/a/1151380):
echo.
echo Compressing all and generating ZIP file...
del /s /q dist\CrossBrowdy.dist.zip
setlocal
	set sourceDir=dist\CrossBrowdy\
	set zipFile=dist\CrossBrowdy.dist.zip

	REM Create PowerShell script:
	echo Write-Output 'Custom PowerShell profile in effect!'    > %~dp0TempZipScript.ps1
	echo Add-Type -A System.IO.Compression.FileSystem           >> %~dp0TempZipScript.ps1
	echo [IO.Compression.ZipFile]::CreateFromDirectory('%sourceDir%','%~dp0%zipFile%') >> %~dp0TempZipScript.ps1

	REM Execute script with flag "-ExecutionPolicy Bypass" to get around ExecutionPolicy:
	PowerShell.exe -ExecutionPolicy Bypass -Command "& '%~dp0TempZipScript.ps1'"
	del %~dp0TempZipScript.ps1
endlocal


REM Copies the ZIP file to the web site folder:
echo.
echo Copying ZIP file to the web site folder...
del crossbrowdy.com\files\CrossBrowdy.dist.zip
copy dist\CrossBrowdy.dist.zip crossbrowdy.com\files\CrossBrowdy.dist.zip


pause