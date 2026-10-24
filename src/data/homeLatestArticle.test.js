import { selectHomeLatestArticle } from "./homeLatestArticle";

test("公開記事一覧の先頭にある最新記事を選ぶ", () => {
  const latest = { id: "latest" };
  const older = { id: "older" };
  expect(selectHomeLatestArticle([latest, older])).toBe(latest);
  expect(selectHomeLatestArticle([])).toBeNull();
});
