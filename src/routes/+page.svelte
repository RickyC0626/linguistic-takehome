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

  const first = 10;
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
    first,
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

  let result = fetchUsers({ first, after });

  const detectScrollToPageBottom = (
    e: UIEvent & {
      currentTarget: EventTarget & HTMLDivElement;
    }
  ) => {
    // Wait for previous fetch to resolve before fetching next page
    if ($result.fetching) return;

    const el = e.target as HTMLDivElement;

    if (hasNextPage && el.scrollHeight - el.scrollTop === el.clientHeight) {
      result = fetchUsers({ first, after });
    }
  };
</script>

<div class="w-full h-full overflow-scroll" on:scroll={detectScrollToPageBottom}>
  <div class="flex flex-col gap-4 items-center p-4">
    {#each users as user (user.id)}
      <User {user} />
    {/each}
    {#if $result.fetching}
      <div class="p-8">
        <Loader />
      </div>
    {/if}
  </div>
</div>
