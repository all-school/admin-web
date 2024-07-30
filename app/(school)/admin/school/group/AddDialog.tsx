import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, UserPlus, Search } from 'lucide-react';
import { CREATE_GROUP, GET_GROUPS, GET_STUDENTS_LISTS } from './GroupExService';

const AddDialog = ({ open, setOpen, groupsRefetch }) => {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [type, setType] = useState('ACADEMIC');
  const [addMembersOpen, setAddMembersOpen] = useState(false);
  const [importedGroups, setImportedGroups] = useState([]);
  const [chosen, setChosen] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: groupsData } = useQuery(GET_GROUPS);
  const {
    data: studentsData,
    loading: studentsLoading,
    refetch: refetchStudents
  } = useQuery(GET_STUDENTS_LISTS, {
    variables: { queryByType: 'SCHOOL' },
    skip: !addMembersOpen // Only fetch when the add members dialog is open
  });

  const [createGroup, { loading: createGroupLoading }] = useMutation(
    CREATE_GROUP,
    {
      onCompleted(data) {
        if (data.createGroup.error) {
          toast({
            title: 'Error',
            description: data.createGroup.error,
            variant: 'destructive'
          });
        } else {
          toast({
            title: 'Success',
            description: 'Group created'
          });
          groupsRefetch();
        }
        handleClose();
      },
      onError(error) {
        toast({
          title: 'Error',
          description: 'Something went wrong. Please try again',
          variant: 'destructive'
        });
        handleClose();
      }
    }
  );

  useEffect(() => {
    if (addMembersOpen && importedGroups.length > 0) {
      refetchStudents({
        variables: {
          queryByType: 'GROUP',
          queryByIds: importedGroups.map((group) => group.id)
        }
      });
    }
  }, [importedGroups, addMembersOpen, refetchStudents]);

  const handleClose = () => {
    setOpen(false);
    setName('');
    setType('ACADEMIC');
    setChosen([]);
    setImportedGroups([]);
    setSearchTerm('');
  };

  const handleSubmit = () => {
    createGroup({
      variables: {
        name,
        type,
        members: chosen.map((student) => student.id)
      }
    });
  };

  const handleAddMembers = () => {
    setAddMembersOpen(true);
  };

  const filteredStudents =
    studentsData?.students.filter((student) =>
      `${student.firstName} ${student.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    ) || [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Group Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Select value={type} onValueChange={setType}>
            <SelectTrigger>
              <SelectValue placeholder="Select group type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ACADEMIC">Academic</SelectItem>
              <SelectItem value="NONACADEMIC">Non Academic</SelectItem>
              <SelectItem value="OTHER">Other</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleAddMembers}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Members
          </Button>
          {chosen.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {chosen.length} member{chosen.length !== 1 ? 's' : ''} added
            </p>
          )}
        </div>
        {addMembersOpen && (
          <div className="mt-4">
            <div className="mb-2 flex items-center space-x-2">
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea className="h-[200px]">
              {filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center space-x-2 py-2"
                >
                  <Checkbox
                    checked={chosen.some((s) => s.id === student.id)}
                    onCheckedChange={(checked) => {
                      setChosen(
                        checked
                          ? [...chosen, student]
                          : chosen.filter((s) => s.id !== student.id)
                      );
                    }}
                  />
                  <Avatar>
                    <AvatarImage src={student.profilePicture?.signedUrl} />
                    <AvatarFallback>{`${student.firstName[0]}${student.lastName[0]}`}</AvatarFallback>
                  </Avatar>
                  <span>{`${student.firstName} ${student.lastName}`}</span>
                </div>
              ))}
            </ScrollArea>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={createGroupLoading}>
            {createGroupLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddDialog;
