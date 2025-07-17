export async function runSearch(query, distance, userLat, userLon) {
  const response = await fetch("/api/overpass/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      q: query,
      distance,
      userLat,
      userLon,
    }),
  });

  if (!response.ok) {
    console.error("Backend error:", await response.text());
    throw new Error("Search API failed");
  }

  const queryResults = await response.json();

  // Remove duplicate locations
  const deduplicated = new Map();
  queryResults.elements.forEach((location) => {
    deduplicated.set(location.id, location);
  });

  return Array.from(deduplicated.values());
}
