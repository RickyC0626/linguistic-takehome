import { users } from "lib/data";
import type { UserProfileConnection, UserProfileEdge } from "lib/types";
import {
  applyCursorsToEdges,
  calcEndCursor,
  calcStartCursor,
  hasNextPage
} from "./relay.util";

export const allUserEdges: UserProfileEdge[] = users.map((user) => ({
  cursor: user.id.toString(),
  node: {
    ...user,
    id: user.id.toString()
  }
}));

export function handleUsersQuery(
  allEdges: UserProfileEdge[],
  args: {
    first?: number;
    last?: number;
    before?: string;
    after?: string;
  }
): UserProfileConnection {
  const { first, last, before, after } = args;

  if (first && last) throw Error("Cannot have both first and last");
  if (after && before) throw Error("Cannot have both after and before");

  let edges: UserProfileEdge[] = applyCursorsToEdges(allEdges, before, after);

  if (first) {
    if (first < 0) throw Error("'first' must be a non-negative integer");

    if (edges.length > first) edges = edges.slice(0, first);
  } else if (last) {
    if (last < 0) throw Error("'last' must be a non-negative integer");

    if (edges.length > last) edges = edges.slice(edges.length - last);
  } else {
    edges = edges.slice(0, 10);
  }

  const connection: UserProfileConnection = {
    totalCount: edges.length,
    pageInfo: {
      hasNextPage: hasNextPage(allEdges, first, last, before, after),
      hasPreviousPage: false,
      startCursor: calcStartCursor(edges),
      endCursor: calcEndCursor(edges)
    },
    edges
  };

  return connection;
}
