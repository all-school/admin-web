import React, { useState, useEffect } from 'react';
import { Combobox } from '@/components/ui/combobox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search } from 'lucide-react';
import { getTeachersByName } from '@/lib/api';
import useDebounce from '@/hooks/useDebounce';
import { stringToHslColor } from '@/lib/utils';

export default function TeacherSearch({ value, setValue, label }) {
  const [inputValue, setInputValue] = useState('');
  const debouncedSearchTerm = useDebounce(inputValue, 25);
  const [options, setOptions] = useState([]);

  const runSearch = async () => {
    const result = await getTeachersByName(inputValue);
    setOptions(result);
  };

  useEffect(() => {
    if (debouncedSearchTerm) {
      runSearch();
    } else {
      setOptions([]);
    }
  }, [debouncedSearchTerm]);

  return (
    <Combobox
      items={options}
      value={value}
      onChange={setValue}
      onInputChange={setInputValue}
      placeholder="Search teacher..."
      emptyMessage="No teachers found."
    >
      {(teacher) => (
        <div className="flex items-center">
          <Avatar className="mr-2 h-6 w-6">
            <AvatarImage src={teacher.profilePicture?.signedUrl} />
            <AvatarFallback
              style={{
                backgroundColor: stringToHslColor(
                  `${teacher.firstName} ${teacher.lastName}`,
                  50,
                  60
                )
              }}
            >
              {teacher.firstName.charAt(0).toUpperCase()}
              {teacher.lastName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span>
            {teacher.firstName} {teacher.lastName}
          </span>
        </div>
      )}
    </Combobox>
  );
}
