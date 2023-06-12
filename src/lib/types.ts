export interface Node {
  id: string;
}

export type UserType = Node & {
  name?: string;
  email?: string;
  avatar?: string;
};

export type UserProfileConnection = {
  edges: UserProfileEdge[];
  pageInfo: PageInfo;
  totalCount: number;
};

export interface Edge<Node> {
  cursor: string;
  node?: Node;
}

export type UserProfileEdge = Edge<UserType>;

export type PageInfo = {
  startCursor?: string | null;
  endCursor?: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};
