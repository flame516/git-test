@echo off
chcp 65001 >nul

echo 🚀 启动湖北省创业扶持数据展示平台...

:: 检查 Node.js 是否安装
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ 错误: 未找到 Node.js，请先安装 Node.js
    pause
)

:: 检查 npm 是否安装
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ 错误: 未找到 npm，请先安装 npm
    pause
)

:: 显示版本信息
echo 📋 环境信息:
for /f "delims=" %%i in ('node --version') do set NODE_VER=%%i
for /f "delims=" %%i in ('npm --version') do set NPM_VER=%%i
echo    Node.js版本: %NODE_VER%
echo    npm版本: %NPM_VER%
echo.

:: 检查依赖是否安装
if not exist "node_modules" (
    echo 📦 安装项目依赖...
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ 依赖安装失败
        pause
    )
    echo ✅ 依赖安装完成
)

:: 启动开发服务器
echo 🌐 启动开发服务器...
echo    访问地址: http://localhost:3000
echo    按 Ctrl+C 停止服务器
echo.

call npm start
pause
