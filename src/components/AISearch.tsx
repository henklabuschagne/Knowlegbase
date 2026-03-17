import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAppStore } from '../hooks/useAppStore';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { 
  Bot, 
  User, 
  Send, 
  Loader2, 
  Sparkles, 
  FileText, 
  X,
  Settings,
  Tag as TagIcon
} from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  relevantArticles?: { articleId: number; title: string }[];
}

export function AISearch() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { tags: allTags, actions } = useAppStore('tags', 'search');
  const [message, setMessage] = useState('');
  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [showTagFilter, setShowTagFilter] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversationHistory]);

  const handleSendMessage = async () => {
    if (!message.trim() || loading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };

    setConversationHistory(prev => [...prev, userMessage]);
    setMessage('');
    setLoading(true);
    setError('');

    try {
      // Mock AI response since the real AI API requires actual API keys
      const mockResponses = [
        "Based on the knowledge base articles, here's what I found related to your question. The system supports multiple article categories, version control, and approval workflows.",
        "I found several relevant articles in the knowledge base. The documentation covers getting started guides, troubleshooting steps, and feature overviews.",
        "According to the knowledge base, this topic is covered in multiple articles. Let me summarize the key points for you.",
      ];

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: mockResponses[Math.floor(Math.random() * mockResponses.length)],
        timestamp: new Date().toISOString(),
        relevantArticles: [],
      };

      setConversationHistory(prev => [...prev, assistantMessage]);
      
      // Track search in store
      await actions.addSearchHistory(userMessage.content, 0);
    } catch (err: any) {
      setError('Failed to get AI response. Please try again.');
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearConversation = () => {
    setConversationHistory([]);
    setError('');
  };

  const toggleTag = (tagId: number) => {
    setSelectedTags(prev =>
      prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId]
    );
  };

  const getTagsByType = () => {
    return allTags.reduce((acc, tag) => {
      if (!acc[tag.tagTypeName]) {
        acc[tag.tagTypeName] = [];
      }
      acc[tag.tagTypeName].push(tag);
      return acc;
    }, {} as Record<string, typeof allTags[number][]>);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!user) return null;

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Sparkles className="size-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl flex items-center gap-2">
                AI-Powered Search
              </h1>
              <p className="text-sm text-muted-foreground">
                Ask questions and get intelligent answers from the knowledge base
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setShowTagFilter(!showTagFilter)}
            >
              <TagIcon className="size-4 mr-2" />
              Filter by Tags
              {selectedTags.length > 0 && (
                <Badge className="ml-2" variant="secondary">
                  {selectedTags.length}
                </Badge>
              )}
            </Button>
            <Button variant="outline" onClick={() => navigate('/settings/ai')}>
              <Settings className="size-4 mr-2" />
              API Settings
            </Button>
            {conversationHistory.length > 0 && (
              <Button variant="outline" onClick={handleClearConversation}>
                Clear Chat
              </Button>
            )}
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </div>

        {/* Tag Filter Panel */}
        {showTagFilter && (
          <Card className="mt-4 max-w-6xl mx-auto">
            <CardContent className="pt-6">
              <div className="space-y-4">
                {Object.entries(getTagsByType()).map(([typeName, tags]) => (
                  <div key={typeName}>
                    <p className="text-sm mb-2">{typeName}</p>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Badge
                          key={tag.tagId}
                          variant={selectedTags.includes(tag.tagId) ? 'default' : 'outline'}
                          className="cursor-pointer"
                          style={{
                            backgroundColor:
                              selectedTags.includes(tag.tagId) && tag.colorCode
                                ? tag.colorCode
                                : undefined,
                            borderColor: tag.colorCode || undefined,
                          }}
                          onClick={() => toggleTag(tag.tagId)}
                        >
                          {tag.tagName}
                          {selectedTags.includes(tag.tagId) && (
                            <X className="size-3 ml-1" />
                          )}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden max-w-6xl w-full mx-auto px-6 py-6">
        <Card className="h-full flex flex-col">
          <ScrollArea ref={scrollRef} className="flex-1 p-6">
            {/* Welcome Message */}
            {conversationHistory.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="bg-primary/10 p-6 rounded-full mb-4">
                  <Bot className="size-12 text-primary" />
                </div>
                <h2 className="text-2xl mb-2">
                  How can I help you today?
                </h2>
                <p className="text-muted-foreground max-w-md">
                  Ask me anything about the knowledge base. I'll search through articles
                  and provide you with accurate, helpful answers.
                </p>
                <div className="mt-8 grid grid-cols-2 gap-4 max-w-2xl">
                  <Card 
                    className="p-4 cursor-pointer hover:border-primary transition-colors"
                    onClick={() => setMessage('How do I get started?')}
                  >
                    <p className="text-sm">How do I get started?</p>
                  </Card>
                  <Card 
                    className="p-4 cursor-pointer hover:border-primary transition-colors"
                    onClick={() => setMessage('Show me recent updates')}
                  >
                    <p className="text-sm">Show me recent updates</p>
                  </Card>
                  <Card 
                    className="p-4 cursor-pointer hover:border-primary transition-colors"
                    onClick={() => setMessage('What features are available?')}
                  >
                    <p className="text-sm">What features are available?</p>
                  </Card>
                  <Card 
                    className="p-4 cursor-pointer hover:border-primary transition-colors"
                    onClick={() => setMessage('How do I troubleshoot issues?')}
                  >
                    <p className="text-sm">How do I troubleshoot issues?</p>
                  </Card>
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="space-y-6">
              {conversationHistory.map((msg, index) => (
                <div key={index}>
                  <div
                    className={`flex gap-4 ${
                      msg.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="bg-primary/10 p-2 rounded-lg h-fit">
                        <Bot className="size-5 text-primary" />
                      </div>
                    )}
                    <div
                      className={`max-w-3xl ${
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-gray-100'
                      } rounded-lg p-4`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                      <p
                        className={`text-xs mt-2 ${
                          msg.role === 'user'
                            ? 'text-primary-foreground/70'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                    {msg.role === 'user' && (
                      <div className="bg-primary p-2 rounded-lg h-fit">
                        <User className="size-5 text-primary-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Relevant Articles */}
                  {msg.role === 'assistant' && msg.relevantArticles && msg.relevantArticles.length > 0 && (
                    <div className="ml-14 mt-3">
                      <p className="text-sm text-muted-foreground mb-2">
                        Related articles:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {msg.relevantArticles.slice(0, 5).map((article) => (
                          <Button
                            key={article.articleId}
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/articles/${article.articleId}`)}
                            className="text-xs"
                          >
                            <FileText className="size-3 mr-1" />
                            {article.title}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Loading Indicator */}
              {loading && (
                <div className="flex gap-4">
                  <div className="bg-primary/10 p-2 rounded-lg h-fit">
                    <Bot className="size-5 text-primary" />
                  </div>
                  <div className="bg-gray-100 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <Loader2 className="size-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">
                        Thinking...
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <Separator />

          {/* Input Area */}
          <div className="p-4">
            {error && (
              <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask a question..."
                disabled={loading}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={loading || !message.trim()}>
                {loading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Send className="size-4" />
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}