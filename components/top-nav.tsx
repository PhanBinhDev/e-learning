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
      const container = document.querySelector('.tabs-container');

      if (activeTabElement && container) {
        const containerRect = container.getBoundingClientRect();
        const elementRect = activeTabElement.getBoundingClientRect();

        // Calculate position relative to container
        const left = elementRect.left - containerRect.left + container.scrollLeft;
        const width = elementRect.width;

        setIndicatorStyle({
          left: left,
          width: width,
        });

        // Auto scroll to active tab on mobile
        if (window.innerWidth < 768) {
          const containerWidth = container.clientWidth;
          const elementCenter = left + width / 2;
          const targetScroll = elementCenter - containerWidth / 2;

          container.scrollTo({
            left: Math.max(0, targetScroll),
            behavior: 'smooth'
          });
        }
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(updateIndicator, 100);

    // Also update on window resize
    const handleResize = () => {
      setTimeout(updateIndicator, 50);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [activeTab]);

  return (
    <div className="left-0 bg-background h-14 border-b border-border fixed top-16 flex items-center justify-center w-full md:left-[250px] right-0 z-20 md:w-[calc(100vw-250px)]">
      <div className="tabs-container flex items-center w-full space-x-1 py-1.5 max-w-4xl overflow-x-auto scrollbar-hide relative px-4">
        <div
          className="absolute top-1/2 -translate-y-1/2 h-10 bg-primary rounded-2xl transition-all duration-300 ease-out z-0 pointer-events-none"
          style={indicatorStyle}
        />

        {grades.map((grade, index) => (
          <Link key={grade.slug} href={`/grade/${grade.slug}`}>
            <Button
              ref={(el) => {
                tabsRef.current[index] = el;
              }}
              variant="ghost"
              className={`rounded-2xl relative z-10 transition-colors duration-300 select-none whitespace-nowrap min-w-fit px-4 h-10 ${activeTab === grade.slug
                ? 'text-primary-foreground font-medium'
                : 'text-foreground hover:text-foreground'
                }`}
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
