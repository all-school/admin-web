import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useMutation } from '@apollo/client';
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { REMOVE_MEMBERS } from './GroupExService';
import DeleteDialog from './DeleteDialog';
import { MoreVertical, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 15;

const MemberListItem = React.memo(({ member, onRemove }) => (
  <Card className="h-full">
    <CardContent className="p-4">
      <div className="flex h-full flex-col">
        <div className="mb-4 flex items-center space-x-4">
          <Avatar>
            <AvatarImage
              src={member.profilePicture?.signedUrl}
              alt={`${member.firstName} ${member.lastName}`}
            />
            <AvatarFallback>
              {member.firstName[0]}
              {member.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-grow">
            <p className="truncate font-medium">
              {member.firstName} {member.lastName}
            </p>
            <p className="truncate text-sm text-gray-500">{member.email}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault();
                  onRemove(member.id);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Remove member</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Link href={`/admin/school/student/${member.id}`} className="mt-auto">
          <Button variant="outline" size="sm" className="w-full">
            View Profile
          </Button>
        </Link>
      </div>
    </CardContent>
  </Card>
));

MemberListItem.displayName = 'MemberListItem';

function Members({ group, refetch }) {
  const [searched, setSearched] = useState('');
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const { toast } = useToast();

  const [removeMembers, { loading: removeMembersLoading }] = useMutation(
    REMOVE_MEMBERS,
    {
      onCompleted(data) {
        if (data.removeMembers.error) {
          toast({
            title: 'Error',
            description: data.removeMembers.error,
            variant: 'destructive'
          });
        } else {
          toast({
            title: 'Success',
            description: 'Member removed from the group'
          });
          refetch();
        }
        setDeleteDialogOpen(false);
      },
      onError() {
        toast({
          title: 'Error',
          description: 'Something went wrong. Please try again',
          variant: 'destructive'
        });
        setDeleteDialogOpen(false);
      }
    }
  );

  const filteredRows = useMemo(() => {
    return (group.members || []).filter((member) => {
      const name = `${member.firstName} ${member.lastName}`.toLowerCase();
      return name.includes(searched.toLowerCase());
    });
  }, [group.members, searched]);

  const totalPages = Math.ceil(filteredRows.length / itemsPerPage);
  const currentPageData = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    return filteredRows.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRows, page, itemsPerPage]);

  const handleSearchChange = useCallback((e) => {
    setSearched(e.target.value);
    setPage(1);
  }, []);

  const handleChangePage = useCallback((newPage) => setPage(newPage), []);
  const handleChangeItemsPerPage = useCallback((value) => {
    setItemsPerPage(parseInt(value));
    setPage(1);
  }, []);

  const handleDeleteClick = useCallback((memberId) => {
    setSelectedMemberId(memberId);
    setDeleteDialogOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    removeMembers({
      variables: { groupId: group.id, members: [selectedMemberId] }
    });
  }, [removeMembers, group.id, selectedMemberId]);

  return (
    <Card className="w-full">
      <CardContent className="space-y-6 p-6">
        <Input
          placeholder="Search members..."
          value={searched}
          onChange={handleSearchChange}
          className="max-w-sm"
        />

        {filteredRows.length === 0 ? (
          <p className="text-center text-gray-500">
            No members found in this group
          </p>
        ) : (
          <>
            <p className="text-sm text-gray-500">
              {filteredRows.length} Member{filteredRows.length !== 1 ? 's' : ''}{' '}
              in this group. Page {page} of {totalPages}
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {currentPageData.map((member) => (
                <MemberListItem
                  key={member.id}
                  member={member}
                  onRemove={handleDeleteClick}
                />
              ))}
            </div>

            <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
              <Select
                value={itemsPerPage.toString()}
                onValueChange={handleChangeItemsPerPage}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Records per page" />
                </SelectTrigger>
                <SelectContent>
                  {[15, 50, 100].map((value) => (
                    <SelectItem key={value} value={value.toString()}>
                      {value} per page
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => handleChangePage(page - 1)}
                  disabled={page === 1}
                  size="sm"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Previous page</span>
                </Button>
                <Select
                  value={page.toString()}
                  onValueChange={(value) => handleChangePage(parseInt(value))}
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Jump to page" />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(totalPages)].map((_, index) => (
                      <SelectItem key={index} value={(index + 1).toString()}>
                        Page {index + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={() => handleChangePage(page + 1)}
                  disabled={page === totalPages}
                  size="sm"
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next page</span>
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
      <DeleteDialog
        title="Remove member from group?"
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        handleDelete={handleDeleteConfirm}
        deleteLoading={removeMembersLoading}
      />
    </Card>
  );
}

export default Members;
