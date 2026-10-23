import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Changelog from "./Changelog";

test("更新履歴に日本語の節目と作品へのリンクを表示する", () => {
  render(
    <MemoryRouter>
      <Changelog />
    </MemoryRouter>
  );

  expect(screen.getByRole("heading", { name: "サイトの更新履歴" })).toBeInTheDocument();
  expect(screen.getByText(/代表的なコードのコミット日/)).toBeInTheDocument();
  expect(screen.getAllByText("2026-10-23")).toHaveLength(1);
  expect(screen.getByText("記事の編集中に画像を挿入できるようにしました。")).toBeInTheDocument();
  expect(screen.getByText("Live2D アシスタント")).toBeInTheDocument();
  expect(screen.getByText("記事の投稿と閲覧")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "マップを見る" })).toHaveAttribute("href", "/geo-lab/tokyo-hex");
});
