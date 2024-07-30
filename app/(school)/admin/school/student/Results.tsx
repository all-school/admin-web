'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  MoreVertical,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  CREATE_STUDENT,
  GET_STUDENTS_LIST,
  DELETE_STUDENT
} from './StudentListService';
import { z } from 'zod';
import { format } from 'date-fns';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
const validationSchema = z.object({
  firstName: z.string().min(2).max(255),
  lastName: z.string().min(2).max(255),
  dob: z.date()
});

const Results = ({ isNewStudentModalOpen, setIsNewStudentModalOpen }) => {
  const { toast } = useToast();
  const pathname = usePathname();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: null
  });
  const [errors, setErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  const { data, loading, error, refetch } = useQuery(GET_STUDENTS_LIST, {
    variables: { queryByType: 'SCHOOL' }
  });

  useEffect(() => {
    if (data && data.students) {
      const filtered = data.students.filter((student) =>
        `${student.firstName} ${student.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
      setFilteredStudents(filtered);
      setCurrentPage(1);
    }
  }, [data, searchTerm]);

  const [createStudent] = useMutation(CREATE_STUDENT, {
    onCompleted() {
      toast({
        title: 'Success',
        description: 'Student created successfully.',
        variant: 'default'
      });
      refetch();
      setFormData({ firstName: '', lastName: '', dob: null });
      setIsNewStudentModalOpen(false);
    },
    onError() {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive'
      });
    }
  });

  const [deleteStudent] = useMutation(DELETE_STUDENT, {
    onCompleted() {
      toast({
        title: 'Success',
        description: 'Student deleted successfully.',
        variant: 'default'
      });
      refetch();
    },
    onError() {
      toast({
        title: 'Error',
        description: 'Failed to delete student. Please try again.',
        variant: 'destructive'
      });
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e) => {
    setFormData((prev) => ({ ...prev, dob: new Date(e.target.value) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      validationSchema.parse(formData);
      createStudent({
        variables: {
          ...formData,
          dob: formData.dob.toISOString().split('T')[0]
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(error.flatten().fieldErrors);
      }
    }
  };

  const handleDeleteStudent = (id) => {
    deleteStudent({ variables: { studentId: id } });
  };

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="flex h-full flex-col">
      <div className="flex-grow overflow-auto">
        <div className="space-y-4 pb-16">
          <Input
            className="max-w-sm"
            placeholder="Type student name to search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {paginatedStudents.map((student) => (
              <Card key={student.id} className="overflow-hidden">
                <CardContent className="flex items-center justify-between p-4">
                  <Link href={`${pathname}/${student.id}`}>
                    <div className="flex items-center space-x-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-lg font-semibold">
                        {student.firstName[0]}
                        {student.lastName[0]}
                      </div>
                      <div>
                        <h3 className="font-semibold">{`${student.firstName} ${student.lastName}`}</h3>
                        <p className="text-sm text-gray-500">
                          {format(new Date(student.dob), 'EEE, MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteStudent(student.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 bg-gray-100 pb-8 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span>Records per page:</span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => setItemsPerPage(Number(value))}
            >
              <SelectTrigger className="w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[15, 25, 50, 100].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {pageNumbers.map((number) => (
              <Button
                key={number}
                variant={currentPage === number ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentPage(number)}
              >
                {number}
              </Button>
            ))}
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <span>Jump to page:</span>
            <Select
              value={currentPage.toString()}
              onValueChange={(value) => setCurrentPage(Number(value))}
            >
              <SelectTrigger className="w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageNumbers.map((number) => (
                  <SelectItem key={number} value={number.toString()}>
                    {number}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Dialog
        open={isNewStudentModalOpen}
        onOpenChange={setIsNewStudentModalOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Student</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleInputChange}
              className={errors.firstName ? 'border-red-500' : ''}
            />
            {errors.firstName && (
              <div className="text-red-500">{errors.firstName}</div>
            )}

            <Input
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleInputChange}
              className={errors.lastName ? 'border-red-500' : ''}
            />
            {errors.lastName && (
              <div className="text-red-500">{errors.lastName}</div>
            )}

            <Input
              type="date"
              name="dob"
              value={
                formData.dob ? format(new Date(formData.dob), 'yyyy-MM-dd') : ''
              }
              onChange={handleDateChange}
              className={errors.dob ? 'border-red-500' : ''}
            />
            {errors.dob && <div className="text-red-500">{errors.dob}</div>}

            <Button type="submit">Create Student</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Results;
