@echo off

echo Copying the API documentation files to the temp folder...
robocopy /e documentation _zip_temp\CrossBrowdy\documentation\ /xd node_modules
echo.
echo Copying CrossBrowdy files...
robocopy /e CrossBrowdy _zip_temp\CrossBrowdy\CrossBrowdy\

REM Compresses all generating a ZIP file (source: cam029 @ https://superuser.com/a/1151380):
echo.
echo Compressing all and generating ZIP file...
setlocal
	set sourceDir=_zip_temp\CrossBrowdy\
	set zipFile=_zip_temp\CrossBrowdy.zip

	REM Create PowerShell script:
	echo Write-Output 'Custom PowerShell profile in effect!'    > %~dp0TempZipScript.ps1
	echo Add-Type -A System.IO.Compression.FileSystem           >> %~dp0TempZipScript.ps1
	echo [IO.Compression.ZipFile]::CreateFromDirectory('%sourceDir%','%~dp0%zipFile%') >> %~dp0TempZipScript.ps1

	REM Execute script with flag "-ExecutionPolicy Bypass" to get around ExecutionPolicy:
	PowerShell.exe -ExecutionPolicy Bypass -Command "& '%~dp0TempZipScript.ps1'"
	del %~dp0TempZipScript.ps1
endlocal

REM Deletes previous dist zip file (if exists):
IF EXIST "crossbrowdy.com\files\CrossBrowdy.zip" (
	echo.
	echo Deleting previous zip file...
	del crossbrowdy.com\files\CrossBrowdy.zip
)

REM Copies the ZIP file to the web site folder:
echo.
echo Copying ZIP file to the web site folder...
copy _zip_temp\CrossBrowdy.zip crossbrowdy.com\files\CrossBrowdy.zip

echo Removing temp folder...
rmdir /s /q _zip_temp

pause