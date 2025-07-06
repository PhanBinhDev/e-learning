'use client'

import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Send, Bot, User, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { useAiChat } from './ai-chat-context';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface AiChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentFile?: {
    name: string;
    subject: string;
    grade: string;
    id?: string;
    file?: string;
  };
  className?: string;
}

export default function AiChatSidebar({ isOpen, onClose, currentFile, className }: AiChatSidebarProps) {
  const { currentPageInfo, pdfAnalysis, setPdfAnalysis } = useAiChat();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Ref để track file đã analyze
  const analyzedFileRef = useRef<string | null>(null);
  const isAnalyzingRef = useRef(false);

  // Memoize currentFile để tránh re-render không cần thiết
  const currentFileId = currentFile ? `${currentFile.name}-${currentFile.file}` : null;

  // Phân tích PDF khi currentFile thay đổi
  const analyzePdf = useCallback(async () => {
    if (!currentFile || !currentFileId) return;

    // Kiểm tra nếu file này đã được analyze hoặc đang analyze
    if (analyzedFileRef.current === currentFileId || isAnalyzingRef.current) {
      console.log('File already analyzed or analyzing:', currentFileId);
      return;
    }

    // Kiểm tra nếu đã có analysis trong context
    if (pdfAnalysis) {
      console.log('PDF analysis already exists in context');
      return;
    }

    console.log('Starting PDF analysis for:', currentFile.name);
    console.log('PDF path:', currentFile.file);

    isAnalyzingRef.current = true;
    setIsAnalyzing(true);

    try {
      const response = await fetch('/api/analyze-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pdfName: currentFile.name,
          subject: currentFile.subject,
          grade: currentFile.grade,
          pdfPath: currentFile.file || '',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setPdfAnalysis(data.analysis);
          analyzedFileRef.current = currentFileId;

          // Thêm tin nhắn chào mừng với thông tin phân tích
          const welcomeMessage: Message = {
            id: 'welcome',
            content: `Xin chào! Tôi đã phân tích bài học "${currentFile.name}" và sẵn sàng giúp bạn.\n\n**Tóm tắt bài học:**\n${data.analysis.summary}\n\n**Chủ đề chính:**\n${data.analysis.topics.join(', ')}\n\n**Từ khóa quan trọng:**\n${data.analysis.keywords.slice(0, 5).join(', ')}\n\nBạn có thể hỏi tôi về bất kỳ nội dung nào trong bài học này!`,
            isUser: false,
            timestamp: new Date()
          };

          setMessages([welcomeMessage]);
          console.log('PDF analysis completed. Text length:', data.analysis.extractedTextLength);
        }
      }
    } catch (error) {
      console.error('Error analyzing PDF:', error);
      // Fallback welcome message
      const fallbackMessage: Message = {
        id: 'welcome',
        content: `Xin chào! Tôi là AI trợ lý giáo dục. Tôi sẽ giúp bạn về bài học "${currentFile.name}" - ${currentFile.subject} lớp ${currentFile.grade}. Hãy đặt câu hỏi về nội dung bài học nhé!`,
        isUser: false,
        timestamp: new Date()
      };
      setMessages([fallbackMessage]);
    } finally {
      setIsAnalyzing(false);
      isAnalyzingRef.current = false;
    }
  }, [currentFile, currentFileId, pdfAnalysis, setPdfAnalysis]);

  useEffect(() => {
    analyzePdf();
  }, [analyzePdf]);

  // Reset khi file thay đổi
  useEffect(() => {
    if (currentFileId && analyzedFileRef.current !== currentFileId) {
      // Reset messages khi chuyển file
      setMessages([]);
      // Reset analysis state
      analyzedFileRef.current = null;
    }
  }, [currentFileId]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          currentFile,
          currentPageInfo,
          pdfAnalysis,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.message,
          isUser: false,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error('API call failed');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Xin lỗi, tôi đang gặp sự cố. Vui lòng thử lại sau.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={cn("w-full h-full bg-background border-l border-border text-foreground flex flex-col", className)}>
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bot className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-foreground">AI Chat</h2>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} className="text-foreground hover:bg-accent">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Current File Info */}
      {currentFile && (
        <div className="p-3 bg-muted border-b border-border">
          <p className="text-xs text-muted-foreground mb-1">Đang xem:</p>
          <p className="text-sm font-medium truncate text-foreground">{currentFile.name}</p>
          <p className="text-xs text-muted-foreground">{currentFile.subject} - Lớp {currentFile.grade}</p>
          {currentPageInfo && (
            <div className="mt-2 pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground">
                {currentPageInfo.pageNumber && `Trang ${currentPageInfo.pageNumber}`}
                {currentPageInfo.totalPages && ` / ${currentPageInfo.totalPages}`}
              </p>
              {currentPageInfo.content && (
                <p className="text-xs text-muted-foreground mt-1 truncate">
                  {currentPageInfo.content}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[calc(100vh-200px)]">
        {isAnalyzing && (
          <div className="flex justify-start">
            <div className="max-w-[80%] p-3 rounded-lg bg-muted text-foreground">
              <div className="flex items-center space-x-2 mb-1">
                <Bot className="h-3 w-3" />
                <span className="text-xs text-muted-foreground">Phân tích bài học...</span>
              </div>
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Đang phân tích nội dung PDF...</span>
              </div>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${message.isUser
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-foreground'
                }`}
            >
              <div className="flex items-center space-x-2 mb-1">
                {message.isUser ? (
                  <User className="h-3 w-3" />
                ) : (
                  <Bot className="h-3 w-3" />
                )}
                <span className="text-xs">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <div className="text-sm whitespace-pre-wrap">{message.content}</div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] p-3 rounded-lg bg-muted text-foreground">
              <div className="flex items-center space-x-2 mb-1">
                <Bot className="h-3 w-3" />
                <span className="text-xs text-muted-foreground">Đang trả lời...</span>
              </div>
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">AI đang suy nghĩ...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Hỏi về file này..."
            className="flex-1 px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button
            size="sm"
            onClick={handleSendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="bg-primary hover:bg-primary/90 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}