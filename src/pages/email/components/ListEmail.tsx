// Gmail-like Email Interface Component
import React, { useState, useEffect } from 'react';
import { useEmailList, useEmailSelection, useEmailLabels, useEmailSearch, useComposeEmail, useEmailUtils } from '../hooks/useEmail';
import { Button } from '@/components/custom/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Search, 
  Inbox, 
  Send, 
  FileText, 
  Trash, 
  Star, 
  RefreshCw,
  Plus,
  Mail,
  Reply,
  ReplyAll,
  Forward,
  Flag,
  Paperclip,
  X
} from 'lucide-react';
import { EMAIL_LABELS, type EmailMessage } from '../../../types/email.types';

const ListEmail: React.FC = () => {
  // Email hooks
  const { emails, isLoading, currentView, loadEmails, refreshEmails } = useEmailList();
  const { hasSelectedEmails, selectedCount, isSelected, toggleSelection, selectAll, deselectAll, bulkMarkAsRead, bulkDelete } = useEmailSelection();
  const { statistics, refreshMetadata } = useEmailLabels();
  const { searchQuery, search, clearSearch } = useEmailSearch();
  const { isComposing, emailDraft, isSending, openCompose, closeCompose, updateDraft, sendEmail, replyTo, replyToAll, forward } = useComposeEmail();
  const { formatEmailDate, getEmailPreview, getInitials } = useEmailUtils();

  // Local state
  const [searchInput, setSearchInput] = useState('');
  const [selectedEmail, setSelectedEmail] = useState<EmailMessage | null>(null);
  const [isEmailDetailOpen, setIsEmailDetailOpen] = useState(false);

  // Load initial data
  useEffect(() => {
    refreshMetadata();
  }, [refreshMetadata]);

  // Search handler
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      await search(searchInput.trim());
    }
  };

  // Email row click handler
  const handleEmailClick = (email: EmailMessage) => {
    setSelectedEmail(email);
    setIsEmailDetailOpen(true);
  };

  // Navigation items
  const navigationItems = [
    { id: EMAIL_LABELS.INBOX, label: 'Inbox', icon: Inbox, count: statistics?.unreadEmails || 0 },
    { id: EMAIL_LABELS.SENT, label: 'Sent', icon: Send, count: statistics?.sentEmails || 0 },
    { id: EMAIL_LABELS.DRAFTS, label: 'Drafts', icon: FileText, count: statistics?.draftEmails || 0 },
    { id: EMAIL_LABELS.STARRED, label: 'Starred', icon: Star, count: statistics?.starredEmails || 0 },
    { id: EMAIL_LABELS.TRASH, label: 'Trash', icon: Trash, count: statistics?.trashEmails || 0 },
  ];

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-64 border-r bg-background">
        <div className="p-4">
          <Button onClick={openCompose} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Compose
          </Button>
        </div>
        
        <ScrollArea className="h-[calc(100vh-120px)]">
          <div className="px-4 py-2">
            {navigationItems.map((item) => (
              <Button
                key={item.id}
                variant={currentView === item.id ? "secondary" : "ghost"}
                className="w-full justify-start mb-1"
                onClick={() => loadEmails(item.id)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.count > 0 && (
                  <Badge variant="secondary" className="ml-auto">
                    {item.count}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="border-b p-4">
          <div className="flex items-center space-x-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search emails..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-8"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1.5 h-6 w-6 p-0"
                    onClick={clearSearch}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </form>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={refreshEmails}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>

              {hasSelectedEmails && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => bulkMarkAsRead()}
                  >
                    Mark as Read ({selectedCount})
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => bulkDelete()}
                  >
                    Delete ({selectedCount})
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={deselectAll}
                  >
                    Clear
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Email List */}
        <ScrollArea className="flex-1">
          <div className="p-4">
            {/* Select All */}
            {emails.length > 0 && (
              <div className="flex items-center mb-4">
                <Checkbox
                  checked={selectedCount === emails.length}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      selectAll();
                    } else {
                      deselectAll();
                    }
                  }}
                />
                <span className="ml-2 text-sm text-muted-foreground">
                  {selectedCount > 0 ? `${selectedCount} selected` : 'Select all'}
                </span>
              </div>
            )}

            {/* Email Items */}
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin" />
                <span className="ml-2">Loading emails...</span>
              </div>
            ) : emails.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No emails found</p>
                <p className="text-sm mt-2">Try refreshing or check your connection</p>
              </div>
            ) : (
              <div className="space-y-2">
                {emails.map((email) => (
                  <div
                    key={email.id}
                    className={`flex items-center p-3 rounded-lg border cursor-pointer hover:bg-accent transition-colors ${
                      !email.isRead ? 'bg-accent/50 font-medium' : ''
                    } ${isSelected(email.id) ? 'bg-accent border-primary' : ''}`}
                  >
                    <Checkbox
                      checked={isSelected(email.id)}
                      onCheckedChange={() => toggleSelection(email.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    
                    <div className="ml-3 flex-1" onClick={() => handleEmailClick(email)}>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {getInitials(email.from)}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium truncate">
                              {email.from}
                            </p>
                            <div className="flex items-center space-x-2">
                              {email.isStarred && (
                                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                              )}
                              {email.attachments.length > 0 && (
                                <Paperclip className="h-4 w-4 text-muted-foreground" />
                              )}
                              <span className="text-xs text-muted-foreground">
                                {formatEmailDate(email.sentAt)}
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-sm font-medium truncate mt-1">
                            {email.subject}
                          </p>
                          
                          <p className="text-xs text-muted-foreground truncate mt-1">
                            {getEmailPreview(email.body)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Email Detail Dialog */}
      <Dialog open={isEmailDetailOpen} onOpenChange={setIsEmailDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedEmail && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>{selectedEmail.subject}</span>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => replyTo(selectedEmail)}
                    >
                      <Reply className="h-4 w-4 mr-2" />
                      Reply
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => replyToAll(selectedEmail)}
                    >
                      <ReplyAll className="h-4 w-4 mr-2" />
                      Reply All
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => forward(selectedEmail)}
                    >
                      <Forward className="h-4 w-4 mr-2" />
                      Forward
                    </Button>
                  </div>
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarFallback>
                      {getInitials(selectedEmail.from)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{selectedEmail.from}</p>
                    <p className="text-sm text-muted-foreground">
                      To: {selectedEmail.to.join(', ')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(selectedEmail.sentAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {selectedEmail.isStarred && (
                      <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    )}
                    {selectedEmail.isImportant && (
                      <Flag className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                </div>
                
                <Separator />
                
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: selectedEmail.body }}
                />
                
                {selectedEmail.attachments.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-2">Attachments</h4>
                      <div className="space-y-2">
                        {selectedEmail.attachments.map((attachment) => (
                          <div
                            key={attachment.id}
                            className="flex items-center space-x-2 p-2 border rounded"
                          >
                            <Paperclip className="h-4 w-4" />
                            <span className="text-sm">{attachment.name}</span>
                            <span className="text-xs text-muted-foreground">
                              ({(attachment.size / 1024).toFixed(1)} KB)
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Compose Email Dialog */}
      <Dialog open={isComposing} onOpenChange={closeCompose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Compose Email</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="to">To</Label>
              <Input
                id="to"
                placeholder="recipient@example.com"
                value={emailDraft.to?.join(', ') || ''}
                onChange={(e) => updateDraft({ 
                  to: e.target.value.split(',').map(email => email.trim()).filter(Boolean)
                })}
              />
            </div>
            
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Email subject"
                value={emailDraft.subject || ''}
                onChange={(e) => updateDraft({ subject: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="body">Message</Label>
              <Textarea
                id="body"
                placeholder="Type your message here..."
                rows={10}
                value={emailDraft.body || ''}
                onChange={(e) => updateDraft({ body: e.target.value })}
              />
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={closeCompose}>
                Cancel
              </Button>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  onClick={async () => {
                    // Save draft functionality would go here
                  }}
                >
                  Save Draft
                </Button>
                <Button 
                  onClick={sendEmail}
                  disabled={isSending || !emailDraft.to?.length || !emailDraft.subject || !emailDraft.body}
                >
                  {isSending ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  Send
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ListEmail;
