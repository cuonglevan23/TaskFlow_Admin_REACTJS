// Các hàm tiện ích và constants dùng chung trong app

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// ==================== UTILITY FUNCTIONS ====================

/**
 * Merge Tailwind CSS classes với clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Sleep function - delay execution
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// ==================== AI TAGS UTILITIES ====================

export interface AITagConfig {
  color: string;
  backgroundColor: string;
  borderColor: string;
  priority: number;
  description: string;
}

/**
 * AI Tags Classification with styling configuration
 */
export const AI_TAG_CONFIGS: Record<string, AITagConfig> = {
  // High priority tags
  'POTENTIAL_CUSTOMER': {
    color: 'text-green-700',
    backgroundColor: 'bg-green-50',
    borderColor: 'border-green-200',
    priority: 1,
    description: 'Khách hàng tiềm năng'
  },
  'COMPLAINT': {
    color: 'text-red-700',
    backgroundColor: 'bg-red-50',
    borderColor: 'border-red-200',
    priority: 1,
    description: 'Khiếu nại, phản hồi tiêu cực'
  },
  'SPAM': {
    color: 'text-gray-700',
    backgroundColor: 'bg-gray-50',
    borderColor: 'border-gray-300',
    priority: 1,
    description: 'Tin rác, nội dung độc hại'
  },
  
  // Medium priority tags
  'SUPPORT_REQUEST': {
    color: 'text-blue-700',
    backgroundColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    priority: 2,
    description: 'Yêu cầu hỗ trợ kỹ thuật'
  },
  'TASK_COMMAND': {
    color: 'text-purple-700',
    backgroundColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    priority: 2,
    description: 'Tạo/cập nhật/xóa task'
  },
  'MISSING_INFO': {
    color: 'text-orange-700',
    backgroundColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    priority: 2,
    description: 'Thiếu thông tin, cần hỏi thêm'
  },
  
  // Low priority tags
  'SMALLTALK': {
    color: 'text-cyan-700',
    backgroundColor: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
    priority: 3,
    description: 'Chào hỏi, trò chuyện phiếm'
  },
  
  // Technical tags
  'TECHNICAL': {
    color: 'text-indigo-700',
    backgroundColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    priority: 2,
    description: 'Vấn đề kỹ thuật'
  },
  'ACCOUNT_ISSUE': {
    color: 'text-yellow-700',
    backgroundColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    priority: 2,
    description: 'Vấn đề tài khoản'
  }
};

/**
 * Get styling configuration for an AI tag
 */
export function getAITagConfig(tag: string): AITagConfig {
  return AI_TAG_CONFIGS[tag] || {
    color: 'text-gray-600',
    backgroundColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    priority: 3,
    description: tag
  };
}

/**
 * Get full CSS class string for an AI tag
 */
export function getAITagClasses(tag: string): string {
  const config = getAITagConfig(tag);
  return `${config.color} ${config.backgroundColor} ${config.borderColor} border text-xs px-2 py-1 rounded-md font-medium`;
}

/**
 * Sort AI tags by priority and return top N tags
 */
export function getTopAITags(tags: string[], maxTags: number = 3): string[] {
  return tags
    .sort((a, b) => {
      const configA = getAITagConfig(a);
      const configB = getAITagConfig(b);
      return configA.priority - configB.priority;
    })
    .slice(0, maxTags);
}

/**
 * Get display text for AI tag (convert from ENUM to readable text)
 */
export function getAITagDisplayText(tag: string): string {
  const config = getAITagConfig(tag);
  return config.description;
}

/**
 * Debounce function - delay function execution
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function - limit function execution frequency
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// ==================== DATE & TIME HELPERS ====================

/**
 * Format date theo định dạng Việt Nam
 */
export const formatDate = (date: Date | string | number, format: 'short' | 'long' | 'full' = 'short'): string => {
  const d = new Date(date);

  if (isNaN(d.getTime())) {
    return 'Invalid Date';
  }

  let options: Intl.DateTimeFormatOptions;

  switch (format) {
    case 'short':
      options = { day: '2-digit', month: '2-digit', year: 'numeric' };
      break;
    case 'long':
      options = { day: '2-digit', month: 'long', year: 'numeric' };
      break;
    case 'full':
      options = { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' };
      break;
    default:
      options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  }

  return d.toLocaleDateString('vi-VN', options);
};

/**
 * Format time
 */
export const formatTime = (date: Date | string | number, includeSeconds: boolean = false): string => {
  const d = new Date(date);

  if (isNaN(d.getTime())) {
    return 'Invalid Time';
  }

  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    ...(includeSeconds && { second: '2-digit' }),
    hour12: false
  };

  return d.toLocaleTimeString('vi-VN', options);
};

/**
 * Format datetime
 */
export const formatDateTime = (date: Date | string | number): string => {
  return `${formatDate(date)} ${formatTime(date)}`;
};

/**
 * Tính khoảng cách thời gian (time ago)
 */
export const timeAgo = (date: Date | string | number): string => {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (minutes < 1) return 'Vừa xong';
  if (minutes < 60) return `${minutes} phút trước`;
  if (hours < 24) return `${hours} giờ trước`;
  if (days < 7) return `${days} ngày trước`;
  if (weeks < 4) return `${weeks} tuần trước`;
  if (months < 12) return `${months} tháng trước`;
  return `${years} năm trước`;
};

// ==================== STRING HELPERS ====================

/**
 * Capitalize first letter
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Convert to title case
 */
export const toTitleCase = (str: string): string => {
  return str.replace(/\w\S*/g, (txt) =>
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

/**
 * Generate random string
 */
export const generateRandomString = (length: number = 8): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Truncate text
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

/**
 * Remove Vietnamese accents
 */
export const removeVietnameseAccents = (str: string): string => {
  const accents = 'àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ';
  const nonAccents = 'aaaaaâaaaaaăaaaaaeeeeeêeeeeeiiiiioooooôooooơoooooưuuuuưuuuuuyyyyyđ';

  return str.split('').map(char => {
    const index = accents.indexOf(char.toLowerCase());
    if (index !== -1) {
      return char === char.toLowerCase() ? nonAccents[index] : nonAccents[index].toUpperCase();
    }
    return char;
  }).join('');
};

// ==================== NUMBER HELPERS ====================

/**
 * Format number with Vietnamese locale
 */
export const formatNumber = (num: number, decimals: number = 0): string => {
  return num.toLocaleString('vi-VN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

/**
 * Format currency VND
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

/**
 * Format file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// ==================== VALIDATION HELPERS ====================

/**
 * Validate email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (Vietnam)
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;
  return phoneRegex.test(phone);
};

/**
 * Validate strong password
 */
export const isStrongPassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return strongPasswordRegex.test(password);
};

/**
 * Validate URL
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// ==================== ARRAY HELPERS ====================

/**
 * Remove duplicates from array
 */
export const removeDuplicates = <T>(arr: T[]): T[] => {
  return [...new Set(arr)];
};

/**
 * Group array by key
 */
export const groupBy = <T, K extends keyof T>(arr: T[], key: K): Record<string, T[]> => {
  return arr.reduce((groups, item) => {
    const groupKey = String(item[key]);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
};

/**
 * Shuffle array
 */
export const shuffleArray = <T>(arr: T[]): T[] => {
  const newArr = [...arr];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

// ==================== OBJECT HELPERS ====================

/**
 * Deep clone object
 */
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Check if object is empty
 */
export const isEmpty = (obj: any): boolean => {
  if (obj === null || obj === undefined) return true;
  if (Array.isArray(obj)) return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  if (typeof obj === 'string') return obj.trim().length === 0;
  return false;
};

// ==================== LOCAL STORAGE HELPERS ====================

/**
 * Safe localStorage get
 */
export const getFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

/**
 * Safe localStorage set
 */
export const setToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

/**
 * Remove from localStorage
 */
export const removeFromStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

// ==================== CONSTANTS ====================

export const CONSTANTS = {
  // API endpoints
  API_ENDPOINTS: {
    AUTH: '/auth',
    USERS: '/users',
    PRODUCTS: '/products',
    ORDERS: '/orders',
    DASHBOARD: '/dashboard',
  },

  // Local storage keys
  STORAGE_KEYS: {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    USER: 'user',
    THEME: 'theme',
    LANGUAGE: 'language',
  },

  // Common status codes
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
  },

  // Pagination
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
  },

  // File upload
  FILE_UPLOAD: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  },
} as const;

// Export types
export type ThemeType = 'light' | 'dark' | 'system';
export type LanguageType = 'vi' | 'en';

// ==================== USER HELPER FUNCTIONS ====================

/**
 * Format user last login time
 */
export function formatUserLastLogin(lastLoginAt: string | null): string {
  if (!lastLoginAt) return 'Never logged in';
  
  const lastLogin = new Date(lastLoginAt);
  const now = new Date();
  const diffInMs = now.getTime() - lastLogin.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) {
    return 'Today';
  } else if (diffInDays === 1) {
    return 'Yesterday';
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else {
    return lastLogin.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    });
  }
}

/**
 * Get user status color classes
 */
export function getUserStatusColor(status: string): string {
  switch (status) {
    case 'ACTIVE':
      return 'text-green-600 border-green-200 bg-green-50';
    case 'INACTIVE':
      return 'text-gray-600 border-gray-200 bg-gray-50';
    case 'SUSPENDED':
      return 'text-red-600 border-red-200 bg-red-50';
    default:
      return 'text-gray-600 border-gray-200 bg-gray-50';
  }
}

/**
 * Get role badge color classes
 */
export function getRoleBadgeColor(role: string): string {
  switch (role) {
    case 'ADMIN':
      return 'text-purple-600 border-purple-200 bg-purple-50';
    case 'MEMBER':
    case 'USER':
      return 'text-blue-600 border-blue-200 bg-blue-50';
    default:
      return 'text-gray-600 border-gray-200 bg-gray-50';
  }
}
