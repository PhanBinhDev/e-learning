"use client";

import AiChatSidebar from "./ai-chat-sidebar";
import AiChatToggle from "./ai-chat-toggle";
import Aside from "./aside";
import TopNav from "./top-nav";
import { useAiChat } from "./ai-chat-context";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { isAiChatOpen, setIsAiChatOpen, currentFile } = useAiChat();

  return (
    <div className="flex-1 flex mt-14 md:ml-[250px] md:w-[calc(100vw-250px)] w-full overflow-x-hidden">
      <Aside />
      <div className="flex-1">
        <TopNav />
        <main className="overflow-auto p-2 md:p-4">
          {children}
        </main>
      </div>

      {/* AI Chat Sidebar - Desktop (Fixed Right Side) - Chỉ hiện khi có currentFile */}
      {currentFile && (
        <div className={`hidden md:block transition-all duration-300 ${isAiChatOpen ? 'translate-x-0 max-w-80 ' : 'translate-x-full'
          }`}>
          <AiChatSidebar
            isOpen={isAiChatOpen}
            onClose={() => setIsAiChatOpen(false)}
            currentFile={currentFile || undefined}
          />
        </div>
      )}

      {/* AI Chat Modal - Mobile (Full Screen) - Chỉ hiện khi có currentFile */}
      {
        currentFile && isAiChatOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsAiChatOpen(false)}
            />
            {/* Modal Content */}
            <div className="absolute inset-0 bg-black">
              <AiChatSidebar
                isOpen={isAiChatOpen}
                onClose={() => setIsAiChatOpen(false)}
                currentFile={currentFile || undefined}
              />
            </div>
          </div>
        )
      }

      {/* AI Chat Toggle Button - Chỉ hiện khi có currentFile */}
      {currentFile && (
        <AiChatToggle
          isOpen={isAiChatOpen}
          onClick={() => setIsAiChatOpen(!isAiChatOpen)}
        />
      )}
    </div >
  );
};

export default MainLayout;
