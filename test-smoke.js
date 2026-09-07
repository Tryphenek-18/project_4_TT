/* Integration smoke test for the ShopVerse frontend.
   Requires the server on http://localhost:3000 (npm start).
   Loads public/index.html in jsdom, evaluates public/js/script.js against it
   (mirroring how a browser runs a page script), and verifies the data loaded
   from the API is rendered into the UI.
   ALSO verifies the order flow end-to-end: it POSTs to /api/orders with the
   exact payload the frontend's checkout() sends and confirms an order is created.
   Run: npm test  (or: node test-smoke.js)
*/
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");
const NATIVE_FETCH = globalThis.fetch; // capture Node's real fetch before shadowing

const ORIGIN = "http://localhost:3000";

(async () => {
  const dom = new JSDOM("", { url: ORIGIN + "/" });
  const win = dom.window;

  // Browser-like globals the app script relies on (fetch resolves relative URLs).
  Object.assign(global, {
    window: win,
    document: win.document,
    location: win.location,
    localStorage: win.localStorage,
    HTMLElement: win.HTMLElement,
    HTMLDivElement: win.HTMLDivElement,
    Element: win.Element,
    Node: win.Node,
    Event: win.Event,
    confirm: () => true,
    fetch: async (url, ...rest) => NATIVE_FETCH(new URL(url, ORIGIN + "/").toString(), ...rest)
  });
  win.navigator = win.navigator || (win.Navigator ? new win.Navigator() : {});
  global.navigator = win.navigator;
  win.fetch = global.fetch;
  win.bootstrap = global.bootstrap = { Modal: class { constructor() {} show() {} } };

  win.document.write(fs.readFileSync(path.join(__dirname, "public", "index.html"), "utf-8"));
  win.document.close();

  const logs = [];
  const origLog = console.log, origErr = console.error;
  console.log = (...a) => logs.push(a.join(" "));
  console.error = (...a) => logs.push("ERR: " + a.join(" "));

  try {
    const pre = `var window=globalThis.window, document=globalThis.document, fetch=globalThis.fetch,` +
      `localStorage=globalThis.localStorage, navigator=globalThis.navigator, confirm=globalThis.confirm,` +
      `bootstrap=globalThis.bootstrap, HTMLElement=globalThis.HTMLElement, HTMLDivElement=globalThis.HTMLDivElement,` +
      `Element=globalThis.Element, Node=globalThis.Node, Event=globalThis.Event;`;
    // init() is the same async function the DOMContentLoaded listener calls.
    eval(pre + fs.readFileSync(path.join(__dirname, "public", "js", "script.js"), "utf-8") + "\n;init();");
  } catch (e) {
    console.error("THREW: " + (e.stack || e.message));
  }

  // Wait for the async init() to fetch data and render the product grid.
  const deadline = Date.now() + 15000;
  let ok = false;
  while (Date.now() < deadline) {
    const grid = global.document.getElementById("productsGrid");
    if (grid && grid.innerHTML.trim().length > 0) { ok = true; break; }
    await new Promise(r => setTimeout(r, 300));
  }

  // End-to-end order flow: replicate the exact checkout() payload.
  const orderRes = await NATIVE_FETCH(ORIGIN + "/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      items: [{ id: 2, qty: 2 }, { id: 10, qty: 1 }],
      customer: { name: "SmokeTest User", email: "smoke@shopverse.dev" }
    })
  });
  const orderJson = await orderRes.json();
  const orderInfo = "http=" + orderRes.status +
    " id=" + (orderJson.order ? orderJson.order.id : "?") +
    " total=" + (orderJson.order ? orderJson.order.total : "?") +
    " items=" + (orderJson.order ? orderJson.order.items.length : 0);

  console.log = origLog; console.error = origErr;
  console.log("RESULT ok=" + ok);
  console.log("count=" + global.document.getElementById("productCountInfo").textContent);
  console.log("shops=" + (global.document.getElementById("shopsGrid").innerHTML.length > 0));
  console.log("cats=" + (global.document.getElementById("categoriesGrid").innerHTML.length > 0));
  console.log("offers=" + (global.document.getElementById("offersGrid").innerHTML.length > 0));
  console.log("fav=" + global.document.getElementById("favCountNav").textContent);
  console.log("filterOptions=" + global.document.getElementById("filterCategory").innerHTML.replace(/\s+/g, " ").trim());
  console.log("order " + orderInfo);
  console.log("--- app logs ---");
  logs.forEach(l => console.log(l));

  const orderOk = orderRes.status === 201;
  process.exit((ok && orderOk) ? 0 : 1);
})().catch(e => { console.error("FATAL: " + (e.stack || e.message)); process.exit(1); });