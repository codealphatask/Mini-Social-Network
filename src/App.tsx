import { AppProvider, useApp } from "./context/AppContext";
import { AuthScreen } from "./components/AuthScreen";
import { Sidebar } from "./components/Sidebar";
import { RightPanel } from "./components/RightPanel";
import { Feed } from "./components/Feed";
import { Profile } from "./components/Profile";
import { PostDetail } from "./components/PostDetail";

function Shell() {
  const { currentUser, view } = useApp();

  if (!currentUser) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-[1280px]">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <main className="min-w-0 flex-1">
          {view.name === "profile" ? (
            <Profile userId={view.userId} />
          ) : view.name === "post" ? (
            <PostDetail />
          ) : (
            <Feed />
          )}
        </main>
        <RightPanel />
      </div>

      {/* Mobile bottom nav */}
      <MobileNav />
    </div>
  );
}

function MobileNav() {
  const { view, setView, currentUser } = useApp();
  if (!currentUser) return null;
  const items = [
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
  return (
    <nav className="sticky bottom-0 z-30 flex items-center justify-around border-t border-slate-200 bg-white/95 py-2 backdrop-blur md:hidden">
      {items.map((it) => {
        const active =
          (it.key === "home" && view.name === "home") ||
          (it.key === "explore" && view.name === "explore") ||
          (it.key === "profile" && view.name === "profile" && view.userId === currentUser?.id);
        return (
          <button
            key={it.key}
            type="button"
            onClick={() => {
              if (it.key === "profile") {
                if (currentUser) setView({ name: "profile", userId: currentUser.id });
              } else {
                setView({ name: it.key as "home" | "explore" });
              }
            }}
            className={
              "flex flex-col items-center gap-0.5 rounded-xl px-4 py-1.5 text-xs font-medium transition " +
              (active ? "text-indigo-600" : "text-slate-500")
            }
          >
            {it.icon}
            <span>{it.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
