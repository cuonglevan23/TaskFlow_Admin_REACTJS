import { AlertTriangle, Clock, Crown, MessageSquare, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/custom/button';
import type { ActiveSession, Conversation } from '@/types/ai-agent.types';
import { getTimeSinceActivity } from '@/api/aiAgentApi';

interface ActiveSessionsListProps {
  sessions: ActiveSession[];
  onSessionSelect: (conversation: Conversation) => void;
  onRefresh: () => void;
}

export function ActiveSessionsList({ 
  sessions, 
  onSessionSelect, 
  onRefresh 
}: ActiveSessionsListProps) {
  
  const needsInterventionCount = sessions.filter(s => s.status === 'NEEDS_INTERVENTION').length;
  
  const handleSessionClick = (session: ActiveSession) => {
    // Convert ActiveSession to Conversation format for compatibility
    const conversation: Conversation = {
      conversationId: session.id,
      sessionId: session.id,
      title: `Session with ${session.userName}`,
      status: session.status === 'NEEDS_INTERVENTION' ? 'TAKEOVER' : 'ACTIVE',
      userId: session.userId,
      userEmail: session.userEmail,
      userName: session.userName,
      agentActive: session.status === 'ACTIVE',
      aiPersonality: 'default',
      language: 'vi',
      supervisorId: session.isAdminTakeover ? (session.adminId?.toString() || null) : null,
      supervisorEmail: null,
      takenOverAt: session.isAdminTakeover ? session.lastActivity : null,
      messageCount: session.messageCount,
      createdAt: session.startTime,
      startTime: session.startTime,
      updatedAt: session.lastActivity,
      lastActivity: session.lastActivity,
      satisfactionScore: 0,
      tags: [],
      category: 'GENERAL' as const
    };
    onSessionSelect(conversation);
  };

  return (
    <div className="space-y-4">
      {/* Header with refresh button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Phiên đang hoạt động</h3>
          <p className="text-sm text-gray-500">
            {sessions.length} phiên đang hoạt động
            {needsInterventionCount > 0 && (
              <span className="text-red-600 ml-2">
                · {needsInterventionCount} cần can thiệp
              </span>
            )}
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRefresh}
          className="flex items-center"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Làm mới
        </Button>
      </div>

      {sessions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Clock className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không có phiên hoạt động</h3>
            <p className="text-gray-500 text-center">
              Hiện tại không có phiên chat nào đang hoạt động.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {sessions.map((session) => (
            <Card 
              key={session.id}
              className={`cursor-pointer hover:shadow-md transition-shadow ${
                session.status === 'NEEDS_INTERVENTION' ? 'border-red-200 bg-red-50' : ''
              }`}
              onClick={() => handleSessionClick(session)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="flex-shrink-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          session.status === 'NEEDS_INTERVENTION' 
                            ? 'bg-red-100' 
                            : session.isAdminTakeover 
                            ? 'bg-blue-100' 
                            : 'bg-green-100'
                        }`}>
                          {session.status === 'NEEDS_INTERVENTION' ? (
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                          ) : session.isAdminTakeover ? (
                            <Crown className="w-5 h-5 text-blue-600" />
                          ) : (
                            <MessageSquare className="w-5 h-5 text-green-600" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900">
                          {session.userName}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {session.userEmail}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center">
                        <MessageSquare className="w-3 h-3 mr-1" />
                        {session.messageCount} tin nhắn
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        Bắt đầu {getTimeSinceActivity(session.startTime)}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        Hoạt động {getTimeSinceActivity(session.lastActivity)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2">
                    {session.status === 'NEEDS_INTERVENTION' && (
                      <Badge variant="destructive">
                        Cần can thiệp
                      </Badge>
                    )}
                    {session.isAdminTakeover && (
                      <Badge variant="secondary">
                        Admin kiểm soát
                      </Badge>
                    )}
                    <Badge variant={session.status === 'ACTIVE' ? 'default' : 'outline'}>
                      {session.status === 'ACTIVE' ? 'Đang hoạt động' : 'Cần can thiệp'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}