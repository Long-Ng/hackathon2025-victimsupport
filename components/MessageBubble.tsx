
import React from 'react';
import { ChatMessage } from '../types';
import { UserIcon } from './icons/UserIcon';
import { BotIcon } from './icons/BotIcon';

interface MessageBubbleProps {
  message: ChatMessage;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  const bubbleClasses = isUser
    ? 'bg-blue-600 text-white'
    : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200';
  
  const containerClasses = isUser
    ? 'flex items-end justify-end space-x-3'
    : 'flex items-end space-x-3';

  const IconComponent = isUser ? UserIcon : BotIcon;

  return (
    <div className={containerClasses}>
      {!isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center">
            <IconComponent className="w-6 h-6 text-slate-500 dark:text-slate-300"/>
        </div>
      )}
      <div className={`max-w-xl p-4 rounded-2xl ${bubbleClasses} whitespace-pre-wrap`}>
        {message.content}
      </div>
       {isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center">
            <IconComponent className="w-6 h-6 text-slate-500 dark:text-slate-300"/>
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
