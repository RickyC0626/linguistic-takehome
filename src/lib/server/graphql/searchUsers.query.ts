import type { UserProfileConnection, UserProfileEdge } from "lib/types";

export function handleSearchUsersQuery(
  allEdges: UserProfileEdge[],
  args: {
    name: string;
  }
): UserProfileConnection {
  const { name } = args;

  const connection: UserProfileConnection = {
    totalCount: 0,
    pageInfo: {
      hasNextPage: false,
      hasPreviousPage: false
    },
    edges: []
  };

  return connection;
}
