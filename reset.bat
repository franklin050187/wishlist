@echo off
ECHO Cleaning development environment...

:: Stop any running Node processes
taskkill /F /IM node.exe /T

:: Clean cache and modules
ECHO Cleaning cache and modules...
IF EXIST .next (
    rd /s /q .next
)
IF EXIST node_modules (
    rd /s /q node_modules
)
IF EXIST .env.local (
    del .env.local
)

:: Clear npm cache
npm cache clean --force

:: Reinstall everything fresh
ECHO Reinstalling dependencies...
npm install

ECHO Environment reset complete!
ECHO Run dev.bat to start development
pause 