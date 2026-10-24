import RequestSendUtils from "./RequestSendUtils";

const ARTICLE_PAGE_SIZE = 100;

export const fetchAllArticles = async () => {
  const articles = [];
  let currentPage = 1;
  let totalPages = 1;

  while (currentPage <= totalPages) {
    const response = await RequestSendUtils.sendGetWithReturn(
      `/article/findAll/?currentPage=${currentPage}&pageSize=${ARTICLE_PAGE_SIZE}`,
      null
    );
    const page = response?.dataContent;
    if (!Array.isArray(page?.list)) {
      throw new Error("Invalid article list response");
    }
    articles.push(...page.list);
    totalPages = Math.max(1, Number(page.pages) || 1);
    currentPage += 1;
  }

  return articles;
};
