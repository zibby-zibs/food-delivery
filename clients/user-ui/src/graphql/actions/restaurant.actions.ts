// "use client";

import { gql, DocumentNode } from "@apollo/client";

export const CREATE_MENU_ITEM: DocumentNode = gql`
  mutation createMenuItem(
    $name: String!
    $description: String!
    $price: Float!
    $imageUrl: String!
    $inStock: Boolean!
    $categoryNames: [String!]!
    $restaurantId: String!
  ) {
    createMenuItem(
      input: {
        name: $name
        description: $description
        price: $price
        imageUrl: $imageUrl
        inStock: $inStock
        categoryNames: $categoryNames
        restaurantId: $restaurantId
      }
    ) {
      id
    }
  }
`;

export const GET_MENU_BY_CATEGORY: DocumentNode = gql`
  query GetRestaurantMenu($id: String!) {
    getRestaurantMenu(id: $id) {
      id
      name
      menuItems {
        id
        name
        description
        price
        imageUrl
        inStock
      }
    }
  }
`;

export const GET_MENU_ITEM: DocumentNode = gql`
  query GetMenuItem($id: String!) {
    getMenuItem(id: $id) {
      id
      name
      description
      price
      imageUrl
      inStock
      categories {
        name
        id
      }
    }
  }
`;

export const EDIT_MENU_ITEM: DocumentNode = gql`
  mutation editMenuItem($id: String!, $input: CreateMenuItemInput!) {
    editMenuItem(id: $id, input: $input) {
      id
    }
  }
`;

export const DELETE_MENU_ITEM: DocumentNode = gql`
  mutation deleteMenuItem($id: String!) {
    deleteMenuItem(id: $id) {
      id
    }
  }
`;
