import { chromium, firefox, webkit } from "playwright";

// usamos headless para que no se abra el navegador
const browser = await chromium.launch({ headless: false });
const browser1 = await chromium.launch({ channel: "msedge", headless: false });
const browser2 = await firefox.launch({ headless: false });
const browser3 = await webkit.launch({ headless: false });

// creamos una nueva página
const page = await browser.newPage();

// Definimos el numero de página
let numberPage = 3;

// vamos a la página que nos interesa
let pageUrl = `https://simple.ripley.com.pe/calzado/zapatillas/urbanas?s=mdco&page=${numberPage}`;

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
const selectors = {
  etiquetaPrincipal: "#product-border .catalog-product-item",
  selectorNombre: ".catalog-product-details .catalog-product-details__name",
  selectorMarca:
    ".catalog-product-details .catalog-product-details__logo-container .brand-logo span",
  selectorPrecioOferta:
    ".catalog-product-details .catalog-product-details__prices .catalog-prices__list .catalog-prices__offer-price",
  selectorPrecioNormal:
    ".catalog-product-details .catalog-product-details__prices .catalog-prices__list .catalog-prices__list-price",
  selectorImagen:
    ".proportional-image-wrapper .images-preview .images-preview-item img",
};

const prendas = await page.$$eval(
  selectors.etiquetaPrincipal,
  (products, selectors) => {
    const obtenerTexto = (cadena) => {
      return cadena ? cadena.innerText.trim() : "";
    };

    const primeraLetraMayuscula = (cadena) => {
      const cadenaObtenida = obtenerTexto(cadena).toLowerCase();
      return (
        cadenaObtenida.charAt(0).toUpperCase() +
        cadenaObtenida.slice(1).toLowerCase()
      );
    };

    const convertirPrecioADecimal = (precioCadena) => {
      if (!precioCadena) return "0.00";
      const precioCadenaStr = precioCadena.innerText.trim();
      const precioSinSimbolo = precioCadenaStr.replace(/[^0-9.]/g, "");
      const precioDecimal = parseFloat(precioSinSimbolo).toFixed(2);
      return precioDecimal;
    };

    const obtenerGenero = (nombre) => {
      const nombreObtenido = obtenerTexto(nombre);
      return nombreObtenido.toUpperCase().includes("HOMBRE")
        ? "Hombre"
        : nombreObtenido.toUpperCase().includes("MUJER")
        ? "Mujer"
        : nombreObtenido.toUpperCase().includes("NIÑO")
        ? "Niño"
        : nombreObtenido.toUpperCase().includes("NIÑA")
        ? "Niña"
        : nombreObtenido.toUpperCase().includes("UNISEX")
        ? "Unisex"
        : "";
    };

    return products.map((product) => {
      const nombreElement = product.querySelector(selectors.selectorNombre);
      const marcaElement = product.querySelector(selectors.selectorMarca);
      const precioOfertaElement = product.querySelector(
        selectors.selectorPrecioOferta
      );
      const precioNormalElement = product.querySelector(
        selectors.selectorPrecioNormal
      );
      const imagenElement = product.querySelector(selectors.selectorImagen);

      const nombre = primeraLetraMayuscula(nombreElement);
      const marca = primeraLetraMayuscula(marcaElement);
      const precio_oferta = convertirPrecioADecimal(precioOfertaElement);
      const precio_normal = convertirPrecioADecimal(precioNormalElement);
      const genero = obtenerGenero(nombreElement);
      const imagen = imagenElement ? imagenElement.src : "";

      return {
        nombre: nombre,
        marca: marca,
        precio_oferta: precio_oferta,
        precio_normal: precio_normal,
        genero: genero,
        imagen: imagen,
      };
    });
  },
  selectors
);

await browser.close();
console.log(prendas);
process.exit();
