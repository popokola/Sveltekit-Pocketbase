<script>
	import { enhance } from '$app/forms';
	import { Input } from '$lib/components';
	import toast from 'svelte-french-toast';
	export let form;
	let loading = false;
	const submitRegister = () => {
		loading = true;
		return async ({ result, update }) => {
			console.log(result);
			console.log(result.type);
			switch (result.type) {
				case 'redirect':
					toast.success('Email was sent to verify your account');
					await update();
					break;
				case 'failure':
					toast.error('You must fill out all fields');
					await update();
					break;
				case 'error':
					toast.error('Could not register. Please try again later.');
					break;
				default:
					await update();
			}
			loading = false;
		};
	};
</script>

<div class="flex flex-col items-center h-full w-full">
	<h2 class="mt-2 text-center text-3xl font-bold tracking-tight text-base-content">
		Register for an account
	</h2>
	<p class="text-center mt-1">
		Or <a href="/login" class="text-primary font-medium hover:cursor-pointer hover:underline"
			>sign in</a
		> if you already have an account.
	</p>
	<form action="?/register" method="POST" class="flex flex-col items-center space-y-2 w-full pt-4" use:enhance={submitRegister}>
		<Input id="name" label="Name" value={form?.data?.name} errors={form?.errors?.name} />
		<Input id="username" label="Username" value={form?.data?.username} errors={form?.errors?.username} />
		<Input
			type="email"
			id="email"
			label="Email"
			value={form?.data?.email}
			errors={form?.errors?.email}
		/>
		<Input type="password" id="password" label="Password" errors={form?.errors?.password} />
		<Input
			type="password"
			id="passwordConfirm"
			label="Confirm Password"
			errors={form?.errors?.passwordConfirm}
		/>
		<div class="w-full max-w-md pt-2">
			<button type="submit" class="btn btn-primary w-full" disabled={loading}>Register</button>
		</div>
	</form>
</div>