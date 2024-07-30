import * as React from 'react';
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

interface ComboboxProps {
  items: any[];
  onChange: (value: any[]) => void;
  onInputChange: (value: string) => void;
  placeholder: string;
  renderOption: (item: any) => React.ReactNode;
}

export function Combobox({
  items,
  onChange,
  onInputChange,
  placeholder,
  renderOption
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<any[]>([]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value.length > 0 ? `${value.length} selected` : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput
            placeholder={placeholder}
            onValueChange={onInputChange}
          />
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            {items.map((item) => (
              <CommandItem
                key={item.id}
                onSelect={() => {
                  const newValue = value.some((v) => v.id === item.id)
                    ? value.filter((v) => v.id !== item.id)
                    : [...value, item];
                  setValue(newValue);
                  onChange(newValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    value.some((v) => v.id === item.id)
                      ? 'opacity-100'
                      : 'opacity-0'
                  )}
                />
                {renderOption(item)}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
