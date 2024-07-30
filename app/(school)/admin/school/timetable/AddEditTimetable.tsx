// File: components/Timetable/AddEditTimetable.tsx
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import EventForm from './EventForm';
import { useQuery } from '@apollo/client';
import { CURRENT_USER } from '@/graphql/useraccounts';

interface AddEditTimetableProps {
  event: any;
  mode: 'add' | 'edit';
  onAdd: (event: any) => void;
  onEdit: (event: any) => void;
  onCancel: () => void;
  onDelete: (eventId: string) => void;
  open: boolean;
  refetch: () => void;
  groupId: string;
  handleTimetable: (start: string, end: string) => void;
  setGroupName: (name: string) => void;
  groupName: string;
  groups: any[];
  timeZone: string;
  setTimetable: (timetable: any[]) => void;
  rangeStartDateTimeValue: string;
  rangeEndDateTimeValue: string;
}

const AddEditTimetable: React.FC<AddEditTimetableProps> = ({
  event,
  mode,
  onAdd,
  onEdit,
  onCancel,
  onDelete,
  open,
  refetch,
  groupId,
  handleTimetable,
  setGroupName,
  groupName,
  groups,
  timeZone,
  setTimetable,
  rangeStartDateTimeValue,
  rangeEndDateTimeValue
}) => {
  const { data } = useQuery(CURRENT_USER);

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? 'Add Period' : 'Edit Period'}
          </DialogTitle>
        </DialogHeader>
        {data && open && (
          <EventForm
            event={event}
            mode={mode}
            onAdd={onAdd}
            onEdit={onEdit}
            onCancel={onCancel}
            onDelete={onDelete}
            refetch={refetch}
            headline={data.myCurrentUserAccount.headline}
            userName={data.myCurrentUserAccount.user}
            pic={data.myCurrentUserAccount.user.profilePicture?.signedUrl}
            groupId={groupId}
            handleTimetable={handleTimetable}
            setGroupName={setGroupName}
            groupName={groupName}
            groups={groups}
            timeZone={timeZone}
            setTimetable={setTimetable}
            rangeStartDateTimeValue={rangeStartDateTimeValue}
            rangeEndDateTimeValue={rangeEndDateTimeValue}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddEditTimetable;
