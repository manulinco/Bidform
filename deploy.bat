@echo off
chcp 65001 >nul
echo 🚀 BidForm.online 部署脚本
echo ==========================
echo.

REM 检查是否在正确的目录
if not exist "package.json" (
    echo ❌ 错误: 请在项目根目录运行此脚本
    pause
    exit /b 1
)

REM 检查 git 状态
echo 📋 检查 Git 状态...
git status
echo.

REM 添加所有更改
echo 📦 添加文件到 Git...
git add .

REM 提交更改
set /p commit_message="请输入提交信息 (默认: Update project): "
if "%commit_message%"=="" set commit_message=Update project
echo 💾 提交更改: %commit_message%
git commit -m "%commit_message%"

REM 推送到 GitHub
echo.
echo 🔄 推送到 GitHub...
echo 如果这是第一次推送，请确保已在 GitHub 创建仓库: https://github.com/manulinco/bidform
echo 如果遇到权限问题，请使用个人访问令牌作为密码
echo.

git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ✅ 成功推送到 GitHub!
    echo 🌐 仓库地址: https://github.com/manulinco/bidform
    echo.
    echo 🚀 下一步部署选项:
    echo 1. Vercel: https://vercel.com ^(推荐^)
    echo 2. Netlify: https://netlify.com
    echo 3. GitHub Pages: 在仓库设置中启用
    echo.
    echo 📖 详细部署指南请查看 DEPLOYMENT.md
) else (
    echo.
    echo ❌ 推送失败，请检查:
    echo 1. GitHub 仓库是否已创建
    echo 2. 是否有推送权限
    echo 3. 网络连接是否正常
    echo.
    echo 💡 解决方案:
    echo 1. 访问 https://github.com/new 创建仓库
    echo 2. 使用个人访问令牌进行身份验证
    echo 3. 查看 DEPLOYMENT.md 获取详细指南
)

echo.
pause