import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import disposableDomains from 'disposable-email-domains';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const domain = data.email.split('@')[1];
    
    // Disposable Email Blocking
    if (disposableDomains.includes(domain)) {
      throw new BadRequestException('Disposable or temporary email addresses are not allowed. Please use a real email.');
    }

    // Check if email or username already exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: data.email },
          { username: data.username },
        ],
      },
    });

    if (existingUser) {
      if (existingUser.email === data.email) {
        throw new BadRequestException('Email already in use.');
      }
      if (existingUser.username === data.username) {
        throw new BadRequestException('Username already taken.');
      }
    }

    return this.prisma.user.create({ data });
  }
}
