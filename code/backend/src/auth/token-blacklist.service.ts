import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';

@Injectable()
export class TokenBlacklistService {
    constructor(
        @InjectRedis() private readonly redis: Redis,
    ) {}

    async add(token: string, expiration: number): Promise<void> {
        await this.redis.set(token, 'revoked', 'EX', expiration);
    }

    async isRevoked(token: string): Promise<boolean> {
        const result = await this.redis.get(token);
        return result === 'revoked';
    }
}
