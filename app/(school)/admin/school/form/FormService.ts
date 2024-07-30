// app/admin/school/form/FormService.ts
import { gql } from '@apollo/client';

export const GET_FORMS = gql`
  query GetForms {
    forms {
      id
      title
      formType
      status
      noOfRecipients
      noOfResponses
      createdAt
    }
  }
`;

export const SEND_FORM = gql`
  mutation SendForm(
    $formId: ID!
    $sendTo: [ReceiverInput!]!
    $notifyByEmail: Boolean!
  ) {
    sendForm(formId: $formId, sendTo: $sendTo, notifyByEmail: $notifyByEmail) {
      id
      title
      description
    }
  }
`;

export const DELETE_FORM = gql`
  mutation DeleteForm($formId: ID!) {
    deleteForm(formId: $formId) {
      title
      description
    }
  }
`;
