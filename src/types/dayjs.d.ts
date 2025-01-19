import { Dayjs } from 'dayjs';

declare module 'dayjs' {
  interface Dayjs {
    isBetween(start: Dayjs, end: Dayjs, unit?: string, inclusivity?: '()' | '[]' | '[)' | '(]'): boolean;
  }
} 