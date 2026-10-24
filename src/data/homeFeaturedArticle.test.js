import { selectHomeFeaturedArticle } from "./homeFeaturedArticle";

test("精选文章不存在时退回到最新文章，空列表不显示精选", () => {
  const latest = { id: "latest" };
  expect(selectHomeFeaturedArticle([latest])).toBe(latest);
  expect(selectHomeFeaturedArticle([])).toBeNull();
});
