import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GET_STUDENT_ATTENDANCE } from './StudentDetailService';
import dayjs from 'dayjs';

const Attendance = ({ student }) => {
  const defaultStartDate = '1900-01-01';
  const defaultEndDate = dayjs().add(1, 'day').format('YYYY-MM-DD');

  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);

  const { loading, error, data, refetch } = useQuery(GET_STUDENT_ATTENDANCE, {
    variables: {
      studentId: student.id,
      startDate: startDate,
      endDate: endDate
    },
    fetchPolicy: 'network-only'
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading attendance data: {error.message}</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Attendance Records</h3>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex space-x-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <Button onClick={() => refetch()}>Filter</Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Group</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.getStudentAttendance.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    {dayjs(record.date).format('DD/MM/YYYY')}
                  </TableCell>
                  <TableCell>{record.group?.name || 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Attendance;
