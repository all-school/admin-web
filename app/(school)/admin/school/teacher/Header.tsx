// File: TeacherListView/Header.tsx
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

function Header({ onNewTeacher }) {
  return (
    <div className="flex flex-col items-start justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
      <div>
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link
                href="/admin"
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <Link
                  href="/admin/school/teachers"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Teachers
                </Link>
              </div>
            </li>
          </ol>
        </nav>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">All Teachers</h1>
      </div>
      <Button onClick={onNewTeacher}>
        <PlusCircle className="mr-2 h-4 w-4" />
        CREATE
      </Button>
    </div>
  );
}

export default Header;
