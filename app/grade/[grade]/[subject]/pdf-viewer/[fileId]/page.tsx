'use client'

import { notFound } from 'next/navigation';
import { use, useEffect } from 'react';
import BackToList from '@/components/back-to-list';
import { getPdfById } from '@/data/pdfs';
import { Button } from '@/components/ui/button';
import { BotMessageSquare } from 'lucide-react';
import IframeTracker from '@/components/iframe-tracker';
import { useAiChat } from '@/components/ai-chat-context';

interface PdfViewerPageProps {
  params: Promise<{ fileId: string }>;
}

export default function PdfViewerPage({ params }: PdfViewerPageProps) {
  const { fileId } = use(params);
  const { isAiChatOpen, setIsAiChatOpen, setCurrentFile } = useAiChat();

  const pdfFile = getPdfById(fileId);

  if (!pdfFile) {
    notFound();
  }

  // Set current file in context when component mounts
  useEffect(() => {
    setCurrentFile({
      name: pdfFile.name,
      subject: pdfFile.subject,
      grade: pdfFile.grade,
      iframeUrl: pdfFile.iframeUrl,
      id: pdfFile.id,
      file: pdfFile.file
    });

    // Cleanup khi component unmount
    return () => {
      setCurrentFile(null);
    };
  }, [pdfFile, setCurrentFile]);

  return (
    <div className="h-screen flex flex-col relative">
      {/* Header */}
      <div className="bg-background border-b border-border p-2 sm:p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
          <BackToList />
          <div className="h-6 w-px bg-border hidden sm:block" />
          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-foreground text-sm sm:text-base truncate">
              <span className="hidden sm:inline">{pdfFile.subject} - </span>
              {pdfFile.name}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Lớp {pdfFile.grade}
            </p>
          </div>

          {/* AI Chat Toggle Button */}
          <Button variant="default" onClick={() => setIsAiChatOpen(!isAiChatOpen)} className="ml-2 sm:ml-4 rounded-lg hidden md:flex">
            <BotMessageSquare className='md:mr-2' />
            <span className='hidden md:block'>Trợ lý AI</span>
          </Button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className='flex-1 flex overflow-hidden relative'>
        <div className="flex-1 relative">
          {pdfFile.iframeUrl ? (
            <IframeTracker
              src={pdfFile.iframeUrl}
              onPageChange={(pageInfo) => {
                console.log('Page changed:', pageInfo);
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full p-4">
              <div className="text-center">
                <p className="text-muted-foreground text-sm sm:text-base">PDF viewer không khả dụng</p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-2">Vui lòng thử lại sau</p>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
