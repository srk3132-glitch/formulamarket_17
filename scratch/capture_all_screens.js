import { spawn } from "child_process";
import fs from "fs";
import path from "path";

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const ARTIFACT_DIR = "C:\\Users\\sunka\\.gemini\\antigravity-ide\\brain\\b235cea8-9650-4c12-adbe-cafa7497db68";

const VIEWPORTS = [
  { name: "phone_360", width: 360, height: 780, mobile: true },
  { name: "phone_390", width: 390, height: 844, mobile: true },
  { name: "tablet_768", width: 768, height: 1024, mobile: false },
  { name: "laptop_1024", width: 1024, height: 768, mobile: false },
  { name: "desktop_1440", width: 1440, height: 900, mobile: false },
];

const PAGES = [
  { slug: "home", url: "http://localhost:8080/" },
  { slug: "rates", url: "http://localhost:8080/rates" },
  { slug: "buy", url: "http://localhost:8080/buy" },
  { slug: "sell", url: "http://localhost:8080/sell" },
  { slug: "how_it_works", url: "http://localhost:8080/how-it-works" },
  { slug: "login", url: "http://localhost:8080/login" },
];

async function capture() {
  const browserProc = spawn(EDGE_PATH, [
    "--headless=new",
    "--remote-debugging-port=9225",
    "--disable-gpu",
    "--no-sandbox",
    "--hide-scrollbars",
    "about:blank",
  ]);

  await new Promise((r) => setTimeout(r, 2500));

  try {
    const listRes = await fetch("http://127.0.0.1:9225/json/list");
    const targets = await listRes.json();
    const pageTarget = targets.find((t) => t.type === "page");

    if (!pageTarget) {
      throw new Error("No page target found in Edge CDP list");
    }

    console.log("Connecting to target:", pageTarget.id);
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
    await call("Network.enable");

    for (const page of PAGES) {
      for (const vp of VIEWPORTS) {
        console.log(`Capturing ${page.slug} at ${vp.name} (${vp.width}x${vp.height})...`);

        // Set device metrics
        await call("Emulation.setDeviceMetricsOverride", {
          width: vp.width,
          height: vp.height,
          deviceScaleFactor: 1,
          mobile: vp.mobile,
        });

        // Navigate
        await call("Page.navigate", { url: page.url });

        // Wait 1.8 seconds for rendering and fonts
        await new Promise((r) => setTimeout(r, 1800));

        // Capture screenshot
        const snap = await call("Page.captureScreenshot", {
          format: "png",
          clip: {
            x: 0,
            y: 0,
            width: vp.width,
            height: vp.height,
            scale: 1,
          },
        });

        if (snap && snap.data) {
          const buf = Buffer.from(snap.data, "base64");
          const filename = `${page.slug}_${vp.name}.png`;
          const filePath = path.join(ARTIFACT_DIR, filename);
          fs.writeFileSync(filePath, buf);
          console.log(`Saved screenshot: ${filename} (${buf.length} bytes)`);
        }
      }
    }

    ws.close();
  } catch (err) {
    console.error("Capture process error:", err);
  } finally {
    browserProc.kill();
  }
}

capture();
