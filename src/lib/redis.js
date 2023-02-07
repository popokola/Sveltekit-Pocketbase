import "dotenv/config";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

export const RedisRateLimter =
  process.env.NODE_ENV === "development"
    ? "redis-with-svelte-kit-dev"
    : "redis-with-svelte-kit";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(20, "10 s"),
});


