import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  Post,
  PostsResponse,
  PostQueryParams,
  getAllPosts,
  getPostById,
  deletePost,
  getPostsByUser,
  getTrendingPosts,
  searchPosts,
} from '@/api/postApi';
import { toast } from '@/components/ui/use-toast';

interface PostsContextType {
  // Data
  posts: Post[];
  currentPost: Post | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalElements: number;
    hasNext: boolean;
    hasPrevious: boolean;
  } | null;

  // Loading states
  loading: boolean;
  deleteLoading: boolean;
  searchLoading: boolean;

  // Error states
  error: string | null;

  // Filters
  currentView: 'all' | 'trending' | 'user' | 'search';
  searchQuery: string;
  selectedUserId: number | null;

  // Actions
  fetchAllPosts: (params?: PostQueryParams) => Promise<void>;
  fetchPostById: (postId: number) => Promise<void>;
  fetchPostsByUser: (userId: number, params?: PostQueryParams) => Promise<void>;
  fetchTrendingPosts: (params?: PostQueryParams) => Promise<void>;
  searchPostsAction: (query: string, params?: PostQueryParams) => Promise<void>;
  deletePostAction: (postId: number) => Promise<boolean>;
  refreshPosts: () => Promise<void>;
  clearCurrentPost: () => void;
  clearError: () => void;
  setCurrentView: (view: 'all' | 'trending' | 'user' | 'search') => void;
  setSearchQuery: (query: string) => void;
  setSelectedUserId: (userId: number | null) => void;
}

const PostsContext = createContext<PostsContextType | null>(null);

interface PostsProviderProps {
  children: React.ReactNode;
}

export function PostsProvider({ children }: PostsProviderProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  const [pagination, setPagination] = useState<{
    currentPage: number;
    totalPages: number;
    totalElements: number;
    hasNext: boolean;
    hasPrevious: boolean;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currentView, setCurrentView] = useState<'all' | 'trending' | 'user' | 'search'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const handleApiResponse = (response: PostsResponse) => {
    if (response.success) {
      setPosts(response.data);
      setPagination(response.pagination);
      setError(null);
    } else {
      throw new Error(response.message);
    }
  };

  const fetchAllPosts = useCallback(async (params?: PostQueryParams) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllPosts(params);
      handleApiResponse(response);
    } catch (err: any) {
      console.error('Failed to fetch posts:', err);
      setError(err.message || 'Không thể tải danh sách bài viết');
      setPosts([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPostById = useCallback(async (postId: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getPostById(postId);
      if (response.success) {
        setCurrentPost(response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (err: any) {
      console.error('Failed to fetch post:', err);
      setError(err.message || 'Không thể tải chi tiết bài viết');
      setCurrentPost(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPostsByUser = useCallback(async (userId: number, params?: PostQueryParams) => {
    try {
      setLoading(true);
      setError(null);
      setSelectedUserId(userId);
      const response = await getPostsByUser(userId, params);
      handleApiResponse(response);
    } catch (err: any) {
      console.error('Failed to fetch user posts:', err);
      setError(err.message || 'Không thể tải bài viết của người dùng');
      setPosts([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTrendingPosts = useCallback(async (params?: PostQueryParams) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getTrendingPosts(params);
      handleApiResponse(response);
    } catch (err: any) {
      console.error('Failed to fetch trending posts:', err);
      setError(err.message || 'Không thể tải bài viết xu hướng');
      setPosts([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchPostsAction = useCallback(async (query: string, params?: PostQueryParams) => {
    if (!query.trim()) return;

    try {
      setSearchLoading(true);
      setError(null);
      setSearchQuery(query);
      const response = await searchPosts(query, params);
      handleApiResponse(response);
    } catch (err: any) {
      console.error('Failed to search posts:', err);
      setError(err.message || 'Không thể tìm kiếm bài viết');
      setPosts([]);
      setPagination(null);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  const deletePostAction = useCallback(async (postId: number): Promise<boolean> => {
    try {
      setDeleteLoading(true);
      setError(null);

      const response = await deletePost(postId);

      if (response.success) {
        // Remove post from current list
        setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));

        // Clear current post if it's the deleted one
        if (currentPost?.id === postId) {
          setCurrentPost(null);
        }

        toast({
          title: 'Xóa thành công',
          description: 'Bài viết đã được xóa khỏi hệ thống',
        });

        return true;
      } else {
        throw new Error(response.message);
      }
    } catch (err: any) {
      console.error('Failed to delete post:', err);
      const errorMessage = err.message || 'Không thể xóa bài viết';
      setError(errorMessage);

      toast({
        title: 'Xóa thất bại',
        description: errorMessage,
        variant: 'destructive',
      });

      return false;
    } finally {
      setDeleteLoading(false);
    }
  }, [currentPost]);

  const refreshPosts = useCallback(async () => {
    switch (currentView) {
      case 'all':
        await fetchAllPosts();
        break;
      case 'trending':
        await fetchTrendingPosts();
        break;
      case 'user':
        if (selectedUserId) {
          await fetchPostsByUser(selectedUserId);
        }
        break;
      case 'search':
        if (searchQuery) {
          await searchPostsAction(searchQuery);
        }
        break;
    }
  }, [currentView, selectedUserId, searchQuery, fetchAllPosts, fetchTrendingPosts, fetchPostsByUser, searchPostsAction]);

  const clearCurrentPost = useCallback(() => {
    setCurrentPost(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: PostsContextType = {
    // Data
    posts,
    currentPost,
    pagination,

    // Loading states
    loading,
    deleteLoading,
    searchLoading,

    // Error states
    error,

    // Filters
    currentView,
    searchQuery,
    selectedUserId,

    // Actions
    fetchAllPosts,
    fetchPostById,
    fetchPostsByUser,
    fetchTrendingPosts,
    searchPostsAction,
    deletePostAction,
    refreshPosts,
    clearCurrentPost,
    clearError,
    setCurrentView,
    setSearchQuery,
    setSelectedUserId,
  };

  return (
    <PostsContext.Provider value={value}>
      {children}
    </PostsContext.Provider>
  );
}

// Hook to use posts context
export const usePosts = () => {
  const context = useContext(PostsContext);

  if (!context) {
    throw new Error('usePosts must be used within a PostsProvider');
  }

  return context;
};
