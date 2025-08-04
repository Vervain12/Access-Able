import React from "react";
import Modal from "@mui/material/Modal";
import Slider from "@mui/material/Slider";

export default function FilterSelect({
  setShowFilters,
  open,
  distance,
  setDistance,
  rating,
  setRating,
  setResults,
  setQuery,
}) {
  function clearStorage() {
    setStoredValue("query", "");
    setStoredValue("results", JSON.stringify([]));
    setQuery("");
    setResults([]);
  }

  const setStoredValue = (key, value) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(key, value);
    }
  };

  function clearFilters() {
    setDistance(2.5);
    setRating(0);
  }

  return (
    <Modal
      open={open}
      onClose={() => setShowFilters(false)}
      closeAfterTransition
    >
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] bg-white dark:bg-[var(--background)] shadow-2xl p-4 rounded-md outline-none">
        <div>
          <div className="pb-5 px-5">
            <label
              htmlFor="distanceSlider"
              className="text-black dark:text-white text-sm flex justify-center"
            >
              Search Radius: {distance.toFixed(1)} km
            </label>

            <Slider
              id="distanceSlider"
              aria-label="Distance"
              value={distance}
              step={0.5}
              min={0.5}
              max={20}
              onChange={(e, newValue) => setDistance(newValue)}
            />
          </div>

          <div className="px-5">
            <label
              htmlFor="ratingSlider"
              className="text-black dark:text-white text-sm flex justify-center"
            >
              Target Score: {rating} / 5
            </label>

            <Slider
              id="ratingSlider"
              aria-label="Rating"
              value={rating}
              step={0.5}
              min={0}
              max={5}
              onChange={(e, newValue) => setRating(newValue)}
            />
          </div>
        </div>

        <div className="flex flex-row gap-5 px-5 pt-5">
          <button
            className="w-[15vw] h-10 ml-2 bg-blue-600 dark:bg-[var(--secondary)] text-white border-radius-8 dark:border-white dark:border-1 rounded-md text-xs flex items-center justify-center"
            onClick={clearStorage}
          >
            Clear Map
          </button>

          <button
            className="w-[15vw] h-10 ml-2 bg-blue-600 dark:bg-[var(--secondary)] text-white border-radius-8 dark:border-white dark:border-1 rounded-md text-xs flex items-center justify-center"
            onClick={clearFilters}
          >
            Clear Filters
          </button>

          <button
            onClick={() => setShowFilters(false)}
            className="w-[15vw] h-10 ml-2 bg-red-600 dark:bg-red-800 text-white border-radius-8 dark:border-white dark:border-1 rounded-md text-xs flex items-center justify-center"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
