import { gql } from '@apollo/client';

export const GET_FORM_BY_ID = gql`
  query form($id: ID!) {
    form(id: $id) {
      id
      formType
      title
      description
      questions {
        id
        questionType
        question
        description
        options
        isRequired
        noOfResponses
        responses {
          student {
            firstName
            lastName
          }
          answers
        }
        responsesCounts {
          answer
          count
        }
      }
      createdBy {
        user {
          id
          firstName
          lastName
        }
      }
      createdAt
      noOfRecipients
      noOfResponses
      status
    }
  }
`;

export const UPDATE_FORM = gql`
  mutation updateForm(
    $formId: ID!
    $title: String!
    $description: String
    $questions: [FormQuestionInput!]!
  ) {
    updateForm(
      formId: $formId
      title: $title
      description: $description
      questions: $questions
    ) {
      id
      title
      description
      questions {
        id
        questionType
        question
        description
        options
        isRequired
      }
    }
  }
`;

export const DOWNLOAD_FORM = gql`
  mutation downloadFormResponsesInCSV($formId: ID!) {
    downloadFormResponsesInCSV(formId: $formId) {
      returnStatus
      readSignedUrl
      objectKey
    }
  }
`;

export const STUDENT_FORMS = gql`
  query studentFormsByForm($formId: ID!) {
    studentFormsByForm(formId: $formId) {
      id
      student {
        id
        firstName
        lastName
      }
      form {
        id
        title
        description
        questions {
          id
          question
          description
          questionType
          options
          isRequired
        }
      }
      response {
        question {
          id
          question
          description
          questionType
          options
          isRequired
        }
        answers
      }
      respondedAt
      respondedBy {
        user {
          id
          firstName
          lastName
        }
      }
    }
  }
`;
