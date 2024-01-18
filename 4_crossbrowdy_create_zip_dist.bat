@echo off

set distDir=dist
set sourceDir=%distDir%\CrossBrowdy
set zipFile=%distDir%\CrossBrowdy.dist.zip

echo Removing folder and creating empty structure...

rmdir /s /q %sourceDir%
xcopy /t /e CrossBrowdy\*.* %sourceDir%\

echo.
echo Copying necessary files...


REM main:
copy CrossBrowdy\LICENSE %sourceDir%\
copy CrossBrowdy\*.js %sourceDir%\
copy CrossBrowdy\CrossBase\*.js %sourceDir%\CrossBase\


REM audio:
copy CrossBrowdy\CrossBase\audiovisual\audio\*.js %sourceDir%\CrossBase\audiovisual\audio\

copy CrossBrowdy\CrossBase\audiovisual\audio\AudioContextMonkeyPatch\*.js %sourceDir%\CrossBase\audiovisual\audio\AudioContextMonkeyPatch\

copy CrossBrowdy\CrossBase\audiovisual\audio\band.js\band.min.js %sourceDir%\CrossBase\audiovisual\audio\band.js\

copy CrossBrowdy\CrossBase\audiovisual\audio\jsfx\jsfx.js %sourceDir%\CrossBase\audiovisual\audio\jsfx\

copy CrossBrowdy\CrossBase\audiovisual\audio\soundmanager2\script\soundmanager2-nodebug-jsmin.js %sourceDir%\CrossBase\audiovisual\audio\soundmanager2\script\
copy CrossBrowdy\CrossBase\audiovisual\audio\soundmanager2\swf\soundmanager2.swf %sourceDir%\CrossBase\audiovisual\audio\soundmanager2\swf\
copy CrossBrowdy\CrossBase\audiovisual\audio\soundmanager2\swf\soundmanager2_flash9.swf %sourceDir%\CrossBase\audiovisual\audio\soundmanager2\swf\

copy CrossBrowdy\CrossBase\audiovisual\audio\sounds\*.* %sourceDir%\CrossBase\audiovisual\audio\sounds\

copy CrossBrowdy\CrossBase\audiovisual\audio\timbre.js\timbre.js %sourceDir%\CrossBase\audiovisual\audio\timbre.js\
copy CrossBrowdy\CrossBase\audiovisual\audio\timbre.js\timbre.swf %sourceDir%\CrossBase\audiovisual\audio\timbre.js\
copy CrossBrowdy\CrossBase\audiovisual\audio\timbre.js\subcollider\subcollider.js %sourceDir%\CrossBase\audiovisual\audio\timbre.js\subcollider\

copy CrossBrowdy\CrossBase\audiovisual\audio\WAAPISim\waapisim.min.js %sourceDir%\CrossBase\audiovisual\audio\WAAPISim\
copy CrossBrowdy\CrossBase\audiovisual\audio\WAAPISim\waapisim.swf %sourceDir%\CrossBase\audiovisual\audio\WAAPISim\


REM image:
copy CrossBrowdy\CrossBase\audiovisual\image\*.js %sourceDir%\CrossBase\audiovisual\image\

copy CrossBrowdy\CrossBase\audiovisual\image\canvas\*.js %sourceDir%\CrossBase\audiovisual\image\canvas\

copy CrossBrowdy\CrossBase\audiovisual\image\canvas\canbox\canbox.0.2.1.js %sourceDir%\CrossBase\audiovisual\image\canvas\canbox\

copy CrossBrowdy\CrossBase\audiovisual\image\canvas\excanvas_with_canvas_text\*.js %sourceDir%\CrossBase\audiovisual\image\canvas\excanvas_with_canvas_text\

copy CrossBrowdy\CrossBase\audiovisual\image\canvas\FlashCanvas\pro\bin\flashcanvas.js %sourceDir%\CrossBase\audiovisual\image\canvas\FlashCanvas\pro\bin\
copy CrossBrowdy\CrossBase\audiovisual\image\canvas\FlashCanvas\pro\bin\*.swf %sourceDir%\CrossBase\audiovisual\image\canvas\FlashCanvas\pro\bin\

copy CrossBrowdy\CrossBase\audiovisual\image\canvas\slcanvas\*.js %sourceDir%\CrossBase\audiovisual\image\canvas\slcanvas\
copy CrossBrowdy\CrossBase\audiovisual\image\canvas\slcanvas\*.png %sourceDir%\CrossBase\audiovisual\image\canvas\slcanvas\
copy CrossBrowdy\CrossBase\audiovisual\image\canvas\slcanvas\ClientBin\*.xap %sourceDir%\CrossBase\audiovisual\image\canvas\slcanvas\ClientBin\

copy CrossBrowdy\CrossBase\audiovisual\image\detect_zoom\*.js %sourceDir%\CrossBase\audiovisual\image\detect_zoom\
copy CrossBrowdy\CrossBase\audiovisual\image\NoSleep\NoSleep.min.js %sourceDir%\CrossBase\audiovisual\image\NoSleep\


REM device:
copy CrossBrowdy\CrossBase\device\*.js %sourceDir%\CrossBase\device\


REM general:
copy CrossBrowdy\CrossBase\general\*.js %sourceDir%\CrossBase\general\

copy CrossBrowdy\CrossBase\general\bluebird\bluebird.min.js %sourceDir%\CrossBase\general\bluebird\

copy CrossBrowdy\CrossBase\general\JSON3\json3.min.js %sourceDir%\CrossBase\general\JSON3\

copy CrossBrowdy\CrossBase\general\localStorage\localStorage.min.js %sourceDir%\CrossBase\general\localStorage\
copy CrossBrowdy\CrossBase\general\localStorage\localStorage.swf %sourceDir%\CrossBase\general\localStorage\

copy CrossBrowdy\CrossBase\general\lz-string\lz-string.min.js %sourceDir%\CrossBase\general\lz-string\
copy CrossBrowdy\CrossBase\general\lz-string\base64-string.js %sourceDir%\CrossBase\general\lz-string\

copy CrossBrowdy\CrossBase\general\others\*.js %sourceDir%\CrossBase\general\others\

copy CrossBrowdy\CrossBase\general\PHP\*.* %sourceDir%\CrossBase\general\PHP\


REM input:
copy CrossBrowdy\CrossBase\input\*.js %sourceDir%\CrossBase\input\

copy CrossBrowdy\CrossBase\input\controllers\*.js %sourceDir%\CrossBase\input\controllers\

copy CrossBrowdy\CrossBase\input\controllers\gamepad-plus\*.js %sourceDir%\CrossBase\input\controllers\gamepad-plus\

copy CrossBrowdy\CrossBase\input\controllers\wii-js\wii.min.js %sourceDir%\CrossBase\input\controllers\wii-js\

copy CrossBrowdy\CrossBase\input\cursors\*.* %sourceDir%\CrossBase\input\cursors\

copy CrossBrowdy\CrossBase\input\hammer.js\hammer.min.js %sourceDir%\CrossBase\input\hammer.js\

copy CrossBrowdy\CrossBase\input\hammer.js\hammer-time\hammer-time.min.js %sourceDir%\CrossBase\input\hammer.js\hammer-time\

copy CrossBrowdy\CrossBase\input\pressure.js\pressure.min.js %sourceDir%\CrossBase\input\pressure.js\


REM net:
copy CrossBrowdy\CrossBase\net\*.js %sourceDir%\CrossBase\net\

copy CrossBrowdy\CrossBase\net\fetch\*.js %sourceDir%\CrossBase\net\fetch\

copy CrossBrowdy\CrossBase\net\fetch\fetch-ie8\fetch.js %sourceDir%\CrossBase\net\fetch\fetch-ie8\

copy CrossBrowdy\CrossBase\net\proxy\*.* %sourceDir%\CrossBase\net\proxy\

copy CrossBrowdy\CrossBase\net\REST\*.js %sourceDir%\CrossBase\net\REST\

copy CrossBrowdy\CrossBase\net\sockets\*.js %sourceDir%\CrossBase\net\sockets\

copy CrossBrowdy\CrossBase\net\sockets\SockJS\sockjs.min.js %sourceDir%\CrossBase\net\sockets\SockJS\
copy CrossBrowdy\CrossBase\net\sockets\SockJS\sockjs-0.3.4.min.js %sourceDir%\CrossBase\net\sockets\SockJS\
copy CrossBrowdy\CrossBase\net\sockets\SockJS\sockjs-1.1.1.min.js %sourceDir%\CrossBase\net\sockets\SockJS\

copy CrossBrowdy\CrossBase\net\XHR\*.js %sourceDir%\CrossBase\net\XHR\


REM removes empty folders:
echo.
echo Removing empty folders...
ROBOCOPY %sourceDir%\ %sourceDir%\ /s /move /njh /njs


REM Compresses all generating a ZIP file (source: cam029 @ https://superuser.com/a/1151380):
echo.
echo Compressing all and generating ZIP file...
del /s /q %zipFile%
setlocal
	REM Create PowerShell script:
	echo Write-Output 'Custom PowerShell profile in effect!'    > %~dp0TempZipScript.ps1
	echo Add-Type -A System.IO.Compression.FileSystem           >> %~dp0TempZipScript.ps1
	echo [IO.Compression.ZipFile]::CreateFromDirectory('%sourceDir%\','%~dp0%zipFile%') >> %~dp0TempZipScript.ps1

	REM Execute script with flag "-ExecutionPolicy Bypass" to get around ExecutionPolicy:
	PowerShell.exe -ExecutionPolicy Bypass -Command "& '%~dp0TempZipScript.ps1'"
	del %~dp0TempZipScript.ps1
endlocal


REM Detects current CrossBrowdy version:
echo Detecting CrossBrowdy version...
for /F "tokens=* USEBACKQ" %%F in (`call php _scripts/detect_version.php`) do (set CB_VERSION=%%F)
echo Version detected: "%CB_VERSION%"


REM Deletes previous dist zip files (if they exist):
IF EXIST "crossbrowdy.com\files\CrossBrowdy.dist.zip" (
	echo.
	echo Deleting previous zip file...
	del crossbrowdy.com\files\CrossBrowdy.dist.zip
)
IF EXIST "crossbrowdy.com\files\CrossBrowdy_%CB_VERSION%.dist.zip" (
	echo.
	echo Deleting previous zip file...
	del crossbrowdy.com\files\CrossBrowdy_%CB_VERSION%.dist.zip
)


REM Copies the ZIP file to the web site folder:
echo.
echo Copying ZIP file to the web site folder...
copy %zipFile% crossbrowdy.com\files\CrossBrowdy_%CB_VERSION%.dist.zip


pause