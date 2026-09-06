import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Post, Category } from './types';

const contentDirectory = path.join(process.cwd(), 'content', 'escritos');

export function getPostBySlug(slug: string): Post {
  const realSlug = slug.replace(/\.mdx$/, '');
  const fullPath = path.join(contentDirectory, `${realSlug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug: realSlug,
    content,
    ...(data as Omit<Post, 'slug' | 'content'>),
  };
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(contentDirectory)) {
    return [];
  }
  
  const slugs = fs.readdirSync(contentDirectory);
  const posts = slugs
    .filter((slug) => slug.endsWith('.mdx'))
    .map((slug) => getPostBySlug(slug))
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));

  return posts;
}

export function getPostsByCategory(category: Category): Post[] {
  return getAllPosts().filter((post) => post.category === category);
}
