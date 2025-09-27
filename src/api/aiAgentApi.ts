// AI Agent API functions - Admin endpoints for chat management
import api from './axios.customize';
import type { 
  AuditLogsParams,
  AuditLogsResponse,
  ConversationsResponse,
  UserMessagesResponse,
  ActiveSessionsResponse,
  AIUserStatus,
  AuditStatistics,
  TakeoverRequest,
  SendMessageRequest,
  ChatMessage,
  Conversation,
  ConversationContentAnalysis
} from '../types/ai-agent.types';

// ==================== AUDIT & MONITORING APIs ====================

/**
 * Get all chat messages (audit logs) for admin
 * GET /ai-agent/admin/audit/logs
 */
export const getAuditLogs = async (params?: AuditLogsParams): Promise<AuditLogsResponse> => {
  try {
    const response: any = await api.get('/ai-agent/admin/audit/logs', { params });
    return response;
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return {
      messages: [],
      totalElements: 0,
      totalPages: 0,
      currentPage: 0,
      pageSize: params?.size || 50,
      hasNext: false,
      hasPrevious: false
    };
  }
};

/**
 * Get audit statistics
 * GET /ai-agent/admin/audit/statistics
 */
export const getAuditStatistics = async (startDate?: string, endDate?: string): Promise<AuditStatistics> => {
  try {
    const params = { startDate, endDate };
    const response: any = await api.get('/ai-agent/admin/audit/statistics', { params });
    return response;
  } catch (error) {
    console.error('Error fetching audit statistics:', error);
    return {
      totalMessages: 0,
      totalUsers: 0,
      totalSessions: 0,
      activeSessions: 0,
      adminTakeoverSessions: 0,
      averageMessagesPerSession: 0,
      topUsers: [],
      timeRangeStats: {
        startDate: startDate || '',
        endDate: endDate || '',
        messagesPerDay: []
      }
    };
  }
};

export const getConversations = async (
  page: number = 0,
  size: number = 20,
  filters?: any
): Promise<ConversationsResponse> => {
  try {
    console.log('🚀 Calling conversations API: /ai-agent/admin/conversations');
    console.log('🔍 Request params:', { page, size, filters });

    // Call the backend endpoint
    const data = await api.get('/ai-agent/admin/conversations');
    console.log('📡 Raw response from backend:', data);
    console.log('📦 Data type:', typeof data);
    console.log('📦 Is array?', Array.isArray(data));
    
    // The backend returns List<ConversationDto> directly
    if (Array.isArray(data)) {
      console.log('🔄 Processing conversation list from backend, count:', data.length);

      // Use actual backend data only
      const conversationsData = data;

      if (conversationsData.length > 0) {
        console.log('📋 Sample conversation structure:', conversationsData[0]);
        console.log('📋 Sample conversation keys:', Object.keys(conversationsData[0] || {}));
      }

      // Map the conversations to match frontend interface
      const conversations = conversationsData.map((conv: any, index: number) => {
        console.log(`🔄 Processing conversation ${index + 1}:`, conv);

        return {
          // Map backend fields to frontend interface
          conversationId: conv.conversationId || `conv-${index}`,
          sessionId: conv.sessionId || conv.conversationId || `session-${index}`,
          title: conv.title || `Conversation with ${conv.userEmail || 'Unknown'}`,
          status: conv.status || 'ACTIVE',
          userId: conv.userId || 0,
          userEmail: conv.userEmail || 'unknown@example.com',
          userName: conv.userEmail ? conv.userEmail.split('@')[0] : 'Unknown User',

          // Required fields with defaults
          agentActive: conv.agentActive !== undefined ? conv.agentActive : true,
          aiPersonality: conv.aiPersonality || 'helpful',
          language: conv.language || 'vi',
          supervisorId: conv.supervisorId || null,
          supervisorEmail: conv.supervisorEmail || null,
          takenOverAt: conv.takenOverAt || null,
          messageCount: conv.messageCount || 0,
          createdAt: conv.createdAt || new Date().toISOString(),
          startTime: conv.createdAt || conv.startTime || new Date().toISOString(),
          updatedAt: conv.updatedAt || new Date().toISOString(),
          lastActivity: conv.lastActivity || conv.updatedAt || new Date().toISOString(),
          satisfactionScore: conv.satisfactionScore || 0,
          tags: conv.tags || [],
          category: conv.category || 'GENERAL' as const,

          // Optional AI analysis fields
          aiTags: conv.aiTags || undefined,
          aiSummary: conv.aiSummary || undefined,
          sentiment: conv.sentiment || undefined,
          sentimentScore: conv.sentimentScore || undefined,
          toxicityDetected: conv.toxicityDetected || undefined,
          toxicityScore: conv.toxicityScore || undefined,
          analysisTimestamp: conv.analysisTimestamp || undefined
        };
      });

      console.log(`✅ Successfully mapped ${conversations.length} conversations`);
      console.log('📋 First mapped conversation:', conversations[0]);

      // Apply client-side filtering if needed
      let filteredConversations = conversations;
      if (filters) {
        console.log('🔍 Applying filters:', filters);
        filteredConversations = conversations.filter(conv => {
          if (filters.status && conv.status !== filters.status) return false;
          if (filters.userEmail && !conv.userEmail.toLowerCase().includes(filters.userEmail.toLowerCase())) return false;
          if (filters.startDate && new Date(conv.createdAt) < new Date(filters.startDate)) return false;
          if (filters.endDate && new Date(conv.createdAt) > new Date(filters.endDate)) return false;
          return true;
        });
        console.log(`🔍 Filtered to ${filteredConversations.length} conversations`);
      }

      // Apply client-side pagination
      const startIndex = page * size;
      const endIndex = startIndex + size;
      const paginatedConversations = filteredConversations.slice(startIndex, endIndex);

      console.log(`📄 Pagination: showing ${startIndex}-${endIndex} of ${filteredConversations.length} conversations`);

      return {
        conversations: paginatedConversations,
        totalElements: filteredConversations.length,
        totalPages: Math.ceil(filteredConversations.length / size),
        currentPage: page,
        pageSize: size,
        hasNext: endIndex < filteredConversations.length,
        hasPrevious: page > 0
      };
    }
    
    // If response is not an array, log the structure
    console.warn('⚠️ Response is not an array. Response structure:', data);
    console.warn('⚠️ Response keys:', data ? Object.keys(data) : 'null/undefined');

    // Check if it's a paginated response object
    if (data && typeof data === 'object' && 'conversations' in data) {
      console.log('📄 Detected paginated response format');
      return data as any;
    }

    // Fallback: return empty response
    console.warn('⚠️ Unexpected response format, returning empty result');
    return {
      conversations: [],
      totalElements: 0,
      totalPages: 0,
      currentPage: page,
      pageSize: size,
      hasNext: false,
      hasPrevious: false
    };
  } catch (error: any) {
    console.error('❌ API Error in getConversations:', error);
    console.error('- Error message:', error.message);
    console.error('- Error status:', error.response?.status);
    console.error('- Error status text:', error.response?.statusText);
    console.error('- Error response data:', error.response?.data);
    console.error('- Request config:', error.config);

    // Return empty result on error
    return {
      conversations: [],
      totalElements: 0,
      totalPages: 0,
      currentPage: page,
      pageSize: size,
      hasNext: false,
      hasPrevious: false
    };
  }
};

/**
 * Get all conversations without pagination (for admin use)
 * GET /ai-agent/admin/conversations
 */
export const getAllConversations = async (): Promise<Conversation[]> => {
  try {
    console.log('🚀 Calling getAllConversations API: /ai-agent/admin/conversations');

    const data = await api.get('/ai-agent/admin/conversations');
    console.log('📡 Received all conversations data:', data);

    if (Array.isArray(data)) {
      const conversations = data.map(conv => ({
        ...conv,
        userName: conv.userEmail ? conv.userEmail.split('@')[0] : 'Unknown User',
        conversationId: conv.conversationId || conv.id,
        sessionId: conv.sessionId || conv.conversationId || conv.id,
        title: conv.title || `Conversation with ${conv.userEmail}`,
        startTime: conv.createdAt || conv.startTime,
        tags: conv.tags || [],
        category: conv.category || 'GENERAL'
      }));

      console.log(`✅ Successfully processed ${conversations.length} conversations`);
      return conversations;
    }

    console.warn('⚠️ Unexpected response format');
    return [];
  } catch (error: any) {
    console.error('❌ API Error in getAllConversations:', error);
    throw error;
  }
};

/**
 * Get messages of a specific user (legacy)
 * GET /ai-agent/admin/users/{userId}/messages
 */
export const getUserMessages = async (userId: number, page = 0, size = 50): Promise<UserMessagesResponse> => {
  try {
    console.log('🔍 Loading messages for userId:', userId);
    const params = { page, size };
    const data = await api.get(`/ai-agent/admin/users/${userId}/messages`, { params });
    console.log('📨 Messages data from axios interceptor:', data);
    console.log('📨 Data type:', typeof data);
    console.log('📨 Is array?', Array.isArray(data));
    
    // Axios interceptor đã trả về response.data
    if (Array.isArray(data)) {

      return {
        messages: data,
        totalElements: data.length,
        conversation: {
          sessionId: '',
          startTime: '',
          lastActivity: '',
          messageCount: data.length
        }
      };
    }
    
  
    return data as unknown as UserMessagesResponse;
  } catch (error) {
    console.error(`Error fetching messages for user ${userId}:`, error);
    return {
      messages: [],
      totalElements: 0,
      conversation: {
        sessionId: '',
        startTime: '',
        lastActivity: '',
        messageCount: 0
      }
    };
  }
};

/**
 * Get active chat sessions
 * GET /ai-agent/admin/active-sessions
 */
export const getActiveSessions = async (): Promise<ActiveSessionsResponse> => {
  try {
    const response: any = await api.get('/ai-agent/admin/active-sessions');
    return response;
  } catch (error) {
    console.error('Error fetching active sessions:', error);
    return {
      sessions: [],
      totalActive: 0,
      needsIntervention: 0
    };
  }
};

/**
 * Check if a user needs intervention
 * GET /ai-agent/admin/users/{userId}/status
 */
export const getUserStatus = async (userId: number): Promise<AIUserStatus> => {
  try {
    const response: any = await api.get(`/ai-agent/admin/users/${userId}/status`);
    return response;
  } catch (error) {
    console.error(`Error fetching status for user ${userId}:`, error);
    return {
      userId,
      userName: 'Unknown',
      userEmail: 'unknown@email.com',
      isActive: false,
      needsIntervention: false,
      lastActivity: '',
      messageCount: 0
    };
  }
};

// ==================== ADMIN CONTROL APIs ====================

/**
 * Take control of a user's chat session
 * POST /ai-agent/admin/takeover/{userId}
 */
export const takeoverUserSession = async (userId: number, request?: TakeoverRequest): Promise<boolean> => {
  try {
    await api.post(`/ai-agent/admin/takeover/${userId}`, request);
    return true;
  } catch (error) {
    console.error(`Error taking over session for user ${userId}:`, error);
    throw error;
  }
};

/**
 * Return control back to AI
 * POST /ai-agent/admin/return/{userId}
 */
export const returnControlToAI = async (userId: number): Promise<boolean> => {
  try {
    await api.post(`/ai-agent/admin/return/${userId}`);
    return true;
  } catch (error) {
    console.error(`Error returning control for user ${userId}:`, error);
    throw error;
  }
};

/**
 * Send message as admin (when in takeover mode)
 * POST /ai-agent/admin/users/{userId}/messages
 */
export const sendAdminMessage = async (userId: number, request: SendMessageRequest): Promise<ChatMessage> => {
  try {
    const response: any = await api.post(`/ai-agent/admin/users/${userId}/messages`, request);
    return response;
  } catch (error) {
    console.error(`Error sending admin message to user ${userId}:`, error);
    throw error;
  }
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Format message timestamp
 */
export const formatMessageTime = (timestamp: string): string => {
  return new Date(timestamp).toLocaleString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

/**
 * Calculate time since last activity
 */
export const getTimeSinceActivity = (timestamp: string): string => {
  const now = new Date();
  const lastActivity = new Date(timestamp);
  const diffInMs = now.getTime() - lastActivity.getTime();
  
  const minutes = Math.floor(diffInMs / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days} days ago`;
  if (hours > 0) return `${hours} hours ago`;
  if (minutes > 0) return `${minutes} minutes ago`;
  return 'Just now';
};

/**
 * Get status color for conversation
 */
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'ACTIVE': return 'text-green-600';
    case 'ADMIN_CONTROLLED': return 'text-blue-600';
    case 'INACTIVE': return 'text-gray-500';
    default: return 'text-gray-500';
  }
};

/**
 * Get status badge variant
 */
export const getStatusBadgeVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (status) {
    case 'ACTIVE': return 'default';
    case 'ADMIN_CONTROLLED': return 'secondary';
    case 'INACTIVE': return 'outline';
    default: return 'outline';
  }
};


// ==================== CONVERSATION ANALYSIS APIs ====================

/**
 * Get existing conversation analysis (does not create new analysis)
 * GET /api/ai-agent/admin/chat/analysis/{conversationId}
 * Returns 404 if no analysis exists yet
 */
export const getExistingConversationAnalysis = async (
  conversationId: string
): Promise<ConversationContentAnalysis | null> => {
  try {
    console.log('🔍 Getting existing analysis for conversationId:', conversationId);

    const response: any = await api.get(`/ai-agent/admin/chat/analysis/${conversationId}`);
    console.log('✅ Found existing analysis:', response);
    return response;
  } catch (error: any) {
    if (error.response?.status === 404) {
      console.log('ℹ️ No existing analysis found for conversation:', conversationId);
      return null;
    }
    console.error('❌ Error fetching existing analysis:', error);
    throw error;
  }
};

/**
 * Create new or update conversation analysis (always calls Gemini API)
 * PUT /api/ai-agent/admin/chat/analysis/{conversationId}
 * Always generates fresh analysis by calling Gemini API
 */
export const createConversationAnalysis = async (
  conversationId: string,
  options?: {
    userId?: number;
    startDate?: string;
    endDate?: string;
    includeSystemMessages?: boolean;
    maxMessages?: number;
  }
): Promise<ConversationContentAnalysis> => {
  try {
    console.log('🔄 Creating new analysis for conversationId:', conversationId);
    console.log('🔄 Analysis options:', options);

    const params: any = {};
    if (options?.userId) params.userId = options.userId;
    if (options?.startDate) params.startDate = options.startDate;
    if (options?.endDate) params.endDate = options.endDate;
    if (options?.includeSystemMessages !== undefined) params.includeSystemMessages = options.includeSystemMessages;
    if (options?.maxMessages) params.maxMessages = options.maxMessages;

    console.log('🔄 Request params:', params);

    const response: any = await api.put(`/ai-agent/admin/chat/analysis/${conversationId}`, {}, {
      params
    });
    console.log('✅ Successfully created new analysis:', response);
    return response;
  } catch (error: any) {
    console.error('❌ Error creating conversation analysis:', error);
    console.error('❌ Error details:', {
      conversationId,
      options,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
    throw error;
  }
};

/**
 * @deprecated Use getExistingConversationAnalysis() and createConversationAnalysis() instead
 * Legacy function for backward compatibility
 */
export const analyzeConversationContent = async (
  conversationId: string,
  options?: {
    userId?: number;
    startDate?: string;
    endDate?: string;
    includeSystemMessages?: boolean;
    maxMessages?: number;
    forceRefresh?: boolean;
  }
): Promise<ConversationContentAnalysis> => {
  console.warn('⚠️ analyzeConversationContent is deprecated. Use getExistingConversationAnalysis() or createConversationAnalysis() instead.');

  if (options?.forceRefresh) {
    return createConversationAnalysis(conversationId, options);
  } else {
    const existing = await getExistingConversationAnalysis(conversationId);
    if (existing) {
      return existing;
    }
    // If no existing analysis and not forcing refresh, still create one
    return createConversationAnalysis(conversationId, options);
  }
};

/**
 * Get Vietnamese description for conversation category
 */
export const getCategoryDescription = (category: string): string => {
  const categoryMap: Record<string, string> = {
    'POTENTIAL_CUSTOMER': 'Khách hàng tiềm năng',
    'COMPLAINT': 'Khiếu nại',
    'SUPPORT_REQUEST': 'Yêu cầu hỗ trợ',
    'SMALLTALK': 'Chuyện phiếm',
    'TASK_COMMAND': 'Tạo/cập nhật/xóa task',
    'MISSING_INFO': 'Thiếu dữ liệu cần hỏi thêm',
    'SPAM': 'Spam'
  };
  
  return categoryMap[category] || category;
};

/**
 * Get category use case description
 */
export const getCategoryUseCase = (category: string): string => {
  const useCaseMap: Record<string, string> = {
    'POTENTIAL_CUSTOMER': 'Cuộc hội thoại với khách hàng quan tâm đến sản phẩm',
    'COMPLAINT': 'Khách hàng phàn nàn hoặc không hài lòng',
    'SUPPORT_REQUEST': 'Người dùng cần hỗ trợ kỹ thuật hoặc hướng dẫn',
    'SMALLTALK': 'Trò chuyện thông thường, không có mục đích cụ thể',
    'TASK_COMMAND': 'Lệnh liên quan đến quản lý công việc',
    'MISSING_INFO': 'AI cần thêm thông tin từ người dùng',
    'SPAM': 'Tin nhắn rác hoặc không phù hợp'
  };
  
  return useCaseMap[category] || category;
};

/**
 * Get color for category badge
 */
export const getCategoryColor = (category: string): string => {
  const colorMap: Record<string, string> = {
    'POTENTIAL_CUSTOMER': 'text-green-600 bg-green-50',
    'COMPLAINT': 'text-red-600 bg-red-50',
    'SUPPORT_REQUEST': 'text-blue-600 bg-blue-50',
    'SMALLTALK': 'text-gray-600 bg-gray-50',
    'TASK_COMMAND': 'text-purple-600 bg-purple-50',
    'MISSING_INFO': 'text-orange-600 bg-orange-50',
    'SPAM': 'text-red-800 bg-red-100'
  };
  
  return colorMap[category] || 'text-gray-600 bg-gray-50';
};

/**
 * Get detailed messages of a conversation by conversationId
 * GET /ai-agent/admin/chat/messages/{conversationId}
 */
export const getConversationMessages = async (conversationId: string): Promise<ChatMessage[]> => {
  try {
    console.log('🔍 Loading messages for conversationId:', conversationId);

    const data = await api.get(`/ai-agent/admin/chat/messages/${conversationId}`);
    console.log('📨 Conversation messages data from backend:', data);
    console.log('📨 Data type:', typeof data);
    console.log('📨 Is array?', Array.isArray(data));

    if (Array.isArray(data)) {
      // Map backend message structure to frontend ChatMessage interface
      const messages = data.map((msg: any) => {
        console.log('🔄 Processing message:', msg);

        return {
          messageId: msg.messageId || msg.id || '',
          content: msg.content || '',
          senderType: msg.senderType || 'AGENT', // USER|AGENT|SUPERVISOR|SYSTEM
          timestamp: msg.timestamp || new Date().toISOString(),
          conversationId: msg.conversationId || conversationId,
          success: msg.success !== undefined ? msg.success : true,
          status: msg.status || 'PROCESSED',
          toolCalled: msg.toolCalled !== undefined ? msg.toolCalled : false,

          // Optional AI-specific fields
          aiModel: msg.aiModel || null,
          confidence: msg.confidence || null,
          intent: msg.intent || null,
          context: msg.context || null,

          // Additional metadata
          agentActive: msg.agentActive !== undefined ? msg.agentActive : true,
          supervisorId: msg.supervisorId || null,
          qualityAssessment: msg.qualityAssessment || null,
          adminEscalated: msg.adminEscalated !== undefined ? msg.adminEscalated : false,
          escalationReason: msg.escalationReason || null,
          toolsUsed: msg.toolsUsed || null,
          toolResults: msg.toolResults || null,
          errorMessage: msg.errorMessage || null,
          tags: msg.tags || [],

          // Legacy compatibility fields
          id: msg.messageId || msg.id,
          sessionId: conversationId,
          userId: msg.userId || 0,
          userName: msg.userName || '',
          userEmail: msg.userEmail || '',
          message: msg.content || '',
          response: msg.senderType === 'AGENT' ? msg.content : '',
          messageType: (msg.senderType === 'USER' ? 'USER' :
                       msg.senderType === 'SUPERVISOR' ? 'ADMIN' : 'AI') as 'USER' | 'ADMIN' | 'AI',
          isAdminTakeover: msg.senderType === 'SUPERVISOR',
          adminId: msg.supervisorId ? parseInt(msg.supervisorId) : undefined,
          adminName: msg.supervisorName || '',
          metadata: {
            aiModel: msg.aiModel,
            confidence: msg.confidence,
            intent: msg.intent,
            qualityAssessment: msg.qualityAssessment,
            toolCalled: msg.toolCalled,
            toolsUsed: msg.toolsUsed
          }
        };
      });

      console.log(`✅ Successfully processed ${messages.length} messages`);
      console.log('📋 First message sample:', messages[0]);

      return messages;
    }

    console.warn('⚠️ Response is not an array, returning empty array');
    return [];
  } catch (error: any) {
    console.error(`❌ Error fetching messages for conversation ${conversationId}:`, error);
    console.error('- Error message:', error.message);
    console.error('- Error status:', error.response?.status);
    console.error('- Error response data:', error.response?.data);

    // Return empty array on error
    return [];
  }
};
