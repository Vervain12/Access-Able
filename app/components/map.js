"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Button, Rating } from "@mui/material";
import "leaflet/dist/leaflet.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import LocationPinIcon from '@mui/icons-material/LocationPin';
export default function MapView({
  results,
  selectedLocation,
  userLat,
  userLon,
}) {
  const router = useRouter();
  const handleClick = (item) => {
    sessionStorage.removeItem("selectedLocation");
    sessionStorage.setItem("selectedLocation", JSON.stringify(item));
    router.push(`/location/${item.id}`);
  };

  // Temporary icon until custom ones are created
  const customIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#1e88e5" width="32" height="32">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    `),
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  return (
    <div className="w-full h-full m-30 m-auto border-2">
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
                  <Popup className="flex flex-col gap-8 font-size-18 font-weight-bold align-items-center">
                    <h2 style={{ fontSize: 22, margin: 0 }}>
                      {item.tags?.name || "Unnamed Place"}
                    </h2>
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
                      style={{ textTransform: "none", alignSelf: "center" }}
                    >
                      More Info
                    </Button>
                  </Popup>
                </Marker>
              )
          )}
      </MapContainer>
    </div>
  );
}
