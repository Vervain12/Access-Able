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
import { Suspense } from "react";
import { createClient } from "@/utils/supabase/client";
import { getProfilePicture } from "../../services/account-services-client";

const DynamicMapView = loadDynamic(() => import("../../components/map/map"), {
  ssr: false,
});

function MapContent() {
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

  const [usePinMode, setUsePinMode] = useState(false);
  const [pinLat, setPinLat] = useState(null);
  const [pinLon, setPinLon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const searchParams = useSearchParams();
  const fromConfirm = searchParams.get("fromConfirm");
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    async function fetchPfp() {
      const supabase = createClient();
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.log(error);
        const guestPfp = "/pfp/pp01.svg";
        setProfilePicture(guestPfp);
      } else {
        if (user) {
          const pfp = await getProfilePicture(user.id);
          setProfilePicture(pfp.data);
        }
      }
    }
    fetchPfp();
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Map layer */}
      <div className="absolute inset-0 z-0">
        {latitude !== null && longitude !== null && (
          <DynamicMapView
            results={results}
            userLat={latitude}
            userLon={longitude}
            pinLat={pinLat}
            pinLon={pinLon}
            setPinLat={setPinLat}
            setPinLon={setPinLon}
            usePinMode={usePinMode}
            profilePicture={profilePicture}
          />
        )}
      </div>

      {/* Controls overlay */}
      <div className="absolute top-5 left-1/2 transform -translate-x-1/2 z-10 p-4 rounded-lg">
        <SearchControls
          initialQuery={query}
          setResults={setResults}
          setLatitude={setLatitude}
          setLongitude={setLongitude}
          setLoading={setLoading}
          setPage={null}
          usePinMode={usePinMode}
          setUsePinMode={setUsePinMode}
          pinLat={pinLat}
          pinLon={pinLon}
          profilePicture={profilePicture}
        />
      </div>

      {/* DisabilityChoice overlay */}
      {fromConfirm && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
          <DisabilityChoice authOpen={fromConfirm}/>
        </div>
      )}

      {/* Loading overlay */}
      {loading && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 bg-white bg-opacity-70 p-6 rounded-xl shadow-md">
          <CircularProgress />
        </div>
      )}
    </div>
  );
}

// Loading fallback component
function MapLoading() {
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
        Loading Map...
      </div>
    </div>
  );
}

export default function MapPage() {
  return (
    <Suspense fallback={<MapLoading />}>
      <MapContent />
    </Suspense>
  );
}
