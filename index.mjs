import { chromium } from "playwright";

// usamos headless para que no se abra el navegador
const browser = await chromium.launch({ headless: false });
// creamos una nueva página
const page = await browser.newPage();
// vamos a la página que nos interesa
await page.goto("https://simple.ripley.com.pe/calzado/zapatillas/urbanas?s=mdco");

// obtener todos los elementos con la clase = ''
const prendas = await page.$$eval(".catalog-product-details", (products) =>
  products.map((product) => {
    const title = product.querySelector(".catalog-product-details__name").innerText.trim();

    return { title };
  })
);

console.log(prendas);
await browser.close();
