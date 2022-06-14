// Vite does not respect tsconfig paths in its vite.config.ts
// So we have to improvise

require('dotenv/config');
require('tsconfig-paths/register');
require('ts-node').register({
    project: "./ts-node.tsconfig.json"
});

export default require('./viteconf').default;
