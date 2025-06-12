"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";

export default function MapView({
  results,
  selectedLocation,
  userLat,
  userLon,
}) {
  const [chosenLocation, setChosenLocation] = useState(selectedLocation);

  const customIcon = new L.Icon({
    iconUrl: "/customMarker.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
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
                  eventHandlers={{ click: () => setChosenLocation(item) }}
                >
                  <Popup>{item.tags?.name || "Unnamed Place"}</Popup>
                </Marker>
              )
          )}
      </MapContainer>

      
    </div>
  );
}
