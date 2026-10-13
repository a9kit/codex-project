import axios from "axios";
import logger from "../utils/logger";

const DEFAULT_CACHE_TTL = 5 * 60 * 1000;
const responseCache = new Map();
const pendingRequests = new Map();
let cacheGeneration = 0;

const http = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
  timeout: 10000,
});

const cacheKey = (url, params = {}) => {
  const normalizedParams = Object.keys(params)
    .sort()
    .map((key) => [key, params[key]]);
  return JSON.stringify([url, normalizedParams]);
};

/** Cache successful GETs and share concurrent identical requests. */
export const cachedGet = (url, options = {}) => {
  const {
    params = {},
    ttl = DEFAULT_CACHE_TTL,
    force = false,
    ...requestOptions
  } = options;
  const key = cacheKey(url, params);
  const cached = responseCache.get(key);

  if (!force && cached && cached.expiresAt > Date.now()) {
    logger.debug("API cache hit", { url, params });
    return Promise.resolve(cached.response);
  }

  if (cached) {
    responseCache.delete(key);
  }

  // A forced refresh bypasses stored data, but can still share a refresh that
  // is already in progress for the same resource.
  if (pendingRequests.has(key)) {
    logger.debug("API request deduplicated", { url, params });
    return pendingRequests.get(key);
  }

  logger.info("API request started", { url, params });
  const startedAt = Date.now();
  const requestGeneration = cacheGeneration;
  const request = http
    .get(url, { ...requestOptions, params })
    .then((response) => {
      // Do not let a request started before clearApiCache repopulate it.
      if (requestGeneration === cacheGeneration && ttl > 0) {
        responseCache.set(key, {
          response,
          expiresAt: Date.now() + ttl,
        });
      }
      logger.info("API request completed", {
        url,
        status: response.status,
        durationMs: Date.now() - startedAt,
      });
      return response;
    })
    .catch((error) => {
      logger.error("API request failed", {
        url,
        status: error.response?.status,
        message: error.message,
        durationMs: Date.now() - startedAt,
      });
      throw error;
    })
    .finally(() => {
      if (pendingRequests.get(key) === request) {
        pendingRequests.delete(key);
      }
    });

  pendingRequests.set(key, request);
  return request;
};

export const clearApiCache = () => {
  cacheGeneration += 1;
  responseCache.clear();
  pendingRequests.clear();
  logger.debug("API cache cleared");
};

export default http;
