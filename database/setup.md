# 数据库设置说明

## 在 Supabase 中执行以下步骤：

1. 登录到你的 Supabase 项目控制台
2. 进入 "SQL Editor" 
3. 执行 `migrations/001_create_bid_forms.sql` 文件中的 SQL 语句

## 或者使用 Supabase CLI：

```bash
# 如果你有 Supabase CLI，可以运行：
supabase db reset
# 或者
supabase db push
```

## 验证表创建：

执行以下查询来验证表是否正确创建：

```sql
-- 检查表是否存在
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('bid_forms', 'bids');

-- 检查表结构
\d public.bid_forms
\d public.bids
```

## 表结构说明：

### bid_forms 表
- 存储竞价表单的基本信息
- 包含起始价格、货币、保证金比例等配置
- 支持主题颜色自定义
- 启用了行级安全策略 (RLS)

### bids 表  
- 存储用户的出价记录
- 关联到对应的 bid_form
- 包含出价者信息和出价金额
- 支持可选的消息功能