<span class="loader" />

<style lang="postcss">
  .loader {
    @apply w-10 h-10;
    @apply rounded-full inline-block box-border;
    @apply animate-spin;

    border: 4px solid theme("colors.gray.400");
    border-bottom-color: transparent;
    border-radius: 50%;
  }
</style>
