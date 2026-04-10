const fs = require('fs');
const path = require('path');

const mockFilePath = path.join(__dirname, '../sealive-app/src/components/map/mockVessels.json');
const rawData = fs.readFileSync(mockFilePath, 'utf8');
const data = JSON.parse(rawData);

let originalFeatures = data.features;

// keep 170 of the original vessels
originalFeatures = originalFeatures.slice(0, 170);

// Let's create the new types.
// We'll duplicate some of the remaining vessels and randomize them slightly for the new ones.
const additionalTypes = [
  { type: "Yacht", count: 15 },
  { type: "Superyacht & Megayacht", count: 10 },
  { type: "Luxury Cruise Ship", count: 5 }
];

let baseIndex = 170;
const newFeatures = [];

for (const cat of additionalTypes) {
  for (let i = 0; i < cat.count; i++) {
    // pick a random feature from the original 170 to clone its track and modify
    const sourceFeature = originalFeatures[Math.floor(Math.random() * originalFeatures.length)];
    const clone = JSON.parse(JSON.stringify(sourceFeature));
    
    // Modify the clone properties
    clone.properties.id = `VY-${baseIndex}`;
    clone.properties.name = `${cat.type.toUpperCase()}-${baseIndex + 1}`;
    clone.properties.type = cat.type;
    clone.properties.mmsi = Math.floor(100000000 + Math.random() * 900000000).toString();
    
    // Shift coordinates slightly so they aren't exactly on top
    const latShift = (Math.random() - 0.5) * 0.5;
    const lonShift = (Math.random() - 0.5) * 0.5;
    
    clone.geometry.coordinates[0] += lonShift;
    clone.geometry.coordinates[1] += latShift;
    
    if (clone.properties.track) {
      clone.properties.track.forEach(point => {
        point.coord[0] += lonShift;
        point.coord[1] += latShift;
      });
    }
    
    newFeatures.push(clone);
    baseIndex++;
  }
}

data.features = originalFeatures.concat(newFeatures);

fs.writeFileSync(mockFilePath, JSON.stringify(data, null, 2), 'utf8');

console.log(`Successfully updated. Original 170, new 30, total: ${data.features.length}`);
