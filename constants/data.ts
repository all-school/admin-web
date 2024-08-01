import { NavItem } from '@/types';

export type User = {
  id: number;
  name: string;
  company: string;
  role: string;
  verified: boolean;
  status: string;
};
export const users: User[] = [
  {
    id: 1,
    name: 'Candice Schiner',
    company: 'Dell',
    role: 'Frontend Developer',
    verified: false,
    status: 'Active'
  },
  {
    id: 2,
    name: 'John Doe',
    company: 'TechCorp',
    role: 'Backend Developer',
    verified: true,
    status: 'Active'
  },
  {
    id: 3,
    name: 'Alice Johnson',
    company: 'WebTech',
    role: 'UI Designer',
    verified: true,
    status: 'Active'
  },
  {
    id: 4,
    name: 'David Smith',
    company: 'Innovate Inc.',
    role: 'Fullstack Developer',
    verified: false,
    status: 'Inactive'
  },
  {
    id: 5,
    name: 'Emma Wilson',
    company: 'TechGuru',
    role: 'Product Manager',
    verified: true,
    status: 'Active'
  },
  {
    id: 6,
    name: 'James Brown',
    company: 'CodeGenius',
    role: 'QA Engineer',
    verified: false,
    status: 'Active'
  },
  {
    id: 7,
    name: 'Laura White',
    company: 'SoftWorks',
    role: 'UX Designer',
    verified: true,
    status: 'Active'
  },
  {
    id: 8,
    name: 'Michael Lee',
    company: 'DevCraft',
    role: 'DevOps Engineer',
    verified: false,
    status: 'Active'
  },
  {
    id: 9,
    name: 'Olivia Green',
    company: 'WebSolutions',
    role: 'Frontend Developer',
    verified: true,
    status: 'Active'
  },
  {
    id: 10,
    name: 'Robert Taylor',
    company: 'DataTech',
    role: 'Data Analyst',
    verified: false,
    status: 'Active'
  }
];

export type Employee = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string; // Consider using a proper date type if possible
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  longitude?: number; // Optional field
  latitude?: number; // Optional field
  job: string;
  profile_picture?: string | null; // Profile picture can be a string (URL) or null (if no picture)
};

export const navItems: NavItem[] = [
  {
    title: 'School',
    href: '/admin/school',
    icon: 'school',
    label: 'School'
  },
  {
    title: 'Groups',
    href: '/admin/school/group',
    icon: 'groups',
    label: 'Groups'
  },
  {
    title: 'Students',
    href: '/admin/school/student',
    icon: 'students',
    label: 'Students'
  },
  {
    title: 'Teachers',
    href: '/admin/school/teacher',
    icon: 'teachers',
    label: 'Teachers'
  },
  {
    title: 'Attendance',
    href: '/admin/school/attendance',
    icon: 'attendance',
    label: 'Attendance'
  },
  {
    title: 'Posts',
    href: '/admin/school/post',
    icon: 'post',
    label: 'Posts'
  },
  {
    title: 'Assignments',
    href: '/admin/school/assignment',
    icon: 'assignments',
    label: 'Assignments'
  },
  {
    title: 'Forms',
    href: '/admin/school/form',
    icon: 'forms',
    label: 'Forms'
  },
  {
    title: 'Calendar',
    href: '/admin/school/calendar',
    icon: 'calendar',
    label: 'Calendar'
  },
  {
    title: 'Message',
    href: '/admin/school/message',
    icon: 'message',
    label: 'Message'
  },
  {
    title: 'Leaves',
    href: '/admin/school/leave',
    icon: 'leaves',
    label: 'Leaves'
  },
  {
    title: 'Timetable',
    href: '/admin/school/timetable',
    icon: 'timetable',
    label: 'Timetable'
  },
  {
    title: 'Payments',
    href: '/admin/school/payment',
    icon: 'payments',
    label: 'Payments'
  },
  {
    title: 'User Management',
    href: '/admin/school/user-management',
    icon: 'userManagement',
    label: 'User Management'
  }
  // {
  //   title: 'Dashboard Old',
  //   href: '/dashboard',
  //   icon: 'dashboard',
  //   label: 'Dashboard'
  // },
  // {
  //   title: 'User',
  //   href: '/dashboard/user',
  //   icon: 'user',
  //   label: 'user'
  // },
  // {
  //   title: 'Employee',
  //   href: '/dashboard/employee',
  //   icon: 'employee',
  //   label: 'employee'
  // },
  // {
  //   title: 'Profile',
  //   href: '/dashboard/profile',
  //   icon: 'profile',
  //   label: 'profile'
  // },
  // {
  //   title: 'Kanban',
  //   href: '/dashboard/kanban',
  //   icon: 'kanban',
  //   label: 'kanban'
  // },
  // {
  //   title: 'Login',
  //   href: '/',
  //   icon: 'login',
  //   label: 'login'
  // }
];
