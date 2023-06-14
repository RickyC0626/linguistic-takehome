<script lang="ts">
  import Icon from "@iconify/svelte";
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
  <div
    class="flex flex-col gap-4 w-[24rem] h-[32rem] sm:w-[28rem] sm:h-[36rem] md:w-[32rem] md:h-[40rem] lg:w-[48rem] lg:h-[48rem]">
    <div class="bg-white/50 backdrop-blur-sm rounded-lg p-6">
      <form
        class="flex gap-4"
        on:submit|preventDefault={() => console.log("searching...")}>
        <div class="flex grow">
          <Icon
            icon="ion:search"
            rotate={1}
            class="absolute text-gray-800 place-self-center w-6 h-6 translate-x-3" />
          <input
            type="text"
            name="search_user_by_name"
            placeholder="Search user by name..."
            class="
              bg-transparent border-2 border-gray-700/50 rounded-md p-2
              focus-visible:border-gray-800 focus-visible:outline-none
              w-full h-10 pl-11 placeholder:text-gray-800/50
              text-lg text-gray-800 font-bold
            " />
        </div>
        <button class="bg-gray-800 px-3 rounded-lg">
          <span class="text-white">Search!</span>
        </button>
      </form>
    </div>
    <div class="grow bg-white/50 backdrop-blur-sm rounded-lg overflow-hidden">
      <div
        class="relative h-full flex flex-col gap-4 items-center p-6 pb-0 overflow-y-scroll"
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
      </div>
      <div
        class="
        sticky bottom-0 w-full grid place-content-center bg-white
        outline outline-1 outline-gray-300 rounded-t-lg p-6
        transition-all duration-200 ease-in-out
        {$result.fetching ? 'translate-y-0' : 'translate-y-28'}
      ">
        <Loader />
      </div>
    </div>
  </div>
</div>
