import { gql } from '@apollo/client';

export const GET_CONVERSATIONS = gql`
  {
    conversations {
      id
      school {
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
      participant {
        __typename
        ... on Person {
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
      recentMessage {
        id
        text
        createdAt
      }
      noOfUnread
    }
  }
`;

export const GET_CONVERSATION = gql`
  query conversation($id: ID!) {
    conversation(id: $id) {
      id
      school {
        id
        name
      }
      participant {
        __typename
        ... on Person {
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
      recentMessage {
        id
        text
        createdAt
        createdBy {
          user {
            id
            firstName
            lastName
          }
          headline
        }
      }
      noOfUnread
    }
  }
`;
export const GET_MESSAGES = gql`
  query messages($conversationId: ID!) {
    messages(conversationId: $conversationId) {
      id
      conversation {
        id
        school {
          id
          name
        }
        participant {
          __typename
          ... on Person {
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
        recentMessage {
          id
          text
          createdAt
          createdBy {
            user {
              id
              firstName
              lastName
            }
            headline
          }
        }
      }
      text
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
      edited
    }
  }
`;

export const DELETE_CONVERSATION = gql`
  mutation deleteConversation($conversationId: ID!) {
    deleteConversation(conversationId: $conversationId)
  }
`;

export const SEND_MESSAGE = gql`
  mutation sendMessage($messageTo: MessageReceiverInput!, $text: String!) {
    sendMessage(messageTo: $messageTo, text: $text) {
      id
      conversation {
        id
        school {
          id
          name
        }
        participant {
          __typename
          ... on Person {
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
        recentMessage {
          id
          text
          createdAt
          createdBy {
            user {
              id
              firstName
              lastName
            }
            headline
          }
        }
      }
      text
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
    }
  }
`;
export const UPDATE_MESSAGE = gql`
  mutation editMessage($messageId: ID!, $text: String!) {
    editMessage(messageId: $messageId, text: $text) {
      id
      conversation {
        id
        school {
          id
          name
        }
        participant {
          __typename
          ... on Person {
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
        recentMessage {
          id
          text
          createdAt
          createdBy {
            user {
              id
              firstName
              lastName
            }
            headline
          }
        }
      }
      text
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
    }
  }
`;
export const GET_STUDENT_BY_ID = gql`
  query student($id: ID!) {
    student(id: $id) {
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
`;
export const GET_CONVERSATION_ID = gql`
  query conversationByReceiver($receiver: MessageReceiverInput!) {
    conversationByReceiver(receiver: $receiver) {
      id
      participant {
        __typename
        ... on Person {
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
  }
`;
export const getConversation = (id) =>
  new Promise((resolve, reject) => {
    client
      .query({
        variables: {
          id: id
        },
        query: GET_CONVERSATION
      })
      .then((response) => {
        if (response.data.conversation) {
          resolve(response.data.conversation.noOfUnread);
        } else {
          reject(response);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });

export const UNREAD_CONVERSATIONS = gql`
  {
    noOfUnreadConversation
  }
`;

export const getStudentIdByName = (text) =>
  new Promise((resolve, reject) => {
    client
      .query({
        variables: {
          searchType: 'STUDENT',
          text: text
        },
        query: GET_STUDENT_ID_BY_NAME
      })
      .then((response) => {
        if (response.data.search) {
          resolve(response.data.search);
        } else {
          reject(response);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });

export const GET_STUDENT_ID_BY_NAME = gql`
  query search($searchType: [SearchType!]!, $text: String!) {
    search(searchType: $searchType, text: $text) {
      __typename
      ... on School {
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
      ... on Group {
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
      ... on Teacher {
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
