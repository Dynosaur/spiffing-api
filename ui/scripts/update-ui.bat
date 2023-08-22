@ECHO off
IF NOT EXIST "..\dist" (
    ECHO %~dp0dist does not exist.
    ECHO Please run ng build --prod to build.
    EXIT /B 1
)
IF NOT EXIST "..\dist\spiffing" (
    ECHO %~dp0dist\spiffing does not exist.
    ECHO Please run ng build --prod to build.
    EXIT /B 1
)
IF NOT EXIST "..\..\spiffing-api" (
    ECHO %~dp0..\..\spiffing-api does not exist.
    ECHO Please run ng build --prod to build.
    EXIT /B 1
)
IF EXIST "..\..\spiffing-api\spiffing" RMDIR ..\..\spiffing-api\spiffing /S /Q
ROBOCOPY ..\dist\spiffing ..\..\spiffing-api\spiffing /E > NUL
ECHO Success.