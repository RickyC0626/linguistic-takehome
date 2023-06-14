import type { UserType } from "lib/types";
import { writable, type Writable } from "svelte/store";

export const usersStore: Writable<UserType[]> = writable([]);
