import { act, createEvent, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { message } from "antd";
import RequestSendUtils from "../Utils/RequestSendUtils";
import EditArticle from "./EditArticle";

jest.mock("../Utils/RequestSendUtils", () => ({
  __esModule: true,
  default: {
    getUserInfo: () => null,
    keepAlive: jest.fn().mockResolvedValue(true),
    uploadArticleImage: jest.fn(),
  },
}));
jest.mock("antd", () => ({ message: { success: jest.fn(), error: jest.fn(), info: jest.fn() } }));
jest.mock("react-router-dom", () => ({ useParams: () => ({ id: "NEW" }), useHistory: () => ({ push: jest.fn() }) }));
jest.mock("../components/Navibar", () => () => null);
jest.mock("../components/common/SEO", () => () => null);
jest.mock("../components/markdown/MarkdownRenderer", () => () => null);

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
  RequestSendUtils.uploadArticleImage.mockReset();
});

test("上传期间锁定正文，成功后在原选区插入图片并恢复编辑", async () => {
  let completeUpload;
  RequestSendUtils.uploadArticleImage.mockReturnValue(new Promise(resolve => { completeUpload = resolve; }));
  const { container } = render(<EditArticle />);
  const editor = screen.getByRole("textbox", { name: /Article Content/ });
  fireEvent.change(editor, { target: { value: "hello world" } });
  editor.setSelectionRange(6, 11);
  const file = new File(["png"], "sample.png", { type: "image/png" });

  fireEvent.change(container.querySelector('input[type="file"]'), { target: { files: [file] } });

  expect(editor).toHaveAttribute("readonly");
  expect(screen.getByRole("button", { name: "Save Article" })).toBeDisabled();
  await waitFor(() => expect(RequestSendUtils.uploadArticleImage).toHaveBeenCalledTimes(1));
  await act(async () => completeUpload({ dataContent: { url: "https://static.example.com/sample.png" } }));
  expect(editor.value).toBe("hello \n\n![sample](https://static.example.com/sample.png)\n");
  expect(editor).not.toHaveAttribute("readonly");
  expect(screen.getByRole("button", { name: "Save Article" })).toBeEnabled();
});

test("上传失败后保留正文并恢复编辑", async () => {
  RequestSendUtils.uploadArticleImage.mockRejectedValue(new Error("图片存储服务暂不可用"));
  const { container } = render(<EditArticle />);
  const editor = screen.getByRole("textbox", { name: /Article Content/ });
  fireEvent.change(editor, { target: { value: "保留的正文" } });

  fireEvent.change(container.querySelector('input[type="file"]'), {
    target: { files: [new File(["png"], "sample.png", { type: "image/png" })] },
  });

  await waitFor(() => expect(message.error).toHaveBeenCalledWith("图片存储服务暂不可用"));
  expect(editor).toHaveValue("保留的正文");
  expect(editor).not.toHaveAttribute("readonly");
});

test("普通文件粘贴不拦截原有文本粘贴行为", () => {
  render(<EditArticle />);
  const editor = screen.getByRole("textbox", { name: /Article Content/ });
  const event = createEvent.paste(editor, {
    clipboardData: { items: [{ kind: "file", type: "text/plain", getAsFile: () => new File(["text"], "sample.txt") }] },
  });

  fireEvent(editor, event);

  expect(event.defaultPrevented).toBe(false);
  expect(RequestSendUtils.uploadArticleImage).not.toHaveBeenCalled();
});

test("超过 5 MB 的图片在发送请求前拒绝", () => {
  const { container } = render(<EditArticle />);
  const file = new File([new Uint8Array(5 * 1024 * 1024 + 1)], "large.png", { type: "image/png" });

  fireEvent.change(container.querySelector('input[type="file"]'), { target: { files: [file] } });

  expect(message.error).toHaveBeenCalledWith("图片大小不能超过 5 MB");
  expect(RequestSendUtils.uploadArticleImage).not.toHaveBeenCalled();
});
