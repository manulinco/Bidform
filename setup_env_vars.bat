@echo off
chcp 65001 >nul
echo 🔧 Cloudflare Pages 环境变量自动配置脚本
echo =============================================
echo.

echo 📋 将为项目 bidform-app 设置以下环境变量:
echo 1. VITE_SUPABASE_URL
echo 2. VITE_SUPABASE_ANON_KEY  
echo 3. VITE_STRIPE_PUBLISHABLE_KEY
echo 4. NODE_ENV
echo 5. VITE_GOOGLE_CLIENT_ID (可选)
echo 6. VITE_SITE_ID (可选)
echo.

echo 📝 请确保:
echo - 已安装 Wrangler CLI (npm install -g wrangler)
echo - 已登录 Cloudflare (wrangler login)
echo - 项目名称为 bidform-app
echo.

set /p confirm="确认继续设置环境变量? (y/N): "
if /i not "%confirm%"=="y" (
    echo 操作已取消
    pause
    exit /b 0
)

echo.
echo 🚀 开始设置环境变量...
echo.

echo 📌 设置 VITE_SUPABASE_URL...
echo https://dxsjhbigwotzscnsdiek.supabase.co | wrangler pages secret put VITE_SUPABASE_URL --project-name=bidform-app
if %errorlevel% neq 0 (
    echo ❌ 设置 VITE_SUPABASE_URL 失败
    pause
    exit /b 1
)
echo ✅ VITE_SUPABASE_URL 设置成功
echo.

echo 📌 设置 VITE_SUPABASE_ANON_KEY...
echo eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4c2poYmlnd290enNjbnNkaWVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMjg2NDIsImV4cCI6MjA3MTcwNDY0Mn0.WgIxJsVQfZkC_u17T_ol9dyJf5oq203rAO6gTRmGWFY | wrangler pages secret put VITE_SUPABASE_ANON_KEY --project-name=bidform-app
if %errorlevel% neq 0 (
    echo ❌ 设置 VITE_SUPABASE_ANON_KEY 失败
    pause
    exit /b 1
)
echo ✅ VITE_SUPABASE_ANON_KEY 设置成功
echo.

echo 📌 设置 VITE_STRIPE_PUBLISHABLE_KEY...
echo pk_live_51RukL5QcIvw8mQk3EM4UzjmVEbKj9Dy7fOf5DI6421Gg1XRQNPx4SRZsZEBP3cZpzuF55jCEjEv1DPssCR9mZohk00j0A5wqwc | wrangler pages secret put VITE_STRIPE_PUBLISHABLE_KEY --project-name=bidform-app
if %errorlevel% neq 0 (
    echo ❌ 设置 VITE_STRIPE_PUBLISHABLE_KEY 失败
    pause
    exit /b 1
)
echo ✅ VITE_STRIPE_PUBLISHABLE_KEY 设置成功
echo.

echo 📌 设置 NODE_ENV...
echo production | wrangler pages secret put NODE_ENV --project-name=bidform-app
if %errorlevel% neq 0 (
    echo ❌ 设置 NODE_ENV 失败
    pause
    exit /b 1
)
echo ✅ NODE_ENV 设置成功
echo.

echo 📌 设置 VITE_GOOGLE_CLIENT_ID (可选)...
echo 378956299242-5sahap5fl9n9f57r694f87g3e0hbrsc4.apps.googleusercontent.com | wrangler pages secret put VITE_GOOGLE_CLIENT_ID --project-name=bidform-app
if %errorlevel% neq 0 (
    echo ⚠️ 设置 VITE_GOOGLE_CLIENT_ID 失败 (可选项，可忽略)
) else (
    echo ✅ VITE_GOOGLE_CLIENT_ID 设置成功
)
echo.

echo 📌 设置 VITE_SITE_ID (可选)...
echo bidform | wrangler pages secret put VITE_SITE_ID --project-name=bidform-app
if %errorlevel% neq 0 (
    echo ⚠️ 设置 VITE_SITE_ID 失败 (可选项，可忽略)
) else (
    echo ✅ VITE_SITE_ID 设置成功
)
echo.

echo 🎉 环境变量设置完成！
echo ===============================
echo.
echo 📋 已设置的环境变量:
echo ✅ VITE_SUPABASE_URL
echo ✅ VITE_SUPABASE_ANON_KEY
echo ✅ VITE_STRIPE_PUBLISHABLE_KEY
echo ✅ NODE_ENV
echo ✅ VITE_GOOGLE_CLIENT_ID (可选)
echo ✅ VITE_SITE_ID (可选)
echo.
echo 🚀 下一步:
echo 1. 重新部署项目: wrangler pages deploy dist --project-name=bidform-app
echo 2. 或者在 Cloudflare Dashboard 中触发重新部署
echo 3. 访问 https://bidform-app.pages.dev 测试功能
echo.
echo 💡 提示: 环境变量更改后必须重新部署才能生效
echo.
pause