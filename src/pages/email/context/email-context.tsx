// Email Context - React Context cho Email System
import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import type {
  EmailMessage,
  EmailLabel,
  EmailStatistics,
  EmailListParams,
  EmailFilters,
  EmailSortOptions,
  EmailLabelType
} from '../../../types/email.types';

import {
  getInboxEmails,
  getSentEmails,
  getDraftEmails,
  searchEmails,
  getEmailDetail,
  markEmailAsRead,
  markEmailAsUnread,
  starEmail,
  unstarEmail,
  deleteEmail,
  bulkMarkAsRead,
  bulkDelete,
  getEmailLabels,
  getUnreadCount,
  sendEmail
} from '../../../api/emailApi';

// ==================== TYPES ====================

interface EmailState {
  // Email Lists
  emails: EmailMessage[];
  selectedEmails: string[];
  currentEmail: EmailMessage | null;
  
  // Labels & Metadata
  labels: EmailLabel[];
  statistics: EmailStatistics | null;
  unreadCount: number;
  
  // UI State
  currentView: EmailLabelType | 'search';
  searchQuery: string;
  filters: EmailFilters;
  sortOptions: EmailSortOptions;
  
  // Pagination
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  
  // Loading States
  isLoading: boolean;
  isLoadingDetail: boolean;
  isLoadingLabels: boolean;
  isSending: boolean;
  
  // Error State
  error: string | null;
}

type EmailAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_LOADING_DETAIL'; payload: boolean }
  | { type: 'SET_LOADING_LABELS'; payload: boolean }
  | { type: 'SET_SENDING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_EMAILS'; payload: { emails: EmailMessage[]; pagination: any } }
  | { type: 'SET_CURRENT_EMAIL'; payload: EmailMessage | null }
  | { type: 'SET_LABELS'; payload: EmailLabel[] }
  | { type: 'SET_STATISTICS'; payload: EmailStatistics }
  | { type: 'SET_UNREAD_COUNT'; payload: number }
  | { type: 'SET_CURRENT_VIEW'; payload: EmailLabelType | 'search' }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_FILTERS'; payload: EmailFilters }
  | { type: 'SET_SORT_OPTIONS'; payload: EmailSortOptions }
  | { type: 'SET_PAGINATION'; payload: { page: number; size: number } }
  | { type: 'SELECT_EMAIL'; payload: string }
  | { type: 'DESELECT_EMAIL'; payload: string }
  | { type: 'SELECT_ALL_EMAILS' }
  | { type: 'DESELECT_ALL_EMAILS' }
  | { type: 'UPDATE_EMAIL'; payload: EmailMessage }
  | { type: 'REMOVE_EMAIL'; payload: string }
  | { type: 'BULK_UPDATE_EMAILS'; payload: { ids: string[]; updates: Partial<EmailMessage> } };

interface EmailContextType extends EmailState {
  // Email List Actions
  fetchEmails: (view?: EmailLabelType, params?: EmailListParams) => Promise<void>;
  searchEmailsAction: (query: string, params?: EmailListParams) => Promise<void>;
  refreshEmails: () => Promise<void>;
  
  // Email Detail Actions
  fetchEmailDetail: (messageId: string) => Promise<void>;
  
  // Email Actions
  markAsRead: (messageId: string) => Promise<void>;
  markAsUnread: (messageId: string) => Promise<void>;
  toggleStar: (messageId: string) => Promise<void>;
  toggleImportant: (messageId: string) => Promise<void>;
  deleteEmailAction: (messageId: string) => Promise<void>;
  moveToTrash: (messageId: string) => Promise<void>;
  
  // Bulk Actions
  bulkMarkAsReadAction: (messageIds: string[]) => Promise<void>;
  bulkDeleteAction: (messageIds: string[]) => Promise<void>;
  
  // Send Email
  sendEmailAction: (emailData: any) => Promise<void>;
  saveDraftAction: (emailData: any) => Promise<void>;
  
  // UI Actions
  selectEmail: (messageId: string) => void;
  deselectEmail: (messageId: string) => void;
  selectAllEmails: () => void;
  deselectAllEmails: () => void;
  setCurrentView: (view: EmailLabelType | 'search') => void;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: EmailFilters) => void;
  setSortOptions: (sort: EmailSortOptions) => void;
  
  // Metadata Actions
  fetchLabels: () => Promise<void>;
  fetchStatistics: () => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
}

// ==================== INITIAL STATE ====================

const initialState: EmailState = {
  emails: [],
  selectedEmails: [],
  currentEmail: null,
  labels: [],
  statistics: null,
  unreadCount: 0,
  currentView: 'INBOX',
  searchQuery: '',
  filters: {},
  sortOptions: { field: 'sentAt', direction: 'desc' },
  currentPage: 0,
  pageSize: 20,
  totalElements: 0,
  totalPages: 0,
  isLoading: false,
  isLoadingDetail: false,
  isLoadingLabels: false,
  isSending: false,
  error: null,
};

// ==================== REDUCER ====================

const emailReducer = (state: EmailState, action: EmailAction): EmailState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload, error: null };
    
    case 'SET_LOADING_DETAIL':
      return { ...state, isLoadingDetail: action.payload };
    
    case 'SET_LOADING_LABELS':
      return { ...state, isLoadingLabels: action.payload };
    
    case 'SET_SENDING':
      return { ...state, isSending: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    
    case 'SET_EMAILS':
      return {
        ...state,
        emails: action.payload.emails,
        totalElements: action.payload.pagination?.totalElements || 0,
        totalPages: action.payload.pagination?.totalPages || 0,
        currentPage: action.payload.pagination?.page || 0,
        isLoading: false,
        error: null,
      };
    
    case 'SET_CURRENT_EMAIL':
      return { ...state, currentEmail: action.payload, isLoadingDetail: false };
    
    case 'SET_LABELS':
      return { ...state, labels: action.payload, isLoadingLabels: false };
    
    case 'SET_STATISTICS':
      return { ...state, statistics: action.payload };
    
    case 'SET_UNREAD_COUNT':
      return { ...state, unreadCount: action.payload };
    
    case 'SET_CURRENT_VIEW':
      return { ...state, currentView: action.payload, selectedEmails: [] };
    
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    
    case 'SET_FILTERS':
      return { ...state, filters: action.payload };
    
    case 'SET_SORT_OPTIONS':
      return { ...state, sortOptions: action.payload };
    
    case 'SET_PAGINATION':
      return { ...state, currentPage: action.payload.page, pageSize: action.payload.size };
    
    case 'SELECT_EMAIL':
      return {
        ...state,
        selectedEmails: [...state.selectedEmails, action.payload],
      };
    
    case 'DESELECT_EMAIL':
      return {
        ...state,
        selectedEmails: state.selectedEmails.filter(id => id !== action.payload),
      };
    
    case 'SELECT_ALL_EMAILS':
      return {
        ...state,
        selectedEmails: state.emails.map(email => email.id),
      };
    
    case 'DESELECT_ALL_EMAILS':
      return { ...state, selectedEmails: [] };
    
    case 'UPDATE_EMAIL':
      return {
        ...state,
        emails: state.emails.map(email =>
          email.id === action.payload.id ? action.payload : email
        ),
        currentEmail: state.currentEmail?.id === action.payload.id ? action.payload : state.currentEmail,
      };
    
    case 'REMOVE_EMAIL':
      return {
        ...state,
        emails: state.emails.filter(email => email.id !== action.payload),
        selectedEmails: state.selectedEmails.filter(id => id !== action.payload),
        currentEmail: state.currentEmail?.id === action.payload ? null : state.currentEmail,
      };
    
    case 'BULK_UPDATE_EMAILS':
      return {
        ...state,
        emails: state.emails.map(email =>
          action.payload.ids.includes(email.id)
            ? { ...email, ...action.payload.updates }
            : email
        ),
      };
    
    default:
      return state;
  }
};

// ==================== CONTEXT ====================

const EmailContext = createContext<EmailContextType | undefined>(undefined);

// ==================== PROVIDER ====================

export const EmailProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(emailReducer, initialState);

  // ==================== EMAIL LIST ACTIONS ====================

  const fetchEmails = useCallback(async (view: EmailLabelType = 'INBOX', params: EmailListParams = {}) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const requestParams = {
        page: state.currentPage,
        size: state.pageSize,
        ...params,
      };

      let response;
      
      switch (view) {
        case 'INBOX':
          response = await getInboxEmails(requestParams.page, requestParams.size, 'INBOX');
          break;
        case 'SENT':
          response = await getSentEmails(requestParams.page, requestParams.size);
          break;
        case 'DRAFTS':
          response = await getDraftEmails(requestParams.page, requestParams.size);
          break;
        default:
          // For other labels, use inbox emails as fallback
          response = await getInboxEmails(requestParams.page, requestParams.size, view);
      }

      dispatch({
        type: 'SET_EMAILS',
        payload: {
          emails: response.emails || [],
          pagination: response.pagination || {
            page: 0,
            size: requestParams.size,
            totalElements: 0,
            totalPages: 0
          },
        },
      });
      
      dispatch({ type: 'SET_CURRENT_VIEW', payload: view });
      
    } catch (error: any) {
      // Fallback với empty data thay vì mock data
      dispatch({
        type: 'SET_EMAILS',
        payload: {
          emails: [],
          pagination: {
            page: 0,
            size: params.size || 20,
            totalElements: 0,
            totalPages: 0
          },
        },
      });
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to fetch emails' });
    }
  }, [state.currentPage, state.pageSize]);

  const searchEmailsAction = useCallback(async (query: string, params: EmailListParams = {}) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
    
    try {
      const requestParams = {
        page: 0, // Reset to first page for search
        size: state.pageSize,
        ...params,
      };

      const response = await searchEmails(query, requestParams.page, requestParams.size);
      
      dispatch({
        type: 'SET_EMAILS',
        payload: {
          emails: response.emails,
          pagination: response.pagination,
        },
      });
      
      dispatch({ type: 'SET_CURRENT_VIEW', payload: 'search' });
      
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Search failed' });
    }
  }, [state.pageSize]);

  const refreshEmails = useCallback(async () => {
    if (state.currentView === 'search' && state.searchQuery) {
      await searchEmailsAction(state.searchQuery);
    } else if (state.currentView !== 'search') {
      await fetchEmails(state.currentView as EmailLabelType);
    }
  }, [state.currentView, state.searchQuery, fetchEmails, searchEmailsAction]);

  // ==================== EMAIL DETAIL ACTIONS ====================

  const fetchEmailDetail = useCallback(async (messageId: string) => {
    dispatch({ type: 'SET_LOADING_DETAIL', payload: true });
    
    try {
      const response = await getEmailDetail(messageId);
      if (response) {
        dispatch({ type: 'SET_CURRENT_EMAIL', payload: response });
        
        // Auto mark as read when viewing
        if (!response.isRead) {
          await markAsRead(messageId);
        }
      }
      
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to fetch email detail' });
    }
  }, []);

  // ==================== EMAIL ACTIONS ====================

  const markAsRead = useCallback(async (messageId: string) => {
    try {
      await markEmailAsRead(messageId);
      dispatch({
        type: 'UPDATE_EMAIL',
        payload: { 
          ...state.emails.find(e => e.id === messageId)!, 
          isRead: true 
        },
      });
      await fetchUnreadCount();
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to mark as read' });
    }
  }, [state.emails]);

  const markAsUnread = useCallback(async (messageId: string) => {
    try {
      await markEmailAsUnread(messageId);
      dispatch({
        type: 'UPDATE_EMAIL',
        payload: { 
          ...state.emails.find(e => e.id === messageId)!, 
          isRead: false 
        },
      });
      await fetchUnreadCount();
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to mark as unread' });
    }
  }, [state.emails]);

  const toggleStar = useCallback(async (messageId: string) => {
    const email = state.emails.find(e => e.id === messageId);
    if (!email) return;

    try {
      if (email.isStarred) {
        await unstarEmail(messageId);
      } else {
        await starEmail(messageId);
      }
      
      dispatch({
        type: 'UPDATE_EMAIL',
        payload: { ...email, isStarred: !email.isStarred },
      });
      
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to toggle star' });
    }
  }, [state.emails]);

  const toggleImportant = useCallback(async (messageId: string) => {
    const email = state.emails.find(e => e.id === messageId);
    if (!email) return;

    try {
      // Note: Important functionality not available in current backend
      // Just update local state for now
      dispatch({
        type: 'UPDATE_EMAIL',
        payload: { ...email, isImportant: !email.isImportant },
      });
      
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to toggle important' });
    }
  }, [state.emails]);

  const deleteEmailAction = useCallback(async (messageId: string) => {
    try {
      await deleteEmail(messageId);
      dispatch({ type: 'REMOVE_EMAIL', payload: messageId });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to delete email' });
    }
  }, []);

  const moveToTrash = useCallback(async (messageId: string) => {
    try {
      await deleteEmail(messageId);
      dispatch({ type: 'REMOVE_EMAIL', payload: messageId });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to delete email' });
    }
  }, []);

  // ==================== BULK ACTIONS ====================

  const bulkMarkAsReadAction = useCallback(async (messageIds: string[]) => {
    try {
      await bulkMarkAsRead(messageIds);
      dispatch({
        type: 'BULK_UPDATE_EMAILS',
        payload: { ids: messageIds, updates: { isRead: true } },
      });
      dispatch({ type: 'DESELECT_ALL_EMAILS' });
      await fetchUnreadCount();
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Bulk mark as read failed' });
    }
  }, []);

  const bulkDeleteAction = useCallback(async (messageIds: string[]) => {
    try {
      await bulkDelete(messageIds);
      messageIds.forEach(id => {
        dispatch({ type: 'REMOVE_EMAIL', payload: id });
      });
      dispatch({ type: 'DESELECT_ALL_EMAILS' });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Bulk delete failed' });
    }
  }, []);

  // ==================== SEND EMAIL ====================

  const sendEmailAction = useCallback(async (emailData: any) => {
    dispatch({ type: 'SET_SENDING', payload: true });
    
    try {
      await sendEmail(emailData);
      dispatch({ type: 'SET_SENDING', payload: false });
      // Optionally refresh sent emails
      if (state.currentView === 'SENT') {
        await refreshEmails();
      }
    } catch (error: any) {
      dispatch({ type: 'SET_SENDING', payload: false });
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to send email' });
    }
  }, [state.currentView, refreshEmails]);

    const saveDraftAction = useCallback(async (_emailData: any) => {
    try {
      // Note: Draft saving not available in current backend
      // Just save to local state for now
      // Optionally refresh drafts
      if (state.currentView === 'DRAFTS') {
        await refreshEmails();
      }
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to save draft' });
    }
  }, [state.currentView, refreshEmails]);

  // ==================== UI ACTIONS ====================

  const selectEmail = useCallback((messageId: string) => {
    dispatch({ type: 'SELECT_EMAIL', payload: messageId });
  }, []);

  const deselectEmail = useCallback((messageId: string) => {
    dispatch({ type: 'DESELECT_EMAIL', payload: messageId });
  }, []);

  const selectAllEmails = useCallback(() => {
    dispatch({ type: 'SELECT_ALL_EMAILS' });
  }, []);

  const deselectAllEmails = useCallback(() => {
    dispatch({ type: 'DESELECT_ALL_EMAILS' });
  }, []);

  const setCurrentView = useCallback((view: EmailLabelType | 'search') => {
    dispatch({ type: 'SET_CURRENT_VIEW', payload: view });
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  }, []);

  const setFilters = useCallback((filters: EmailFilters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  }, []);

  const setSortOptions = useCallback((sort: EmailSortOptions) => {
    dispatch({ type: 'SET_SORT_OPTIONS', payload: sort });
  }, []);

  // ==================== METADATA ACTIONS ====================

  const fetchLabels = useCallback(async () => {
    dispatch({ type: 'SET_LOADING_LABELS', payload: true });
    
    try {
      const response = await getEmailLabels();
      dispatch({ type: 'SET_LABELS', payload: response || [] });
    } catch (error: any) {
      // Fallback với empty labels
      dispatch({ type: 'SET_LABELS', payload: [] });
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to fetch labels' });
    }
  }, []);

  const fetchStatistics = useCallback(async () => {
    try {
      // TODO: Backend chưa có endpoint statistics, tạm thời dùng default
      const defaultStats = {
        totalEmails: 0,
        unreadEmails: 0,
        sentEmails: 0,
        draftEmails: 0,
        starredEmails: 0,
        importantEmails: 0,
        trashEmails: 0
      };
      dispatch({ type: 'SET_STATISTICS', payload: defaultStats });
    } catch (error: any) {
      // Fallback với default statistics
      const defaultStats = {
        totalEmails: 0,
        unreadEmails: 0,
        sentEmails: 0,
        draftEmails: 0,
        starredEmails: 0,
        importantEmails: 0,
        trashEmails: 0
      };
      dispatch({ type: 'SET_STATISTICS', payload: defaultStats });
      // Silent fail cho statistics
    }
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await getUnreadCount();
      dispatch({ type: 'SET_UNREAD_COUNT', payload: response.count });
    } catch (error: any) {
      // Silent fail for unread count
    }
  }, []);

  // ==================== EFFECTS ====================

  useEffect(() => {
    // Initial load với error handling
    const initializeEmailData = async () => {
      try {
        await fetchEmails('INBOX');
        await fetchLabels();
        await fetchStatistics();
        await fetchUnreadCount();
      } catch (error) {
        // Nếu API chưa sẵn sàng, sử dụng empty data
        dispatch({
          type: 'SET_EMAILS',
          payload: {
            emails: [],
            pagination: {
              page: 0,
              size: 20,
              totalElements: 0,
              totalPages: 0
            }
          }
        });
        dispatch({ type: 'SET_LABELS', payload: [] });
      }
    };

    initializeEmailData();
  }, [fetchEmails, fetchLabels, fetchStatistics, fetchUnreadCount]);

  // ==================== CONTEXT VALUE ====================

  const contextValue: EmailContextType = {
    ...state,
    fetchEmails,
    searchEmailsAction,
    refreshEmails,
    fetchEmailDetail,
    markAsRead,
    markAsUnread,
    toggleStar,
    toggleImportant,
    deleteEmailAction,
    moveToTrash,
    bulkMarkAsReadAction,
    bulkDeleteAction,
    sendEmailAction,
    saveDraftAction,
    selectEmail,
    deselectEmail,
    selectAllEmails,
    deselectAllEmails,
    setCurrentView,
    setSearchQuery,
    setFilters,
    setSortOptions,
    fetchLabels,
    fetchStatistics,
    fetchUnreadCount,
  };

  return (
    <EmailContext.Provider value={contextValue}>
      {children}
    </EmailContext.Provider>
  );
};

// ==================== HOOK ====================

export const useEmail = (): EmailContextType => {
  const context = useContext(EmailContext);
  if (context === undefined) {
    throw new Error('useEmail must be used within an EmailProvider');
  }
  return context;
};

export default EmailContext;