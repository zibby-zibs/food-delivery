import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import Cookies from "js-cookie";

const httpLink = createHttpLink({
  uri: "http://localhost:3005/graphql",
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

export const graphqlClient = new ApolloClient({
  link: authMiddleware.concat(httpLink),
  cache: new InMemoryCache(),
});
