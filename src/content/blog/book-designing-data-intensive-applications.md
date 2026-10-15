---
title: "读《数据密集型应用系统设计》(DDIA)：分布式系统的基石"
description: "Martin Kleppmann 的经典之作，系统梳理了数据模型、存储引擎、复制分片与事务一致性的底层逻辑。"
pubDate: 2026-02-15
category: "books"
subjectAuthor: "Martin Kleppmann"
year: "2017"
rating: 5
tags: ["读书笔记", "系统架构", "分布式系统"]
---

在当今云原生与微服务架构盛行的时代，《Designing Data-Intensive Applications》(DDIA) 依旧是所有服务端工程师的案头必读书。

### 为什么值得反复阅读？

许多技术书籍着眼于某一个具体框架的 API 或特定版本的调优技巧，而 DDIA 专注于**不变的底层原理**与**工程权衡取舍 (Trade-offs)**：

- **可靠性 (Reliability)**：硬件总会故障，软件总有缺陷，系统如何在故障中持续运转？
- **可伸缩性 (Scalability)**：负载增长时，以何种方式评估系统压力并横向扩容？
- **可维护性 (Maintainability)**：代码易读性、系统演进能力与运维友好性。

> “在分布式系统中，没有完美的解决方案，只有契合当前业务场景的权衡取舍。”

### 关于存储引擎与一致性

书中从最朴素的 append-only 日志和哈希索引展开，逐步讲到 LSM-Tree (Log-Structured Merge-Tree) 与 B-Tree 的读写权衡；随后剖析单主复制、多主复制与无主复制中的幽灵写入与时钟问题。

对于从事高并发后端系统与数据平台开发的工程师来说，它能帮助你在面对形形色色的新型存储产品时，快速看穿其底层的技术本质。
