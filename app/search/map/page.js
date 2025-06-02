"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import SearchControls from "../search-controls";
import Header from "../../components/header";
import { CircularProgress } from "@mui/material";

const DynamicMapView = dynamic(() => import("../../components/map"), {
  ssr: false,
});

export default function MapPage() {
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [loading, setLoading] = useState(false);

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
  return (
    <div>
      <Header />
      <div style={{ background: "white", minHeight: "100vh", padding: 20 }}>
        <div style={{ background: "#f5f5f5", padding: 20 }}>
          <div style={{ display: "flex", gap: 20, justifyContent: "center" }}>
            <SearchControls
              initialQuery={query}
              setResults={setResults}
              setLatitude={setLatitude}
              setLongitude={setLongitude}
              setLoading={setLoading}
            />
          </div>

          <div style={{ position: "relative", height: "80vh", marginTop: 20 }}>
            {loading && (
              <div
                style={{
                  position: "absolute",
                  top: "30%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 1000,
                  backgroundColor: "rgba(255, 255, 255, 0.7)",
                  padding: 20,
                  borderRadius: 10,
                }}
              >
                <CircularProgress />
              </div>
            )}

            {latitude !== null && longitude !== null && (
              <DynamicMapView
                results={results}
                userLat={latitude}
                userLon={longitude}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
