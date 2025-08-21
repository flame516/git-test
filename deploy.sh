#!/bin/bash

# 湖北省创业扶持数据展示平台 - 部署脚本

echo "🚀 开始部署湖北省创业扶持数据展示平台..."

# 检查Node.js版本
echo "📋 检查环境..."
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未找到Node.js，请先安装Node.js 16+"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ 错误: Node.js版本过低，需要16+，当前版本: $(node -v)"
    exit 1
fi

echo "✅ Node.js版本: $(node -v)"

# 检查npm版本
if ! command -v npm &> /dev/null; then
    echo "❌ 错误: 未找到npm，请先安装npm"
    exit 1
fi

echo "✅ npm版本: $(npm -v)"

# 安装依赖
echo "📦 安装项目依赖..."
if npm install; then
    echo "✅ 依赖安装成功"
else
    echo "❌ 依赖安装失败"
    exit 1
fi

# 构建项目
echo "🔨 构建生产版本..."
if npm run build; then
    echo "✅ 构建成功"
else
    echo "❌ 构建失败"
    exit 1
fi

# 检查构建结果
if [ -d "build" ]; then
    echo "✅ 构建目录创建成功"
    echo "📁 构建文件列表:"
    ls -la build/
else
    echo "❌ 构建目录未找到"
    exit 1
fi

# 启动本地预览服务器（可选）
echo "🌐 启动本地预览服务器..."
echo "📱 访问地址: http://localhost:3000"
echo "🔄 按 Ctrl+C 停止服务器"
echo ""

# 使用serve包启动本地服务器
if command -v npx &> /dev/null; then
    npx serve -s build -l 3000
else
    echo "⚠️  无法启动预览服务器，请手动运行: npx serve -s build -l 3000"
    echo "或者直接打开 build/index.html 文件"
fi

echo ""
echo "🎉 部署完成！"
echo ""
echo "📋 部署说明:"
echo "1. 构建文件位于 build/ 目录"
echo "2. 可将 build/ 目录部署到任何静态网站托管服务"
echo "3. 支持Netlify、Vercel、GitHub Pages等平台"
echo ""
echo "🔗 相关链接:"
echo "- 项目文档: README.md"
echo "- 部署配置: netlify.toml"
echo "- 构建配置: package.json"
pause