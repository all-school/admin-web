// Header.tsx
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { ChevronRight } from 'lucide-react';

interface HeaderProps {
  setAddAccountDialogOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setAddAccountDialogOpen }) => {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <div className="mb-1 flex items-center space-x-2 text-sm text-muted-foreground">
          <Link href="/app" className="hover:text-primary">
            Dashboard
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/admin/school/payment" className="hover:text-primary">
            Payments
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span>Payment accounts</span>
        </div>
        <h1 className="text-2xl font-bold text-primary">Payment accounts</h1>
      </div>
      <Button onClick={() => setAddAccountDialogOpen(true)}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Add account
      </Button>
    </div>
  );
};

export default Header;
