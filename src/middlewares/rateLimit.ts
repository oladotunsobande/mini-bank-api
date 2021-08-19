import redis from 'redis';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import { ExpressRequest } from '../util/express';
import { Response, NextFunction } from 'express';
import { ResponseType } from '../types';
import ResponseHandler from '../util/response-handler';
import {
  FAILED_LOGIN_KEY_PREFEX,
  API_RATE_LIMITER_POINTS,
  USER_STORAGE_DURATION,
  API_RATE_LIMITER_DURATION,
  API_RATE_LIMIT_KEY_PREFIX,
  MAX_FAILED_LOGINS_PER_USER,
  BLOCK_DURATION_FOR_FAILED_LOGIN,
} from '../constants/security';

const redisClient = redis.createClient({
  host: 'redis',
  port: 6379,
  enable_offline_queue: false,
});

export const consecutiveLoginFails = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: FAILED_LOGIN_KEY_PREFEX,
  points: MAX_FAILED_LOGINS_PER_USER,
  duration: USER_STORAGE_DURATION,
  blockDuration: BLOCK_DURATION_FOR_FAILED_LOGIN,
});

const apiRateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: API_RATE_LIMIT_KEY_PREFIX,
  points: API_RATE_LIMITER_POINTS,
  duration: API_RATE_LIMITER_DURATION,
});

export async function rateLimiterMiddleware(req: ExpressRequest, res: Response, next: NextFunction): Promise<ResponseType> {
  apiRateLimiter.consume(req.ip)
    .then(() => {
      next();
    })
    .catch(() => {
      return ResponseHandler.sendErrorResponse({
        res,
        status: 429,
        error: 'Too many requests.',
      });
    });
}