import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import { LayoutGrid, List, Search, X } from 'lucide-react';
import GroupCard from './GroupCard';

const Results = ({
  handleEdit,
  handleRemove,
  handleSetAttendanceType,
  refetch,
  groups
}) => {
  const [rows, setRows] = useState(groups);
  const [searched, setSearched] = useState('');
  const [mode, setMode] = useState('grid');
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [page, setPage] = useState(1);
  const [noOfPages, setNoOfPages] = useState(
    Math.ceil(groups.length / itemsPerPage)
  );

  useEffect(() => {
    setNoOfPages(Math.ceil(rows.length / itemsPerPage));
    if (page > Math.ceil(rows.length / itemsPerPage)) {
      setPage(1);
    }
  }, [rows.length, itemsPerPage]);

  useEffect(() => {
    setRows(groups);
  }, [groups]);

  const handleRowsChange = (value) => {
    setPage(1);
    setItemsPerPage(Number(value));
  };

  const requestSearch = (searchedVal) => {
    const filteredRows = groups.filter((row) => {
      return row.name.toLowerCase().includes(searchedVal.toLowerCase());
    });
    setPage(1);
    setRows(filteredRows);
  };

  const clearSearch = () => {
    setSearched('');
    setRows(groups);
  };

  return (
    <div className="flex h-[calc(100vh-200px)] flex-col">
      <div className="mb-4 space-y-4">
        <div className="flex items-center space-x-2">
          <div className="relative flex-grow">
            <Input
              placeholder="Type group name to search..."
              value={searched}
              onChange={(e) => {
                setSearched(e.target.value);
                requestSearch(e.target.value);
              }}
              className="pr-8"
            />
            {searched && (
              <button
                onClick={clearSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 transform"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            )}
          </div>
          <Button variant="outline" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {rows.length} {rows.length === 1 ? 'Record' : 'Records'} found. Page{' '}
            {page} of {noOfPages}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMode(mode === 'grid' ? 'list' : 'grid')}
          >
            {mode === 'grid' ? (
              <List className="h-4 w-4" />
            ) : (
              <LayoutGrid className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="flex-grow overflow-auto">
        {rows.length === 0 ? (
          <div className="py-4 text-center">
            <p className="text-muted-foreground">
              Sorry, no matching records found
            </p>
          </div>
        ) : (
          <div
            className={`grid ${
              mode === 'grid'
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-1'
            } gap-4`}
          >
            {rows
              .slice((page - 1) * itemsPerPage, page * itemsPerPage)
              .map((group) => (
                <GroupCard
                  key={group.id}
                  group={group}
                  handleEdit={handleEdit}
                  handleRemove={handleRemove}
                  handleSetAttendanceType={handleSetAttendanceType}
                  refetch={refetch}
                />
              ))}
          </div>
        )}
      </div>

      {rows.length > 0 && (
        <div className="mt-4 flex items-center justify-between border-t pt-4">
          <Select value={String(itemsPerPage)} onValueChange={handleRowsChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Records per page" />
            </SelectTrigger>
            <SelectContent>
              {[15, 50, 100].map((value) => (
                <SelectItem key={value} value={String(value)}>
                  {value} per page
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Pagination className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="mx-2">
              Page {page} of {noOfPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.min(noOfPages, page + 1))}
              disabled={page === noOfPages}
            >
              Next
            </Button>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default Results;
