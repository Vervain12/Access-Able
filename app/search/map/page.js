"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import SearchControls from "../search-controls";
import Header from "../../components/header";

const DynamicMapView = dynamic(() => import("../../components/map"), {
  ssr: false,
});

export default function MapPage() {
  const [results, setResults] = useState([]);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  useEffect(() => {
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
    <div style={{background: "white", minHeight: "100vh", padding: 20}}>
      <Header />
      <div style={{ background: "#f5f5f5", padding: 20 }}>
        <div style={{ display: "flex", gap: 20, justifyContent: "center" }}>
          <SearchControls
            setResults={setResults}
            setLatitude={setLatitude}
            setLongitude={setLongitude}
          />
        </div>
        {!latitude !== null && longitude !== null && (
          <DynamicMapView
            results={results}
            userLat={latitude}
            userLon={longitude}
          />
        )}
      </div>
    </div>
  );
}
