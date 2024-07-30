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
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { GET_GROUP_BY_ID, UPDATE_GROUP } from './GroupExService';

const EditGroupDialog = ({ open, setOpen, groupId }) => {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [leadTeacher, setLeadTeacher] = useState(null);

  const { data, loading, error } = useQuery(GET_GROUP_BY_ID, {
    variables: { id: groupId },
    skip: !groupId
  });

  const [updateGroup, { loading: updateLoading }] = useMutation(UPDATE_GROUP, {
    onCompleted(data) {
      if (data.updateGroup) {
        toast({
          title: 'Success',
          description: 'Group updated successfully'
        });
        setOpen(false);
      }
    },
    onError(error) {
      toast({
        title: 'Error',
        description: 'Failed to update group. Please try again.',
        variant: 'destructive'
      });
    }
  });

  useEffect(() => {
    if (data && data.group) {
      setName(data.group.name);
      setType(data.group.type);
      setDescription(data.group.description || '');
      setLeadTeacher(data.group.leadTeacher);
    }
  }, [data]);

  const handleSubmit = () => {
    updateGroup({
      variables: {
        groupId,
        name,
        type,
        description,
        leadTeacher: leadTeacher ? leadTeacher.id : null
      }
    });
  };

  if (loading) return null;
  if (error) {
    toast({
      title: 'Error',
      description: 'Failed to fetch group details. Please try again.',
      variant: 'destructive'
    });
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Group</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="type">Type</Label>
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
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <Label>Lead Teacher</Label>
            {leadTeacher ? (
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage src={leadTeacher.profilePicture?.signedUrl} />
                  <AvatarFallback>{`${leadTeacher.firstName[0]}${leadTeacher.lastName[0]}`}</AvatarFallback>
                </Avatar>
                <span>{`${leadTeacher.firstName} ${leadTeacher.lastName}`}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLeadTeacher(null)}
                >
                  Remove
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No lead teacher assigned
              </p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={updateLoading}>
            {updateLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              'Update'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditGroupDialog;
