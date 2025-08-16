#!/bin/bash

# BidForm.online 快速部署脚本

echo "🚀 BidForm.online 部署脚本"
echo "=========================="

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误: 请在项目根目录运行此脚本"
    exit 1
fi

# 检查 git 状态
echo "📋 检查 Git 状态..."
git status

# 添加所有更改
echo "📦 添加文件到 Git..."
git add .

# 提交更改
echo "💾 提交更改..."
read -p "请输入提交信息 (默认: Update project): " commit_message
commit_message=${commit_message:-"Update project"}
git commit -m "$commit_message"

# 推送到 GitHub
echo "🔄 推送到 GitHub..."
echo "如果这是第一次推送，请确保已在 GitHub 创建仓库: https://github.com/manulinco/bidform"
echo "如果遇到权限问题，请使用个人访问令牌作为密码"

git push -u origin main

if [ $? -eq 0 ]; then
    echo "✅ 成功推送到 GitHub!"
    echo "🌐 仓库地址: https://github.com/manulinco/bidform"
    echo ""
    echo "🚀 下一步部署选项:"
    echo "1. Vercel: https://vercel.com (推荐)"
    echo "2. Netlify: https://netlify.com"
    echo "3. GitHub Pages: 在仓库设置中启用"
    echo ""
    echo "📖 详细部署指南请查看 DEPLOYMENT.md"
else
    echo "❌ 推送失败，请检查:"
    echo "1. GitHub 仓库是否已创建"
    echo "2. 是否有推送权限"
    echo "3. 网络连接是否正常"
    echo ""
    echo "💡 解决方案:"
    echo "1. 访问 https://github.com/new 创建仓库"
    echo "2. 使用个人访问令牌进行身份验证"
    echo "3. 查看 DEPLOYMENT.md 获取详细指南"
fi