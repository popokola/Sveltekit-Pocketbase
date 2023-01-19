import PocketBase from 'pocketbase';
import { sequence } from '@sveltejs/kit/hooks';
import "dotenv/config";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";


/*
export const handle = async ({ event, resolve }) => {
	event.locals.pb = new PocketBase('https://pb.charlesparames.com');
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

	let theme = null;

	const newTheme = event.url.searchParams.get("theme");
	const cookieTheme = event.cookies.get("colortheme");

	if (newTheme) {
		theme = newTheme;
	} else if (cookieTheme) {
		theme = cookieTheme;
	}

	
	if(theme){
		return await resolve(event, {
			transformPageChunk: ({ html }) =>
				html.replace('data-theme=""', `data-theme="${theme}"`),
		});
	}

	const response = await resolve(event);

	response.headers.set('set-cookie', event.locals.pb.authStore.exportToCookie({ secure: false }));

	return response;
};
*/



export const pocketbase = async ({ event, resolve }) => {
	event.locals.pb = new PocketBase('https://pb.charlesparames.com');
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
	
	console.log("Cookietheme", event.cookies.get("colortheme"));

	const response = await resolve(event);

	response.headers.set('set-cookie', event.locals.pb.authStore.exportToCookie({ secure: false }));

	return response;
};


const themeSetter = async ( { event, resolve })=>{
	let theme = null;

	const newTheme = event.url.searchParams.get("theme");
	const cookieTheme = event.cookies.get("colortheme");

	if (newTheme) {
		theme = newTheme;
	} else if (cookieTheme) {
		theme = cookieTheme;
	}

	if(!theme){
		return await resolve(event);
	}
	
	console.log("theme", theme);
	return await resolve(event, {
		transformPageChunk: ({ html }) =>
			html.replace('data-theme=""', `data-theme="${theme}"`),
	});
}

const rateLimiter = async ({ event, resolve }) => {

	const redis  = new Redis({
		url: process.env.UPSTASH_REDIS_REST_URL,
		token: process.env.UPSTASH_REDIS_REST_TOKEN,
	});

	event.locals.redis = redis;

	console.log("event", event.request);

	const ratelimit = new Ratelimit({
		redis: redis,
		limiter: Ratelimit.slidingWindow(20, "10 s"),
	});

	const key = event.request.headers.get("x-forwarded-for") ?? "127.0.0.1" ;

	if(event.url.pathname.startsWith("/login") || event.url.pathname.startsWith("/register")){
		const { remaining, reset, limit, success, pending } = await ratelimit.limit(`mw_${key}`);
		console.log("remaining", remaining);

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


export const handle = sequence(themeSetter,pocketbase, rateLimiter);
