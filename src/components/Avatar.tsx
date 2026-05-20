import type { User } from "../types";
import { cn } from "../utils/cn";

type Props = {
  user: User | undefined;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  onClick?: () => void;
  ring?: boolean;
};

const sizes: Record<NonNullable<Props["size"]>, string> = {
  xs: "h-6 w-6 text-xs",
  sm: "h-9 w-9 text-base",
  md: "h-11 w-11 text-xl",
  lg: "h-16 w-16 text-2xl",
  xl: "h-24 w-24 text-4xl",
};

export function Avatar({ user, size = "md", onClick, ring }: Props) {
  if (!user) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-full bg-slate-200 text-slate-400",
          sizes[size]
        )}
      >
        ?
      </div>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={cn(
        "relative flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-semibold text-white shadow-sm",
        user.avatarBg,
        sizes[size],
        onClick && "cursor-pointer hover:scale-[1.03] active:scale-[0.98] transition-transform",
        !onClick && "cursor-default",
        ring && "ring-4 ring-white"
      )}
      aria-label={user.name}
    >
      <span className="drop-shadow-sm">{user.avatar}</span>
    </button>
  );
}
