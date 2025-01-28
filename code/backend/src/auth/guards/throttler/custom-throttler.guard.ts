import {
    Injectable,
    ExecutionContext,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import {
    ThrottlerGuard,
    ThrottlerException,
    ThrottlerRequest,
    ThrottlerModuleOptions,
    ThrottlerStorage,
  } from '@nestjs/throttler';
  
  @Injectable()
  export class CustomThrottlerGuard extends ThrottlerGuard {
    constructor(
      protected readonly options: ThrottlerModuleOptions,
      protected readonly storageService: ThrottlerStorage,
      protected readonly reflector: Reflector,
    ) {
      super(options, storageService, reflector);
    }
  
    async handleRequest(requestProps: ThrottlerRequest): Promise<boolean> {
      const { context, limit, ttl, throttler, blockDuration, getTracker, generateKey } = requestProps;
  
      const req = context.switchToHttp().getRequest();
      const res = context.switchToHttp().getResponse();
  
      // Generate the tracker and key
      const tracker = await getTracker(req, context);
      const key = generateKey(context, tracker, throttler.name);
  
      const {
        totalHits,
        isBlocked,
        timeToExpire,
        timeToBlockExpire,
      } = await this.storageService.increment(key, ttl, limit, blockDuration, throttler.name);
  
      if (isBlocked) {
        const retryAfter = Math.max(timeToExpire, timeToBlockExpire);
  
        // Set Retry-After headers
        res.setHeader('Retry-After', retryAfter);
        res.setHeader(`Retry-After-${throttler.name}`, retryAfter);
  
        throw new HttpException(
          {
            message: `Too many requests. Please wait ${retryAfter} seconds.`,
            retryAfter,
          },
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
  
      // Allow the request if it's within the limit
      if (totalHits > limit) {
        const retryAfter = Math.max(timeToExpire, timeToBlockExpire);
  
        // Set Retry-After headers
        res.setHeader('Retry-After', retryAfter);
        res.setHeader(`Retry-After-${throttler.name}`, retryAfter);
  
        throw new HttpException(
          {
            message: `Too many requests. Please wait ${retryAfter} seconds.`,
            retryAfter,
          },
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
  
      return true;
    }
  }
  