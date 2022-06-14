import type { EnhancedBool } from './tsutils';

export function discardArrFalsey<T = any>(arr: (T | EnhancedBool)[]) : T[]
{
    return arr.filter(Boolean) as T[];
}

export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
