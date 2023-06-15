<script lang="ts">
  import SearchBar from "components/SearchBar.svelte";
  import UserList from "components/UserList.svelte";
</script>

<div class="page">
  <div class="content-container">
    <div class="searchbar-container">
      <SearchBar />
    </div>
    <UserList />
  </div>
</div>

<style lang="postcss">
  .page {
    @apply w-full h-full grid place-items-center;
    @apply bg-gradient-to-br from-amber-400 to-green-400;

    .content-container {
      @apply flex flex-col gap-4;
      @apply w-[24rem] h-[32rem];
      @apply sm:w-[28rem] sm:h-[36rem];
      @apply md:w-[32rem] md:h-[40rem];
      @apply lg:w-[48rem] lg:h-[48rem];

      .searchbar-container {
        @apply p-6 rounded-lg;
        @apply bg-white/50 backdrop-blur-sm;
      }
    }
  }
</style>
