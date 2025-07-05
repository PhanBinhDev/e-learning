import { notFound } from 'next/navigation';
import BackToList from '@/components/back-to-list';
import { getPdfById } from '@/data/pdfs';

interface PdfViewerPageProps {
  params: Promise<{ fileId: string }>;
}

export default async function PdfViewerPage({ params }: PdfViewerPageProps) {
  const { fileId } = await params;

  // Get PDF data by ID
  const pdfFile = getPdfById(fileId);

  if (!pdfFile) {
    notFound();
  }

  console.log("PDF File Data:", pdfFile);

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
        {pdfFile.iframeUrl ? (
          <iframe
            src={pdfFile.iframeUrl}
            width="100%"
            height="100%"
            scrolling="no"
            frameBorder="0"
            allow="clipboard-write; autoplay; fullscreen"
            className="publuuflip"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-muted-foreground">PDF viewer không khả dụng</p>
              <p className="text-sm text-muted-foreground mt-2">Vui lòng thử lại sau</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
