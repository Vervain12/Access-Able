import { useState, useEffect } from "react";
import Slider from "@mui/material/Slider";
import FilterSelect from "../components/SearchControls/filter-select";
import SearchInput from "../components/SearchControls/search-input";

export default function SearchControls({
  setResults,
  setLatitude,
  setLongitude,
  initialQuery,
  setLoading,
  setPage,
}) {
  const storedQ = sessionStorage.getItem("query");
  const [query, setQuery] = useState(storedQ || "");
  const [distance, setDistance] = useState(() => {
    const stored = sessionStorage.getItem("distance");
<<<<<<< JimboBranch
    return stored ? parseFloat(stored) : 10;
  });

  // State for showing filter modal
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("");
=======
    return stored ? parseFloat(stored) : 2.5; // default to 10km if none saved
  });

  useEffect(() => {
    sessionStorage.setItem("distance", distance.toString());
  }, [distance]);
>>>>>>> master

  useEffect(() => {
    sessionStorage.setItem("distance", distance.toString());
  }, [distance]);

  useEffect(() => {
    setQuery(initialQuery || "");
    setResults(
      sessionStorage.getItem("results")
        ? JSON.parse(sessionStorage.getItem("results"))
        : []
    );
  }, [initialQuery]);

  function clearStorage() {
    sessionStorage.setItem("query", "");
    sessionStorage.setItem("results", JSON.stringify([]));
    setQuery("");
    setResults([]);
  }

  function haversineDistance(lat1, lon1, lat2, lon2) {
    const toRad = (x) => (x * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

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
    if (setPage !== null && setPage !== undefined) setPage(1);

    if (query === "" || query === null) {
      setLoading(false);
      return;
    }

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
      <div
        style={{
          width: 1050,
          justifyContent: "center",
          margin: "0 auto",
          background: "white",
          padding: 16,
          borderRadius: 8,
          borderBottom: "5px solid #D0D0D0",
        }}
      >
        <SearchInput
          query={query}
          setQuery={setQuery}
          onKeyDown={handleKeyDown}
        />

        <div
          style={{
            width: "100%",
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
            onClick={clearStorage}
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

          <button
            onClick={() => setShowFilters(true)}
            style={{
              background: "#3498db",
              color: "white",
              padding: 12,
              borderRadius: 8,
              border: "none",
              fontWeight: "bold",
            }}
          >
            Filters
          </button>
        </div>

        <FilterSelect
          open={showFilters}
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          setShowFilters={setShowFilters}
          distance={distance}
          setDistance={setDistance}
        />
      </div>
    </div>
  );
}
