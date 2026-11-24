import { ConflictException } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { AuthService } from './auth.service.js';

describe('AuthService', () => {
  let service: AuthService;
  let testingModule: TestingModule;

  const prismaMock = {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    testingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = testingModule.get<AuthService>(AuthService);
  });

  it('throws ConflictException when the email is already registered', async () => {
    const validRegistrationData = {
      email: 'anton@example.com',
      name: 'Anton',
      password: 'safePassword123',
      confirmPassword: 'safePassword123',
    };

    prismaMock.user.findUnique.mockResolvedValueOnce({ email: 'anton@example.com' });

    await expect(service.register(validRegistrationData)).rejects.toThrow(ConflictException);

    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'anton@example.com' },
    });
    expect(prismaMock.user.create).not.toHaveBeenCalled();
  });

  it('throws ConflictException when the email becomes duplicated during user creation', async () => {
    const registrationData = {
      email: 'anton@example.com',
      name: 'Anton',
      password: 'safePassword123',
      confirmPassword: 'safePassword123',
    };
    const uniqueConstraintError = new Prisma.PrismaClientKnownRequestError('Unique constraint failed on the email', {
      code: 'P2002',
      clientVersion: '7.10.1',
      meta: { modelName: 'User', target: ['email'] },
    });

    prismaMock.user.findUnique.mockResolvedValueOnce(null);
    prismaMock.user.create.mockRejectedValueOnce(uniqueConstraintError);

    await expect(service.register(registrationData)).rejects.toThrow(ConflictException);
    expect(prismaMock.user.create).toHaveBeenCalledOnce();
  });

  it('hashes the password and creates a user when the email is available', async () => {
    const validRegistrationData = {
      email: 'anton@example.com',
      name: 'Anton',
      bggUsername: 'anton_the_great',
      password: 'safePassword123',
      confirmPassword: 'safePassword123',
    };
    const createdUser = {
      id: 'user-123',
      email: validRegistrationData.email,
      name: validRegistrationData.name,
      bggUsername: validRegistrationData.bggUsername,
      createdAt: new Date(),
    };

    prismaMock.user.findUnique.mockResolvedValueOnce(null);
    prismaMock.user.create.mockResolvedValueOnce(createdUser);

    await expect(service.register(validRegistrationData)).resolves.toEqual(createdUser);

    expect(prismaMock.user.create).toHaveBeenCalledExactlyOnceWith({
      data: {
        email: validRegistrationData.email,
        name: validRegistrationData.name,
        bggUsername: validRegistrationData.bggUsername,
        passwordHash: expect.stringMatching(/^\$argon2id\$/),
      },
      select: { id: true, email: true, name: true, bggUsername: true, createdAt: true },
    });
  });
});
