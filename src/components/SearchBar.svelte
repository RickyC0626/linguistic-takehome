<script lang="ts">
  import Icon from "@iconify/svelte";
  import { userNameToSearch, usersStore } from "lib/client/store/users";
  import type { UserType } from "lib/types";

  let users: UserType[] = [];
  usersStore.subscribe((store) => (users = store));

  let nameToSearch = "";
  let enableSearching = true;

  $: if (enableSearching === false) {
    setTimeout(() => {
      nameToSearch = "";
      userNameToSearch.set("");
      enableSearching = true;
    }, 500);
  }

  const handleSearch = () => {
    if (nameToSearch.length < 1) return;
    enableSearching = false;
  };

  const handleInput = () => userNameToSearch.set(nameToSearch);
</script>

<form class="flex gap-4" on:submit|preventDefault={handleSearch}>
  <div class="flex grow relative">
    <Icon
      icon="ion:search"
      rotate={1}
      class="absolute text-gray-800 place-self-center w-6 h-6 translate-x-3" />
    <input
      type="text"
      name="search_user_by_name"
      bind:value={nameToSearch}
      on:input={handleInput}
      disabled={!enableSearching}
      placeholder="Search user by name..."
      class="
        bg-transparent border-2 border-gray-700/50 rounded-md p-2
        focus-visible:border-gray-800 focus-visible:outline-none
        w-full h-10 pl-11 placeholder:text-gray-800/50
        text-lg text-gray-800 font-bold shadow-md
      " />
    <!-- Loader. I'll make the other component customizable later -->
    <div
      hidden={enableSearching}
      class="w-6 h-6 absolute right-0 -translate-x-3 place-self-center">
      <div
        class="
          w-6 h-6 animate-spin border-4 border-gray-600 border-b-transparent
          rounded-full
        " />
    </div>
  </div>
  <button
    type="submit"
    disabled={!enableSearching}
    class="
      bg-gray-800 px-3 rounded-lg shadow-md inline-block hover:bg-gray-600
      disabled:bg-gray-800/50 disabled:cursor-not-allowed
    ">
    <span class="text-white">Search!</span>
  </button>
</form>
