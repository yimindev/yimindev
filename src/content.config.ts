import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.enum(['tech', 'books', 'movies', 'notes']),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),

    // 书评与影评的可选扩展字段
    rating: z.number().min(1).max(5).optional(), // 1 - 5 星
    subjectAuthor: z.string().optional(), // 原著作者 / 电影导演
    year: z.string().optional(), // 出版 / 上映年份
  }),
});

export const collections = { blog };
