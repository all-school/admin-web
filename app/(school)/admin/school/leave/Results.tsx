import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Pagination } from '@/components/ui/pagination';
import LeaveCard from './LeaveCard';

interface ResultsProps {
  refetch: () => void;
  leaves: any[];
}

function Results({ refetch, leaves }: ResultsProps) {
  const [rows, setRows] = useState(leaves);
  const [searched, setSearched] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [page, setPage] = useState(1);
  const [noOfPages, setNoOfPages] = useState(
    Math.ceil(leaves.length / itemsPerPage)
  );

  const rowsPerPage = [20, 50, 100];

  useEffect(() => {
    setNoOfPages(Math.ceil(leaves.length / itemsPerPage));
    if (page === noOfPages) {
      if (leaves.length % itemsPerPage === 0)
        setPage(Math.ceil(leaves.length / itemsPerPage));
    } else if (page > noOfPages) {
      setPage(1);
    }
  }, [leaves.length, itemsPerPage]);

  useEffect(() => {
    setPage(1);
  }, []);

  useEffect(() => {
    setRows(leaves);
  }, [leaves]);

  const requestSearch = (searchedVal: string) => {
    const filteredRows = leaves.filter((row) => {
      const name = `${row.student.firstName} ${row.student.lastName}`;
      return name.toLowerCase().includes(searchedVal.toLowerCase());
    });
    setPage(1);
    setNoOfPages(Math.ceil(filteredRows.length / itemsPerPage));
    setRows(filteredRows);
  };

  return (
    <div className="space-y-4">
      {(leaves.length > 0 || rows.length > 0) && (
        <Input
          placeholder="Type student name to search..."
          value={searched}
          onChange={(e) => {
            setSearched(e.target.value);
            requestSearch(e.target.value);
          }}
        />
      )}
      {rows.length === 0 && (
        <p className="text-center text-muted-foreground">
          Sorry, no matching records found
        </p>
      )}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {rows.length} Record{rows.length !== 1 && 's'} found. Page {page} of{' '}
          {noOfPages}
        </p>
        <Select
          value={itemsPerPage.toString()}
          onValueChange={(value) => setItemsPerPage(Number(value))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Records per page" />
          </SelectTrigger>
          <SelectContent>
            {rowsPerPage.map((value) => (
              <SelectItem key={value} value={value.toString()}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {rows
          .slice((page - 1) * itemsPerPage, page * itemsPerPage)
          .map((leave) => (
            <LeaveCard key={leave.id} leave={leave} refetch={refetch} />
          ))}
      </div>
      {rows.length > 0 && (
        <div className="mt-4 flex justify-center">
          <Pagination
            count={noOfPages}
            page={page}
            onChange={(_, value) => setPage(value)}
          />
        </div>
      )}
    </div>
  );
}

export default Results;
