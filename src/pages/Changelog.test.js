import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Changelog from "./Changelog";

test("更新日志展示提交日期、主要变更和作品入口", () => {
  render(
    <MemoryRouter>
      <Changelog />
    </MemoryRouter>
  );

  expect(screen.getByRole("heading", { name: "更新日志" })).toBeInTheDocument();
  expect(screen.getByText(/日期为代码提交日期/)).toBeInTheDocument();
  expect(screen.getAllByText("2026-10-23")).toHaveLength(1);
  expect(screen.getByText("支持在文章中插入图片，并调整文章编辑体验。")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "查看地图" })).toHaveAttribute("href", "/geo-lab/tokyo-hex");
  expect(screen.getByRole("link", { name: "更新日志" })).toHaveAttribute("href", "/changelog");
});
