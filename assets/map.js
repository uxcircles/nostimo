/* Nostimo map: MapLibre + OpenFreeMap vector tiles, drawn in the site palette.
   Loaded on demand by main.js after maplibre-gl.js. */
(() => {
  const C = {
    land: '#f5f7f6',      // whitewash
    building: '#d6e7f2',  // pale Aegean, so the brand blue reads even with no water in view
    buildingLine: '#bcd5e6',
    park: '#dfe6cc',      // pale olive
    water: '#8fc3e3',     // Aegean
    road: '#ffffff',
    roadCase: '#d7e1e7',
    major: '#ffffff',
    majorCase: '#bfd0da',
    path: '#c3d3dc',
    rail: '#b7c6cf',
    label: '#3d5259',
    labelSoft: '#6f8489',
    halo: '#f5f7f6',
  };

  const name = ['coalesce', ['get', 'name:en'], ['get', 'name_en'], ['get', 'name']];
  // road width by zoom: [z14, z16, z18]
  const width = (a, b, c) => ['interpolate', ['exponential', 1.6], ['zoom'], 14, a, 16, b, 18, c];
  const major = ['match', ['get', 'class'], ['motorway', 'trunk', 'primary', 'secondary'], true, false];
  const minor = ['match', ['get', 'class'], ['tertiary', 'minor', 'service', 'street', 'residential'], true, false];

  const style = {
    version: 8,
    glyphs: 'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf',
    sources: {
      omt: { type: 'vector', url: 'https://tiles.openfreemap.org/planet' },
    },
    layers: [
      { id: 'land', type: 'background', paint: { 'background-color': C.land } },
      { id: 'park', type: 'fill', source: 'omt', 'source-layer': 'park', paint: { 'fill-color': C.park } },
      {
        id: 'green', type: 'fill', source: 'omt', 'source-layer': 'landcover',
        filter: ['match', ['get', 'class'], ['grass', 'wood', 'farmland'], true, false],
        paint: { 'fill-color': C.park },
      },
      {
        id: 'green-landuse', type: 'fill', source: 'omt', 'source-layer': 'landuse',
        filter: ['match', ['get', 'class'], ['park', 'grass', 'cemetery', 'pitch', 'playground'], true, false],
        paint: { 'fill-color': C.park },
      },
      { id: 'water', type: 'fill', source: 'omt', 'source-layer': 'water', paint: { 'fill-color': C.water } },
      {
        id: 'waterway', type: 'line', source: 'omt', 'source-layer': 'waterway',
        paint: { 'line-color': C.water, 'line-width': ['interpolate', ['linear'], ['zoom'], 13, 1, 18, 6] },
      },
      {
        id: 'building', type: 'fill', source: 'omt', 'source-layer': 'building', minzoom: 13,
        paint: { 'fill-color': C.building, 'fill-outline-color': C.buildingLine },
      },
      {
        id: 'path', type: 'line', source: 'omt', 'source-layer': 'transportation', minzoom: 15,
        filter: ['match', ['get', 'class'], ['path', 'track'], true, false],
        paint: { 'line-color': C.path, 'line-width': 1.2, 'line-dasharray': [2, 1.5] },
      },
      {
        id: 'rail', type: 'line', source: 'omt', 'source-layer': 'transportation',
        filter: ['match', ['get', 'class'], ['rail', 'transit'], true, false],
        paint: { 'line-color': C.rail, 'line-width': 1.4, 'line-dasharray': [3, 2] },
      },
      {
        id: 'road-case', type: 'line', source: 'omt', 'source-layer': 'transportation',
        filter: minor, layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': C.roadCase, 'line-width': width(2.5, 7, 22) },
      },
      {
        id: 'major-case', type: 'line', source: 'omt', 'source-layer': 'transportation',
        filter: major, layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': C.majorCase, 'line-width': width(4, 11, 32) },
      },
      {
        id: 'road', type: 'line', source: 'omt', 'source-layer': 'transportation',
        filter: minor, layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': C.road, 'line-width': width(1.5, 5, 18) },
      },
      {
        id: 'major', type: 'line', source: 'omt', 'source-layer': 'transportation',
        filter: major, layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': C.major, 'line-width': width(2.5, 8.5, 28) },
      },
      {
        id: 'road-label', type: 'symbol', source: 'omt', 'source-layer': 'transportation_name', minzoom: 15,
        layout: {
          'symbol-placement': 'line', 'text-field': name, 'text-font': ['Noto Sans Regular'],
          'text-size': ['interpolate', ['linear'], ['zoom'], 15, 10, 18, 13], 'text-letter-spacing': 0.03,
        },
        paint: { 'text-color': C.labelSoft, 'text-halo-color': C.halo, 'text-halo-width': 1.4 },
      },
      {
        id: 'park-label', type: 'symbol', source: 'omt', 'source-layer': 'poi', minzoom: 15,
        filter: ['match', ['get', 'class'], ['park', 'garden'], true, false],
        layout: { 'text-field': name, 'text-font': ['Noto Sans Italic'], 'text-size': 11, 'text-max-width': 8 },
        paint: { 'text-color': '#6c7448', 'text-halo-color': C.halo, 'text-halo-width': 1.2 },
      },
      {
        id: 'area-label', type: 'symbol', source: 'omt', 'source-layer': 'place',
        filter: ['match', ['get', 'class'], ['suburb', 'quarter', 'neighbourhood'], true, false],
        layout: {
          'text-field': ['upcase', name], 'text-font': ['Noto Sans Bold'], 'text-size': 11,
          'text-letter-spacing': 0.18, 'text-max-width': 8,
        },
        paint: { 'text-color': C.labelSoft, 'text-halo-color': C.halo, 'text-halo-width': 1.4 },
      },
    ],
  };

  const zh = document.documentElement.lang.startsWith('zh');
  const locale = zh ? {
    'CooperativeGesturesHandler.WindowsHelpText': '按住 Ctrl 再捲動滑鼠來縮放地圖',
    'CooperativeGesturesHandler.MacHelpText': '按住 ⌘ 再捲動來縮放地圖',
    'CooperativeGesturesHandler.MobileHelpText': '用兩指移動地圖',
    'NavigationControl.ZoomIn': '放大',
    'NavigationControl.ZoomOut': '縮小',
  } : {};

  // the "n" from the Nostimo logo
  const MARK = '<svg viewBox="0 0 23.46 19.73" aria-hidden="true"><path fill="currentColor" d="m15.7,16.3V4.8c0-2.36-1.16-3.73-3.17-3.73-.73,0-1.63.17-2.44.56C12.14.21,14.5,0,15.53,0c1.41,0,5.7.43,5.7,5.62v10.98c0,2.32,1.29,2.87,2.23,3.13h-9.65c.81-.26,1.89-.9,1.89-3.43m-12.86.13V4.46C2.83,2.74,1.67,1.24,0,1.07L8.41,0v16.64c0,2.23,1.2,2.83,2.14,3.09H.64c.94-.26,2.19-.9,2.19-3.3"/></svg>';

  const el = (html, className) => {
    const div = document.createElement('div');
    div.className = className;
    div.innerHTML = html;
    return div;
  };

  window.nostimoMap = (container) => {
    const { maplibregl } = window;
    const home = [Number(container.dataset.lng), Number(container.dataset.lat)];
    const station = [Number(container.dataset.stationLng), Number(container.dataset.stationLat)];

    const map = new maplibregl.Map({
      container,
      style,
      center: home,
      zoom: 16,
      maxZoom: 19,
      minZoom: 12,
      pitchWithRotate: false,
      dragRotate: false,
      // page scrolls normally; two fingers (or Ctrl/⌘ + wheel) move the map
      cooperativeGestures: true,
      attributionControl: { compact: true },
      locale,
    });
    map.touchZoomRotate.disableRotation();
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-left');

    new maplibregl.Marker({ element: el(`<span class="roundel"></span><span class="station-name">${container.dataset.station}</span>`, 'map-station'), anchor: 'center' })
      .setLngLat(station).addTo(map);
    new maplibregl.Marker({ element: el(`<span class="pin">${MARK}</span><span class="pin-label">Nostimo</span>`, 'map-pin'), anchor: 'bottom' })
      .setLngLat(home).addTo(map);

    // frame both the restaurant and the station
    map.fitBounds(new maplibregl.LngLatBounds(home, home).extend(station), { padding: { top: 110, bottom: 90, left: 70, right: 140 }, maxZoom: 16.4, duration: 0 });
    return map;
  };
})();
