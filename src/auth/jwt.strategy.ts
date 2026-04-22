import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // Menggunakan fallback string agar TypeScript tidak menganggapnya undefined
      secretOrKey: process.env.JWT_SECRET || 'revobank-super-secret-key-2026-production',
    });
  }

  async validate(payload: any) {
    return { id: payload.sub, role: payload.role };
  }
}