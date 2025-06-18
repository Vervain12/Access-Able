import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider"; // import Slider here

const style = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '40vw',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  outline: 'none',
};

export default function FilterSelect({
  selectedFilter,
  setSelectedFilter,
  setShowFilters,
  open,
  distance,
  setDistance,
}) {
  return (
    <Modal
      open={open}
      onClose={() => setShowFilters(false)}
      closeAfterTransition
    >
      <Box sx={style}>
        <label
          htmlFor="filterSelect"
          id="filter-select-title"
          style={{ color: "black", fontWeight: "bold", fontSize: "1.2rem" }}
        >
          Select a filter:
        </label>
        <select
          id="filterSelect"
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
          style={{
            marginLeft: 10,
            padding: 8,
            borderRadius: 4,
            border: "1px solid #ccc",
            width: "100%",
            marginTop: 8,
            fontSize: "1rem",
          }}
        >
          <option value="">None</option>
          <option value="accessible">Available soon</option>
        </select>

        <div style={{ marginTop: 24 }}>
          <label
            htmlFor="distanceSlider"
            style={{ color: "black", fontWeight: "bold", fontSize: "1rem" }}
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
      </Box>
    </Modal>
  );
}
