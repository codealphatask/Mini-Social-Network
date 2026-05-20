import { useEffect } from "react";
import { useApp } from "../context/AppContext";
import { CommentsModal } from "./CommentsModal";
import { PostCard } from "./PostCard";

export function PostDetail() {
  const { view, setView, state } = useApp();
  useEffect(() => {}, []);
  if (view.name !== "post") return null;
  const post = state.posts.find((p) => p.id === view.postId);
  if (!post) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-10 text-center text-slate-500">
        Post not found.
      </div>
    );
  }
  return (
    <>
      <div className="mx-auto w-full max-w-2xl space-y-4 px-4 py-5 lg:px-6">
        <button
          type="button"
          onClick={() => setView({ name: "home" })}
          className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <PostCard postId={post.id} onOpenProfile={(id) => setView({ name: "profile", userId: id })} />
      </div>
      <CommentsModal postId={post.id} onClose={() => setView({ name: "home" })} />
    </>
  );
}
