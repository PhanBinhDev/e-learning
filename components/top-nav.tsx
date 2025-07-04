"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "./ui/button";
import { grades } from "@/data/subjects";

const TopNav = () => {
  const pathname = usePathname();
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  // Get active tab from URL
  const activeTab = useMemo(() => {
    const gradeMatch = pathname.match(/\/grade\/([^\/]+)/);
    return gradeMatch ? gradeMatch[1] : "mau-giao";
  }, [pathname]);

  useEffect(() => {
    const updateIndicator = () => {
      const activeIndex = grades.findIndex(grade => grade.slug === activeTab);
      const activeTabElement = tabsRef.current[activeIndex];

      if (activeTabElement) {
        const { offsetLeft, offsetWidth } = activeTabElement;
        setIndicatorStyle({
          left: offsetLeft,
          width: offsetWidth,
        });
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(updateIndicator, 0);
    return () => clearTimeout(timer);
  }, [activeTab]);

  return (
    <div className="bg-background h-14 border-b border-border fixed top-16 flex items-center justify-center left-[250px] right-0 z-20 w-[calc(100vw-250px)]">
      <div className="flex items-center w-full space-x-1 max-w-4xl overflow-x-auto scrollbar-hide relative px-4 ">
        <div
          className="absolute top-0 h-full bg-primary rounded-2xl transition-all duration-400 ease-out z-0"
          style={indicatorStyle}
        />

        {grades.map((grade, index) => (
          <Link key={grade.slug} href={`/grade/${grade.slug}`}>
            <Button
              ref={(el) => {
                tabsRef.current[index] = el;
              }}
              variant={activeTab === grade.slug ? "default" : "ghost"}
              className="rounded-2xl relative z-10 transition-colors duration-300 select-none"
            >
              {grade.name}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default TopNav;
