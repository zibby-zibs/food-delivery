"use client";

import { graphqlClient } from "@/graphql/gql";
import { ApolloProvider } from "@apollo/client";

export const ApolloClientProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <ApolloProvider client={graphqlClient}>{children}</ApolloProvider>;
};
