import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';

interface HeaderProps {
  assignment: any;
  setEditDialogOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ assignment, setEditDialogOpen }) => {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link
                href="/admin"
                className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg
                  className="mx-1 h-3 w-3 text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 9 4-4-4-4"
                  />
                </svg>
                <Link
                  href="/admin/school/assignment"
                  className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2"
                >
                  Assignments
                </Link>
              </div>
            </li>
          </ol>
        </nav>
        <h1 className="mt-2 text-2xl font-bold">{assignment.title}</h1>
      </div>
      <Button onClick={() => setEditDialogOpen(true)}>
        <Edit className="mr-2 h-4 w-4" /> Edit
      </Button>
    </div>
  );
};

export default Header;
