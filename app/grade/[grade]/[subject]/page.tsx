import PdfList from "@/components/pdf-list";
import { findGradeBySlug, findSubjectBySlug } from "@/data/subjects";
import { notFound } from "next/navigation";

interface SubjectPageProps {
  params: Promise<{ grade: string; subject: string }>;
}

export default async function SubjectPage({
  params
}: SubjectPageProps) {
  const { grade, subject } = await params;

  // Find the grade and subject by slug
  const gradeData = findGradeBySlug(grade);
  const subjectData = findSubjectBySlug(grade, subject);

  if (!gradeData || !subjectData) {
    notFound();
  }

  console.log("Grade Data:", { gradeData, subjectData });

  return (
    <PdfList subject={subjectData.name} grade={gradeData.name} />
  );
}
