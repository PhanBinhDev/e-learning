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
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {subject} - Lớp {grade}
        </h1>
        <p className="text-muted-foreground">
          Danh sách tài liệu học tập cho môn {subject}
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-background border border-border rounded-lg p-4 mb-6">
        <div className="flex flex-col gap-4">
          {/* Search */}
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Tìm kiếm tài liệu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Sort and View Controls */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center sm:justify-between">
            {/* Sort Buttons - Modern pill style */}
            <div className="flex flex-wrap items-center gap-2 bg-muted/30 p-1 rounded-full">
              <Button
                variant={sortBy === 'name' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => toggleSort('name')}
                className={`rounded-full px-3 sm:px-4 text-xs sm:text-sm transition-all ${sortBy === 'name' ? 'bg-primary shadow-sm' : 'hover:bg-muted'}`}
              >
                Tên {sortBy === 'name' && (sortOrder === 'asc' ? <SortAsc className="ml-1 h-3 w-3" /> : <SortDesc className="ml-1 h-3 w-3" />)}
              </Button>
              <Button
                variant={sortBy === 'size' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => toggleSort('size')}
                className={`rounded-full px-3 sm:px-4 text-xs sm:text-sm transition-all ${sortBy === 'size' ? 'bg-primary shadow-sm' : 'hover:bg-muted'}`}
              >
                <span className="hidden sm:inline">Kích thước</span>
                <span className="sm:hidden">Size</span>
                {sortBy === 'size' && (sortOrder === 'asc' ? <SortAsc className="ml-1 h-3 w-3" /> : <SortDesc className="ml-1 h-3 w-3" />)}
              </Button>
              <Button
                variant={sortBy === 'date' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => toggleSort('date')}
                className={`rounded-full px-3 sm:px-4 text-xs sm:text-sm transition-all ${sortBy === 'date' ? 'bg-primary shadow-sm' : 'hover:bg-muted'}`}
              >
                Ngày {sortBy === 'date' && (sortOrder === 'asc' ? <SortAsc className="ml-1 h-3 w-3" /> : <SortDesc className="ml-1 h-3 w-3" />)}
              </Button>
            </div>

            {/* View Mode Toggle - Toggle switch style */}
            <div className="relative bg-muted/50 p-1 rounded-full flex items-center w-fit">
              <div
                className={`absolute top-1 w-8 h-8 bg-background rounded-full shadow-sm transition-transform duration-200 ease-in-out ${viewMode === 'grid' ? 'transform translate-x-8' : 'transform translate-x-0'
                  }`}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('list')}
                className={`relative z-10 w-8 h-8 p-0 rounded-full transition-colors ${viewMode === 'list' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('grid')}
                className={`relative z-10 w-8 h-8 p-0 rounded-full transition-colors ${viewMode === 'grid' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
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
            <div className="text-xs bg-muted/50 px-2 py-0.5 rounded-full w-fit">
              Tìm kiếm: &ldquo;{searchTerm}&rdquo;
            </div>
          )}
        </div>
      </div>

      {/* PDF Files List/Grid */}
      <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}>
        {sortedFiles.map((file) => (
          <div
            key={file.id}
            className={`bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 ${viewMode === 'grid' ? 'flex flex-col' : 'flex items-center justify-between p-4'
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
                      <PdfIcon className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-semibold text-foreground mb-2 line-clamp-2 leading-tight">
                    {file.name}
                  </h3>

                  <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      {file.size}
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      {new Date(file.uploadDate).toLocaleDateString('vi-VN')}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="mt-auto flex gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleView(file)}
                      className="flex-1 flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Eye className="h-4 w-4" />
                      Xem
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(file)}
                      className="flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              // List view - Compact style
              <>
                <div className="flex items-center flex-1">
                  {/* Thumbnail */}
                  <div className="mr-4 flex-shrink-0">
                    {file.thumbnail ? (
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-border">
                        <Image
                          src={file.thumbnail}
                          alt={file.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-muted/30 flex items-center justify-center">
                        <PdfIcon className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-foreground truncate">{file.name}</h3>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{file.size}</span>
                      <span>{new Date(file.uploadDate).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleView(file)}
                    className="flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="h-4 w-4" />
                    Xem
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(file)}
                    className="flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="h-4 w-4" />
                    Tải về
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* No results message */}
      {sortedFiles.length === 0 && (
        <Card className="text-center py-12 bg-background rounded-md">
          {allPdfFiles.length === 0 ? (
            // Case 1: No documents available for this subject
            <>
              <div className="text-muted-foreground mb-4">
                <PdfIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              </div>
              <div>
                <div className="text-muted-foreground mb-2 text-lg font-medium">
                  Chưa có tài liệu nào
                </div>
                <p className="text-sm text-muted-foreground">
                  Môn {subject} - Lớp {grade} hiện chưa có tài liệu học tập
                </p>
              </div>
            </>
          ) : (
            // Case 2: Documents exist but filtered out
            <>
              <div className="text-muted-foreground mb-4">
                <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              </div>
              <div className="text-muted-foreground mb-2 text-lg font-medium">
                Không tìm thấy tài liệu nào
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Không có tài liệu nào phù hợp với bộ lọc hiện tại
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                {searchTerm && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSearchTerm("")}
                    className="flex items-center gap-1"
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
                  className="flex items-center gap-1"
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
