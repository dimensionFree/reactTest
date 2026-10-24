import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Switch } from "react-router-dom";
import RequestSendUtils from "../Utils/RequestSendUtils";
import ChangePassword from "./ChangePassword";

jest.mock("../Utils/RequestSendUtils", () => ({
  __esModule: true,
  default: { getToken: jest.fn(), sendPutWithReturn: jest.fn() },
}));
jest.mock("../components/Navibar", () => () => null);

beforeEach(() => {
  jest.clearAllMocks();
  RequestSendUtils.getToken.mockReturnValue("access-token");
  RequestSendUtils.sendPutWithReturn.mockResolvedValue({ code: "200", dataContent: { passwordChanged: true } });
});

const renderPage = () => render(
  <MemoryRouter initialEntries={["/change-password"]}>
    <Switch>
      <Route path="/login"><h1>登录页面</h1></Route>
      <Route path="/change-password"><ChangePassword /></Route>
    </Switch>
  </MemoryRouter>
);

const fillPasswords = (newPassword = "new-password-456", confirmation = newPassword,
  currentPassword = "old-password-123") => {
  fireEvent.change(screen.getByLabelText("現在のパスワード", { exact: true }), { target: { value: currentPassword } });
  fireEvent.change(screen.getByLabelText("新しいパスワード", { exact: true }), { target: { value: newPassword } });
  fireEvent.change(screen.getByLabelText("新しいパスワード（確認）", { exact: true }), { target: { value: confirmation } });
};

const submit = () => fireEvent.submit(screen.getByRole("button", { name: /パスワードを更新|更新中/ }).closest("form"));

test("仅提交当前账户的改密字段，成功后清空密码并显示提示", async () => {
  renderPage();
  fillPasswords();
  submit();
  await screen.findByRole("status");
  expect(RequestSendUtils.sendPutWithReturn).toHaveBeenCalledWith("/user/password", {
    currentPassword: "old-password-123", newPassword: "new-password-456", confirmPassword: "new-password-456",
  }, "access-token");
  for (const label of ["現在のパスワード", "新しいパスワード", "新しいパスワード（確認）"]) {
    expect(screen.getByLabelText(label, { exact: true })).toHaveValue("");
  }
  expect(localStorage.getItem("newPassword")).toBeNull();
});

test.each([
  ["", "", "old-password-123"],
  ["12345678901", "12345678901", "old-password-123"],
  ["new-password-456", "not-the-same", "old-password-123"],
  ["old-password-123", "old-password-123", "old-password-123"],
  ["汉".repeat(25), "汉".repeat(25), "old-password-123"],
  ["x".repeat(73), "x".repeat(73), "old-password-123"],
  ["new-password\0", "new-password\0", "old-password-123"],
  ["😀".repeat(6), "😀".repeat(6), "old-password-123"],
])("非法输入在发送请求前拦截 %#", (password, confirmation, current) => {
  renderPage();
  fillPasswords(password, confirmation, current);
  submit();
  expect(screen.getByRole("alert")).toBeInTheDocument();
  expect(RequestSendUtils.sendPutWithReturn).not.toHaveBeenCalled();
});

test("接受恰好 72 字节的多字节密码", async () => {
  renderPage();
  fillPasswords("汉".repeat(24));
  submit();
  await screen.findByRole("status");
  expect(RequestSendUtils.sendPutWithReturn).toHaveBeenCalledTimes(1);
});

test("提交期间禁用输入和按钮并阻止重复请求", async () => {
  let complete;
  RequestSendUtils.sendPutWithReturn.mockReturnValue(new Promise(resolve => { complete = resolve; }));
  renderPage();
  fillPasswords();
  submit();
  submit();
  expect(screen.getByRole("button", { name: "更新中…" })).toBeDisabled();
  expect(screen.getByLabelText("現在のパスワード", { exact: true })).toBeDisabled();
  expect(RequestSendUtils.sendPutWithReturn).toHaveBeenCalledTimes(1);
  await act(async () => complete({ code: "200", dataContent: { passwordChanged: true } }));
  expect(screen.getByRole("button", { name: "パスワードを更新" })).toBeEnabled();
});

test("显示后端业务错误，恢复表单并允许重试", async () => {
  RequestSendUtils.sendPutWithReturn.mockRejectedValueOnce({ response: { data: { message: "当前密码不正确" } } });
  renderPage();
  fillPasswords();
  submit();
  expect(await screen.findByRole("alert")).toHaveTextContent("当前密码不正确");
  await waitFor(() => expect(screen.getByRole("button", { name: "パスワードを更新" })).toBeEnabled());
  expect(screen.queryByRole("status")).not.toBeInTheDocument();
  submit();
  await screen.findByRole("status");
});

test("未登录时跳转登录页且不发送改密请求", () => {
  RequestSendUtils.getToken.mockReturnValue("");
  renderPage();
  expect(screen.getByRole("heading", { name: "登录页面" })).toBeInTheDocument();
  expect(RequestSendUtils.sendPutWithReturn).not.toHaveBeenCalled();
});
