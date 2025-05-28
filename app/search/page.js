"use client";
import { useState, Suspense } from "react";
import Location from "../components/location";
import Slider from "@mui/material/Slider";
import dynamic from "next/dynamic";
import DisabilityChoice from "../components/disability-choice"
import { useSearchParams } from "next/navigation"

const DynamicMapView = dynamic(() => import("../components/map"), {
  ssr: false,
});

// Separate component to avoid error (Added a suspense boundary)
function SearchContent() {
  const [query, setQuery] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [results, setResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [distance, setDistance] = useState(10); // Default distance in km
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null); 
  const searchParams = useSearchParams();
  const fromConfirm = searchParams.get('fromConfirm');

  const handleSearch = async (e) => {
    e.preventDefault();
    setResults([]);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setLatitude(lat);
        setLongitude(lon);
        const response = await fetch("api/overpass/search", {
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
  };

  const handleShowMap = () => {
    if (latitude === null || longitude === null) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setLatitude(lat);
          setLongitude(lon);
        }
      );
    }
    setShowMap(!showMap);
  };

  return (
    <div style={{ background: "#f5f5f5", minHeight: "100vh", padding: 20 }}>
       {fromConfirm && (
          <DisabilityChoice/>                
        )}
      <div
        style={{
          width: 400,
          margin: "0 auto",
          background: "white",
          padding: 16,
          borderRadius: 8,
          borderBottom: "5px solid #D0D0D0",
        }}
      >
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

        <div style={{ display: "flex", gap: 20 }}>
          <button
            onClick={handleSearch}
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
            onClick={handleShowMap}
            style={{
              background: "#3498db",
              color: "white",
              padding: 12,
              borderRadius: 8,
              border: "none",
              fontWeight: "bold",
            }}
          >
            Toggle Map
          </button>

          <div>
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
        </div>
      </div>

      {showMap ? (
        <DynamicMapView results={results} selectedLocation={selectedLocation} userLat={latitude} userLon={longitude}/>
      ) : (
        // Code to display the list of locations
        <div style={{ width: "90%", margin: "30px auto", color: "black" }}>
          {results.map((item) => (
            <Location
              key={item.id}
              name={item.tags?.name || "Unnamed Place"}
              id={item.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Loading fallback component
function SearchLoading() {
  return (
    <div style={{ background: "#f5f5f5", minHeight: "100vh", padding: 20 }}>
      <div
        style={{
          width: 400,
          margin: "0 auto",
          background: "white",
          padding: 16,
          borderRadius: 8,
          borderBottom: "5px solid #D0D0D0",
          textAlign: "center",
          color: "black"
        }}
      >
        Loading search...
      </div>
    </div>
  );
}

export default function Search() {
  return (
    <Suspense fallback={<SearchLoading />}>
      <SearchContent />
    </Suspense>
  );
}