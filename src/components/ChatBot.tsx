import React, { useState, useEffect, useRef } from 'react';
import getFinancialAdvice from '../services/api';
import { FEATURES, THEME } from '../config';
import { useHistory } from 'react-router-dom';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  sources?: string[];
  relatedTopics?: string[];
}

// Suggested questions to help users get started
const suggestedQuestions = [
  "How much should I save for retirement?",
  "What's the best way to invest $10,000?",
  "How can I reduce my tax burden?",
  "Should I pay off debt or invest?",
  "How do I create a budget that works?"
];

const ChatBot = () => {
  const history = useHistory();

  // Don't render the chatbot if it's disabled in config
  if (!FEATURES.CHATBOT_ENABLED) return null;

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your financial assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [conversationContext, setConversationContext] = useState<string>('');
  const [showSuggestions, setShowSuggestions] = useState(true);

  // Scroll to bottom of messages when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Save chat history to localStorage if enabled
  useEffect(() => {
    if (FEATURES.SAVE_CHAT_HISTORY && messages.length > 1) {
      localStorage.setItem('chatHistory', JSON.stringify(messages));
    }
  }, [messages]);

  // Load chat history from localStorage if enabled
  useEffect(() => {
    if (FEATURES.SAVE_CHAT_HISTORY) {
      const savedChat = localStorage.getItem('chatHistory');
      if (savedChat) {
        try {
          const parsedChat = JSON.parse(savedChat);
          // Convert string timestamps back to Date objects
          const formattedChat = parsedChat.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
          setMessages(formattedChat);
        } catch (error) {
          console.error('Error parsing saved chat history:', error);
        }
      }
    }
  }, []);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const sendMessage = async (text: string = inputText) => {
    if (text.trim() === '') return;

    // Hide suggestions after user sends a message
    setShowSuggestions(false);

    // Add user message to chat
    const userMessage: Message = {
      id: messages.length + 1,
      text: text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Call our API service
      const response = await getFinancialAdvice(text, undefined, conversationContext);
      
      // Update conversation context
      setConversationContext(prev => 
        prev + `\nUser: ${text}\nAssistant: ${response.response}`
      );
      
      // Add bot response to chat
      const botMessage: Message = {
        id: messages.length + 2,
        text: response.response,
        sender: 'bot',
        timestamp: new Date(),
        sources: response.sources,
        relatedTopics: response.relatedTopics
      };

      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error fetching from API:', error);
      
      // Add error message from bot
      const errorMessage: Message = {
        id: messages.length + 2,
        text: "I'm having trouble connecting to my knowledge base. Please try again later.",
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    sendMessage(question);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        text: "Hello! I'm your financial assistant. How can I help you today?",
        sender: 'bot',
        timestamp: new Date()
      }
    ]);
    setConversationContext('');
    setShowSuggestions(true);
    
    if (FEATURES.SAVE_CHAT_HISTORY) {
      localStorage.removeItem('chatHistory');
    }
  };

  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Chat toggle button */}
      <button
        onClick={toggleChat}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: THEME.SECONDARY,
          color: THEME.PRIMARY,
          border: 'none',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          zIndex: 1000,
          transition: 'all 0.3s ease'
        }}
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 12H8.01M12 12H12.01M16 12H16.01M21 12C21 16.418 16.97 20 12 20C10.5 20 9.06 19.714 7.8 19.2L3 20L4.3 15.9C3.5 14.6 3 13.1 3 11.5C3 7.082 7.03 3.5 12 3.5C16.97 3.5 21 7.082 21 12Z" 
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '90px',
            right: '20px',
            width: '350px',
            height: '500px',
            backgroundColor: 'white',
            borderRadius: '10px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 1000,
            border: `1px solid rgba(0, 208, 132, 0.3)`
          }}
        >
          {/* Chat header */}
          <div
            style={{
              backgroundColor: THEME.PRIMARY,
              color: THEME.TEXT_LIGHT,
              padding: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: THEME.SECONDARY,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '10px',
                  color: THEME.PRIMARY,
                  fontWeight: 'bold'
                }}
              >
                YW
              </div>
              <span style={{ fontWeight: '600' }}>Financial Assistant</span>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              {/* Clear chat button */}
              {messages.length > 1 && (
                <button
                  onClick={clearChat}
                  title="Clear chat"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              )}
              
              {/* Close button */}
              <button
                onClick={toggleChat}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>

          {/* Chat messages */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '15px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              backgroundColor: THEME.BG_LIGHT
            }}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%'
                }}
              >
                <div
                  style={{
                    backgroundColor: message.sender === 'user' ? THEME.SECONDARY : 'white',
                    color: message.sender === 'user' ? THEME.PRIMARY : THEME.TEXT_DARK,
                    padding: '10px 15px',
                    borderRadius: message.sender === 'user' ? '18px 18px 0 18px' : '18px 18px 18px 0',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                    border: message.sender === 'user' ? 'none' : '1px solid #e5e7eb'
                  }}
                >
                  {message.text}
                  
                  {/* Display related topics if available */}
                  {message.relatedTopics && message.relatedTopics.length > 0 && (
                    <div style={{ marginTop: '10px', fontSize: '0.85rem' }}>
                      <div style={{ fontWeight: '600', color: THEME.TEXT_MUTED, marginBottom: '4px' }}>Related Topics:</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {message.relatedTopics.map((topic, index) => (
                          <span 
                            key={index}
                            style={{ 
                              backgroundColor: 'rgba(0, 208, 132, 0.1)', 
                              color: THEME.PRIMARY,
                              padding: '2px 8px',
                              borderRadius: '12px',
                              fontSize: '0.75rem',
                              cursor: 'pointer'
                            }}
                            onClick={() => sendMessage(`Tell me about ${topic}`)}
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Display sources if available */}
                  {message.sources && message.sources.length > 0 && (
                    <div style={{ marginTop: '10px', fontSize: '0.75rem', color: THEME.TEXT_MUTED }}>
                      <div style={{ fontWeight: '600', marginBottom: '2px' }}>Sources:</div>
                      <ul style={{ margin: 0, paddingLeft: '16px' }}>
                        {message.sources.map((source, index) => (
                          <li key={index}>{source}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div
                  style={{
                    fontSize: '0.75rem',
                    color: THEME.TEXT_MUTED,
                    marginTop: '4px',
                    textAlign: message.sender === 'user' ? 'right' : 'left'
                  }}
                >
                  {formatTime(message.timestamp)}
                </div>
              </div>
            ))}
            
            {/* Suggested questions */}
            {showSuggestions && messages.length === 1 && (
              <div style={{ marginTop: '10px' }}>
                <div style={{ fontSize: '0.875rem', color: THEME.TEXT_MUTED, marginBottom: '8px' }}>
                  Try asking:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestedQuestion(question)}
                      style={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        textAlign: 'left',
                        fontSize: '0.875rem',
                        color: THEME.TEXT_DARK,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(0, 208, 132, 0.1)';
                        e.currentTarget.style.borderColor = THEME.SECONDARY;
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'white';
                        e.currentTarget.style.borderColor = '#e5e7eb';
                      }}
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Loading indicator */}
            {isLoading && (
              <div
                style={{
                  alignSelf: 'flex-start',
                  backgroundColor: 'white',
                  padding: '15px',
                  borderRadius: '18px 18px 18px 0',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e5e7eb',
                  display: 'flex',
                  gap: '4px'
                }}
              >
                <div className="typing-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: THEME.SECONDARY, animation: 'typingAnimation 1s infinite ease-in-out' }}></div>
                <div className="typing-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: THEME.SECONDARY, animation: 'typingAnimation 1s infinite ease-in-out 0.2s' }}></div>
                <div className="typing-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: THEME.SECONDARY, animation: 'typingAnimation 1s infinite ease-in-out 0.4s' }}></div>
                <style>
                  {`
                    @keyframes typingAnimation {
                      0%, 100% { transform: translateY(0); }
                      50% { transform: translateY(-5px); }
                    }
                  `}
                </style>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat input */}
          <div
            style={{
              padding: '15px',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              gap: '10px',
              backgroundColor: 'white'
            }}
          >
            <input
              type="text"
              value={inputText}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Ask about financial advice..."
              style={{
                flex: 1,
                padding: '10px 15px',
                borderRadius: '20px',
                border: '1px solid #d1d5db',
                outline: 'none',
                fontSize: '0.9rem'
              }}
              disabled={isLoading}
            />
            <button
              onClick={() => sendMessage()}
              disabled={isLoading || inputText.trim() === ''}
              style={{
                backgroundColor: THEME.SECONDARY,
                color: THEME.PRIMARY,
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: inputText.trim() === '' ? 'not-allowed' : 'pointer',
                opacity: inputText.trim() === '' ? 0.7 : 1
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot; 