/**
 * Approximate lat/lon from Cloudflare edge geolocation (visitor IP at the CDN).
 * Used only for solar-based sky bands on the client. Same-origin; no logging here.
 * Fallback: country centroid, then US interior default.
 */
const CENTROID = {
  US: [39.8283, -98.5795],
  CA: [56.1304, -106.3468],
  GB: [54.7023, -3.2766],
  IE: [53.1424, -7.6921],
  AU: [-25.2744, 133.7751],
  NZ: [-40.9006, 174.886],
  DE: [51.1657, 10.4515],
  FR: [46.2276, 2.2137],
  NL: [52.1326, 5.2913],
  BE: [50.8503, 4.3517],
  CH: [46.8182, 8.2275],
  AT: [47.5162, 14.5501],
  PL: [51.9194, 19.1451],
  SE: [60.1282, 18.6435],
  NO: [60.472, 8.4689],
  FI: [61.9241, 25.7482],
  DK: [56.2639, 9.5018],
  ES: [40.4637, -3.7492],
  PT: [39.3999, -8.2245],
  IT: [41.8719, 12.5674],
  GR: [39.0742, 21.8243],
  BR: [-14.235, -51.9253],
  MX: [23.6345, -102.5528],
  AR: [-38.4161, -63.6167],
  CL: [-35.6751, -71.543],
  CO: [4.5709, -74.2973],
  JP: [36.2048, 138.2529],
  KR: [35.9078, 127.7669],
  CN: [35.8617, 104.1954],
  IN: [20.5937, 78.9629],
  PH: [12.8797, 121.774],
  TH: [15.87, 100.9925],
  VN: [14.0583, 108.2772],
  MY: [4.2105, 101.9758],
  SG: [1.3521, 103.8198],
  ID: [-0.7893, 113.9213],
  TW: [23.6978, 120.9605],
  HK: [22.3193, 114.1694],
  ZA: [-30.5595, 22.9375],
  NG: [9.082, 8.6753],
  KE: [-0.0236, 37.9062],
  EG: [26.8206, 30.8025],
  SA: [23.8859, 45.0792],
  AE: [23.4241, 53.8478],
  IL: [31.0461, 34.8516],
  TR: [38.9637, 35.2433],
  UA: [48.3794, 31.1656],
  RU: [61.524, 105.3188],
  PK: [30.3753, 69.3451],
  BD: [23.685, 90.3563],
};

const DEFAULT_LL = [39.8283, -98.5795];

export async function onRequestGet({ request }) {
  const cf = request.cf || {};
  let lat = parseFloat(cf.latitude);
  let lon = parseFloat(cf.longitude);
  let source = 'cf-ip';
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    const code = String(cf.country || '').toUpperCase();
    const c = CENTROID[code];
    if (c) {
      lat = c[0];
      lon = c[1];
      source = 'cf-country';
    } else {
      lat = DEFAULT_LL[0];
      lon = DEFAULT_LL[1];
      source = 'default';
    }
  }
  const body = JSON.stringify({
    lat: Math.round(lat * 1000) / 1000,
    lon: Math.round(lon * 1000) / 1000,
    source,
  });
  return new Response(body, {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'private, max-age=3600',
    },
  });
}
