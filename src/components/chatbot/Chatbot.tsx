
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
    const currentMessage = message;
    setMessage('');
    setIsLoading(true);

    try {
      console.log('Sending message to webhook:', currentMessage);
      
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentMessage,
          timestamp: new Date().toISOString(),
          source: 'cyberpunk-dashboard'
        }),
      });

      console.log('Webhook response status:', response.status);
      
      if (response.ok) {
        const responseData = await response.json();
        console.log('Webhook response data:', responseData);
        
        // Extract the actual message from the webhook response
        let botMessageText = 'Message received successfully!';
        if (responseData.output) {
          botMessageText = responseData.output;
        } else if (responseData.message) {
          botMessageText = responseData.message;
        } else if (typeof responseData === 'string') {
          botMessageText = responseData;
        }
        
        const botResponse = {
          id: (Date.now() + 1).toString(),
          text: botMessageText,
          sender: 'bot' as const,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);

        toast({
          title: "Message Sent",
          description: "Your message has been sent successfully.",
        });
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      
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
    } finally {
      setIsLoading(false);
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
        className={`fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-2xl border-2 border-cyber-cyan/50 bg-gradient-to-r from-cyber-purple/20 to-cyber-cyan/20 backdrop-blur-xl hover:from-cyber-cyan/30 hover:to-cyber-purple/30 transition-all duration-500 z-50 ${isOpen ? 'rotate-180 scale-110' : 'hover:scale-105'}`}
      >
        {isOpen ? (
          <X className="w-7 h-7 text-cyber-cyan drop-shadow-lg" />
        ) : (
          <MessageCircle className="w-7 h-7 text-cyber-cyan animate-pulse drop-shadow-lg" />
        )}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-28 right-6 w-96 h-[32rem] bg-gradient-to-br from-background/95 to-background/90 backdrop-blur-2xl border-2 border-cyber-cyan/50 rounded-2xl shadow-2xl z-40 flex flex-col overflow-hidden">
          {/* Enhanced Header */}
          <div className="p-6 border-b-2 border-cyber-cyan/30 bg-gradient-to-r from-cyber-purple/20 to-cyber-cyan/20">
            <h3 className="text-xl font-bold bg-gradient-to-r from-cyber-cyan to-cyber-purple bg-clip-text text-transparent flex items-center gap-3">
              <Bot className="w-6 h-6 text-cyber-cyan animate-pulse drop-shadow-lg" />
              Cyber Assistant
            </h3>
            <p className="text-sm text-gray-300 mt-1">AI-powered dashboard assistant</p>
          </div>

          {/* Enhanced Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-gradient-to-b from-transparent to-background/20">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-in slide-in-from-bottom duration-300`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 ${
                  msg.sender === 'user' 
                    ? 'bg-gradient-to-br from-cyber-cyan/40 to-cyber-cyan/20 border-cyber-cyan/60 backdrop-blur-xl' 
                    : 'bg-gradient-to-br from-cyber-purple/40 to-cyber-purple/20 border-cyber-purple/60 backdrop-blur-xl'
                }`}>
                  {msg.sender === 'user' ? (
                    <User className="w-5 h-5 text-cyber-cyan drop-shadow-sm" />
                  ) : (
                    <Bot className="w-5 h-5 text-cyber-purple drop-shadow-sm" />
                  )}
                </div>
                <div className={`max-w-72 p-4 rounded-2xl text-sm shadow-lg backdrop-blur-xl border-2 ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-br from-cyber-cyan/30 to-cyber-cyan/15 text-white border-cyber-cyan/50 rounded-tr-md'
                    : 'bg-gradient-to-br from-cyber-purple/30 to-cyber-purple/15 text-white border-cyber-purple/50 rounded-tl-md'
                }`}>
                  <div className="leading-relaxed text-white">{msg.text}</div>
                  <div className="text-xs text-gray-300 mt-2 font-mono">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-center gap-3 animate-in slide-in-from-bottom duration-300">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyber-purple/40 to-cyber-purple/20 border-2 border-cyber-purple/60 backdrop-blur-xl flex items-center justify-center shadow-lg">
                  <Bot className="w-5 h-5 text-cyber-purple animate-pulse drop-shadow-sm" />
                </div>
                <div className="bg-gradient-to-br from-cyber-purple/30 to-cyber-purple/15 border-2 border-cyber-purple/50 backdrop-blur-xl rounded-2xl rounded-tl-md p-4 shadow-lg">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-cyber-purple rounded-full animate-bounce shadow-sm" />
                    <div className="w-2 h-2 bg-cyber-purple rounded-full animate-bounce shadow-sm" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-cyber-purple rounded-full animate-bounce shadow-sm" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Input Area */}
          <div className="p-4 border-t-2 border-cyber-cyan/30 bg-gradient-to-r from-cyber-purple/10 to-cyber-cyan/10 backdrop-blur-xl">
            <div className="flex gap-3">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 bg-background/90 backdrop-blur-xl border-2 border-cyber-cyan/40 text-white placeholder-gray-300 rounded-xl px-4 py-3 focus:border-cyber-cyan focus:ring-2 focus:ring-cyber-cyan/30 transition-all duration-300 shadow-lg"
                disabled={isLoading}
              />
              <Button
                onClick={sendMessage}
                disabled={!message.trim() || isLoading}
                className="w-12 h-12 rounded-xl bg-gradient-to-r from-cyber-cyan/30 to-cyber-purple/30 backdrop-blur-xl border-2 border-cyber-cyan/40 hover:from-cyber-cyan/40 hover:to-cyber-purple/40 hover:border-cyber-cyan/60 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5 text-cyber-cyan drop-shadow-sm" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
