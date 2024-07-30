import React, { useState, useEffect } from 'react';
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

interface ResultsProps {
  assignments: any[];
  refetch: () => void;
}

const Results: React.FC<ResultsProps> = ({ assignments, refetch }) => {
  const [rows, setRows] = useState(assignments);
  const [searched, setSearched] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [page, setPage] = useState(1);
  const [noOfPages, setNoOfPages] = useState(
    Math.ceil(assignments.length / itemsPerPage)
  );

  useEffect(() => {
    setNoOfPages(Math.ceil(assignments.length / itemsPerPage));
    if (page === noOfPages) {
      if (assignments.length % itemsPerPage === 0)
        setPage(Math.ceil(assignments.length / itemsPerPage));
    } else if (page > noOfPages) {
      setPage(1);
    }
  }, [assignments.length, itemsPerPage]);

  useEffect(() => {
    setRows(assignments);
  }, [assignments]);

  const requestSearch = (searchedVal: string) => {
    const filteredRows = assignments.filter((row) => {
      return (
        row.student.firstName
          .toLowerCase()
          .includes(searchedVal.toLowerCase()) ||
        row.student.lastName.toLowerCase().includes(searchedVal.toLowerCase())
      );
    });
    setPage(1);
    setNoOfPages(Math.ceil(filteredRows.length / itemsPerPage));
    setRows(filteredRows);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search by student name..."
          value={searched}
          onChange={(e) => {
            setSearched(e.target.value);
            requestSearch(e.target.value);
          }}
          className="max-w-sm"
        />
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Rows per page:</span>
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

      {rows.length === 0 ? (
        <div className="text-center text-muted-foreground">
          No matching records found
        </div>
      ) : (
        <div className="space-y-4">
          {rows
            .slice((page - 1) * itemsPerPage, page * itemsPerPage)
            .map((assignment) => (
              <Response
                key={assignment.id}
                assignment={assignment}
                refetch={refetch}
              />
            ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {(page - 1) * itemsPerPage + 1} to{' '}
          {Math.min(page * itemsPerPage, rows.length)} of {rows.length} results
        </p>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage(Math.max(1, page - 1))}
              />
            </PaginationItem>
            {[...Array(noOfPages)].map((_, i) => (
              <PaginationItem key={i + 1}>
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
                onClick={() => setPage(Math.min(noOfPages, page + 1))}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default Results;
