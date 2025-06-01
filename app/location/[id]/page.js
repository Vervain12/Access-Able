'use client'
import { useState, useEffect } from "react"
import Header from "@/app/components/header";
import { Box } from "@mui/material";
import ReviewForm from "./review-form";
import ReviewList from "@/app/components/review-list";

export default function LocationPage() {
    const [locationInfo, setLocationInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const locationData = await JSON.parse(sessionStorage.getItem('selectedLocation'));
                setLocationInfo(locationData);
            } catch {
                console.log("An error has occured when fetching location data from session.");
            }
            setLoading(false);
        }
        fetchData();
    }, [])

    const formatAddress = (locationInfo) => {
        
        const tags = locationInfo.tags;
        const parts = [];
        if (tags['addr:housenumber']) parts.push(tags['addr:housenumber']);
        if (tags['addr:street']) parts.push(tags['addr:street']);
        if (tags['addr:postcode']) parts.push(tags['addr:postcode']);
        
        return parts.join(' ');
    };

    return (
        <div style={{backgroundColor: 'white', color: 'black', minHeight: '100vh'}}>
            <Header />
            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
                    <Box sx={{ p: 2 }}>
                        {locationInfo ? (
                            <div>
                                <h1>{locationInfo.tags.name || 'Unnamed Location'}</h1>
                                {formatAddress(locationInfo) && <p>Address: {formatAddress(locationInfo)}</p>}
                                {locationInfo.tags.shopType && <p>Type: {locationInfo.shopType}</p>}
                                {locationInfo.tags.website && (
                                    <p>
                                        Website: <a href={locationInfo.tags.website} target="_blank" rel="noopener noreferrer">
                                            {locationInfo.tags.website}
                                        </a>
                                    </p>
                                )}
                                {locationInfo.openingHours && (
                                    <p>Opening Hours: {locationInfo.openingHours}</p>
                                )}
                            </div>
                        ) : (
                            <p>No location data found</p>
                        )}
                    </Box>
                    <div>
                        <ReviewForm location_id={locationInfo.id} />
                        <ReviewList location_id={locationInfo.id} />
                    </div>
                </>
            )
            }

        </div>
    )
}