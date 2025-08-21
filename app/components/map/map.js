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
import SuggestionBox from "../../suggestions/suggestion-boxes";

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
    <div className="w-screen h-screen">
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
                  <Popup key={item.id}>
                    <div className="w-70 h-70 rounded-lg shadow-xl flex flex-col">
                      <div className="h-36 bg-gray-200 flex rounded-t-lg justify-center items-center">
                        {/* Image goes here */}
                      </div>

                      {/* Location Name */}
                      <div className="w-70 h-28 overflow-hidden bg-white text-black dark:text-white dark:bg-[var(--secondary)]">
                        <h4 className="text-lg truncate pt-2 pl-4">
                          {item.tags.name}
                        </h4>

                        {/* Rating and Review Count */}
                        <div className="flex flex-col w-70 h-15 px-4">
                          <div
                            style={{
                              margin: 0,
                              padding: 0,
                              lineHeight: 1,
                              display: "flex",
                              alignItems: "center",
                              gap: "0.25rem",
                            }}
                          >
                            <Rating
                              name="rating"
                              value={item.rating || 0}
                              readOnly
                              size="medium"
                              precision={0.5}
                              sx={{
                                margin: 0,
                                padding: 0,
                              }}
                            />

                            {/* Distance to Location */}
                            <div className="w-35">
                              <p className="text-sm w-35 flex justify-center">
                                {userLat && userLon
                                  ? `${haversineDistance(
                                      userLat,
                                      userLon,
                                      item.lat,
                                      item.lon
                                    ).toFixed(2)} km away`
                                  : "Distance unknown"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Button */}
                      <div className="h-20 p-2 bg-white rounded-lg dark:bg-[var(--secondary)] flex items-center justify-center">
                        <button
                          className="border h-9 w-40 border-gray-300 text-black bg-white font-medium rounded hover:bg-blue-400 hover:text-white hover:cursor-pointer transition-colors"
                          onClick={() => handleClick(item)}
                        >
                          More Info
                        </button>
                      </div>
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
