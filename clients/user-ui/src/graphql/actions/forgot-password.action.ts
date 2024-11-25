"use client";

import { gql, DocumentNode } from "@apollo/client";

export const SEND_FORGOT_PASSWORD_LINK: DocumentNode = gql`
  mutation ForgotPassword($email: String!) {
    forgotPasswordToken(forgotPassword: { email: $email }) {
      message
    }
  }
`;

export const RESET_PASSWORD: DocumentNode = gql`
  mutation ResetPassword($password: String!, $activationToken: String!) {
    resetPassword(
      resetPassword: { password: $password, activationToken: $activationToken }
    ) {
      user {
        id
        name
        email
        address
        phone_number
      }
      accessToken
      refreshToken
    }
  }
`;
