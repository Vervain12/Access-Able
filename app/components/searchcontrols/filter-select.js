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
}) {
  return (
    <Modal
      open={open}
      onClose={() => setShowFilters(false)}
      closeAfterTransition
    >
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] bg-white dark:bg-[var(--background)] shadow-2xl p-4 rounded-md outline-none">
        <div>
          <div className="pb-5">
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

        <button
          onClick={() => setShowFilters(false)}
          style={{
            marginTop: 20,
            background: "red",
            color: "white",
            padding: "10px 16px",
            borderRadius: 8,
            border: "none",
            fontWeight: "bold",
            cursor: "pointer",
            width: "100%",
          }}
        >
          Close
        </button>
      </div>
    </Modal>
  );
}
