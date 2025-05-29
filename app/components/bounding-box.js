export default function getBoundingBox(lat, lon, distanceKm) {
  const latOffset = distanceKm / 111; // 111 km per degree latitude
  const lonOffset = distanceKm / (111 * Math.cos((lat * Math.PI) / 180)); // adjust for longitude

  const south = lat - latOffset;
  const north = lat + latOffset;
  const west = lon - lonOffset;
  const east = lon + lonOffset;

  return `${south},${west},${north},${east}`;
}

