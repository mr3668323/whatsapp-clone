@echo off
REM Comprehensive Android Clean Build Script for Windows
REM This script removes ALL build artifacts and caches to ensure a fresh build

echo 🧹 Starting comprehensive Android clean build...

REM Stop Gradle daemon
echo Stopping Gradle daemon...
cd android
call gradlew.bat --stop
cd ..

REM Remove Android build artifacts
echo Removing Android build artifacts...
if exist android\app\build rmdir /s /q android\app\build
if exist android\build rmdir /s /q android\build
if exist android\.gradle rmdir /s /q android\.gradle
if exist android\app\.cxx rmdir /s /q android\app\.cxx

REM Remove Metro cache
echo Removing Metro cache...
if exist %TEMP%\metro-* rmdir /s /q %TEMP%\metro-*
if exist %TEMP%\haste-* rmdir /s /q %TEMP%\haste-*
if exist %TEMP%\react-* rmdir /s /q %TEMP%\react-*

REM Clear Android emulator cache (if app is installed)
echo Clearing app from emulator...
adb uninstall com.whatsapp.clone 2>nul || echo App not installed, skipping...

echo ✅ Clean complete! Now run:
echo    yarn start --reset-cache
echo    yarn android
