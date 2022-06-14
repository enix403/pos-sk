import fs from 'fs';
import JSON5 from 'json5';

export const readJsonSync = (location: string) => {
    const source = fs.readFileSync(location).toString();
    return JSON5.parse(source);
};

