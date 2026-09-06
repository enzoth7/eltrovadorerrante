import type { Post } from "@/lib/types";
import PostCard from "./PostCard";

interface EditorialGridProps {
  posts: Post[];
}

export default function EditorialGrid({ posts }: EditorialGridProps) {
  if (!posts.length) return null;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {posts.map((post, index) => (
        <div key={post.slug} className={index === 0 ? "lg:col-span-2" : ""}>
          <PostCard {...post} featured={index === 0} />
        </div>
      ))}
    </div>
  );
}

