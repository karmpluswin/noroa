import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type SubjectRowProps = {
  href: string;
  name: string;
  code: string;
};

export function SubjectRow({ href, name, code }: SubjectRowProps) {
  return (
    <Link href={href} className="group border-border block border-b py-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="metadata-mono mb-1 block">{code}</span>
          <h2 className="text-foreground text-[18px]">{name}</h2>
        </div>
        <ArrowUpRight className="text-muted-foreground size-4 shrink-0 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-foreground" />
      </div>
    </Link>
  );
}