import { useState } from 'react';
import Link from 'next/link';
import { MenuIcon } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DashboardNav } from '@/components/dashboard-nav';
import { navItems } from '@/constants/data';

export function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none">
          <MenuIcon className="h-6 w-6" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[240px] p-0">
        <nav className="flex h-full flex-col bg-white">
          <Link href="/admin" className="p-4 hover:bg-gray-100">
            <h2 className="text-lg font-semibold">Dashboard</h2>
          </Link>
          <div className="flex-1 overflow-y-auto">
            <DashboardNav
              items={navItems}
              isMobileNav={true}
              setOpen={setOpen}
            />
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
