"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import PdfIcon from "./icons/pdf";
import { findGradeBySlug } from "@/data/subjects";

const Aside = () => {
  const pathname = usePathname();

  // Get current grade and subject from URL
  const pathSegments = pathname.split('/');
  const currentGradeSlug = pathSegments[2] || "mau-giao";
  const currentSubjectSlug = pathSegments[3] || "";

  // Find the grade and its subjects
  const currentGrade = findGradeBySlug(currentGradeSlug);
  const subjects = currentGrade?.subjects || [];

  return (
    <aside className="w-[250px] h-[calc(100vh-64px)] border-r border-border bg-background overflow-y-auto fixed left-0 top-16 z-30">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2 text-foreground">
          Lớp {currentGrade?.name || currentGradeSlug}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">Môn học</p>
        <ul className="space-y-1">
          {subjects.map((subject) => (
            <li key={subject.slug}>
              <Link href={`/grade/${currentGradeSlug}/${subject.slug}`}>
                <button
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors duration-200 flex items-center ${currentSubjectSlug === subject.slug
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                >
                  <PdfIcon className="mr-3 flex-shrink-0" />
                  <span>{subject.name}</span>
                </button>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Aside;
