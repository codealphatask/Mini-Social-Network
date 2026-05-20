import type { AppState, Post, User } from "../types";

export const SEED_USERS: User[] = [
  {
    id: "u_luna",
    username: "luna.codes",
    name: "Luna Alvarez",
    avatar: "🌙",
    avatarBg: "from-violet-500 to-fuchsia-500",
    bio: "Software engineer & synth enthusiast. Building tiny tools, sharing loud ideas.",
    joinedAt: Date.now() - 1000 * 60 * 60 * 24 * 120,
  },
  {
    id: "u_marco",
    username: "marco.waves",
    name: "Marco Reyes",
    avatar: "🌊",
    avatarBg: "from-sky-500 to-cyan-400",
    bio: "Surfer. Photographer. Chasing horizons one frame at a time.",
    joinedAt: Date.now() - 1000 * 60 * 60 * 24 * 90,
  },
  {
    id: "u_nia",
    username: "nia.designs",
    name: "Nia Okafor",
    avatar: "🎨",
    avatarBg: "from-rose-500 to-orange-400",
    bio: "Product designer. Coffee-powered. Currently obsessed with brutalist UI.",
    joinedAt: Date.now() - 1000 * 60 * 60 * 24 * 200,
  },
  {
    id: "u_kenji",
    username: "kenji.bites",
    name: "Kenji Tanaka",
    avatar: "🍣",
    avatarBg: "from-emerald-500 to-teal-500",
    bio: "Home chef documenting late-night experiments. Ramen enthusiast.",
    joinedAt: Date.now() - 1000 * 60 * 60 * 24 * 60,
  },
  {
    id: "u_priya",
    username: "priya.reads",
    name: "Priya Shah",
    avatar: "📚",
    avatarBg: "from-amber-500 to-yellow-400",
    bio: "Literature nerd. One book a week, no exceptions.",
    joinedAt: Date.now() - 1000 * 60 * 60 * 24 * 150,
  },
  {
    id: "u_sam",
    username: "sam.orbits",
    name: "Sam Rivera",
    avatar: "🛰️",
    avatarBg: "from-indigo-500 to-purple-500",
    bio: "Space nerd. I post about rockets, telescopes, and cosmic weather.",
    joinedAt: Date.now() - 1000 * 60 * 60 * 24 * 40,
  },
];

const now = Date.now();
const hour = 1000 * 60 * 60;

export const SEED_POSTS: Post[] = [
  {
    id: "p1",
    authorId: "u_luna",
    text: "Just shipped a tiny keyboard shortcut library — 40 lines of TypeScript, zero dependencies. Sometimes the smallest wins feel the biggest. 🎹",
    createdAt: now - hour * 2,
    likes: ["u_marco", "u_nia", "u_priya"],
  },
  {
    id: "p2",
    authorId: "u_marco",
    text: "Golden hour at Black's Beach. The ocean doesn't care about your deadlines and that's why I love it.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=70",
    createdAt: now - hour * 5,
    likes: ["u_luna", "u_kenji", "u_sam", "u_nia"],
  },
  {
    id: "p3",
    authorId: "u_nia",
    text: "Hot take: most 'redesigns' are just reshuffles. Real design work is removing, not adding. What's one thing your product could delete tomorrow?",
    createdAt: now - hour * 9,
    likes: ["u_luna", "u_priya"],
  },
  {
    id: "p4",
    authorId: "u_kenji",
    text: "Midnight ramen experiment: brown-butter miso tare + chili crisp + a soft egg. 10/10 would make again at 1am.",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=70",
    createdAt: now - hour * 14,
    likes: ["u_marco", "u_nia", "u_priya", "u_sam", "u_luna"],
  },
  {
    id: "p5",
    authorId: "u_priya",
    text: "Finished 'Piranesi' last night. Susanna Clarke built a cathedral out of sentences. If you loved The Starless Sea, start here.",
    createdAt: now - hour * 22,
    likes: ["u_luna", "u_nia"],
  },
  {
    id: "p6",
    authorId: "u_sam",
    text: "The James Webb telescope just imaged a galaxy 13.2 billion light-years away. Let that sink in — we're looking at light older than most of the universe's history.",
    createdAt: now - hour * 30,
    likes: ["u_luna", "u_marco", "u_priya"],
  },
];

export const SEED_FOLLOWS = [
  { followerId: "u_luna", followingId: "u_marco" },
  { followerId: "u_luna", followingId: "u_nia" },
  { followerId: "u_marco", followingId: "u_luna" },
  { followerId: "u_marco", followingId: "u_kenji" },
  { followerId: "u_nia", followingId: "u_luna" },
  { followerId: "u_nia", followingId: "u_priya" },
  { followerId: "u_kenji", followingId: "u_marco" },
  { followerId: "u_priya", followingId: "u_luna" },
  { followerId: "u_priya", followingId: "u_nia" },
  { followerId: "u_sam", followingId: "u_luna" },
  { followerId: "u_sam", followingId: "u_priya" },
];

export const SEED_COMMENTS = [
  {
    id: "c1",
    postId: "p1",
    authorId: "u_nia",
    text: "Love this. Drop the repo link!",
    createdAt: now - hour * 1.5,
  },
  {
    id: "c2",
    postId: "p1",
    authorId: "u_sam",
    text: "40 lines?? You're showing off 😄",
    createdAt: now - hour * 1.2,
  },
  {
    id: "c3",
    postId: "p2",
    authorId: "u_luna",
    text: "The color grading is unreal.",
    createdAt: now - hour * 4.5,
  },
  {
    id: "c4",
    postId: "p4",
    authorId: "u_marco",
    text: "Recipe or it didn't happen.",
    createdAt: now - hour * 13,
  },
];

export function buildSeedState(): AppState {
  return {
    users: SEED_USERS,
    posts: SEED_POSTS,
    comments: SEED_COMMENTS,
    follows: SEED_FOLLOWS,
    currentUserId: null,
  };
}
