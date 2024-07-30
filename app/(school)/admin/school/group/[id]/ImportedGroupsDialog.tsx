import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_GROUPS } from './GroupExService';
import { stringToHslColor } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
  groups: z.array(z.string())
});

export default function ImportedGroupsDialog({
  title,
  open,
  setOpen,
  importedGroups,
  setImportedGroups,
  group,
  studentsLoading,
  setStudentsLoading,
  setRight
}) {
  const [searchedGroups, setSearchedGroups] = useState(importedGroups);
  const [searchTerm, setSearchTerm] = useState('');
  const { data, loading } = useQuery(GET_GROUPS);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      groups: importedGroups.map((g) => g.id)
    }
  });

  if (loading) {
    return null;
  }

  const filteredGroups = data
    ? data.groups.filter(
        (currentGroup) =>
          group.id !== currentGroup.id &&
          currentGroup.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleSelect = (groupId) => {
    const selectedGroup = filteredGroups.find((g) => g.id === groupId);
    const updatedGroups = searchedGroups.some((g) => g.id === groupId)
      ? searchedGroups.filter((g) => g.id !== groupId)
      : [...searchedGroups, selectedGroup];
    setSearchedGroups(updatedGroups);
    form.setValue(
      'groups',
      updatedGroups.map((g) => g.id)
    );
  };

  const handleSubmit = () => {
    setImportedGroups(searchedGroups);
    setStudentsLoading(true);
    setRight([]);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <h4 className="font-medium leading-none">Search for groups</h4>
            <p className="text-sm text-muted-foreground">Add groups below</p>
          </div>
          <Input
            placeholder="Search groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <ScrollArea className="h-[200px]">
            {filteredGroups.map((option) => (
              <div
                key={option.id}
                className="flex cursor-pointer items-center space-x-2 p-2 hover:bg-accent"
                onClick={() => handleSelect(option.id)}
              >
                <Checkbox
                  checked={searchedGroups.some((g) => g.id === option.id)}
                  onCheckedChange={() => handleSelect(option.id)}
                />
                <Avatar className="h-9 w-9">
                  <AvatarImage src={option.profilePicture?.signedUrl} />
                  <AvatarFallback
                    style={{
                      backgroundColor: StringToHslColor(option.name, 50, 60)
                    }}
                  >
                    {option.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{option.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {option.noOfStudents} student
                    {option.noOfStudents !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            ))}
          </ScrollArea>
          <div className="flex flex-wrap gap-2">
            {searchedGroups.map((group) => (
              <Badge key={group.id} variant="secondary">
                {group.name}
              </Badge>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setOpen(false);
              setSearchedGroups(importedGroups);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              (searchedGroups.length === 0 && importedGroups.length === 0) ||
              studentsLoading ||
              (importedGroups.length === searchedGroups.length &&
                JSON.stringify(searchedGroups) ===
                  JSON.stringify(importedGroups))
            }
          >
            {studentsLoading ? (
              <>
                Applying...
                <span className="ml-2 animate-spin">◌</span>
              </>
            ) : (
              'Apply'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
