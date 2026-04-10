const fs = require('fs');
const path = require('path');

const mockFilePath = path.join(__dirname, '../sealive-app/src/components/map/mockVessels.json');
const rawData = fs.readFileSync(mockFilePath, 'utf8');
const data = JSON.parse(rawData);

const labuanBajoLat = -8.48;
const labuanBajoLon = 119.87;

const pulauSeribuLat = -5.75;
const pulauSeribuLon = 106.60;

// There are 5 Luxury Cruise Ships. We will put 3 in Labuan Bajo, 2 in Pulau Seribu
let lfCount = 0;

data.features.forEach(feature => {
  if (feature.properties.type === 'Luxury Cruise Ship') {
    lfCount++;
    const isLabuanBajo = lfCount <= 3;
    const baseLat = isLabuanBajo ? labuanBajoLat : pulauSeribuLat;
    const baseLon = isLabuanBajo ? labuanBajoLon : pulauSeribuLon;
    
    // add small random offset
    const latShift = (Math.random() - 0.5) * 0.1;
    const lonShift = (Math.random() - 0.5) * 0.1;

    feature.geometry.coordinates[0] = baseLon + lonShift;
    feature.geometry.coordinates[1] = baseLat + latShift;
    
    // adjust track to be relative to the new base position
    if (feature.properties.track) {
      // Find the center of the old track to translate the entire track uniformly 
      if (feature.properties.track.length > 0) {
        const oldBaseLon = feature.properties.track[0].coord[0];
        const oldBaseLat = feature.properties.track[0].coord[1];
        feature.properties.track.forEach(point => {
           const offsetLon = point.coord[0] - oldBaseLon;
           const offsetLat = point.coord[1] - oldBaseLat;
           // keep the movement exactly the same, but centered on the new location
           point.coord[0] = baseLon + lonShift + offsetLon;
           point.coord[1] = baseLat + latShift + offsetLat;
        });
      }
    }
  }
});

fs.writeFileSync(mockFilePath, JSON.stringify(data, null, 2), 'utf8');
console.log('Moved Luxury Cruise Ships to Labuan Bajo and Pulau Seribu successfully.');
