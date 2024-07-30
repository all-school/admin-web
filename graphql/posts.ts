import { gql } from '@apollo/client';

export const GET_POSTS = gql`
  query posts($first: Int, $afterCursor: ID) {
    posts(queryByType: SCHOOL, first: $first, afterCursor: $afterCursor) {
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

export const GET_POST = gql`
  query post($id: ID!) {
    post(id: $id) {
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
`;

export const DELETE_POST = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId) {
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
`;

export const CREATE_POST = gql`
  mutation createPost(
    $text: String!
    $content: DocumentInput
    $sendTo: [ReceiverInput!]!
    $notifyByEmail: Boolean!
    $acceptComment: Boolean!
  ) {
    createPost(
      text: $text
      content: $content
      sendTo: $sendTo
      notifyByEmail: $notifyByEmail
      acceptComment: $acceptComment
    ) {
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
`;
export const UPDATE_POST = gql`
  mutation updatePost(
    $postId: ID!
    $text: String!
    $content: DocumentInput
    $sendTo: [ReceiverInput!]!
    $notifyByEmail: Boolean!
    $acceptComment: Boolean!
  ) {
    updatePost(
      postId: $postId
      text: $text
      content: $content
      sendTo: $sendTo
      notifyByEmail: $notifyByEmail
      acceptComment: $acceptComment
    ) {
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
`;

export const SEND_POST = gql`
  mutation sendPost(
    $text: String!
    $sendTo: [ReceiverInput!]!
    $notifyByEmail: Boolean!
  ) {
    sendPost(text: $text, sendTo: $sendTo, notifyByEmail: $notifyByEmail) {
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
`;

export const ACCEPT_POST_COMMENT = gql`
  mutation acceptPostComment($postId: ID!, $acceptComment: Boolean!) {
    acceptPostComment(postId: $postId, acceptComment: $acceptComment) {
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
`;
export const LIKE_POST = gql`
  mutation likePost($postId: ID!, $like: Boolean!) {
    likePost(postId: $postId, like: $like)
  }
`;
