import { findGradeBySlug } from "@/data/subjects";
import { notFound } from "next/navigation";

interface GradeProps {
  params: Promise<{ grade: string }>;
}

export default async function GradePage({ params }: GradeProps) {
  const { grade } = await params;

  // Find the grade by slug
  const gradeData = findGradeBySlug(grade);

  if (!gradeData) {
    notFound();
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Lớp {gradeData.name}
        </h1>
        <p className="text-muted-foreground">
          Chọn môn học từ sidebar để xem tài liệu
        </p>
      </div>

      <div className="bg-muted/50 rounded-lg p-8 text-center">
        <h2 className="text-lg font-medium text-muted-foreground mb-2">
          Chưa chọn môn học
        </h2>
        <p className="text-sm text-muted-foreground">
          Vui lòng chọn một môn học từ danh sách bên trái để xem tài liệu
        </p>
      </div>
    </div>
  );
}
