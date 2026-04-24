# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

击水飞舟是基于 [AstroPaper](https://github.com/satnaing/astro-paper) 主题的中文个人博客，分享AI、技术、生活、职场相关文章。

## 常用命令

```bash
pnpm run dev       # 启动开发服务器 localhost:4321
pnpm run build     # 生产构建（包含 pagefind 搜索索引生成）
pnpm run preview   # 本地预览构建结果
pnpm run format    # Prettier 格式化代码
pnpm run lint      # ESLint 检查
pnpm run sync      # 生成 Astro 模块的 TypeScript 类型
```

## 架构说明

### 内容管理
- **博客文章**: 位于 `src/data/blog/`，按年份分子目录（如 `_2026/`）
- **草稿文章**: 文件名以下划线 `_` 开头，或设置 frontmatter 中 `draft: true`
- **内容 Schema**: 在 `src/content.config.ts` 中通过 Astro 内容集合定义

### Frontmatter 字段
```yaml
---
author: string (默认 SITE.author)
pubDatetime: date (必填)
modDatetime: date (可选)
title: string (必填)
slug: string (可选，自定义 URL)
featured: boolean (可选)
draft: boolean (可选)
tags: string[] (默认 ["others"])
ogImage: image 或 string (可选)
description: string (必填)
canonicalURL: string (可选)
hideEditPost: boolean (可选)
timezone: string (可选，默认 Asia/Shanghai)
---
```

### 网站配置
- `src/config.ts`: 核心站点设置（标题、作者、时区、分页等）
- `astro.config.ts`: Astro 框架配置、markdown 插件、shiki 代码高亮

### 数据库（阅读计数）
- 使用 Turso (LibSQL) 统计文章阅读数
- Schema 定义在 `db/config.ts`（PostViews 表）
- 连接逻辑在 `db/db.ts`，通过 `@libsql/client`
- 需要环境变量: `TURSO_URL`, `TURSO_AUTH_TOKEN`
- ViewCounter 组件位于 `src/components/ViewCounter.astro`

### 动态 OG 图片
- `src/utils/generateOgImages.ts` 生成社交分享图片
- 当 `SITE.dynamicOgImage` 为 true 且文章无自定义 ogImage 时启用

### 评论系统
- 使用 Giscus（基于 GitHub Discussions）
- 配置在 `src/layouts/PostDetails.astro`，`data-term` 设置为文章 slug
- 仓库: `kavaj88/bit-river`，分类: `普通评论`

### 搜索功能
- 使用 Pagefind 实现静态搜索
- 构建时生成 `dist/pagefind/`，复制到 `public/`

### 图片处理
- 文章图片: `src/assets/images/` - 在 markdown 中使用相对路径引用
- 静态资源: `public/` 目录

## 文件命名规范
博客文章使用数字前缀排序: `0.`, `1.`, `2.` 等
示例: `6.心智·领导力培训一.md`