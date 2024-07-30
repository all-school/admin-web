import { gql } from '@apollo/client';

export const CREATE_FORM = gql`
  mutation createForm(
    $title: String!
    $formType: FormInputType
    $description: String
    $questions: [FormQuestionInput!]!
  ) {
    createForm(
      title: $title
      formType: $formType
      description: $description
      questions: $questions
    ) {
      id
      school {
        id
        name
        type
        board
        city
        country
      }
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

export const CREATE_AND_SEND_FORM = gql`
  mutation createAndSendForm(
    $title: String!
    $formType: FormInputType
    $description: String
    $questions: [FormQuestionInput!]!
    $sendTo: [ReceiverInput!]!
    $notifyByEmail: Boolean!
  ) {
    createAndSendForm(
      title: $title
      formType: $formType
      description: $description
      questions: $questions
      sendTo: $sendTo
      notifyByEmail: $notifyByEmail
    ) {
      id
      school {
        id
        name
        type
        board
        city
        country
      }
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

export const CREATE_QUESTION = gql`
  mutation createQuestion(
    $questionType: questionType!
    $question: String!
    $description: String
    $options: [String]
    $answers: [String]
    $isRequired: Boolean
  ) {
    createQuestion(
      questionType: $questionType
      question: $question
      description: $description
      options: $options
      answers: $answers
      isRequired: $isRequired
    ) {
      id
      questionType
      question
      description
      options
      answers
      isRequired
    }
  }
`;
export const UPDATE_QUESTION = gql`
  mutation updateQuestion(
    $questionId: ID!
    $questionType: questionType!
    $question: String!
    $description: String
    $options: [String]
    $answer: String
  ) {
    updateQuestion(
      questionId: $questionId
      questionType: $questionType
      question: $question
      description: $description
      options: $options
      answer: $answer
    ) {
      id
      questionType
      question
      description
      options
      answer
    }
  }
`;

export const DELETE_QUESTION = gql`
  mutation deleteQuestion($questionId: ID!) {
    deleteQuestion(questionId: $questionId) {
      id
      questionType
      question
      description
      options
      answer
    }
  }
`;
