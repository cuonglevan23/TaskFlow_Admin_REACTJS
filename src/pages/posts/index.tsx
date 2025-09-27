import { useState, useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Layout } from '@/components/custom/layout';
import { Button } from '@/components/custom/button';
import { PostsProvider, usePosts } from './context/posts-context';
import { PostFilters } from './components/post-filters';
import { PostCard } from './components/post-card';
import { PostDetailDialog } from './components/post-detail-dialog';
import { PostPagination } from './components/post-pagination';
import { Post } from '@/api/postApi';

function PostsContent() {
  const {
    posts,
    currentPost,
    loading,
    error,
    fetchAllPosts,
    fetchPostById,
    clearCurrentPost,
    clearError,
  } = usePosts();

  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  // Load posts on component mount
  useEffect(() => {
    fetchAllPosts();
  }, [fetchAllPosts]);

  const handleViewDetails = async (post: Post) => {
    setSelectedPost(post);
    setDetailDialogOpen(true);

    // Fetch full post details
    await fetchPostById(post.id);
  };

  const handleCloseDetail = () => {
    setDetailDialogOpen(false);
    setSelectedPost(null);
    clearCurrentPost();
  };

  const handleRetry = () => {
    clearError();
    fetchAllPosts();
  };

  if (error) {
    return (
      <Layout.Body>
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-2">Có lỗi xảy ra</h2>
            <p className="text-gray-600 mb-4 max-w-md">
              {error}
            </p>
            <Button onClick={handleRetry} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Thử lại
            </Button>
          </div>
        </div>
      </Layout.Body>
    );
  }

  return (
    <Layout.Body className="flex flex-col overflow-hidden">
      <div className="space-y-6 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Quản lý bài viết</h1>
            <p className="text-muted-foreground">
              Xem, tìm kiếm và quản lý tất cả bài viết trong hệ thống
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex-shrink-0">
          <PostFilters />
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          {/* Loading State */}
          {loading && posts.length === 0 && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Đang tải bài viết...</p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && posts.length === 0 && !error && (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <AlertTriangle className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2 text-foreground">Không tìm thấy bài viết</h3>
              <p className="text-muted-foreground mb-4">
                Không có bài viết nào phù hợp với tiêu chí tìm kiếm của bạn.
              </p>
              <Button onClick={() => fetchAllPosts()} variant="outline">
                Xem tất cả bài viết
              </Button>
            </div>
          )}

          {/* Posts Grid */}
          {posts.length > 0 && (
            <div className="space-y-6">
              <div className="grid gap-6">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>

              {/* Loading More Indicator */}
              {loading && posts.length > 0 && (
                <div className="flex items-center justify-center py-4">
                  <RefreshCw className="h-5 w-5 animate-spin text-primary mr-2" />
                  <span className="text-sm text-muted-foreground">Đang tải...</span>
                </div>
              )}

              {/* Pagination */}
              <div className="py-4">
                <PostPagination />
              </div>
            </div>
          )}
        </div>

        {/* Post Detail Dialog */}
        <PostDetailDialog
          post={currentPost || selectedPost}
          open={detailDialogOpen}
          onClose={handleCloseDetail}
        />
      </div>
    </Layout.Body>
  );
}

export default function PostsPage() {
  return (
    <PostsProvider>
      <Layout fixed>
        <PostsContent />
      </Layout>
    </PostsProvider>
  );
}
