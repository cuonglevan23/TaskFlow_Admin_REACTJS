// Simple Email Interface - Gmail-like với Theme Support
import React, { useState } from 'react';
import { useEmail } from '../context/email-context';
import { Button } from '@/components/custom/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import ThemeSwitch from '@/components/theme-switch';
import { 
  Star, 
  Trash2, 
  Search, 
  Plus,
  Send,
  Inbox,
  FileText,
  SendHorizontal
} from 'lucide-react';

const SimpleEmailInterface: React.FC = () => {
  const {
    emails,
    isLoading,
    currentView,
    statistics,
    unreadCount,
    fetchEmails,
    markAsRead,
    toggleStar,
    deleteEmailAction,
    sendEmailAction,
    searchEmailsAction
  } = useEmail();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmail, setSelectedEmail] = useState<any>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [composeData, setComposeData] = useState({
    to: '',
    subject: '',
    body: ''
  });

  // Format date helper
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const handleEmailClick = async (email: any) => {
    console.log('Email clicked:', email);
    setSelectedEmail(email);
    if (email && !email.isRead) {
      await markAsRead(email.id);
    }
  };

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      await searchEmailsAction(searchQuery);
    }
  };

  const handleSendEmail = async () => {
    try {
      await sendEmailAction({
        to: [composeData.to],
        subject: composeData.subject,
        body: composeData.body
      });
      setIsComposing(false);
      setComposeData({ to: '', subject: '', body: '' });
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-border flex flex-col">
        {/* Header với Compose và Theme Switch */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Email</h2>
            <ThemeSwitch />
          </div>
          
          <Dialog open={isComposing} onOpenChange={setIsComposing}>
            <DialogTrigger asChild>
              <Button className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Compose
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>New Message</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="To"
                  value={composeData.to}
                  onChange={(e) => setComposeData(prev => ({ ...prev, to: e.target.value }))}
                />
                <Input
                  placeholder="Subject"
                  value={composeData.subject}
                  onChange={(e) => setComposeData(prev => ({ ...prev, subject: e.target.value }))}
                />
                <Textarea
                  placeholder="Message"
                  rows={10}
                  value={composeData.body}
                  onChange={(e) => setComposeData(prev => ({ ...prev, body: e.target.value }))}
                />
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsComposing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSendEmail}>
                    <Send className="w-4 h-4 mr-2" />
                    Send
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Navigation Labels */}
        <nav className="flex-1 px-4 py-2">
          <div className="space-y-1">
            <Button
              variant={currentView === 'INBOX' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => fetchEmails('INBOX')}
            >
              <Inbox className="w-4 h-4 mr-2" />
              Inbox
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-auto">
                  {unreadCount}
                </Badge>
              )}
            </Button>
            
            <Button
              variant={currentView === 'SENT' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => fetchEmails('SENT')}
            >
              <SendHorizontal className="w-4 h-4 mr-2" />
              Sent
            </Button>
            
            <Button
              variant={currentView === 'DRAFTS' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => fetchEmails('DRAFTS')}
            >
              <FileText className="w-4 h-4 mr-2" />
              Drafts
            </Button>
          </div>
        </nav>

        {/* Statistics */}
        {statistics && (
          <div className="p-4 border-t border-border">
            <Card>
              <CardHeader className="pb-2">
                <h4 className="text-sm font-medium">Statistics</h4>
              </CardHeader>
              <CardContent className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total:</span>
                  <span>{statistics.totalEmails}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Unread:</span>
                  <span>{statistics.unreadEmails}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Email List */}
      <div className="w-1/3 bg-card border-r border-border flex flex-col">
        {/* Search Bar */}
        <div className="p-4 border-b border-border">
          <div className="flex space-x-2">
            <Input
              placeholder="Search emails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button variant="outline" onClick={handleSearch}>
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Email List */}
        <ScrollArea className="flex-1">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="text-muted-foreground">Loading emails...</div>
            </div>
          ) : emails.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-muted-foreground">No emails found</div>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {emails.map((email, index) => (
                <div
                  key={email.id || `email-${index}`}
                  className={`p-4 cursor-pointer hover:bg-accent/50 transition-colors ${
                    selectedEmail?.id === email.id ? 'bg-accent' : ''
                  } ${!email.isRead ? 'bg-accent/20' : ''}`}
                  onClick={() => handleEmailClick(email)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className={`font-medium ${!email.isRead ? 'font-bold' : ''} text-foreground`}>
                          {(email as any).fromName || (email as any).fromEmail || 'Unknown Sender'}
                        </span>
                        {email.isStarred && (
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        )}
                        {!email.isRead && (
                          <Badge variant="secondary" className="text-xs">New</Badge>
                        )}
                      </div>
                      <div className="mt-1">
                        <div className={`text-sm ${!email.isRead ? 'font-semibold' : 'text-muted-foreground'} truncate`}>
                          {email.subject || 'No Subject'}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 truncate">
                          {email.body ? email.body.substring(0, 100) + '...' : 'No content'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-2 flex flex-col items-end space-y-2">
                      <div className="text-xs text-muted-foreground">
                        {formatDate(email.sentAt)}
                      </div>
                      
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleStar(email.id);
                          }}
                        >
                          <Star 
                            className={`w-3 h-3 ${
                              email.isStarred ? 'text-yellow-400 fill-current' : 'text-muted-foreground'
                            }`} 
                          />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteEmailAction(email.id);
                          }}
                        >
                          <Trash2 className="w-3 h-3 text-muted-foreground" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Email Detail */}
      <div className="flex-1 bg-background flex flex-col">
        {selectedEmail ? (
          <>
            {/* Email Header */}
            <div className="p-6 border-b border-border">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-xl font-semibold mb-2 text-foreground">
                    {selectedEmail.subject || 'No Subject'}
                  </h1>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>From: {selectedEmail.fromName ? `${selectedEmail.fromName} <${selectedEmail.fromEmail}>` : selectedEmail.fromEmail || 'Unknown'}</span>
                    <span>To: {selectedEmail.toEmails ? selectedEmail.toEmails.join(', ') : selectedEmail.recipientEmail || 'Unknown'}</span>
                    <span>{formatDate(selectedEmail.sentAt)}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleStar(selectedEmail.id)}
                  >
                    <Star 
                      className={`w-4 h-4 ${
                        selectedEmail.isStarred ? 'text-yellow-400 fill-current' : ''
                      }`} 
                    />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteEmailAction(selectedEmail.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Email Body */}
            <ScrollArea className="flex-1 p-6">
              <Card>
                <CardContent className="p-6">
                  <div className="prose max-w-none dark:prose-invert">
                    <div dangerouslySetInnerHTML={{ 
                      __html: selectedEmail.body || 'No content available' 
                    }} />
                  </div>
                </CardContent>
              </Card>
            </ScrollArea>

            {/* Reply Actions */}
            <div className="p-4 border-t border-border">
              <div className="flex space-x-2">
                <Button
                  onClick={() => {
                    setComposeData({
                      to: selectedEmail.from || '',
                      subject: `Re: ${selectedEmail.subject || 'No Subject'}`,
                      body: `\n\n--- Original Message ---\n${selectedEmail.body || ''}`
                    });
                    setIsComposing(true);
                  }}
                >
                  Reply
                </Button>
                
                <Button variant="outline">
                  Forward
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Inbox className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="text-lg font-medium">Select an email to read</p>
              <p className="text-sm">Choose an email from the list to view its contents</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleEmailInterface;