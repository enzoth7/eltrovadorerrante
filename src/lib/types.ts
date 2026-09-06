export type Category = 'viajes' | 'libros' | 'arte' | 'historia' | 'peliculas' | 'reflexiones';

export interface PostFrontmatter {
  title: string;
  date: string;
  description: string;
  category: Category;
  coverImage?: string;
  tags: string[];
  featured?: boolean;
}

export interface Post extends PostFrontmatter {
  id?: string;
  slug: string;
  content: string;
  status?: 'draft' | 'published';
  updatedAt?: string;
}

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  category: string;
  description?: string;
  date: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}
