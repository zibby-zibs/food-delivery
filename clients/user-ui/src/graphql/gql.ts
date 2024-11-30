import { ApolloLink, createHttpLink } from "@apollo/client";
import {
  registerApolloClient,
  ApolloClient,
  InMemoryCache,
} from "@apollo/experimental-nextjs-app-support";
import Cookies from "js-cookie";

const httpLink = createHttpLink({
  uri: "http://localhost:3010/graphql",
});
const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      accessToken: `Bearer ${Cookies.get("access_token")}`,
      // refreshToken: `Bearer ${Cookies.get("refresh_token")}`,
    },
  });

  return forward(operation);
});

export const { getClient, query, PreloadQuery } = registerApolloClient(() => {
  return new ApolloClient({
    link: authMiddleware.concat(httpLink),
    cache: new InMemoryCache(),
  });
});
