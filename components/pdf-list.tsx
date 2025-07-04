"use client";

import { useRouter } from "next/navigation";
import PdfIcon from "./icons/pdf";
import { Button } from "./ui/button";
import { Download, Eye } from "lucide-react";

interface PdfFile {
  id: string;
  name: string;
  size: string;
  uploadDate: string;
}

interface PdfListProps {
  subject: string;
  grade: string;
}

const PdfList = ({ subject, grade }: PdfListProps) => {
  const router = useRouter();

  // Mock data - trong thực tế sẽ fetch từ API
  const pdfFiles: PdfFile[] = [
    {
      id: "1",
      name: `${subject} - Bài 1: Giới thiệu`,
      size: "2.5 MB",
      uploadDate: "2024-01-15"
    },
    {
      id: "2",
      name: `${subject} - Bài 2: Lý thuyết cơ bản`,
      size: "3.2 MB",
      uploadDate: "2024-01-20"
    },
    {
      id: "3",
      name: `${subject} - Bài 3: Bài tập thực hành`,
      size: "1.8 MB",
      uploadDate: "2024-01-25"
    },
    {
      id: "4",
      name: `${subject} - Đề thi giữa kỳ`,
      size: "1.1 MB",
      uploadDate: "2024-02-01"
    },
    {
      id: "5",
      name: `${subject} - Tài liệu tham khảo`,
      size: "4.7 MB",
      uploadDate: "2024-02-10"
    }
  ];

  const handleView = (file: PdfFile) => {
    router.push(`/pdf-viewer/${file.id}`)
  };

  const handleDownload = (file: PdfFile) => {
    console.log("Downloading:", file.name);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {subject} - Lớp {grade}
        </h1>
        <p className="text-muted-foreground">
          Danh sách tài liệu học tập cho môn {subject}
        </p>
      </div>

      <div className="grid gap-4">
        {pdfFiles.map((file) => (
          <div
            key={file.id}
            className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <PdfIcon className="text-red-500" />
              <div>
                <h3 className="font-medium text-foreground">{file.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {file.size} • {new Date(file.uploadDate).toLocaleDateString('vi-VN')}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleView(file)}
                className="flex items-center space-x-1 cursor-pointer"
              >
                <Eye className="h-4 w-4" />
                <span>Xem</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload(file)}
                className="flex items-center space-x-1"
              >
                <Download className="h-4 w-4" />
                <span>Tải về</span>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PdfList;
