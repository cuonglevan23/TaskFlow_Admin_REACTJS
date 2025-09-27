import axiosInstance from './axios.customize';
import type { 
  EmailMessage, 
  EmailLabel, 
  SendEmailRequest, 
  EmailListResponse 
} from '../types/email.types';

// Email List APIs - Using actual backend endpoints
export const getInboxEmails = async (page: number = 0, size: number = 20, label: string = 'INBOX'): Promise<EmailListResponse> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      label
    });
    
    const response: EmailListResponse = await axiosInstance.get(`/emails/inbox?${params}`);
    return response;
  } catch (error) {
    console.error('Error fetching inbox emails:', error);
    // Fallback data structure
    return {
      success: true,
      emails: [],
      pagination: {
        page: 0,
        size: 20,
        totalElements: 0,
        totalPages: 0
      }
    };
  }
};

export const getSentEmails = async (page: number = 0, size: number = 20): Promise<any> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString()
    });
    
    // axiosInstance đã có interceptor trả về response.data
    const response: any = await axiosInstance.get(`/emails/sent?${params}`);
    
    return response;
  } catch (error) {
    console.error('Error fetching sent emails:', error);
    return {
      emails: [],
      totalElements: 0,
      totalPages: 0,
      currentPage: 0,
      pageSize: size,
      hasNext: false,
      hasPrevious: false,
      filterBy: 'SENT',
      searchQuery: null,
      unreadCount: 0
    };
  }
};

export const getDraftEmails = async (page: number = 0, size: number = 20): Promise<EmailListResponse> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString()
    });
    
    const response: EmailListResponse = await axiosInstance.get(`/emails/drafts?${params}`);
    return response;
  } catch (error) {
    console.error('Error fetching draft emails:', error);
    return {
      success: true,
      emails: [],
      pagination: {
        page: 0,
        size: 20,
        totalElements: 0,
        totalPages: 0
      }
    };
  }
};

export const searchEmails = async (query: string, page: number = 0, size: number = 20): Promise<EmailListResponse> => {
  try {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      size: size.toString()
    });
    
    const response = await axiosInstance.get(`/emails/search?${params}`);
    return response as unknown as EmailListResponse;
  } catch (error) {
    console.error('Error searching emails:', error);
    return {
      success: true,
      emails: [],
      pagination: {
        page: 0,
        size: 20,
        totalElements: 0,
        totalPages: 0
      }
    };
  }
};

// Email Detail & Actions APIs
export const getEmailDetail = async (messageId: string): Promise<EmailMessage | null> => {
  try {
    const response = await axiosInstance.get(`/emails/${messageId}`);
    return response as unknown as EmailMessage;
  } catch (error) {
    console.error('Error fetching email detail:', error);
    return null;
  }
};

export const markEmailAsRead = async (messageId: string): Promise<{ success: boolean }> => {
  try {
    const response = await axiosInstance.post(`/emails/${messageId}/mark-read`);
    return response as unknown as { success: boolean };
  } catch (error) {
    console.error('Error marking email as read:', error);
    return { success: false };
  }
};

export const markEmailAsUnread = async (messageId: string): Promise<{ success: boolean }> => {
  try {
    const response = await axiosInstance.post(`/emails/${messageId}/mark-unread`);
    return response as unknown as { success: boolean };
  } catch (error) {
    console.error('Error marking email as unread:', error);
    return { success: false };
  }
};

export const starEmail = async (messageId: string): Promise<{ success: boolean }> => {
  try {
    const response = await axiosInstance.post(`/emails/${messageId}/star`);
    return response as unknown as { success: boolean };
  } catch (error) {
    console.error('Error starring email:', error);
    return { success: false };
  }
};

export const unstarEmail = async (messageId: string): Promise<{ success: boolean }> => {
  try {
    const response = await axiosInstance.post(`/emails/${messageId}/unstar`);
    return response as unknown as { success: boolean };
  } catch (error) {
    console.error('Error unstarring email:', error);
    return { success: false };
  }
};

export const deleteEmail = async (messageId: string): Promise<{ success: boolean }> => {
  try {
    const response = await axiosInstance.delete(`/emails/${messageId}`);
    return response as unknown as { success: boolean };
  } catch (error) {
    console.error('Error deleting email:', error);
    return { success: false };
  }
};

// Labels & Metadata APIs
export const getEmailLabels = async (): Promise<EmailLabel[]> => {
  try {
    const response = await axiosInstance.get('/emails/labels');
    return response as unknown as EmailLabel[];
  } catch (error) {
    console.error('Error fetching email labels:', error);
    // Return default Gmail-like labels with messageCount
    return [
      { id: 'INBOX', name: 'Inbox', type: 'system', color: '#1a73e8', unreadCount: 0, messageCount: 0 },
      { id: 'SENT', name: 'Sent', type: 'system', color: '#34a853', unreadCount: 0, messageCount: 0 },
      { id: 'DRAFTS', name: 'Drafts', type: 'system', color: '#fbbc04', unreadCount: 0, messageCount: 0 },
      { id: 'STARRED', name: 'Starred', type: 'system', color: '#ea4335', unreadCount: 0, messageCount: 0 },
      { id: 'TRASH', name: 'Trash', type: 'system', color: '#9aa0a6', unreadCount: 0, messageCount: 0 }
    ];
  }
};

export const getUnreadCount = async (): Promise<{ count: number }> => {
  try {
    const response = await axiosInstance.get('/emails/unread-count');
    return response as unknown as { count: number };
  } catch (error) {
    console.error('Error fetching unread count:', error);
    return { count: 0 };
  }
};

export const getQuickActions = async (): Promise<{ actions: string[] }> => {
  try {
    const response = await axiosInstance.get('/emails/quick-actions');
    return response as unknown as { actions: string[] };
  } catch (error) {
    console.error('Error fetching quick actions:', error);
    return { actions: ['mark_read', 'star', 'delete', 'archive'] };
  }
};

// Send Email API
export const sendEmail = async (emailData: SendEmailRequest): Promise<{ success: boolean; messageId?: string }> => {
  try {
    const response = await axiosInstance.post('/emails/send', emailData);
    return response as unknown as { success: boolean; messageId?: string };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false };
  }
};

// Bulk Actions - Note: These might not exist in backend yet, keeping for future implementation
export const bulkMarkAsRead = async (messageIds: string[]): Promise<{ success: boolean }> => {
  try {
    const response = await axiosInstance.post('/emails/bulk/mark-read', { messageIds });
    return response as unknown as { success: boolean };
  } catch (error) {
    console.error('Error bulk marking as read:', error);
    return { success: false };
  }
};

export const bulkMarkAsUnread = async (messageIds: string[]): Promise<{ success: boolean }> => {
  try {
    const response = await axiosInstance.post('/emails/bulk/mark-unread', { messageIds });
    return response as unknown as { success: boolean };
  } catch (error) {
    console.error('Error bulk marking as unread:', error);
    return { success: false };
  }
};

export const bulkDelete = async (messageIds: string[]): Promise<{ success: boolean }> => {
  try {
    const response = await axiosInstance.post('/emails/bulk/delete', { messageIds });
    return response as unknown as { success: boolean };
  } catch (error) {
    console.error('Error bulk deleting:', error);
    return { success: false };
  }
};

export const bulkStar = async (messageIds: string[]): Promise<{ success: boolean }> => {
  try {
    const response = await axiosInstance.post('/emails/bulk/star', { messageIds });
    return response as unknown as { success: boolean };
  } catch (error) {
    console.error('Error bulk starring:', error);
    return { success: false };
  }
};

export const bulkUnstar = async (messageIds: string[]): Promise<{ success: boolean }> => {
  try {
    const response = await axiosInstance.post('/emails/bulk/unstar', { messageIds });
    return response as unknown as { success: boolean };
  } catch (error) {
    console.error('Error bulk unstarring:', error);
    return { success: false };
  }
};