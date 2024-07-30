import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import EditDialog from './EditDialog';

const EditGroupDialog = ({ group, title, open, setOpen }) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="mt-4 max-h-[60vh] overflow-auto">
          {group.leadTeacher === null ? (
            <EditDialog
              groupId={group.id}
              groupName={group.name}
              groupType={group.type}
              groupDescription={group.description}
              setOpen={setOpen}
            />
          ) : (
            <EditDialog
              groupId={group.id}
              groupName={group.name}
              groupType={group.type}
              groupDescription={group.description}
              groupLeadTeacher={group.leadTeacher}
              groupLeadTeacherId={group.leadTeacher.id}
              groupLeadTeacherFirstName={group.leadTeacher.firstName}
              groupLeadTeacherLastName={group.leadTeacher.lastName}
              groupLeadTeacherProfilePicture={
                group.leadTeacher.profilePicture
                  ? group.leadTeacher.profilePicture.signedUrl
                  : null
              }
              setOpen={setOpen}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditGroupDialog;
