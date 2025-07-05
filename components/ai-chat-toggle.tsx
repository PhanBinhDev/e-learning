'use client'

import { MessageCircle } from 'lucide-react';
import { Button } from './ui/button';

interface AiChatToggleProps {
  isOpen: boolean;
  onClick: () => void;
}

export default function AiChatToggle({ isOpen, onClick }: AiChatToggleProps) {
  return (
    <Button
      variant="default"
      size="sm"
      onClick={onClick}
      className={`fixed bottom-4 z-40 rounded-full shadow-lg md:hidden transition-all duration-300 ${isOpen
        ? 'right-4 md:right-[21rem]'
        : 'right-4'
        }`}
    >
      <MessageCircle className="h-4 w-4 mr-2" />
      <span className="hidden sm:inline">
        {isOpen ? 'Đóng Chat' : 'AI Chat'}
      </span>
      <span className="sm:hidden">
        {isOpen ? 'Đóng' : 'AI'}
      </span>
    </Button>
  );
}
