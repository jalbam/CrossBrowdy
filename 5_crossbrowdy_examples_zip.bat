@echo off

echo Removing examples folder...
rmdir /s /q crossbrowdy.com\files\examples

echo.
echo Copying necessary files...
xcopy /e /h dist\CrossBrowdy\*.* crossbrowdy.com\files\examples\CrossBrowdy\
copy dist\test.html crossbrowdy.com\files\examples\
xcopy /e /h crossbrowdy.com\_html\_doc\examples\*.* crossbrowdy.com\files\examples\_html\_doc\examples\

echo.
echo Deleting PHP files...
del /s /q crossbrowdy.com\files\examples\_html\*.php

echo.
echo Removing empty folders...
ROBOCOPY crossbrowdy.com\files\examples\ crossbrowdy.com\files\examples\ /s /move /njh /njs

echo.
echo Copying LICENSE file...
copy LICENSE crossbrowdy.com\files\examples\

REM Compresses all generating a ZIP file (source: cam029 @ https://superuser.com/a/1151380):
echo.
echo Compressing all and generating ZIP file...
del /s /q crossbrowdy.com\files\examples.zip
setlocal
	set sourceDir=crossbrowdy.com\files\examples\
	set zipFile=crossbrowdy.com\files\examples.zip

	REM Create PowerShell script:
	echo Write-Output 'Custom PowerShell profile in effect!'    > %~dp0TempZipScript.ps1
	echo Add-Type -A System.IO.Compression.FileSystem           >> %~dp0TempZipScript.ps1
	echo [IO.Compression.ZipFile]::CreateFromDirectory('%sourceDir%','%~dp0%zipFile%') >> %~dp0TempZipScript.ps1

	REM Execute script with flag "-ExecutionPolicy Bypass" to get around ExecutionPolicy:
	PowerShell.exe -ExecutionPolicy Bypass -Command "& '%~dp0TempZipScript.ps1'"
	del %~dp0TempZipScript.ps1
endlocal

echo.
echo Deleting examples folder...
rmdir /s /q crossbrowdy.com\files\examples

pause