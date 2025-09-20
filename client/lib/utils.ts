import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function groupWith<T>(
  arr: T[],
  predicate: (item: T) => string,
): Record<string, T[]> {
  return arr.reduce(
    (acc, item) => {
      const key = predicate(item);
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    },
    {} as Record<string, T[]>,
  );
}
