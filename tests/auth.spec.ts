import { test, expect } from '@playwright/test';

const TEST_EMAIL = process.env.TEST_EMAIL || '';
const TEST_PASSWORD = process.env.TEST_PASSWORD || '';

test.describe('Auth flow', () => {
  test.beforeEach(async ({ page }) => {
    // 进入首页
    await page.goto('/');
  });

  test('open login modal from landing page', async ({ page }) => {
    // 点击“Sign In”按钮（桌面导航）
    const signInButtons = page.getByText('Sign In', { exact: true });
    await expect(signInButtons.first()).toBeVisible();
    await signInButtons.first().click();

    // 看到登录弹窗头部图标或标题
    await expect(page.getByText('Welcome Back').or(page.getByText('Create Account'))).toBeVisible();
  });

  test('email/password sign in redirects to /dashboard', async ({ page }) => {
    test.skip(!TEST_EMAIL || !TEST_PASSWORD, '请设置环境变量 TEST_EMAIL 和 TEST_PASSWORD 为已验证的测试账号');

    // 打开登录弹窗
    const signInButtons = page.getByText('Sign In', { exact: true });
    await signInButtons.first().click();

    // 填写邮箱和密码
    await page.getByPlaceholder('Email address').fill(TEST_EMAIL);
    await page.getByPlaceholder('Password').fill(TEST_PASSWORD);

    // 点击 Sign In 提交
    await page.getByRole('button', { name: 'Sign In' }).click();

    // 期望跳转到 /dashboard
    await page.waitForURL('**/dashboard', { timeout: 15000 });
    await expect(page).toHaveURL(/\/dashboard$/);

    // 简单校验仪表盘元素（存在 Dashboard 组件的一些标识）
    await expect(page.locator('body')).toContainText(/Offers|Create Bid Form|Dashboard/i);
  });
});