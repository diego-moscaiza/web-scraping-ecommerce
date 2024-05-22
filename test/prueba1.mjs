import { chromium } from "playwright";

// usamos headless para que no se abra el navegador
const browser = await chromium.launch({ headless: true });
// creamos una nueva página
const page = await browser.newPage();
// vamos a la página que nos interesa
await page.goto("https://github.com/trending/javascript");
// obtener todos los elementos con la clase 'Box-row'
const repos = await page.$$eval(".Box-row", (rows) =>
  rows.map((row) => {
    const title = row.querySelector("h2").innerText.trim();
    const link = row.querySelector("h2 a").getAttribute("href");
    const stars = row.querySelector(".Link--muted").innerText.trim();
    const built = row.querySelector(".avatar").getAttribute("alt");

    return { title, stars, built, link };
  })
);

console.log(repos);
await browser.close();
