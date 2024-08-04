import React, { useState, useEffect, useMemo } from 'react';
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
  const [searched, setSearched] = useState('');
  const [mode, setMode] = useState('grid');
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [page, setPage] = useState(1);

  const filteredRows = useMemo(
    () =>
      groups.filter((row) =>
        row.name.toLowerCase().includes(searched.toLowerCase())
      ),
    [groups, searched]
  );

  const noOfPages = Math.ceil(filteredRows.length / itemsPerPage);
  const paginatedRows = filteredRows.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  useEffect(() => {
    setPage(1);
  }, [searched, itemsPerPage]);

  return (
    <div className="flex h-full w-full flex-col space-y-4">
      <div className="mt-4 flex flex-col items-center space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
        <div className="relative w-full flex-grow sm:w-auto ">
          <Input
            placeholder="Type group name to search..."
            value={searched}
            onChange={(e) => setSearched(e.target.value)}
            className="border-r pr-8"
          />
          {searched && (
            <button
              onClick={() => setSearched('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 transform"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          )}
        </div>
        <Button variant="outline" size="icon" className="flex-shrink-0">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-col items-center justify-between space-y-2 sm:flex-row sm:space-y-0">
        <p className="text-sm text-muted-foreground">
          {filteredRows.length}{' '}
          {filteredRows.length === 1 ? 'Record' : 'Records'} found. Page {page}{' '}
          of {noOfPages}
        </p>
      </div>

      <div className="flex-grow overflow-auto">
        {filteredRows.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">
              Sorry, no matching records found
            </p>
          </div>
        ) : (
          <div
            className={`grid ${
              mode === 'grid'
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-1'
            } gap-4`}
          >
            {paginatedRows.map((group) => (
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

      {filteredRows.length > 0 && (
        <div className="flex flex-col items-center justify-between space-y-4 border-t pt-4 sm:flex-row sm:space-y-0">
          <Select
            value={String(itemsPerPage)}
            onValueChange={(value) => setItemsPerPage(Number(value))}
          >
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
              onClick={() => setPage((p) => Math.max(1, p - 1))}
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
              onClick={() => setPage((p) => Math.min(noOfPages, p + 1))}
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
