import { notFound } from 'next/navigation';
import BackToList from '@/components/back-to-list';

interface PdfViewerPageProps {
  params: Promise<{ id: string }>;
}

export default async function PdfViewerPage({ params }: PdfViewerPageProps) {
  const { id } = await params;

  const pdfFiles = [
    {
      id: "1",
      name: "Interactive PDF Demo",
      subject: "Demo",
      grade: "10",
      url: "/pdf/books.pdf" // File HTML demo
    },
    {
      id: "2",
      name: "Lý thuyết cơ bản",
      subject: "Toán",
      grade: "10",
      url: "/pdf/books.pdf"
    },
    {
      id: "3",
      name: "Bài tập thực hành",
      subject: "Toán",
      grade: "10",
      url: "/pdf/books.pdf"
    },
    {
      id: "4",
      name: "Đề thi giữa kỳ",
      subject: "Toán",
      grade: "10",
      url: "/pdf/books.pdf"
    },
    {
      id: "5",
      name: "Tài liệu tham khảo",
      subject: "Toán",
      grade: "10",
      url: "/pdf/books.pdf"
    }
  ];

  const pdfFile = pdfFiles.find(file => file.id === id);

  if (!pdfFile) {
    notFound();
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-background border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <BackToList />
          <div className="h-6 w-px bg-border" />
          <div>
            <h1 className="font-semibold text-foreground">
              {pdfFile.subject} - {pdfFile.name}
            </h1>
            <p className="text-sm text-muted-foreground">
              Lớp {pdfFile.grade}
            </p>
          </div>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1">
        {/* <iframe src="https://publuu.com/flip-book/919289/2014530/page/1?embed" width="100%" height="100%" scrolling="no" frameBorder="0" allow="clipboard-write; autoplay; fullscreen" className="publuuflip"></iframe> */}
        <iframe src="https://publuu.com/flip-book/919289/2015138/page/1?embed" width="100%" height="100%" scrolling="no" frameBorder="0" allow="clipboard-write; autoplay; fullscreen" className="publuuflip"></iframe>
      </div>
    </div>
  );
}
