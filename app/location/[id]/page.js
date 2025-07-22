'use client'
import { useState, useEffect } from "react"
import Header from "@/app/components/header";
import { Box } from "@mui/material";
import ReviewForm from "./review-form";
import { ReviewList } from "@/app/components/review-list";
import { CircularProgress, Rating } from "@mui/material";
import { formatAddress } from "@/app/components/address-constructor";
import ReviewSummary from "@/app/components/review-summary";

export default function LocationPage() {
    const [locationInfo, setLocationInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hasReview, setHasReview] = useState(false);

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

    return (
        <div style={{backgroundColor: 'white', color: 'black', minHeight: '100vh'}}>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
                    <Box sx={{ p: 2 }}>
                        {locationInfo ? (
                            <div>
                                <h1>{locationInfo.tags.name || 'Unnamed Location'}</h1>
                                <Rating 
                                    name="rating" 
                                    value={locationInfo.rating || 0}
                                    readOnly
                                    size="small" 
                                />

                                {locationInfo.tags.website && (
                                    <p>
                                        Website: <a href={locationInfo.tags.website} target="_blank" rel="noopener noreferrer">
                                            {locationInfo.tags.website}
                                        </a>
                                    </p>
                                )}
                                {locationInfo.tags.opening_hours && (
                                    <p>Opening Hours: {locationInfo.tags.opening_hours}</p>
                                )}
                                {locationInfo.tags.phone && (
                                    <p>Phone: {locationInfo.tags.phone}</p>
                                )}
                                <p>Address: {formatAddress(locationInfo)}</p>
                            </div>
                        ) : (
                            <p>No location data found</p>
                        )}
                    </Box>
                    <div>
                        <ReviewForm location_id={locationInfo.id} hasReview={hasReview} location_name={locationInfo.tags.name} />
                        <ReviewSummary location_id={locationInfo.id} />
                        <ReviewList location_id={locationInfo.id} setHasReview={setHasReview} />
                    </div>
                </>
            )
            }

        </div>
    )
}