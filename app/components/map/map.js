"use client";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { Button, Rating } from "@mui/material";
import "leaflet/dist/leaflet.css";
import { useRouter } from "next/navigation";
import { icons } from "./map-icons";
import { formatAddress } from "../address-constructor";
import { haversineDistance } from "../location-distance";

// Determine icon based on rating
const getIconByRating = (rating) => {
  if (rating >= 4) return icons.green;
  if (rating >= 2) return icons.yellow;
  return icons.red;
};

// Function for dropping pin and getting coords
function PinDropper({ usePinMode, setPinLat, setPinLon }) {
  useMapEvents({
    click(e) {
      if (usePinMode && setPinLat && setPinLon) {
        setPinLat(e.latlng.lat);
        setPinLon(e.latlng.lng);
      }
    },
  });
  return null;
}

export default function MapView({
  results,
  userLat,
  userLon,
  usePinMode,
  pinLat,
  pinLon,
  setPinLat,
  setPinLon,
  profilePicture,
}) {
  const router = useRouter();

  const handleClick = (item) => {
    sessionStorage.removeItem("selectedLocation");
    sessionStorage.setItem("selectedLocation", JSON.stringify(item));
    router.push(`/location/${item.id}`);
  };

  const center =
    usePinMode && pinLat !== null && pinLon !== null
      ? [pinLat, pinLon]
      : [userLat, userLon];

  return (
    <div className="w-full h-full m-30 m-auto border-2">
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {!usePinMode && userLat && userLon && profilePicture && (
          <Marker
            position={[userLat, userLon]}
            icon={L.divIcon({
              html: `<img src="${profilePicture}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;" />`,
              className: "",
              iconSize: [40, 40],
              iconAnchor: [20, 20],
            })}
          />
        )}

        {/* Search result markers */}
        {/* This entirely needs to be styled. */}
        {results
          .filter((place) => place.tags && place.tags.name)
          .map(
            (item) =>
              item.lat &&
              item.lon && (
                <Marker
                  key={item.id}
                  position={[item.lat, item.lon]}
                  icon={getIconByRating(item.rating || 0)}
                  title={item.tags?.name}
                >
                  <Popup>
                    <div className="flex flex-col gap-5 dark:bg-[var(--secondary)] font-size-18 font-weight-bold align-items-center">
                      <h2 style={{ fontSize: 22, margin: 0 }}>
                        {item.tags?.name || "Unnamed Place"}
                      </h2>
                      {userLat && userLon && (
                        <p style={{ fontSize: 14, margin: 0 }}>
                          {haversineDistance(
                            userLat,
                            userLon,
                            item.lat,
                            item.lon
                          ).toFixed(2)}
                          km away
                        </p>
                      )}
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
                    </div>
                  </Popup>
                </Marker>
              )
          )}

        {/* Pin dropping functionality */}
        {usePinMode && (
          <>
            <PinDropper
              usePinMode={usePinMode}
              setPinLat={setPinLat}
              setPinLon={setPinLon}
            />
            {pinLat !== null && pinLon !== null && (
              <Marker
                position={[pinLat, pinLon]}
                icon={icons.pin}
                draggable={true}
                eventHandlers={{
                  dragend: (e) => {
                    const { lat, lng } = e.target.getLatLng();
                    setPinLat(lat);
                    setPinLon(lng);
                  },
                }}
              ></Marker>
            )}
          </>
        )}
      </MapContainer>
    </div>
  );
}
