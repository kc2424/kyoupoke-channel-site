import { cn } from "@/lib/utils";

export function RevealText({ text, as: Tag = "span", className }: {
  text: string; as?: "h2" | "h3" | "p" | "span"; className?: string;
}) {
  return <Tag className={cn(className)}>{text}</Tag>;
}
