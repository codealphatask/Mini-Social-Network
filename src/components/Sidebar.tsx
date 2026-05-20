import type { ReactNode } from "react";
import { useApp } from "../context/AppContext";
import { cn } from "../utils/cn";

type NavItem = { key: "home" | "explore" | "profile"; label: string; icon: ReactNode };

export function Sidebar() {
  const { view, setView, currentUser, logOut, state } = useApp();

  const items: NavItem[] = [
    {
      key: "home",
      label: "Home",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <path d="M9 22V12h6v10" />
        </svg>
      ),
    },
    {
      key: "explore",
      label: "Explore",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
      ),
    },
    {
      key: "profile",
      label: "Profile",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
  ];

  const handleNav = (key: NavItem["key"]) => {
    if (key === "profile") {
      if (currentUser) setView({ name: "profile", userId: currentUser.id });
      return;
    }
    setView({ name: key });
  };

  const isActive = (key: NavItem["key"]) => {
    if (key === "home") return view.name === "home";
    if (key === "explore") return view.name === "explore";
    if (key === "profile")
      return view.name === "profile" && view.userId === currentUser?.id;
    return false;
  };

  return (
    <aside className="sticky top-0 flex h-screen w-full max-w-[260px] shrink-0 flex-col justify-between border-r border-slate-200 bg-white px-4 py-5">
      <div>
        <div className="mb-6 flex items-center gap-2 px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-lg shadow-sm">
            🪐
          </div>
          <div>
            <div className="text-lg font-bold tracking-tight text-slate-900">Orbit</div>
            <div className="-mt-0.5 text-[11px] text-slate-400">mini social</div>
          </div>
        </div>

        <nav className="space-y-1">
          {items.map((it) => (
            <button
              key={it.key}
              type="button"
              onClick={() => handleNav(it.key)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                isActive(it.key)
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-100"
              )}
            >
              {it.icon}
              {it.label}
            </button>
          ))}
        </nav>

        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-500">
          <div className="mb-1 font-semibold text-slate-700">Community</div>
          <div>{state.users.length} members · {state.posts.length} posts</div>
        </div>
      </div>

      {currentUser && (
        <div className="flex items-center gap-3 rounded-xl p-2 hover:bg-slate-50">
          <button
            type="button"
            onClick={() => setView({ name: "profile", userId: currentUser.id })}
            className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br font-semibold text-white ${currentUser.avatarBg}`}
          >
            {currentUser.avatar}
          </button>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-slate-900">{currentUser.name}</div>
            <div className="truncate text-xs text-slate-500">@{currentUser.username}</div>
          </div>
          <button
            type="button"
            onClick={logOut}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Log out"
            title="Log out"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <path d="M16 17l5-5-5-5" />
              <path d="M21 12H9" />
            </svg>
          </button>
        </div>
      )}
    </aside>
  );
}
