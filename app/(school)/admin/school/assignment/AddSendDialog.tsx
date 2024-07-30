import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Globe, Users, Check, Search } from 'lucide-react';
import { useLazyQuery } from '@apollo/client';
import { GET_ALL_DETAILS_BY_NAME } from './AssignmentService';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';

interface AddSendDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSave: (recipients: any[]) => void;
  assignmentTitle: string;
}

const AddSendDialog: React.FC<AddSendDialogProps> = ({
  open,
  setOpen,
  onSave,
  assignmentTitle
}) => {
  const [selectedValue, setSelectedValue] = useState('School');
  const [notifyMail, setNotifyMail] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [options, setOptions] = useState<any[]>([]);
  const [selectedRecipients, setSelectedRecipients] = useState<any[]>([]);
  const { toast } = useToast();

  const [getRecipients, { loading: searchLoading, error: searchError }] =
    useLazyQuery(GET_ALL_DETAILS_BY_NAME, {
      onCompleted: (data) => {
        console.log('Query completed:', data);
        setOptions(
          data?.search?.filter(
            (item) =>
              item?.__typename === 'Student' || item?.__typename === 'Group'
          ) || []
        );
      },
      onError: (error) => {
        console.error('Error searching for recipients:', error);
        toast({
          title: 'Error',
          description: 'Failed to search for recipients. Please try again.',
          variant: 'destructive'
        });
      }
    });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.length >= 3) {
      try {
        getRecipients({
          variables: {
            searchType: ['STUDENT', 'GROUP'],
            text: value
          }
        });
      } catch (error) {
        console.error('Error calling getRecipients:', error);
      }
    } else {
      setOptions([]);
    }
  };

  const handleRecipientSelect = (recipient: any) => {
    setSelectedRecipients((prev) => {
      const isSelected = prev.some((item) => item.id === recipient.id);
      if (isSelected) {
        return prev.filter((item) => item.id !== recipient.id);
      } else {
        return [...prev, recipient];
      }
    });
  };

  const isRecipientSelected = (recipient: any) => {
    return selectedRecipients.some((item) => item.id === recipient.id);
  };

  const handleSave = () => {
    if (selectedValue !== 'School' && selectedRecipients.length === 0) {
      toast({
        title: 'Error',
        description: 'Please select at least one recipient.',
        variant: 'destructive'
      });
      return;
    }

    onSave(selectedValue === 'School' ? [] : selectedRecipients);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Send Assignment: {assignmentTitle}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Send to</Label>
            <RadioGroup
              value={selectedValue}
              onValueChange={setSelectedValue}
              className="col-span-3 grid grid-cols-2 gap-4"
            >
              <div>
                <RadioGroupItem
                  value="School"
                  id="school"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="school"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Globe className="mb-3 h-6 w-6" />
                  <span className="text-sm font-medium">Entire School</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem
                  value="Others"
                  id="others"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="others"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Users className="mb-3 h-6 w-6" />
                  <span className="text-sm font-medium">Others</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
          {selectedValue !== 'School' && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sendTo" className="text-right">
                Recipients
              </Label>
              <div className="col-span-3">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search recipients..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="pl-8"
                  />
                </div>
                {searchLoading && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Loading...
                  </p>
                )}
                {searchError && (
                  <p className="mt-2 text-sm text-red-500">
                    Error: {searchError.message}
                  </p>
                )}
                {!searchLoading &&
                  options.length === 0 &&
                  searchTerm.length >= 3 && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      No recipients found.
                    </p>
                  )}
                {options.length > 0 && (
                  <ScrollArea className="mt-2 h-[200px] overflow-auto rounded-md border">
                    {options.map((option) => (
                      <div
                        key={option.id}
                        className={`flex cursor-pointer items-center p-2 hover:bg-accent ${
                          isRecipientSelected(option) ? 'bg-accent' : ''
                        }`}
                        onClick={() => handleRecipientSelect(option)}
                      >
                        <Check
                          className={`mr-2 h-4 w-4 ${
                            isRecipientSelected(option)
                              ? 'opacity-100'
                              : 'opacity-0'
                          }`}
                        />
                        <Avatar className="mr-2 h-8 w-8">
                          <AvatarImage src={option.profilePicture?.signedUrl} />
                          <AvatarFallback>
                            {option.firstName
                              ? `${option.firstName[0]}${option.lastName[0]}`
                              : option.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span>
                          {option.firstName
                            ? `${option.firstName} ${option.lastName}`
                            : option.name}
                        </span>
                      </div>
                    ))}
                  </ScrollArea>
                )}
              </div>
            </div>
          )}
          {selectedRecipients.length > 0 && (
            <div className="col-span-4">
              <Label>Selected Recipients</Label>
              <ScrollArea className="mt-1 h-[100px] w-full rounded-md border p-2">
                {selectedRecipients.map((recipient) => (
                  <div
                    key={recipient.id}
                    className="mb-1 flex items-center space-x-2"
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={recipient.profilePicture?.signedUrl} />
                      <AvatarFallback>
                        {recipient.firstName
                          ? `${recipient.firstName[0]}${recipient.lastName[0]}`
                          : recipient.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">
                      {recipient.firstName
                        ? `${recipient.firstName} ${recipient.lastName}`
                        : recipient.name}
                    </span>
                  </div>
                ))}
              </ScrollArea>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="notifyByEmail"
              checked={notifyMail}
              onCheckedChange={setNotifyMail}
            />
            <label
              htmlFor="notifyByEmail"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Notify By Email
            </label>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Send Assignment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddSendDialog;
