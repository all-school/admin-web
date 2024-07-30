import React from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  message: {
    id: string;
    text: string;
    createdAt: string;
    type?: 'information' | 'success' | 'warning' | 'error';
  };
  isCurrentUser: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isCurrentUser
}) => {
  const getMessageStyle = () => {
    switch (message.type) {
      case 'information':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'success':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return isCurrentUser
          ? 'bg-primary text-primary-foreground'
          : 'bg-gray-100 text-gray-800';
    }
  };

  const getIcon = () => {
    switch (message.type) {
      case 'information':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'mb-2 flex',
        isCurrentUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'max-w-[70%] rounded-lg p-3 shadow-sm',
          getMessageStyle(),
          isCurrentUser ? 'rounded-br-none' : 'rounded-bl-none',
          'transition-all duration-200 ease-in-out hover:shadow-md'
        )}
      >
        {message.type && (
          <div className="mb-1 flex items-center">
            {getIcon()}
            <span className="ml-1 text-xs font-medium">
              {message.type.charAt(0).toUpperCase() + message.type.slice(1)}
            </span>
          </div>
        )}
        <div className="text-sm leading-snug">{message.text}</div>
        <div className="mt-1 text-right text-[10px] opacity-70">
          {format(new Date(message.createdAt), 'HH:mm')}
        </div>
      </div>
    </motion.div>
  );
};

export default MessageBubble;
