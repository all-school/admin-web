import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Edit, ChevronRight } from 'lucide-react';

interface HeaderProps {
  assignment: {
    title: string;
  };
  setEditDialogOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ assignment, setEditDialogOpen }) => {
  return (
    <header className="mb-6 space-y-4 sm:flex sm:items-center sm:justify-between">
      <div className="space-y-2">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center space-x-1 text-sm">
            <li>
              <Link
                href="/admin"
                className="text-gray-500 transition-colors hover:text-gray-700"
              >
                Dashboard
              </Link>
            </li>
            <li className="text-gray-300">
              <ChevronRight size={14} />
            </li>
            <li>
              <Link
                href="/admin/school/assignment"
                className="text-gray-500 transition-colors hover:text-gray-700"
              >
                Assignments
              </Link>
            </li>
          </ol>
        </nav>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          {assignment.title}
        </h1>
      </div>
      <Button
        onClick={() => setEditDialogOpen(true)}
        className="w-full sm:w-auto"
      >
        <Edit className="mr-2 h-4 w-4" aria-hidden="true" />
        <span>Edit Assignment</span>
      </Button>
    </header>
  );
};

export default Header;
