@echo off
setlocal EnableExtensions EnableDelayedExpansion
chcp 65001 >nul
pushd "%~dp0"

title 湖北省创业扶持数据展示平台 - 部署脚本

echo 🚀 开始部署湖北省创业扶持数据展示平台...

echo 📋 检查环境...

:: =====================
:: 检查 Node.js 是否可用
:: =====================
where node >nul 2>nul || (
    echo ❌ 错误: 未找到 Node.js，请先安装 Node.js 16+（并重新打开命令行窗口）
    goto :end_fail
)

:: 使用 Node 自己输出主版本号，修复 Windows CMD 引号转义问题
for /f %%v in ('node -p "process.versions.node.split('.')[0]"') do set NODE_MAJOR=%%v

if not defined NODE_MAJOR (
    echo ❌ 无法解析 Node.js 版本：
    node -v
    goto :end_fail
)
if !NODE_MAJOR! lss 16 (
    echo ❌ 错误: Node.js 版本过低，需要 16+，当前:
    node -v
    goto :end_fail
)

echo ✅ Node.js 版本:
node -v

:: =====================
:: 检查 npm 是否可用
:: =====================
where npm >nul 2>nul || (
    echo ❌ 未找到 npm：
    echo    - 如果你用的是壓縮包版 Node，請確保 npm 已解壓到同一目錄；
    echo    - 如果你用的是 nvm/nvs/volta，請在當前窗口激活對應 Node；
    echo    - 或者重新登出/重啟終端以刷新 PATH。
    goto :end_fail
)

for /f %%v in ('npm -v 2^>nul') do set NPM_VERSION=%%v
if not defined NPM_VERSION (
    echo ❌ 執行 "npm -v" 失敗（可能是 PATH 或權限問題）。
    echo    請先在命令行手動執行: npm -v
    goto :end_fail
)

echo ✅ npm 版本: !NPM_VERSION!

:: =====================
:: 安装依赖
:: =====================
echo 📦 安装项目依赖...
call npm install
if errorlevel 1 (
    echo ❌ 依赖安装失败
    goto :end_fail
)
echo ✅ 依赖安装成功

:: =====================
:: 构建项目
:: =====================
echo 🔨 构建生产版本...
call npm run build
if errorlevel 1 (
    echo ❌ 构建失败
    goto :end_fail
)
echo ✅ 构建成功

:: =====================
:: 检查构建结果
:: =====================
if exist build (
    echo ✅ 构建目录创建成功
    echo 📁 构建文件列表（部分）:
    dir /b build | more
) else (
    echo ❌ 构建目录未找到
    goto :end_fail
)

:: =====================
:: 启动本地预览服务器
:: =====================
echo 🌐 启动本地预览服务器...
echo 📱 访问地址: http://localhost:3000

where npx >nul 2>nul && (
    call npx serve -s build -l 3000
) || (
    echo ⚠️ 未检测到 npx，尝试使用 npm exec...
    call npm exec --yes serve -s build -l 3000 || (
        echo ⚠️ 仍无法启动预览服务器。
        echo    你可以手动执行: npx serve -s build -l 3000
        echo    或全局安装: npm i -g serve ^&^& serve -s build -l 3000
    )
)

echo.
echo 🎉 部署完成！

echo.
echo 📋 部署说明:
echo 1. 构建文件位于 build\ 目录
echo 2. 可将 build\ 目录部署到任何静态网站托管服务
echo 3. 支持 Netlify、Vercel、GitHub Pages 等平台

echo.
echo 🔗 相关链接:
echo - 项目文档: README.md
echo - 部署配置: netlify.toml
echo - 构建配置: package.json

goto :the_end

:end_fail
echo.
echo 按任意键退出...
pause >nul
exit /b 1

:the_end
pause
exit /b 0
