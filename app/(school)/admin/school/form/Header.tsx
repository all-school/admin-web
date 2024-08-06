import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <div className="flex flex-col items-start justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          All Forms
        </h1>
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link
            href="/admin"
            className="transition-colors hover:text-foreground"
          >
            School
          </Link>
          <span>/</span>
          <span>Forms</span>
        </nav>
      </div>
      <Link href="/admin/school/form/create" className="w-full sm:w-auto">
        <Button className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Form
        </Button>
      </Link>
    </div>
  );
}
