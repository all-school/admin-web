import React from 'react';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { CalendarIcon, ListIcon } from 'lucide-react';

interface HeaderProps {
  setMode: (mode: boolean) => void;
  mode: boolean;
}

function Header({ setMode, mode }: HeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink as={Link} href="/admin">
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Leaves</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <h1 className="mt-2 text-3xl font-bold">Leaves</h1>
      </div>
      <div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setMode(!mode)}
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
      </div>
    </div>
  );
}

export default Header;
