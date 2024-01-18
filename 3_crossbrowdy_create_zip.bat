@echo off

set tempDir=_zip_temp
set sourceDir=%tempDir%\CrossBrowdy\
set zipFile=%tempDir%\CrossBrowdy.zip

echo Copying the API documentation files to the temp folder...
robocopy /e documentation %sourceDir%documentation\ /xd node_modules
echo.
echo Copying CrossBrowdy files...
robocopy /e CrossBrowdy %sourceDir%CrossBrowdy\


REM Compresses all generating a ZIP file (source: cam029 @ https://superuser.com/a/1151380):
echo.
echo Compressing all and generating ZIP file...
setlocal
	REM Create PowerShell script:
	echo Write-Output 'Custom PowerShell profile in effect!'    > %~dp0TempZipScript.ps1
	echo Add-Type -A System.IO.Compression.FileSystem           >> %~dp0TempZipScript.ps1
	echo [IO.Compression.ZipFile]::CreateFromDirectory('%sourceDir%','%~dp0%zipFile%') >> %~dp0TempZipScript.ps1

	REM Execute script with flag "-ExecutionPolicy Bypass" to get around ExecutionPolicy:
	PowerShell.exe -ExecutionPolicy Bypass -Command "& '%~dp0TempZipScript.ps1'"
	del %~dp0TempZipScript.ps1
endlocal


REM Detects current CrossBrowdy version:
echo Detecting CrossBrowdy version...
for /F "tokens=* USEBACKQ" %%F in (`call php _scripts/detect_version.php`) do (set CB_VERSION=%%F)
echo Version detected: "%CB_VERSION%"


REM Deletes previous zip files (if they exist):
if exist "crossbrowdy.com\files\CrossBrowdy.zip" (
	echo.
	echo Deleting previous zip file without version...
	del crossbrowdy.com\files\CrossBrowdy.zip
)
if exist "crossbrowdy.com\files\CrossBrowdy_%CB_VERSION%.zip" (
	echo.
	echo Deleting previous zip file with version...
	del crossbrowdy.com\files\CrossBrowdy_%CB_VERSION%.zip
)

REM Copies the ZIP file to the web site folder:
echo.
echo Copying ZIP file to the web site folder...
copy %zipfile% crossbrowdy.com\files\CrossBrowdy_%CB_VERSION%.zip

echo Removing temp folder...
rmdir /s /q %tempDir%

pause