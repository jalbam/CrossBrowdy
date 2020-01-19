@echo OFF

REM Generates the API documentation (normal and the more printer-friendly one):
echo Generating normal API documentation...
call jsdoc CrossBrowdy -c documentation_jsdoc_conf.json -t ./documentation/node_modules/ink-docstrap/template --verbose -R README.md

echo.
echo Generating the more printer-frindly API documentation...
call jsdoc CrossBrowdy -c documentation_jsdoc_conf_printable.json -t ./documentation/node_modules/ink-docstrap_printable/template --verbose -R README.md


REM Asks for copying the API documentation to the web site folder:
echo.
set /p QUESTIONCOPY=Do you want to copy the API documentation to the web site folder (Y/[N])? 
if /i "%QUESTIONCOPY%" NEQ "Y" goto END

REM Copies the API documentation to the web site folder:
echo.
echo Deleting previous API documentation files from the web site folder...
rmdir /s /q crossbrowdy.com\_html\_doc\api
echo.
echo Copying the new API documentation files to the web site folder...
robocopy /e documentation crossbrowdy.com\_html\_doc\api\ /xd node_modules
PAUSE

:END
echo.
echo Batch finished