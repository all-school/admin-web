import { gql } from '@apollo/client';

export const GET_ASSIGNMENT_BY_ID = gql`
  query assignment($id: ID!) {
    assignment(id: $id) {
      id
      title
      description
      attachments {
        id
        fileName
        contentType
        objectKey
        url
        signedUrl
      }
      dueDateTime
      closeDateTime
      points
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
      }
      createdAt
      noOfRecipients
      noOfResponses
      status
    }
  }
`;

export const GET_STUDENT_ASSIGNMENT_BY_ASSIGNMENT = gql`
  query studentAssignmentsByAssignment($assignmentId: ID!) {
    studentAssignmentsByAssignment(assignmentId: $assignmentId) {
      id
      student {
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
      assignment {
        id
        title
        description
        attachments {
          id
          fileName
          contentType
          objectKey
          url
          signedUrl
        }
        dueDateTime
        closeDateTime
        points
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
        }
        createdAt
      }
      comment
      attachments {
        id
        fileName
        contentType
        objectKey
        url
        signedUrl
      }
      submittedAt
      status
      feedback
      points
      gradedAt
    }
  }
`;

export const CREATE_ASSIGNMENT = gql`
  mutation createAssignment(
    $title: String!
    $description: String!
    $attachments: [DocumentInput!]
    $dueDateTime: DateTime
    $closeDateTime: DateTime
    $points: Int
  ) {
    createAssignment(
      title: $title
      description: $description
      attachments: $attachments
      dueDateTime: $dueDateTime
      closeDateTime: $closeDateTime
      points: $points
    ) {
      id
      title
      description
      attachments {
        id
        fileName
        contentType
        objectKey
        url
        signedUrl
      }
      dueDateTime
      closeDateTime
      points
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
      }
      createdAt
      noOfRecipients
      noOfResponses
      status
    }
  }
`;

export const CREATE_AND_SEND_ASSIGNMENT = gql`
  mutation createAndSendAssignment(
    $title: String!
    $description: String!
    $sendTo: [ReceiverInput!]!
    $notifyByEmail: Boolean!
    $attachments: [DocumentInput!]
    $dueDateTime: DateTime
    $closeDateTime: DateTime
    $points: Int
  ) {
    createAndSendAssignment(
      title: $title
      description: $description
      sendTo: $sendTo
      notifyByEmail: $notifyByEmail
      attachments: $attachments
      dueDateTime: $dueDateTime
      closeDateTime: $closeDateTime
      points: $points
    ) {
      id
      title
      description
      attachments {
        id
        fileName
        contentType
        objectKey
        url
        signedUrl
      }
      dueDateTime
      closeDateTime
      points
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
      }
      createdAt
      noOfRecipients
      noOfResponses
      status
    }
  }
`;

export const SEND_ASSIGNMENT = gql`
  mutation sendAssignment(
    $assignmentId: ID!
    $sendTo: [ReceiverInput!]!
    $notifyByEmail: Boolean!
  ) {
    sendAssignment(
      assignmentId: $assignmentId
      sendTo: $sendTo
      notifyByEmail: $notifyByEmail
    ) {
      id
      title
      description
      attachments {
        id
        fileName
        contentType
        objectKey
        url
        signedUrl
      }
      dueDateTime
      closeDateTime
      points
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
      }
      createdAt
      noOfRecipients
      noOfResponses
      status
    }
  }
`;

export const UPDATE_ASSIGNMENT = gql`
  mutation updateAssignment(
    $assignmentId: ID!
    $title: String!
    $description: String!
    $attachments: [DocumentInput!]
    $dueDateTime: DateTime
    $closeDateTime: DateTime
    $points: Int
  ) {
    updateAssignment(
      assignmentId: $assignmentId
      title: $title
      description: $description
      attachments: $attachments
      dueDateTime: $dueDateTime
      closeDateTime: $closeDateTime
      points: $points
    ) {
      id
      title
      description
      attachments {
        id
        fileName
        contentType
        objectKey
        url
        signedUrl
      }
      dueDateTime
      closeDateTime
      points
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
      }
      createdAt
      noOfRecipients
      noOfResponses
      status
    }
  }
`;

export const DELETE_ASSIGNMENT = gql`
  mutation deleteAssignment($assignmentId: ID!) {
    deleteAssignment(assignmentId: $assignmentId) {
      id
      title
      description
      attachments {
        id
        fileName
        contentType
        objectKey
        url
        signedUrl
      }
      dueDateTime
      closeDateTime
      points
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
      }
      createdAt
      noOfRecipients
      noOfResponses
      status
    }
  }
`;

export const DELETE_DOCUMENT_BY_OBJECT_KEY = gql`
  mutation deleteDocumentByObjectKey($objectKey: String!) {
    deleteDocumentByObjectKey(objectKey: $objectKey)
  }
`;

export const GET_ASSIGNMENTS = gql`
  query assignments($type: AssignmentType!) {
    assignments(type: $type) {
      id
      title
      description
      attachments {
        id
        fileName
        contentType
        objectKey
        url
        signedUrl
      }
      dueDateTime
      closeDateTime
      points
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
      }
      createdAt
      noOfRecipients
      noOfResponses
      status
    }
  }
`;
