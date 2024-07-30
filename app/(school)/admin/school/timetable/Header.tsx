// File: components/Timetable/Header.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface HeaderProps {
  onEventAdd: () => void;
}

const Header: React.FC<HeaderProps> = ({ onEventAdd }) => {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">Timetable</h1>
        <p className="text-gray-500">Manage your school timetable</p>
      </div>
      <Button onClick={onEventAdd}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Period
      </Button>
    </div>
  );
};

export default Header;
