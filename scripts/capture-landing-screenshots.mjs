import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
const outDir = path.join(process.cwd(), "screenshots", "landing-redesign");

const shots = [
  { name: "desktop-en", url: "/en", width: 1440, height: 900 },
  { name: "tablet-en", url: "/en", width: 768, height: 1024 },
  { name: "mobile-en", url: "/en", width: 390, height: 844 },
  { name: "desktop-ar", url: "/ar", width: 1440, height: 900 },
  { name: "mobile-ar", url: "/ar", width: 390, height: 844 },
];

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage();

for (const shot of shots) {
  await page.setViewportSize({ width: shot.width, height: shot.height });
  await page.goto(`${baseUrl}${shot.url}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await page.screenshot({
    path: path.join(outDir, `${shot.name}.png`),
    fullPage: true,
  });
  console.log(`Saved ${shot.name}.png`);
}

await browser.close();
