import type { Edge, Node } from "lib/types";

// https://relay.dev/graphql/connections.htm#HasNextPage()
export function hasNextPage(
  allEdges: Edge<Node>[],
  first?: number,
  last?: number,
  before?: string,
  after?: string
): boolean {
  // If first is set
  // a. Let edges be the result of calling applyCursorsToEdges(allEdges, before, after)
  // b. If edges contains more than first elements return true, otherwise false

  // If before is set
  // a. If the server can efficiently determine that elements exist following before, return true.
  if (first || before) {
    const edges = applyCursorsToEdges(allEdges, before, after);

    if (
      (first !== undefined && edges.length > first) ||
      (before && last !== undefined && edges.length > last)
    )
      return true;
  }

  return false;
}

// https://relay.dev/graphql/connections.htm#HasPreviousPage()
export function hasPreviousPage(
  allEdges: Edge<Node>[],
  first?: number,
  last?: number,
  before?: string,
  after?: string
): boolean {
  // If last is set
  // a. Let edges be the result of calling applyCursorsToEdges(allEdges, before, after)
  // b. If edges contains more than last elements return true, otherwise false

  // If after is set
  // a. If the server can efficiently determine that elements exist prior to after, return true
  if (last || after) {
    const edges = applyCursorsToEdges(allEdges, before, after);

    if (
      (last !== undefined && edges.length > last) ||
      (after && first !== undefined && edges.length > first)
    )
      return true;
  }

  return false;
}

// https://relay.dev/graphql/connections.htm#ApplyCursorsToEdges()
export function applyCursorsToEdges(
  allEdges: Edge<Node>[],
  before?: string,
  after?: string
): Edge<Node>[] {
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

// https://relay.dev/graphql/connections.htm#sec-undefined.PageInfo.Fields
// When paginating backwards, startCursor is used to continue
// When paginating forward, endCursor is used to continue
export function calcStartCursor(edges: Edge<Node>[]): string | null {
  // Can return null if no cursor is found
  if (edges.length < 1) return null;

  // Must correspond to the first node in edges
  return edges[0].cursor;
}

export function calcEndCursor(edges: Edge<Node>[]): string | null {
  // Can return null if no cursor is found
  if (edges.length < 1) return null;

  // Must correspond to the last node in edges
  return edges[edges.length - 1].cursor;
}
