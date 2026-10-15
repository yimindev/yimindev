export interface SiteConfig {
  title: string;
  author: string;
  description: string;
  siteUrl: string;
  github: string;
  icp: {
    text: string;
    link: string;
  };
  policeBeian?: {
    text: string;
    link: string;
  };
}

export const siteConfig: SiteConfig = {
  title: "yimindev",
  author: "yimindev",
  description: "软件工程师。关注 AI Agent、语义网关、系统架构与数据工程。",
  siteUrl: "https://zhangyimin.me",
  github: "https://github.com/yimindev",
  icp: {
    text: "粤ICP备2026155191号",
    link: "https://beian.miit.gov.cn/",
  },
  // 预留公网安备插槽（后续如办理可填入）
  policeBeian: undefined,
};

export interface ProjectItem {
  name: string;
  tagline: string;
  description: string;
  repo: string;
  demoUrl?: string;
  tags: string[];
  featured?: boolean;
}

export const projectsData: ProjectItem[] = [
  {
    name: "DatI",
    tagline: "Agent 数据库语义网关",
    description: "连接 AI Agent 与企业数据库的轻量级语义网关。仅需接入数据库、配置语义信息，即可发布标准 MCP 服务，支持自然语言智能问数与轻应用搭建。",
    repo: "https://github.com/yimindev/dati",
    demoUrl: "https://dati-demo.zhangyimin.me",
    tags: ["Java 21", "Spring Boot 3", "MCP Protocol", "Vue 3", "Elasticsearch", "Docker"],
    featured: true,
  },
];
