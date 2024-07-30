// PaymentService.ts
import { gql } from '@apollo/client';

export const CREATE_PAYMENT = gql`
  mutation createPayment(
    $title: String!
    $description: String!
    $amount: Int!
    $currency: String!
    $payTo: ID!
    $dueDateTime: DateTime
    $sendTo: [ReceiverInput!]!
    $notifyByEmail: Boolean!
  ) {
    createPayment(
      title: $title
      description: $description
      amount: $amount
      currency: $currency
      payTo: $payTo
      dueDateTime: $dueDateTime
      sendTo: $sendTo
      notifyByEmail: $notifyByEmail
    ) {
      id
      school {
        id
        name
      }
      title
      description
      amount
      currency
      formattedCurrency
      payTo {
        id
        accountId
      }
      dueDateTime
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
      noOfRecipients
      noOfResponses
      acceptPayment
      canDelete
    }
  }
`;

export const GET_PAYMENTS = gql`
  query payments(
    $queryByType: queryByType
    $queryById: ID
    $first: Int
    $afterCursor: ID
  ) {
    payments(
      queryByType: $queryByType
      queryById: $queryById
      first: $first
      afterCursor: $afterCursor
    ) {
      totalCount
      edges {
        node {
          __typename
          ... on Payment {
            id
            school {
              id
              name
            }
            title
            description
            amount
            currency
            formattedCurrency
            payTo {
              id
              accountId
            }
            dueDateTime
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
            noOfRecipients
            noOfResponses
            acceptPayment
            canDelete
          }
        }
        cursor
      }
      pageInfo {
        startCursor
        hasNext
      }
    }
  }
`;

export const ACCEPT_PAYMENT = gql`
  mutation acceptPayment($paymentId: ID!, $accept: Boolean!) {
    acceptPayment(paymentId: $paymentId, accept: $accept) {
      id
      school {
        id
        name
      }
      title
      description
      amount
      currency
      formattedCurrency
      payTo {
        id
        accountId
      }
      dueDateTime
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
      noOfRecipients
      noOfResponses
      acceptPayment
      canDelete
    }
  }
`;

export const DELETE_PAYMENT = gql`
  mutation deletePayment($paymentId: ID!) {
    deletePayment(paymentId: $paymentId) {
      id
      school {
        id
        name
      }
      title
      description
      amount
      currency
      formattedCurrency
      payTo {
        id
        accountId
      }
      dueDateTime
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
      noOfRecipients
      noOfResponses
      acceptPayment
      canDelete
    }
  }
`;

export const GET_PAYMENT_ACCOUNTS = gql`
  query paymentAccounts($type: PaymentAccountType) {
    paymentAccounts(type: $type) {
      id
      accountName
      defaultCurrency
    }
  }
`;

export const GET_ALL_DETAILS_BY_NAME = gql`
  query getAllDetailsByName($name: String!) {
    getAllDetailsByName(name: $name) {
      __typename
      ... on Student {
        id
        firstName
        lastName
        type
        profilePicture {
          signedUrl
        }
      }
      ... on Teacher {
        id
        firstName
        lastName
        type
        profilePicture {
          signedUrl
        }
      }
      ... on Group {
        id
        name
        type
      }
    }
  }
`;
