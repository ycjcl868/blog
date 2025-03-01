# 📝 Notion Blog - 零成本实时更新的现代化博客系统

中文 | [English](./README.md)

基于 Remix 和 Notion 构建，部署在 Cloudflare Pages ，使用 Edge Function 的无成本、可实时更新的博客站点。

![](https://user-images.githubusercontent.com/13595509/221388253-a719a869-c4b9-4387-a513-101caa35df27.png)


[![Cloudflare Pages](https://img.shields.io/badge/Deployed_on-Cloudflare_Pages-F38020?logo=cloudflare)](https://developers.cloudflare.com/pages/)
[![Remix Framework](https://img.shields.io/badge/Built_with-Remix-1E1F21?logo=remix)](https://remix.run/)


## 🔥 特性

- 直接使用你的 Notion 页面创建博客，博客内容访问实时更新
- 支持智能缓存（`stale-while-revalidate`），确保页面快速加载的同时，自动在后台更新内容
- 使用 [Remix](https://remix.run/) 构建，最新的技术栈
- 已经部署到 Cloudflare Pages，无需费用
- 使用 [TailwindCSS](https://tailwindcss.com/) 设计简洁美观的博客
- 支持分类标签和搜索功能
- 支持 RSS Feed
- 主题 Light/Dark 切换
- [ ] 国际化支持，运行时大语言模型翻译

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

复制这个 [Notion 模板](https://ycjcl868.notion.site/b7e25fb9b29a48269e92e36f65a3ffbb)，共享生成连接。

![](https://github.com/user-attachments/assets/cb894cb4-4e1b-4f1e-adb4-d35ce67e5df4)

链接中对应的 `PAGE_ID` 是：`https://www.notion.so/{workspace_name}/{page_id}`，通常是地址后 32 位数字

## 🔨 本地开发

新建 `.dev.vars`，配置如下：

```bash
NOTION_PAGE_ID=xxxx   # Notion 共享 ID
NOTION_ACCESS_TOKEN=secret_xxx # 在这里申请一个 TOKEN：https://developers.notion.com/docs/create-a-notion-integration
```

然后执行启动命令：

```
npm run start
```

访问 `localhost:3000` 即可访问

## 📝 发表你的想法

如果你有任何建议，欢迎提交 issue 或者 pull request。

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=ycjcl868/blog&type=Date)](https://star-history.com/#ycjcl868/blog&Date)
