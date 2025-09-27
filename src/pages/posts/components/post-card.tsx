import { useState } from 'react';
import { MoreHorizontal, Eye, Trash2, MessageCircle, Heart, Pin } from 'lucide-react';
import { Button } from '@/components/custom/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Post } from '@/api/postApi';
import { usePosts } from '../context/posts-context';
import { formatPostDate, getPrivacyLabel, getPrivacyColor } from '@/api/postApi';

interface PostCardProps {
  post: Post;
  onViewDetails: (post: Post) => void;
}

export function PostCard({ post, onViewDetails }: PostCardProps) {
  const { deletePostAction, deleteLoading } = usePosts();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    const success = await deletePostAction(post.id);
    if (success) {
      setDeleteDialogOpen(false);
    }
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const getAuthorDisplayName = () => {
    if (post.author.firstName && post.author.lastName) {
      return `${post.author.firstName} ${post.author.lastName}`;
    }
    return post.author.username || post.author.email;
  };

  const getAuthorInitials = () => {
    const name = getAuthorDisplayName();
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  return (
    <>
      <div className="bg-card rounded-lg border p-6 hover:shadow-md transition-shadow">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.author.avatarUrl} alt={getAuthorDisplayName()} />
              <AvatarFallback>{getAuthorInitials()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm text-foreground">{getAuthorDisplayName()}</p>
              <p className="text-xs text-muted-foreground">@{post.author.username}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {post.isPinned && (
              <Pin className="h-4 w-4 text-blue-600" />
            )}
            <Badge className={`text-xs ${getPrivacyColor(post.privacy)}`}>
              {getPrivacyLabel(post.privacy)}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onViewDetails(post)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Xem chi tiết
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setDeleteDialogOpen(true)}
                  className="text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Xóa bài viết
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Content */}
        <div className="mb-4">
          <p className="text-foreground text-sm leading-relaxed">
            {truncateContent(post.content)}
          </p>
          {post.content.length > 150 && (
            <Button
              variant="link"
              size="sm"
              className="p-0 h-auto text-primary"
              onClick={() => onViewDetails(post)}
            >
              Đọc thêm
            </Button>
          )}
        </div>

        {/* Media Preview */}
        {post.images && Array.isArray(post.images) && post.images.length > 0 && (
          <div className="mb-4">
            {/* Debug info cho development */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mb-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                <strong>Debug PostCard:</strong> {post.images.length} ảnh tìm thấy
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 max-w-md">
              {post.images.slice(0, 4).map((image, index) => {
                // Skip invalid images
                if (!image || !image.url) {
                  return null;
                }

                return (
                  <div key={image.id || index} className="relative">
                    <img
                      src={image.url}
                      alt={image.fileName || `Ảnh ${index + 1}`}
                      className="w-full h-24 object-cover rounded"
                      onError={(e) => {
                        const target = e.currentTarget;
                        const parent = target.parentElement;
                        if (parent) {
                          const errorDiv = parent.querySelector('.error-fallback') as HTMLElement;
                          if (errorDiv) {
                            errorDiv.style.display = 'flex';
                          }
                        }
                        target.style.display = 'none';
                      }}
                    />
                    {index === 3 && post.images && post.images.length > 4 && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 rounded flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          +{post.images.length - 4}
                        </span>
                      </div>
                    )}

                    {/* Error fallback */}
                    <div className="error-fallback absolute inset-0 bg-muted rounded flex items-center justify-center text-muted-foreground text-xs" style={{ display: 'none' }}>
                      Lỗi tải ảnh
                    </div>
                  </div>
                );
              }).filter(Boolean)}
            </div>
          </div>
        )}

        {/* Files */}
        {post.files && Array.isArray(post.files) && post.files.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-muted-foreground mb-2">
              {post.files.length} file(s) đính kèm
            </p>
          </div>
        )}

        {/* Stats and Date */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Heart className="h-4 w-4" />
              <span>{post.likesCount}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle className="h-4 w-4" />
              <span>{post.commentsCount}</span>
            </div>
          </div>
          <span>{formatPostDate(post.createdAt)}</span>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa bài viết</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác.
              <br />
              <strong>Tác giả:</strong> {getAuthorDisplayName()}
              <br />
              <strong>Nội dung:</strong> {truncateContent(post.content, 100)}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteLoading ? 'Đang xóa...' : 'Xóa'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
