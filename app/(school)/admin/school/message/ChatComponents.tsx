import React, { useState, useEffect, useRef } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Send, Search, ArrowLeft, PlusCircle, X } from 'lucide-react';
import {
  GET_MESSAGES,
  SEND_MESSAGE,
  GET_STUDENT_BY_ID,
  DELETE_CONVERSATION
} from './ChatService';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';

export const ConversationList = ({
  conversations,
  onSelectConversation,
  selectedConversationId,
  onNewMessage,
  refetchConversations
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState(null);
  const { toast } = useToast();

  const [deleteConversation] = useMutation(DELETE_CONVERSATION, {
    onCompleted: () => {
      refetchConversations();
      toast({
        title: 'Conversation deleted',
        description: 'The conversation has been successfully deleted.'
      });
    },
    onError: (error) => {
      console.error('Failed to delete conversation:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete the conversation. Please try again.',
        variant: 'destructive'
      });
    }
  });

  const filteredConversations = conversations.filter(
    (conversation) =>
      conversation.participant.firstName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      conversation.participant.lastName
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (event, conversation) => {
    event.stopPropagation();
    setConversationToDelete(conversation);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (conversationToDelete) {
      deleteConversation({
        variables: { conversationId: conversationToDelete.id }
      });
    }
    setIsDeleteDialogOpen(false);
    setConversationToDelete(null);
  };

  return (
    <>
      <div className="flex h-full w-full flex-col border-r border-border bg-gray-50 md:h-screen md:w-80 lg:w-96">
        <div className="flex items-center justify-between bg-white p-4">
          <h2 className="text-2xl font-bold">Chats</h2>
          <Button onClick={onNewMessage} size="icon" variant="ghost">
            <PlusCircle className="h-5 w-5" />
          </Button>
        </div>
        <div className="bg-white px-4 py-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400" />
            <Input
              className="border-gray-200 bg-gray-100 pl-10"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <ScrollArea className="flex-1 px-4 py-2">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`mb-2 cursor-pointer rounded-lg bg-white p-3 shadow-sm transition-all duration-200 ease-in-out hover:shadow-md ${
                selectedConversationId === conversation.id
                  ? 'border-2 border-blue-500'
                  : 'border border-gray-200'
              }`}
              onClick={() => onSelectConversation(conversation)}
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
                      {conversation.recentMessage?.text}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-red-500"
                  onClick={(e) => handleDeleteClick(e, conversation)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this conversation?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              conversation with {conversationToDelete?.participant.firstName}{' '}
              {conversationToDelete?.participant.lastName}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConversationToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
const MessageBubble = ({ message, isCurrentUser }) => {
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
          : 'bg-secondary text-secondary-foreground';
    }
  };

  const getIcon = () => {
    switch (message.type) {
      case 'information':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`max-w-[70%] rounded-lg p-3 shadow-sm ${getMessageStyle()} ${
          message.type ? 'border' : ''
        }`}
      >
        {message.type && (
          <div className="mb-2 flex items-center">
            {getIcon()}
            <span className="ml-2 font-semibold">
              {message.type.charAt(0).toUpperCase() + message.type.slice(1)}
            </span>
          </div>
        )}
        <div>{message.text}</div>
        <div className="mt-1 text-xs opacity-70">
          {format(new Date(message.createdAt), 'HH:mm')}
        </div>
      </div>
    </div>
  );
};

export const MessageView = ({
  conversation,
  user,
  refetchConversations,
  onBack
}) => {
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef(null);
  const { toast } = useToast();

  const { data, loading, error, refetch } = useQuery(GET_MESSAGES, {
    variables: { conversationId: conversation.id },
    fetchPolicy: 'network-only'
  });

  const [sendMessage] = useMutation(SEND_MESSAGE, {
    onCompleted: () => {
      setMessageText('');
      refetch();
      refetchConversations();
    },
    onError: () => {
      toast({ description: 'Failed to send message', variant: 'destructive' });
    }
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [data?.messages]);

  if (loading) return <Loader2 className="m-auto h-8 w-8 animate-spin" />;
  if (error) return <div>Error loading messages</div>;

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
      });
    }
  };

  return (
    <div className="flex h-full flex-1 flex-col">
      <div className="flex items-center border-b border-border p-4">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 md:hidden"
          onClick={onBack}
        >
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
        <h2 className="text-xl font-semibold">
          {conversation.participant.firstName}{' '}
          {conversation.participant.lastName}
        </h2>
      </div>
      <ScrollArea className="flex-1 overflow-y-auto p-4">
        {data?.messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isCurrentUser={message.createdBy.user.id === user.id}
          />
        ))}
        <div ref={messagesEndRef} />
      </ScrollArea>
      <div className="mt-auto border-t border-border p-4">
        <div className="flex items-center">
          <Input
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type a message"
            className="mr-2 flex-1"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button onClick={handleSendMessage}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export const NewMessage = ({ user, onCancel, onMessageSent }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [messageText, setMessageText] = useState('');
  const { toast } = useToast();

  const { data, loading, error } = useQuery(GET_STUDENT_BY_ID, {
    variables: { name: searchTerm },
    skip: searchTerm.length < 3
  });

  const [sendMessage] = useMutation(SEND_MESSAGE, {
    onCompleted: (data) => {
      onMessageSent(data.sendMessage.conversation);
    },
    onError: () => {
      toast({ description: 'Failed to send message', variant: 'destructive' });
    }
  });

  const handleSendMessage = () => {
    if (selectedStudent && messageText.trim()) {
      sendMessage({
        variables: {
          messageTo: {
            receiverType: 'STUDENT',
            receiverId: selectedStudent.id
          },
          text: messageText.trim()
        }
      });
    }
  };

  return (
    <div className="flex h-full flex-1 flex-col">
      <div className="flex items-center justify-between border-b border-border p-4">
        <h2 className="text-xl font-semibold">New Message</h2>
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for a student"
          className="mb-4"
        />
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {error && <div>Error searching for students</div>}
        {data?.studentsByName && (
          <ScrollArea className="mb-4 flex-1">
            {data.studentsByName.map((student) => (
              <Button
                key={student.id}
                variant="ghost"
                className="w-full justify-start"
                onClick={() => setSelectedStudent(student)}
              >
                {student.firstName} {student.lastName}
              </Button>
            ))}
          </ScrollArea>
        )}
        {selectedStudent && (
          <>
            <Separator className="my-4" />
            <div className="mb-4">
              To: {selectedStudent.firstName} {selectedStudent.lastName}
            </div>
            <Input
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type your message"
              className="mb-4"
            />
            <Button onClick={handleSendMessage}>Send Message</Button>
          </>
        )}
      </div>
    </div>
  );
};
