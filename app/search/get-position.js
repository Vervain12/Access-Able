import { useState, useEffect } from "react";

export default function useGetPosition() {
  const [query, setQuery] = useState(null);
  const [results, setResults] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  useEffect(() => {
    const storedResults = sessionStorage.getItem("results");
    const storedQuery = sessionStorage.getItem("query");

    if (storedQuery) setQuery(storedQuery);
    if (storedResults) setResults(JSON.parse(storedResults));

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

  return { query, setQuery, results, setResults, latitude, setLatitude, longitude, setLongitude };
}
