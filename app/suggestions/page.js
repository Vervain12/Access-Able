"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GetRecommendedPlaces } from "../services/location-services";
import { Box } from "@mui/material";
import SuggestionBox from "./suggestion-boxes";

export default function SuggestionPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [amenities, setAmenities] = useState([]);
  const [userLat, setUserLat] = useState(null);
  const [userLon, setUserLon] = useState(null);

  useEffect(() => {
    const loadSuggestions = async () => {
      setLoading(true);
      const data = await GetRecommendedPlaces();
      setResults(data || []);
      const newAmenities = new Set();

      data?.forEach(async (item) => {
        const amenity = item.tags.amenity;
        if (amenity) {
          newAmenities.add(amenity);
        }
      });
      setAmenities(Array.from(newAmenities));
      setLoading(false);
    };
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLat(position.coords.latitude);
        setUserLon(position.coords.longitude);
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );

    loadSuggestions();
  }, []);

  useEffect(() => {
    console.log("Updated amenities:", amenities);
  }, [amenities]);

  return (
    <div className="p-4 w-full">
      <h1 className="font-bold pb-4 text-xl">Suggested Places</h1>
      {loading && <p>Loading suggestions...</p>}

      {!loading && results.length === 0 && <p>No suggestions found.</p>}

      {!loading &&
        amenities.map((amenity, index) => (
          <div key={index} className="pb-6 w-full">
            <h4 className="font-bold pb-2">
              {amenity.charAt(0).toUpperCase() +
                amenity.slice(1).replace("_", " ")}
            </h4>
            <div className="flex flex-row gap-4 w-full overflow-x-auto px-2 py-2">
              {results
                .filter((item) => item.tags.amenity === amenity)
                .map((item) => (
                  <SuggestionBox
                    key={item.id}
                    item={item}
                    userLat={userLat}
                    userLon={userLon}
                  />
                ))}
            </div>
          </div>
        ))}
    </div>
  );
}
