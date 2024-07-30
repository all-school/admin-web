import React, { useState, useEffect } from 'react';
import { useMutation, useLazyQuery } from '@apollo/client';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  GRANT_USER_ACCESS,
  GET_STUDENT_ID_BY_NAME
} from './UserManagementService';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Search } from 'lucide-react';
import useDebounce from '@/hooks/useDebounce';

const schema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  userType: z.enum(['STUDENT', 'SUPPORT_STAFF']),
  studentId: z.string().optional()
});

type FormData = z.infer<typeof schema>;

interface AddDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  refetch: () => void;
}

const AddDialog: React.FC<AddDialogProps> = ({ open, setOpen, refetch }) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [options, setOptions] = useState<any[]>([]);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      userType: 'STUDENT'
    }
  });

  const [getStudents, { loading: searchLoading }] = useLazyQuery(
    GET_STUDENT_ID_BY_NAME,
    {
      fetchPolicy: 'network-only',
      onCompleted: (data) => {
        setOptions(
          (
            data?.search?.filter((item) => item?.__typename === 'Student') || []
          ).filter(Boolean)
        );
      },
      onError: (error) => {
        console.error('Error searching for students:', error);
        toast({
          title: 'Error',
          description: 'Failed to search for students. Please try again.',
          variant: 'destructive'
        });
      }
    }
  );

  const [grantUserAccess, { loading }] = useMutation(GRANT_USER_ACCESS, {
    onCompleted() {
      toast({
        title: 'Success',
        description: 'Invitation mail sent successfully.'
      });
      refetch();
      handleClose();
    },
    onError(error) {
      if (error.message.includes('User access already exists')) {
        toast({
          title: 'Error',
          description: 'Email already exists',
          variant: 'destructive'
        });
      } else if (error.message.includes('User Type ID" is required')) {
        toast({
          title: 'Error',
          description: 'Student name is required',
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Error',
          description: 'Something went wrong. Please try again',
          variant: 'destructive'
        });
      }
    }
  });

  useEffect(() => {
    if (debouncedSearchTerm.length >= 3) {
      getStudents({
        variables: {
          searchType: ['STUDENT'],
          text: debouncedSearchTerm
        }
      });
    } else {
      setOptions([]);
    }
  }, [debouncedSearchTerm, getStudents]);

  const onSubmit = (data: FormData) => {
    grantUserAccess({
      variables: {
        email: data.email,
        userType: data.userType,
        userTypeId:
          data.userType === 'STUDENT' ? selectedStudent?.id : undefined,
        notifyUserByEmail: true
      }
    });
  };

  const userType = watch('userType');

  const handleStudentSelect = (student: any) => {
    setSelectedStudent(student);
    setValue('studentId', student.id);
    setSearchTerm('');
    setOptions([]);
  };

  const handleClose = () => {
    setOpen(false);
    reset();
    setSelectedStudent(null);
    setSearchTerm('');
    setOptions([]);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite user</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Email"
                  error={errors.email?.message}
                />
              )}
            />
            <Controller
              name="userType"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select user type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STUDENT">Parent</SelectItem>
                    <SelectItem value="SUPPORT_STAFF">Administrator</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {userType === 'STUDENT' && (
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400" />
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search for a student"
                    className="pl-10"
                  />
                </div>
                {searchLoading && (
                  <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                )}
                {options.length > 0 && (
                  <ScrollArea className="h-[200px] w-full rounded-md border">
                    {options.map((student) => (
                      <Button
                        key={student.id}
                        variant="ghost"
                        className="w-full justify-start p-2"
                        onClick={() => handleStudentSelect(student)}
                      >
                        <Avatar className="mr-2 h-8 w-8">
                          <AvatarImage
                            src={student.profilePicture?.signedUrl}
                          />
                          <AvatarFallback>
                            {student.firstName?.[0]}
                            {student.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span>
                          {student.firstName} {student.lastName}
                        </span>
                      </Button>
                    ))}
                  </ScrollArea>
                )}
                {selectedStudent && (
                  <div className="flex items-center">
                    <span className="mr-2">Selected:</span>
                    <Avatar className="mr-2 h-8 w-8">
                      <AvatarImage
                        src={selectedStudent.profilePicture?.signedUrl}
                      />
                      <AvatarFallback>
                        {selectedStudent.firstName?.[0]}
                        {selectedStudent.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span>
                      {selectedStudent.firstName} {selectedStudent.lastName}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={handleClose} type="button">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || (userType === 'STUDENT' && !selectedStudent)}
            >
              {loading ? 'Inviting...' : 'Invite'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDialog;
