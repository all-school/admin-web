import { gql } from '@apollo/client';

export const GET_STUDENT_BY_ID = gql`
  query student($id: ID!) {
    student(id: $id) {
      id
      firstName
      lastName
      dob
      bloodGroup
      fatherName
      motherName
      profilePicture {
        id
        fileName
        contentType
        objectKey
        url
        signedUrl
      }
    }
  }
`;

export const UPDATE_STUDENT = gql`
  mutation updateStudent(
    $studentId: ID!
    $firstName: String!
    $lastName: String!
    $dob: Date!
    $bloodGroup: bloodGroup
    $fatherName: String
    $motherName: String
  ) {
    updateStudent(
      studentId: $studentId
      firstName: $firstName
      lastName: $lastName
      dob: $dob
      bloodGroup: $bloodGroup
      fatherName: $fatherName
      motherName: $motherName
    ) {
      id
      firstName
      lastName
      dob
      fatherName
      motherName
      bloodGroup
      profilePicture {
        id
        fileName
        contentType
        objectKey
        url
        signedUrl
      }
    }
  }
`;

export const GET_STUDENT_ATTENDANCE = gql`
  query GetStudentAttendance(
    $studentId: ID!
    $startDate: Date!
    $endDate: Date!
  ) {
    getStudentAttendance(
      studentId: $studentId
      startDate: $startDate
      endDate: $endDate
    ) {
      id
      date
      group {
        name
      }
    }
  }
`;

export const CREATE_ATTENDANCE = gql`
  mutation createAttendance($studentid: ID!, $date: Date!, $reason: String) {
    createAttendance(studentid: $studentid, date: $date, reason: $reason) {
      id
      date
      reason
    }
  }
`;

export const DELETE_ATTENDANCE = gql`
  mutation deleteAttendance($id: ID!) {
    deleteAttendance(id: $id) {
      id
    }
  }
`;

export const GET_USER_ACCESS = gql`
  query userAccesses($queryByType: queryByType!, $queryById: ID) {
    userAccesses(queryByType: $queryByType, queryById: $queryById) {
      id
      email
      role
      status
      user {
        id
        firstName
        lastName
        profilePicture {
          id
          signedUrl
        }
      }
    }
  }
`;

export const GRANT_USER_ACCESS = gql`
  mutation grantUserAccess(
    $email: String!
    $userType: userType!
    $userTypeId: ID
    $notifyUserByEmail: Boolean!
  ) {
    grantUserAccess(
      email: $email
      userType: $userType
      userTypeId: $userTypeId
      notifyUserByEmail: $notifyUserByEmail
    ) {
      id
      email
      status
    }
  }
`;

export const DELETE_USER_ACCESS = gql`
  mutation deleteUserAccess($userAccessId: ID!) {
    deleteUserAccess(userAccessId: $userAccessId) {
      id
    }
  }
`;

export const RESEND_INVITATION = gql`
  mutation resendInvitation($userAccessId: ID!) {
    resendInvitation(userAccessId: $userAccessId) {
      id
    }
  }
`;
