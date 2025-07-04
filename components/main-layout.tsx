"use client";

import Aside from "./aside";
import TopNav from "./top-nav";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex-1 flex mt-14 ml-[250px] w-[calc(100vw-250px)]">
      <Aside />
      <div className="flex-1">
        <TopNav />
        <main className="overflow-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
