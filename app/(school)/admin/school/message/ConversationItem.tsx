import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ConversationItemProps {
  conversation: {
    id: string;
    participant: {
      firstName: string;
      lastName: string;
      profilePicture?: { signedUrl: string };
    };
    recentMessage?: { text: string };
  };
  isSelected: boolean;
  onSelect: () => void;
  onDelete: (event: React.MouseEvent) => void;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  isSelected,
  onSelect,
  onDelete
}) => {
  return (
    <div
      className={`mb-2 cursor-pointer rounded-lg bg-white p-3 shadow-sm transition-all duration-200 ease-in-out hover:shadow-md ${
        isSelected ? 'border-2 border-blue-500' : 'border border-gray-200'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Avatar className="mr-3 h-10 w-10">
            <AvatarImage
              src={conversation.participant.profilePicture?.signedUrl}
            />
            <AvatarFallback>
              {conversation.participant.firstName[0]}
              {conversation.participant.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold">
              {conversation.participant.firstName}{' '}
              {conversation.participant.lastName}
            </div>
            <div className="truncate text-sm text-gray-500">
              {conversation.recentMessage?.text
                ? `${conversation.recentMessage.text.substring(0, 15)}${
                    conversation.recentMessage.text.length > 15 ? '...' : ''
                  }`
                : 'No recent message'}
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-red-500"
          onClick={onDelete}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ConversationItem;
