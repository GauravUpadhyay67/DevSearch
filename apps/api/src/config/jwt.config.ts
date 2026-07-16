import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  accessSecret: process.env.JWT_ACCESS_SECRET || 'fallback_access_secret',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret',
  accessExpiration: process.env.JWT_ACCESS_EXPIRATION || '15m',
  refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d',
}));
