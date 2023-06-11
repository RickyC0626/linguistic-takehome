import { users } from "lib/data";
import type { UserProfileConnection, UserProfileEdge } from "lib/types";
import { hasNextPage } from "./relay.util";

export const allEdges: UserProfileEdge[] = users.map((user) => ({
  cursor: user.id.toString(),
  node: {
    ...user,
    id: user.id.toString()
  }
}));

export function handleUsersQuery(
  source: any,
  args: {
    first: number;
    last: number;
    before: string;
    after: string;
  }
): UserProfileConnection {
  const { first, last, before, after } = args;

  if (first && last) throw Error("Cannot have both first and last");
  if (after && before) throw Error("Cannot have both after and before");

  const edges: UserProfileEdge[] = [];

  if (first) {
    const afterIdx = users.findIndex((user) => user.id.toString() === after);
    const start = afterIdx > -1 ? afterIdx + 1 : 0;

    for (let i = start; i < start + first; i++) {
      populateEdges(edges, i);
    }
  } else if (last) {
    const beforeIdx = users.findIndex((user) => user.id.toString() === before);
    const start = beforeIdx > -1 ? beforeIdx - 1 : users.length - 1;

    for (let i = start; i > start - last; i--) {
      populateEdges(edges, i);
    }
  } else {
    for (let i = 0; i < users.length; i++) {
      populateEdges(edges, i);
    }
  }

  const connection: UserProfileConnection = {
    totalCount: edges.length,
    pageInfo: {
      hasNextPage: hasNextPage(allEdges, first, last, before, after),
      hasPreviousPage: false,
      startCursor: edges[0]?.cursor,
      endCursor: edges.at(-1)?.cursor
    },
    edges
  };

  return connection;
}

function populateEdges(edges: UserProfileEdge[], i: number) {
  if (i < 0 || i >= users.length) return;

  const user = users[i];
  const edge: UserProfileEdge = {
    cursor: user.id.toString(),
    node: {
      ...user,
      id: user.id.toString()
    }
  };
  edges.push(edge);
}
