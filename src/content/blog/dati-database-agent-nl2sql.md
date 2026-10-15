---
title: "DatI：给AI接入数据库，Agent时代的NL2SQL问数与多维表格应该怎么做"
description: "探讨在 Agent 时代，如何通过数据库语义网关与 MCP 协议标准，让智能体安全、高效、受控地访问数据库与构建轻应用。"
pubDate: 2026-09-11
category: "tech"
tags: ["DatI", "MCP", "NL2SQL", "AI Agent", "Java"]
---

## 一、Agent 时代如何与数据库交互

我的前两段职业经历都是围绕 BI。开始主要是给一线业务做报表，有过用 SQL 写数据服务，高代码开发看板，也有使用 Tableau、PowerBI、永洪 BI 做自助分析。第二段工作就转向自建 BI 系统，适逢大模型风起云涌，后来产品聚焦在智能问数（ChatBI）方向上，不过问数能力可以做出吸引人的 Demo，但是没法真正让业务深入使用。主要问题有两点：

1. 当时模型能力有限，为了提升准确率，我们采用了 NL2DSL 的技术路线，但是 DSL 也限制了分析的能力。
2. 在实际交付项目中，客户需要的并不是一个单独的 Data Agent，更多的是想把 NL2SQL 能力集成到各种工作任务中。

去年 MCP 发布后，我觉得直接把数据库发布为 MCP 工具，再加上简单的元数据维护，就是一个轻量化的 NL2SQL 组件，集成到 Agent 中足够完成灵活的分析工作了。下面就是初版的结果: **DatI (Data Intelligence)**

![DatI 初版架构与界面](https://yimin-img.oss-rg-china-mainland.aliyuncs.com/dati/articles/2026-09-11-dati-database-agent-nl2sql/01-architecture-overview.png)

DatI 的核心思路非常克制：对接数据库，维护元数据，提供预置工具、自定义工具并发布为 MCP 服务。将 MCP 集成至用户的 Agent，即可实现数据分析，而且允许增、删、改操作后，也可实现轻量化的后台管理应用。

---

## 二、从数据分析到轻应用构建

下面用一个 **家庭记账** 的案例来对平台使用以及应用场景做演示。该场景中，有两个用户，共用一个家庭账本，记账时自动识别用户计入各自的消费，分析的时候可以按整个家庭维度进行分析。

首先是 DatI 平台配置（提供 `dati-ops` skill，自动化进行配置），有 3 张表（`account`, `category`, `transaction`），开启 4 个预置工具：元数据检索，表清单，表详情，SQL 执行（只允许 Select 操作），增加 4 个自定义工具：初始化账户、记账、改账、删除流水。

![DatI 平台配置与表清单](https://yimin-img.oss-rg-china-mainland.aliyuncs.com/dati/articles/2026-09-11-dati-database-agent-nl2sql/02-datasource-table-config.png)

![DatI 预置工具配置](https://yimin-img.oss-rg-china-mainland.aliyuncs.com/dati/articles/2026-09-11-dati-database-agent-nl2sql/03-preset-tools-config.png)

![DatI 自定义工具配置](https://yimin-img.oss-rg-china-mainland.aliyuncs.com/dati/articles/2026-09-11-dati-database-agent-nl2sql/04-custom-tools-config.png)

生成 MCP 服务后，用户 1 接入 WorkBuddy，用户 2 使用千问办公，就可以使用它们已有的能力（微信远程调用、OCR 识别、数据可视化等）进行记账与分析：

![家庭记账演示](https://yimin-img.oss-rg-china-mainland.aliyuncs.com/dati/articles/2026-09-11-dati-database-agent-nl2sql/05-family-accounting-demo.gif)

---

## 三、架构与实现

DatI 整体由三部分构成：

1. **数据接入**：当前支持 MySQL、PostgreSQL、ClickHouse、Doris、MariaDB，扩展新的数据库支持也比较简单；
   > **为什么后台语言用 Java**：当前 Python、TypeScript、Rust 是 AI 领域更流行的语言，但后端仍采用 Java 构建，核心在于 JDBC 与 HikariCP 在数据库基础设施领域具备极高稳定性、完善的连接池治理能力及成熟的驱动生态。
2. **语义建模**：表、列、列值、业务术语均支持配置别名、描述等，为大模型提供精准的业务上下文；
3. **MCP 服务构建**：选定数据范围，通过配置工具、Prompt 即可发布为标准 MCP 服务；
   > **为什么选用 MCP 协议**：相比本地 Skill，MCP 更适合企业级 Web 服务形态。数据库连接凭证在服务端集中托管与鉴权，终端用户仅需配置个人 Token，既保障了凭证安全，又实现了元数据与工具规则的一处配置、全员复用。

### 工具的设计与实现

工具是整个 MCP 服务的核心，主要工具如下：

#### 预置工具
- **元数据检索**：我们将数据范围内的表、列、枚举值和业务术语打平统一存储在 Elasticsearch 中。Agent 仅需一次关键词检索，即可利用倒排索引一次性召回高度关联的表结构与业务上下文；
- **表清单、表结构查询**：这两个工具用来让 Agent 探索表空间；
- **受控 SQL 执行**：这里我们让大模型直接写 SQL，但是会做操作类型管控，可配置是否允许 insert、delete、transaction 等操作；
- **元数据更新**：支持更新表、列、术语的元数据，支持在实际使用中进行元数据维护，让工具可以自演化，越用越好用。

#### 自定义工具
- **参数化 SQL**：针对复杂多表关联或高风险操作，可以通过配置 SQL 模板，动态生成可执行 SQL，模板引擎采用了类 handlebars 的语法，支持动态 SQL，也支持获取用户信息以便做权限管控。

```sql
UPDATE transaction SET
  {{#if amount}}amount = {{amount}},{{/if}}
  {{#if category}}category_id = (SELECT id FROM category WHERE name = {{category}}),{{/if}}
  updated_at = now()
WHERE id = {{transaction_id}} AND user_name = {{_user.name}}
```

---

## 四、与现有方案对比

给大模型接入数据库，这个想法并不新颖，各种产品/库非常多，从简单的数据库标准 MCP/Skill 以及通用连多数据库的 DBHUB、MCP Toolbox 到 ChatBI，甚至现在代码开发门槛极大降低，直接让大模型开发具体的应用可能在几个小时就能搞完。那么 DatI 的价值在哪，我认为它的定位是：**专为 Agent 设计的企业级数据库语义网关**。与现有方案对比，DatI 的定位差异主要体现在**数据安全性**、**业务语义沉淀**以及**工作流嵌入度**上：

| 评估维度 | DatI | 代码开发 | 官方 DB MCP/Skill | DBHUB / MCP Toolbox | 独立 ChatBI |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **接入形态** | 服务端 MCP | 任意形态 | 本地 MCP | 本地 MCP | 独立 App |
| **凭证管理** | 服务端托管 | 视实现而定 | 本地明文配置 | 本地明文配置 | 服务端托管 |
| **语义层** | 支持业务语义 | 根据场景定制 | 标准 schema | 标准 schema | 支持业务语义 |
| **复杂查询保障** | 预置探索 + 参数化 SQL 模板 | 高代码定制工具 | 无 | 支持自定义工具 | 绑定固化报表与 DSL |
| **工作流嵌入度** | 高（任意 MCP 宿主可集成） | 极高 | 高 | 高 | 低（通过有限 API 或 SDK 集成） |

总结来说，DatI 能够同时解决以下几个问题：

1. **安全管控**：数据库需要集中管理，用户在授权范围内操作；
2. **元数据配置**：Agent 能正确执行工具和执行 SQL 的必要上下文注入；
3. **灵活性**：任意 Agent 或者业务应用均可快速集成；
4. **效率**：低代码开发、免部署；
5. **多数据源**：支持主流数据库。

---

## 五、开源项目地址

一个工具的生命力依赖于真实场景的打磨。诚挚邀请各位试用并给出宝贵意见：

- GitHub: [https://github.com/yimindev/dati](https://github.com/yimindev/dati)
- 在线体验: [https://dati-demo.zhangyimin.me](https://dati-demo.zhangyimin.me)
