import { User } from '../types/user';

export const parseJwt = (token: string): User => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );

  const user = JSON.parse(jsonPayload) as User;

  return user;
};

export const formatCurrency = (number: number | string, withCents?: boolean): string => {
  const options: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  };

  const newNumber = Number(number);

  const hasCents = newNumber % 1 !== 0;

  if (hasCents || withCents) {
    options.minimumFractionDigits = 2;
  }

  return new Intl.NumberFormat('en-US', options).format(newNumber);
};

const addPrefix = (number: string): string => {
  return `${number.slice(0, 1) === '+' ? '' : '+'}${number}`;
};

export const formatPhoneNumber = (phoneNumber: string): string => {
  const cleaned = ('' + phoneNumber).replace(/\D/g, '');

  const isValidPhoneNumber = cleaned.length === 11;

  if (!isValidPhoneNumber) {
    return addPrefix(phoneNumber);
  }

  const formatted = `+${cleaned.substring(0, 1)} (${cleaned.substring(1, 4)}) ${cleaned.substring(4, 7)}-${cleaned.substring(7)}`;
  return addPrefix(formatted);
};

const ALLOWED_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Backspace', 'Delete', 'Enter'];

export const validateNumberField = (key: string, isDecimal: boolean = false): boolean => {
  return ALLOWED_KEYS.includes(key) || (isDecimal && key === '.') || !!key.match(/[0-9]/g);
};
