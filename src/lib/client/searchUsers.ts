import { gql, queryStore } from "@urql/svelte";
import type { UserProfileConnection } from "lib/types";
import { client } from "./client";

export const searchUsers = ({ name }: { name: string }) => {
  return queryStore<{ users: UserProfileConnection }>({
    client,
    query: gql`
      query ($name: String) {
        searchUsers(name: $name) {
          totalCount
          edges {
            node {
              id
              name
            }
          }
        }
      }
    `,
    variables: { name }
  });
};
