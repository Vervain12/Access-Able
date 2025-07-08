'use client'

import { createClient } from "@/utils/supabase/client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation";
import { GetRecommendedPlaces } from "../services/location-services";

export default function SuggestionPage() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const loadSuggestions = async () => {
            setLoading(true);
            const data = await GetRecommendedPlaces();
            setResults(data || []);
            setLoading(false);
        }
        loadSuggestions();
    },[]);

    const handleSelect = (location) => {
        sessionStorage.setItem("selectedLocation", JSON.stringify(location));
        router.push(`/location/${location.id}`);
    };

    return (
        <div style={{ padding: 24 }}>

        {loading && <p>Loading suggestions...</p>}

        {!loading && results.length === 0 && (
            <p>No suggestions found based on your profile.</p>
        )}

        {!loading && results?.elements?.map((item) => (
            <button
                key={item.id}
                onClick={() => handleSelect(item)}
                style={{
                    backgroundColor: "white",
                    borderRadius: 8,
                    padding: 16,
                    marginBottom: 12,
                    width: "100%",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    border: "1px solid #eee",
                    textAlign: "left",
                    cursor: "pointer",
                }}
                >
                <span style={{ fontSize: 18, fontWeight: "bold" }}>
                    {item.tags?.name || "Unnamed Location"}
                </span>
            </button>
        ))}
    </div>
    );
}

