import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';
import AssignmentCard from './AssignmentCard';

const Results = ({
  className,
  handleSend,
  handleEdit,
  handleRemove,
  refetch,
  assignments,
  ...rest
}) => {
  const [rows, setRows] = useState(assignments);
  const [searched, setSearched] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [page, setPage] = useState(1);
  const [noOfPages, setNoOfPages] = useState(
    Math.ceil(assignments.length / itemsPerPage)
  );

  const rowsPerPage = [
    { key: 15, value: 15 },
    { key: 50, value: 50 },
    { key: 100, value: 100 }
  ];

  useEffect(() => {
    setNoOfPages(Math.ceil(assignments.length / itemsPerPage));
    if (page === noOfPages) {
      if (assignments.length % itemsPerPage === 0)
        setPage(Math.ceil(assignments.length / itemsPerPage));
    } else if (page > noOfPages) {
      setPage(1);
    }
  }, [assignments.length]);

  useEffect(() => {
    setPage(1);
  }, [assignments.length === 1]);

  useEffect(() => {
    setRows(assignments);
  }, [assignments]);

  const requestSearch = (searchedVal) => {
    const filteredRows = assignments.filter((row) => {
      return row.title.toLowerCase().includes(searchedVal.toLowerCase());
    });
    setPage(1);
    setNoOfPages(Math.ceil(filteredRows.length / itemsPerPage));
    setRows(filteredRows);
  };

  const handleRowsChange = (value) => {
    setPage(1);
    setItemsPerPage(parseInt(value));
    setNoOfPages(Math.ceil(assignments.length / parseInt(value)));
  };

  return (
    <div className={`space-y-4 ${className}`} {...rest}>
      {(assignments.length > 0 || rows.length > 0) && (
        <Card>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Type assignment title to search..."
                value={searched}
                onChange={(e) => {
                  setSearched(e.target.value);
                  requestSearch(e.target.value);
                }}
              />
              <Button
                variant="outline"
                onClick={() => {
                  setSearched('');
                  requestSearch('');
                }}
              >
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      {rows.length === 0 && (
        <div className="flex items-center justify-center p-4">
          <p className="text-muted-foreground">
            Sorry, no matching records found
          </p>
        </div>
      )}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {rows.length} {rows.length === 1 ? 'Record' : 'Records'} found. Page{' '}
          {page} of {noOfPages}
        </p>
        <div className="flex items-center space-x-2">
          <Label htmlFor="rowsPerPage">Rows per page:</Label>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={handleRowsChange}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder={itemsPerPage} />
            </SelectTrigger>
            <SelectContent>
              {rowsPerPage.map((option) => (
                <SelectItem key={option.key} value={option.value.toString()}>
                  {option.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-4">
        {rows
          .slice((page - 1) * itemsPerPage, page * itemsPerPage)
          .map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              handleSend={handleSend}
              handleEdit={handleEdit}
              handleRemove={handleRemove}
              refetch={refetch}
            />
          ))}
      </div>
      {rows.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(page - 1) * itemsPerPage + 1} to{' '}
            {Math.min(page * itemsPerPage, rows.length)} of {rows.length}{' '}
            results
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
      )}
    </div>
  );
};

export default Results;
