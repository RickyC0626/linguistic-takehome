<script lang="ts">
  import type { UserType } from "lib/types";

  export let user: UserType;
</script>

<div class="user">
  <img src={user.avatar} alt="Avatar" />
  <div>
    <h2>{user.name}</h2>
    <p>{user.email}</p>
  </div>
</div>

<style lang="postcss">
  .user {
    @apply bg-white shadow-lg rounded-md p-4 text-gray-800 transition-all duration-150 w-full;
    @apply flex flex-row justify-start items-center gap-4;
    @apply hover:-translate-y-1 hover:shadow-xl;
    @apply border border-gray-200;

    img {
      @apply bg-white rounded-full;
      @apply border-2 border-orange-500;
      @apply w-14 h-14;
    }

    h2 {
      @apply text-lg font-bold;
    }

    p {
      @apply text-gray-600;
    }
  }
</style>
