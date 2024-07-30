import React from 'react';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  setAddDialogOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setAddDialogOpen }) => {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <div className="breadcrumbs text-sm">
          <ul>
            <li>
              <Link href="/admin">School</Link>
            </li>
            <li>User Management</li>
          </ul>
        </div>
        <h1 className="text-3xl font-bold">All Users</h1>
      </div>
      <Button onClick={() => setAddDialogOpen(true)}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Invite
      </Button>
    </div>
  );
};

export default Header;
