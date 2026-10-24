export const HOME_FEATURED_ARTICLE_ID = "c16bd235375769906386ff107b0b7dc7";

export const HOME_FEATURED_DESCRIPTION =
  "東京23区の公開GISデータをQGISで整え、六角形マップとして表示した制作記録。";

export const selectHomeFeaturedArticle = (articles) =>
  articles.find((article) => article.id === HOME_FEATURED_ARTICLE_ID) || articles[0] || null;
