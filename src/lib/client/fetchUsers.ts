import { gql, queryStore } from "@urql/svelte";
import type { UserProfileConnection } from "lib/types";
import { client } from "./client";

export const fetchUsers = ({
  first = 10,
  last,
  before,
  after
}: {
  first?: number;
  last?: number;
  before?: string;
  after?: string;
}) => {
  return queryStore<{ users: UserProfileConnection }>({
    client,
    query: gql`
      query ($first: Int, $last: Int, $before: String, $after: String) {
        users(first: $first, last: $last, before: $before, after: $after) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            cursor
            node {
              id
              name
              avatar
              email
            }
          }
        }
      }
    `,
    variables: { first, last, before, after }
  });
};
