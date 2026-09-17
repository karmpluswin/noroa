import { notFound } from "next/navigation";
import { getSubjectBySlug } from "@/features/catalog/queries";

const RESOURCE_KINDS = [
  { label: "OFFICIAL", title: "Syllabus" },
  { label: "NOTES", title: "Short revision notes" },
  { label: "BOOK", title: "Recommended textbook" },
  { label: "VIDEO", title: "Video playlist" },
  { label: "PYQ", title: "Previous papers" },
];

export default async function SubjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const subject = await getSubjectBySlug(slug);
  if (!subject) notFound();

  return (
    <div className="container-reading py-16">
      <header className="mb-12">
        <h1 className="text-foreground text-[32px] leading-[1.1] font-semibold tracking-tight md:text-[48px]">
          {subject.name}
        </h1>
        <p className="text-muted-foreground mt-4 max-w-2xl text-lg">
          Everything useful for this subject, in one place.
        </p>
      </header>

      <section className="mb-14">
        <h2 className="label-caps border-border mb-4 border-b pb-2">Start Here</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {RESOURCE_KINDS.map((kind) => (
            <div
              key={kind.title}
              className="border-border bg-muted/20 rounded border p-6 opacity-60"
            >
              <span className="metadata-mono">{kind.label}</span>
              <h3 className="text-foreground mt-3 text-[24px] font-medium">{kind.title}</h3>
              <p className="text-muted-foreground mt-1 text-sm">Not added yet — ingestion pipeline arrives in Phase 12+.</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="label-caps border-border mb-4 border-b pb-2">Topics Covered</h2>
        <ol className="space-y-3">
          {subject.topics.map((topic, index) => (
            <li key={topic.id} className="flex gap-4">
              <span className="metadata-mono w-6 shrink-0">{String(index + 1).padStart(2, "0")}</span>
              <span className="text-foreground text-[15px]">{topic.name}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}