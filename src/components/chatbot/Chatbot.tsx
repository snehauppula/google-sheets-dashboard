
import { useState } from 'react';
import { MessageCircle, Send, X, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{id: string, text: string, sender: 'user' | 'bot', timestamp: Date}>>([
    {
      id: '1',
      text: 'Hi! I\'m your cyberpunk assistant. How can I help you with your dashboard today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const WEBHOOK_URL = 'https://snehauppula.app.n8n.cloud/webhook-test/97cc0fd1-9dfc-4732-b3b7-90dbb0608c89';

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: message,
      sender: 'user' as const,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      console.log('Sending message to webhook:', message);
      
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify({
          message: message,
          timestamp: new Date().toISOString(),
          source: 'cyberpunk-dashboard'
        }),
      });

      // Since we're using no-cors, we can't read the response
      // Simulate a bot response for demo purposes
      setTimeout(() => {
        const botResponse = {
          id: (Date.now() + 1).toString(),
          text: `I received your message: "${message}". The webhook has been triggered successfully!`,
          sender: 'bot' as const,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);
        setIsLoading(false);
      }, 1000);

      toast({
        title: "Message Sent",
        description: "Your message has been sent to the webhook successfully.",
      });

    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
      
      const errorResponse = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error processing your request. Please try again later.',
        sender: 'bot' as const,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);

      toast({
        title: "Error",
        description: "Failed to send message to webhook.",
        variant: "destructive",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full glass neon-border hover:neon-glow transition-all duration-300 z-50 ${isOpen ? 'rotate-180' : ''}`}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-cyber-cyan" />
        ) : (
          <MessageCircle className="w-6 h-6 text-cyber-cyan animate-pulse" />
        )}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 glass-card neon-border rounded-lg z-40 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-cyber-cyan/30">
            <h3 className="font-semibold gradient-text flex items-center gap-2">
              <Bot className="w-5 h-5 text-cyber-cyan animate-pulse" />
              Cyber Assistant
            </h3>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  msg.sender === 'user' 
                    ? 'bg-cyber-cyan/20 neon-border' 
                    : 'bg-cyber-purple/20 neon-border'
                }`}>
                  {msg.sender === 'user' ? (
                    <User className="w-4 h-4 text-cyber-cyan" />
                  ) : (
                    <Bot className="w-4 h-4 text-cyber-purple" />
                  )}
                </div>
                <div className={`max-w-60 p-3 rounded-lg text-sm ${
                  msg.sender === 'user'
                    ? 'bg-cyber-cyan/20 text-white border border-cyber-cyan/30'
                    : 'bg-cyber-purple/20 text-white border border-cyber-purple/30'
                }`}>
                  {msg.text}
                  <div className="text-xs text-gray-400 mt-1">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-cyber-purple/20 neon-border flex items-center justify-center">
                  <Bot className="w-4 h-4 text-cyber-purple animate-pulse" />
                </div>
                <div className="bg-cyber-purple/20 border border-cyber-purple/30 rounded-lg p-3 text-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-cyber-purple rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-cyber-purple rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-cyber-purple rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-cyber-cyan/30">
            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="glass neon-border text-white placeholder-gray-400 flex-1"
                disabled={isLoading}
              />
              <Button
                onClick={sendMessage}
                disabled={!message.trim() || isLoading}
                size="sm"
                className="glass neon-border hover:neon-glow"
              >
                <Send className="w-4 h-4 text-cyber-cyan" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
