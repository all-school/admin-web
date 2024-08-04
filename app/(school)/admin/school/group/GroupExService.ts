import { gql } from '@apollo/client';

export const GET_GROUPS = gql`
  query GetGroups {
    groups(queryByType: SCHOOL) {
      id
      name
      type
      description
      noOfStudents
      profilePicture {
        signedUrl
      }
      coverPicture {
        signedUrl
      }
    }
  }
`;

export const GET_POSTS_BY_GROUP = gql`
  query posts($queryById: ID, $afterCursor: ID, $first: Int) {
    posts(
      queryByType: GROUP
      queryById: $queryById
      afterCursor: $afterCursor
      first: $first
    ) {
      edges {
        cursor
        node {
          id
          text
          content {
            id
            fileName
            contentType
            objectKey
            url
            signedUrl
          }
          school {
            id
            name
          }
          sharedWith {
            id
            receiver {
              __typename
              ... on School {
                id
                name
              }
              ... on Group {
                id
                name
              }
              ... on Student {
                id
                firstName
                lastName
              }
            }
          }
          createdBy {
            user {
              id
              firstName
              lastName
              profilePicture {
                id
                fileName
                contentType
                objectKey
                url
                signedUrl
              }
            }
            headline
          }
          createdAt
          acceptComment
          liked
          noOfLikes
          noOfComments
        }
      }
      pageInfo {
        startCursor
        hasNext
      }
    }
  }
`;

export const GET_GROUP_BY_ID = gql`
  query GetGroupById($id: ID!) {
    group(id: $id) {
      id
      name
      type
      description
      noOfStudents
      profilePicture {
        signedUrl
      }
      coverPicture {
        signedUrl
      }
      leadTeacher {
        id
        firstName
        lastName
        profilePicture {
          signedUrl
        }
      }
    }
  }
`;

export const GET_STUDENTS_LISTS = gql`
  query GetStudentsLists($queryByType: queryByType!, $queryByIds: [ID!]) {
    students(queryByType: $queryByType, queryByIds: $queryByIds) {
      id
      firstName
      lastName
      profilePicture {
        signedUrl
      }
    }
  }
`;

export const GET_ATTENDANCE_TYPE = gql`
  query GetAttendanceType($group: ID!) {
    attendanceType(group: $group) {
      type
      sessionName
      group {
        id
        name
        profilePicture {
          signedUrl
        }
      }
    }
  }
`;

export const CREATE_GROUP = gql`
  mutation CreateGroup($name: String!, $type: groupType!, $members: [ID!]) {
    createGroup(name: $name, type: $type, members: $members) {
      group {
        id
        name
        type
      }
    }
  }
`;

export const UPDATE_GROUP = gql`
  mutation UpdateGroup(
    $groupId: ID!
    $name: String!
    $type: groupType!
    $description: String
    $leadTeacher: ID
  ) {
    updateGroup(
      groupId: $groupId
      name: $name
      type: $type
      description: $description
      leadTeacher: $leadTeacher
    ) {
      id
      name
      type
      description
      leadTeacher {
        id
        firstName
        lastName
      }
    }
  }
`;

export const DELETE_GROUP = gql`
  mutation deleteGroup($groupId: ID!) {
    deleteGroup(groupId: $groupId) {
      error
      group {
        id
      }
    }
  }
`;

export const SET_ATTENDANCE_TYPE = gql`
  mutation setAttendanceType(
    $group: ID!
    $type: AttendanceTypeEnum!
    $sessionName: [String!]
  ) {
    setAttendanceType(group: $group, type: $type, sessionName: $sessionName) {
      error
      attendanceType {
        id
        group {
          id
          name
          profilePicture {
            id
            fileName
            contentType
            objectKey
            url
            signedUrl
          }
        }
        type
        sessionName
      }
    }
  }
`;

export const CLEAR_ATTENDANCE_TYPE = gql`
  mutation clearAttendanceType($group: ID!) {
    clearAttendanceType(group: $group) {
      error
      attendanceType {
        id
        group {
          id
          name
          profilePicture {
            id
            fileName
            contentType
            objectKey
            url
            signedUrl
          }
        }
        type
        sessionName
      }
    }
  }
`;
