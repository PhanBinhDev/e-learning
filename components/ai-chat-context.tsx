'use client'

import { createContext, useContext, useState, ReactNode } from 'react';

interface AiChatContextType {
  isAiChatOpen: boolean;
  setIsAiChatOpen: (open: boolean) => void;
  toggleAiChat: () => void;
  currentFile: {
    name: string;
    subject: string;
    grade: string;
    iframeUrl?: string;
    id?: string;
    file?: string;
  } | null;
  setCurrentFile: (file: { name: string; subject: string; grade: string; iframeUrl?: string; id?: string; file?: string; } | null) => void;
  currentPageInfo: {
    pageNumber?: number;
    totalPages?: number;
    content?: string;
  } | null;
  setCurrentPageInfo: (info: { pageNumber?: number; totalPages?: number; content?: string; } | null) => void;
  pdfAnalysis: {
    content: string;
    topics: string[];
    keywords: string[];
    summary: string;
  } | null;
  setPdfAnalysis: (analysis: { content: string; topics: string[]; keywords: string[]; summary: string; } | null) => void;
}

const AiChatContext = createContext<AiChatContextType | undefined>(undefined);

interface AiChatProviderProps {
  children: ReactNode;
}

export function AiChatProvider({ children }: AiChatProviderProps) {
  const [isAiChatOpen, setIsAiChatOpen] = useState(true); // Mặc định mở
  const [currentFile, setCurrentFile] = useState<{
    name: string;
    subject: string;
    grade: string;
    iframeUrl?: string;
    id?: string;
    file?: string;
  } | null>(null);
  const [currentPageInfo, setCurrentPageInfo] = useState<{
    pageNumber?: number;
    totalPages?: number;
    content?: string;
  } | null>(null);
  const [pdfAnalysis, setPdfAnalysis] = useState<{
    content: string;
    topics: string[];
    keywords: string[];
    summary: string;
  } | null>(null);

  const toggleAiChat = () => {
    setIsAiChatOpen(!isAiChatOpen);
  };

  return (
    <AiChatContext.Provider
      value={{
        isAiChatOpen,
        setIsAiChatOpen,
        toggleAiChat,
        currentFile,
        setCurrentFile,
        currentPageInfo,
        setCurrentPageInfo,
        pdfAnalysis,
        setPdfAnalysis,
      }}
    >
      {children}
    </AiChatContext.Provider>
  );
}

export function useAiChat() {
  const context = useContext(AiChatContext);
  if (context === undefined) {
    throw new Error('useAiChat must be used within an AiChatProvider');
  }
  return context;
}
