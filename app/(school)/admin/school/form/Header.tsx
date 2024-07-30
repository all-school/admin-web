// app/admin/school/form/Header.tsx
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">All Forms</h1>
        <div className="text-sm text-gray-500">
          <Link href="/admin">School</Link> / Forms
        </div>
      </div>
      <Link href="/admin/school/form/create">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Form
        </Button>
      </Link>
    </div>
  );
}
