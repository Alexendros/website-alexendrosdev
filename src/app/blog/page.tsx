import type { Metadata } from "next";
import { BlogView } from "@/components/sections/blog/BlogView";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Notas de ingeniería sobre platform engineering, infraestructura cloud-native y desarrollo backend.",
};

export default function BlogPage() {
  return <BlogView />;
}
