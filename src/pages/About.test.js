import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import About from "./About";

test("About 页提供小实验入口并随语言切换文案", () => {
  render(<MemoryRouter><About /></MemoryRouter>);

  expect(screen.getByRole("link", { name: /作ってみたもの/ })).toHaveAttribute("href", "/experiments");
  expect(screen.queryByText(/まずは東京23区の地図実験から/)).not.toBeInTheDocument();
  userEvent.click(screen.getByRole("button", { name: "中文" }));
  expect(screen.getByRole("link", { name: /做过的小东西/ })).toHaveAttribute("href", "/experiments");
});
