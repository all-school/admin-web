// File: TeacherListView/TeacherListService.ts
import { gql } from '@apollo/client';

export const CREATE_TEACHER = gql`
  mutation createTeacher($firstName: String!, $lastName: String!) {
    createTeacher(firstName: $firstName, lastName: $lastName) {
      id
      firstName
      lastName
    }
  }
`;

export const DELETE_TEACHER = gql`
  mutation deleteTeacher($id: ID!) {
    deleteTeacher(teacherId: $id) {
      id
      firstName
      lastName
    }
  }
`;

export const GET_TEACHERS = gql`
  query teachers($queryByType: queryByType!) {
    teachers(queryByType: $queryByType) {
      id
      firstName
      lastName
    }
  }
`;

export const getTeachersList = () =>
  new Promise((resolve, reject) => {
    client
      .query({
        variables: {
          queryByType: 'SCHOOL'
        },
        query: GET_TEACHERS
      })
      .then((response) => {
        if (response.data.teachers) {
          resolve(response.data.teachers);
        } else {
          reject(response);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
