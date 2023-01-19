import { error, fail} from '@sveltejs/kit';
import { validateData } from '$lib/utils';
import { updateProfileSchema } from '$lib/schemas';
import { serialize } from 'object-to-formdata';

export const actions = {
    updateProfile: async ({  request ,  locals  }) => {
        const body = await request.formData();
        const userAvatar = body.get('avatar');
        if (userAvatar.size === 0) {
            body.delete('avatar');
        }

        const { formData, errors } = await validateData(body, updateProfileSchema);
        const { avatar, ...rest } = formData;

		if (errors) {
			return fail(400, {
                data: rest,
				errors: errors.fieldErrors
			});
		}
        
        try  {
           const {name, avatar} = await locals.pb.collection("users").update(locals?.user?.id, serialize(formData));
           locals.user.name = name;
           locals.user.avatar = avatar;
        } catch (err) {
            console.log('Error ', err);
            throw error(500, 'Something went updating your profile');
        }

        return {
            success: true
        };

    }

};
