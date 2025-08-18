import { useState, useEffect } from "react";
import FilterButton from "../components/searchcontrols/filter-buttons";
import SearchInput from "../components/searchcontrols/search-input";
import { useSearchParams } from "next/navigation";
import { runSearch } from "../services/search-services";
import FilterSelect from "../components/searchcontrols/filter-select";
import TuneIcon from "@mui/icons-material/Tune";

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
  const [rating, setRating] = useState(0);

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

  async function handleSearch(e, query, distance, setResults) {
    setResults([]);
    setLoading(true);

    if (!query) {
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latToUse = usePinMode ? pinLat : position.coords.latitude;
        const lonToUse = usePinMode ? pinLon : position.coords.longitude;

        try {
          const finalResults = await runSearch(
            query,
            distance,
            latToUse,
            lonToUse,
            rating
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
            return updated.slice(0, 7);
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
      <div className="w-110 md:w-150 h-40 md:h-18 bg-white flex flex-col rounded-md drop-shadow-xl dark:bg-[var(--background)]">
        <div className="w-110 md:w-150 pl-5 pt-3 h-14 flex flex-col md:flex-row">
          <div className="w-100 md:w-110 border-1 border-gray-300 flex flex-row items-center">
            <SearchInput
              query={query}
              setQuery={setQuery}
              onKeyDown={handleKeyDown}
            />

            <button
              className="w-9 h-9 bg-blue-600 dark:bg-[var(--accent)] hover:cursor-pointer text-white border-1 border-radius-8 dark:border-white rounded-md text-xs flex items-center justify-center"
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11 4a7 7 0 015.657 11.313l4.243 4.243a1 1 0 01-1.414 1.414l-4.243-4.243A7 7 0 1111 4z"
                />
              </svg>
            </button>
          </div>

          <div className="flex sm:flex-col md:flex-row">
            <button
              className="md:ml-4 md:mr-4 sm:mt-1 md:mt-0 w-11 h-11 bg-white text-blue-500 dark:bg-[var(--accent)] dark:text-white rounded-md text-xs flex items-center justify-center"
              onClick={() => setUsePinMode(!usePinMode)}
            >
              <img
                src={usePinMode ? "/marker-icons/blue.svg" : profilePicture}
                alt={usePinMode ? "Pin Icon" : "Profile Picture"}
                className="w-8 h-8 rounded-full"
              />
            </button>

            <button
              className="w-11 h-11 sm:mt-2 md:mt-0 bg-white text-blue-500 dark:bg-[var(--accent)] dark:text-white rounded-md text-xs flex items-center justify-center"
              onClick={() => setShowFilters(true)}
            >
              <TuneIcon />
            </button>
          </div>
        </div>

        {recentSearches.length > 0 && (
          <div className="ml-20 md:ml-0 pl-5 w-90 md:w-150 h-20 rounded-md drop-shadow-xl dark:bg-[var(--background)]">
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
        )}

        {/* Filter Modal */}
        <div className="flex flex-row h-1">
          <FilterSelect
            open={showFilters}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            setShowFilters={setShowFilters}
            distance={distance}
            setDistance={setDistance}
            rating={rating}
            setRating={setRating}
            setResults={setResults}
            setQuery={setQuery}
          />
        </div>
      </div>
    </div>
  );
}
