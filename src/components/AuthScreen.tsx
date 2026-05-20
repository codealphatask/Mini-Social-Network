import { useState } from "react";
import { useApp } from "../context/AppContext";

export function AuthScreen() {
  const { signUp, logIn, state } = useApp();
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const handle = username.trim().toLowerCase();
    if (!handle) {
      setError("Username is required.");
      return;
    }
    if (mode === "signup") {
      if (state.users.some((u) => u.username === handle)) {
        setError("That username is taken. Try logging in instead.");
        return;
      }
      signUp(handle, name, bio);
    } else {
      if (!state.users.some((u) => u.username === handle)) {
        setError("No account with that username. Try signing up.");
        return;
      }
      logIn(handle);
    }
  };

  const quickLogin = (u: string) => {
    logIn(u);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50">
      <div className="mx-auto grid min-h-screen max-w-6xl grid-cols-1 items-center gap-10 px-6 py-12 lg:grid-cols-2">
        <div>
          <div className="mb-6 inline-flex items-center gap-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-2xl shadow-lg">
              🪐
            </div>
            <div>
              <div className="text-2xl font-bold tracking-tight text-slate-900">Orbit</div>
              <div className="-mt-0.5 text-xs text-slate-500">mini social · big ideas</div>
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Share your universe.
          </h1>
          <p className="mt-3 max-w-lg text-lg text-slate-600">
            Post, comment, follow, and like. A tiny social platform to test your ideas with
            a small community.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-slate-600">
            <li className="flex items-center gap-2"><span className="text-indigo-500">✦</span> Create a profile with your own avatar</li>
            <li className="flex items-center gap-2"><span className="text-indigo-500">✦</span> Publish posts with text and photos</li>
            <li className="flex items-center gap-2"><span className="text-indigo-500">✦</span> Like, comment, and follow</li>
            <li className="flex items-center gap-2"><span className="text-indigo-500">✦</span> Explore everyone's posts</li>
          </ul>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-indigo-100/40 sm:p-8">
          <div className="mb-5 flex rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={
                "flex-1 rounded-lg py-2 text-sm font-semibold transition " +
                (mode === "signup" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500")
              }
            >
              Sign up
            </button>
            <button
              type="button"
              onClick={() => setMode("login")}
              className={
                "flex-1 rounded-lg py-2 text-sm font-semibold transition " +
                (mode === "login" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500")
              }
            >
              Log in
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Username</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="yourhandle"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-300 focus:bg-white"
              />
            </div>
            {mode === "signup" && (
              <>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">
                    Display name
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-300 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={2}
                    placeholder="A few words about you"
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-300 focus:bg-white"
                  />
                </div>
              </>
            )}
            {error && (
              <div className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>
            )}
            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:shadow-md"
            >
              {mode === "signup" ? "Create account" : "Log in"}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs text-slate-400">
            <div className="h-px flex-1 bg-slate-200" />
            or jump in as
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            {state.users.slice(0, 4).map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => quickLogin(u.username)}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-sm hover:border-indigo-300 hover:bg-indigo-50"
              >
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br text-sm text-white ${u.avatarBg}`}
                >
                  {u.avatar}
                </span>
                <span className="truncate font-medium text-slate-800">@{u.username}</span>
              </button>
            ))}
          </div>
          <p className="mt-4 text-center text-xs text-slate-400">
            Your data is stored locally in your browser.
          </p>
        </div>
      </div>
    </div>
  );
}
