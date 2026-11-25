import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { describe, expect, it } from 'vitest';
import { LoginDto } from './login.dto.js';

describe('LoginDto', () => {
  const validLoginData = {
    email: 'user@example.com',
    password: 'test-password',
  };

  it('accepts valid login data', async () => {
    const validLoginDto = plainToInstance(LoginDto, validLoginData);
    const errors = await validate(validLoginDto);

    expect(errors).toHaveLength(0);
  });
  it('rejects an invalid email', async () => {
    const invalidLoginDto = plainToInstance(LoginDto, { ...validLoginData, email: 'invalid-email' });
    const errors = await validate(invalidLoginDto);

    expect(errors).toHaveLength(1);
    expect(errors[0]?.property).toBe('email');
    expect(errors[0]?.constraints).toHaveProperty('isEmail');
  });
  it('rejects an empty password', async () => {
    const invalidLoginDto = plainToInstance(LoginDto, { ...validLoginData, password: '' });
    const errors = await validate(invalidLoginDto);

    expect(errors).toHaveLength(1);
    expect(errors[0]?.property).toBe('password');
    expect(errors[0]?.constraints).toHaveProperty('isNotEmpty');
  });
  it('rejects a missing password', async () => {
    const invalidLoginDto = plainToInstance(LoginDto, { email: validLoginData.email });
    const errors = await validate(invalidLoginDto);

    expect(errors).toHaveLength(1);
    expect(errors[0]?.property).toBe('password');
    expect(errors[0]?.constraints).toHaveProperty('isNotEmpty');
  });
  it('rejects a non-string password', async () => {
    const invalidLoginDto = plainToInstance(LoginDto, { ...validLoginData, password: 123123 });
    const errors = await validate(invalidLoginDto);

    expect(errors).toHaveLength(1);
    expect(errors[0]?.property).toBe('password');
    expect(errors[0]?.constraints).toHaveProperty('isString');
  });
  it('normalizes the email', async () => {
    const loginDto = plainToInstance(LoginDto, {
      ...validLoginData,
      email: '  USER@Example.com  ',
    });
    const errors = await validate(loginDto);

    expect(errors).toHaveLength(0);
    expect(loginDto.email).toBe('user@example.com');
  });
});
