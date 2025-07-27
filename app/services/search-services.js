export async function runSearch(
  query,
  distance,
  userLat,
  userLon,
  minRating = 0
) {
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

  const finalResults = Array.from(deduplicated.values());

  // Filter by rating if present
  const filteredResults = finalResults.filter((location) => {
    if (typeof location.rating === "number") {
      return location.rating >= minRating;
    }

    // If there's no rating, include it *only* when minRating is 0
    return minRating === 0;
  });

  return filteredResults;
}
