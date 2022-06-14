const fs = require('fs');

// fs.rmSync("", { force: true, recursive: true });

const targets = process.argv.slice(2);
if (targets.length == 0) {
    console.err("No targets specified");
    process.exit(1);
}

targets.forEach(t => {
    fs.rmSync(t, { force: true, recursive: true });
});
