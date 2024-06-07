import { chromium, firefox, webkit } from "playwright";

// usamos headless para que no se abra el navegador
const browser = await chromium.launch({ headless: false });
const browser1 = await chromium.launch({ channel: "msedge", headless: false });
const browser2 = await firefox.launch({ headless: false });
const browser3 = await webkit.launch({ headless: false });

// creamos una nueva página
const page = await browser.newPage();

// vamos a la página que nos interesa
let pageUrl =
  "https://simple.ripley.com.pe/calzado/zapatillas/urbanas?s=mdco&page=1";
await page.goto(pageUrl);

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

// Definimos variables con los selectores que van a ser evaluados
let etiquetaPrincipal = "#product-border .catalog-product-item";
let selectorNombre = ".catalog-product-details .catalog-product-details__name";
let selectorMarca = ".catalog-product-details .catalog-product-details__logo-container .brand-logo span";
let selectorPrecio = ".catalog-product-details .catalog-product-details__prices .catalog-prices__list .catalog-prices__offer-price";
let selectorImagen =
  ".proportional-image-wrapper .images-preview .images-preview-item img";

const prendas = await page.$$eval(
  etiquetaPrincipal,
  (products, selectors) =>
    products.map((product) => {
      const nombreElement = product.querySelector(selectors.nombre);
      const marcaElement = product.querySelector(selectors.marca);
      const precioElement = product.querySelector(selectors.precio);
      const imagenElement = product.querySelector(selectors.imagen);

      let nombre = nombreElement? nombreElement.innerText.trim() : "";
      let marca = marcaElement? marcaElement.innerText.trim() : "";
      let precio = precioElement? precioElement.innerText.trim() : "";
      let src = imagenElement? imagenElement.src : "";

      return { nombre, marca, precio, src };
    }),
  { nombre: selectorNombre, marca: selectorMarca, precio: selectorPrecio, imagen: selectorImagen }
);

console.log(prendas);
await browser.close();
