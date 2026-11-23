import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { describe, expect, it } from 'vitest';
import { RegisterDto } from './register.dto.js';

describe('RegisterDto', () => {
  const validRegistrationData = {
    email: 'anton@example.com',
    name: 'Anton',
    password: 'safePassword123',
    confirmPassword: 'safePassword123',
  };

  it('accepts valid registration data', async () => {
    const validRegisterDto = plainToInstance(RegisterDto, validRegistrationData);
    const errors = await validate(validRegisterDto);

    expect(errors).toHaveLength(0);
  });

  it('rejects different passwords', async () => {
    const validRegisterDto = plainToInstance(RegisterDto, {
      ...validRegistrationData,
      confirmPassword: 'differentPassword',
    });
    const errors = await validate(validRegisterDto);
    expect(errors).toHaveLength(1);
    expect(errors[0]?.property).toBe('confirmPassword');
    expect(errors[0]?.constraints).toHaveProperty('match');
  });

  it('normalizes the email', async () => {
    const validRegisterDto = plainToInstance(RegisterDto, {
      ...validRegistrationData,
      email: '  aNTON@example.com   ',
    });
    const errors = await validate(validRegisterDto);

    expect(errors).toHaveLength(0);
    expect(validRegisterDto.email).toBe('anton@example.com');
  });

  it('rejects a blank BGG username', async () => {
    const validRegisterDto = plainToInstance(RegisterDto, {
      ...validRegistrationData,
      bggUsername: '   ',
    });
    const errors = await validate(validRegisterDto);

    expect(errors).toHaveLength(1);
    expect(errors[0]?.property).toBe('bggUsername');
    expect(validRegisterDto.bggUsername).toBe('');
  });
});
