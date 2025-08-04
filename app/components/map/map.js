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
                  <Popup key={item.id} maxWidth={1000}>
                    <div
                      key={item.id}
                      className="w-[500px] shrink-0 bg-white text-black dark:text-white dark:bg-[var(--card)] rounded-lg shadow-md hover:shadow-lg p-4 flex flex-col"
                    >
                      <div className="h-36 bg-gray-200 rounded mb-4 flex justify-center items-center">
                        {/* Image goes here */}
                      </div>

                      <div className="h-22">
                        <div className="flex flex-row items-center">
                          <h4 className="font-bold text-lg text-black dark:text-white">
                            {item.tags.name}
                          </h4>
                          <button
                            className="ml-auto border h-9 w-25 border-gray-300 text-black bg-white font-medium rounded hover:bg-blue-400 hover:text-white transition-colors"
                            onClick={handleClick}
                          >
                            More Info
                          </button>
                        </div>

                        <div className="flex flex-row items-center gap-2 h-4 pt-3">
                          <Rating
                            name="rating"
                            value={item.rating || 0}
                            readOnly
                            size="small"
                            precision={0.5}
                          />
                          <p className="text-sm text-black dark:text-white">
                            ({item.count} review{item.count >= 2 && <>s</>})
                          </p>
                        </div>

                        <div className="h-5 mb-2">
                          {userLat && userLon && item.lat && item.lon ? (
                            <p className="text-sm text-black dark:text-white">
                              {haversineDistance(
                                userLat,
                                userLon,
                                item.lat,
                                item.lon
                              ).toFixed(2)}{" "}
                              km away
                            </p>
                          ) : (
                            <p className="text-sm text-black dark:text-white pt-0.5 pl-7">
                              Distance unknown
                            </p>
                          )}
                        </div>
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
