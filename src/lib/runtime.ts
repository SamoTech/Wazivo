import { createHash } from 'crypto';
import type { NextRequest } from 'next/server';

type MemoryCacheEntry = {
  value: string;
  expiresAt: number;
};

type MemoryRateEntry = {
  count: number;
  expiresAt: number;
};

declare global {
  var __wazivoCache: Map<string, MemoryCacheEntry> | undefined;
  var __wazivoRateLimit: Map<string, MemoryRateEntry> | undefined;
}

const memoryCache = globalThis.__wazivoCache ?? (globalThis.__wazivoCache = new Map());
const memoryRateLimit = globalThis.__wazivoRateLimit ?? (globalThis.__wazivoRateLimit = new Map());

function getRedisConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();

  if (!url || !token) return null;
  return { url, token };
}

async function redisCommand(args: Array<string | number>) {
  const config = getRedisConfig();
  if (!config) return null;

  const response = await fetch(config.url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(args),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Redis command failed');
  }

  const data = (await response.json()) as { result?: unknown };
  return data.result ?? null;
}

export function hashText(value: string) {
  return createHash('sha256').update(value).digest('hex');
}

export function normalizeResumeInput(value: string) {
  return value.replace(/\r\n/g, '\n').replace(/\t/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
}

export function ensureTextLength(value: string, label: string, min: number, max: number) {
  if (value.length < min) {
    throw new Error(`${label} must be at least ${min} characters.`);
  }

  if (value.length > max) {
    throw new Error(`${label} must be at most ${max} characters.`);
  }
}

export function getRequesterId(request: NextRequest) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwardedFor?.split(',')[0]?.trim() || realIp || 'anonymous';
  return ip;
}

export async function getCachedJSON<T>(key: string): Promise<T | null> {
  try {
    const redisValue = await redisCommand(['GET', key]);
    if (typeof redisValue === 'string') {
      return JSON.parse(redisValue) as T;
    }
  } catch {}

  const item = memoryCache.get(key);
  if (!item) return null;
  if (Date.now() > item.expiresAt) {
    memoryCache.delete(key);
    return null;
  }

  return JSON.parse(item.value) as T;
}

export async function setCachedJSON<T>(key: string, value: T, ttlSeconds: number) {
  const serialized = JSON.stringify(value);

  try {
    await redisCommand(['SETEX', key, ttlSeconds, serialized]);
    return;
  } catch {}

  memoryCache.set(key, {
    value: serialized,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
}

export async function rateLimit(identifier: string, scope: string, limit: number, windowSeconds: number) {
  const now = Date.now();
  const bucket = Math.floor(now / (windowSeconds * 1000));
  const key = `ratelimit:${scope}:${identifier}:${bucket}`;

  try {
    const count = Number((await redisCommand(['INCR', key])) ?? 0);
    if (count === 1) {
      await redisCommand(['EXPIRE', key, windowSeconds]);
    }

    return {
      allowed: count <= limit,
      remaining: Math.max(limit - count, 0),
      resetAt: (bucket + 1) * windowSeconds * 1000,
    };
  } catch {}

  const record = memoryRateLimit.get(key);
  if (!record || now > record.expiresAt) {
    memoryRateLimit.set(key, { count: 1, expiresAt: now + windowSeconds * 1000 });
    return { allowed: true, remaining: Math.max(limit - 1, 0), resetAt: now + windowSeconds * 1000 };
  }

  record.count += 1;
  memoryRateLimit.set(key, record);

  return {
    allowed: record.count <= limit,
    remaining: Math.max(limit - record.count, 0),
    resetAt: record.expiresAt,
  };
}
