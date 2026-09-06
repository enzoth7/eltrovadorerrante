interface CategoryBadgeProps {
  category: string;
  tone?: "light" | "dark";
}

export default function CategoryBadge({ category, tone = "light" }: CategoryBadgeProps) {
  return (
    <span className={`inline-flex border-b pb-1 text-[0.64rem] font-bold uppercase tracking-[0.16em] ${
      tone === "dark" ? "border-white/45 text-white" : "border-blue text-blue"
    }`}>
      {category}
    </span>
  );
}
