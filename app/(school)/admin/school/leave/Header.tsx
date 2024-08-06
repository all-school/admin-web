import React from 'react';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { CalendarIcon, ListIcon, ChevronRight } from 'lucide-react';

interface HeaderProps {
  setMode: (mode: boolean) => void;
  mode: boolean;
}

function Header({ setMode, mode }: HeaderProps) {
  return (
    <header className="flex flex-col items-start justify-between gap-4 bg-white p-4 dark:bg-gray-800 sm:flex-row sm:items-center">
      <div className="w-full sm:w-auto">
        <Breadcrumb className="flex items-center overflow-x-auto whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
          <BreadcrumbItem className="flex min-w-fit items-center">
            <BreadcrumbLink as={Link} href="/admin">
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <ChevronRight className="mx-1 h-4 w-4 flex-shrink-0" />
          <BreadcrumbItem className="flex min-w-fit items-center">
            <BreadcrumbLink>Leaves</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <h1 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
          Leaves
        </h1>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setMode(!mode)}
              className="mt-2 flex-shrink-0 sm:mt-0"
            >
              {mode ? (
                <ListIcon className="h-4 w-4" />
              ) : (
                <CalendarIcon className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{mode ? 'List View' : 'Calendar View'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </header>
  );
}

export default Header;
