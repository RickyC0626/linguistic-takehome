<script lang="ts">
  import Loader from "components/Loader.svelte";
  import SearchBar from "components/SearchBar.svelte";
  import User from "components/User.svelte";
  import { fetchUsers } from "lib/client/fetchUsers";
  import { filteredUsersStore, usersStore } from "lib/client/store/users";
  import type { UserType } from "lib/types";

  let users: UserType[] = [];
  usersStore.subscribe((store) => (users = store));
  let filteredUsers: UserType[] = [];
  filteredUsersStore.subscribe((store) => (filteredUsers = store));

  // The endCursor to start paginating next page from
  let after = "";
  let hasNextPage = false;

  let result = fetchUsers({ after });

  function onScrollToBottom(e: UIEvent) {
    // Wait for previous fetch to resolve before fetching next page
    if ($result.fetching) return;

    const el = e.target as HTMLElement;

    if (hasNextPage && el.scrollHeight - el.scrollTop === el.clientHeight) {
      result = fetchUsers({ after });
    }
  }

  $: if ($result.data) {
    const data = $result.data.users;
    const edges = data.edges;
    const pageInfo = data.pageInfo;

    hasNextPage = pageInfo.hasNextPage;
    if (pageInfo.endCursor) after = pageInfo.endCursor;

    if (edges.length > 0) {
      const newNodes: UserType[] = edges.map((edge) => edge.node!);

      usersStore.set([...users, ...newNodes]);
    }
  }
</script>

<div
  class="w-full h-full bg-gradient-to-br from-amber-400 to-green-400 grid place-items-center">
  <div
    class="flex flex-col gap-4 w-[24rem] h-[32rem] sm:w-[28rem] sm:h-[36rem] md:w-[32rem] md:h-[40rem] lg:w-[48rem] lg:h-[48rem]">
    <div class="bg-white/50 backdrop-blur-sm rounded-lg p-6">
      <SearchBar />
    </div>
    <div class="grow bg-white/50 backdrop-blur-sm rounded-lg overflow-hidden">
      <div
        class="relative h-full flex flex-col gap-4 items-center p-6 overflow-y-scroll"
        on:scroll={onScrollToBottom}>
        {#each filteredUsers as user (user.id)}
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
