"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { findGradeBySlug } from "@/data/subjects"
import { cn } from "@/lib/utils"

export default function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Get current grade and subject from URL
  const pathSegments = pathname.split('/')
  const currentGradeSlug = pathSegments[2] || ""
  const currentSubjectSlug = pathSegments[3] || ""

  // Find the grade and its subjects
  const gradeData = findGradeBySlug(currentGradeSlug)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] sm:w-[320px]">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Chế độ màn hình</span>
            <ThemeToggle />
          </div>

          {/* Navigation - Only show if we have a current grade */}
          {gradeData && (
            <div className="space-y-4">
              <h4 className="text-sm font-medium">
                {gradeData.name === "Mẫu giáo" ? "Mẫu giáo" : `Lớp ${gradeData.name}`}
              </h4>
              <div className="space-y-1">
                {gradeData.subjects.map((subject) => (
                  <Link
                    key={subject.slug}
                    href={`/grade/${gradeData.slug}/${subject.slug}`}
                    className={cn(
                      "block px-3 py-2 text-sm rounded-md transition-colors hover:bg-muted",
                      currentSubjectSlug === subject.slug && "bg-muted font-medium"
                    )}
                    onClick={() => setOpen(false)}
                  >
                    {subject.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
