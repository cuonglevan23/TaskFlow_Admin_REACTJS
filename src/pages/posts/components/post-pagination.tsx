import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/custom/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePosts } from '../context/posts-context';

export function PostPagination() {
  const {
    pagination,
    loading,
    currentView,
    searchQuery,
    selectedUserId,
    fetchAllPosts,
    fetchTrendingPosts,
    fetchPostsByUser,
    searchPostsAction,
  } = usePosts();

  if (!pagination || pagination.totalPages <= 1) {
    return null;
  }

  const handlePageChange = async (page: number) => {
    const params = { page, size: 10 };

    switch (currentView) {
      case 'all':
        await fetchAllPosts(params);
        break;
      case 'trending':
        await fetchTrendingPosts(params);
        break;
      case 'user':
        if (selectedUserId) {
          await fetchPostsByUser(selectedUserId, params);
        }
        break;
      case 'search':
        if (searchQuery) {
          await searchPostsAction(searchQuery, params);
        }
        break;
    }
  };

  const handlePageSizeChange = async (size: string) => {
    const params = { page: 0, size: parseInt(size) };

    switch (currentView) {
      case 'all':
        await fetchAllPosts(params);
        break;
      case 'trending':
        await fetchTrendingPosts(params);
        break;
      case 'user':
        if (selectedUserId) {
          await fetchPostsByUser(selectedUserId, params);
        }
        break;
      case 'search':
        if (searchQuery) {
          await searchPostsAction(searchQuery, params);
        }
        break;
    }
  };

  const generatePageNumbers = () => {
    const pages = [];
    const currentPage = pagination.currentPage;
    const totalPages = pagination.totalPages;

    // Always show first page
    if (currentPage > 2) {
      pages.push(0);
    }

    // Show ellipsis if there's a gap
    if (currentPage > 3) {
      pages.push(-1); // -1 represents ellipsis
    }

    // Show pages around current page
    for (let i = Math.max(0, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }

    // Show ellipsis if there's a gap
    if (currentPage < totalPages - 4) {
      pages.push(-1); // -1 represents ellipsis
    }

    // Always show last page
    if (currentPage < totalPages - 3) {
      pages.push(totalPages - 1);
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-500">
          Hiển thị {pagination.currentPage * 10 + 1}-{Math.min((pagination.currentPage + 1) * 10, pagination.totalElements)}
          trong tổng số {pagination.totalElements} bài viết
        </span>
      </div>

      <div className="flex items-center space-x-2">
        {/* Page Size Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Hiển thị:</span>
          <Select defaultValue="10" onValueChange={handlePageSizeChange}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={!pagination.hasPrevious || loading}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {pageNumbers.map((pageNum, index) => (
            pageNum === -1 ? (
              <Button
                key={`ellipsis-${index}`}
                variant="ghost"
                size="sm"
                disabled
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                key={pageNum}
                variant={pageNum === pagination.currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(pageNum)}
                disabled={loading}
              >
                {pageNum + 1}
              </Button>
            )
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={!pagination.hasNext || loading}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
