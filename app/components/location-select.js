"use client";
import { useRouter } from "next/navigation";

const LocationSelect = ({ name, id, item, distance }) => {
  const router = useRouter();

  const handleClick = () => {
    sessionStorage.removeItem('selectedLocation');
    sessionStorage.setItem('selectedLocation', JSON.stringify(item));
    router.push(`/location/${id}`);
  };

  return (
    <button
      onClick={handleClick}
      style={{
        backgroundColor: "white",
        borderRadius: 8,
        padding: 16,
        margin: "8px 0",
        width: "100%",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        border: "1px solid #eee",
        textAlign: "left",
        cursor: "pointer",
      }}
    >
      <span style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", fontSize: 16, fontWeight: "bold" }}>
        {name || "Unknown Location"}
        <p>Distance: {distance.toFixed(2)}km</p>
      </span>
    </button>
  );
};

export default LocationSelect;