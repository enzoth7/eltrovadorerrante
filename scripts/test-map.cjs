/* eslint-disable @typescript-eslint/no-require-imports -- Node CommonJS test runner. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

// Run the actual TS helpers without adding a test runtime to the production app.
require.extensions['.ts'] = (module, filename) => {
  module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
  }).outputText, filename);
};
const { getGalleryItems } = require('../src/lib/gallery.ts');
const { createMapPlaces, PLACE_COORDINATES } = require('../src/lib/map-places.ts');
const { getAllPlaces, slugifyPlace } = require('../src/lib/places.ts');
const { fitPlaces, mapProjection, layoutPins, cardPosition, cameraInterpolator, WORLD_CAMERA } = require('../src/lib/map-layout.ts');
const gallery = getGalleryItems();
const places = createMapPlaces(gallery);
const countries = [...new Set(places.map(p => p.country))];
assert.equal(places.length, 60);
assert.equal(countries.length, 11);
assert.equal(Object.keys(PLACE_COORDINATES).length, getAllPlaces().length);
for (const place of places) {
  assert(place.coordinates.every(Number.isFinite));
  assert(Math.abs(place.coordinates[0]) <= 180 && Math.abs(place.coordinates[1]) <= 90);
  assert.equal(place.image, gallery.find(p => slugifyPlace(p.place) === slugifyPlace(place.place)).src);
  assert(fs.existsSync(path.join('public', decodeURIComponent(place.image))));
}
for (const size of [{width:320,height:520},{width:375,height:520},{width:390,height:520},{width:768,height:600},{width:644,height:650},{width:960,height:700}]) {
  const projection = mapProjection(size);
  for (const country of countries) {
    const local = places.filter(p => p.country === country);
    const camera = fitPlaces(local, projection, size);
    assert(camera.zoom >= 1 && camera.zoom <= 120);
    const pins = layoutPins(local, camera, projection, size);
    for (let i = 0; i < pins.length; i++) {
      const p = pins[i];
      assert(p.x >= 22 && p.x <= size.width - 22 && p.y >= 22 && p.y <= size.height - 22, `${country}: pin clipped`);
      for (const q of pins.slice(i + 1)) {
        assert(Math.abs(p.x - q.x) >= 44 || Math.abs(p.y - q.y) >= 44, `${country} ${size.width}: ${p.place.place} overlaps ${q.place.place}`);
      }
      for (const card of [{width:240,height:236},{width:240,height:280}]) {
        const position = cardPosition(p, size, card);
        assert(position.x >= 0 && position.x + card.width <= size.width);
        assert(position.y >= 0 && position.y + card.height <= size.height);
      }
    }
    const interpolate = cameraInterpolator(WORLD_CAMERA, camera);
    for (let t = 0; t <= 1; t += 0.1) assert(interpolate(t).center.every(Number.isFinite));
    assert.deepEqual(interpolate(1).center.map(v => Math.round(v*1000)), camera.center.map(v => Math.round(v*1000)));
  }
}
const france = fitPlaces(places.filter(p => p.country === 'Francia'), mapProjection({width:390,height:520}), {width:390,height:520});
assert(france.center[0] > 0 && france.center[0] < 10 && france.center[1] > 40 && france.center[1] < 51);
assert.deepEqual(PLACE_COORDINATES['Cabo Cocinillo'], [2.5923257382790865,39.53217015282313]);
console.log('Map verified: 60 photos/coordinates, 11 countries, 6 layouts, collision-free 44px targets, card bounds, geographic camera.');
