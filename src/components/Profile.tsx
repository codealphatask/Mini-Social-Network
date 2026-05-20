import { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import { Avatar } from "./Avatar";
import { PostCard } from "./PostCard";
import { formatCount } from "../utils/format";

type Props = {
  userId: string;
};

const PALETTES = [
  { label: "Violet", value: "from-violet-500 to-fuchsia-500" },
  { label: "Sky", value: "from-sky-500 to-cyan-400" },
  { label: "Rose", value: "from-rose-500 to-orange-400" },
  { label: "Emerald", value: "from-emerald-500 to-teal-500" },
  { label: "Amber", value: "from-amber-500 to-yellow-400" },
  { label: "Indigo", value: "from-indigo-500 to-purple-500" },
];

const EMOJIS = ["🌙", "🌊", "🎨", "🍣", "📚", "🛰️", "✨", "🦋", "🌿", "🎧", "🧭", "🔮", "🪐", "🧃", "🦊", "🍄"];

export function Profile({ userId }: Props) {
  const {
    state,
    currentUser,
    getUser,
    followersOf,
    followingOf,
    toggleFollow,
    isFollowing,
    updateProfile,
    setView,
  } = useApp();

  const user = getUser(userId);
  const [tab, setTab] = useState<"posts" | "followers" | "following">("posts");
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarBg, setAvatarBg] = useState("");

  const followerIds = useMemo(() => followersOf(userId), [followersOf, userId]);
  const followingIds = useMemo(() => followingOf(userId), [followingOf, userId]);
  const userPosts = useMemo(
    () =>
      [...state.posts]
        .filter((p) => p.authorId === userId)
        .sort((a, b) => b.createdAt - a.createdAt),
    [state.posts, userId]
  );

  if (!user) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-10 text-center text-slate-500">
        User not found.
      </div>
    );
  }

  const isOwn = !!currentUser && currentUser.id === user.id;
  const following = !!currentUser && isFollowing(currentUser.id, user.id);

  const startEdit = () => {
    setName(user.name);
    setBio(user.bio);
    setAvatar(user.avatar);
    setAvatarBg(user.avatarBg);
    setEditing(true);
  };

  const saveEdit = () => {
    updateProfile({
      name: name.trim() || user.name,
      bio: bio.trim(),
      avatar,
      avatarBg,
    });
    setEditing(false);
  };

  const cover = `bg-gradient-to-br ${user.avatarBg}`;

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4 px-4 py-5 lg:px-6">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className={`h-32 ${cover}`} />
        <div className="px-5 pb-5">
          <div className="-mt-10 flex items-end justify-between">
            <Avatar user={user} size="xl" ring />
            <div className="flex items-center gap-2">
              {isOwn ? (
                <button
                  type="button"
                  onClick={startEdit}
                  className="rounded-full border border-slate-300 bg-white px-4 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Edit profile
                </button>
              ) : currentUser ? (
                <button
                  type="button"
                  onClick={() => toggleFollow(user.id)}
                  className={
                    "rounded-full px-5 py-1.5 text-sm font-semibold transition " +
                    (following
                      ? "border border-slate-300 text-slate-700 hover:border-rose-300 hover:text-rose-600"
                      : "bg-slate-900 text-white hover:bg-slate-700")
                  }
                >
                  {following ? "Following" : "Follow"}
                </button>
              ) : null}
            </div>
          </div>
          <div className="mt-3">
            <h1 className="text-xl font-bold text-slate-900">{user.name}</h1>
            <div className="text-sm text-slate-500">@{user.username}</div>
            <p className="mt-2 whitespace-pre-wrap text-[15px] text-slate-700">{user.bio}</p>
            <div className="mt-3 flex items-center gap-4 text-sm">
              <button
                type="button"
                onClick={() => setTab("following")}
                className="text-slate-600 hover:underline"
              >
                <span className="font-semibold text-slate-900">{formatCount(followingIds.length)}</span>{" "}
                Following
              </button>
              <button
                type="button"
                onClick={() => setTab("followers")}
                className="text-slate-600 hover:underline"
              >
                <span className="font-semibold text-slate-900">{formatCount(followerIds.length)}</span>{" "}
                Follower{followerIds.length === 1 ? "" : "s"}
              </button>
              <span className="text-slate-400">·</span>
              <span className="text-slate-500">{userPosts.length} posts</span>
            </div>
          </div>
        </div>
      </div>

      {editing && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-base font-semibold text-slate-900">Edit profile</h2>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-indigo-300 focus:bg-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-indigo-300 focus:bg-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Avatar</label>
              <div className="flex flex-wrap gap-2">
                {EMOJIS.map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => setAvatar(e)}
                    className={
                      "flex h-10 w-10 items-center justify-center rounded-full border text-lg transition " +
                      (avatar === e
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-slate-200 hover:border-slate-300")
                    }
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Color</label>
              <div className="flex flex-wrap gap-2">
                {PALETTES.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setAvatarBg(p.value)}
                    className={
                      "h-9 w-16 rounded-full bg-gradient-to-br transition " +
                      p.value +
                      (avatarBg === p.value ? " ring-2 ring-indigo-500 ring-offset-2" : "")
                    }
                    aria-label={p.label}
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="rounded-full border border-slate-300 px-4 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveEdit}
                className="rounded-full bg-slate-900 px-4 py-1.5 text-sm font-semibold text-white hover:bg-slate-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-1 rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
        {(["posts", "followers", "following"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={
              "flex-1 rounded-xl px-3 py-2 text-sm font-medium capitalize transition " +
              (tab === t ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50")
            }
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "posts" &&
        (userPosts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
            {isOwn ? "You haven't posted anything yet." : "No posts yet."}
          </div>
        ) : (
          <ul className="space-y-4">
            {userPosts.map((p) => (
              <li key={p.id}>
                <PostCard
                  postId={p.id}
                  onOpenProfile={(id) => setView({ name: "profile", userId: id })}
                />
              </li>
            ))}
          </ul>
        ))}

      {tab === "followers" && (
        <UserList
          userIds={followerIds}
          emptyText="No followers yet."
          onOpenProfile={(id) => setView({ name: "profile", userId: id })}
        />
      )}
      {tab === "following" && (
        <UserList
          userIds={followingIds}
          emptyText="Not following anyone yet."
          onOpenProfile={(id) => setView({ name: "profile", userId: id })}
        />
      )}
    </div>
  );
}

function UserList({
  userIds,
  emptyText,
  onOpenProfile,
}: {
  userIds: string[];
  emptyText: string;
  onOpenProfile: (id: string) => void;
}) {
  const { getUser, currentUser, toggleFollow, isFollowing } = useApp();
  if (userIds.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
        {emptyText}
      </div>
    );
  }
  return (
    <ul className="space-y-2">
      {userIds.map((id) => {
        const u = getUser(id);
        if (!u) return null;
        const following = !!currentUser && isFollowing(currentUser.id, u.id);
        return (
          <li
            key={id}
            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
          >
            <Avatar user={u} size="md" onClick={() => onOpenProfile(u.id)} />
            <div className="min-w-0 flex-1">
              <button
                type="button"
                onClick={() => onOpenProfile(u.id)}
                className="truncate text-sm font-semibold text-slate-900 hover:underline"
              >
                {u.name}
              </button>
              <div className="truncate text-xs text-slate-500">@{u.username}</div>
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
  );
}
