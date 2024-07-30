import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlusCircle } from 'lucide-react';
import { DELETE_CONVERSATION } from './ChatService';
import { useToast } from '@/components/ui/use-toast';
import SearchBar from './SearchBar';
import ConversationItem from './ConversationItem';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';

const ConversationList = ({
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
    <div className="flex h-full flex-col">
      <div className="sticky top-0 z-10 flex items-center justify-between bg-white p-4 shadow-sm">
        <h2 className="text-2xl font-bold">Chats</h2>
        <Button onClick={onNewMessage} size="icon" variant="ghost">
          <PlusCircle className="h-5 w-5" />
        </Button>
      </div>
      <div className="p-2">
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
      </div>
      <ScrollArea className="flex-1">
        <div className="px-2 py-1">
          {filteredConversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              isSelected={selectedConversationId === conversation.id}
              onSelect={() => onSelectConversation(conversation)}
              onDelete={(e) => handleDeleteClick(e, conversation)}
            />
          ))}
        </div>
      </ScrollArea>
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        participantName={`${conversationToDelete?.participant.firstName} ${conversationToDelete?.participant.lastName}`}
      />
    </div>
  );
};

export default ConversationList;
