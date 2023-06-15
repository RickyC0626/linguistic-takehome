<script lang="ts">
  import Icon from "@iconify/svelte";
  import { userNameToSearch } from "lib/client/store/users";

  let nameToSearch = "";
  let enableSearching = true;

  function onSubmitSearch() {
    if (nameToSearch.length < 1) return;
    enableSearching = false;
  }

  function onInput() {
    userNameToSearch.set(nameToSearch);
  }

  $: if (enableSearching === false) {
    setTimeout(() => {
      nameToSearch = "";
      userNameToSearch.set("");
      enableSearching = true;
    }, 500);
  }
</script>

<div class="p-6 rounded-lg bg-white/50 backdrop-blur-sm">
  <form class="flex gap-4" on:submit|preventDefault={onSubmitSearch}>
    <div class="flex grow relative">
      <Icon
        icon="ion:search"
        rotate={1}
        class="absolute w-6 h-6 place-self-center translate-x-3 text-gray-800" />
      <input
        type="text"
        name="search_user_by_name"
        disabled={!enableSearching}
        placeholder="Search user by name..."
        bind:value={nameToSearch}
        on:input={onInput}
        class="searchbar" />
      <!-- Loader. I'll make the other component customizable later -->
      <div hidden={enableSearching} class="loader-container">
        <div class="loader" />
      </div>
    </div>
    <button type="submit" disabled={!enableSearching} class="submit-btn">
      <span class="text-white">Search!</span>
    </button>
  </form>
</div>

<style lang="postcss">
  .searchbar {
    @apply w-full h-10 pl-11 p-2 rounded-md bg-transparent shadow-md;
    @apply border-2 border-gray-700/50;
    @apply focus-visible:border-gray-800 focus-visible:outline-none;
    @apply text-lg text-gray-800 font-bold;
    @apply placeholder:text-gray-800/50;
  }

  .loader-container {
    @apply w-6 h-6 absolute right-0 -translate-x-3 place-self-center;

    .loader {
      @apply w-6 h-6 rounded-full animate-spin;
      @apply border-4 border-gray-600 border-b-transparent;
    }
  }

  .submit-btn {
    @apply inline-block px-3 rounded-lg shadow-md;
    @apply bg-gray-800 hover:bg-gray-600 disabled:bg-gray-800/50;
    @apply disabled:cursor-not-allowed;
  }
</style>
