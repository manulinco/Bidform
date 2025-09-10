#!/bin/bash

# 设置颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 BidForm Cloudflare Pages 部署脚本${NC}"
echo "====================================="
echo

echo -e "${YELLOW}📋 检查系统环境...${NC}"

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ 错误: 未找到 Node.js，请先安装 Node.js${NC}"
    echo -e "${BLUE}📥 安装指南: https://nodejs.org/${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js 已安装: $(node --version)${NC}"
echo

echo -e "${YELLOW}📦 检查 Wrangler CLI...${NC}"

# 检查并安装 Wrangler CLI
if ! command -v wrangler &> /dev/null; then
    echo -e "${YELLOW}📥 安装 Wrangler CLI...${NC}"
    npm install -g wrangler
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Wrangler CLI 安装失败${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Wrangler CLI 安装成功${NC}"
else
    echo -e "${GREEN}✅ Wrangler CLI 已安装: $(wrangler --version)${NC}"
fi
echo

echo -e "${YELLOW}🔐 登录 Cloudflare...${NC}"
echo -e "${BLUE}📝 浏览器将打开，请登录你的 Cloudflare 账户${NC}"
wrangler login
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Cloudflare 登录失败${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Cloudflare 登录成功${NC}"
echo

echo -e "${YELLOW}📋 创建 Pages 项目...${NC}"
echo -e "${BLUE}📝 项目名称: bidform-app${NC}"
wrangler pages project create bidform-app
echo

echo -e "${YELLOW}🏗️ 构建项目...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ 项目构建失败${NC}"
    echo -e "${YELLOW}💡 请检查代码是否有错误${NC}"
    exit 1
fi
echo -e "${GREEN}✅ 项目构建成功${NC}"
echo

echo -e "${YELLOW}🚀 部署到 Cloudflare Pages...${NC}"
wrangler pages deploy dist --project-name=bidform-app
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ 部署失败${NC}"
    exit 1
fi

echo
echo -e "${GREEN}🎉 部署成功！${NC}"
echo "====================================="
echo -e "${BLUE}🌐 访问地址: https://bidform-app.pages.dev${NC}"
echo -e "${BLUE}🧪 测试页面: https://bidform-app.pages.dev/test${NC}"
echo
echo -e "${YELLOW}📝 下一步:${NC}"
echo "1. 在 Cloudflare Pages 设置中添加环境变量"
echo "2. 配置 Supabase 和 Stripe 密钥"
echo "3. 测试所有功能是否正常"
echo
echo -e "${BLUE}📖 详细指南请查看: DEPLOY_GUIDE.md${NC}"
echo