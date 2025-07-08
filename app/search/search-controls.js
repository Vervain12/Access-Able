import { useState, useEffect } from "react";
import Slider from "@mui/material/Slider";
import FilterSelect from "../components/searchcontrols/filter-select";
import SearchInput from "../components/searchcontrols/search-input";
import { useSearchParams } from "next/navigation";

export default function SearchControls({
  setResults,
  setLatitude,
  setLongitude,
  initialQuery,
  setLoading,
  setPage,
}) {
  const searchParams = useSearchParams();
  const heroQuery = searchParams?.get('q') || null;
  
  // Safe sessionStorage access
  const getStoredValue = (key, defaultValue) => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem(key);
      return stored ? (key === 'distance' ? parseFloat(stored) : stored) : defaultValue;
    }
    return defaultValue;
  };

  const setStoredValue = (key, value) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(key, value);
    }
  };

  const [query, setQuery] = useState("");
  const [distance, setDistance] = useState(2.5);
  const [isClient, setIsClient] = useState(false);

  // Initialize client-side values after hydration
  useEffect(() => {
    setIsClient(true);
    const storedQ = getStoredValue("query", "");
    const storedDistance = getStoredValue("distance", 2.5);
    
    setQuery(storedQ);
    setDistance(storedDistance);
    
    // Set initial results from storage
    const storedResults = getStoredValue("results", "[]");
    try {
      const parsedResults = JSON.parse(storedResults);
      setResults(parsedResults);
    } catch (e) {
      setResults([]);
    }
  }, []);

  useEffect(() => {
    const performHeroQuery = async () => {
      if (heroQuery && isClient) {
        setQuery(heroQuery);
        await handleSearch(null, heroQuery, distance, setResults, setLatitude, setLongitude);        
      }
    }
    performHeroQuery();
  }, [heroQuery, isClient]);

  // State for showing filter modal
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("");

  useEffect(() => {
    if (isClient) {
      setStoredValue("distance", distance.toString());
    }
  }, [distance, isClient]);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  function clearStorage() {
    setStoredValue("query", "");
    setStoredValue("results", JSON.stringify([]));
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

        //Move this to a backend service component
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
        setStoredValue("query", query);
        setStoredValue("results", JSON.stringify(finalResults));
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