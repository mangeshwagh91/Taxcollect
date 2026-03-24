import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import type { Property } from "@/data/mockData";

const greenIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

const redIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

interface Props {
  properties: Property[];
  height?: string;
}

export default function PropertyMap({ properties, height = "500px" }: Props) {
  const center: [number, number] = [19.076, 72.8777];

  return (
    <MapContainer center={center} zoom={13} style={{ height, width: "100%", borderRadius: "0.75rem" }} scrollWheelZoom>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {properties.map((p) => (
        <Marker key={p.id} position={[p.location.lat, p.location.lng]} icon={p.paymentStatus === "paid" ? greenIcon : redIcon}>
          <Popup>
            <div className="text-sm space-y-1 min-w-[180px]">
              <p className="font-bold text-base">{p.id}</p>
              <p><strong>Owner:</strong> {p.ownerName}</p>
              <p><strong>Type:</strong> {p.type}</p>
              <p><strong>Area:</strong> {p.area} sq.ft</p>
              <p><strong>Tax:</strong> ₹{p.taxAmount.toLocaleString()}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span className={p.paymentStatus === "paid" ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                  {p.paymentStatus.toUpperCase()}
                </span>
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
