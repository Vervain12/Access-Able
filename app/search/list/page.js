"use client";
import { useState, useEffect, Suspense } from "react";
import Location from "../../components/location";
import DisabilityChoice from "../../components/disability-choice";
import { useSearchParams } from "next/navigation";
import Header from "../../components/header";
import SearchControls from "../search-controls";



// Separate component to avoid error (Added a suspense boundary)
function SearchContent() {
  const [results, setResults] = useState([]);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const searchParams = useSearchParams();
  const fromConfirm = searchParams.get("fromConfirm");

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
    <div>
      <Header />

      <div style={{ background: "#f5f5f5", minHeight: "100vh", padding: 20 }}>
        {fromConfirm && <DisabilityChoice />}
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
          <div style={{ display: "flex", gap: 20 }}>
            
            <SearchControls
              setResults={setResults}
              setLatitude={setLatitude}
              setLongitude={setLongitude}
            />
          </div>
        </div>
          <div style={{ width: "90%", margin: "30px auto", color: "black" }}>
            {results.map((item) => (
              <Location
                key={item.id}
                name={item.tags?.name || "Unnamed Place"}
                id={item.id}
              />
            ))}
          </div>
      </div>
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
          color: "black",
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
