import { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import { Avatar } from "./Avatar";
import { formatCount, timeAgo } from "../utils/format";
import { CommentsModal } from "./CommentsModal";

type Props = {
  postId: string;
  onOpenProfile: (userId: string) => void;
};

export function PostCard({ postId, onOpenProfile }: Props) {
  const {
    state,
    currentUser,
    getPostAuthor,
    toggleLike,
    toggleFollow,
    deletePost,
    isFollowing,
    commentsFor,
    setView,
  } = useApp();

  const [showComments, setShowComments] = useState(false);

  const post = useMemo(() => state.posts.find((p) => p.id === postId), [state.posts, postId]);
  if (!post) return null;

  const author = getPostAuthor(post);
  if (!author) return null;

  const liked = !!currentUser && post.likes.includes(currentUser.id);
  const following = !!currentUser && isFollowing(currentUser.id, author.id);
  const isOwn = !!currentUser && currentUser.id === author.id;
  const commentCount = commentsFor(post.id).length;

  return (
    <>
      <article className="group relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
        <header className="flex items-start gap-3">
          <Avatar user={author} size="md" onClick={() => onOpenProfile(author.id)} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onOpenProfile(author.id)}
                className="truncate font-semibold text-slate-900 hover:underline"
              >
                {author.name}
              </button>
              <span className="truncate text-sm text-slate-500">@{author.username}</span>
              <span className="text-slate-300">·</span>
              <span className="text-sm text-slate-500">{timeAgo(post.createdAt)}</span>
            </div>
            {!isOwn && currentUser && (
              <button
                type="button"
                onClick={() => toggleFollow(author.id)}
                className={
                  "mt-1 rounded-full px-3 py-0.5 text-xs font-medium transition " +
                  (following
                    ? "border border-slate-300 text-slate-700 hover:border-rose-300 hover:text-rose-600"
                    : "bg-slate-900 text-white hover:bg-slate-700")
                }
              >
                {following ? "Following" : "Follow"}
              </button>
            )}
          </div>
          {isOwn && (
            <button
              type="button"
              onClick={() => {
                if (confirm("Delete this post?")) deletePost(post.id);
              }}
              className="rounded-full p-2 text-slate-400 opacity-0 transition hover:bg-rose-50 hover:text-rose-600 group-hover:opacity-100"
              aria-label="Delete post"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18" />
                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              </svg>
            </button>
          )}
        </header>

        <div className="mt-3 whitespace-pre-wrap text-[15px] leading-relaxed text-slate-800">
          {post.text}
        </div>

        {post.image && (
          <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">
            <img
              src={post.image}
              alt=""
              className="max-h-[480px] w-full object-cover"
              loading="lazy"
            />
          </div>
        )}

        <footer className="mt-4 flex items-center gap-1 text-slate-500">
          <button
            type="button"
            onClick={() => currentUser && toggleLike(post.id)}
            className={
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition " +
              (liked
                ? "bg-rose-50 text-rose-600"
                : "hover:bg-rose-50 hover:text-rose-600")
            }
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill={liked ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span className="font-medium">{formatCount(post.likes.length)}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setView({ name: "post", postId: post.id });
              setShowComments(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition hover:bg-indigo-50 hover:text-indigo-600"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span className="font-medium">{commentCount}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(post.text).catch(() => {});
              }
            }}
            className="ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition hover:bg-slate-100"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <path d="M8.59 13.51l6.83 3.98" />
              <path d="M15.41 6.51l-6.82 3.98" />
            </svg>
            <span>Share</span>
          </button>
        </footer>
      </article>

      {showComments && (
        <CommentsModal postId={post.id} onClose={() => setShowComments(false)} />
      )}
    </>
  );
}
