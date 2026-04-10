const fs = require('fs');

const types = ['Cargo', 'Tanker', 'Fishing', 'Passenger', 'Tug'];
const flags = ['🇮🇩', '🇵🇦', '🇱🇷', '🇸🇬', '🇯🇵', '🇨🇳'];
const namesPrefix = ['OCEAN', 'PACIFIC', 'SEA', 'MSC', 'MAERSK', 'CMA CGM', 'EVER', 'KRI', 'KN', 'BINTANG', 'PELNI'];
const namesSuffix = ['GRACE', 'DAWN', 'STAR', 'WAVE', 'HAWK', 'HORIZON', 'FORTUNE', 'EAGLE', 'NUSANTARA', 'JAYA', 'MAKMUR'];

// 1. Ray-Casting Algorithm to check if Point [lng, lat] is inside Polygon
function pointInPolygon(point, vs) {
    let x = point[0], y = point[1];
    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        let xi = vs[i][0], yi = vs[i][1];
        let xj = vs[j][0], yj = vs[j][1];
        let intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

function pointInFeature(point, geometry) {
    if (geometry.type === 'Polygon') {
        return pointInPolygon(point, geometry.coordinates[0]);
    } else if (geometry.type === 'MultiPolygon') {
        for (let i = 0; i < geometry.coordinates.length; i++) {
            if (pointInPolygon(point, geometry.coordinates[i][0])) return true;
        }
    }
    return false;
}

console.log('Loading 45MB EEZ GeoJSON... This may take a moment.');
const eezData = JSON.parse(fs.readFileSync('sealive-app/public/data/eez_indonesia.geojson', 'utf8'));
const featuresBase = eezData.features || [eezData];

const TOTAL_VESSELS = 500;
const features = [];
let vesselId = 1;

function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

function randomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

console.log('Generating 500 vessels strictly inside the Indonesian EEZ Boundary...');

// Indonesian bounding box to speed up random generation
const minLng = 95.0, maxLng = 141.0;
const minLat = -11.0, maxLat = 6.0;

while(features.length < TOTAL_VESSELS) {
  const lng = randomInRange(minLng, maxLng);
  const lat = randomInRange(minLat, maxLat);
  
  // Check if randomly generated coordinate hits the EEZ bounds!
  let isInsideEez = false;
  for (let f of featuresBase) {
     if (f.geometry && pointInFeature([lng, lat], f.geometry)) {
         isInsideEez = true;
         break;
     }
  }

  // If outside the EEZ, try again!
  if (!isInsideEez) continue;

  const isAnchored = Math.random() > 0.8;
  const status = isAnchored ? 'Anchored' : 'Underway';
  const speed = isAnchored ? (Math.random()*0.5).toFixed(1) : (Math.random()*15 + 5).toFixed(1);
  const heading = Math.floor(Math.random() * 360);

  const typeRng = Math.random();
  let type = 'Cargo';
  if(typeRng > 0.5) type = 'Tanker';
  if(typeRng > 0.8) type = 'Passenger';
  if(typeRng > 0.9) type = 'Fishing';

  features.push({
    type: 'Feature',
    properties: {
      id: 'V' + String(vesselId++).padStart(3, '0'),
      name: randomElement(namesPrefix) + ' ' + randomElement(namesSuffix) + ' ' + Math.floor(Math.random()*99), 
      flag: randomElement(flags),
      type: type,
      status: status,
      speed: parseFloat(speed),
      heading: heading,
      mmsi: String(Math.floor(Math.random() * 899999999 + 100000000)),
      imo: String(Math.floor(Math.random() * 8999999 + 1000000)),
      lastUpdate: Math.floor(Math.random() * 30 + 1) + ' min ago'
    },
    geometry: {
      type: 'Point',
      coordinates: [parseFloat(lng.toFixed(5)), parseFloat(lat.toFixed(5))]
    }
  });
  
  if (features.length % 100 === 0) console.log('Generated ' + features.length + ' / ' + TOTAL_VESSELS);
}

const geojsonOutput = {
  type: 'FeatureCollection',
  features: features
};

fs.writeFileSync('sealive-app/src/components/map/mockVessels.json', JSON.stringify(geojsonOutput, null, 2));
console.log('Successfully generated vessels strictly confined to the EEZ bounds!');
