"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import loadDynamic from "next/dynamic";
import useGetPosition from "../get-position";
import Header from "../../components/header";
import { CircularProgress } from "@mui/material";
import SearchControls from "../search-controls";
import { useSearchParams } from "next/navigation";
import DisabilityChoice from "@/app/components/disability-choice";

const DynamicMapView = loadDynamic(() => import("../../components/map"), {
  ssr: false,
});

export default function MapPage() {
  // Get all needed state & setters from the hook
  const {
    query,
    setQuery,
    results,
    setResults,
    latitude,
    longitude,
    setLatitude,
    setLongitude,
  } = useGetPosition();

  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const searchParams = useSearchParams();
  const fromConfirm = searchParams.get("fromConfirm");

  // Only render after mounted (if you want)
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div>
      {/*Refreshing should remove fromconfirm somehow*/}
      {fromConfirm && <DisabilityChoice />}
      <div style={{ background: "#f5f5f5", minHeight: "100vh", padding: 20 }}>
        <div style={{ padding: 20 }}>
          <div style={{ display: "flex", gap: 20, justifyContent: "center" }}>
            <SearchControls
              initialQuery={query}
              setResults={setResults}
              setLatitude={setLatitude}
              setLongitude={setLongitude}
              setLoading={setLoading}
              setPage={null}
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
