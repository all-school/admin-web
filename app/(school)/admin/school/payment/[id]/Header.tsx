// Header.tsx
import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

const Header = () => {
  return (
    <div className="mb-6">
      <div className="mb-1 flex items-center text-sm text-muted-foreground">
        <Link href="/admin" className="hover:text-primary">
          Dashboard
        </Link>
        <ChevronRight className="mx-1 h-4 w-4" />
        <Link href="/admin/school/payment" className="hover:text-primary">
          Payments
        </Link>
        <ChevronRight className="mx-1 h-4 w-4" />
        <span>Payment</span>
      </div>
      <h1 className="text-2xl font-bold text-primary">Payment</h1>
    </div>
  );
};

export default Header;
