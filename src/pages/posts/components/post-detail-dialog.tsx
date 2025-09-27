import { useState } from 'react';
import {  Download, Eye, Trash2, Pin, Heart, MessageCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/custom/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { formatPostDate, getPrivacyLabel, getPrivacyColor, formatFileSize } from '@/api/postApi';

interface PostDetailDialogProps {
  post: Post | null;
  open: boolean;
  onClose: () => void;
}

export function PostDetailDialog({ post, open, onClose }: PostDetailDialogProps) {
  const { deletePostAction, deleteLoading } = usePosts();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!post) return null;

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

  const handleDelete = async () => {
    const success = await deletePostAction(post.id);
    if (success) {
      setDeleteDialogOpen(false);
      onClose();
    }
  };

  const handleDownloadFile = (fileUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" aria-describedby="post-detail-description">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <DialogTitle>Chi tiết bài viết</DialogTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteDialogOpen(true)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Xóa
              </Button>
            </div>
          </DialogHeader>

          <div id="post-detail-description" className="space-y-6">
            {/* Author Info */}
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={post.author.avatarUrl} alt={getAuthorDisplayName()} />
                  <AvatarFallback>{getAuthorInitials()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-foreground">{getAuthorDisplayName()}</p>
                  <p className="text-sm text-muted-foreground">@{post.author.username}</p>
                  <p className="text-xs text-muted-foreground">{post.author.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {post.isPinned && (
                  <Badge variant="outline" className="text-blue-600">
                    <Pin className="h-3 w-3 mr-1" />
                    Đã ghim
                  </Badge>
                )}
                <Badge className={getPrivacyColor(post.privacy)}>
                  {getPrivacyLabel(post.privacy)}
                </Badge>
              </div>
            </div>

            <Separator />

            {/* Content */}
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2 text-foreground">Nội dung bài viết</h3>
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {post.content}
                </p>
              </div>

              {/* Images */}
              {post.images && Array.isArray(post.images) && post.images.length > 0 ? (
                <div>
                  <h3 className="font-medium mb-3 text-foreground">Hình ảnh ({post.images.length})</h3>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {post.images.map((image, index) => {
                      // Skip invalid images
                      if (!image || !image.url) {
                        return null;
                      }

                      return (
                        <div
                          key={image.id || index}
                          className="relative group cursor-pointer border rounded-lg overflow-hidden"
                          onClick={() => setSelectedImageIndex(index)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setSelectedImageIndex(index);
                            }
                          }}
                          aria-label={`Xem ảnh ${index + 1}: ${image.fileName || 'Không có tên'}`}
                        >
                          <img
                            src={image.url}
                            alt={image.fileName || `Ảnh ${index + 1}`}
                            className="w-full h-32 object-cover"
                            onError={(e) => {
                              const target = e.currentTarget;
                              target.style.display = 'none';
                              // Show error fallback
                              const errorDiv = target.nextElementSibling?.nextElementSibling as HTMLElement;
                              if (errorDiv) errorDiv.style.display = 'flex';
                            }}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                            <Eye className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>

                          {/* Error fallback */}
                          <div className="absolute inset-0 bg-muted flex items-center justify-center text-muted-foreground text-xs" style={{ display: 'none' }}>
                            <div className="text-center">
                              <div>❌ Lỗi tải ảnh</div>
                              <div className="text-xs mt-1 break-all">{image.url}</div>
                            </div>
                          </div>
                        </div>
                      );
                    }).filter(Boolean)}
                  </div>

                  {/* Main Image Display */}
                  {post.images.length > 0 && post.images[selectedImageIndex] && (
                    <div className="mt-4 p-4 bg-muted rounded-lg">
                      <img
                        src={post.images[selectedImageIndex].url}
                        alt={post.images[selectedImageIndex].fileName || 'Ảnh được chọn'}
                        className="w-full max-h-96 object-contain rounded"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <p className="text-sm text-muted-foreground mt-2 text-center">
                        {post.images[selectedImageIndex]?.fileName || `Ảnh ${selectedImageIndex + 1}`}
                      </p>
                    </div>
                  )}
                </div>
              ) : null}

              {/* Files */}
              {post.files && Array.isArray(post.files) && post.files.length > 0 && (
                <div>
                  <h3 className="font-medium mb-3 text-foreground">File đính kèm ({post.files.length})</h3>
                  <div className="space-y-2">
                    {post.files.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-sm text-foreground">{file.fileName}</p>
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <span>{formatFileSize(file.fileSize)}</span>
                            <span>•</span>
                            <span>{file.mimeType}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(file.url, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Xem
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadFile(file.url, file.fileName)}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Tải
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Stats and Metadata */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-foreground">
              <div className="flex items-center space-x-2">
                <Heart className="h-4 w-4 text-red-500" />
                <span>{post.likesCount} lượt thích</span>
              </div>
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-4 w-4 text-blue-500" />
                <span>{post.commentsCount} bình luận</span>
              </div>
              <div>
                <p className="text-muted-foreground">Tạo lúc:</p>
                <p className="text-foreground">{formatPostDate(post.createdAt)}</p>
              </div>
              {post.updatedAt && post.updatedAt !== post.createdAt && (
                <div>
                  <p className="text-muted-foreground">Cập nhật:</p>
                  <p className="text-foreground">{formatPostDate(post.updatedAt)}</p>
                </div>
              )}
            </div>

            {/* Linked Content */}
            {(post.linkedTaskId || post.linkedProjectId) && (
              <>
                <Separator />
                <div className="space-y-2">
                  <h3 className="font-medium text-foreground">Liên kết</h3>
                  {post.linkedTaskId && (
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">Task ID:</strong> {post.linkedTaskId}
                    </p>
                  )}
                  {post.linkedProjectId && (
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">Project ID:</strong> {post.linkedProjectId}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa bài viết</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác và sẽ xóa tất cả dữ liệu liên quan bao gồm bình luận, lượt thích và file đính kèm.
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
