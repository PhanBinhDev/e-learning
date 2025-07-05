'use client'

import { useEffect, useRef } from 'react';
import { useAiChat } from './ai-chat-context';

interface IframeTrackerProps {
  src: string;
  onPageChange?: (pageInfo: { pageNumber?: number; totalPages?: number; content?: string }) => void;
}

export default function IframeTracker({ src, onPageChange }: IframeTrackerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { setCurrentPageInfo } = useAiChat();
  const onPageChangeRef = useRef(onPageChange);

  // Update ref when onPageChange changes
  useEffect(() => {
    onPageChangeRef.current = onPageChange;
  }, [onPageChange]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    let currentPageInfo: { pageNumber?: number; totalPages?: number; content?: string } | null = null;

    // Method 1: PostMessage - Listen for messages from iframe
    const handleMessage = (event: MessageEvent) => {
      // Check if message is from our iframe
      if (event.source !== iframe.contentWindow) return;

      // Common postMessage patterns from PDF viewers
      const { data } = event;

      if (data && typeof data === 'object') {
        let pageInfo = null;

        // Pattern 1: Direct page info
        if (data.type === 'pageChange' || data.type === 'page-change') {
          pageInfo = {
            pageNumber: data.pageNumber || data.page || data.currentPage,
            totalPages: data.totalPages || data.total,
            content: `Đang xem trang ${data.pageNumber || data.page || data.currentPage}`
          };
        }

        // Pattern 2: Publuu-style messages
        if (data.event === 'page' || data.action === 'page') {
          pageInfo = {
            pageNumber: data.page || data.pageNumber,
            totalPages: data.totalPages,
            content: `Đang xem trang ${data.page || data.pageNumber}`
          };
        }

        // Pattern 3: Generic data with page info
        if (data.page || data.pageNumber || data.currentPage) {
          pageInfo = {
            pageNumber: data.page || data.pageNumber || data.currentPage,
            totalPages: data.totalPages || data.total,
            content: `Đang xem trang ${data.page || data.pageNumber || data.currentPage}`
          };
        }

        if (pageInfo && pageInfo.pageNumber) {
          currentPageInfo = pageInfo;
          setCurrentPageInfo(pageInfo);
          onPageChangeRef.current?.(pageInfo);
          console.log('Page info from postMessage:', pageInfo);
        }
      }
    };

    // Method 2: URL-based tracking with polling
    const trackUrlChanges = () => {
      try {
        const iframeSrc = iframe.src;
        const extractInfoFromUrl = (url: string) => {
          const urlParams = new URLSearchParams(url.split('?')[1] || '');
          const pageParam = urlParams.get('page') || urlParams.get('p') ||
            urlParams.get('pageNumber') || urlParams.get('currentPage');

          if (pageParam) {
            const pageNumber = parseInt(pageParam);
            if (!isNaN(pageNumber)) {
              return {
                pageNumber,
                content: `Đang xem trang ${pageNumber}`,
                totalPages: undefined
              };
            }
          }

          // Try to extract from URL hash
          const hash = url.split('#')[1];
          if (hash) {
            const hashPageMatch = hash.match(/page[=:]?(\d+)/i);
            if (hashPageMatch) {
              const pageNumber = parseInt(hashPageMatch[1]);
              return {
                pageNumber,
                content: `Đang xem trang ${pageNumber}`,
                totalPages: undefined
              };
            }
          }

          return null;
        };

        const pageInfo = extractInfoFromUrl(iframeSrc);
        if (pageInfo && (!currentPageInfo || currentPageInfo.pageNumber !== pageInfo.pageNumber)) {
          currentPageInfo = pageInfo;
          setCurrentPageInfo(pageInfo);
          onPageChangeRef.current?.(pageInfo);
          console.log('Page info from URL:', pageInfo);
        }
      } catch (error) {
        console.log('Error tracking URL changes:', error);
      }
    };

    // Method 3: Try to inject tracking script (if same origin)
    const tryInjectTracking = () => {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (iframeDoc) {
          // If we can access the document, inject a tracking script
          const script = iframeDoc.createElement('script');
          script.textContent = `
            (function() {
              let lastPage = null;
              
              function findCurrentPage() {
                // Look for visible page indicators
                const pageSelectors = [
                  '[class*="page"]:not([style*="display: none"])',
                  '[class*="Page"]:not([style*="display: none"])',
                  '.stf_item:not([style*="display: none"])',
                  '[data-page]:not([style*="display: none"])'
                ];
                
                for (const selector of pageSelectors) {
                  const elements = document.querySelectorAll(selector);
                  for (const el of elements) {
                    const pageNum = extractPageNumber(el);
                    if (pageNum && isVisible(el)) {
                      return pageNum;
                    }
                  }
                }
                return null;
              }
              
              function extractPageNumber(element) {
                const className = element.className || '';
                const id = element.id || '';
                const dataPage = element.getAttribute('data-page');
                
                if (dataPage) {
                  const num = parseInt(dataPage);
                  if (!isNaN(num)) return num;
                }
                
                const classMatch = className.match(/page[_-]?(\\d+)/i);
                if (classMatch) return parseInt(classMatch[1]);
                
                const idMatch = id.match(/page[_-]?(\\d+)/i);
                if (idMatch) return parseInt(idMatch[1]);
                
                return null;
              }
              
              function isVisible(element) {
                const style = window.getComputedStyle(element);
                return style.display !== 'none' && 
                       style.visibility !== 'hidden' && 
                       style.opacity !== '0';
              }
              
              function checkPage() {
                const currentPage = findCurrentPage();
                if (currentPage && currentPage !== lastPage) {
                  lastPage = currentPage;
                  window.parent.postMessage({
                    type: 'pageChange',
                    pageNumber: currentPage,
                    source: 'injected-tracker'
                  }, '*');
                }
              }
              
              // Check immediately and set up polling
              checkPage();
              setInterval(checkPage, 1000);
              
              // Also observe DOM changes
              const observer = new MutationObserver(checkPage);
              observer.observe(document.body, {
                attributes: true,
                subtree: true,
                attributeFilter: ['style', 'class']
              });
            })();
          `;
          iframeDoc.head.appendChild(script);
          console.log('Injected tracking script successfully');
        }
      } catch (error) {
        console.log('Cannot inject tracking script due to CORS:', error);
      }
    };

    // Event listeners
    window.addEventListener('message', handleMessage);

    // Initial setup after iframe loads
    const handleLoad = () => {
      setTimeout(() => {
        // Try methods in order
        tryInjectTracking();
        trackUrlChanges();
      }, 1000);
    };

    iframe.addEventListener('load', handleLoad);

    // Polling for URL changes (for viewers that update URL)
    const urlPollingInterval = setInterval(trackUrlChanges, 2000);

    // Cleanup
    return () => {
      window.removeEventListener('message', handleMessage);
      iframe.removeEventListener('load', handleLoad);
      clearInterval(urlPollingInterval);
    };

  }, [src, setCurrentPageInfo]);

  return (
    <iframe
      ref={iframeRef}
      src={src}
      width="100%"
      height="100%"
      scrolling="no"
      frameBorder="0"
      allow="clipboard-write; autoplay; fullscreen"
      className="publuuflip absolute inset-0 w-full h-full"
    />
  );
}
