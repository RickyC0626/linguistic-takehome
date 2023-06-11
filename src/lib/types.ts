export interface Node {
  id: string;
};

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

export interface Edge<T> {
  cursor: string;
  node?: T;
}

export type UserProfileEdge = Edge<UserType> & {};

export type PageInfo = {
  startCursor?: string;
  endCursor?: string;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};
