import { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import { Avatar } from "./Avatar";

export function RightPanel() {
  const { state, currentUser, followersOf, followingOf, toggleFollow, isFollowing, setView, resetDemo } =
    useApp();
  const [query, setQuery] = useState("");

  const suggestions = useMemo(() => {
    if (!currentUser) return state.users.slice(0, 5);
    const followingIds = new Set(followingOf(currentUser.id));
    followingIds.add(currentUser.id);
    return state.users.filter((u) => !followingIds.has(u.id)).slice(0, 5);
  }, [state.users, currentUser, followingOf]);

  const trendingPosts = useMemo(() => {
    return [...state.posts]
      .sort((a, b) => b.likes.length - a.likes.length)
      .slice(0, 3);
  }, [state.posts]);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return state.users
      .filter(
        (u) =>
          u.username.toLowerCase().includes(q) ||
          u.name.toLowerCase().includes(q)
      )
      .slice(0, 5);
  }, [state.users, query]);

  return (
    <aside className="sticky top-0 hidden h-screen w-full max-w-[320px] shrink-0 flex-col gap-5 overflow-y-auto px-4 py-5 lg:flex">
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="relative">
          <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search people…"
            className="w-full rounded-full border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-sm outline-none focus:border-indigo-300 focus:bg-white"
          />
        </div>
        {searchResults.length > 0 && (
          <ul className="mt-3 space-y-2">
            {searchResults.map((u) => (
              <li key={u.id}>
                <button
                  type="button"
                  onClick={() => {
                    setView({ name: "profile", userId: u.id });
                    setQuery("");
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-slate-50"
                >
                  <Avatar user={u} size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-slate-900">{u.name}</div>
                    <div className="truncate text-xs text-slate-500">@{u.username}</div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            {currentUser ? "Who to follow" : "People on Orbit"}
          </h3>
        </div>
        <ul className="space-y-3">
          {suggestions.map((u) => {
            const followerCount = followersOf(u.id).length;
            const following = !!currentUser && isFollowing(currentUser.id, u.id);
            return (
              <li key={u.id} className="flex items-center gap-3">
                <Avatar
                  user={u}
                  size="sm"
                  onClick={() => setView({ name: "profile", userId: u.id })}
                />
                <div className="min-w-0 flex-1">
                  <button
                    type="button"
                    onClick={() => setView({ name: "profile", userId: u.id })}
                    className="block truncate text-sm font-semibold text-slate-900 hover:underline"
                  >
                    {u.name}
                  </button>
                  <div className="truncate text-xs text-slate-500">
                    {followerCount} follower{followerCount === 1 ? "" : "s"}
                  </div>
                </div>
                {currentUser && currentUser.id !== u.id && (
                  <button
                    type="button"
                    onClick={() => toggleFollow(u.id)}
                    className={
                      "shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition " +
                      (following
                        ? "border border-slate-300 text-slate-700 hover:border-rose-300 hover:text-rose-600"
                        : "bg-slate-900 text-white hover:bg-slate-700")
                    }
                  >
                    {following ? "Following" : "Follow"}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <h3 className="mb-3 text-sm font-bold text-slate-900">Trending now</h3>
        <ul className="space-y-3">
          {trendingPosts.map((p) => {
            const author = state.users.find((u) => u.id === p.authorId);
            return (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => setView({ name: "post", postId: p.id })}
                  className="block w-full text-left"
                >
                  <div className="text-xs text-slate-500">
                    {author ? `@${author.username}` : ""} · {p.likes.length} likes
                  </div>
                  <div className="line-clamp-2 text-sm font-medium text-slate-800">
                    {p.text}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <button
        type="button"
        onClick={resetDemo}
        className="text-center text-xs text-slate-400 hover:text-slate-600"
      >
        Reset demo data
      </button>
    </aside>
  );
}
