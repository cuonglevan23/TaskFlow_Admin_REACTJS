import api from './axios.customize';

// Types for Post Management
export interface Author {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  avatarUrl: string;
}

export interface PostImage {
  id: number;
  url: string;
  fileName: string;
}

export interface PostFile {
  id: number;
  url: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

export interface Post {
  id: number;
  content: string;
  author: Author;
  createdAt: string;
  updatedAt?: string;
  privacy: 'PUBLIC' | 'PRIVATE' | 'FRIENDS_ONLY';
  likesCount: number;
  commentsCount: number;
  images: PostImage[];
  files: PostFile[];
  linkedTaskId?: number;
  linkedProjectId?: number;
  isPinned: boolean;
  isLikedByCurrentUser?: boolean;
}

export interface PostsResponse {
  success: boolean;
  message: string;
  data: Post[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalElements: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export interface SinglePostResponse {
  success: boolean;
  message: string;
  data: Post;
}

export interface DeletePostResponse {
  success: boolean;
  message: string;
}

export interface PostQueryParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'ASC' | 'DESC';
}

// API Functions

/**
 * Get all posts in the newsfeed (Admin can see all regardless of privacy)
 */
export const getAllPosts = async (params?: PostQueryParams): Promise<PostsResponse> => {
  const queryParams = new URLSearchParams();

  if (params?.page !== undefined) queryParams.append('page', params.page.toString());
  if (params?.size !== undefined) queryParams.append('size', params.size.toString());
  if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params?.sortDir) queryParams.append('sortDir', params.sortDir);

  const queryString = queryParams.toString();
  const url = queryString ? `/posts/feed?${queryString}` : '/posts/feed';

  return await api.get(url);
};

/**
 * Get specific post by ID
 */
export const getPostById = async (postId: number): Promise<SinglePostResponse> => {
  return await api.get(`/posts/${postId}`);
};

/**
 * Delete any post (Admin privilege)
 */
export const deletePost = async (postId: number): Promise<DeletePostResponse> => {
  return await api.delete(`/posts/${postId}`);
};

/**
 * Get posts by specific user
 */
export const getPostsByUser = async (userId: number, params?: PostQueryParams): Promise<PostsResponse> => {
  const queryParams = new URLSearchParams();

  if (params?.page !== undefined) queryParams.append('page', params.page.toString());
  if (params?.size !== undefined) queryParams.append('size', params.size.toString());
  if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params?.sortDir) queryParams.append('sortDir', params.sortDir);

  const queryString = queryParams.toString();
  const url = queryString ? `/posts/user/${userId}?${queryString}` : `/posts/user/${userId}`;

  return await api.get(url);
};

/**
 * Get trending posts
 */
export const getTrendingPosts = async (params?: PostQueryParams): Promise<PostsResponse> => {
  const queryParams = new URLSearchParams();

  if (params?.page !== undefined) queryParams.append('page', params.page.toString());
  if (params?.size !== undefined) queryParams.append('size', params.size.toString());
  if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params?.sortDir) queryParams.append('sortDir', params.sortDir);

  const queryString = queryParams.toString();
  const url = queryString ? `/posts/trending?${queryString}` : '/posts/trending';

  return await api.get(url);
};

/**
 * Search posts by content
 */
export const searchPosts = async (query: string, params?: PostQueryParams): Promise<PostsResponse> => {
  const queryParams = new URLSearchParams();
  queryParams.append('q', query);

  if (params?.page !== undefined) queryParams.append('page', params.page.toString());
  if (params?.size !== undefined) queryParams.append('size', params.size.toString());
  if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params?.sortDir) queryParams.append('sortDir', params.sortDir);

  return await api.get(`/posts/search?${queryParams.toString()}`);
};

/**
 * Helper function to format file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Helper function to format date
 */
export const formatPostDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Vừa xong';
  if (minutes < 60) return `${minutes} phút trước`;
  if (hours < 24) return `${hours} giờ trước`;
  if (days < 7) return `${days} ngày trước`;

  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Helper function to get privacy label
 */
export const getPrivacyLabel = (privacy: string): string => {
  switch (privacy) {
    case 'PUBLIC':
      return 'Công khai';
    case 'PRIVATE':
      return 'Riêng tư';
    case 'FRIENDS_ONLY':
      return 'Chỉ bạn bè';
    default:
      return privacy;
  }
};

/**
 * Helper function to get privacy color
 */
export const getPrivacyColor = (privacy: string): string => {
  switch (privacy) {
    case 'PUBLIC':
      return 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300';
    case 'PRIVATE':
      return 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300';
    case 'FRIENDS_ONLY':
      return 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300';
    default:
      return 'border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300';
  }
};
