import { useGraphQlJit } from '@envelop/graphql-jit';
import { createSchema, createYoga } from 'graphql-yoga';

import type { RequestEvent } from '@sveltejs/kit';

import { users } from '$lib/data';

import schema from '$lib/schema.gql';

const yogaApp = createYoga<RequestEvent>({
	schema: createSchema({
		typeDefs: schema,
		resolvers: {
			Query: {
				// https://the-guild.dev/graphql/tools/docs/resolvers
				users: (source, args, context, info) => {
					// Offset & limit pagination
					const { offset, limit }: {
						offset: number;
						limit: number;
					} = args;

					if (offset >= users.length)
						return null;

					// Slice returns copy of section, might lead to increased memory usage
					return users.slice(offset, offset + limit);
				}
			}
		}
	}),
	plugins: [useGraphQlJit()],
	fetchAPI: globalThis
});

export { yogaApp as GET, yogaApp as POST };

