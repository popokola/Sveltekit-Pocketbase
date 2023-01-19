<script>
    import { Input } from '$lib/components';
    export let form;
</script>



<div class="flex flex-col w-full h-full">
    <div class="w-full">
        <form action="?/updatePassword" method="POST" class="flex flex-col space-y-2 w-full">
            <h3 class="text-2xl font-medium">Change Password</h3>
            <div class="divider"></div>
            <Input id="oldPassword" type="password" label="Old Password" required errors={form?.errors?.oldPassword} />
            <Input id="password" type="password" label="New Password" required errors={form?.errors?.password} />
            <Input id="passwordConfirm" type="password" label="Comfirm New Password" required errors={form?.errors?.passwordConfirm} />
            <a href="/reset-password" class="text-primary hover:cursor-pointer hover:underline">
                I forget my password
            </a>
            <div class="w-full max-w-lg pt-3">  
                <button type="submit" class="btn btn-primary w-full max-w-lg">
                    Update Password
                </button>
            </div>
        </form>
    </div>


</div>