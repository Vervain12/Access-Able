import { useState, useEffect } from "react";
import FilterButton from "../components/searchcontrols/filter-buttons";
import SearchInput from "../components/searchcontrols/search-input";
import { useSearchParams } from "next/navigation";
import { runSearch } from "../services/search-services";
import Slider from "@mui/material/Slider";

export default function SearchControls({
  setResults,
  setLatitude,
  setLongitude,
  initialQuery,
  setLoading,
  setPage,
  usePinMode,
  setUsePinMode,
  pinLat,
  pinLon,
  profilePicture,
}) {
  const searchParams = useSearchParams();
  const heroQuery = searchParams?.get("q") || null;

  // Safe sessionStorage access
  const getStoredValue = (key, defaultValue) => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem(key);
      return stored
        ? key === "distance"
          ? parseFloat(stored)
          : stored
        : defaultValue;
    }
    return defaultValue;
  };

  const setStoredValue = (key, value) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(key, value);
    }
  };

  const [query, setQuery] = useState("");
  const [distance, setDistance] = useState(2.5);
  const [isClient, setIsClient] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

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
        await handleSearch(
          null,
          heroQuery,
          distance,
          setResults,
          setLatitude,
          setLongitude
        );
      }
    };
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

    if (!query) {
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latToUse = usePinMode ? pinLat : position.coords.latitude;
        const lonToUse = usePinMode ? pinLon : position.coords.longitude;

        setLatitude(latToUse);
        setLongitude(lonToUse);

        try {
          const finalResults = await runSearch(
            query,
            distance,
            latToUse,
            lonToUse
          );
          setResults(finalResults);
          setStoredValue("query", query);
          setStoredValue("results", JSON.stringify(finalResults));
        } catch (err) {
          console.error("Search failed:", err);
          setResults([]);
        }

        // Update recent search buttons on search controls
        if (query && !recentSearches.includes(query)) {
          setRecentSearches((prev) => {
            const updated = [query, ...prev.filter((q) => q !== query)];
            return updated.slice(0, 5);
          });
        }

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
      <div className="w-150 h-40 bg-white flex rounded-md drop-shadow-xl dark:bg-[var(--background)]">
        <div className="w-100 pl-5 pt-3 h-17 flex flex-col pr-7">
          <SearchInput
            query={query}
            setQuery={setQuery}
            onKeyDown={handleKeyDown}
          />

          <div className="w-135 flex flex-wrap">
            <FilterButton
              queries={recentSearches}
              onQuickSearch={(newQuery) => {
                setQuery(newQuery);
                handleSearch(
                  null,
                  newQuery,
                  distance,
                  setResults,
                  setLatitude,
                  setLongitude
                );
              }}
            />
          </div>
        </div>

        {/* Bottom Half of Search Controls */}
        <div className="flex flex-col h-40 gap-3 py-2 space-evenly ">
          <button
            className="w-22 h-10 ml-2 bg-blue-600 dark:bg-[var(--accent)] text-white border-1 border-radius-8 dark:border-white rounded-md text-xs flex items-center justify-center"
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
          >
            Search
          </button>

          <button
            className="w-22 h-10 ml-2 bg-blue-600 dark:bg-[var(--secondary)] text-white border-radius-8 dark:border-white dark:border-1 rounded-md text-xs flex items-center justify-center"
            onClick={() => setUsePinMode(!usePinMode)}
          >
            <img
              src={usePinMode ? "/marker-icons/gray.svg" : profilePicture}
              alt={usePinMode ? "Pin Icon" : "Profile Picture"}
              className="w-10 h-10"
            />
          </button>

          <button
            className="w-22 h-10 ml-2 bg-blue-600 dark:bg-[var(--secondary)] text-white border-radius-8 dark:border-white dark:border-1 rounded-md text-xs flex items-center justify-center"
            onClick={clearStorage}
          >
            Clear
          </button>
        </div>

        <div className="h-30 w-24 ml-1 mt-5 flex flex-col items-center">
          <Slider
            id="distanceSlider"
            aria-label="Distance"
            value={distance}
            step={0.5}
            min={0.5}
            max={20}
            orientation="vertical"
            onChange={(e, newValue) => setDistance(newValue)}
          />
          <label
            htmlFor="distanceSlider"
            className="dark:text-white text-sm"
          >
            {distance.toFixed(1)} km
          </label>
          
        </div>

      </div>
    </div>
  );
}
