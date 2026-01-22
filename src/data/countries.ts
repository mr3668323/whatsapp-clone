export interface Country {
  name: string;
  code: string;
  flag: string;
  dialCode: string;
  maxLength: number;
  pattern?: RegExp;
}

export const countries: Country[] = [
  {
    name: 'Pakistan',
    code: 'PK',
    flag: '🇵🇰',
    dialCode: '+92',
    maxLength: 10, // 10 digits after +92
    pattern: /^3[0-9]{9}$/, // Pakistani mobile numbers start with 3
  },
  {
    name: 'United States',
    code: 'US',
    flag: '🇺🇸',
    dialCode: '+1',
    maxLength: 10,
    pattern: /^[2-9][0-9]{9}$/,
  },
  {
    name: 'United Kingdom',
    code: 'GB',
    flag: '🇬🇧',
    dialCode: '+44',
    maxLength: 10,
    pattern: /^7[0-9]{9}$/,
  },
  {
    name: 'India',
    code: 'IN',
    flag: '🇮🇳',
    dialCode: '+91',
    maxLength: 10,
    pattern: /^[6-9][0-9]{9}$/,
  },
  {
    name: 'Canada',
    code: 'CA',
    flag: '🇨🇦',
    dialCode: '+1',
    maxLength: 10,
    pattern: /^[2-9][0-9]{9}$/,
  },
  {
    name: 'Australia',
    code: 'AU',
    flag: '🇦🇺',
    dialCode: '+61',
    maxLength: 9,
    pattern: /^4[0-9]{8}$/,
  },
  {
    name: 'Germany',
    code: 'DE',
    flag: '🇩🇪',
    dialCode: '+49',
    maxLength: 11,
  },
  {
    name: 'France',
    code: 'FR',
    flag: '🇫🇷',
    dialCode: '+33',
    maxLength: 9,
  },
  {
    name: 'United Arab Emirates',
    code: 'AE',
    flag: '🇦🇪',
    dialCode: '+971',
    maxLength: 9,
  },
  {
    name: 'Saudi Arabia',
    code: 'SA',
    flag: '🇸🇦',
    dialCode: '+966',
    maxLength: 9,
  },
  {
    name: 'China',
    code: 'CN',
    flag: '🇨🇳',
    dialCode: '+86',
    maxLength: 11,
  },
];

export const defaultCountry = countries[0]; // Pakistan