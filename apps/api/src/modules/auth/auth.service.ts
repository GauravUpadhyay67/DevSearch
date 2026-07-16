import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(pass, user.passwordHash)) {
      if (!user.isEmailVerified) {
        throw new BadRequestException('Please verify your email address to log in.');
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.accessSecret')!,
      expiresIn: (this.configService.get<string>('jwt.accessExpiration') || '15m') as any,
    });
    
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.refreshSecret')!,
      expiresIn: (this.configService.get<string>('jwt.refreshExpiration') || '7d') as any,
    });

    // Save refresh token to DB
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // roughly 7 days
    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  async register(data: any) {
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(data.password, saltRounds);

    const verificationToken = crypto.randomBytes(32).toString('hex');

    await this.usersService.create({
      email: data.email,
      username: data.username,
      passwordHash,
      displayName: data.displayName,
      isEmailVerified: false,
      emailVerificationToken: verificationToken,
    });

    // Log verification link for local development
    console.log('\n==================================================');
    console.log('EMAIL VERIFICATION LINK (LOCAL DEVELOPMENT):');
    console.log(`http://localhost:3000/auth/verify?token=${verificationToken}`);
    console.log('==================================================\n');

    return {
      message: 'Registration successful. Please check your email (or CLI logs) to verify your account.',
    };
  }

  async verifyEmail(token: string) {
    const user = await this.prisma.user.findFirst({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired verification token.');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        emailVerificationToken: null,
      },
    });

    return { message: 'Email verified successfully. You can now log in.' };
  }
}
