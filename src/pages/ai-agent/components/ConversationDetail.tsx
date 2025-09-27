import { useState, useEffect } from 'react';
import { ArrowLeft, MessageSquare, User, Bot, Clock, Tag, BarChart3, RefreshCw, Eye, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/custom/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  getConversationMessages,
  getExistingConversationAnalysis,
  createConversationAnalysis,
  getCategoryDescription,
  getCategoryUseCase
} from '@/api/aiAgentApi';
import type {
  Conversation,
  ChatMessage,
  ConversationContentAnalysis
} from '@/types/ai-agent.types';

interface ConversationDetailProps {
  conversation: Conversation;
  onBack: () => void;
}

export function ConversationDetail({ conversation, onBack }: ConversationDetailProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [analysis, setAnalysis] = useState<ConversationContentAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLoadedAnalysis, setHasLoadedAnalysis] = useState(false);

  useEffect(() => {
    loadConversationData();
    // Don't load analysis on component mount - let user decide when to analyze
  }, [conversation.conversationId]);

  const loadConversationData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Use the new getConversationMessages API with conversationId
      const messages = await getConversationMessages(conversation.conversationId);
      setMessages(messages || []);
      console.log(`✅ Loaded ${messages.length} messages for conversation ${conversation.conversationId}`);
    } catch (error: any) {
      console.error('Failed to load conversation data:', error);
      setError('Failed to load conversation data');
    } finally {
      setLoading(false);
    }
  };

  // Remove the automatic loadExistingAnalysis call from useEffect
  // Analysis will only be loaded when user clicks the button

  // Handle AI Analysis button click - proper GET first, then PUT if needed
  const handleAnalyzeConversation = async () => {
    setLoadingAnalysis(true);
    setError(null);

    try {
      if (hasLoadedAnalysis && analysis) {
        // User clicked "Refresh Analysis" - always call PUT to get fresh analysis
        console.log('🔄 User requested refresh - calling PUT to create new analysis');
        const freshAnalysis = await createConversationAnalysis(conversation.conversationId, {
          userId: conversation.userId,
          includeSystemMessages: false,
          maxMessages: 100
        });

        setAnalysis(freshAnalysis);
        setShowAnalysis(true);
        console.log('✅ Successfully refreshed analysis with new data from Gemini');
      } else {
        // First time clicking "AI Analysis" - follow GET first, then PUT pattern
        console.log('🔍 First analysis request - checking GET endpoint first');

        try {
          // Step 1: Always try GET first
          const existingAnalysis = await getExistingConversationAnalysis(conversation.conversationId);

          if (existingAnalysis) {
            // Found existing analysis - show it (no Gemini API call)
            console.log('✅ Found existing analysis via GET - displaying cached result');
            setAnalysis(existingAnalysis);
            setShowAnalysis(true);
            setHasLoadedAnalysis(true);
          } else {
            // This shouldn't happen since GET should return 404, but handle gracefully
            console.log('⚠️ GET returned null - falling back to PUT');
            throw new Error('No existing analysis found');
          }
        } catch (error: any) {
          // Step 2: GET returned 404 or failed - call PUT to create new analysis
          if (error.response?.status === 404 || !existingAnalysis) {
            console.log('📝 GET returned 404 - calling PUT to create new analysis with Gemini');
            const newAnalysis = await createConversationAnalysis(conversation.conversationId, {
              userId: conversation.userId,
              includeSystemMessages: false,
              maxMessages: 100
            });

            setAnalysis(newAnalysis);
            setShowAnalysis(true);
            setHasLoadedAnalysis(true);
            console.log('✅ Successfully created new analysis via PUT with Gemini API');
          } else {
            // Some other error occurred
            throw error;
          }
        }
      }
    } catch (error: any) {
      console.error('❌ Failed to analyze conversation:', error);
      setError('Failed to analyze conversation. Please try again.');
    } finally {
      setLoadingAnalysis(false);
    }
  };

  const formatMessageTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'TAKEOVER':
      case 'ADMIN_CONTROLLED': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'CANCELLED': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'Active';
      case 'TAKEOVER':
      case 'ADMIN_CONTROLLED': return 'Admin Controlled';
      case 'COMPLETED': return 'Completed';
      case 'CANCELLED': return 'Cancelled';
      default: return status;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'POTENTIAL_CUSTOMER': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'COMPLAINT': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'SUPPORT_REQUEST': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'SMALLTALK': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'TASK_COMMAND': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'MISSING_INFO': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'SPAM': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Loading data...</span>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Conversation Details</h1>
            <p className="text-muted-foreground">
              {conversation.userEmail} • {conversation.messageCount} messages
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAnalyzeConversation}
            disabled={loadingAnalysis}
          >
            {loadingAnalysis ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <BarChart3 className="w-4 h-4 mr-2" />
            )}
            {loadingAnalysis ? 'Analyzing...' : hasLoadedAnalysis ? 'Refresh Analysis' : 'AI Analysis'}
          </Button>

          {analysis && (
            <Button
              variant={showAnalysis ? "default" : "outline"}
              size="sm"
              onClick={() => setShowAnalysis(!showAnalysis)}
            >
              <Eye className="w-4 h-4 mr-2" />
              {showAnalysis ? 'Hide Analysis' : 'Show Analysis'}
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center">
          <AlertTriangle className="w-5 h-5 text-destructive mr-2" />
          <span className="text-destructive">{error}</span>
        </div>
      )}

      {/* Show analysis status indicator */}
      {hasLoadedAnalysis && !showAnalysis && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg flex items-center">
          <BarChart3 className="w-5 h-5 text-blue-600 mr-2" />
          <span className="text-blue-800 dark:text-blue-300 text-sm">
            Analysis available - Click "Show Analysis" to view results
          </span>
        </div>
      )}

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversation Info */}
        <div className="lg:col-span-1">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Conversation Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="mt-1">
                  <Badge className={getStatusColor(conversation.status)}>
                    {getStatusText(conversation.status)}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">User</label>
                <p className="mt-1 font-medium">{conversation.userName || conversation.userEmail}</p>
                <p className="text-sm text-muted-foreground">{conversation.userEmail}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Start Time</label>
                <p className="mt-1">{formatMessageTime(conversation.createdAt)}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Last Activity</label>
                <p className="mt-1">{formatMessageTime(conversation.lastActivity)}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Message Count</label>
                <p className="mt-1 font-medium">{conversation.messageCount}</p>
              </div>

              {conversation.tags && conversation.tags.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tags</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {conversation.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Analysis Results */}
          {analysis && showAnalysis && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  AI Analysis Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Primary Category</label>
                  <div className="mt-1">
                    <Badge className={getCategoryColor(analysis.primaryCategory)}>
                      {getCategoryDescription(analysis.primaryCategory)}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {getCategoryUseCase(analysis.primaryCategory)}
                  </p>
                </div>

                {analysis.secondaryCategories && analysis.secondaryCategories.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Secondary Categories</label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {analysis.secondaryCategories.map((category, index) => (
                        <Badge key={index} variant="outline" className={getCategoryColor(category)}>
                          {getCategoryDescription(category)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Confidence Level</label>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-colors ${
                          analysis.confidence >= 0.8 ? 'bg-green-500 dark:bg-green-400' :
                          analysis.confidence >= 0.6 ? 'bg-yellow-500 dark:bg-yellow-400' : 
                          'bg-red-500 dark:bg-red-400'
                        }`}
                        style={{ width: `${analysis.confidence * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">
                      {Math.round(analysis.confidence * 100)}%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {analysis.confidence >= 0.8 ? 'High confidence' :
                     analysis.confidence >= 0.6 ? 'Medium confidence' : 'Low confidence'}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Conversation Summary</label>
                  <div className="mt-2 p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm leading-relaxed">{analysis.summary}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Classification Reasoning</label>
                  <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border-l-4 border-blue-400">
                    <p className="text-sm leading-relaxed text-blue-800 dark:text-blue-300">
                      {analysis.additionalMetrics.reasoning}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Messages Analyzed</span>
                      <span className="text-sm font-medium">
                        {analysis.analyzedMessages}/{analysis.totalMessages}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div
                        className="bg-primary h-1.5 rounded-full"
                        style={{
                          width: `${(analysis.analyzedMessages / analysis.totalMessages) * 100}%`
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Analysis Time</span>
                      <span className="text-sm font-medium">
                        {formatMessageTime(analysis.analysisTimestamp)}
                      </span>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="w-3 h-3 mr-1" />
                      Analyzed by AI
                    </div>
                  </div>
                </div>

                {/* Conversation Insights */}
                <Separator />
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Detailed Information
                  </label>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-green-50 dark:bg-green-950/30 p-2 rounded border-l-2 border-green-400">
                      <span className="font-medium text-green-700 dark:text-green-400">Conversation ID</span>
                      <p className="text-green-600 dark:text-green-300 mt-1 font-mono">{analysis.conversationId}</p>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-950/30 p-2 rounded border-l-2 border-purple-400">
                      <span className="font-medium text-purple-700 dark:text-purple-400">User ID</span>
                      <p className="text-purple-600 dark:text-purple-300 mt-1">{analysis.userId}</p>
                    </div>
                  </div>
                </div>

                {/* Analysis Quality Indicator */}
                <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        analysis.confidence >= 0.8 ? 'bg-green-500 dark:bg-green-400' :
                        analysis.confidence >= 0.6 ? 'bg-yellow-500 dark:bg-yellow-400' : 
                        'bg-red-500 dark:bg-red-400'
                      }`} />
                      <span className="text-sm font-medium">
                        Analysis Quality: {
                          analysis.confidence >= 0.8 ? 'Excellent' :
                          analysis.confidence >= 0.6 ? 'Good' : 'Needs Improvement'
                        }
                      </span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      AI Analysis
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Based on {analysis.analyzedMessages} analyzed messages with {Math.round(analysis.confidence * 100)}% confidence
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Messages */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Messages ({messages.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="h-full pb-4">
              <ScrollArea className="h-full pr-4">
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      No messages found in this conversation
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.messageId}
                        className={`flex gap-3 ${
                          message.senderType === 'USER' ? 'flex-row-reverse' : ''
                        }`}
                      >
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          message.senderType === 'USER' 
                            ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' 
                            : message.senderType === 'SUPERVISOR'
                            ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                            : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                        }`}>
                          {message.senderType === 'USER' ? (
                            <User className="w-4 h-4" />
                          ) : (
                            <Bot className="w-4 h-4" />
                          )}
                        </div>

                        <div className={`flex-1 ${
                          message.senderType === 'USER' ? 'text-right' : ''
                        }`}>
                          <div className={`inline-block max-w-[80%] p-3 rounded-lg ${
                            message.senderType === 'USER'
                              ? 'bg-primary text-primary-foreground'
                              : message.senderType === 'SUPERVISOR'
                              ? 'bg-destructive text-destructive-foreground'
                              : 'bg-muted text-foreground'
                          }`}>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                              {message.content}
                            </p>

                            {message.intent && (
                              <div className="mt-2 pt-2 border-t border-white/20 dark:border-gray-600">
                                <p className="text-xs opacity-75">
                                  Intent: {message.intent}
                                </p>
                              </div>
                            )}

                            {message.confidence && (
                              <div className="mt-1">
                                <p className="text-xs opacity-75">
                                  Confidence: {Math.round(message.confidence * 100)}%
                                </p>
                              </div>
                            )}
                          </div>

                          <div className={`mt-1 flex items-center gap-2 text-xs text-muted-foreground ${
                            message.senderType === 'USER' ? 'justify-end' : ''
                          }`}>
                            <Clock className="w-3 h-3" />
                            <span>{formatMessageTime(message.timestamp)}</span>

                            {message.senderType === 'SUPERVISOR' && (
                              <Badge variant="outline" className="text-xs">
                                Admin
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
