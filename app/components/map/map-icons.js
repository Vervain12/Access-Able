import L from "leaflet";

const createMaterialMapIcon = (color) => {
  return `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="${color}">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  `)}`;
};

export const icons = {
  green: new L.Icon({
    iconUrl: '/marker-icons/green.svg',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  }),
  yellow: new L.Icon({
    iconUrl: '/marker-icons/yellow.svg',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  }),
  red: new L.Icon({
    iconUrl: '/marker-icons/red.svg',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  }),
  pin: new L.Icon({
    iconUrl: '/marker-icons/blue.svg',
    iconSize: [30, 45],
    iconAnchor: [15, 45],
  }),
};
