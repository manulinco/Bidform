@echo off
chcp 65001 >nul
echo 🚀 BidForm Cloudflare Pages 部署脚本
echo =====================================
echo.

echo 📋 检查系统环境...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: 未找到 Node.js，请先安装 Node.js
    echo 📥 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js 已安装
echo.

echo 📦 检查 Wrangler CLI...
where wrangler >nul 2>nul
if %errorlevel% neq 0 (
    echo 📥 安装 Wrangler CLI...
    npm install -g wrangler
    if %errorlevel% neq 0 (
        echo ❌ Wrangler CLI 安装失败
        pause
        exit /b 1
    )
    echo ✅ Wrangler CLI 安装成功
) else (
    echo ✅ Wrangler CLI 已安装
)
echo.

echo 🔐 登录 Cloudflare...
echo 📝 浏览器将打开，请登录你的 Cloudflare 账户
wrangler login
if %errorlevel% neq 0 (
    echo ❌ Cloudflare 登录失败
    pause
    exit /b 1
)
echo ✅ Cloudflare 登录成功
echo.

echo 📋 创建 Pages 项目...
echo 📝 项目名称: bidform-app
wrangler pages project create bidform-app
echo.

echo 🏗️ 构建项目...
npm run build
if %errorlevel% neq 0 (
    echo ❌ 项目构建失败
    echo 💡 请检查代码是否有错误
    pause
    exit /b 1
)
echo ✅ 项目构建成功
echo.

echo 🚀 部署到 Cloudflare Pages...
wrangler pages deploy dist --project-name=bidform-app
if %errorlevel% neq 0 (
    echo ❌ 部署失败
    pause
    exit /b 1
)

echo.
echo 🎉 部署成功！
echo =====================================
echo 🌐 访问地址: https://bidform-app.pages.dev
echo 🧪 测试页面: https://bidform-app.pages.dev/test
echo.
echo 📝 下一步:
echo 1. 在 Cloudflare Pages 设置中添加环境变量
echo 2. 配置 Supabase 和 Stripe 密钥
echo 3. 测试所有功能是否正常
echo.
echo 📖 详细指南请查看: DEPLOY_GUIDE.md
echo.
pause