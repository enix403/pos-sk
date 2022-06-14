export type TypedOmit<T, V extends keyof T> = Omit<T, V>;
export type RequireKeys<T, Keys extends keyof T> = T & Required<Pick<T, Keys>>;

export interface IndexableIterator<T> extends Iterable<T> {
    [index: number]: T;
};

export type MirrorObjectShape<T, K = any> = Record<keyof T, K>;
export type UnpackedCollection<T> = T extends (infer U)[] ? U : T;

export type ToMutableArray<ROArr> = ROArr extends ReadonlyArray<infer R> ? Array<R> : never;
export type EnhancedBool = boolean | undefined | null;

export type HasID<T = number> = { id: T };

// export type WithoutID<T extends HasID<K>, K = number> = Omit<T, 'id'>;
export type WithoutID<T extends HasID<any>> = Omit<T, 'id'>;

export type Identified<Obj, IDType = number> = HasID<IDType> & Obj
