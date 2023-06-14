import type { UserType } from "lib/types";
import { derived, writable, type Writable } from "svelte/store";

export const usersStore: Writable<UserType[]> = writable([]);
export const userNameToSearch: Writable<string> = writable("");
export const filteredUsersStore = derived(
  [usersStore, userNameToSearch],
  ([users, nameToSearch]) => {
    if (nameToSearch.length < 1) return users;
    return users.filter((user) =>
      user.name?.toLowerCase().includes(nameToSearch.toLowerCase())
    );
  }
);
