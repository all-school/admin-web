import { gql } from '@apollo/client';

export const GET_GROUPS = gql`
  {
    groups(queryByType: SCHOOL) {
      id
      name
      type
    }
  }
`;

export const GET_STUDENTS_BY_GROUP = gql`
  query GetStudentsByGroup($groupId: ID!) {
    students(queryByType: GROUP, queryByIds: [$groupId]) {
      id
      firstName
      lastName
    }
  }
`;

export const TAKE_ATTENDANCE = gql`
  mutation TakeAttendance(
    $groupId: ID!
    $date: Date
    $absentStudentIds: [ID!]!
  ) {
    takeAttendance(
      groupId: $groupId
      date: $date
      absentStudentIds: $absentStudentIds
    ) {
      id
      date
      absentStudents {
        id
        firstName
        lastName
      }
    }
  }
`;

export const GET_ATTENDANCE_BY_GROUP = gql`
  query GetAttendanceByGroup($groupId: ID!, $date: Date) {
    getAttendance(groupId: $groupId, date: $date) {
      id
      date
      absentStudents {
        id
        firstName
        lastName
      }
    }
  }
`;
