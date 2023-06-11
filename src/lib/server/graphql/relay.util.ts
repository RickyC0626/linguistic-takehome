import type { UserProfileEdge } from "lib/types";

// https://relay.dev/graphql/connections.htm#HasNextPage()
export function hasNextPage(
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
export function applyCursorsToEdges(
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
