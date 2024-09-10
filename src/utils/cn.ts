// utils/cn.ts
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...classes: (string | false | undefined | null)[]): string {
  const combined = clsx(...classes);
  return twMerge(combined);
}
