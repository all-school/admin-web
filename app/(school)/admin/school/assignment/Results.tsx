import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';
import AssignmentCard from './AssignmentCard';

const Results = ({ assignments, handleRemove, handleSend, refetch }) => {
  const [rows, setRows] = useState(assignments);
  const [searched, setSearched] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setRows(assignments);
  }, [assignments]);

  const filteredRows = rows.filter((row) =>
    row.title.toLowerCase().includes(searched.toLowerCase())
  );

  const paginatedRows = filteredRows.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  const pageCount = Math.ceil(filteredRows.length / itemsPerPage);

  return (
    <div className="space-y-4">
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <Input
              placeholder="Search assignments..."
              value={searched}
              onChange={(e) => setSearched(e.target.value)}
              className="w-full sm:w-64"
            />
            <div className="flex items-center space-x-2">
              <Label htmlFor="rowsPerPage" className="whitespace-nowrap">
                Rows:
              </Label>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => setItemsPerPage(Number(value))}
              >
                <SelectTrigger className="w-[70px]">
                  <SelectValue placeholder={itemsPerPage} />
                </SelectTrigger>
                <SelectContent>
                  {[15, 25, 50].map((option) => (
                    <SelectItem key={option} value={option.toString()}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {paginatedRows.map((assignment) => (
          <AssignmentCard
            key={assignment.id}
            assignment={assignment}
            handleSend={handleSend}
            handleRemove={handleRemove}
            refetch={refetch}
          />
        ))}
      </div>

      {filteredRows.length > itemsPerPage && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              />
            </PaginationItem>
            {[...Array(pageCount)].map((_, i) => (
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
                onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default Results;
