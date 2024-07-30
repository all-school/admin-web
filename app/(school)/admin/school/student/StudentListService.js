import client from '@/graphql/client';
import { gql } from '@apollo/client';

export const CREATE_STUDENT = gql`
  mutation createStudent($firstName: String!, $lastName: String!, $dob: Date!) {
    createStudent(firstName: $firstName, lastName: $lastName, dob: $dob) {
      id
      firstName
      lastName
      dob
    }
  }
`;

export const DELETE_STUDENT = gql`
  mutation deleteStudent($studentId: ID!) {
    deleteStudent(studentId: $studentId) {
      id
      firstName
      lastName
      dob
    }
  }
`;

export const GET_STUDENTS_LIST = gql`
  {
    students(queryByType: SCHOOL) {
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

/*class StudentListService {
  getStudentsList = () =>
    new Promise((resolve, reject) => {
      client
        .query({
          variables: {
            //class:class in the future ?? for now get all.
          },
          query: GET_STUDENTS_LIST
        })
        .then(response => {
          if (response.data.students) {
            resolve(response.data.students)
          } else {
            reject(response)
          }
        })
        .catch(error => {
          reject(error)
        })
    })
}

const studentListService = new StudentListService()

export default studentListService*/

export const getStudentsList = () =>
  new Promise((resolve, reject) => {
    client
      .query({
        variables: {
          queryByType: 'SCHOOL'
        },
        query: GET_STUDENTS_LIST
      })
      .then((response) => {
        if (response.data.students) {
          resolve(response.data.students);
        } else {
          reject(response);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
