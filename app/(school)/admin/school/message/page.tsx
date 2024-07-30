'use client';
import React, { useState, useEffect } from 'react';
import { ApolloProvider, useQuery } from '@apollo/client';
import { GET_CONVERSATIONS } from './ChatService';
import { CURRENT_USER } from '@/graphql/useraccounts';
import { useToast } from '@/components/ui/use-toast';
import client from '@/graphql/client';
import ConversationList from './ConversationList';
import MessageView from './MessageView';
import NewMessageModal from './NewMessageModal';
import LoadingSpinner from './LoadingSpinner';
import EmptyStateMessage from './EmptyStateMessage';

const ChatViewContent = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isNewMessageModalOpen, setIsNewMessageModalOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const { toast } = useToast();

  const {
    data: userData,
    loading: userLoading,
    error: userError
  } = useQuery(CURRENT_USER);
  const {
    data: conversationsData,
    loading: conversationsLoading,
    refetch: conversationsRefetch,
    error: conversationsError
  } = useQuery(GET_CONVERSATIONS, {
    errorPolicy: 'all'
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768); // Adjust this breakpoint as needed
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (
      conversationsData?.conversations &&
      conversationsData.conversations.length > 0 &&
      !selectedConversation &&
      !isMobileView
    ) {
      setSelectedConversation(conversationsData.conversations[0]);
    }
  }, [conversationsData, selectedConversation, isMobileView]);

  if (userError || conversationsError) {
    toast({
      title: 'Error',
      description: 'Something went wrong. Please try again.',
      variant: 'destructive'
    });
    console.error(userError || conversationsError);
  }

  if (userLoading || conversationsLoading) {
    return <LoadingSpinner />;
  }

  const currentAccount = userData?.myCurrentUserAccount || {};
  const user = currentAccount.user || {};

  const handleNewMessage = () => {
    setIsNewMessageModalOpen(true);
  };

  const handleMessageSent = (newConversation) => {
    setIsNewMessageModalOpen(false);
    setSelectedConversation(newConversation);
    conversationsRefetch();
  };

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  const handleBackToList = () => {
    setSelectedConversation(null);
  };

  return (
    <div className="flex h-screen bg-background">
      <div
        className={`${
          isMobileView && selectedConversation
            ? 'hidden'
            : 'w-full md:w-1/3 lg:w-1/4'
        } border-r border-border`}
      >
        <ConversationList
          conversations={conversationsData?.conversations || []}
          onSelectConversation={handleSelectConversation}
          selectedConversationId={selectedConversation?.id}
          onNewMessage={handleNewMessage}
          refetchConversations={conversationsRefetch}
        />
      </div>
      <div
        className={`${
          isMobileView && !selectedConversation ? 'hidden' : 'flex-1'
        } md:flex md:flex-col`}
      >
        {selectedConversation ? (
          <MessageView
            conversation={selectedConversation}
            user={user}
            refetchConversations={conversationsRefetch}
            onBack={handleBackToList}
          />
        ) : (
          !isMobileView && <EmptyStateMessage />
        )}
      </div>
      <NewMessageModal
        isOpen={isNewMessageModalOpen}
        onClose={() => setIsNewMessageModalOpen(false)}
        onMessageSent={handleMessageSent}
        user={user}
      />
    </div>
  );
};

const ChatView = () => (
  <ApolloProvider client={client}>
    <ChatViewContent />
  </ApolloProvider>
);

export default ChatView;
