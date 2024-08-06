// RecipientSelector.tsx
import React, { useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Combobox } from './Combobox';
import { getAllDetailsByName } from './CalendarService';

interface RecipientSelectorProps {
  selectedValue: string;
  setSelectedValue: (value: string) => void;
  recipients: any[];
  setRecipients: (recipients: any[]) => void;
}

function RecipientSelector({
  selectedValue,
  setSelectedValue,
  recipients,
  setRecipients
}: RecipientSelectorProps) {
  const [options, setOptions] = useState<any[]>([]);

  const handleSearchQuery = async (query: string) => {
    if (query.trim() !== '') {
      try {
        const result = await getAllDetailsByName(query);
        setOptions(result || []);
      } catch (error) {
        console.error('Error fetching recipients:', error);
        setOptions([]);
      }
    } else {
      setOptions([]);
    }
  };

  return (
    <div>
      <h3 className="mb-2 text-lg font-semibold">Who can see your event?</h3>
      <RadioGroup
        value={selectedValue}
        onValueChange={setSelectedValue}
        className="space-y-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="School" id="school" />
          <Label htmlFor="school">Entire School</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="Others" id="others" />
          <Label htmlFor="others">Others</Label>
        </div>
      </RadioGroup>

      {selectedValue === 'Others' && (
        <Combobox
          items={options}
          onChange={setRecipients}
          onInputChange={handleSearchQuery}
          placeholder="Search for recipients..."
          renderOption={(option) => (
            <div className="flex items-center space-x-2">
              {option.name || `${option.firstName} ${option.lastName}`}
            </div>
          )}
        />
      )}
    </div>
  );
}

export default RecipientSelector;
