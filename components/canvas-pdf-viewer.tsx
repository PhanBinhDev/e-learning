/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { ZoomIn, ZoomOut, Download, Maximize2, Minimize2, Volume2, VolumeX, ChevronLeft, ChevronRight, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SimplePDFViewerProps {
  fileUrl: string;
  fileName: string;
}

const SimplePDFViewer = ({ fileUrl, fileName }: SimplePDFViewerProps) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [scale, setScale] = useState(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pdfDocument, setPdfDocument] = useState<any>(null);

  const renderPage = useCallback(
    async (pdf: any, pageNum: number) => {
      if (!canvasRef.current || !pdf) return;

      try {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale, rotation });

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        if (context) {
          const renderContext = {
            canvasContext: context,
            viewport: viewport
          };

          await page.render(renderContext).promise;
        }
      } catch (err) {
        console.error('Error rendering page:', err);
      }
    },
    [scale, rotation]
  );

  const loadPDF = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Try using PDF.js with worker
      const pdfjsLib = await import('pdfjs-dist');

      // Set worker source using CDN
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

      const pdf = await pdfjsLib.getDocument(fileUrl).promise;
      setPdfDocument(pdf);
      setNumPages(pdf.numPages);
      setIsLoading(false);

      // Render first page
      renderPage(pdf, 1);
    } catch (err) {
      console.error('Error loading PDF:', err);
      setError('Failed to load PDF. Using fallback viewer.');
      setIsLoading(false);
    }
  }, [fileUrl, renderPage]);

  useEffect(() => {
    loadPDF();
  }, [loadPDF]);

  useEffect(() => {
    if (pdfDocument) {
      renderPage(pdfDocument, pageNumber);
    }
  }, [pdfDocument, pageNumber, renderPage]);

  const changePage = (offset: number) => {
    setPageNumber(prevPageNumber => {
      const newPageNumber = prevPageNumber + offset;
      return Math.max(1, Math.min(numPages || 1, newPageNumber));
    });
  };

  const previousPage = () => changePage(-1);
  const nextPage = () => changePage(1);

  const zoomIn = () => setScale(prev => Math.min(3.0, prev + 0.25));
  const zoomOut = () => setScale(prev => Math.max(0.5, prev - 0.25));
  const rotate = () => setRotation(prev => (prev + 90) % 360);

  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);
  const toggleMute = () => setIsMuted(!isMuted);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.click();
  };

  // Fallback to iframe if PDF.js fails
  const renderFallback = () => (
    <div className="w-full h-full">
      <iframe
        src={fileUrl}
        width="100%"
        height="100%"
        className="border-0"
        title="PDF Viewer"
        style={{ transform: `scale(${scale}) rotate(${rotation}deg)` }}
      />
    </div>
  );

  if (error) {
    return (
      <div className={`h-full flex flex-col bg-gray-100 dark:bg-gray-900 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
        {/* Toolbar */}
        <div className="bg-background border-b border-border p-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-foreground">
              {fileName}
            </span>
            <span className="text-xs text-muted-foreground bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded">
              Fallback Mode
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={zoomOut} title="Zoom out">
              <ZoomOut className="h-4 w-4" />
            </Button>

            <span className="text-sm text-muted-foreground min-w-16 text-center">
              {Math.round(scale * 100)}%
            </span>

            <Button variant="outline" size="sm" onClick={zoomIn} title="Zoom in">
              <ZoomIn className="h-4 w-4" />
            </Button>

            <Button variant="outline" size="sm" onClick={rotate} title="Rotate">
              <RotateCw className="h-4 w-4" />
            </Button>

            <Button variant="outline" size="sm" onClick={toggleMute} title={isMuted ? 'Unmute' : 'Mute'}>
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>

            <Button variant="outline" size="sm" onClick={toggleFullscreen} title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>

            <Button variant="outline" size="sm" onClick={handleDownload} title="Download">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto flex items-center justify-center p-4">
          {renderFallback()}
        </div>
      </div>
    );
  }

  return (
    <div className={`h-full flex flex-col bg-gray-100 dark:bg-gray-900 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Toolbar */}
      <div className="bg-background border-b border-border p-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-foreground">
            {fileName}
          </span>
          <span className="text-xs text-muted-foreground bg-green-100 dark:bg-green-900 px-2 py-1 rounded">
            PDF.js Canvas
          </span>
          {numPages && (
            <span className="text-xs text-muted-foreground">
              Page {pageNumber} of {numPages}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={previousPage} disabled={pageNumber <= 1}>
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button variant="outline" size="sm" onClick={nextPage} disabled={pageNumber >= (numPages || 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>

          <Button variant="outline" size="sm" onClick={zoomOut} title="Zoom out">
            <ZoomOut className="h-4 w-4" />
          </Button>

          <span className="text-sm text-muted-foreground min-w-16 text-center">
            {Math.round(scale * 100)}%
          </span>

          <Button variant="outline" size="sm" onClick={zoomIn} title="Zoom in">
            <ZoomIn className="h-4 w-4" />
          </Button>

          <Button variant="outline" size="sm" onClick={rotate} title="Rotate">
            <RotateCw className="h-4 w-4" />
          </Button>

          <Button variant="outline" size="sm" onClick={toggleMute} title={isMuted ? 'Unmute' : 'Mute'}>
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>

          <Button variant="outline" size="sm" onClick={toggleFullscreen} title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>

          <Button variant="outline" size="sm" onClick={handleDownload} title="Download">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Interactive Elements Info */}
      <div className="bg-background border-b border-border p-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-4">
            <span>🎨 Canvas-based rendering</span>
            <span>🔧 PDF.js with worker</span>
            <span>⚡ Fast loading</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>PDF.js Canvas Renderer</span>
          </div>
        </div>
      </div>

      {/* PDF Content */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-4">
        {isLoading && (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span>Loading PDF...</span>
          </div>
        )}

        {!isLoading && (
          <div className="relative">
            <canvas
              ref={canvasRef}
              className="border border-gray-300 shadow-lg max-w-full h-auto"
              style={{
                transform: `scale(${scale})`,
                transformOrigin: 'top left'
              }}
            />
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="bg-background border-t border-border p-2">
        <div className="flex items-center justify-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => setPageNumber(1)} disabled={pageNumber <= 1}>
            First
          </Button>
          <Button variant="outline" size="sm" onClick={previousPage} disabled={pageNumber <= 1}>
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {pageNumber} of {numPages || 0}
          </span>
          <Button variant="outline" size="sm" onClick={nextPage} disabled={pageNumber >= (numPages || 1)}>
            Next
          </Button>
          <Button variant="outline" size="sm" onClick={() => setPageNumber(numPages || 1)} disabled={pageNumber >= (numPages || 1)}>
            Last
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SimplePDFViewer;
