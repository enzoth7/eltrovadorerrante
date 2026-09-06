<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:trovador-brand-guidelines -->

# El Trovador Errante — lineamientos de marca y edición

Estos lineamientos son la fuente de verdad visual y editorial del proyecto.

## Identidad

- La web es un blog personal, un archivo cultural y un retrato de Enzo.
- La experiencia debe sentirse como un *coffee table book* y un museo contemporáneo: imágenes grandes, ritmo editorial, aire y jerarquía clara.
- Priorizar la simplicidad. Cada elemento debe tener una razón para estar.
- La fotografía puede conservar sus colores naturales; la interfaz no agrega colores decorativos.
- La atmósfera buscada es calma, prestigio y criterio: editorial de alta gama, lujo silencioso y Mediterráneo sin ostentación.
- Evitar clichés visuales de “old money”; el carácter debe surgir de la composición, el aire, la tipografía, el archivo y la fotografía real.

## Paleta

- Azul: `#0F172A`.
- Blanco: `#FFFFFF`.
- Negro: `#000000`.
- No usar otros colores en la interfaz hasta que Enzo lo indique.

## Tipografía

- Portada y títulos de sección: Familjen Grotesk 700, mayúsculas.
- Navegación y fechas: Familjen Grotesk 600.
- Textos breves y de interfaz: Familjen Grotesk 400.
- Artículos: Source Serif 4, peso 400.
- Citas: Source Serif 4 Italic, peso 400.

## Contenido y navegación

- No presentar una sección de videos completos. El audiovisual breve se publica como reels en redes y el audio se concentra en Spotify.
- La web aloja escritos, reflexiones, fotografías y selecciones culturales.
- Las redes sociales son puertas hacia el contenido externo y viven principalmente en el footer.
- No incluir Wattpad ni Substack salvo indicación explícita.
- Evitar bloques genéricos, exceso de etiquetas y texto de relleno.
- No usar flechas como adorno o indicador en enlaces, botones, llamadas a la acción ni navegación. Están prohibidos símbolos como `→`, `↗`, `←` y equivalentes; la acción debe entenderse por el texto y el diseño.
- La navegación principal es: Inicio, Escritos, Lugares, Podcast y Sobre mí.
- “Imágenes” no es una sección principal: la fotografía acompaña escritos y crea atmósfera, pero no compite con el contenido editorial.
- “Podcast” dirige la escucha a Spotify. Por ahora no hay videos completos propios; el contenido audiovisual breve vive como reels en redes.
- “Lugares” narra las geografías que formaron a Enzo, con foco en los lugares vividos y no en acumular destinos.

## Privacidad y publicación

- Todo el sitio debe asumirse público e indexable.
- Sólo publicar información biográfica con valor editorial claro: origen, lugares vividos, intereses culturales, trayectoria general y mirada personal.
- No publicar fechas de nacimiento completas, domicilios, identificaciones, información médica o financiera, trámites, documentos, relaciones privadas, nombres de familiares ni contenidos de diarios personales.
- Al consultar archivos personales, usar únicamente los hechos necesarios y reformularlos con sobriedad. Ante cualquier duda, excluir el dato.

## Recursos

- Logos de marca: `public/brand/`.
- Íconos de redes: `public/icons/`.
- Fotografías seleccionadas: `public/images/<Ciudad>/`.
- Las fotos de VSCO deben guardarse localmente, dentro de la carpeta de la ciudad correspondiente, con nombres descriptivos; no usar enlaces directos de VSCO en producción.
- El archivo visual del inicio y la galería leen `public/images/` de forma recursiva. Una foto nueva se incorpora en la siguiente compilación; las copias idénticas se muestran una sola vez.
- El carrusel de Lugares vincula una foto con su ciudad por el nombre de la carpeta. Si una ciudad todavía no tiene imágenes, se mantiene como tarjeta tipográfica.

## SEO y publicación

- El título principal del sitio es `El Trovador Errante | Enzo Thome`.
- Mantener `robots.ts`, `sitemap.ts`, datos estructurados, URL canónica, Open Graph y Twitter Cards funcionando al agregar rutas o escritos.
- El favicon y los íconos de aplicación usan `public/brand/logotransp.png`.
- La URL pública canónica se configura con `NEXT_PUBLIC_SITE_URL`; en Vercel puede derivarse de las variables automáticas de producción.
- No usar elementos decorativos detrás del título principal del hero. El fondo blanco debe permanecer limpio.

## Footer

- Fondo azul `#0F172A`, contenido blanco.
- Logo blanco grande a la izquierda.
- Redes con íconos en el centro.
- Contacto a la derecha.
- Línea horizontal y copyright centrado al pie.

<!-- END:trovador-brand-guidelines -->
