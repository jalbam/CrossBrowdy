@echo off
echo Deleting previous CrossBrowdy files from the web site folder...
del /s /q crossbrowdy.com\CrossBrowdy\*.*
echo.
echo Copying CrossBrowdy files to the web site folder...
xcopy /e /h CrossBrowdy\*.* crossbrowdy.com\CrossBrowdy\
PAUSE