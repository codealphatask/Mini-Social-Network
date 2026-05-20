import { useMemo } from "react";
import { useApp } from "../context/AppContext";
import { CreatePost } from "./CreatePost";
import { PostCard } from "./PostCard";

export function Feed() {
  const { state, currentUser, followingOf, view, setView } = useApp();

  const posts = useMemo(() => {
    if (!currentUser) {
      return [...state.posts].sort((a, b) => b.createdAt - a.createdAt);
    }
    if (view.name === "home") {
      const following = new Set(followingOf(currentUser.id));
      following.add(currentUser.id);
      return [...state.posts]
        .filter((p) => following.has(p.authorId))
        .sort((a, b) => b.createdAt - a.createdAt);
    }
    // explore = everything
    return [...state.posts].sort((a, b) => b.createdAt - a.createdAt);
  }, [state.posts, currentUser, followingOf, view]);

  const following = currentUser ? new Set(followingOf(currentUser.id)) : new Set<string>();
  const showEmpty = currentUser && view.name === "home" && posts.length === 0;

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4 px-4 py-5 lg:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {view.name === "explore" ? "Explore" : "Home"}
          </h1>
          <p className="text-sm text-slate-500">
            {view.name === "explore"
              ? "Discover posts from everyone on Orbit"
              : currentUser && following.size <= 1
                ? "Follow people to build your feed"
                : "Latest from the people you follow"}
          </p>
        </div>
        {currentUser && view.name === "home" && (
          <button
            type="button"
            onClick={() => setView({ name: "explore" })}
            className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            Explore →
          </button>
        )}
      </div>

      {currentUser && view.name === "home" && <CreatePost />}

      {showEmpty ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <div className="mb-2 text-3xl">🌌</div>
          <div className="font-semibold text-slate-800">Your orbit is quiet</div>
          <div className="mt-1 text-sm text-slate-500">
            Follow some people from the right panel to start seeing posts.
          </div>
          <button
            type="button"
            onClick={() => setView({ name: "explore" })}
            className="mt-4 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
          >
            Browse explore
          </button>
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
          No posts yet. Be the first to share something.
        </div>
      ) : (
        <ul className="space-y-4">
          {posts.map((p) => (
            <li key={p.id}>
              <PostCard
                postId={p.id}
                onOpenProfile={(id) => setView({ name: "profile", userId: id })}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
