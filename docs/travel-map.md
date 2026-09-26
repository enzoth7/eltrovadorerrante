# Mapa de viajes

El mapa mantiene `react-simple-maps` y los datos geográficos locales. La cámara
SVG se anima con Motion y un recorrido geográfico de D3; no se agregaron
proveedores, claves ni consultas de geocodificación.

## Contenido

- `src/lib/places.ts` sigue siendo el registro de lugares.
- `src/lib/map-places.ts` exige coordenadas WGS84 `[longitud, latitud]` para cada
  lugar mediante un tipo exhaustivo. Cabo Cocinillo usa las coordenadas
  proporcionadas por Enzo.
- La página genera los datos serializables en el servidor y toma la primera
  fotografía del orden actual de `getGalleryItems()`. La ausencia de fotografía
  genera un error explícito y la prueba de cobertura la detecta.
- No se modificaron las consultas existentes ni el esquema de Supabase.

## Interacción

La selección desde el país o la bandera encuadra sus lugares durante 650 ms.
Otra selección interrumpe el recorrido anterior. La cámara no captura gestos:
la rueda, el desplazamiento de página y el zoom del navegador siguen disponibles.

Los pines tienen objetivos de 44 px independientes de la escala del mapa. En
grupos densos se separan con líneas hacia sus coordenadas reales. La tarjeta
muestra el nombre y la primera foto; se cierra fuera, con Escape o con su botón.
La preferencia de movimiento reducido también se actualiza en vivo.

## Validación

`npm run test:map` verifica 60 lugares, 11 países, las primeras fotos, coordenadas,
encuadres, ausencia de colisiones y límites de las tarjetas en seis tamaños.
Requiere Node 22.12 o posterior para cargar D3 desde el runner CommonJS.

`npm run test:map:browser` usa Playwright y un servidor ya iniciado. Configuración:

- `PLAYWRIGHT_MODULE`: ruta al módulo Playwright si no está instalado localmente.
- `MAP_TEST_URL`: URL de `/viajes`; por defecto `http://localhost:3000/viajes`.
- `MAP_BROWSER=webkit`: usa WebKit; por defecto usa Chrome instalado.
- `MAP_SCREENSHOT_DIR`: destino de capturas; por defecto la carpeta temporal.

La prueba recorre los 60 pines en 375, 768 y 1440 px, carga sus fotografías,
comprueba tarjetas, teclado, cambios rápidos, regreso al mundo y movimiento
reducido. WebKit móvil no expone rueda en Playwright; esa comprobación se realiza
en escritorio y en Chrome. Estas pruebas no sustituyen la revisión en teléfonos
físicos ni una prueba manual con lector de pantalla.
