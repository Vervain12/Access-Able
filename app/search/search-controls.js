import { useState, useEffect } from "react";
import Slider from "@mui/material/Slider";

export default function SearchControls({
  setResults,
  setLatitude,
  setLongitude,
  initialQuery,
  setLoading,
}) {

  const stored = sessionStorage.getItem("query");
  const [query, setQuery] = useState(stored || "");

  const [distance, setDistance] = useState(() => {
    const stored = sessionStorage.getItem("distance");
    return stored ? parseFloat(stored) : 10; // default to 10km if none saved
  });

  useEffect(() => {
  sessionStorage.setItem("distance", distance.toString());
}, [distance]);


  // Transfers query from list to map or map to list
  useEffect(
    (e) => {
      setQuery(initialQuery);
      handleSearch(e, initialQuery, distance, setResults, setLatitude, setLongitude);
    },
    [initialQuery]
  );

  // Clears stored variables (clear button)
  function clearStorage() {
    setQuery("");
    setResults([]);

    sessionStorage.clear();
  }

  // Function for getting distance to a location. Might slow down the query, but necessary for sorting results by distance
  function haversineDistance(lat1, lon1, lat2, lon2) {
    const toRad = (x) => (x * Math.PI) / 180;
    const R = 6371; // Radius of Earth in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Handles keydown events for pressing enter to search
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch(e, query, distance, setResults, setLatitude, setLongitude);
    }
  };

  async function handleSearch(
    e,
    query,
    distance,
    setResults,
    setLatitude,
    setLongitude
  ) {
    setResults([]);

    setLoading(true);

    if (query === "") {
      query = "restaurant";
    }

    // Get location for bounding box and query
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setLatitude(lat);
        setLongitude(lon);
        const response = await fetch("/api/overpass/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            q: query,
            distance: distance,
            userLat: lat,
            userLon: lon,
          }),
        });

        const queryResults = await response.json();

        // Remove duplicate locations
        const deduplicated = new Map();
        queryResults.elements.forEach((location) => {
          deduplicated.set(location.id, location);
        });
        const finalResults = Array.from(deduplicated.values());

        finalResults.forEach((location) => {
          location.distance = haversineDistance(
            lat,
            lon,
            location.lat,
            location.lon
          );
        });
        finalResults.sort((a, b) => a.distance - b.distance);

        setResults(finalResults);

        sessionStorage.setItem("query", query);
        sessionStorage.setItem("results", JSON.stringify(finalResults));
        setLoading(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        setLoading(false);
      }
    );
  }
  return (
    <div>
      <div onKeyDown={handleKeyDown}>
        <input
          style={{
            width: "90%",
            height: 40,
            marginBottom: 16,
            borderRadius: 8,
            border: "1px solid #ddd",
            padding: 8,
            color: "black",
            marginLeft: 10,
          }}
          placeholder="Enter query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div
          style={{
            width: 300,
            justifyContent: "space-evenly",
            display: "flex",
            gap: 10,
          }}
        >
          <button
            onClick={(e) =>
              handleSearch(
                e,
                query,
                distance,
                setResults,
                setLatitude,
                setLongitude
              )
            }
            style={{
              background: "#3498db",
              color: "white",
              padding: 12,
              borderRadius: 8,
              border: "none",
              fontWeight: "bold",
            }}
          >
            Search
          </button>

          <button
            onClick={(e) => clearStorage()}
            style={{
              background: "#3498db",
              color: "white",
              padding: 12,
              borderRadius: 8,
              border: "none",
              fontWeight: "bold",
            }}
          >
            Clear
          </button>
        </div>

        <Slider
          aria-label="Distance"
          value={distance}
          defaultValue={10}
          step={0.5}
          min={0.5}
          max={20}
          onChange={(e) => setDistance(e.target.value)}

          // Uncomment the following lines if you want to display the value label
          // valueLabelFormat={(distance) => distance.toFixed(1) + " km"}
          // valueLabelDisplay="auto"
        >
          Search Radius
        </Slider>
        <span style={{ color: "black" }}>
          <p>Search Radius</p>
        </span>
        <span style={{ color: "black" }}>
          <p>{distance.toFixed(1) + " km"}</p>
        </span>
      </div>
    </div>
  );
}
