// Combobox.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';

interface ComboboxProps {
  items: any[];
  onChange: (selectedItems: any[]) => void;
  onInputChange: (value: string) => void;
  placeholder: string;
  renderOption: (option: any) => React.ReactNode;
}

export function Combobox({
  items,
  onChange,
  onInputChange,
  placeholder,
  renderOption
}: ComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onInputChange(e.target.value);
  };

  const toggleItem = (item: any) => {
    setSelectedItems((prev) => {
      const newSelection = prev.some((i) => i.id === item.id)
        ? prev.filter((i) => i.id !== item.id)
        : [...prev, item];
      onChange(newSelection);
      return newSelection;
    });
  };

  return (
    <div ref={wrapperRef} className="relative">
      <Button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between"
        variant="outline"
      >
        {selectedItems.length > 0
          ? `${selectedItems.length} selected`
          : placeholder}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
      {isOpen && (
        <div className="absolute mt-1 w-full rounded-md bg-white shadow-lg">
          <Input
            type="text"
            placeholder="Search..."
            value={inputValue}
            onChange={handleInputChange}
            className="w-full"
          />
          <ul className="max-h-60 overflow-auto py-1">
            {items.map((item) => (
              <li
                key={item.id}
                onClick={() => toggleItem(item)}
                className="flex cursor-pointer items-center px-3 py-2 hover:bg-gray-100"
              >
                <input
                  type="checkbox"
                  checked={selectedItems.some((i) => i.id === item.id)}
                  onChange={() => {}}
                  className="mr-2"
                />
                {renderOption(item)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
