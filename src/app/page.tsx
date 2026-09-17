import Link from "next/link";
import { listAllSubjects } from "@/features/catalog/queries";

export default async function HomePage() {
  const subjects = await listAllSubjects();

  return (
    <div className="container-reading py-16">
      <p className="label-caps mb-4">Phase 04</p>
      <h1 className="text-[32px] font-semibold tracking-tight">Catalog seeded</h1>
      <ul className="divide-border divide-y">
        {subjects.map((s) => (
          <li key={s.id}>
            <Link
              href={`/subjects/${s.slug}`}
              className="group flex items-baseline justify-between py-5 transition-colors"
            >
              <div>
                <p className="text-foreground group-hover:text-muted-foreground text-[17px] font-medium transition-colors">
                  {s.name}
                </p>
                <p className="metadata-mono mt-1">
                  SEM {s.semesterNumber} · {s.code}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}