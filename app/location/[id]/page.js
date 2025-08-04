"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/header";
import { Box } from "@mui/material";
import ReviewForm from "./review-form";
import { ReviewList } from "@/app/components/review-list";
import { CircularProgress, Rating, Button } from "@mui/material";
import { formatAddress } from "@/app/components/address-constructor";
import ReviewSummary from "@/app/components/review-summary";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import LanguageIcon from "@mui/icons-material/Language";
import PhoneIcon from '@mui/icons-material/Phone';

export default function LocationPage() {
  const [locationInfo, setLocationInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasReview, setHasReview] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const locationData = await JSON.parse(
          sessionStorage.getItem("selectedLocation")
        );
        setLocationInfo(locationData);
      } catch {
        console.log(
          "An error has occured when fetching location data from session."
        );
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div
      style={{ backgroundColor: "white", color: "black", minHeight: "100vh" }}
    >
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <Box>
            <div className="fixed top-16 left-0 right-0 z-50 h-15 text-xl flex items-center bg-blue-500 text-white">
              <Button
              onClick={() => router.back()}
                variant="text"
                sx={{
                  width: "1px",
                  height: "40px",
                  color: "white",
                }}
              >
                <ArrowBackIosIcon />
              </Button>
              <h1>{locationInfo.tags.name || "Unnamed Location"}</h1>
            </div>

            {locationInfo ? (
              <div className="dark:bg-[var(--background)] flex flex-col content-center pt-15">
                <Box className="w-200 h-75 self-center bg-gray-500"></Box>

                <div className="pl-20 pr-20 pt-3 self-center">
                  <div className="flex flex-row">
                    <Rating
                      name="rating"
                      value={locationInfo.rating || 0}
                      readOnly
                      size="large"
                    />

                    <div className="flex flex-row ml-75 gap-5">
                      <ReviewForm
                        location_id={locationInfo.id}
                        hasReview={hasReview}
                        location_name={locationInfo.tags.name}
                      />
                      <ReviewSummary location_id={locationInfo.id} />
                    </div>
                  </div>

                  <p className="pl-1 dark:text-white">Looks like a description goes here</p>

                  {/* Location Info Section */}
                  <div className="flex flex-row">
                    <div className="flex flex-col">
                      <div className="flex flex-row pt-2 gap-2">
                        <img src="/marker-icons/gray.svg" className="h-6 w-5 pl-1" />
                        <p className="dark:text-white">Address: {formatAddress(locationInfo)}</p>
                      </div>

                      <div className="flex flex-row pt-5 gap-1 dark:text-white">
                        <WatchLaterIcon />

                        <div className="flex flex-col">
                          {locationInfo.tags.opening_hours ? (
                            <p>
                              Opening Hours: {locationInfo.tags.opening_hours}
                            </p>
                          ) : (
                            <p className="dark:text-white">No hours of operation available</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col pl-5 pt-2">
                      <div className="flex flex-row dark:text-white gap-1">
                        <LanguageIcon />
                        {locationInfo.tags.website && (
                          <p>
                            Website:{" "}
                            <a
                              href={locationInfo.tags.website}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {locationInfo.tags.website}
                            </a>
                          </p>
                        )}
                      </div>
                      <div className="flex flex-row pt-5 dark:text-white gap-1">
                        <PhoneIcon />
                        {locationInfo.tags.phone && (
                          <p>Phone: {locationInfo.tags.phone}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Accessibility Features Section */}
                  <div className="mt-5 pt-5 border-t-2 border-t-black h-50 dark:text-white dark:border-t-gray-400">
                    <p className="text-lg font-bold">Accessibility Features</p>
                    <div>
                      <p>
                        Some functionality for the accessibility features will
                        be here. or not idk
                      </p>
                    </div>
                  </div>

                  {/* Recent Reviews Section */}
                  <div className="pt-10 border-t-2 border-t-black dark:text-white dark:border-t-gray-400">
                    <div className="flex flex-row pb-4">
                      <p className="text-bold text-lg mr-108">Recent Reviews</p>
                      <Button
                        variant="contained"
                        sx={{
                          width: "200px",
                          height: "30px",
                          color: "white",
                        }}
                      >
                        View All Reviews
                      </Button>
                    </div>

                    <ReviewList
                      location_id={locationInfo.id}
                      setHasReview={setHasReview}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <p>No location data found</p>
            )}
          </Box>
        </>
      )}
    </div>
  );
}
