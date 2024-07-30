import React from 'react';

function AbsentStudentList({ absentStudents }) {
  return (
    <>
      <h2 className="mb-4 text-xl font-semibold">Absent Students</h2>
      <ul className="space-y-2">
        {absentStudents.map((student) => (
          <li key={student.id} className="text-sm">
            {`${student.firstName} ${student.lastName}`}
          </li>
        ))}
      </ul>
    </>
  );
}

export default AbsentStudentList;
