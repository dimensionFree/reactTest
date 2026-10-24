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

test("最新文章显示在顶部且不在近期列表重复，归档仍显示旧文章", async () => {
  fetchAllArticles.mockResolvedValue(articles);
  render(<HP />);

  const latestTitle = "最近の記事";
  const qgisTitle = "QGISで東京23区をHex Map化してみた";
  await waitFor(() => expect(screen.getByRole("heading", { name: latestTitle })).toBeInTheDocument());
  expect(screen.getByText("最新記事")).toBeInTheDocument();
  expect(screen.getAllByText(latestTitle)).toHaveLength(1);
  expect(screen.getByText(qgisTitle)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "記事を読む" })).toHaveAttribute(
    "href",
    "/article/read/latest"
  );

  fireEvent.click(screen.getByRole("button", { name: "2026-05" }));
  expect(screen.getAllByText(latestTitle)).toHaveLength(1);
  expect(screen.getByText(qgisTitle)).toBeInTheDocument();
});

test("侧栏语言按钮只切换侧栏文案", async () => {
  fetchAllArticles.mockResolvedValue(articles);
  render(<HP />);

  await waitFor(() => expect(screen.getByRole("heading", { name: "最近の記事" })).toBeInTheDocument());
  expect(screen.getByRole("group", { name: "サイドバーの表示言語" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "日本在住のバックエンドエンジニア" })).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "EN" }));

  expect(screen.getByRole("heading", { name: "Backend Engineer in Japan" })).toBeInTheDocument();
  expect(screen.getByText("I also enjoy strategy games, history, and investing.")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "EN" })).toHaveAttribute("aria-pressed", "true");
  expect(screen.getByRole("heading", { name: "最近の記事" })).toBeInTheDocument();
});
