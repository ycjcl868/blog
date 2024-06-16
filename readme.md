# 📝 Notion Blog

一个基于 Next.js 和 Notion 构建，部署在 Cloudflare Pages ，使用 Edge Function 的无成本、可实时更新的博客站点。

![](https://user-images.githubusercontent.com/13595509/221388253-a719a869-c4b9-4387-a513-101caa35df27.png)

## 🔥 特性

- 直接使用你的 Notion 页面创建博客，实时更新
- 使用 [Next.js](https://nextjs.org/) 构建，最新的技术栈
- 已经部署到 Vercel，无需费用
- 使用 [TailwindCSS](https://tailwindcss.com/) 设计简洁美观的博客
- 支持分类标签和搜索功能
- 支持 RSS Feed
- 主题 Light/Dark 切换

## 📦 安装

使用以下指令将该项目克隆到你本地

```
git clone https://github.com/ycjcl868/blog
```

接下来，使用 pnpm 安装依赖

```
pnpm i
```

## 生成 Notion 数据库

复制这个 [Notion 模板](https://ycjcl868.notion.site/b7e25fb9b29a48269e92e36f65a3ffbb)，并分享到 Web 公网。

![](https://user-images.githubusercontent.com/13595509/221388324-00c684dc-2eb8-4748-bd8e-91c8cf7320be.png)

## 🔨 本地开发

新建 `.env.local`，配置如下：

```bash
NOTION_PAGE_ID=xxxx   # Notion 共享到 Web 时的 ID，通常是地址后 32 位数字
NOTION_ACCESS_TOKEN=secret_xxx # 在这里申请一个 TOKEN：https://developers.notion.com/docs/create-a-notion-integration
```

然后执行启动命令：

```
npm run start
```

访问 `localhost:3000` 即可访问

## 📝 发表你的想法

如果你有任何建议，欢迎提交 issue 或者 pull request。
