import { chromium } from "playwright";

// usamos headless para que no se abra el navegador
const browser = await chromium.launch({ headless: false });
// creamos una nueva página
const page = await browser.newPage();
// vamos a la página que nos interesa
await page.goto(
  "https://simple.ripley.com.pe/calzado/zapatillas/urbanas?s=mdco&page=1"
);

// Establecer un tiempo de espera entre cada scroll
const scrollDelay = 500; // 500ms

// Obtener la altura total de la página
const pageHeight = await page.evaluate(() => document.body.scrollHeight);

// Inicializar la posición del scroll
let scrollPosition = 0;

// Bucle para hacer que el scroll se vaya hacia abajo de manera gradual
while (scrollPosition < pageHeight) {
  // Scroll hacia abajo
  await page.evaluate((scrollPosition) => {
    window.scrollTo(0, scrollPosition);
  }, scrollPosition);

  // Esperar un tiempo antes de seguir scrolleando
  await page.waitForTimeout(scrollDelay);

  // Incrementar la posición del scroll
  scrollPosition += 500; // incrementar en 500px cada vez
}

// obtener todos los elementos con la clase = ''
const prendas = await page.$$eval("#product-border .catalog-product-item", (products) =>
  products.map((product) => {
    const imagen = product.querySelector(
      ".proportional-image-wrapper .images-preview .images-preview-item img"
    );
    let src = '';
    if (imagen && imagen.src) {
      src = imagen.src;
    }

    const nombre = product
      .querySelector(".catalog-product-details .catalog-product-details__name")
      .innerText.trim();
    const marca = product
      .querySelector(
        ".catalog-product-details .catalog-product-details__logo-container .brand-logo span"
      )
      .innerText.trim();
    const precio = product
      .querySelector(
        ".catalog-product-details .catalog-product-details__prices .catalog-prices .catalog-prices__list .catalog-prices__offer-price"
      )
      .innerText.trim();
    return { nombre, marca, precio, src };
  })
);

console.log(prendas);
await browser.close();
