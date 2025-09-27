// AI Tags Utilities - Helper functions for AI tag styling and management

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
 * Get sentiment color and styling
 */
export function getSentimentDisplay(sentiment?: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL') {
  switch (sentiment) {
    case 'POSITIVE':
      return {
        color: 'text-green-600',
        backgroundColor: 'bg-green-50',
        icon: '😊',
        text: 'Tích cực'
      };
    case 'NEGATIVE':
      return {
        color: 'text-red-600',
        backgroundColor: 'bg-red-50',
        icon: '😟',
        text: 'Tiêu cực'
      };
    case 'NEUTRAL':
      return {
        color: 'text-gray-600',
        backgroundColor: 'bg-gray-50',
        icon: '😐',
        text: 'Trung tính'
      };
    default:
      return null;
  }
}