import { useEffect } from "react";

export default function GetPosition(
  setQuery,
  setResults,
  setLatitude,
  setLongitude
) {
  useEffect(() => {
    // It doesn't really make sense for checking storage for results and query to be here logically, 
    // but both the map and list had these lines so this is just cleaner
    const storedResults = sessionStorage.getItem("results");
    const storedQuery = sessionStorage.getItem("query");

    if (storedQuery) setQuery(storedQuery);
    if (storedResults) setResults(JSON.parse(storedResults));

    // Get user's current position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      (error) => {
        console.error("Geolocation error:", error);
        setLatitude(0);
        setLongitude(0);
      }
    );
  }, []);
}
