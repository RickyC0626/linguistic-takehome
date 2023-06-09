<script lang="ts">
	import { cacheExchange, createClient, fetchExchange, gql, queryStore } from '@urql/svelte';
	import Loader from 'components/Loader.svelte';
	import User from 'components/User.svelte';
	import type { UserType } from 'lib/types';

	const client = createClient({
		url: '/graphql',
		exchanges: [cacheExchange, fetchExchange]
	});

	let offset = 0;
	const limit = 10;

	let users: UserType[] = [];
	$: {
		if($result.data) {
			const data = $result.data;
			console.log(data);

			if(data.users) {
				users.push(...data.users);
				users = users;
			}
			else offset -= limit;
		}
	};

	const fetchUsers = ({ offset, limit }: {
		offset: number;
		limit: number;
	}) => {
		return queryStore<{ users: UserType[] }>({
			client,
			query: gql`
				query ($offset: Int, $limit: Int) {
					users (offset: $offset, limit: $limit) {
						id
						name
						avatar
						email
					}
				}
			`,
			variables: { offset, limit }
		});
	};

	let result = fetchUsers({ offset, limit });

	const detectScrollToPageBottom = (e: UIEvent & {
    currentTarget: EventTarget & HTMLDivElement;
	}) => {
		if($result.fetching) return;

		const el = e.target as HTMLDivElement;

		if(el.scrollHeight - el.scrollTop === el.clientHeight) {
			console.log(`offset: ${offset} --> ${offset + limit}`);
			offset += limit;
			result = fetchUsers({ offset, limit });
		}
	};
</script>

<div class="w-full h-full overflow-scroll" on:scroll={detectScrollToPageBottom}>
	<div class="flex flex-col gap-4 items-center p-4">
		{#each users as user (user.id)}
			<User {user} />
		{/each}
		{#if $result.fetching}
			<Loader />
		{/if}
	</div>
</div>
