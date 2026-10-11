import { spawn } from "child_process";
import fs from "fs";
import path from "path";

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

async function run() {
  const browserProc = spawn(EDGE_PATH, [
    "--headless=new",
    "--remote-debugging-port=9223",
    "--disable-gpu",
    "--no-sandbox",
    "--hide-scrollbars",
  ]);

  await new Promise((r) => setTimeout(r, 2000));

  try {
    const listRes = await fetch("http://127.0.0.1:9223/json/new?http://localhost:8080/");
    const target = await listRes.json();
    console.log("Created target:", target.id);

    const ws = new WebSocket(target.webSocketDebuggerUrl);

    await new Promise((resolve, reject) => {
      let id = 1;
      const callbacks = new Map();

      ws.onopen = () => {
        send("Page.enable");
        send("Emulation.setDeviceMetricsOverride", {
          width: 390,
          height: 844,
          deviceScaleFactor: 2,
          mobile: true,
        });
        send("Page.navigate", { url: "http://localhost:8080/" });
      };

      ws.onmessage = async (evt) => {
        const msg = JSON.parse(evt.data);
        if (msg.id && callbacks.has(msg.id)) {
          const cb = callbacks.get(msg.id);
          callbacks.delete(msg.id);
          cb(msg.result);
        }
        if (msg.method === "Page.loadEventFired") {
          // Wait 1.5s for fonts/images/transitions to settle
          setTimeout(async () => {
            const snap = await call("Page.captureScreenshot", { format: "png" });
            const buf = Buffer.from(snap.data, "base64");
            const outPath = path.resolve("./screenshot_mobile_home_test.png");
            fs.writeFileSync(outPath, buf);
            console.log("Saved test screenshot to:", outPath);
            resolve();
          }, 1500);
        }
      };

      ws.onerror = reject;

      function send(method, params = {}) {
        ws.send(JSON.stringify({ id: id++, method, params }));
      }

      function call(method, params = {}) {
        return new Promise((res) => {
          const curId = id++;
          callbacks.set(curId, res);
          ws.send(JSON.stringify({ id: curId, method, params }));
        });
      }
    });

    await fetch(`http://127.0.0.1:9223/json/close/${target.id}`);
  } catch (err) {
    console.error("Error capturing screenshot:", err);
  } finally {
    browserProc.kill();
  }
}

run();
