import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-github2';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      clientID: configService.get<string>('GITHUB_CLIENT_ID') || 'mock_client_id',
      clientSecret: configService.get<string>('GITHUB_CLIENT_SECRET') || 'mock_secret',
      callbackURL: configService.get<string>('GITHUB_CALLBACK_URL') || 'http://localhost:3001/auth/github/callback',
      scope: ['user:email'],
    });
  }

  async validate(_accessToken: string, _refreshToken: string, profile: Profile): Promise<any> {
    const { username, emails, displayName, photos } = profile;
    const email = emails?.[0]?.value;

    if (!email) {
      throw new Error('No email found on GitHub profile.');
    }

    let user = await this.usersService.findByEmail(email);

    if (!user) {
      user = await this.usersService.create({
        email,
        username: username || email.split('@')[0],
        displayName: displayName || username,
        passwordHash: '', // OAuth users don't have a local password
        avatarUrl: photos?.[0]?.value,
      });
    }

    return user;
  }
}
