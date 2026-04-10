const fs = require('fs');

const types = ['Cargo', 'Tanker', 'Fishing', 'Passenger', 'Tug'];
const flags = ['🇵🇦', '🇱🇷', '🇭🇰', '🇸🇬', '🇯🇵', '🇲🇭', '🇮🇩', '🇳🇴', '🇨🇳', '🇬🇷', '🇻🇳', '🇹🇭', '🇲🇾', '🇵🇭', '🇰🇷', '🇦🇺', '🇮🇳'];
const namesPrefix = ['OCEAN', 'PACIFIC', 'SEA', 'MSC', 'MAERSK', 'CMA CGM', 'EVER', 'GOLDEN', 'JADE', 'SWIFT', 'NORTHERN', 'MYSTIC', 'CORAL', 'BLUE', 'RED'];
const namesSuffix = ['GRACE', 'DAWN', 'STAR', 'WAVE', 'HAWK', 'HORIZON', 'FORTUNE', 'EAGLE', 'SPIRIT', 'VOYAGER', 'PIONEER', 'MARINER', 'EXPRESS'];

const ports = {
  colombo: { coord: [79.84, 6.94], name: "Colombo" },
  belawan: { coord: [98.69, 3.78], name: "Belawan" },
  klang: { coord: [101.36, 3.00], name: "Port Klang" },
  singapore: { coord: [103.75, 1.25], name: "Singapore" },
  priok: { coord: [106.88, -6.10], name: "Tanjung Priok" },
  perak: { coord: [112.73, -7.19], name: "Tanjung Perak" },
  makassar: { coord: [119.41, -5.13], name: "Makassar" },
  darwin: { coord: [130.84, -12.46], name: "Darwin" },
  manila: { coord: [120.96, 14.58], name: "Manila" },
  laem_chabang: { coord: [100.88, 13.08], name: "Laem Chabang" },
  ho_chi_minh: { coord: [106.75, 10.76], name: "Ho Chi Minh" },
  hong_kong: { coord: [114.12, 22.33], name: "Hong Kong" },
  busan: { coord: [129.04, 35.10], name: "Busan" },
  yokohama: { coord: [139.65, 35.45], name: "Yokohama" },
  davao: { coord: [125.65, 7.12], name: "Davao" },
  brisbane: { coord: [153.17, -27.38], name: "Brisbane" },
  kaohsiung: { coord: [120.26, 22.56], name: "Kaohsiung" },
  bajo: { coord: [119.88, -8.49], name: "Labuan Bajo" },
  bali: { coord: [115.21, -8.74], name: "Bali Benoa" },
  ketapang: { coord: [114.40, -8.14], name: "Ketapang" },
  lampung: { coord: [105.76, -5.87], name: "Bakauheni (Lampung)" },
  seribu: { coord: [106.65, -5.75], name: "Pulau Seribu" },
  singapore: { coord: [103.75, 1.25], name: "Singapore" },
  priok: { coord: [106.88, -6.10], name: "Tanjung Priok" },
  perak: { coord: [112.73, -7.19], name: "Tanjung Perak" },
  belawan: { coord: [98.69, 3.78], name: "Belawan" },
  makassar: { coord: [119.41, -5.13], name: "Makassar" },
  ambon: { coord: [128.19, -3.70], name: "Ambon" },
  sorong: { coord: [131.25, -0.88], name: "Sorong" },
  darwin: { coord: [130.84, -12.46], name: "Darwin" },
  // Waypoints for sea routes to avoid clipping islands
  wp_java_sea: { coord: [109.5, -5.5], name: "Java Sea Lane" },
  wp_sunda_strait: { coord: [105.8, -6.0], name: "Sunda Strait" },
  wp_bali_strait: { coord: [114.5, -8.5], name: "Bali Strait" },
  wp_karimata: { coord: [107.0, -2.5], name: "Karimata Strait" },
  wp_makassar_strait: { coord: [118.5, -2.0], name: "Makassar Strait" },
};

const routes = [
  // West - Central Corridor
  [ports.belawan, ports.singapore, 15], [ports.singapore, ports.wp_karimata, 15], [ports.wp_karimata, ports.priok, 15],
  [ports.priok, ports.wp_sunda_strait, 10], [ports.wp_sunda_strait, ports.lampung, 10],
  [ports.priok, ports.wp_java_sea, 15], [ports.wp_java_sea, ports.perak, 15],
  [ports.perak, ports.ketapang, 10], [ports.ketapang, ports.bali, 10],
  [ports.bali, ports.wp_bali_strait, 5], [ports.wp_bali_strait, ports.bajo, 10],
  // Central - East Corridor
  [ports.perak, ports.wp_makassar_strait, 15], [ports.wp_makassar_strait, ports.makassar, 15],
  [ports.makassar, ports.ambon, 15], [ports.ambon, ports.sorong, 15],
  [ports.bajo, ports.darwin, 10],
  // Inter-island
  [ports.singapore, ports.bajo, 10],
  [ports.priok, ports.seribu, 10]
];

const TOTAL_VESSELS = 200;
const RANDOM_VESSELS = 80;
const ROUTED_VESSELS = TOTAL_VESSELS - RANDOM_VESSELS;

const features = [];
let vesselId = 1;

function randomElement(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function gaussian() { let r = 0; for(let i=0; i<4; i++) r += Math.random(); return (r - 2) / 2; }
function randomInRange(min, max) { return Math.random() * (max - min) + min; }

function generatePastTrack(currLng, currLat, originLng, originLat, length) {
  const track = []; 
  const now = new Date();
  
  // Format to YYYY-MM-DD HH:MM:SS UTC+7
  const formatTime = (d) => {
    const dUtc7 = new Date(d.getTime() + 7 * 3600 * 1000);
    const pad = (n) => n.toString().padStart(2, '0');
    return dUtc7.getUTCFullYear() + '-' + pad(dUtc7.getUTCMonth()+1) + '-' + pad(dUtc7.getUTCDate()) + '\n' + pad(dUtc7.getUTCHours()) + ':' + pad(dUtc7.getUTCMinutes()) + ':' + pad(dUtc7.getUTCSeconds()) + ' UTC+7';
  };

  track.push({ coord: [currLng, currLat], timestamp: formatTime(now) });
  
  for(let i=1; i<=length; i++) {
     const traceFraction = i * (0.01 + Math.random()*0.02);
     let bx = currLng - (currLng - originLng) * traceFraction;
     let by = currLat - (currLat - originLat) * traceFraction;
     bx += gaussian() * 0.05; by += gaussian() * 0.05;
     
     // Go back 2-6 hours for each point
     const msAgo = (i * 12 * 3600 * 1000) + Math.random() * 3600 * 1000;
     const trackTime = new Date(now.getTime() - msAgo);
     
     track.push({ coord: [parseFloat(bx.toFixed(5)), parseFloat(by.toFixed(5))], timestamp: formatTime(trackTime) });
  }
  return track.reverse(); 
}

function generateHistoryLog(originName, destName, isAnchored, fraction) {
   const log = []; const now = new Date();
   log.push({ timestamp: new Date(now.getTime() - (86400000 * 3)).toISOString().split('T')[0] + ' 08:30:00', location: originName, status: 'DEPARTED' });
   if (fraction > 0.3) {
      log.push({ timestamp: new Date(now.getTime() - (86400000 * 2)).toISOString().split('T')[0] + ' 14:15:00', location: 'High Seas Checkpoint', status: 'UNDERWAY' });
   }
   if (fraction > 0.7) {
      log.push({ timestamp: new Date(now.getTime() - (86400000 * 1)).toISOString().split('T')[0] + ' 09:45:00', location: destName + ' Approach', status: 'UNDERWAY' });
   }
   if (isAnchored && fraction > 0.9) {
      log.push({ timestamp: new Date(now.getTime() - 3600000).toISOString().split('T')[0] + ' 18:00:00', location: destName + ' Anchorage', status: 'MOORED' });
   }
   return log.reverse();
}

function generateShipObj(lng, lat, isAnchored, forcedHeading=null, origin=null, destination=null, originCoord=null, fraction=0) {
  const typeRng = Math.random();
  let type = 'Cargo';
  if(typeRng > 0.5) type = 'Tanker';
  if(typeRng > 0.8) type = 'Passenger';
  if(typeRng > 0.9) type = 'Fishing';

  const status = isAnchored ? 'Anchored' : 'Underway';
  const speed = isAnchored ? (Math.random()*0.5).toFixed(1) : (Math.random()*15 + 5).toFixed(1);
  const heading = forcedHeading !== null ? forcedHeading : Math.floor(Math.random() * 360);
  
  const destName = destination ? destination.name : "High Seas";
  const orgName = origin ? origin.name : "Unknown Port";
  const orgCoord = originCoord ? originCoord : [lng + gaussian(), lat + gaussian()];

  // Generate 60 points of tracking history (approximately 30 days at 12-hour intervals)
  const track = generatePastTrack(lng, lat, orgCoord[0], orgCoord[1], 60);
  const log = generateHistoryLog(orgName, destName, isAnchored, fraction);
  
  const minutesAgo = Math.floor(Math.random() * 30 + 1);
  const dateUtc = new Date(Date.now() - (minutesAgo * 60000));
  
  // Create a precise format like: 2026-04-09 03:15:22 UTC
  const pad = (n) => n.toString().padStart(2, '0');
  const utcStr = dateUtc.getUTCFullYear() + '-' + pad(dateUtc.getUTCMonth()+1) + '-' + pad(dateUtc.getUTCDate()) + ' ' + pad(dateUtc.getUTCHours()) + ':' + pad(dateUtc.getUTCMinutes()) + ':' + pad(dateUtc.getUTCSeconds()) + ' UTC';

  return {
    type: 'Feature',
    properties: {
      id: 'V' + String(vesselId++).padStart(3, '0'),
      name: 'MV ' + randomElement(namesPrefix) + ' ' + Math.floor(Math.random()*999), 
      flag: randomElement(flags),
      type: type,
      status: status,
      speed: parseFloat(speed),
      heading: Math.floor(heading),
      mmsi: String(Math.floor(Math.random() * 899999999 + 100000000)),
      imo: String(Math.floor(Math.random() * 8999999 + 1000000)),
      lastUpdate: minutesAgo + ' min ago',
      lastUpdateUtc: utcStr,     // Explicit UTC log
      signalQuality: (Math.random() * 20 + 80).toFixed(1) + '%', // Addition real-world context
      origin: orgName,
      destination: destName,
      eta: new Date(new Date().getTime() + (86400000 * Math.random() * 5)).toISOString().split('T')[0],
      track: track, 
      historyLog: JSON.stringify(log) 
    },
    geometry: {
      type: 'Point',
      coordinates: [parseFloat(lng.toFixed(4)), parseFloat(lat.toFixed(4))]
    }
  };
}

for (let i = 0; i < ROUTED_VESSELS; i++) {
  const totalWeight = routes.reduce((acc, curr) => acc + curr[2], 0);
  let rnd = Math.random() * totalWeight;
  let selectedRoute = routes[0];
  for (const route of routes) {
    if (rnd < route[2]) { selectedRoute = route; break; }
    rnd -= route[2];
  }
  
  let portA = selectedRoute[0];
  let portB = selectedRoute[1];
  if(Math.random()>0.5) { portA = selectedRoute[1]; portB = selectedRoute[0]; }

  const fraction = Math.random();
  const baseLng = portA.coord[0] + (portB.coord[0] - portA.coord[0]) * fraction;
  const baseLat = portA.coord[1] + (portB.coord[1] - portA.coord[1]) * fraction;
  const angleRad = Math.atan2(portB.coord[1] - portA.coord[1], portB.coord[0] - portA.coord[0]);
  let heading = 90 - (angleRad * 180 / Math.PI);
  if (heading < 0) heading += 360;

  const dist = Math.sqrt(Math.pow(portB.coord[0]-portA.coord[0],2) + Math.pow(portB.coord[1]-portA.coord[1],2));
  const laneSpread = Math.min(1.0, dist * 0.05); 
  const orthoRad = angleRad + (Math.PI / 2);
  const spreadOffset = gaussian() * laneSpread;
  const lng = baseLng + Math.cos(orthoRad) * spreadOffset;
  const lat = baseLat + Math.sin(orthoRad) * spreadOffset;

  const isAnchored = (fraction < 0.05 || fraction > 0.95);
  features.push(generateShipObj(lng, lat, isAnchored, heading, portA, portB, portA.coord, fraction));
}

// Define approximate ocean zones (Broad Indonesian distribution)
const oceanBoxes = [
  {minLng: 107, maxLng: 114, minLat: -6, maxLat: -4},     // Java Sea
  {minLng: 115, maxLng: 125, minLat: -8.5, maxLat: -5},   // Bali - Banda Sea
  {minLng: 100, maxLng: 105, minLat: -5, maxLat: 2},      // West Sumatra / Malacca
  {minLng: 118, maxLng: 125, minLat: 0, maxLat: 5},       // Celebes Sea
  {minLng: 130, maxLng: 140, minLat: -8, maxLat: -2},     // Arafura Sea / Papua
  {minLng: 105, maxLng: 110, minLat: 2, maxLat: 6},       // Natuna Sea
];

for (let i = 0; i < RANDOM_VESSELS; i++) {
  const box = randomElement(oceanBoxes);
  const lng = randomInRange(box.minLng, box.maxLng);
  const lat = randomInRange(box.minLat, box.maxLat);
  const ship = generateShipObj(lng, lat, Math.random() > 0.8, null, null, null, [lng-2, lat-2], 0.5);
  if (Math.random() > 0.3) { // 70% of random ships are fishing
     ship.properties.type = 'Fishing';
     ship.properties.speed = parseFloat((Math.random() * 8 + 2).toFixed(1)); 
  }
  features.push(ship);
}

// INJECT SPECIAL VESSELS: Singapore to Labuan Bajo Priority
for (let i = 0; i < 5; i++) {
  const fraction = (i + 1) / 6; 
  const pA = ports.singapore;
  const pB = ports.bajo;
  const lng = pA.coord[0] + (pB.coord[0] - pA.coord[0]) * fraction + gaussian() * 0.1;
  const lat = pA.coord[1] + (pB.coord[1] - pA.coord[1]) * fraction + gaussian() * 0.1;
  const angleRad = Math.atan2(pB.coord[1] - pA.coord[1], pB.coord[0] - pA.coord[0]);
  let heading = 90 - (angleRad * 180 / Math.PI);
  if (heading < 0) heading += 360;

  const ship = generateShipObj(lng, lat, false, heading, pA, pB, pA.coord, fraction);
  ship.properties.name = 'MV CROSS-ARCH ' + (i + 1);
  ship.properties.type = 'Cargo';
  features.push(ship);
}
// INJECT SHIP-TO-SHIP TRANSFER ANOMALY IN JAVA SEA
const stsLat = -5.45;
const stsLng = 111.20;

// Ship 1: The primary vessel
const ship1 = generateShipObj(stsLng, stsLat, false, 85, ports.priok, ports.perak, ports.priok.coord, 0.5);
ship1.properties.name = 'MV SHADOW TANKER';
ship1.properties.id = 'STS-01';
ship1.properties.type = 'Tanker';
features.push(ship1);

// Ship 2: Copy properties and past trace from ship 1, but with a slight geographical offset
const ship2 = generateShipObj(stsLng + 0.003, stsLat + 0.001, false, 85, ports.priok, ports.perak, ports.priok.coord, 0.5);
ship2.properties.name = 'MV UNKNOWN CARGO';
ship2.properties.id = 'STS-02';
ship2.properties.type = 'Cargo';

// Clone and offset the past track so they look like they've been sailing perfectly side-by-side
ship2.properties.track = ship1.properties.track.map(pt => ({
  coord: [parseFloat((pt.coord[0] + 0.003).toFixed(5)), parseFloat((pt.coord[1] + 0.001).toFixed(5))],
  timestamp: pt.timestamp
}));

features.push(ship2);

// INJECT MISSING YACHT ANOMALY
const yLat = -8.1;
const yLng = 117.5; // Somewhere north of Sumbawa, moving from Bali to Labuan Bajo
const yacht = generateShipObj(yLng, yLat, false, 95, ports.bali, ports.bajo, ports.bali.coord, 0.4);
yacht.properties.name = 'SY OCEAN SPIRIT';
yacht.properties.id = 'MISS-01';
yacht.properties.type = 'Passenger'; 
yacht.properties.speed = 0; // Stopped
yacht.properties.status = 'Signal Lost';
yacht.properties.signalQuality = '0%';
yacht.properties.lastUpdate = '48 hours ago';
yacht.properties.historyLog = JSON.stringify([
  { timestamp: new Date(Date.now() - (86400000 * 3)).toISOString().split('T')[0] + ' 06:15:00', location: 'Benoa Port', status: 'DEPARTED' },
  { timestamp: new Date(Date.now() - (86400000 * 2)).toISOString().split('T')[0] + ' 13:40:00', location: 'Bali Sea', status: 'UNDERWAY' },
  { timestamp: new Date(Date.now() - (86400000 * 2)).toISOString().split('T')[0] + ' 17:55:00', location: 'North Sumbawa', status: 'SIGNAL LOST' }
]);
features.push(yacht);

const geojson = { type: 'FeatureCollection', features: features };
fs.writeFileSync('sealive-app/src/components/map/mockVessels.json', JSON.stringify(geojson, null, 2));
console.log('Successfully injected UTC timestamps for signal tracking!');
