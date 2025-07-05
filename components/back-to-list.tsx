'use client'

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

const BackToList = () => {
  const router = useRouter();

  return (
    <Button variant={'ghost'} onClick={() => router.back()} className="flex items-center md:space-x-2 cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
      <ChevronLeft className="h-4 w-4" />
      <span className="hidden md:block">Quay lại</span>
    </Button>
  );
}

export default BackToList;