@echo off
chcp 65001 >nul
echo 🚀 BidForm.online - Cloudflare Pages 部署
echo ==========================================
echo.

echo 📦 安装 Wrangler CLI...
npm install -g wrangler

echo 🔐 登录 Cloudflare...
echo 请在浏览器中完成登录...
wrangler login

echo 🏗️ 构建项目...
npm run build

echo 🚀 部署到 Cloudflare Pages...
wrangler pages deploy dist --project-name=bidform

if %errorlevel% equ 0 (
    echo.
    echo ✅ 部署成功！
    echo 🌐 你的网站将在几分钟内可用
    echo 📱 访问 Cloudflare Dashboard 查看部署状态
    echo 🔧 记得在 Dashboard 中设置环境变量
) else (
    echo.
    echo ❌ 部署失败
    echo 💡 请检查网络连接和 Cloudflare 账户权限
)

echo.
echo 📋 下一步：
echo 1. 访问 https://dash.cloudflare.com/pages
echo 2. 找到你的 bidform 项目
echo 3. 设置环境变量
echo 4. 配置自定义域名（如果需要）
echo.
pause