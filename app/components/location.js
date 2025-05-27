"use client";
import { useRouter } from "next/navigation";

const Location = ({ name, id }) => {
  const router = useRouter();

  const handleClick = () => {
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
      <span style={{ fontSize: 16, fontWeight: "bold" }}>
        {name || "Unknown Location"}
      </span>
    </button>
  );
};

export default Location;