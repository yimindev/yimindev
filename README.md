# yimindev 个人网站

极简、极速的个人主页与技术/随笔博客。基于 **Astro 5 + Tailwind CSS v4** 构建。

## 核心特性

- **极简风格**：纯净无衬线排版，聚焦技术内容与思考，无冗余装饰。
- **开源项目展示**：专注展示 [DatI](https://github.com/yimindev/dati)（Agent 数据库语义网关）及体验入口。
- **多元分类博客**：
  - 技术博客（`tech`）：支持代码高亮与架构图。
  - 读书笔记（`books`）：结构化展示作者、出版年份、个人评分与书评。
  - 电影观后感（`movies`）：展示导演、年份、星级评分与影评。
  - 随笔杂项（`notes`）：日常短篇思考。
- **暗色/浅色模式**：内置无闪烁平滑切换（Dark / Light Mode）。
- **国内合规备案**：全局页脚规范集成 **粤ICP备2026155191号**（直链工信部官网）并预留公网安备插槽。
- **SEO & RSS**：自动生成 RSS 订阅源（`/rss.xml`）与元信息。

## 本地开发

```bash
# 安装依赖
pnpm install

# 启动本地开发服务 (http://localhost:4321)
pnpm dev

# 编译打包 (生成 dist/ 静态站点目录)
pnpm build

# 本地预览打包产物
pnpm preview
```

## 撰写与发布新文章

在 `src/content/blog/` 下直接新建 `.md` 文件即可：

### 技术文章示例
```markdown
---
title: "我的技术文章标题"
description: "一句话文章摘要"
pubDate: 2026-03-20
category: "tech"
tags: ["Java", "Agent", "架构"]
---

文章正文...
```

### 书评示例
```markdown
---
title: "读《设计模式》有感"
description: "关于可复用面向对象软件的基础"
pubDate: 2026-03-15
category: "books"
subjectAuthor: "GoF"
year: "1994"
rating: 5
tags: ["读书笔记", "设计模式"]
---

正文...
```

### 影评示例
```markdown
---
title: "《流浪地球2》观后感"
description: "中国科幻电影的工业化里程碑"
pubDate: 2026-02-01
category: "movies"
subjectAuthor: "郭帆"
year: "2023"
rating: 5
tags: ["影评", "科幻"]
---

正文...
```

## 配置修改

- **站点信息与备案号**：可在 [`src/data/siteConfig.ts`](src/data/siteConfig.ts) 中直接修改。
- **开源项目列表**：在 [`src/data/siteConfig.ts`](src/data/siteConfig.ts) 中的 `projectsData` 增减。
