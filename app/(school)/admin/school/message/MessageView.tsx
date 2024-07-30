import React, { useState, useEffect, useRef } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Send, ArrowLeft } from 'lucide-react';
import { GET_MESSAGES, SEND_MESSAGE } from './ChatService';
import MessageBubble from './MessageBubble';

interface MessageViewProps {
  conversation: {
    id: string;
    participant: {
      id: string;
      firstName: string;
      lastName: string;
      profilePicture?: { signedUrl: string };
    };
  };
  user: {
    id: string;
  };
  refetchConversations: () => void;
  onBack: () => void;
}

const MessageView: React.FC<MessageViewProps> = ({
  conversation,
  user,
  refetchConversations,
  onBack
}) => {
  const [messageText, setMessageText] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const { data, loading, error, refetch } = useQuery(GET_MESSAGES, {
    variables: { conversationId: conversation.id },
    fetchPolicy: 'network-only'
  });

  const [sendMessage, { loading: sendingMessage }] = useMutation(SEND_MESSAGE, {
    onCompleted: () => {
      setMessageText('');
      refetch();
      refetchConversations();
    },
    onError: (error) => {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive'
      });
    }
  });

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [data?.messages]);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      sendMessage({
        variables: {
          messageTo: {
            receiverType: 'STUDENT',
            receiverId: conversation.participant.id
          },
          text: messageText.trim()
        }
      }).catch((error) => {
        console.error('Error in sendMessage:', error);
      });
    }
  };

  if (loading)
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  if (error)
    return (
      <div className="flex flex-1 items-center justify-center">
        Error loading messages
      </div>
    );

  return (
    <div className="flex h-full flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="sticky top-0 z-10 flex items-center border-b border-border bg-white p-4 shadow-sm">
        <Button variant="ghost" size="icon" className="mr-2" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Avatar className="mr-3 h-10 w-10">
          <AvatarImage
            src={conversation.participant.profilePicture?.signedUrl}
          />
          <AvatarFallback>
            {conversation.participant.firstName[0]}
            {conversation.participant.lastName[0]}
          </AvatarFallback>
        </Avatar>
        <h2 className="text-l font-semibold">
          {conversation.participant.firstName}{' '}
          {conversation.participant.lastName}
        </h2>
      </div>
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="flex min-h-full flex-col justify-end space-y-4">
          {data?.messages.map((message: any) => (
            <MessageBubble
              key={message.id}
              message={message}
              isCurrentUser={message.createdBy.user.id === user.id}
            />
          ))}
        </div>
      </ScrollArea>
      <div className="sticky bottom-0 mt-auto border-t border-border bg-white bg-opacity-80 p-4 backdrop-blur-sm">
        <div className="flex items-center">
          <Input
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type a message"
            className="mr-2 flex-1 bg-white bg-opacity-80"
            onKeyPress={(e) =>
              e.key === 'Enter' && !e.shiftKey && handleSendMessage()
            }
          />
          <Button
            onClick={handleSendMessage}
            disabled={sendingMessage || !messageText.trim()}
            className="px-4 py-2"
          >
            {sendingMessage ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessageView;
