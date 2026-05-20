import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AppState, Comment, Post, User, View } from "../types";
import { buildSeedState } from "../data/seed";

const STORAGE_KEY = "orbit.social.v1";

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return buildSeedState();
    const parsed = JSON.parse(raw) as AppState;
    if (!parsed.users?.length) return buildSeedState();
    return parsed;
  } catch {
    return buildSeedState();
  }
}

function persist(state: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore quota errors */
  }
}

type Ctx = {
  state: AppState;
  view: View;
  setView: (v: View) => void;
  currentUser: User | null;
  getUser: (id: string) => User | undefined;
  getPostAuthor: (post: Post) => User | undefined;
  followersOf: (userId: string) => string[];
  followingOf: (userId: string) => string[];
  isFollowing: (followerId: string, followingId: string) => boolean;
  toggleFollow: (targetId: string) => void;
  toggleLike: (postId: string) => void;
  createPost: (text: string, image?: string) => void;
  deletePost: (postId: string) => void;
  commentsFor: (postId: string) => (Comment & { author: User | undefined })[];
  addComment: (postId: string, text: string) => void;
  signUp: (username: string, name: string, bio: string) => void;
  logIn: (username: string) => void;
  logOut: () => void;
  updateProfile: (patch: Partial<Pick<User, "name" | "bio" | "avatar" | "avatarBg">>) => void;
  resetDemo: () => void;
};

const AppContext = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => loadState());
  const [view, setView] = useState<View>({ name: "home" });

  useEffect(() => {
    persist(state);
  }, [state]);

  const currentUser = useMemo(
    () => state.users.find((u) => u.id === state.currentUserId) ?? null,
    [state]
  );

  const getUser = useCallback(
    (id: string) => state.users.find((u) => u.id === id),
    [state.users]
  );

  const getPostAuthor = useCallback(
    (post: Post) => state.users.find((u) => u.id === post.authorId),
    [state.users]
  );

  const followersOf = useCallback(
    (userId: string) =>
      state.follows.filter((f) => f.followingId === userId).map((f) => f.followerId),
    [state.follows]
  );

  const followingOf = useCallback(
    (userId: string) =>
      state.follows.filter((f) => f.followerId === userId).map((f) => f.followingId),
    [state.follows]
  );

  const isFollowing = useCallback(
    (followerId: string, followingId: string) =>
      state.follows.some((f) => f.followerId === followerId && f.followingId === followingId),
    [state.follows]
  );

  const toggleFollow = useCallback(
    (targetId: string) => {
      if (!state.currentUserId) return;
      if (targetId === state.currentUserId) return;
      setState((s) => {
        const exists = s.follows.some(
          (f) => f.followerId === s.currentUserId && f.followingId === targetId
        );
        return {
          ...s,
          follows: exists
            ? s.follows.filter(
                (f) => !(f.followerId === s.currentUserId && f.followingId === targetId)
              )
            : [...s.follows, { followerId: s.currentUserId!, followingId: targetId }],
        };
      });
    },
    [state.currentUserId]
  );

  const toggleLike = useCallback(
    (postId: string) => {
      if (!state.currentUserId) return;
      setState((s) => ({
        ...s,
        posts: s.posts.map((p) => {
          if (p.id !== postId) return p;
          const liked = p.likes.includes(s.currentUserId!);
          return {
            ...p,
            likes: liked
              ? p.likes.filter((id) => id !== s.currentUserId)
              : [...p.likes, s.currentUserId!],
          };
        }),
      }));
    },
    [state.currentUserId]
  );

  const createPost = useCallback(
    (text: string, image?: string) => {
      if (!state.currentUserId) return;
      const post: Post = {
        id: `p_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        authorId: state.currentUserId,
        text,
        image,
        createdAt: Date.now(),
        likes: [],
      };
      setState((s) => ({ ...s, posts: [post, ...s.posts] }));
    },
    [state.currentUserId]
  );

  const deletePost = useCallback((postId: string) => {
    setState((s) => ({
      ...s,
      posts: s.posts.filter((p) => p.id !== postId),
      comments: s.comments.filter((c) => c.postId !== postId),
    }));
  }, []);

  const commentsFor = useCallback(
    (postId: string) =>
      state.comments
        .filter((c) => c.postId === postId)
        .sort((a, b) => a.createdAt - b.createdAt)
        .map((c) => ({ ...c, author: state.users.find((u) => u.id === c.authorId) })),
    [state.comments, state.users]
  );

  const addComment = useCallback(
    (postId: string, text: string) => {
      if (!state.currentUserId) return;
      const comment: Comment = {
        id: `c_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        postId,
        authorId: state.currentUserId,
        text,
        createdAt: Date.now(),
      };
      setState((s) => ({ ...s, comments: [...s.comments, comment] }));
    },
    [state.currentUserId]
  );

  const signUp = useCallback((username: string, name: string, bio: string) => {
    const handle = username.trim().toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_.]/g, "");
    if (!handle) return;
    setState((s) => {
      if (s.users.some((u) => u.username === handle)) {
        // if exists, just log them in
        const existing = s.users.find((u) => u.username === handle)!;
        return { ...s, currentUserId: existing.id };
      }
      const palettes = [
        "from-violet-500 to-fuchsia-500",
        "from-sky-500 to-cyan-400",
        "from-rose-500 to-orange-400",
        "from-emerald-500 to-teal-500",
        "from-amber-500 to-yellow-400",
        "from-indigo-500 to-purple-500",
      ];
      const emojis = ["✨", "🦋", "🌿", "🎧", "🧭", "🔮", "🪐", "🧃"];
      const user: User = {
        id: `u_${Date.now()}`,
        username: handle,
        name: name.trim() || handle,
        avatar: emojis[Math.floor(Math.random() * emojis.length)],
        avatarBg: palettes[Math.floor(Math.random() * palettes.length)],
        bio: bio.trim() || "New to Orbit 👋",
        joinedAt: Date.now(),
      };
      return { ...s, users: [...s.users, user], currentUserId: user.id };
    });
  }, []);

  const logIn = useCallback((username: string) => {
    const handle = username.trim().toLowerCase();
    setState((s) => {
      const user = s.users.find((u) => u.username === handle);
      if (!user) return s;
      return { ...s, currentUserId: user.id };
    });
  }, []);

  const logOut = useCallback(() => {
    setState((s) => ({ ...s, currentUserId: null }));
    setView({ name: "home" });
  }, []);

  const updateProfile = useCallback(
    (patch: Partial<Pick<User, "name" | "bio" | "avatar" | "avatarBg">>) => {
      if (!state.currentUserId) return;
      setState((s) => ({
        ...s,
        users: s.users.map((u) => (u.id === s.currentUserId ? { ...u, ...patch } : u)),
      }));
    },
    [state.currentUserId]
  );

  const resetDemo = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState(buildSeedState());
    setView({ name: "home" });
  }, []);

  const value: Ctx = {
    state,
    view,
    setView,
    currentUser,
    getUser,
    getPostAuthor,
    followersOf,
    followingOf,
    isFollowing,
    toggleFollow,
    toggleLike,
    createPost,
    deletePost,
    commentsFor,
    addComment,
    signUp,
    logIn,
    logOut,
    updateProfile,
    resetDemo,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
