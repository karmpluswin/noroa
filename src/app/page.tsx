import Link from "next/link";
import { Search, ArrowUpRight } from "lucide-react";
import { getActiveUniversityTree, listAllSubjects } from "@/features/catalog/queries";

export default async function HomePage() {
  const [tree, subjects] = await Promise.all([getActiveUniversityTree(), listAllSubjects()]);
  const branches = tree?.programs.flatMap((p) => p.branches) ?? [];

  return (
    <div className="container-reading py-16">
      <section className="mb-14">
        <h1 className="text-foreground text-[48px] leading-[1.1] font-semibold tracking-tight">
          Find what you need to study.
        </h1>
        <p className="text-muted-foreground mt-4 max-w-[600px] text-lg">
          Previous papers, books, videos and notes — organized around your subject.
        </p>

        {/* Inert until Phase 06 wires real search */}
        <div className="group relative mt-6">
          <Search className="text-muted-foreground group-focus-within:text-foreground absolute top-1/2 left-4 size-4 -translate-y-1/2 transition-colors" />
          <input
            readOnly
            placeholder="Search subjects, resources..."
            className="border-border bg-muted/40 placeholder:text-muted-foreground focus:border-foreground w-full rounded border py-4 pr-16 pl-12 text-lg transition-colors focus:outline-none"
          />
          {/* <kbd className="border-border text-muted-foreground bg-muted absolute top-1/2 right-4 -translate-y-1/2 rounded border px-2 py-1 font-mono text-xs">
            ⌘K
          </kbd> */}
        </div>
      </section>

      <section className="mb-14">
        <h2 className="label-caps mb-2">Browse by Branch</h2>
        <div className="border-border border-t">
          {branches.map((branch) => (
            <SubjectRowLike key={branch.id} href={`/browse`} code={branch.code} name={branch.name} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="label-caps mb-3">Popular Subjects</h2>
        <div className="flex flex-wrap gap-2">
          {subjects.map((s) => (
            <Link
              key={s.id}
              href={`/subjects/${s.slug}`}
              className="border-border bg-muted hover:bg-muted/60 metadata-mono text-foreground rounded border px-3 py-1.5 transition-colors"
            >
              {s.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function SubjectRowLike({ href, code, name }: { href: string; code: string; name: string }) {
  return (
    <Link href={href} className="group border-border flex items-center justify-between border-b py-4">
      <div>
        <span className="metadata-mono mb-1 block">{code}</span>
        <h3 className="text-foreground text-[24px] font-medium">{name}</h3>
      </div>
      <ArrowUpRight className="text-muted-foreground size-5 shrink-0 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-foreground" />
    </Link>
  );
}