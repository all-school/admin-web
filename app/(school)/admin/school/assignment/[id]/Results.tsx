import React, { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';
import Response from './Response';

interface Assignment {
  id: string;
  student: {
    firstName: string;
    lastName: string;
  };
  // Add other properties as needed
}

interface ResultsProps {
  assignments: Assignment[];
  refetch: () => void;
}

const Results: React.FC<ResultsProps> = ({ assignments, refetch }) => {
  const [searched, setSearched] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [page, setPage] = useState(1);

  const filteredRows = useMemo(() => {
    return assignments.filter((row) => {
      const fullName =
        `${row.student.firstName} ${row.student.lastName}`.toLowerCase();
      return fullName.includes(searched.toLowerCase());
    });
  }, [assignments, searched]);

  const paginatedRows = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    return filteredRows.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRows, page, itemsPerPage]);

  const noOfPages = Math.ceil(filteredRows.length / itemsPerPage);

  useEffect(() => {
    setPage(1);
  }, [searched, itemsPerPage]);

  const handleSearch = (value: string) => {
    setSearched(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Search by student name..."
          value={searched}
          onChange={(e) => handleSearch(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex items-center space-x-2">
          <span className="whitespace-nowrap text-sm text-muted-foreground">
            Rows per page:
          </span>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => setItemsPerPage(Number(value))}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder={itemsPerPage} />
            </SelectTrigger>
            <SelectContent>
              {[15, 30, 50].map((value) => (
                <SelectItem key={value} value={value.toString()}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredRows.length === 0 ? (
        <div className="py-8 text-center text-muted-foreground">
          No matching records found
        </div>
      ) : (
        <div className="space-y-4">
          {paginatedRows.map((assignment) => (
            <Response
              key={assignment.id}
              assignment={assignment}
              refetch={refetch}
            />
          ))}
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {(page - 1) * itemsPerPage + 1} to{' '}
          {Math.min(page * itemsPerPage, filteredRows.length)} of{' '}
          {filteredRows.length} results
        </p>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              />
            </PaginationItem>
            {[...Array(noOfPages)].map((_, i) => (
              <PaginationItem key={i + 1} className="hidden sm:inline-block">
                <PaginationLink
                  onClick={() => setPage(i + 1)}
                  isActive={page === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setPage((p) => Math.min(noOfPages, p + 1))}
                disabled={page === noOfPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default Results;
