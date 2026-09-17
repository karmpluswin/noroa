import Link from "next/link";
import { SubjectRow } from "@/components/subject-row";
import { getActiveUniversityTree, getSubjectsBySemesterId } from "@/features/catalog/queries";

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ sem?: string }>;
}) {
  const { sem } = await searchParams;
  const tree = await getActiveUniversityTree();
  const branch = tree?.programs[0]?.branches[0];
  const semesters = branch?.schemes[0]?.semesters ?? [];

  const activeSemNumber = sem ? Number(sem) : 5;
  const activeSemester = semesters.find((s) => s.number === activeSemNumber);
  const subjects = activeSemester ? await getSubjectsBySemesterId(activeSemester.id) : [];

  return (
    <div className="container-reading py-16">
      <header className="mb-8">
        <h1 className="text-foreground text-[48px] leading-[1.1] font-semibold tracking-tight">Browse</h1>
        <p className="text-muted-foreground mt-2 text-lg">{branch?.name}</p>
      </header>

      <div className="border-border mb-8 overflow-x-auto border-b">
        <div className="flex min-w-max gap-8 pb-2">
          {semesters.map((s) => (
            <Link
              key={s.id}
              href={`/browse?sem=${s.number}`}
              className={`metadata-mono -mb-[10px] pb-2 ${
                s.number === activeSemNumber
                  ? "text-foreground border-foreground border-b-2"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sem {s.number}
            </Link>
          ))}
        </div>
      </div>

      <div>
        {subjects.length === 0 && (
          <p className="text-muted-foreground py-8 text-sm">No subjects seeded for this semester yet.</p>
        )}
        {subjects.map((s) => (
          <SubjectRow key={s.id} href={`/subjects/${s.slug}`} name={s.name} code={s.code} />
        ))}
      </div>
    </div>
  );
}