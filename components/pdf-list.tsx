"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import PdfIcon from "./icons/pdf";
import { Button } from "./ui/button";
import { Download, Eye, Search, SortAsc, SortDesc, Grid, List } from "lucide-react";
import { getPdfsByGradeAndSubject, PdfFile } from "@/data/pdfs";
import { slugify } from "@/lib/slugify";
import { Card } from "./ui/card";

interface PdfListProps {
  subject: string;
  grade: string;
}

type SortOption = 'name' | 'size' | 'date';
type ViewMode = 'list' | 'grid';

const PdfList = ({ subject, grade }: PdfListProps) => {
  const router = useRouter();
  const pathname = usePathname()
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Get PDFs from data based on grade and subject
  const gradeSlug = grade === "Mẫu giáo" ? "mau-giao" : grade;
  const subjectSlug = slugify(subject);
  const allPdfFiles: PdfFile[] = getPdfsByGradeAndSubject(gradeSlug, subjectSlug);

  // Filter and sort files
  const filteredFiles = allPdfFiles.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedFiles = [...filteredFiles].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    if (sortBy === 'name') {
      aValue = a.name;
      bValue = b.name;
    } else if (sortBy === 'size') {
      aValue = parseFloat(a.size.replace(' MB', ''));
      bValue = parseFloat(b.size.replace(' MB', ''));
    } else { // sortBy === 'date'
      aValue = new Date(a.uploadDate).getTime();
      bValue = new Date(b.uploadDate).getTime();
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const toggleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(option);
      setSortOrder('asc');
    }
  };

  const handleView = (file: PdfFile) => {
    router.push(`${pathname}/pdf-viewer/${file.id}`);
  };

  const handleDownload = (file: PdfFile) => {
    console.log("Downloading:", file.name);
  };

  return (
    <div className="p-3 md:p-6">
      <div className="mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-foreground mb-2">
          {subject} - Lớp {grade}
        </h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Danh sách tài liệu học tập cho môn {subject}
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-background border border-border rounded-lg p-3 md:p-4 mb-4 md:mb-6">
        <div className="flex flex-col gap-4">
          {/* Search */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Tìm kiếm tài liệu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 md:py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-base md:text-sm"
            />
          </div>

          {/* Sort and View Controls */}
          <div className="flex flex-col gap-4 sm:flex-row sm:gap-4 sm:items-center sm:justify-between">
            {/* Sort Buttons - With sliding indicator */}
            <div className="relative bg-muted/30 p-1 rounded-lg overflow-x-auto">
              <div className="flex items-center gap-1">
                <Button
                  variant={sortBy === 'name' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => toggleSort('name')}
                  className={`relative z-10 rounded-lg px-4 text-sm whitespace-nowrap transition-colors ${sortBy === 'name' ? 'text-primary-foreground' : 'text-foreground hover:text-foreground'
                    }`}
                >
                  Tên {sortBy === 'name' && (sortOrder === 'asc' ? <SortAsc className="ml-1 h-3 w-3" /> : <SortDesc className="ml-1 h-3 w-3" />)}
                </Button>
                <Button
                  variant={sortBy === 'size' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => toggleSort('size')}
                  className={`relative z-10 rounded-lg px-4 text-sm whitespace-nowrap transition-colors ${sortBy === 'size' ? 'text-primary-foreground' : 'text-foreground hover:text-foreground'
                    }`}
                >
                  Size {sortBy === 'size' && (sortOrder === 'asc' ? <SortAsc className="ml-1 h-3 w-3" /> : <SortDesc className="ml-1 h-3 w-3" />)}
                </Button>
                <Button
                  variant={sortBy === 'date' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => toggleSort('date')}
                  className={`relative z-10 rounded-lg px-4 text-sm whitespace-nowrap transition-colors ${sortBy === 'date' ? 'text-primary-foreground' : 'text-foreground hover:text-foreground'
                    }`}
                >
                  Ngày {sortBy === 'date' && (sortOrder === 'asc' ? <SortAsc className="ml-1 h-3 w-3" /> : <SortDesc className="ml-1 h-3 w-3" />)}
                </Button>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="relative bg-muted/50 p-1 gap-1 rounded-lg flex items-center w-fit ml-auto sm:mx-0">
              <div
                className={`absolute top-1 w-8 h-8 bg-background rounded-lg shadow-sm transition-transform duration-200 ease-in-out ${viewMode === 'grid' ? 'transform translate-x-9' : 'transform translate-x-0'
                  }`}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('list')}
                className={`relative z-10 w-8 h-8 p-0 rounded-lg transition-colors ${viewMode === 'list' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('grid')}
                className={`relative z-10 w-8 h-8 p-0 rounded-lg transition-colors ${viewMode === 'grid' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                <Grid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-muted-foreground">
          <div>
            Hiển thị <span className="font-medium text-foreground">{sortedFiles.length}</span> tài liệu
            {searchTerm && (
              <span> từ <span className="font-medium text-foreground">{allPdfFiles.length}</span> tài liệu</span>
            )}
            {!searchTerm && allPdfFiles.length > 0 && (
              <span> (tổng cộng <span className="font-medium text-foreground">{allPdfFiles.length}</span> tài liệu)</span>
            )}
          </div>
          {searchTerm && (
            <div className="text-xs bg-muted/50 px-2 py-1 rounded-full w-fit">
              Tìm kiếm: &ldquo;{searchTerm}&rdquo;
            </div>
          )}
        </div>
      </div>

      {/* PDF Files List/Grid */}
      <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6" : "space-y-3 md:space-y-4"}>
        {sortedFiles.map((file) => (
          <div
            key={file.id}
            className={`bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 ${viewMode === 'grid' ? 'flex flex-col' : 'flex items-center justify-between p-3 md:p-4'
              }`}
          >
            {viewMode === 'grid' ? (
              // Grid view - Product card style
              <>
                {/* Thumbnail */}
                <div className="relative aspect-[4/3] w-full bg-muted/30 overflow-hidden">
                  {file.thumbnail ? (
                    <Image
                      src={file.thumbnail}
                      alt={file.name}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                      <PdfIcon className="w-8 h-8 md:w-16 md:h-16 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-2 md:p-4 flex-1 flex flex-col">
                  <h3 className="font-medium md:font-semibold text-foreground mb-1 md:mb-2 line-clamp-2 leading-tight text-xs md:text-base">
                    {file.name}
                  </h3>

                  <div className="flex items-center gap-1 md:gap-3 text-xs text-muted-foreground mb-2 md:mb-4">
                    <span className="flex items-center gap-0.5 md:gap-1">
                      <div className="w-1 h-1 md:w-2 md:h-2 bg-blue-500 rounded-full"></div>
                      {file.size}
                    </span>
                    <span className="flex items-center gap-0.5 md:gap-1">
                      <div className="w-1 h-1 md:w-2 md:h-2 bg-green-500 rounded-full"></div>
                      <span className="hidden sm:inline">{new Date(file.uploadDate).toLocaleDateString('vi-VN')}</span>
                      <span className="sm:hidden">{new Date(file.uploadDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}</span>
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="mt-auto flex gap-1 md:gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleView(file)}
                      className="flex-1 flex items-center justify-center gap-0.5 md:gap-1 cursor-pointer text-xs h-7 md:h-9 px-1 md:px-3"
                    >
                      <Eye className="h-3 w-3 md:h-4 md:w-4" />
                      <span className="hidden sm:inline">Xem</span>
                    </Button>
                    <Button
                      variant="outline"
                      disabled
                      size="sm"
                      onClick={() => handleDownload(file)}
                      className="flex items-center gap-0.5 shrink-0 md:gap-1 cursor-pointer text-xs h-7 md:h-9 px-1 md:px-3"
                    >
                      <Download className="h-3 w-3 md:h-4 md:w-4" />
                      <span className="hidden sm:inline">Tải</span>
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              // List view - Compact style with clickable row on mobile
              <div
                className="cursor-pointer w-full hover:bg-muted/30 transition-colors md:cursor-default md:hover:bg-transparent"
                onClick={() => viewMode === 'list' && window.innerWidth < 768 ? handleView(file) : undefined}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center flex-1 min-w-0">
                    {/* Thumbnail */}
                    <div className="mr-3 md:mr-4 flex-shrink-0">
                      {file.thumbnail ? (
                        <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden border border-border">
                          <Image
                            src={file.thumbnail}
                            alt={file.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-lg bg-muted/30 flex items-center justify-center">
                          <PdfIcon className="w-6 h-6 md:w-8 md:h-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 pr-2">
                      <h3 className="font-medium text-foreground line-clamp-2 md:truncate text-sm md:text-base mb-1 leading-tight">
                        {file.name}
                      </h3>
                      <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                          {file.size}
                        </span>
                        <span className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          <span className="hidden sm:inline">{new Date(file.uploadDate).toLocaleDateString('vi-VN')}</span>
                          <span className="sm:hidden">{new Date(file.uploadDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions - Only show download on mobile, both on desktop */}
                  <div className="flex items-center gap-1 md:gap-2 flex-shrink-0 ml-auto">
                    {/* Desktop: Show both buttons */}
                    <div className="hidden md:flex gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleView(file)}
                        className="flex items-center gap-1 cursor-pointer text-sm h-9 px-3"
                      >
                        <Eye className="h-4 w-4" />
                        Xem
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(file)}
                        disabled
                        className="flex items-center gap-1 cursor-pointer text-sm h-9 px-3"
                      >
                        <Download className="h-4 w-4" />
                        Tải về
                      </Button>
                    </div>

                    {/* Mobile: Only download button + chevron indicator */}
                    <div className="md:hidden flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(file);
                        }}
                        className="flex items-center gap-1 cursor-pointer text-xs h-8 px-2 hover:bg-muted"
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                      {/* Chevron indicator for clickable row */}
                      <div className="text-muted-foreground">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* No results message */}
      {sortedFiles.length === 0 && (
        <Card className="text-center py-8 md:py-12 mx-2 md:mx-0">
          {allPdfFiles.length === 0 ? (
            // Case 1: No documents available for this subject
            <>
              <div className="text-muted-foreground mb-4">
                <PdfIcon className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 text-gray-300" />
              </div>
              <div className="text-muted-foreground mb-2 text-lg md:text-xl font-medium">
                Chưa có tài liệu nào
              </div>
              <p className="text-sm md:text-base text-muted-foreground px-4">
                Môn {subject} - Lớp {grade} hiện chưa có tài liệu học tập
              </p>
            </>
          ) : (
            // Case 2: Documents exist but filtered out
            <>
              <div className="text-muted-foreground mb-4">
                <Search className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 text-gray-300" />
              </div>
              <div className="text-muted-foreground mb-2 text-lg md:text-xl font-medium">
                Không tìm thấy tài liệu nào
              </div>
              <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6 px-4">
                Không có tài liệu nào phù hợp với bộ lọc hiện tại
              </p>
              <div className="flex flex-col gap-2 justify-center px-4">
                {searchTerm && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSearchTerm("")}
                    className="flex items-center justify-center gap-1 text-sm h-10 w-full max-w-xs mx-auto"
                  >
                    Xóa từ khóa tìm kiếm
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("");
                    setSortBy('name');
                    setSortOrder('asc');
                  }}
                  className="flex items-center justify-center gap-1 text-sm h-10 w-full max-w-xs mx-auto"
                >
                  Đặt lại bộ lọc
                </Button>
              </div>
            </>
          )}
        </Card>
      )}
    </div>
  );
};

export default PdfList;
