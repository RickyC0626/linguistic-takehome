import type { UserType } from "lib/types";
import { derived, writable, type Writable } from "svelte/store";

export const usersStore: Writable<UserType[]> = writable([]);
export const userNameToSearch: Writable<string> = writable("");
export const filteredUsersStore = derived(
  [usersStore, userNameToSearch],
  ([users, nameToSearch]) => {
    if (nameToSearch.length < 1) return users;

    const lcSearch = nameToSearch.toLowerCase();
    const includes = users.filter((user) =>
      user.name?.toLowerCase().includes(lcSearch)
    );

    const startsOnly: UserType[] = [];
    const includesOnly: UserType[] = [];

    includes.forEach((user) => {
      if (user.name?.toLowerCase().startsWith(lcSearch)) startsOnly.push(user);
      else includesOnly.push(user);
    });

    startsOnly.sort(sortUserNames);
    includesOnly.sort(sortUserNames);

    return [...startsOnly, ...includesOnly];
  }
);

function sortUserNames(a: UserType, b: UserType) {
  if (a.name! < b.name!) return -1;
  else if (a.name! > b.name!) return 1;
  return 0;
}
