"use client";

import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  return (
    <div className="h-[calc(100vh-160px)] bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 rounded-md">
      <div className="max-w-md w-full text-center">
        {/* 404 Icon */}
        <div className="mb-8">
          <div className="text-8xl font-bold text-blue-500 dark:text-blue-400 mb-2">
            404
          </div>
          <div className="text-6xl mb-4">📚</div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Trang không tồn tại
          </h1>
          <p className="text-muted-foreground text-lg mb-2">
            Xin lỗi, trang bạn đang tìm kiếm không tồn tại.
          </p>
          <p className="text-muted-foreground">
            Có thể đường link đã bị thay đổi hoặc trang đã bị xóa.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link href="/">
            <Button size="lg" className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Về trang chủ
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="lg"
            className="w-full"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
        </div>

        {/* Footer */}
        <div className="mt-12 text-sm text-muted-foreground">
          <p>Nếu bạn nghĩ đây là lỗi, vui lòng liên hệ với chúng tôi.</p>
        </div>
      </div>
    </div>
  );
}

export default NotFound;