import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import About from "./About";

test("About 页提供 Projects 入口并随语言切换文案", () => {
  render(<MemoryRouter><About /></MemoryRouter>);

  expect(screen.getByRole("link", { name: /制作したもの/ })).toHaveAttribute("href", "/projects");
  expect(screen.queryByText(/まずは東京23区の地図実験から/)).not.toBeInTheDocument();
  userEvent.click(screen.getByRole("button", { name: "中文" }));
  expect(screen.getByRole("link", { name: /做过的项目/ })).toHaveAttribute("href", "/projects");
});
