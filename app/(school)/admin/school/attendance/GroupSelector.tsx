import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

function GroupSelector({ groups, selectedGroup, onChange, loading }) {
  return (
    <div className="space-y-2">
      <Label htmlFor="group-select">Select Group</Label>
      <Select value={selectedGroup} onValueChange={onChange}>
        <SelectTrigger id="group-select">
          <SelectValue placeholder="Select a group" />
        </SelectTrigger>
        <SelectContent>
          {loading ? (
            <SelectItem value="">
              <span className="loading loading-spinner loading-sm"></span>
            </SelectItem>
          ) : (
            groups.map((group) => (
              <SelectItem key={group.id} value={group.id}>
                {group.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
}

export default GroupSelector;
