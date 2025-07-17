import L from "leaflet";


export const icons = {
  green: new L.Icon({
    iconUrl: '/marker-icons/green.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  }),
  yellow: new L.Icon({
    iconUrl: '/marker-icons/yellow.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  }),
  red: new L.Icon({
    iconUrl: '/marker-icons/red.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  }),
  pin: new L.Icon({
    iconUrl: '/marker-icons/pin-marker.png',
    iconSize: [30, 45],
    iconAnchor: [15, 45],
  }),
};