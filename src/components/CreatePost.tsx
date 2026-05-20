import { useState } from "react";
import { useApp } from "../context/AppContext";
import { Avatar } from "./Avatar";

export function CreatePost() {
  const { currentUser, createPost } = useApp();
  const [text, setText] = useState("");
  const [image, setImage] = useState("");
  const [showImage, setShowImage] = useState(false);

  if (!currentUser) return null;

  const canPost = text.trim().length > 0 || image.trim().length > 0;

  const submit = () => {
    if (!canPost) return;
    createPost(text.trim(), image.trim() || undefined);
    setText("");
    setImage("");
    setShowImage(false);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <Avatar user={currentUser} size="md" />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`What's on your mind, ${currentUser.name.split(" ")[0]}?`}
          rows={3}
          className="flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-[15px] outline-none transition focus:border-indigo-300 focus:bg-white"
        />
      </div>

      {showImage && (
        <div className="mt-3 flex items-center gap-2">
          <input
            type="url"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="Paste an image URL (optional)"
            className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm outline-none focus:border-indigo-300 focus:bg-white"
          />
          <button
            type="button"
            onClick={() => {
              setShowImage(false);
              setImage("");
            }}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Remove image"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setShowImage((s) => !s)}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-indigo-600 hover:bg-indigo-50"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
            Photo
          </button>
          <span className="ml-2 text-xs text-slate-400">
            {text.length > 0 ? `${text.length}/500` : ""}
          </span>
        </div>
        <button
          type="button"
          onClick={submit}
          disabled={!canPost || text.length > 500}
          className="rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
        >
          Post
        </button>
      </div>
    </div>
  );
}
