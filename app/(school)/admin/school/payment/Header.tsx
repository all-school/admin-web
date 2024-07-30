'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle, Banknote } from 'lucide-react';

interface HeaderProps {
  setAddDialogOpen?: (open: boolean) => void;
  isCreateButtonEnabled?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  setAddDialogOpen,
  isCreateButtonEnabled = true
}) => {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <div className="mb-1 flex items-center space-x-2 text-sm text-muted-foreground">
          <Link href="/admin" className="hover:text-primary">
            Dashboard
          </Link>
          <span>/</span>
          <span>Payments</span>
        </div>
        <h1 className="text-2xl font-bold text-primary">Payments</h1>
      </div>
      <div className="space-x-2">
        <Button variant="outline">
          <Link href="/admin/school/paymentaccounts">
            <Banknote className="mr-2 h-4 w-4" />
            Payment Accounts
          </Link>
        </Button>
        {setAddDialogOpen && (
          <Button
            variant="default"
            onClick={() => setAddDialogOpen(true)}
            disabled={!isCreateButtonEnabled}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Create
          </Button>
        )}
      </div>
    </div>
  );
};

export default Header;
