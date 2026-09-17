import Link from "next/link";

export function AppFooter() {
  return (
    <footer className="border-border mt-auto border-t">
      <div className="container-reading flex flex-col items-center justify-between gap-4 py-8 md:flex-row">
        <span className="label-caps">© Noroa</span>
        <nav className="flex flex-wrap justify-center gap-6">
          {["Privacy", "Terms", "Contact", "Twitter"].map((label) => (
            <Link
              key={label}
              href="#"
              className="label-caps hover:text-foreground underline decoration-1 underline-offset-4 transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}