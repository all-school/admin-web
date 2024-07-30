import React, { useState, useEffect } from 'react';
import { useMutation, useLazyQuery, useApolloClient } from '@apollo/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Search } from 'lucide-react';
import { GET_STUDENT_ID_BY_NAME, SEND_MESSAGE } from './ChatService';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import useDebounce from '@/hooks/useDebounce';

interface NewMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMessageSent: (newConversation: any) => void;
  user: {
    id: string;
  };
}

const NewMessageModal: React.FC<NewMessageModalProps> = ({
  isOpen,
  onClose,
  onMessageSent,
  user
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
        onClose();
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Message</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for a student"
              className="pl-10"
            />
          </div>
          {searchLoading && (
            <Loader2 className="mx-auto h-6 w-6 animate-spin" />
          )}
          {options.length > 0 && (
            <ScrollArea className="h-[200px] w-full rounded-md border">
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
              <Separator />
              <div className="flex items-center">
                <span className="mr-2">To:</span>
                <Avatar className="mr-2 h-8 w-8">
                  <AvatarImage
                    src={selectedStudent.profilePicture?.signedUrl}
                  />
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
              />
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSendMessage}
            disabled={sendingMessage || !selectedStudent || !messageText.trim()}
          >
            {sendingMessage ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Send Message
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewMessageModal;
