"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Button, Rating } from "@mui/material";
import "leaflet/dist/leaflet.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function MapView({
  results,
  selectedLocation,
  userLat,
  userLon,
}) {
  const router = useRouter();
  const handleClick = (item) => {
    sessionStorage.removeItem('selectedLocation');
    sessionStorage.setItem('selectedLocation', JSON.stringify(item));
    router.push(`/location/${item.id}`);
  };

  const customIcon = new L.Icon({
    iconUrl: "/customMarker.png",
    iconSize: [30, 35],
    iconAnchor: [10, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  return (
    <div
      style={{
        width: "90%",
        height: 550,
        margin: "30px auto",
        border: "2px solid #3498db",
        borderRadius: 8,
      }}
    >
      <MapContainer
        center={[userLat, userLon]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {results
          .filter((place) => place.tags && place.tags.name)
          .map(
            (item) =>
              item.lat &&
              item.lon && (
                <Marker
                  key={item.id}
                  position={[item.lat, item.lon]}
                  icon={customIcon}
                  title={item.tags?.name}
                >
                  <Popup style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: 18, fontWeight: "bold", alignItems: "center"}}>
                    <h2 style={{ fontSize: 22, margin: 0 }}>{item.tags?.name || "Unnamed Place"}</h2>
                    <Rating 
                        name="rating" 
                        value={item.rating || 0}
                        readOnly
                        size="small" 
                        precision={0.5}
                    />
                    <Button
                      onClick={() => handleClick(item)}
                      variant="contained"
                      size="small"
                      style={{ textTransform: "none", alignSelf: "center" }}>More Info</Button>
                  </Popup>
                </Marker>
              )
          )}
      </MapContainer>
    </div>
  );
}