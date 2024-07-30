import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { RESEND_INVITATION } from './UserManagementService';
import { useToast } from '@/components/ui/use-toast';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Send, Trash } from 'lucide-react';

interface UserAccess {
  id: string;
  email: string;
  role: string;
  userType: string;
  status: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    profilePicture?: {
      signedUrl: string;
    };
  } | null;
  linkedTo?: {
    id: string;
    firstName: string;
    lastName: string;
    profilePicture?: {
      signedUrl: string;
    };
  };
}

interface UserManagementListProps {
  datas: UserAccess[];
  setUserName: (name: string) => void;
  setMail: (mail: string) => void;
  handleRemove: (id: string) => void;
  refetch: () => void;
  currentUser: {
    id: string;
    role: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
    };
  };
}

export const UserManagementList: React.FC<UserManagementListProps> = ({
  datas,
  setUserName,
  setMail,
  handleRemove,
  refetch,
  currentUser
}) => {
  const { toast } = useToast();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const [resendInvitation] = useMutation(RESEND_INVITATION, {
    onCompleted(data) {
      if (data.resendInvitation.id) {
        toast({ title: 'Success', description: 'Invitation mail resent' });
        refetch();
      }
    },
    onError(error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again',
        variant: 'destructive'
      });
    }
  });

  const handleResend = (userAccessId: string) => {
    resendInvitation({
      variables: {
        userAccessId
      }
    });
  };

  const columns: ColumnDef<UserAccess>[] = [
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue('email')}</div>
      )
    },
    {
      accessorKey: 'user',
      header: 'User',
      cell: ({ row }) => {
        const user = row.original.user;
        return (
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={user?.profilePicture?.signedUrl} />
              <AvatarFallback>
                {user ? `${user.firstName[0]}${user.lastName[0]}` : 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">
                {user
                  ? `${user.firstName} ${user.lastName}`
                  : 'Unregistered User'}
              </p>
            </div>
          </div>
        );
      }
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => {
        const role = row.getValue('role') as string;
        return <Badge>{role}</Badge>;
      }
    },
    {
      accessorKey: 'linkedTo',
      header: 'Linked To',
      cell: ({ row }) => {
        const linkedTo = row.original.linkedTo;
        if (!linkedTo) return <span>Not linked</span>;
        return (
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={linkedTo.profilePicture?.signedUrl} />
              <AvatarFallback>{`${linkedTo.firstName[0]}${linkedTo.lastName[0]}`}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{`${linkedTo.firstName} ${linkedTo.lastName}`}</p>
              <p className="text-sm text-gray-500">
                {row.original.userType.toLowerCase()}
              </p>
            </div>
          </div>
        );
      }
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        let badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline' =
          'default';
        switch (status) {
          case 'AWAITING':
            badgeVariant = 'secondary';
            break;
          case 'HAS_ACCESS':
            badgeVariant = 'default';
            break;
          default:
            badgeVariant = 'destructive';
        }
        return <Badge variant={badgeVariant}>{status}</Badge>;
      }
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const userAccess = row.original;
        return (
          currentUser.id !== userAccess.id && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {userAccess.status === 'AWAITING' && (
                  <DropdownMenuCheckboxItem
                    onClick={() => handleResend(userAccess.id)}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    <span>Resend</span>
                  </DropdownMenuCheckboxItem>
                )}
                <DropdownMenuCheckboxItem
                  onClick={() => {
                    setUserName(
                      `${userAccess.user?.firstName || ''} ${
                        userAccess.user?.lastName || ''
                      }`
                    );
                    setMail(userAccess.email);
                    handleRemove(userAccess.id);
                  }}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        );
      }
    }
  ];

  const table = useReactTable({
    data: datas,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection
    }
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('email')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserManagementList;
