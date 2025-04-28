import Redis from "ioredis";

const REDIS_HOST = 'clustercfg.maze-redis.vl4roh.apne1.cache.amazonaws.com'

class RedisService {
  constructor() {
    this.redis = new Redis({
      host: REDIS_HOST,
      port: 6379,
      tls: {},
    });
  }

  async connect() {
    try {
      await this.redis.connect();
    }
    catch (error) {
      console.error('Error connecting to Redis:', error);
      throw error;
    }
  }

  async set(key, value) {
    if (typeof value !== 'string') {
      value = JSON.stringify(value);
    }
    if (typeof key !== 'string') {
      return;
    }
    try {
      await this.redis.set(key, value);
    }
    catch (error) {
      console.error('Error setting value in Redis:', error);
    }
  }

  async get(key) {
    try {
      return await this.redis.get(key);
    }
    catch {
      return null;
    }
  }
}

export const redis = new RedisService();
