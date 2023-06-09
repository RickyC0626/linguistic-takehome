import { useGraphQlJit } from "@envelop/graphql-jit";
import { createSchema, createYoga } from "graphql-yoga";

import type { RequestEvent } from "@sveltejs/kit";

import { users } from "$lib/data";

import schema from "$lib/schema.gql";
import type { UserProfileConnection, UserProfileEdge } from "lib/types";

const allEdges: UserProfileEdge[] = users.map((user) => ({
  cursor: user.id.toString(),
  node: {
    ...user,
    id: user.id.toString()
  }
}));

const yogaApp = createYoga<RequestEvent>({
  schema: createSchema({
    typeDefs: schema,
    resolvers: {
      Query: {
        // https://the-guild.dev/graphql/tools/docs/resolvers
        users: (source, args, context, info) => {
          const {
            first,
            last,
            after,
            before
          }: {
            first: number;
            last: number;
            after: string;
            before: string;
          } = args;

          if (first && last) throw Error("Cannot have both first and last");
          if (after && before) throw Error("Cannot have both after and before");

          const edges: UserProfileEdge[] = [];

          if (first) {
            const afterIdx = users.findIndex(
              (user) => user.id.toString() === after
            );
            let start = afterIdx > -1 ? afterIdx + 1 : 0;

            for (let i = start; i < start + first; i++) {
              populateEdges(edges, i);
            }
          } else if (last) {
            const beforeIdx = users.findIndex(
              (user) => user.id.toString() === before
            );
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
              endCursor: edges.at(-1)?.cursor,
              startCursor: edges[0]?.cursor
            },
            edges
          };

          return connection;
        }
      }
    }
  }),
  plugins: [useGraphQlJit()],
  fetchAPI: globalThis
});

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

// https://relay.dev/graphql/connections.htm#HasNextPage()
function hasNextPage(
  allEdges: UserProfileEdge[],
  first: number,
  last: number,
  before: string,
  after: string
) {
  // If first is set
  // a. Let edges be the result of calling applyCursorsToEdges(allEdges, before, after)
  // b. If edges contains more than first elements return true, otherwise false

  // If before is set
  // a. If the server can efficiently determine that elements exist following before, return true.
  if (first || before) {
    const edges = applyCursorsToEdges(allEdges, before, after);

    if (edges.length > first || edges.length > last) return true;
  }

  return false;
}

// https://relay.dev/graphql/connections.htm#ApplyCursorsToEdges()
function applyCursorsToEdges(
  allEdges: UserProfileEdge[],
  before: string,
  after: string
): UserProfileEdge[] {
  // Initialize edges to be allEdges
  let edges = allEdges;

  // If after is set
  // a. Let afterEdge be the edge in edges where cursor is equal to the after argument.
  // b. If afterEdge exists
  //    1. Remove all elements of edges before and including afterEdge
  if (after) {
    const idx = edges.findIndex((edge) => edge.cursor === after);

    if (idx !== -1) {
      edges = edges.slice(idx + 1);
    }
  }

  // If before is set
  // a. Let beforeEdge be the edge in edges whose cursor is equal to the before argument.
  // b. If beforeEdge exists
  //    1. Remove all elements of edges after and including beforeEdge
  if (before) {
    const idx = edges.findIndex((edge) => edge.cursor === before);

    if (idx !== -1) {
      edges = edges.slice(0, idx);
    }
  }

  // Return edges
  return edges;
}

export { yogaApp as GET, yogaApp as POST };
