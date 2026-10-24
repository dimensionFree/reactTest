import React from "react";
import { render, screen } from "@testing-library/react";
import FindArticle from "./FindArticles";

jest.mock("../common/PaginatedCommon", () => ({ renderItem }) =>
  renderItem({
    id: "article-1",
    title: "別のタイトル",
    preface: "冒頭の概要",
    searchSnippet: "後半にある matching の説明",
    createdDate: "2026-10-24T12:00:00",
    createdUserName: "author",
    viewCount: 1,
  }, 0)
);

test("shows and highlights the matching body excerpt", () => {
  const { container } = render(<FindArticle searchKeyword="matching" />);

  expect(screen.getByText("本文に一致")).toBeInTheDocument();
  expect(container.querySelector("mark")).toHaveTextContent("matching");
  expect(screen.getByText(/後半にある/)).toBeInTheDocument();
  expect(screen.queryByText("冒頭の概要")).not.toBeInTheDocument();
});
