import Link from 'next/link';
import { FileText, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PdfViewerPage() {
  // Sample PDF files for demonstration
  const pdfFiles = [
    {
      id: "1",
      name: "Interactive PDF Demo",
      subject: "Demo",
      grade: "General",
      url: "/pdf/books.pdf",
      description: "HTML file demonstrating interactive elements"
    },
    {
      id: "2",
      name: "Sample PDF",
      subject: "Demo",
      grade: "General",
      url: "/pdf/books.pdf",
      description: "Basic PDF with interactive annotations"
    },
    {
      id: "3",
      name: "Toán học cơ bản",
      subject: "Toán",
      grade: "10",
      url: "/pdf/books.pdf",
      description: "PDF bài giảng Toán học lớp 10"
    },
    {
      id: "4",
      name: "Vật lý nâng cao",
      subject: "Vật lý",
      grade: "11",
      url: "/pdf/books.pdf",
      description: "PDF bài giảng Vật lý lớp 11"
    },
    {
      id: "5",
      name: "Hóa học thực hành",
      subject: "Hóa học",
      grade: "12",
      url: "/pdf/books.pdf",
      description: "PDF hướng dẫn thực hành Hóa học"
    }
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            PDF Interactive Viewer
          </h1>
          <p className="text-muted-foreground">
            Chọn một file PDF để xem với các tính năng tương tác như audio, video, links, và forms.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pdfFiles.map((pdf) => (
            <div key={pdf.id} className="bg-background border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <FileText className="h-8 w-8 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {pdf.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {pdf.subject} - Lớp {pdf.grade}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    {pdf.description}
                  </p>
                  <div className="flex space-x-2">
                    <Link href={`/pdf-viewer/${pdf.id}`}>
                      <Button size="sm" className="flex items-center space-x-2">
                        <span>Xem PDF</span>
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </Link>
                    <a href={pdf.url} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm">
                        Mở trực tiếp
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Tính năng Interactive PDF
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span className="text-sm">Hyperlinks có thể click</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span className="text-sm">Audio và video embedded</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span className="text-sm">Form fields tương tác</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span className="text-sm">JavaScript actions</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span className="text-sm">File attachments</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span className="text-sm">Annotations và comments</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
