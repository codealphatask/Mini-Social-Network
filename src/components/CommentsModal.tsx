import { useEffect } from "react";
import { useApp } from "../context/AppContext";
import { Avatar } from "./Avatar";
import { useState } from "react";

type Props = {
  postId: string;
  onClose: () => void;
};

export function CommentsModal({ postId, onClose }: Props) {
  const { state, currentUser, commentsFor, addComment, getPostAuthor } = useApp();
  const [text, setText] = useState("");

  const post = state.posts.find((p) => p.id === postId);
  const author = post ? getPostAuthor(post) : undefined;
  const comments = commentsFor(postId);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!post || !author) return null;

  const submit = () => {
    const t = text.trim();
    if (!t || !currentUser) return;
    addComment(postId, t);
    setText("");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="flex h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:h-[80vh] sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-900">Comments</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Close"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div className="border-b border-slate-100 bg-slate-50/50 px-5 py-4">
          <div className="flex items-start gap-3">
            <Avatar user={author} size="sm" />
            <p className="whitespace-pre-wrap text-sm text-slate-700">{post.text}</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {comments.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-400">
              No comments yet. Be the first to reply.
            </div>
          ) : (
            <ul className="space-y-4">
              {comments.map((c) => (
                <li key={c.id} className="flex items-start gap-3">
                  <Avatar user={c.author} size="sm" />
                  <div className="min-w-0 flex-1 rounded-2xl bg-slate-100 px-3.5 py-2.5">
                    <div className="text-sm font-semibold text-slate-900">
                      {c.author?.name ?? "Unknown"}
                    </div>
                    <div className="whitespace-pre-wrap text-sm text-slate-700">{c.text}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-slate-200 px-4 py-3">
          {currentUser ? (
            <div className="flex items-end gap-2">
              <Avatar user={currentUser} size="sm" />
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit();
                }}
                placeholder="Write a reply…"
                rows={1}
                className="flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:bg-white"
              />
              <button
                type="button"
                onClick={submit}
                disabled={!text.trim()}
                className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Reply
              </button>
            </div>
          ) : (
            <div className="rounded-xl bg-slate-50 py-3 text-center text-sm text-slate-500">
              Sign in to join the conversation.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
