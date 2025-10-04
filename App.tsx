
import React, { useState, useEffect, useCallback } from 'react';
import { ChatMessage, View, ReportData } from './types';
import { initialBotMessage } from './constants';
import { sendMessage, generateReportAndRecipients } from './services/geminiService';
import ChatWindow from './components/ChatWindow';
import ReportGenerator from './components/ReportGenerator';
import Header from './components/Header';
import { BotIcon } from './components/icons/BotIcon';
import ActionToolkit from './components/ActionToolkit';

const App: React.FC = () => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([initialBotMessage]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<View>(View.Chat);
  const [reportData, setReportData] = useState<ReportData | null>(null);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = { role: 'user', content: message };
    setChatHistory(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const botResponse = await sendMessage(chatHistory, message);
      const botMessage: ChatMessage = { role: 'model', content: botResponse };
      setChatHistory(prev => [...prev, botMessage]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Sorry, something went wrong. Please try again. Error: ${errorMessage}`);
      const errorBotMessage: ChatMessage = { role: 'model', content: `I encountered an error. Please check your connection or API key and try again.` };
      setChatHistory(prev => [...prev, errorBotMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDraftReport = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await generateReportAndRecipients(chatHistory);
      setReportData(data);
      setView(View.Report);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to generate report. Please try again. Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [chatHistory]);

  const handleBackToChat = () => {
    setView(View.Chat);
    setReportData(null);
  };
  
  return (
    <div className="flex flex-col h-screen font-sans bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      <Header />
      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        {view === View.Chat ? (
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ChatWindow
                chatHistory={chatHistory}
                isLoading={isLoading}
                onSendMessage={handleSendMessage}
                onDraftReport={handleDraftReport}
                error={error}
              />
            </div>
            <div className="lg:col-span-1">
              <ActionToolkit />
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {reportData && !isLoading ? (
              <ReportGenerator 
                  reportData={reportData}
                  onBackToChat={handleBackToChat}
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-slate-800 rounded-lg shadow-lg animate-pulse">
                  <BotIcon className="w-12 h-12 mb-4 text-blue-500"/>
                  <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300">Generating Your Report...</h2>
                  <p className="mt-2 text-slate-500 dark:text-slate-400">The AI is carefully summarizing your conversation and suggesting relevant contacts. This may take a moment.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
