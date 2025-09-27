import { useState, useEffect } from 'react';
import { Search, MessageSquare, Users, Clock, Crown, BarChart3} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/custom/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  getConversations, 
  getActiveSessions, 
  getAuditStatistics
} from '@/api/aiAgentApi';
import type { 
  Conversation, 
  ActiveSession, 
  AuditStatistics 
} from '@/types/ai-agent.types';
import { ConversationList } from './components/ConversationList';
import { ActiveSessionsList } from './components/ActiveSessionsList';
import { ConversationDetail } from './components/ConversationDetail';


import { AnalysisStatisticsView } from './components/AnalysisStatistics.tsx';

export default function AIAgentManagement() {
  // State management
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);
  const [statistics, setStatistics] = useState<AuditStatistics | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [activeTab, setActiveTab] = useState('conversations');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  // TODO: Add analyzed conversations tracking when backend endpoint is available
  // const [analyzedConversations, setAnalyzedConversations] = useState<Set<string>>(new Set());

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 20;

  // Load initial data
  useEffect(() => {
    loadInitialData();
    // Set up auto refresh every 30 seconds for active sessions
    const interval = setInterval(loadActiveSessions, 30000);
    return () => clearInterval(interval);
  }, []);

  // Load conversations when page changes
  useEffect(() => {
    loadConversations();
  }, [currentPage, searchTerm, filterStatus]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadConversations(),
        loadActiveSessions(),
        loadStatistics()
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadConversations = async () => {
    try {
      console.log('🔍 Loading conversations, page:', currentPage, 'pageSize:', pageSize);
      const response = await getConversations(currentPage, pageSize);
      console.log('📋 Conversations API response:', response);
      console.log('📋 Conversations array:', response.conversations);
      console.log('📋 Total conversations:', response.conversations?.length || 0);
      setConversations(response.conversations || []);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  };

  const loadActiveSessions = async () => {
    try {
      const response = await getActiveSessions();
      setActiveSessions(response.sessions || []);
    } catch (error) {
      console.error('Failed to load active sessions:', error);
    }
  };

  const loadStatistics = async () => {
    try {
      const stats = await getAuditStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error('Failed to load statistics:', error);
    }
  };

  const handleConversationSelect = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  const handleBackToList = () => {
    setSelectedConversation(null);
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = searchTerm === '' || 
      (conv.userName && conv.userName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      conv.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Map filter status to actual backend status
    const statusMapping = {
      'all': null,
      'active': 'ACTIVE',
      'takeover': 'TAKEOVER', 
      'completed': 'COMPLETED',
      'cancelled': 'CANCELLED'
    };
    
    const backendStatus = statusMapping[filterStatus as keyof typeof statusMapping];
    const matchesFilter = filterStatus === 'all' || conv.status === backendStatus;
    
    return matchesSearch && matchesFilter;
  });

  console.log('🔍 Filter debug:');
  console.log('- Original conversations:', conversations.length);
  console.log('- Search term:', searchTerm);
  console.log('- Filter status:', filterStatus);
  console.log('- Filtered conversations:', filteredConversations.length);
  console.log('- Sample conversation:', conversations[0]);
  console.log('- Sample conversation status:', conversations[0]?.status);
  console.log('- Available statuses:', [...new Set(conversations.map(c => c.status))]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-2">Loading data...</span>
      </div>
    );
  }

  // Show conversation detail if selected
  if (selectedConversation) {
    return (
      <ConversationDetail 
        conversation={selectedConversation}
        onBack={handleBackToList}
      />
    );
  }

  return (
    <div className="h-screen flex flex-col p-6">
      {/* Header */}
      <div className="mb-8">
        <div>
          <h1 className="text-4xl font-bold">AI Agent Management</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Manage conversations between users and AI chatbot
          </p>
        </div>
      </div>

      {/* Statistics Overview */}
      {statistics && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-base font-semibold">Total Messages</CardTitle>
              <MessageSquare className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{statistics.totalMessages.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-base font-semibold">Total Users</CardTitle>
              <Users className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{statistics.totalUsers.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-base font-semibold">Active Sessions</CardTitle>
              <Clock className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{statistics.activeSessions}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-base font-semibold">Admin Controlled</CardTitle>
              <Crown className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{statistics.adminTakeoverSessions}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <TabsList className="grid grid-cols-4 h-12 p-1">
            <TabsTrigger value="conversations" className="text-base font-medium">
              Conversations ({conversations.length})
            </TabsTrigger>
            <TabsTrigger value="active" className="text-base font-medium">
              Active ({activeSessions.length})
            </TabsTrigger>
            <TabsTrigger value="analysis" className="text-base font-medium flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              AI Analysis
            </TabsTrigger>
          </TabsList>
          

        </div>

        <TabsContent value="conversations" className="flex-1 flex flex-col space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search by user name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                size="default"
                onClick={() => setFilterStatus('all')}
                className="h-12 px-6"
              >
                All
              </Button>
              <Button
                variant={filterStatus === 'ACTIVE' ? 'default' : 'outline'}
                size="default"
                onClick={() => setFilterStatus('ACTIVE')}
                className="h-12 px-6"
              >
                Active
              </Button>
              <Button
                variant={filterStatus === 'ADMIN_CONTROLLED' ? 'default' : 'outline'}
                size="default"
                onClick={() => setFilterStatus('ADMIN_CONTROLLED')}
                className="h-12 px-6"
              >
                Admin Controlled
              </Button>
            </div>
          </div>

          {/* Conversations List - Fixed height with internal scrolling */}
          <div className="bg-background rounded-lg border" style={{ height: '600px' }}>
            <div className="h-full overflow-y-auto p-4">
              <ConversationList 
                conversations={filteredConversations}
                onConversationSelect={handleConversationSelect}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                analyzedConversations={new Set()}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="active" className="flex-1">
          <div className="bg-background rounded-lg border" style={{ height: '600px' }}>
            <div className="h-full overflow-y-auto p-4">
              <ActiveSessionsList 
                sessions={activeSessions}
                onSessionSelect={handleConversationSelect}
                onRefresh={loadActiveSessions}
              />
            </div>
          </div>
        </TabsContent>


        <TabsContent value="analysis" className="flex-1">
          <div className="bg-background rounded-lg border" style={{ height: '600px' }}>
            <div className="h-full overflow-y-auto p-4">
              <AnalysisStatisticsView />
            </div>
          </div>
        </TabsContent>
      </Tabs>
      

    </div>
  );
}