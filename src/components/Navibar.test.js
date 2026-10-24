import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navibar from "./Navibar";

jest.mock("../Utils/RequestSendUtils", () => ({
  __esModule: true, default: { sendGet: jest.fn(), quitUser: jest.fn() },
}));

afterEach(() => localStorage.clear());

test("普通登录用户的菜单也提供密码修改入口", () => {
  localStorage.setItem("userInfo", JSON.stringify({
    token: "access-token", user4Display: { id: "member-id", username: "member", role: { roleName: "member" } },
  }));
  render(<MemoryRouter><Navibar /></MemoryRouter>);
  expect(screen.getByRole("link", { name: "パスワード変更" })).toHaveAttribute("href", "/change-password");
});

test("访客导航保持登录入口", () => {
  localStorage.clear();
  render(<MemoryRouter><Navibar /></MemoryRouter>);
  expect(screen.getByRole("link", { name: "sign in" })).toHaveAttribute("href", "/login");
  expect(screen.queryByRole("link", { name: "パスワード変更" })).not.toBeInTheDocument();
});
