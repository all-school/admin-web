import React, { useState, useEffect } from 'react';
import { useMutation, useLazyQuery, useApolloClient } from '@apollo/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Search } from 'lucide-react';
import {
  GET_STUDENT_ID_BY_NAME,
  SEND_MESSAGE,
  GET_CONVERSATIONS
} from './ChatService';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import useDebounce from '@/hooks/useDebounce';

interface NewMessageFormProps {
  user: {
    id: string;
  };
  onCancel: () => void;
  onMessageSent: (newConversation: any) => void;
}

const NewMessageForm: React.FC<NewMessageFormProps> = ({
  user,
  onCancel,
  onMessageSent
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [messageText, setMessageText] = useState('');
  const [options, setOptions] = useState<any[]>([]);
  const { toast } = useToast();
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const client = useApolloClient();

  const [getStudents, { loading: searchLoading }] = useLazyQuery(
    GET_STUDENT_ID_BY_NAME,
    {
      fetchPolicy: 'network-only',
      onCompleted: (data) => {
        setOptions(
          (
            data?.search?.filter((item) => item?.__typename === 'Student') || []
          ).filter(Boolean)
        );
      },
      onError: (error) => {
        console.error('Error searching for students:', error);
        toast({
          title: 'Error',
          description: 'Failed to search for students. Please try again.',
          variant: 'destructive'
        });
      }
    }
  );

  const [sendMessage, { loading: sendingMessage }] = useMutation(SEND_MESSAGE, {
    onCompleted: (data) => {
      if (data?.sendMessage) {
        onMessageSent(data.sendMessage.conversation);
        setMessageText('');
        setSelectedStudent(null);
        toast({
          title: 'Success',
          description: 'Message sent successfully.'
        });
        client.resetStore().catch((error) => {
          console.error('Error resetting store:', error);
        });
      } else {
        throw new Error('Unexpected response structure');
      }
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
    if (debouncedSearchTerm.length >= 3) {
      getStudents({
        variables: {
          searchType: ['STUDENT'],
          text: debouncedSearchTerm
        }
      });
    } else {
      setOptions([]);
    }
  }, [debouncedSearchTerm, getStudents]);

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
      }).catch((error) => {
        console.error('Error in sendMessage:', error);
        toast({
          title: 'Error',
          description: 'Failed to send message. Please try again.',
          variant: 'destructive'
        });
      });
    }
  };

  const handleStudentSelect = (student: any) => {
    setSelectedStudent(student);
    setSearchTerm('');
    setOptions([]);
  };
  return (
    <div className="flex h-full flex-col bg-background">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-white p-4 shadow-sm">
        <h2 className="text-xl font-semibold">New Message</h2>
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto p-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for a student"
            className="pl-10"
          />
        </div>
        {searchLoading && <Loader2 className="mx-auto h-6 w-6 animate-spin" />}
        {options.length > 0 && (
          <ScrollArea className="mb-4 max-h-60 flex-1 rounded-md border">
            {options.map((student) => (
              <Button
                key={student.id}
                variant="ghost"
                className="w-full justify-start p-2"
                onClick={() => handleStudentSelect(student)}
              >
                <Avatar className="mr-2 h-8 w-8">
                  <AvatarImage src={student.profilePicture?.signedUrl} />
                  <AvatarFallback>
                    {student.firstName?.[0]}
                    {student.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <span>
                  {student.firstName} {student.lastName}
                </span>
              </Button>
            ))}
          </ScrollArea>
        )}
        {selectedStudent && (
          <>
            <Separator className="my-4" />
            <div className="mb-4 flex items-center">
              <span className="mr-2">To:</span>
              <Avatar className="mr-2 h-8 w-8">
                <AvatarImage src={selectedStudent.profilePicture?.signedUrl} />
                <AvatarFallback>
                  {selectedStudent.firstName?.[0]}
                  {selectedStudent.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <span>
                {selectedStudent.firstName} {selectedStudent.lastName}
              </span>
            </div>
            <Input
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type your message"
              className="mb-4"
            />
            <Button
              onClick={handleSendMessage}
              disabled={
                sendingMessage || !selectedStudent || !messageText.trim()
              }
              className="w-full"
            >
              {sendingMessage ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Send Message
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default NewMessageForm;
