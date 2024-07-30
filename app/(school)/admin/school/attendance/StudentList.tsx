import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

function StudentList({
  students,
  absentStudents,
  onToggleAbsent,
  onSubmit,
  loading
}) {
  const columns = Math.ceil(students.length / 10);

  return (
    <>
      <h2 className="mb-4 text-xl font-semibold">Mark Absences</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {[...Array(columns)].map((_, columnIndex) => (
          <div key={columnIndex} className="space-y-2">
            {students
              .slice(columnIndex * 10, (columnIndex + 1) * 10)
              .map((student) => {
                const isAbsent = absentStudents.some(
                  (s) => s.id === student.id
                );
                return (
                  <div key={student.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`student-${student.id}`}
                      checked={isAbsent}
                      onCheckedChange={() => onToggleAbsent(student)}
                    />
                    <label
                      htmlFor={`student-${student.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {`${student.firstName} ${student.lastName}`}
                    </label>
                  </div>
                );
              })}
          </div>
        ))}
      </div>
      <Button onClick={onSubmit} disabled={loading} className="mt-4">
        {loading ? (
          <span className="loading loading-spinner loading-sm"></span>
        ) : (
          'Submit Attendance'
        )}
      </Button>
    </>
  );
}

export default StudentList;
