import Link from "next/link";
import { Search } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/collections", label: "Collections" },
  { href: "/community", label: "Community" },
];

export function AppHeader() {
  return (
    <header className="border-border bg-background sticky top-0 z-50 border-b">
      <div className="container-noroa flex h-14 items-center gap-8">
        <Link href="/" className="text-foreground text-[15px] font-semibold tracking-tight">
          noroa
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            aria-label="Search"
            className="border-border text-muted-foreground hover:text-foreground hidden h-8 items-center gap-2 rounded border px-3 text-sm transition-colors md:flex"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Search...</span>
            <kbd className="font-mono text-[11px] tracking-wider">⌘K</kbd>
          </button>

          <button
            type="button"
            aria-label="Search"
            className="text-muted-foreground hover:text-foreground flex h-8 w-8 items-center justify-center rounded md:hidden"
          >
            <Search className="h-4 w-4" />
          </button>

          <ThemeToggle />

          <Link
            href="/signin"
            className="bg-accent text-accent-foreground flex h-8 items-center rounded px-3 text-sm font-medium"
          >
            Sign in
          </Link>
        </div>
      </div>
    </header>
  );
}