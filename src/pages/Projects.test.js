import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import Projects from "./Projects";

test("作品页展示东京地图与制作记录，并支持语言切换", () => {
  render(<MemoryRouter><Projects /></MemoryRouter>);

  expect(screen.getByRole("link", { name: /マップを試す/ })).toHaveAttribute("href", "/geo-lab/tokyo-hex");
  expect(screen.getByRole("link", { name: /制作記録を読む/ })).toHaveAttribute(
    "href", "/article/read/c16bd235375769906386ff107b0b7dc7"
  );
  expect(screen.queryByText(/FileZiper/i)).not.toBeInTheDocument();

  userEvent.click(screen.getByRole("button", { name: "中文" }));
  expect(screen.getByRole("heading", { name: "做过的项目" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /体验地图/ })).toHaveAttribute("href", "/geo-lab/tokyo-hex");
});
