import React, { useEffect, useState } from 'react';
import { useMutation, useLazyQuery } from '@apollo/client';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { ADD_MEMBERS, GET_STUDENTS_LISTS } from './GroupExService';
import ImportedGroupsDialog from './ImportedGroupsDialog';
import { X, Search, UserPlus } from 'lucide-react';

const AddMembersDialog = ({ title, open, setOpen, group, groupRefetch }) => {
  const { toast } = useToast();
  const [allStudents, setAllStudents] = useState([]);
  const [left, setLeft] = useState([]);
  const [right, setRight] = useState([]);
  const [checked, setChecked] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [importGroupsDialogOpen, setImportGroupsDialogOpen] = useState(false);
  const [importedGroups, setImportedGroups] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);

  const [getStudents, { data, loading, refetch }] =
    useLazyQuery(GET_STUDENTS_LISTS);

  const [addMembers, { loading: addMembersLoading }] = useMutation(
    ADD_MEMBERS,
    {
      onCompleted(data) {
        if (data.addMembers.error) {
          toast({ title: data.addMembers.error, variant: 'destructive' });
          resetState();
        } else {
          toast({ title: 'Members added to group', variant: 'default' });
          groupRefetch();
          handleClose();
        }
      },
      onError(error) {
        toast({
          title: 'Something went wrong. Please try again',
          variant: 'destructive'
        });
        handleClose();
      }
    }
  );

  useEffect(() => {
    if (open) {
      if (importedGroups.length === 0) {
        getStudents({ variables: { queryByType: 'SCHOOL' } });
      } else {
        getStudents({
          variables: {
            queryByType: 'GROUP',
            queryByIds: importedGroups.map((g) => g.id)
          }
        });
      }
    }
  }, [open, importedGroups]);

  useEffect(() => {
    if (data && data.students) {
      const filteredStudents = data.students.filter(
        (s) => !group.members.map((m) => m.id).includes(s.id)
      );
      setAllStudents(filteredStudents);
      setLeft(filteredStudents);
      setStudentsLoading(false);
      setImportGroupsDialogOpen(false);
    }
  }, [data, group.members]);

  const handleAddMembers = () => {
    addMembers({
      variables: {
        groupId: group.id,
        members: right.map((s) => s.id)
      }
    });
  };

  const handleClose = () => {
    setOpen(false);
    resetState();
  };

  const resetState = () => {
    setLeft(allStudents);
    setRight([]);
    setChecked([]);
    setSearchTerm('');
    setImportedGroups([]);
  };

  const handleToggle = (value) => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleCheckedRight = () => {
    setRight([...right, ...checked.filter((value) => left.includes(value))]);
    setLeft(left.filter((value) => !checked.includes(value)));
    setChecked([]);
  };

  const handleCheckedLeft = () => {
    setLeft([...left, ...checked.filter((value) => right.includes(value))]);
    setRight(right.filter((value) => !checked.includes(value)));
    setChecked([]);
  };

  const customList = (title, items) => (
    <Card className="w-[260px]">
      <CardHeader>
        {title === 'Choices' && (
          <Input
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-2"
          />
        )}
        {title === 'Chosen' && (
          <p className="text-sm font-semibold">{items.length} selected</p>
        )}
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          {items
            .filter((student) =>
              `${student.firstName} ${student.lastName}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
            )
            .map((student) => (
              <div
                key={student.id}
                className="flex cursor-pointer items-center p-2 hover:bg-gray-100"
                onClick={() => handleToggle(student)}
              >
                <Checkbox checked={checked.indexOf(student) !== -1} />
                <Avatar className="ml-2">
                  <AvatarImage src={student.profilePicture?.signedUrl} />
                  <AvatarFallback>
                    {student.firstName[0]}
                    {student.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="ml-2">
                  {student.firstName} {student.lastName}
                </span>
                {title === 'Chosen' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto"
                    onClick={() => handleToggle(student)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[680px]">
        <DialogTitle>{title}</DialogTitle>
        <div className="mt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setImportGroupsDialogOpen(true)}
            className="mb-4"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Import groups
          </Button>
          <div className="flex justify-center space-x-4">
            {customList('Choices', left)}
            <div className="flex flex-col justify-center space-y-2">
              <Button
                onClick={handleCheckedRight}
                disabled={
                  checked.filter((value) => left.includes(value)).length === 0
                }
              >
                &gt;
              </Button>
              <Button
                onClick={handleCheckedLeft}
                disabled={
                  checked.filter((value) => right.includes(value)).length === 0
                }
              >
                &lt;
              </Button>
            </div>
            {customList('Chosen', right)}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleAddMembers}
            disabled={right.length === 0 || addMembersLoading}
          >
            {addMembersLoading ? 'Confirming...' : 'Confirm'}
          </Button>
        </DialogFooter>
      </DialogContent>
      <ImportedGroupsDialog
        title="Import groups"
        open={importGroupsDialogOpen}
        setOpen={setImportGroupsDialogOpen}
        importedGroups={importedGroups}
        setImportedGroups={setImportedGroups}
        group={group}
        studentsLoading={studentsLoading}
        setStudentsLoading={setStudentsLoading}
        setRight={setRight}
      />
    </Dialog>
  );
};

export default AddMembersDialog;
