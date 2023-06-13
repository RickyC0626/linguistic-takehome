<script lang="ts">
  import {
    cacheExchange,
    createClient,
    fetchExchange,
    gql,
    queryStore
  } from "@urql/svelte";
  import Loader from "components/Loader.svelte";
  import User from "components/User.svelte";
  import type { UserProfileConnection, UserType } from "lib/types";

  const client = createClient({
    url: "/graphql",
    exchanges: [cacheExchange, fetchExchange]
  });

  let after = "";
  let hasNextPage = false;

  let users: UserType[] = [];
  $: {
    if ($result.data) {
      const data = $result.data.users;
      const edges = data.edges;
      const pageInfo = data.pageInfo;

      hasNextPage = pageInfo.hasNextPage;
      if (pageInfo.endCursor) after = pageInfo.endCursor;

      if (edges.length > 0) {
        edges.forEach((edge) => {
          if (edge.node !== undefined) users.push(edge.node);
        });
        users = users;
      }
    }
  }

  const fetchUsers = ({
    first = 10,
    last,
    before,
    after
  }: {
    first?: number;
    last?: number;
    before?: string;
    after?: string;
  }) => {
    return queryStore<{ users: UserProfileConnection }>({
      client,
      query: gql`
        query ($first: Int, $last: Int, $before: String, $after: String) {
          users(first: $first, last: $last, before: $before, after: $after) {
            pageInfo {
              hasNextPage
              endCursor
            }
            edges {
              cursor
              node {
                id
                name
                avatar
                email
              }
            }
          }
        }
      `,
      variables: { first, last, before, after }
    });
  };

  let result = fetchUsers({ after });

  const detectScrollToBottom = (
    e: UIEvent & {
      currentTarget: EventTarget & HTMLDivElement;
    }
  ) => {
    // Wait for previous fetch to resolve before fetching next page
    if ($result.fetching) return;

    const el = e.target as HTMLDivElement;

    if (hasNextPage && el.scrollHeight - el.scrollTop === el.clientHeight) {
      result = fetchUsers({ after });
    }
  };
</script>

<div
  class="w-full h-full bg-gradient-to-br from-amber-400 to-green-400 grid place-items-center">
  <section
    class="w-[50%] h-[80%] bg-white/50 backdrop-blur-sm rounded-lg overflow-hidden">
    <div
      class="h-full flex flex-col gap-4 items-center overflow-y-scroll p-6"
      on:scroll={detectScrollToBottom}>
      {#each users as user (user.id)}
        <User {user} />
      {/each}
      {#if hasNextPage && !$result.fetching}
        <button
          class="bg-gray-100 px-8 py-6 rounded mt-4"
          on:click={() => (result = fetchUsers({ after }))}>
          <span class="font-bold text-xl">Load More Users</span>
        </button>
      {/if}
      {#if $result.fetching}
        <div class="p-8">
          <Loader />
        </div>
      {/if}
    </div>
  </section>
</div>
