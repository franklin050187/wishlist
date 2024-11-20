@echo off
ECHO Starting development environment...

:: Check if node_modules exists, if not install dependencies
IF NOT EXIST node_modules (
    ECHO Installing dependencies...
    npm install
    IF %ERRORLEVEL% NEQ 0 (
        ECHO Error installing dependencies
        pause
        exit /b %ERRORLEVEL%
    )
)

:: Verify Next.js installation
ECHO Verifying Next.js installation...
npm list next || (
    ECHO Installing Next.js...
    npm install next react react-dom
    IF %ERRORLEVEL% NEQ 0 (
        ECHO Error installing Next.js
        pause
        exit /b %ERRORLEVEL%
    )
)

:: Check if .env.local exists
IF NOT EXIST .env.local (
    ECHO Creating .env.local file...
    (
        ECHO NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
        ECHO NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
    ) > .env.local
    ECHO Please update .env.local with your Supabase credentials
    notepad .env.local
)

:: Run tests first
ECHO Running tests...
npm run test
IF %ERRORLEVEL% NEQ 0 (
    ECHO Warning: Tests failed! Press any key to continue anyway...
    pause
)

:: Start development server
ECHO Starting development server...
start npm run dev

:: Open browser after a short delay
timeout /t 5 /nobreak
start http://localhost:3000

ECHO Development environment is ready!
ECHO Press Ctrl+C to stop the server
pause 