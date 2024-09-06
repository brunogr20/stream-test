import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { getExceptionMessage } from '../helpers/utils';

@Injectable()
export class RedisProvider {

    redisClient;

    constructor(
        @Inject(CACHE_MANAGER)
        private cacheManager: Cache,
    ) {  }

    async get<T>(key: string): Promise<T> {
        try {
            const resultCache = await this.cacheManager.get<string>(key);

            const data: T = resultCache ? JSON.parse(resultCache) : undefined;
            return data;
        } catch (e) {
            console.log(`Error getting  cache: ${getExceptionMessage(e)}`);
            return undefined;
        }
    }

    async set<T>(key: string, value: T, ttl?: number): Promise<void> {
        const valueToCache: string = JSON.stringify(value);
        try {
            await this.cacheManager.set(key, valueToCache, ttl);
        } catch (e) {
            console.log(`Error saving cache: ${getExceptionMessage(e)}`);
        }
    }

    async del(key: string): Promise<void> {
        try {
            await this.cacheManager.del(key);
        } catch (e) {
            console.log(`Error delete cache: ${getExceptionMessage(e)}`);
        }
    }

    async keys(): Promise<string[]> {
        let keys: string[] = [];
        try {
          keys = await this.cacheManager.store.keys();
        } catch (e) {
            console.log(`Error get keys cache: ${getExceptionMessage(e)}`);
        }
        return keys;
    }

}
