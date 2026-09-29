const [script, ...rest] = process.argv.slice(2);
const abs = "/" + process.cwd().split("\\").join("/") + "/src/" + script;
process.argv = [process.argv[0], abs, ...rest];
await import("file://" + abs);
