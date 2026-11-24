import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { RegisterDto } from './dto/register.dto.js';
import * as argon2 from 'argon2';
import { Prisma } from '../generated/prisma/client.js';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(registrationData: RegisterDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: registrationData.email },
    });

    if (user) {
      throw new ConflictException(`User with email ${registrationData.email} already exists`);
    }

    const passwordHash = await argon2.hash(registrationData.password);

    try {
      return await this.prisma.user.create({
        data: {
          email: registrationData.email,
          name: registrationData.name,
          passwordHash,
          bggUsername: registrationData.bggUsername,
        },
        select: {
          id: true,
          email: true,
          name: true,
          bggUsername: true,
          createdAt: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException(`User with email ${registrationData.email} already exists`);
      }

      throw error;
    }
  }
}
