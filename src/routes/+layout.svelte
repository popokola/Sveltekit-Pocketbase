<script>
	import '../app.postcss';
	import { Toaster } from 'svelte-french-toast';
	import { enhance} from '$app/forms';
	import { page } from '$app/stores';
	import { getImageUrl } from '$lib/utils';
	export let data;


	const submitUpdateTheme = ({ action }) => {
		const theme = action.searchParams.get('theme');
		if (theme) {
			document.documentElement.setAttribute('data-theme', theme);
		}
	};

	const themes = [
		'light',
		'dark',
		'halloween',
		'lofi',
		'dracula'
	];
	
</script>


<Toaster />
<div class="min-h-full">
	<nav class="navbar bg-base-100 border-b">
		<div class="flex-1">
			<a href="/" class="btn btn-ghost normal-case text-xl">Showcase</a>
		</div>
		<div class="flex-none">
			{#if !data.user}
				<div class="dropdown dropdown-end">
					<ul class="menu menu-horizontal px-1 z-50">
						<li>
							<button> Set Theme 🎨 </button>
							<ul class="p-2 bg-base-100 w-full max-h-96 overflow-y-scroll">
								<form method="POST" use:enhance={submitUpdateTheme}>
									{#each themes as theme}
										<li>
											<button formaction="/?/setTheme&theme={theme}&redirectTo={$page.url.pathname}"
												>{theme}</button
											>
										</li>
									{/each}
								</form>
							</ul>
						</li>
					</ul>
					<a href="/login" class="btn btn-primary">Login</a>
					<a href="/register" class="btn btn-secondary">Register</a>
				</div>
			{:else}
				<div class="dropdown dropdown-end">
					<ul class="menu menu-horizontal px-1 z-50">
						<li>
							<button> Set Theme 🎨 </button>
							<ul class="p-2 bg-base-100 w-full max-h-96 overflow-y-scroll">
								<form method="POST" use:enhance={submitUpdateTheme}>
									{#each themes as theme}
										<li>
											<button formaction="/?/setTheme&theme={theme}&redirectTo={$page.url.pathname}"
												>{theme}</button
											>
										</li>
									{/each}
								</form>
							</ul>
						</li>
					</ul>
				</div>
				<div class="dropdown dropdown-end mr-4">
					<a href="/projects/new" class="btn btn-primary btn-outline">Add Project</a>
				</div>
				<div class="dropdown dropdown-end">
					<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
					<!-- svelte-ignore a11y-label-has-associated-control -->
					<label tabindex="0" class="btn btn-ghost btn-circle avatar">
						<div class="w-10 rounded-full">
							<img
								src={data.user?.avatar
									? getImageUrl(data.user?.collectionId, data.user?.id, data.user?.avatar)
									: `https://ui-avatars.com/api/?name=${data.user?.name}`}
								alt="User avatar"
							/>
						</div>
					</label>
					<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
					<ul
						tabindex="0"
						class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
					>
						<li><a href="/my/settings">Settings</a></li>
						<li>
							<form action="/logout" method="POST">
								<button type="submit" class="w-full text-start">Logout</button>
							</form>
						</li>
					</ul>
				</div>
			{/if}
		</div>
	</nav>
	<div class="py-4">
		<div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
			<slot />
		</div>
	</div>
</div>