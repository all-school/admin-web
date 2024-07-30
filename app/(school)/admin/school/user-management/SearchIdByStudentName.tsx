import React, { useState, useEffect } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getStudentIdByName } from './UserManagementService';
import useDebounce from '@/hooks/useDebounce';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  profilePicture?: {
    signedUrl: string;
  };
}

interface SearchIdByStudentNameProps {
  value: Student | null;
  setValue: (value: Student | null) => void;
}

const SearchIdByStudentName: React.FC<SearchIdByStudentNameProps> = ({
  value,
  setValue
}) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<Student[]>([]);
  const debouncedSearchTerm = useDebounce(inputValue, 300);

  useEffect(() => {
    if (debouncedSearchTerm) {
      runSearch();
    } else {
      setOptions([]);
    }
  }, [debouncedSearchTerm]);

  const runSearch = async () => {
    const result = await getStudentIdByName(inputValue);
    setOptions(result);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value ? `${value.firstName} ${value.lastName}` : 'Select student...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput
            placeholder="Search student..."
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandEmpty>No student found.</CommandEmpty>
          <CommandGroup>
            {options.map((student) => (
              <CommandItem
                key={student.id}
                onSelect={() => {
                  setValue(student);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    value?.id === student.id ? 'opacity-100' : 'opacity-0'
                  )}
                />
                <Avatar className="mr-2 h-6 w-6">
                  <AvatarImage src={student.profilePicture?.signedUrl} />
                  <AvatarFallback>
                    {student.firstName[0]}
                    {student.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                {student.firstName} {student.lastName}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SearchIdByStudentName;
