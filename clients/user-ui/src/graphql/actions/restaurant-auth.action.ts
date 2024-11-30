"use client";

import { gql, DocumentNode } from "@apollo/client";
import { FoodCategory } from "@prisma/client";

export const REGISTER_RESTAURANT: DocumentNode = gql`
  mutation RegisterRestaurant(
    $name: String!
    $email: String!
    $password: String!
    $phone: String!
    $address: String!
    $openHours: String!
    $description: String!
    $website: String!
    $categories: [RestaurantGeneralCategoryDto!]!
  ) {
    RegisterResponse(
      restaurantRegisterInput: {
        name: $name
        email: $email
        password: $password
        phone: $phone
        address: $address
        openHours: $openHours
        description: $description
        website: $website
        categories: $categories
      }
    ) {
      activation_token
    }
  }
`;

export interface RestaurantGeneralCategoryDto {
  type: FoodCategory;
  description?: string;
}

export const VERIFY_RESTAURANT: DocumentNode = gql`
  mutation activateRestaurant(
    $activationCode: String!
    $activationToken: String!
  ) {
    activateRestaurant(
      restaurantActivationInput: {
        activationToken: $activationToken
        activationCode: $activationCode
      }
    ) {
      user {
        name
        email
        address
        phone
        description
        website
        # categories {
        #   type
        # }
      }
      accessToken
      refreshToken
    }
  }
`;
