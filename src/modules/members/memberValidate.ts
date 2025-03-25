import { Member, MemberRole, MemberFieldType } from '../../types';

export interface ValidationError {
  field: string;
  message: string;
}

export function validateCreateMember(data: any): ValidationError[] {
  const errors: ValidationError[] = [];

  // 提取 username 的型別並檢查
  const usernameType = '' as MemberFieldType<'username'>; // 這裡只是為了拿到型別，值無關
  if (!data.username || !matchesType(data.username, usernameType)) {
    errors.push({ field: 'username', message: 'Username is required and must match its defined type' });
  }

  if (!data.email || !isValidEmail(data.email)) {
    errors.push({ field: 'email', message: 'Valid email is required' });
  }

  if (data.role && !Object.values(MemberRole).includes(data.role)) {
    errors.push({ field: 'role', message: 'Invalid role' });
  }

  if (data.phoneNumber && !/^\d{10}$/.test(data.phoneNumber)) {
    errors.push({ field: 'phoneNumber', message: 'Phone number must be 10 digits' });
  }

  if (data.birthDate && isNaN(new Date(data.birthDate).getTime())) {
    errors.push({ field: 'birthDate', message: 'Invalid birth date' });
  }

  return errors;
}

export function validateUpdateMember(data: any): ValidationError[] {
  const errors: ValidationError[] = [];
  
  const usernameType = '' as MemberFieldType<'username'>; // 這裡只是為了拿到型別，值無關
  if (data.username && !matchesType(data.username, usernameType)) {
    errors.push({ field: 'username', message: 'Username must be a string' });
  }
  if (data.email && !isValidEmail(data.email)) {
    errors.push({ field: 'email', message: 'Valid email is required' });
  }
  if (data.role && !Object.values(MemberRole).includes(data.role)) {
    errors.push({ field: 'role', message: 'Invalid role provided' });
  }
  if (data.phoneNumber && !/^\d{10}$/.test(data.phoneNumber)) {
    errors.push({ field: 'phoneNumber', message: 'Phone number must be 10 digits' });
  }
  if (data.birthDate && isNaN(new Date(data.birthDate).getTime())) {
    errors.push({ field: 'birthDate', message: 'Invalid birth date' });
  }
  return errors;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function matchesType<T>(value: any, typeReference: T): boolean {
  return typeof value === typeof typeReference;
  // if (typeReference === String) return typeof value === 'string';
  // if (typeReference === Date) return value instanceof Date;
  // return false;
}