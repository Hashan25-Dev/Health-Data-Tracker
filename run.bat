@echo off
echo Starting Backend Server...
start "Health Tracker Backend" cmd /k "cd /d C:\Users\Windows\Desktop\AAA\backend && .\venv\Scripts\python app.py"

echo Starting Frontend Server...
start "Health Tracker Frontend" cmd /k "cd /d C:\Users\Windows\Desktop\AAA\frontend && npm run dev"

echo Applications are starting in separate windows.
echo You can now access the app at http://localhost:3000 (or http://localhost:3001)
