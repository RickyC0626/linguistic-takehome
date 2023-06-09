export type Node = {
	id: string;
};

export type UserType = {
	id: string;
	name?: string;
	email?: string;
	avatar?: string;
};

export type UserProfileConnection = {
	edges: UserProfileEdge[];
	pageInfo: PageInfo;
	totalCount: number;
};

export type UserProfileEdge = {
	cursor: string;
	node?: UserType;
};

export type PageInfo = {
	startCursor?: string;
	endCursor?: string;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
};
