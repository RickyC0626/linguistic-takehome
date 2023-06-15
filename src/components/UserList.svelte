<script lang="ts">
  import { fetchUsers } from "lib/client/fetchUsers";
  import { filteredUsersStore, usersStore } from "lib/stores";
  import type { UserType } from "lib/types";
  import Loader from "./Loader.svelte";
  import User from "./User.svelte";

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

      usersStore.update((users) => [...users, ...newNodes]);
    }
  }
</script>

<div class="userlist-container">
  <div class="user-list" on:scroll={onScrollToBottom}>
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
  <div class="loader {$result.fetching ? 'translate-y-0' : 'translate-y-28'}">
    <Loader />
  </div>
</div>

<style lang="postcss">
  .userlist-container {
    @apply grow rounded-lg overflow-hidden;
    @apply bg-white/50 backdrop-blur-sm;

    .user-list {
      @apply flex flex-col gap-4 items-center;
      @apply relative h-full p-6 overflow-y-scroll;
    }

    .loader {
      @apply sticky bottom-0 grid place-content-center;
      @apply w-full p-6 rounded-t-lg bg-white;
      @apply outline outline-1 outline-gray-300;
      @apply transition-all duration-200 ease-in-out;
    }
  }
</style>
