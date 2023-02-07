import PocketBase from 'pocketbase';
import { sequence } from '@sveltejs/kit/hooks';
import "dotenv/config";
import { redis, ratelimit } from '$lib/redis';


export const pocketbase = async ({ event, resolve }) => {

	//reuse the same instance of PocketBase for all requests
	if(!event.locals.pb) {
		event.locals.pb = new PocketBase('https://pb.charlesparames.com');
	}
	event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

	try {
		if (event.locals.pb.authStore.isValid) {
			await event.locals.pb.collection('users').authRefresh();
			event.locals.user = JSON.parse(JSON.stringify(event.locals.pb.authStore.model));
		}
	} catch (_) {
		event.locals.pb.authStore.clear();
		event.locals.user = undefined;
	}

	let theme = "";

	const newTheme = event.url.searchParams.get("theme");
	const cookieTheme = event.cookies.get("colortheme");

	if (newTheme) {
		theme = newTheme;
	} else if (cookieTheme) {
		theme = cookieTheme;
	}

	const response = await resolve(event, {
		transformPageChunk: ({ html }) =>
			html.replace('data-theme=""', `data-theme="${theme}"`),
	});

	response.headers.append('set-cookie', event.locals.pb.authStore.exportToCookie({ secure: false }));

	return response;
};



const rateLimiter = async ({ event, resolve }) => {

	event.locals.redis = redis;
	const key = event.request.headers.get("x-forwarded-for") ?? "127.0.0.1" ;

	if(event.url.pathname.startsWith("/login") || event.url.pathname.startsWith("/register") || event.url.pathname.startsWith("/reset-password")){
		const { remaining, reset, limit, success, pending } = await ratelimit.limit(`mw_${key}`);

		await pending;

		if (!success) {
			return new Response("Too many requests", {
				status: 429,
				headers: {
					"Retry-After": reset,
				},
			});
		}

	}
	
	return await resolve(event);
}


export const handle = sequence(rateLimiter, pocketbase);
