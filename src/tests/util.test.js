import {
  paginatePosts,
  scorePostRelevance,
  sortPostsByRelevance,
} from "../utils/util";

test("scores title matches above body matches", () => {
  const titleMatch = { id: 1, title: "Caching APIs", body: "Other content" };
  const bodyMatch = { id: 2, title: "Other content", body: "Caching APIs" };

  expect(scorePostRelevance(titleMatch, "caching")).toBeGreaterThan(
    scorePostRelevance(bodyMatch, "caching")
  );
  expect(sortPostsByRelevance([bodyMatch, titleMatch], "caching")[0]).toBe(
    titleMatch
  );
});

test("clamps pagination to valid page boundaries", () => {
  const result = paginatePosts([1, 2, 3, 4, 5], 99, 2);

  expect(result).toEqual({
    items: [5],
    page: 3,
    pageSize: 2,
    totalItems: 5,
    totalPages: 3,
  });
});
