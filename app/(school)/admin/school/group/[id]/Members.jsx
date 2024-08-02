import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useMutation } from '@apollo/client';
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
import { MoreVertical, Trash2 } from 'lucide-react';

const ITEMS_PER_PAGE = 15;

const MemberListItem = React.memo(({ member, onRemove }) => (
  <div className="flex items-center justify-between rounded-lg bg-white p-4 shadow">
    <div className="flex items-center space-x-4">
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
      <div>
        <p className="font-medium">
          {member.firstName} {member.lastName}
        </p>
        <p className="text-sm text-gray-500">{member.email}</p>
      </div>
    </div>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onRemove(member.id)}>
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Remove member</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
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
    <Card>
      <CardContent className="space-y-4 p-6">
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

            <div className="space-y-4">
              {currentPageData.map((member) => (
                <MemberListItem
                  key={member.id}
                  member={member}
                  onRemove={handleDeleteClick}
                />
              ))}
            </div>

            <div className="flex items-center justify-between">
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

              <div className="flex space-x-2">
                <Button
                  onClick={() => handleChangePage(page - 1)}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  onClick={() => handleChangePage(page + 1)}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>

              <Select
                value={page.toString()}
                onValueChange={(value) => handleChangePage(parseInt(value))}
              >
                <SelectTrigger className="w-[180px]">
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
