const fs = require('fs');
const path = require('path');

const mockFilePath = path.join(__dirname, '../sealive-app/src/components/map/mockVessels.json');
const rawData = fs.readFileSync(mockFilePath, 'utf8');
const data = JSON.parse(rawData);

// Let's add 70 more luxury vessels
const additionalTypes = [
  { type: "Yacht", count: 30 },
  { type: "Superyacht & Megayacht", count: 20 },
  { type: "Luxury Cruise Ship", count: 20 }
];

const locations = [
  { name: 'Labuan Bajo', lat: -8.48, lon: 119.87 },
  { name: 'Pulau Seribu', lat: -5.75, lon: 106.60 },
  { name: 'Bali (Benoa)', lat: -8.75, lon: 115.22 },
  { name: 'Raja Ampat', lat: -0.55, lon: 130.30 }
];

let baseIndex = 200;
const newFeatures = [];

for (const cat of additionalTypes) {
  for (let i = 0; i < cat.count; i++) {
    // pick a random location
    const loc = locations[Math.floor(Math.random() * locations.length)];
    
    // Create feature base on a template from existing one
    const sourceFeature = data.features[Math.floor(Math.random() * data.features.length)];
    const clone = JSON.parse(JSON.stringify(sourceFeature));
    
    clone.properties.id = `VYX-${baseIndex}`;
    clone.properties.name = `${cat.type.toUpperCase()}-${baseIndex + 1}`;
    clone.properties.type = cat.type;
    clone.properties.mmsi = Math.floor(100000000 + Math.random() * 900000000).toString();
    
    // Set coordinates based on chosen location with some random scattered spread
    const latShift = (Math.random() - 0.5) * 0.4;
    const lonShift = (Math.random() - 0.5) * 0.4;
    
    const baseLon = loc.lon;
    const baseLat = loc.lat;

    // determine original root if it had track
    if (clone.properties.track && clone.properties.track.length > 0) {
      const oldBaseLon = clone.properties.track[0].coord[0];
      const oldBaseLat = clone.properties.track[0].coord[1];
      
      clone.geometry.coordinates[0] = baseLon + lonShift;
      clone.geometry.coordinates[1] = baseLat + latShift;
      
      clone.properties.track.forEach(point => {
         const offsetLon = point.coord[0] - oldBaseLon;
         const offsetLat = point.coord[1] - oldBaseLat;
         point.coord[0] = baseLon + lonShift + offsetLon;
         point.coord[1] = baseLat + latShift + offsetLat;
      });
    } else {
      clone.geometry.coordinates[0] = baseLon + lonShift;
      clone.geometry.coordinates[1] = baseLat + latShift;
    }
    
    newFeatures.push(clone);
    baseIndex++;
  }
}

data.features = data.features.concat(newFeatures);

fs.writeFileSync(mockFilePath, JSON.stringify(data, null, 2), 'utf8');

// Also output the new totals to be updated in constants
const counts = {};
data.features.forEach(f => {
  counts[f.properties.type] = (counts[f.properties.type] || 0) + 1;
});
console.log('Successfully added more luxury ships.', counts);
