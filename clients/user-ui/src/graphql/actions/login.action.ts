"use client";

import { gql, DocumentNode } from "@apollo/client";

export const LOGIN_USER: DocumentNode = gql`
  mutation LoginUser($email: String!, $password: String!) {
    login(loginDto: { email: $email, password: $password }) {
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
