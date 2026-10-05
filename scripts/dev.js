import { spawn } from "node:child_process";
import net from "node:net";

const children = [];
let stopping = false;
function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of children) child.kill("SIGTERM");
  process.exitCode = code;
}
function start(args) {
  const child = spawn(process.execPath, args, { stdio: "inherit", env: process.env });
  children.push(child);
  child.on("error", error => { console.error(error.message); stop(1); });
  child.on("exit", (code, signal) => {
    if (!stopping) {
      console.error(`Development service stopped (${signal || code}).`);
      stop(code || 1);
    }
  });
}
process.on("SIGINT", () => stop());
process.on("SIGTERM", () => stop());

// Reuse an API already running on the configured port instead of launching a duplicate.
const { config } = await import("dotenv");
config({ quiet: true });
const port = Number(process.env.PORT || 5001);
const listening = await new Promise(resolve => {
  const socket = net.createConnection({ host: "localhost", port });
  socket.setTimeout(1000);
  socket.once("connect", () => { socket.destroy(); resolve(true); });
  socket.once("error", () => { socket.destroy(); resolve(false); });
  socket.once("timeout", () => { socket.destroy(); resolve(false); });
});
if (listening) console.log(`Reusing backend on port ${port}.`);
else start(["backend/app.js"]);
start(["node_modules/vite/bin/vite.js", ...process.argv.slice(2)]);
