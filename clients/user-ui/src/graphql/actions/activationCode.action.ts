"use client";

import { gql, DocumentNode } from "@apollo/client";

export const VERIFY_USER: DocumentNode = gql`
  mutation ActivateUser($activationCode: String!, $activationToken: String!) {
    activateUser(
      activationInput: {
        activationToken: $activationToken
        activationCode: $activationCode
      }
    ) {
      user {
        name
        email
      }
    }
  }
`;
