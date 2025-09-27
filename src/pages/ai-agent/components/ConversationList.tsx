import { MessageSquare, Clock, Crown, ChevronRight, Brain } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/custom/button';
import type { Conversation } from '@/types/ai-agent.types';
import { getTimeSinceActivity } from '@/api/aiAgentApi';

interface ConversationListProps {
  conversations: Conversation[];
  onConversationSelect: (conversation: Conversation) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  analyzedConversations?: Set<string>;
}

export function ConversationList({ 
  conversations, 
  onConversationSelect, 
  currentPage, 
  totalPages, 
  onPageChange,
  analyzedConversations = new Set()
}: ConversationListProps) {
  
  console.log('📋 ConversationList render:');
  console.log('- Received conversations:', conversations?.length || 0);
  console.log('- Conversations data:', conversations);
  
  const getStatusDisplay = (conversation: Conversation) => {
    const statusConfig = {
      'ACTIVE': { 
        label: 'Active', 
        color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
      },
      'TAKEOVER': { 
        label: 'Intervened', 
        color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' 
      },
      'COMPLETED': { 
        label: 'Completed', 
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
      },
      'CANCELLED': { 
        label: 'Cancelled', 
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200' 
      },
      'ADMIN_CONTROLLED': {
        label: 'Admin Controlled',
        color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      },
      'INACTIVE': {
        label: 'Inactive',
        color: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
      }
    };
    
    return statusConfig[conversation.status] || { 
      label: conversation.status, 
      color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200' 
    };
  };

  if (!conversations || conversations.length === 0) {
    console.log('❌ No conversations to display');
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No conversations available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Conversations Grid */}
      <div className="grid gap-6">
        {conversations.map((conversation) => {
          const status = getStatusDisplay(conversation);
          const sessionId = conversation.sessionId || conversation.conversationId;
          const isAnalyzed = analyzedConversations.has(sessionId);
          
          return (
            <Card 
              key={conversation.conversationId}
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
              onClick={() => onConversationSelect(conversation)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex-shrink-0">
                        <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
                          <MessageSquare className="w-7 h-7 text-primary" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-foreground truncate">
                          {conversation.userName || conversation.userEmail.split('@')[0]}
                        </h3>
                        <p className="text-sm text-muted-foreground truncate">
                          {conversation.userEmail}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        <span className="font-medium">{conversation.messageCount}</span> messages
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        {getTimeSinceActivity(conversation.lastActivity)}
                      </div>
                      {conversation.supervisorEmail && (
                        <div className="flex items-center text-primary">
                          <Crown className="w-4 h-4 mr-2" />
                          <span className="font-medium">{conversation.supervisorEmail}</span>
                        </div>
                      )}
                    </div>

                    {/* TODO: AI Tags will be displayed here when backend includes analysis data in conversations list */}
                    {/* Currently analysis data is only available via individual analysis API call */}
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {isAnalyzed && (
                      <div className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded-md">
                        <Brain className="w-4 h-4 mr-1" />
                        <span className="text-xs font-medium">Analyzed</span>
                      </div>
                    )}
                    <Badge className={`${status.color} px-3 py-1 text-sm font-medium`}>
                      {status.label}
                    </Badge>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {currentPage + 1} of {totalPages}
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 0}
            >
              Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
            >
              Sau
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}