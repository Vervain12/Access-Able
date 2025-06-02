import { useState, useEffect } from "react";
import Slider from "@mui/material/Slider";

export default function SearchControls({
  setResults,
  setLatitude,
  setLongitude,
  initialQuery = "",
  setLoading,
}) {
  const [query, setQuery] = useState(initialQuery);
  const [distance, setDistance] = useState(1.5); // Default distance in km

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  function clearStorage() {
    setQuery("");
    setResults([]);

    sessionStorage.clear();
  }

  async function handleSearch(
    e,
    query,
    distance,
    setResults,
    setLatitude,
    setLongitude
  ) {
    e.preventDefault();
    setResults([]);

    setLoading(true);

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
        setResults(queryResults.elements);

        sessionStorage.setItem("query", query);
        sessionStorage.setItem(
          "results",
          JSON.stringify(queryResults.elements)
        );
        setLoading(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        // Fallback to a default bounding box if needed
        setLoading(false);
      }
    );
  }
  return (
    <div>
      <form onSubmit={handleSearch}>
      <input
        style={{
          width: "90%",
          height: 40,
          marginBottom: 16,
          borderRadius: 8,
          border: "1px solid #ddd",
          padding: 8,
          color: "black",
          marginLeft: 10
        }}
        placeholder="Enter query"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div style={{width: 300, justifyContent: "space-evenly", display: "flex", gap: 10}}>
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
        defaultValue={1}
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
      </form>
    </div>
  );
}
