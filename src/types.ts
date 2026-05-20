export type User = {
  id: string;
  username: string;
  name: string;
  avatar: string; // emoji or color token
  avatarBg: string; // tailwind bg class
  bio: string;
  joinedAt: number;
};

export type Comment = {
  id: string;
  postId: string;
  authorId: string;
  text: string;
  createdAt: number;
};

export type Post = {
  id: string;
  authorId: string;
  text: string;
  image?: string; // optional unsplash-like url
  createdAt: number;
  likes: string[]; // array of userIds
};

export type FollowEdge = {
  followerId: string;
  followingId: string;
};

export type AppState = {
  users: User[];
  posts: Post[];
  comments: Comment[];
  follows: FollowEdge[];
  currentUserId: string | null;
};

export type View =
  | { name: "home" }
  | { name: "explore" }
  | { name: "profile"; userId: string }
  | { name: "post"; postId: string };
