import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import HomeComponent from "../components/HomeComponent";
import { clickAction } from "../utils/util";

jest.mock("../utils/logger", () => ({
  __esModule: true,
  default: { debug: jest.fn(), info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}));

jest.mock("../utils/util", () => {
  const actual = jest.requireActual("../utils/util");
  return { ...actual, clickAction: jest.fn() };
});

const posts = Array.from({ length: 12 }, (_, index) => ({
  id: index + 1,
  title: index === 2 ? "React performance guide" : `Post title ${index + 1}`,
  body: index === 5 ? "A short guide to React" : `Post body ${index + 1}`,
}));

beforeEach(() => {
  clickAction.mockResolvedValue(posts);
});

test("loads posts and paginates the relevance-sorted list", async () => {
  render(<HomeComponent />);

  expect(await screen.findByText("12 posts available")).toBeInTheDocument();
  expect(screen.getAllByRole("article")).toHaveLength(10);
  expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Next" }));
  expect(screen.getByText("Page 2 of 2")).toBeInTheDocument();
  expect(screen.getAllByRole("article")).toHaveLength(2);
});

test("ranks title matches ahead of body matches", async () => {
  render(<HomeComponent />);
  await screen.findByText("12 posts available");

  fireEvent.change(screen.getByRole("searchbox", { name: "Search posts" }), {
    target: { value: "React" },
  });

  await waitFor(() => {
    const cards = screen.getAllByRole("article");
    expect(within(cards[0]).getByText("React performance guide")).toBeInTheDocument();
    expect(within(cards[1]).getByText("Post title 6")).toBeInTheDocument();
  });
});

test("shows a retry action when loading fails", async () => {
  clickAction.mockRejectedValueOnce(new Error("offline"));
  render(<HomeComponent />);

  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Posts could not be loaded"
  );
});
