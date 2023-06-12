import { useGraphQlJit } from "@envelop/graphql-jit";
import { createSchema, createYoga } from "graphql-yoga";

import type { RequestEvent } from "@sveltejs/kit";

import schema from "$lib/schema.gql";
import { allUserEdges, handleUsersQuery } from "lib/server/graphql/users.query";

const yogaApp = createYoga<RequestEvent>({
  schema: createSchema({
    typeDefs: schema,
    resolvers: {
      Query: {
        // https://the-guild.dev/graphql/tools/docs/resolvers
        users: (source, args) => {
          return handleUsersQuery(allUserEdges, args);
        }
      }
    }
  }),
  plugins: [useGraphQlJit()],
  fetchAPI: globalThis
});

export { yogaApp as GET, yogaApp as POST };
