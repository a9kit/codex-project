import { cachedGet } from "../api/api";

const countMatches = (text, term) => {
  if (!term) return 0;
  return text.split(term).length - 1;
};

export const scorePostRelevance = (post, query) => {
  const phrase = String(query ?? "").trim().toLowerCase();
  if (!phrase) return 0;

  const title = String(post.title ?? "").toLowerCase();
  const body = String(post.body ?? "").toLowerCase();
  const terms = [...new Set(phrase.split(/\s+/).filter(Boolean))];

  return (
    countMatches(title, phrase) * 10 +
    countMatches(body, phrase) * 4 +
    terms.reduce(
      (score, term) =>
        score + countMatches(title, term) * 3 + countMatches(body, term),
      0
    )
  );
};

export const sortPostsByRelevance = (posts, query = "") =>
  [...posts].sort((left, right) => {
    const scoreDifference =
      scorePostRelevance(right, query) - scorePostRelevance(left, query);
    return scoreDifference || right.id - left.id;
  });

export const paginatePosts = (posts, page, pageSize) => {
  const safePageSize = Number.isInteger(pageSize) && pageSize > 0 ? pageSize : 10;
  const requestedPage = Number.isInteger(page) ? page : 1;
  const totalPages = Math.max(1, Math.ceil(posts.length / safePageSize));
  const safePage = Math.min(Math.max(1, requestedPage), totalPages);
  const start = (safePage - 1) * safePageSize;

  return {
    items: posts.slice(start, start + safePageSize),
    page: safePage,
    pageSize: safePageSize,
    totalItems: posts.length,
    totalPages,
  };
};

export const clickAction = async (options = {}) => {
  const { data } = await cachedGet("/posts", options);
  return data;
};
