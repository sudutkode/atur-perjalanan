import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

// Matches the app JWT lifetime (`jwt.expiresIn` = 24h). There is no refresh
// endpoint, so a shorter realtime token would silently kill the WebSocket's
// auth mid-session while the REST session stays valid.
const REALTIME_TOKEN_TTL_SECONDS = 24 * 60 * 60; // 24 hours

/**
 * Mints a Supabase-compatible JWT so the mobile client can open a Supabase
 * Realtime WebSocket whose `auth.uid()` resolves to the app's own user id
 * (ARCHITECTURE §6). This token is NEVER used against NestJS REST
 * endpoints — only to authenticate the Supabase Realtime connection.
 */
@Injectable()
export class RealtimeTokenService {
  constructor(private readonly config: ConfigService) {}

  mint(userId: string): string {
    const secret =
      this.config.get<string>('supabase.jwtSecret') ??
      this.config.get<string>('SUPABASE_JWT_SECRET') ??
      '';

    // Gracefully no-op when the secret isn't configured (e.g. local dev without
    // Realtime) rather than throwing and breaking the whole sign-in response.
    if (!secret) return '';

    return jwt.sign(
      {
        sub: userId,
        role: 'authenticated',
        aud: 'authenticated',
      },
      secret,
      { expiresIn: REALTIME_TOKEN_TTL_SECONDS },
    );
  }
}
