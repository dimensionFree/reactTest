import RequestSendUtils from "./RequestSendUtils";
import { fetchAllArticles } from "./articleApi";

jest.mock("./RequestSendUtils", () => ({
  __esModule: true,
  default: { sendGetWithReturn: jest.fn() },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

test("loads every article page within the API limit", async () => {
  RequestSendUtils.sendGetWithReturn
    .mockResolvedValueOnce({ dataContent: { pages: 2, list: [{ id: "first" }] } })
    .mockResolvedValueOnce({ dataContent: { pages: 2, list: [{ id: "second" }] } });

  await expect(fetchAllArticles()).resolves.toEqual([{ id: "first" }, { id: "second" }]);
  expect(RequestSendUtils.sendGetWithReturn.mock.calls).toEqual([
    ["/article/findAll/?currentPage=1&pageSize=100", null],
    ["/article/findAll/?currentPage=2&pageSize=100", null],
  ]);
});

test("rejects a malformed page rather than showing an incomplete archive", async () => {
  RequestSendUtils.sendGetWithReturn.mockResolvedValue({ dataContent: { pages: 1 } });

  await expect(fetchAllArticles()).rejects.toThrow("Invalid article list response");
});
