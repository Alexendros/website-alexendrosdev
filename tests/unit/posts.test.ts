import { describe, expect, it } from "vitest";
import { getPosts, getPost } from "@/lib/content/posts";

describe("loader de posts — blog eliminado (#80)", () => {
  it("getPosts devuelve array vacío (blog migrado a Notion)", async () => {
    const posts = await getPosts();
    expect(posts).toEqual([]);
  });

  it("getPost devuelve undefined para cualquier id (blog eliminado)", async () => {
    const result = await getPost("cualquier-id");
    expect(result).toBeUndefined();
  });
});
