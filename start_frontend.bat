@echo off
echo [1/3] Setting Docker context to desktop-linux...
docker context use desktop-linux

echo [2/3] Removing old container if exists...
docker rm -f bbt-frontend 2>nul

echo [3/3] Starting React frontend in Docker...
docker run -d --name bbt-frontend ^
  --add-host=host.docker.internal:host-gateway ^
  -v "%~dp0brain-tumor-app:/app" ^
  -w /app ^
  -p 3000:3000 ^
  node:24-slim ^
  sh -c "npm install && npx vite --host 0.0.0.0"

echo.
echo Waiting for Vite to start...
timeout /t 15 /nobreak >nul

echo.
echo Checking container logs:
docker logs bbt-frontend

echo.
echo === Frontend should be at: http://localhost:3000 ===
pause
