import { gql } from '@apollo/client';

export const GET_GROUP_BY_ID = gql`
  query group($id: ID!) {
    group(id: $id) {
      id
      name
      type
      description
      noOfStudents
      members {
        __typename
        ... on Student {
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
      }
      profilePicture {
        id
        fileName
        contentType
        objectKey
        url
        signedUrl
      }
      coverPicture {
        id
        fileName
        contentType
        objectKey
        url
        signedUrl
      }
      leadTeacher {
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

export const REMOVE_MEMBERS1 = gql`
  mutation RemoveMembers($groupId: ID!, $members: [ID!]!) {
    removeMembers(groupId: $groupId, members: $members) {
      id
      members {
        id
        firstName
        lastName
      }
      error
    }
  }
`;

export const REMOVE_MEMBERS = gql`
  mutation RemoveMembers($groupId: ID!, $members: [ID!]!) {
    removeMembers(groupId: $groupId, members: $members) {
      error
    }
  }
`;

export const GET_GROUPS = gql`
  query GetGroups {
    groups {
      id
      name
      noOfStudents
      profilePicture {
        id
        signedUrl
      }
    }
  }
`;

export const CREATE_POST = gql`
  mutation CreatePost($groupId: ID!, $text: String!, $content: Upload) {
    createPost(groupId: $groupId, text: $text, content: $content) {
      id
      text
      createdAt
      creator {
        id
        firstName
        lastName
      }
      content {
        contentType
        signedUrl
      }
    }
  }
`;

export const UPDATE_POST = gql`
  mutation UpdatePost($postId: ID!, $text: String!, $content: Upload) {
    updatePost(postId: $postId, text: $text, content: $content) {
      id
      text
      content {
        contentType
        signedUrl
      }
    }
  }
`;

export const DELETE_POST = gql`
  mutation DeletePost($postId: ID!) {
    deletePost(postId: $postId) {
      id
    }
  }
`;

export const GET_STUDENTS_LISTS = gql`
  query students($queryByType: queryByType!, $queryByIds: [ID!]) {
    students(queryByType: $queryByType, queryByIds: $queryByIds) {
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

export const ADD_MEMBERS = gql`
  mutation addMembers($groupId: ID!, $members: [ID!]) {
    addMembers(groupId: $groupId, members: $members) {
      error
      group {
        id
      }
    }
  }
`;
