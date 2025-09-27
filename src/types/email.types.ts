// Email Types - Interface định nghĩa cho Email System
export interface EmailAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
}

export interface EmailMessage {
  id: string;
  subject: string;
  from: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  body: string;
  sentAt: string;
  isRead: boolean;
  isStarred: boolean;
  isImportant: boolean;
  labels: string[];
  attachments: EmailAttachment[];
  threadId?: string;
  snippet?: string;
}

export interface EmailLabel {
  id: string;
  name: string;
  messageCount: number;
  unreadCount: number;
  color?: string;
  type: 'system' | 'custom';
}

export interface EmailStatistics {
  totalEmails: number;
  unreadEmails: number;
  sentEmails: number;
  draftEmails: number;
  starredEmails: number;
  trashEmails: number;
}

export interface QuickAction {
  id: string;
  name: string;
  icon: string;
  description: string;
  enabled: boolean;
}

// Request/Response Types
export interface EmailListParams {
  page?: number;
  size?: number;
  label?: string;
  q?: string; // search query
  unreadOnly?: boolean;
  starredOnly?: boolean;
}

export interface EmailListResponse {
  success: boolean;
  emails: EmailMessage[];
  pagination: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

export interface EmailDetailResponse {
  success: boolean;
  email: EmailMessage;
}

export interface EmailLabelsResponse {
  success: boolean;
  labels: EmailLabel[];
  totalCount: number;
}

export interface EmailStatisticsResponse {
  success: boolean;
  statistics: EmailStatistics;
}

export interface EmailUnreadCountResponse {
  success: boolean;
  unreadCount: number;
  unreadByLabel: Record<string, number>;
}

export interface QuickActionsResponse {
  success: boolean;
  actions: QuickAction[];
}

export interface SendEmailRequest {
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  body: string;
  attachments?: File[];
  priority?: 'low' | 'normal' | 'high';
  requestReadReceipt?: boolean;
}

export interface SendEmailResponse {
  success: boolean;
  messageId: string;
  message: string;
}

export interface EmailActionResponse {
  success: boolean;
  message: string;
  updatedEmail?: EmailMessage;
}

// Filter and Sort Types
export interface EmailFilters {
  dateRange?: {
    from: string;
    to: string;
  };
  hasAttachment?: boolean;
  isUnread?: boolean;
  isStarred?: boolean;
  isImportant?: boolean;
  fromDomain?: string;
  labels?: string[];
}

export interface EmailSortOptions {
  field: 'sentAt' | 'subject' | 'from' | 'size';
  direction: 'asc' | 'desc';
}

// Gmail-like Constants
export const EMAIL_LABELS = {
  INBOX: 'INBOX',
  SENT: 'SENT',
  DRAFTS: 'DRAFTS',
  TRASH: 'TRASH',
  SPAM: 'SPAM',
  STARRED: 'STARRED',
  IMPORTANT: 'IMPORTANT',
  ALL_MAIL: 'ALL_MAIL',
} as const;

export type EmailLabelType = typeof EMAIL_LABELS[keyof typeof EMAIL_LABELS];

export const EMAIL_PRIORITIES = {
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
} as const;

export type EmailPriority = typeof EMAIL_PRIORITIES[keyof typeof EMAIL_PRIORITIES];