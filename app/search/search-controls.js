import { useState } from "react";
import Slider from "@mui/material/Slider";

export default function SearchControls({setResults, setLatitude, setLongitude}) {
  const [query, setQuery] = useState("");
  const [distance, setDistance] = useState(10); // Default distance in km

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
      },
      (error) => {
        console.error("Geolocation error:", error);
        // Fallback to a default bounding box if needed
      }
    );
  }
  return (
    <div>
      <input
        style={{
          width: "90%",
          height: 40,
          marginBottom: 16,
          borderRadius: 8,
          border: "1px solid #ddd",
          padding: 8,
          color: "black",
        }}
        placeholder="Enter query"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

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
    </div>
  );
}
