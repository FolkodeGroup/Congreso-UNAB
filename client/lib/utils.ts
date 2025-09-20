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

export function chunk<T>(arr: T[], size: number): T[][] {
  if (size <= 0) {
    // Return an empty array or handle as an error, depending on desired behavior.
    // For this case, returning an array with the original array as a single chunk might be safe.
    // Or throwing an error if size is expected to be always positive.
    // Let's return an empty array for safety, to avoid breaking rendering.
    return [];
  }
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}