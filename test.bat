@echo off
ECHO Running test suite...

:: Run lint
ECHO Running lint...
npm run lint
IF %ERRORLEVEL% NEQ 0 (
    ECHO Lint failed!
    pause
    exit /b %ERRORLEVEL%
)

:: Run type check
ECHO Running type check...
npm run type-check
IF %ERRORLEVEL% NEQ 0 (
    ECHO Type check failed!
    pause
    exit /b %ERRORLEVEL%
)

:: Run tests
ECHO Running tests...
npm run test
IF %ERRORLEVEL% NEQ 0 (
    ECHO Tests failed!
    pause
    exit /b %ERRORLEVEL%
)

ECHO All tests passed!
pause 