"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Collections", href: "/collections" },
  { label: "Community", href: "/community" },
];

export function AppHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const prefersReducedMotion = useReducedMotion();

  return (
    <header className="border-border bg-background sticky top-0 z-50 border-b">
      <div className="mx-auto flex h-16 max-w-(--container-content) items-center justify-between px-6 md:px-8">
        <Link href="/" className="text-foreground flex items-center text-lg font-semibold tracking-tight">
          Noroa
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm transition-colors duration-[var(--duration-hover)] ${
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <div className="relative">
            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2" />
            <Input
              readOnly
              placeholder="Search"
              className="focus-visible:ring-ring/30 h-9 w-56 cursor-pointer pr-12 pl-9 text-sm"
            />
            {/* <kbd className="border-border text-muted-foreground pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 rounded border px-1.5 py-0.5 text-[10px]">
              Ctrl + K
            </kbd> */}
          </div>

          <ThemeToggle />

          <Button size="lg" className="h-9 px-5 text-sm" asChild>
            <Link href="/signin">Sign in</Link>
          </Button>
        </div>

        <button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav-panel"
          onClick={() => setMobileOpen((open) => !open)}
          className="text-foreground hover:bg-muted flex size-11 items-center justify-center rounded-[var(--radius-control)] transition-colors duration-[var(--duration-hover)] md:hidden"
        >
          {mobileOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {mobileOpen && (
          <motion.div
            id="mobile-nav-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0.01 : 0.24,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="border-border overflow-hidden border-b md:hidden"
          >
            <nav className="flex flex-col gap-1 px-6 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="hover:bg-muted hover:text-foreground text-muted-foreground rounded-[var(--radius-control)] px-3 py-3 text-sm transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-border mt-2 flex flex-col gap-2 border-t pt-4">
                <Button size="lg" className="h-11 justify-start px-4 text-[0.95rem]" asChild>
                  <Link href="/signin">Sign in</Link>
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}