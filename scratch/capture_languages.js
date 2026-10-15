import { spawn } from "child_process";
import fs from "fs";
import path from "path";

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const ARTIFACT_DIR = "C:\\Users\\sunka\\.gemini\\antigravity-ide\\brain\\b235cea8-9650-4c12-adbe-cafa7497db68";

const LANG_TESTS = [
  { id: "ta", label: "Tamil" },
  { id: "te", label: "Telugu" },
  { id: "ml", label: "Malayalam" },
];

async function captureLanguages() {
  const browserProc = spawn(EDGE_PATH, [
    "--headless=new",
    "--remote-debugging-port=9226",
    "--disable-gpu",
    "--no-sandbox",
    "--hide-scrollbars",
    "about:blank",
  ]);

  await new Promise((r) => setTimeout(r, 2500));

  try {
    const listRes = await fetch("http://127.0.0.1:9226/json/list");
    const targets = await listRes.json();
    const pageTarget = targets.find((t) => t.type === "page");

    console.log("Connecting to target for language verification:", pageTarget.id);
    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = reject;
    });

    let msgId = 1;
    const callbacks = new Map();

    ws.onmessage = (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.id && callbacks.has(msg.id)) {
        const cb = callbacks.get(msg.id);
        callbacks.delete(msg.id);
        cb(msg.result);
      }
    };

    function call(method, params = {}) {
      return new Promise((resolve) => {
        const id = msgId++;
        callbacks.set(id, resolve);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    await call("Page.enable");
    await call("Runtime.enable");

    for (const l of LANG_TESTS) {
      console.log(`Setting language to ${l.label} (${l.id})...`);

      // 1. Mobile at 390px
      await call("Emulation.setDeviceMetricsOverride", {
        width: 390,
        height: 844,
        deviceScaleFactor: 1,
        mobile: true,
      });

      await call("Page.navigate", { url: "http://localhost:8080/rates" });
      await new Promise((r) => setTimeout(r, 1000));

      // Set localStorage
      await call("Runtime.evaluate", {
        expression: `localStorage.setItem('kb-lang', '${l.id}'); location.reload();`,
      });

      await new Promise((r) => setTimeout(r, 2000));

      let snap = await call("Page.captureScreenshot", {
        format: "png",
        clip: { x: 0, y: 0, width: 390, height: 844, scale: 1 },
      });

      if (snap?.data) {
        const buf = Buffer.from(snap.data, "base64");
        const filename = `rates_phone_390_${l.id}.png`;
        fs.writeFileSync(path.join(ARTIFACT_DIR, filename), buf);
        console.log(`Saved: ${filename}`);
      }

      // 2. Desktop at 1440px
      await call("Emulation.setDeviceMetricsOverride", {
        width: 1440,
        height: 900,
        deviceScaleFactor: 1,
        mobile: false,
      });

      await call("Page.navigate", { url: "http://localhost:8080/rates" });
      await new Promise((r) => setTimeout(r, 2000));

      snap = await call("Page.captureScreenshot", {
        format: "png",
        clip: { x: 0, y: 0, width: 1440, height: 900, scale: 1 },
      });

      if (snap?.data) {
        const buf = Buffer.from(snap.data, "base64");
        const filename = `rates_desktop_1440_${l.id}.png`;
        fs.writeFileSync(path.join(ARTIFACT_DIR, filename), buf);
        console.log(`Saved: ${filename}`);
      }
    }

    // Reset language back to English
    await call("Runtime.evaluate", {
      expression: `localStorage.setItem('kb-lang', 'en');`,
    });

    ws.close();
  } catch (err) {
    console.error("Language capture error:", err);
  } finally {
    browserProc.kill();
  }
}

captureLanguages();
