export const IS_RUNNING_DEV = process.env.NODE_ENV === 'development';

export const isElectron = () =>
    typeof process !== 'undefined' && typeof process.versions === 'object' && !!process.versions.electron;
