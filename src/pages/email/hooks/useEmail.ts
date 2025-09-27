// Custom Hooks cho Email System
import { useCallback, useState } from 'react';
import { useEmail } from '../context/email-context';
import type { EmailMessage, SendEmailRequest } from '../../../types/email.types';

// ==================== EMAIL LIST HOOK ====================

export const useEmailList = () => {
  const {
    emails,
    isLoading,
    currentView,
    totalElements,
    totalPages,
    currentPage,
    fetchEmails,
    refreshEmails,
    searchEmailsAction,
    setCurrentView,
  } = useEmail();

  const loadEmails = useCallback(async (view: any, page = 0) => {
    setCurrentView(view);
    await fetchEmails(view, { page });
  }, [fetchEmails, setCurrentView]);

  const searchEmails = useCallback(async (query: string) => {
    await searchEmailsAction(query);
  }, [searchEmailsAction]);

  return {
    emails,
    isLoading,
    currentView,
    totalElements,
    totalPages,
    currentPage,
    loadEmails,
    refreshEmails,
    searchEmails,
  };
};

// ==================== EMAIL DETAIL HOOK ====================

export const useEmailDetail = () => {
  const {
    currentEmail,
    isLoadingDetail,
    fetchEmailDetail,
    markAsRead,
    markAsUnread,
    toggleStar,
    toggleImportant,
    deleteEmailAction,
    moveToTrash,
  } = useEmail();

  const loadEmailDetail = useCallback(async (messageId: string) => {
    await fetchEmailDetail(messageId);
  }, [fetchEmailDetail]);

  return {
    currentEmail,
    isLoadingDetail,
    loadEmailDetail,
    markAsRead,
    markAsUnread,
    toggleStar,
    toggleImportant,
    deleteEmail: deleteEmailAction,
    moveToTrash,
  };
};

// ==================== EMAIL SELECTION HOOK ====================

export const useEmailSelection = () => {
  const {
    selectedEmails,
    selectEmail,
    deselectEmail,
    selectAllEmails,
    deselectAllEmails,
    bulkMarkAsReadAction,
    bulkDeleteAction,
  } = useEmail();

  const isSelected = useCallback((messageId: string) => {
    return selectedEmails.includes(messageId);
  }, [selectedEmails]);

  const toggleSelection = useCallback((messageId: string) => {
    if (isSelected(messageId)) {
      deselectEmail(messageId);
    } else {
      selectEmail(messageId);
    }
  }, [isSelected, selectEmail, deselectEmail]);

  const hasSelectedEmails = selectedEmails.length > 0;
  const selectedCount = selectedEmails.length;

  return {
    selectedEmails,
    hasSelectedEmails,
    selectedCount,
    isSelected,
    toggleSelection,
    selectAll: selectAllEmails,
    deselectAll: deselectAllEmails,
    bulkMarkAsRead: () => bulkMarkAsReadAction(selectedEmails),
    bulkDelete: () => bulkDeleteAction(selectedEmails),
  };
};

// ==================== COMPOSE EMAIL HOOK ====================

export const useComposeEmail = () => {
  const { sendEmailAction, saveDraftAction, isSending } = useEmail();
  const [isComposing, setIsComposing] = useState(false);
  const [emailDraft, setEmailDraft] = useState<Partial<SendEmailRequest>>({
    to: [],
    cc: [],
    bcc: [],
    subject: '',
    body: '',
    attachments: [],
  });

  const openCompose = useCallback(() => {
    setIsComposing(true);
    setEmailDraft({
      to: [],
      cc: [],
      bcc: [],
      subject: '',
      body: '',
      attachments: [],
    });
  }, []);

  const closeCompose = useCallback(() => {
    setIsComposing(false);
    setEmailDraft({
      to: [],
      cc: [],
      bcc: [],
      subject: '',
      body: '',
      attachments: [],
    });
  }, []);

  const updateDraft = useCallback((updates: Partial<SendEmailRequest>) => {
    setEmailDraft(prev => ({ ...prev, ...updates }));
  }, []);

  const sendEmail = useCallback(async () => {
    if (!emailDraft.to?.length || !emailDraft.subject || !emailDraft.body) {
      throw new Error('Please fill in all required fields');
    }

    await sendEmailAction(emailDraft as SendEmailRequest);
    closeCompose();
  }, [emailDraft, sendEmailAction, closeCompose]);

  const saveDraft = useCallback(async () => {
    await saveDraftAction(emailDraft);
  }, [emailDraft, saveDraftAction]);

  const replyTo = useCallback((originalEmail: EmailMessage) => {
    setIsComposing(true);
    setEmailDraft({
      to: [originalEmail.from],
      cc: [],
      bcc: [],
      subject: originalEmail.subject.startsWith('Re:') 
        ? originalEmail.subject 
        : `Re: ${originalEmail.subject}`,
      body: `\n\n--- Original Message ---\nFrom: ${originalEmail.from}\nSent: ${originalEmail.sentAt}\nSubject: ${originalEmail.subject}\n\n${originalEmail.body}`,
      attachments: [],
    });
  }, []);

  const replyToAll = useCallback((originalEmail: EmailMessage) => {
    const allRecipients = [originalEmail.from, ...originalEmail.to.filter(email => email !== originalEmail.from)];
    
    setIsComposing(true);
    setEmailDraft({
      to: allRecipients,
      cc: originalEmail.cc || [],
      bcc: [],
      subject: originalEmail.subject.startsWith('Re:') 
        ? originalEmail.subject 
        : `Re: ${originalEmail.subject}`,
      body: `\n\n--- Original Message ---\nFrom: ${originalEmail.from}\nSent: ${originalEmail.sentAt}\nSubject: ${originalEmail.subject}\n\n${originalEmail.body}`,
      attachments: [],
    });
  }, []);

  const forward = useCallback((originalEmail: EmailMessage) => {
    setIsComposing(true);
    setEmailDraft({
      to: [],
      cc: [],
      bcc: [],
      subject: originalEmail.subject.startsWith('Fwd:') 
        ? originalEmail.subject 
        : `Fwd: ${originalEmail.subject}`,
      body: `\n\n--- Forwarded Message ---\nFrom: ${originalEmail.from}\nSent: ${originalEmail.sentAt}\nTo: ${originalEmail.to.join(', ')}\nSubject: ${originalEmail.subject}\n\n${originalEmail.body}`,
      attachments: [], // Note: Forward will need to handle existing attachments differently
    });
  }, []);

  return {
    isComposing,
    emailDraft,
    isSending,
    openCompose,
    closeCompose,
    updateDraft,
    sendEmail,
    saveDraft,
    replyTo,
    replyToAll,
    forward,
  };
};

// ==================== EMAIL LABELS HOOK ====================

export const useEmailLabels = () => {
  const {
    labels,
    statistics,
    unreadCount,
    isLoadingLabels,
    fetchLabels,
    fetchStatistics,
    fetchUnreadCount,
  } = useEmail();

  const refreshMetadata = useCallback(async () => {
    await Promise.all([
      fetchLabels(),
      fetchStatistics(), 
      fetchUnreadCount()
    ]);
  }, [fetchLabels, fetchStatistics, fetchUnreadCount]);

  const getLabelByType = useCallback((labelType: string) => {
    return labels.find(label => label.id === labelType);
  }, [labels]);

  const getUnreadCountForLabel = useCallback((labelId: string) => {
    const label = getLabelByType(labelId);
    return label?.unreadCount || 0;
  }, [getLabelByType]);

  return {
    labels,
    statistics,
    unreadCount,
    isLoadingLabels,
    refreshMetadata,
    getLabelByType,
    getUnreadCountForLabel,
  };
};

// ==================== EMAIL SEARCH HOOK ====================

export const useEmailSearch = () => {
  const { searchQuery, setSearchQuery, searchEmailsAction } = useEmail();
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const search = useCallback(async (query: string) => {
    if (!query.trim()) return;
    
    setSearchQuery(query);
    await searchEmailsAction(query);
    
    // Add to search history
    setSearchHistory(prev => {
      const newHistory = [query, ...prev.filter(item => item !== query)];
      return newHistory.slice(0, 10); // Keep only last 10 searches
    });
  }, [searchEmailsAction, setSearchQuery]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, [setSearchQuery]);

  const clearSearchHistory = useCallback(() => {
    setSearchHistory([]);
  }, []);

  return {
    searchQuery,
    searchHistory,
    search,
    clearSearch,
    clearSearchHistory,
  };
};

// ==================== EMAIL UTILITIES HOOK ====================

export const useEmailUtils = () => {
  const formatEmailDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  }, []);

  const getEmailPreview = useCallback((body: string, maxLength = 150) => {
    const text = body.replace(/<[^>]*>/g, ''); // Remove HTML tags
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }, []);

  const getInitials = useCallback((email: string) => {
    const parts = email.split('@')[0].split('.');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return email.substring(0, 2).toUpperCase();
  }, []);

  const validateEmail = useCallback((email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  const formatFileSize = useCallback((bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  return {
    formatEmailDate,
    getEmailPreview,
    getInitials,
    validateEmail,
    formatFileSize,
  };
};