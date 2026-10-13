import { cachedGet, clearApiCache } from "../api/api";

jest.mock("../utils/logger", () => ({
  __esModule: true,
  default: { debug: jest.fn(), info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}));

jest.mock("axios", () => {
  const get = jest.fn();
  return {
    __esModule: true,
    default: { create: jest.fn(() => ({ get })) },
    __mockGet: get,
  };
});

const mockedGet = require("axios").__mockGet;

beforeEach(() => {
  clearApiCache();
  mockedGet.mockReset();
});

test("caches identical successful GET responses", async () => {
  mockedGet.mockResolvedValue({ status: 200, data: [{ id: 1 }] });

  const first = await cachedGet("/posts", { params: { userId: 1 } });
  const second = await cachedGet("/posts", { params: { userId: 1 } });

  expect(first).toBe(second);
  expect(mockedGet).toHaveBeenCalledTimes(1);
});

test("deduplicates identical requests already in flight", async () => {
  let resolveRequest;
  mockedGet.mockReturnValue(
    new Promise((resolve) => {
      resolveRequest = resolve;
    })
  );

  const first = cachedGet("/posts");
  const second = cachedGet("/posts");
  resolveRequest({ status: 200, data: [] });

  await expect(first).resolves.toEqual({ status: 200, data: [] });
  await expect(second).resolves.toEqual({ status: 200, data: [] });
  expect(mockedGet).toHaveBeenCalledTimes(1);
});
