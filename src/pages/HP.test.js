import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import HP from "./HP";
import { fetchAllArticles } from "../Utils/articleApi";

jest.mock("../Utils/articleApi", () => ({ fetchAllArticles: jest.fn() }));
jest.mock("../components/Navibar", () => () => null);
jest.mock("../components/article/ArchiveByMonthCard", () => ({ onSelect }) => {
  const React = require("react");
  return React.createElement("button", { onClick: () => onSelect("2026-05") }, "2026-05");
});

const articles = [
  {
    id: "latest",
    title: "最近の記事",
    preface: "最近の記事の紹介",
    createdDate: "2026-08-24T03:44:58",
  },
  {
    id: "c16bd235375769906386ff107b0b7dc7",
    title: "QGISで東京23区をHex Map化してみた",
    preface: "元の記事の概要",
    createdDate: "2026-05-29T13:27:49",
  },
];

test("精选文章不在近期列表重复，但仍可通过归档找到", async () => {
  fetchAllArticles.mockResolvedValue(articles);
  render(<HP />);

  const title = "QGISで東京23区をHex Map化してみた";
  await waitFor(() => expect(screen.getByRole("heading", { name: title })).toBeInTheDocument());
  expect(screen.getAllByText(title)).toHaveLength(1);
  expect(screen.getByRole("link", { name: "記事を読む" })).toHaveAttribute(
    "href",
    "/article/read/c16bd235375769906386ff107b0b7dc7"
  );
  expect(screen.getByText("最近の記事")).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "2026-05" }));
  expect(screen.getAllByText(title)).toHaveLength(2);
});
