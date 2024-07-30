'use client';

import { useState } from 'react';
import {
  Bell,
  Sun,
  Moon,
  HelpCircle,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { UserNav } from './user-nav';
//import { UserNav } from './UserNav';  // Your existing UserNav component

export function EnhancedNavBar() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New message from John Doe' },
    { id: 2, text: 'Upcoming event: Parent-Teacher Meeting' }
  ]);

  return (
    <div className="flex items-center space-x-4 bg-background p-4 shadow-md">
      {/* Quick Links */}
      <Button variant="ghost" size="icon">
        <Calendar className="h-5 w-5" />
      </Button>
      <Button variant="ghost" size="icon">
        <MessageSquare className="h-5 w-5" />
      </Button>

      {/* Notifications */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {notifications.length > 0 && (
              <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-red-500" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {notifications.map((notif) => (
            <DropdownMenuItem key={notif.id}>{notif.text}</DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dark Mode Toggle */}
      <div className="flex items-center space-x-2">
        <Sun className="h-5 w-5" />
        <Switch checked={darkMode} onCheckedChange={setDarkMode} />
        <Moon className="h-5 w-5" />
      </div>

      {/* Help Button */}
      <Button variant="ghost" size="icon">
        <HelpCircle className="h-5 w-5" />
      </Button>

      {/* Existing User Nav */}
      <UserNav />
    </div>
  );
}
