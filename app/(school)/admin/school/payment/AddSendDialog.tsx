// AddSendDialog.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useQuery } from '@apollo/client';
import { GET_ALL_DETAILS_BY_NAME } from './PaymentService';
import { Globe, Group } from 'lucide-react';

interface AddSendDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  value: any[];
  setValue: React.Dispatch<React.SetStateAction<any[]>>;
  selectedValue: string;
  setSelectedValue: React.Dispatch<React.SetStateAction<string>>;
  notifyMail: boolean;
  setNotifyMail: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddSendDialog: React.FC<AddSendDialogProps> = ({
  open,
  setOpen,
  value,
  setValue,
  selectedValue,
  setSelectedValue,
  notifyMail,
  setNotifyMail
}) => {
  const [search, setSearch] = useState('');
  const [options, setOptions] = useState([]);

  const { data, loading, error } = useQuery(GET_ALL_DETAILS_BY_NAME, {
    variables: { name: search },
    skip: search.length < 2
  });

  useEffect(() => {
    if (data?.getAllDetailsByName) {
      setOptions(data.getAllDetailsByName);
    }
  }, [data]);

  const handleSchoolChange = (value: string) => {
    setSelectedValue(value);
    if (value === 'School') {
      setValue([]);
    }
  };

  const handleRecipientToggle = (recipient: any) => {
    setValue((prevValue) => {
      const isSelected = prevValue.some((v) => v.id === recipient.id);
      if (isSelected) {
        return prevValue.filter((v) => v.id !== recipient.id);
      } else {
        return [...prevValue, recipient];
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select audience</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <RadioGroup value={selectedValue} onValueChange={handleSchoolChange}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="School" id="school" />
              <Label htmlFor="school">
                <div className="flex items-center">
                  <Globe className="mr-2 h-4 w-4" />
                  Entire School
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Others" id="others" />
              <Label htmlFor="others">
                <div className="flex items-center">
                  <Group className="mr-2 h-4 w-4" />
                  Others
                </div>
              </Label>
            </div>
          </RadioGroup>

          {selectedValue === 'Others' && (
            <>
              <Input
                placeholder="Search for recipients"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <ScrollArea className="h-[200px]">
                {loading && <p>Loading...</p>}
                {error && <p>Error: {error.message}</p>}
                {options.map((option: any) => (
                  <div
                    key={option.id}
                    className="flex items-center space-x-2 py-2"
                  >
                    <Checkbox
                      id={option.id}
                      checked={value.some((v) => v.id === option.id)}
                      onCheckedChange={() => handleRecipientToggle(option)}
                    />
                    <Label
                      htmlFor={option.id}
                      className="flex items-center space-x-2"
                    >
                      <Avatar>
                        <AvatarImage src={option.profilePicture?.signedUrl} />
                        <AvatarFallback>
                          {option.firstName?.[0] || option.name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p>
                          {option.firstName
                            ? `${option.firstName} ${option.lastName}`
                            : option.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {option.type}
                        </p>
                      </div>
                    </Label>
                  </div>
                ))}
              </ScrollArea>
            </>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="notifyByEmail"
              checked={notifyMail}
              onCheckedChange={(checked) => setNotifyMail(checked as boolean)}
            />
            <Label htmlFor="notifyByEmail">Notify By Email</Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Confirm</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddSendDialog;
