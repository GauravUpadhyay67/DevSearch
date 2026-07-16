import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID') || 'mock_client_id',
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET') || 'mock_secret',
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL') || 'http://localhost:3001/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(_accessToken: string, _refreshToken: string, profile: Profile): Promise<any> {
    const { emails, displayName, photos, id } = profile;
    const email = emails?.[0]?.value;

    if (!email) {
      throw new Error('No email found on Google profile.');
    }

    let user = await this.usersService.findByEmail(email);

    if (!user) {
      user = await this.usersService.create({
        email,
        username: email.split('@')[0] + '_' + id.substring(0, 4), // Simple fallback for unique username
        displayName: displayName || email.split('@')[0],
        passwordHash: '', // OAuth users don't have a local password
        avatarUrl: photos?.[0]?.value,
        isEmailVerified: true,
      });
    }

    return user;
  }
}
