import { useCallback, useEffect, useMemo, useState } from "react";
import "../App.css";
import logger from "../utils/logger";
import {
  clickAction,
  paginatePosts,
  sortPostsByRelevance,
} from "../utils/util";

const PAGE_SIZE = 10;

function HomeComponent() {
  const [posts, setPosts] = useState([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPosts = useCallback(async (force = false) => {
    setLoading(true);
    setError("");
    try {
      const result = await clickAction({ force });
      setPosts(result);
      setPage(1);
      logger.info("Posts loaded", { count: result.length, force });
    } catch (requestError) {
      setError("Posts could not be loaded. Please try again.");
      logger.error("Posts could not be displayed", {
        message: requestError.message,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const sortedPosts = useMemo(
    () => sortPostsByRelevance(posts, query),
    [posts, query]
  );
  const pagination = useMemo(
    () => paginatePosts(sortedPosts, page, PAGE_SIZE),
    [sortedPosts, page]
  );

  const updateQuery = (event) => {
    setQuery(event.target.value);
    setPage(1);
  };

  return (
    <main className="posts-page">
      <section className="posts-shell" aria-labelledby="posts-heading">
        <div className="posts-header">
          <div>
            <p className="eyebrow">Community feed</p>
            <h1 id="posts-heading">Relevant posts</h1>
            <p className="posts-summary" aria-live="polite">
              {loading ? "Loading posts…" : `${posts.length} posts available`}
            </p>
          </div>
          <button
            type="button"
            className="refresh-button"
            onClick={() => loadPosts(true)}
            disabled={loading}
          >
            {loading ? "Loading…" : "Refresh posts"}
          </button>
        </div>

        <label className="search-field">
          <span>Search posts</span>
          <input
            type="search"
            value={query}
            onChange={updateQuery}
            placeholder="Try a title or topic"
          />
        </label>

        {error && (
          <div className="error-message" role="alert">
            <span>{error}</span>
            <button type="button" onClick={() => loadPosts(true)}>
              Try again
            </button>
          </div>
        )}

        {!loading && !error && pagination.items.length === 0 && (
          <p className="empty-state">No posts match “{query}”.</p>
        )}

        <div className="post-list" aria-busy={loading}>
          {pagination.items.map((post) => (
            <article className="post-card" key={post.id}>
              <span className="post-number">Post {post.id}</span>
              <h2>{post.title}</h2>
              <p>{post.body}</p>
            </article>
          ))}
        </div>

        {!loading && !error && posts.length > 0 && (
          <nav className="pagination" aria-label="Post pages">
            <button
              type="button"
              onClick={() => setPage(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              Previous
            </button>
            <span>
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
            >
              Next
            </button>
          </nav>
        )}
      </section>
    </main>
  );
}

export default HomeComponent;
