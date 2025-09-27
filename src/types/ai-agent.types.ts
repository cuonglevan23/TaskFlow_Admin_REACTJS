// AI Agent Types - Interface định nghĩa cho AI Agent Chat System

export interface ChatMessage {
  messageId: string;
  content: string;
  senderType: 'USER' | 'AGENT' | 'SUPERVISOR';
  timestamp: string;
  conversationId: string;
  aiModel?: string | null;
  confidence?: number | null;
  intent?: string | null;
  context?: string | null;
  success: boolean;
  status: string;
  toolCalled: boolean;
  
  // Legacy fields for backward compatibility
  id?: string;
  sessionId?: string;
  userId?: number;
  userName?: string;
  userEmail?: string;
  message?: string;
  response?: string;
  messageType?: 'USER' | 'AI' | 'ADMIN';
  isAdminTakeover?: boolean;
  adminId?: number;
  adminName?: string;
  metadata?: Record<string, any>;
}

export interface Conversation {
  conversationId: string;
  sessionId?: string; // Add sessionId field
  title: string;
  status: 'ACTIVE' | 'TAKEOVER' | 'COMPLETED' | 'CANCELLED' | 'ADMIN_CONTROLLED' | 'INACTIVE';
  userId: number;
  userEmail: string;
  userName?: string; // Derived from email for display
  agentActive: boolean;
  aiPersonality: string;
  language: string;
  supervisorId: string | null;
  supervisorEmail: string | null;
  takenOverAt: string | null;
  messageCount: number;
  createdAt: string;
  startTime?: string; // Add startTime field
  updatedAt: string;
  lastActivity: string;
  satisfactionScore: number;
  tags: string[];
  category: 'SUPPORT' | 'GENERAL' | 'ESCALATION';
  
  // ======================== AI ANALYSIS FIELDS ========================
  aiTags?: string[];
  aiSummary?: string;
  sentiment?: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  sentimentScore?: number;
  toxicityDetected?: boolean;
  toxicityScore?: number;
  analysisTimestamp?: string;
}

export interface ActiveSession {
  id: string;
  userId: number;
  userName: string;
  userEmail: string;
  sessionId: string;
  startTime: string;
  lastActivity: string;
  messageCount: number;
  isAdminTakeover: boolean;
  adminId?: number;
  status: 'ACTIVE' | 'NEEDS_INTERVENTION';
}

export interface AIUserStatus {
  userId: number;
  userName: string;
  userEmail: string;
  isActive: boolean;
  needsIntervention: boolean;
  lastActivity: string;
  messageCount: number;
}

export interface AuditStatistics {
  totalMessages: number;
  totalUsers: number;
  totalSessions: number;
  activeSessions: number;
  adminTakeoverSessions: number;
  averageMessagesPerSession: number;
  topUsers: Array<{
    userId: number;
    userName: string;
    messageCount: number;
  }>;
  timeRangeStats: {
    startDate: string;
    endDate: string;
    messagesPerDay: Array<{
      date: string;
      count: number;
    }>;
  };
}

// API Request/Response Types
export interface AuditLogsParams {
  page?: number;
  size?: number;
  userId?: number;
  sessionId?: string;
  startDate?: string;
  endDate?: string;
}

export interface AuditLogsResponse {
  messages: ChatMessage[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ConversationsResponse {
  conversations: Conversation[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface UserMessagesResponse {
  messages: ChatMessage[];
  totalElements: number;
  conversation: {
    sessionId: string;
    startTime: string;
    lastActivity: string;
    messageCount: number;
  };
}

export interface ActiveSessionsResponse {
  sessions: ActiveSession[];
  totalActive: number;
  needsIntervention: number;
}

export interface TakeoverRequest {
  adminMessage?: string;
  reason?: string;
}

export interface SendMessageRequest {
  message: string;
  messageType: 'ADMIN';
  metadata?: Record<string, any>;
}

// Filter and Search Types
export interface ConversationFilters {
  userId?: number;
  startDate?: string;
  endDate?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'ADMIN_CONTROLLED';
  isAdminTakeover?: boolean;
  search?: string;
}

export interface MessageFilters {
  messageType?: 'USER' | 'AI' | 'ADMIN';
  startDate?: string;
  endDate?: string;
  search?: string;
}

// ==================== AI ANALYSIS TYPES ====================

// API Response type - matches backend ConversationSummary exactly
export interface ConversationSummary {
  tags: string[];
  sentiment: string;
}

// Extended type for frontend with additional optional fields
export interface ConversationAnalysis {
  conversationId: string;
  userId: number;
  userEmail: string;
  summary: string;
  tags: string[];
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  sentimentScore: number; // 0-1 scale
  toxicityDetected: boolean;
  toxicityScore: number; // 0-1 scale
  toxicKeywords: string[];
  actionItems: string[];
  recommendations: string;
  analysisTimestamp: string;
  metadata?: {
    messageCount?: number;
    duration?: number;
    topicsDiscussed?: string[];
    resolutionStatus?: 'RESOLVED' | 'PENDING' | 'ESCALATED';
    userSatisfaction?: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN';
  };
}

export interface BatchAnalysisResponse {
  totalRequested: number;
  totalSuccessful: number;
  totalFailed: number;
  analyses: ConversationAnalysis[];
  failedAnalyses: {
    conversationId: string;
    error: string;
    reason: string;
  }[];
  batchId: string;
  processingTime: number; // milliseconds
  timestamp: string;
}

export interface AnalysisStatistics {
  overview: {
    totalConversationsAnalyzed: number;
    averageSentimentScore: number;
    toxicityDetectionRate: number;
    commonTags: string[];
    timeRange: {
      startDate: string;
      endDate: string;
      days: number;
    };
  };
  sentimentBreakdown: {
    positive: number;
    negative: number;
    neutral: number;
  };
  toxicityStats: {
    cleanConversations: number;
    flaggedConversations: number;
    averageToxicityScore: number;
    mostCommonToxicKeywords: string[];
  };
  systemHealth: {
    analysisSuccessRate: number;
    averageProcessingTime: number; // milliseconds
    lastAnalysisTimestamp: string;
    systemStatus: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  };
  sampleAnalyses: ConversationAnalysis[];
  trends: {
    sentimentTrend: 'IMPROVING' | 'DECLINING' | 'STABLE';
    volumeTrend: 'INCREASING' | 'DECREASING' | 'STABLE';
    toxicityTrend: 'IMPROVING' | 'WORSENING' | 'STABLE';
  };
}

// ==================== CONVERSATION CONTENT ANALYSIS TYPES ====================

export type ConversationCategory = 
  | 'POTENTIAL_CUSTOMER'
  | 'COMPLAINT'
  | 'SUPPORT_REQUEST'
  | 'SMALLTALK'
  | 'TASK_COMMAND'
  | 'MISSING_INFO'
  | 'SPAM';

export interface ConversationContentAnalysis {
  conversationId: string;
  userId: number;
  summary: string;
  primaryCategory: ConversationCategory;
  secondaryCategories: ConversationCategory[];
  confidence: number; // 0.0 - 1.0
  totalMessages: number;
  analyzedMessages: number;
  analysisTimestamp: string;
  additionalMetrics: {
    reasoning: string;
    conversationLength: number;
    aiSource: string;
  };
}