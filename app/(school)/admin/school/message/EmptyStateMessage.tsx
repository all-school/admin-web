import React from 'react';
import { MessageSquare } from 'lucide-react';

interface EmptyStateMessageProps {
  message?: string;
}

const EmptyStateMessage: React.FC<EmptyStateMessageProps> = ({
  message = 'Select a conversation or start a new one'
}) => {
  return (
    <div className="flex flex-1 items-center justify-center text-muted-foreground">
      <div className="text-center">
        <MessageSquare className="mx-auto mb-4 h-12 w-12" />
        <p>{message}</p>
      </div>
    </div>
  );
};

export default EmptyStateMessage;
