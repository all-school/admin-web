import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Send, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import {
  GET_USER_ACCESS,
  GRANT_USER_ACCESS,
  DELETE_USER_ACCESS
} from './StudentDetailService';

const UserAccess = ({ student, handleResend }) => {
  const [email, setEmail] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const { toast } = useToast();

  const { data, loading, error, refetch } = useQuery(GET_USER_ACCESS, {
    variables: {
      queryByType: 'STUDENT',
      queryById: student.id
    },
    errorPolicy: 'all'
  });

  const [grantUserAccess] = useMutation(GRANT_USER_ACCESS, {
    onCompleted() {
      toast({
        title: 'Invitation sent',
        description: 'An invitation email has been sent to the user.'
      });
      setEmail('');
      refetch();
    },
    onError(error) {
      if (error.graphQLErrors[0].message === 'User access already exists!') {
        toast({
          title: 'Error',
          description: 'This email has already been added.',
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Error',
          description: 'Something went wrong. Please try again.',
          variant: 'destructive'
        });
      }
      console.error(error);
    }
  });

  const [deleteUserAccess] = useMutation(DELETE_USER_ACCESS, {
    onCompleted() {
      toast({
        title: 'Access revoked',
        description: "The user's access has been successfully revoked."
      });
      refetch();
    },
    onError(error) {
      toast({
        title: 'Error',
        description: 'Failed to revoke access. Please try again.',
        variant: 'destructive'
      });
      console.error(error);
    }
  });

  const handleGrantAccess = (e) => {
    e.preventDefault();
    grantUserAccess({
      variables: {
        email,
        userType: 'STUDENT',
        userTypeId: student.id,
        notifyUserByEmail: true
      }
    });
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (userToDelete) {
      deleteUserAccess({ variables: { userAccessId: userToDelete.id } });
    }
    setDeleteConfirmOpen(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading user access data</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Grant Access</h3>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGrantAccess} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                required
              />
            </div>
            <Button type="submit">Grant Access</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">User Access List</h3>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.userAccesses.map((access) => (
                <TableRow key={access.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage
                          src={access.user?.profilePicture?.signedUrl}
                        />
                        <AvatarFallback>
                          {access.email[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div>
                          {access.user
                            ? `${access.user.firstName} ${access.user.lastName}`
                            : 'Unregistered User'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {access.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        access.status === 'HAS_ACCESS'
                          ? 'success'
                          : access.status === 'AWAITING'
                          ? 'warning'
                          : 'destructive'
                      }
                    >
                      {access.status === 'HAS_ACCESS'
                        ? 'Has Access'
                        : access.status === 'AWAITING'
                        ? 'Awaiting'
                        : 'Rejected'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {access.status === 'AWAITING' && (
                          <DropdownMenuItem
                            onClick={() => handleResend(access.id)}
                          >
                            <Send className="mr-2 h-4 w-4" />
                            <span>Resend Invitation</span>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(access)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Revoke Access</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will revoke access for {userToDelete?.email}. You can
              grant access again at any time.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Revoke Access
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserAccess;
