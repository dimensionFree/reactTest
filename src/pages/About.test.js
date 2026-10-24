import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import About from "./About";

test("About 页提供 Projects 入口并随语言切换文案", () => {
  render(<MemoryRouter><About /></MemoryRouter>);

  expect(screen.getByRole("link", { name: /制作したものを見る/ })).toHaveAttribute("href", "/projects");
  userEvent.click(screen.getByRole("button", { name: "中文" }));
  expect(screen.getByRole("heading", { name: "做过的项目" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /查看项目/ })).toHaveAttribute("href", "/projects");
});
