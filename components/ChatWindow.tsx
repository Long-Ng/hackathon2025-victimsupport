
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import MessageBubble from './MessageBubble';
import { PaperAirplaneIcon } from './icons/PaperAirplaneIcon';
import { FileTextIcon } from './icons/FileTextIcon';
import { BotIcon } from './icons/BotIcon';

interface ChatWindowProps {
  chatHistory: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  onDraftReport: () => void;
  error: string | null;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ chatHistory, isLoading, onSendMessage, onDraftReport, error }) => {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSendMessage(inputMessage);
    setInputMessage('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-150px)] max-h-[800px] bg-white dark:bg-slate-800 rounded-lg shadow-xl overflow-hidden">
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {chatHistory.map((msg, index) => (
          <MessageBubble key={index} message={msg} />
        ))}
        {isLoading && chatHistory[chatHistory.length-1].role === 'user' && (
           <div className="flex items-start space-x-3 animate-pulse">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                    <BotIcon className="w-6 h-6 text-slate-500"/>
                </div>
                <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      {error && <div className="p-4 text-sm text-red-700 bg-red-100 dark:bg-red-900 dark:text-red-200 border-t border-red-200 dark:border-red-800">{error}</div>}
      <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center space-x-2">
            <button 
                onClick={onDraftReport}
                disabled={isLoading || chatHistory.length < 2}
                className="p-2 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 disabled:text-slate-300 dark:disabled:text-slate-600 disabled:cursor-not-allowed transition-colors"
                title="Draft Incident Report from Chat History"
            >
                <FileTextIcon className="w-6 h-6"/>
            </button>
            <form onSubmit={handleSubmit} className="flex-1 flex items-center">
            <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message here..."
                className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
            />
            <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="ml-2 p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:bg-slate-400 dark:disabled:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                aria-label="Send message"
            >
                <PaperAirplaneIcon className="w-5 h-5" />
            </button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
