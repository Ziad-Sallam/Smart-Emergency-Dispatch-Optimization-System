import React from "react";
import { RiMapPin2Line } from "react-icons/ri";
import {
  MapContainer,
  TileLayer,
  LayersControl,
  Marker,
  Popup,
  LayerGroup,
  Circle,
  FeatureGroup,
  Rectangle,
  useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

const center = [51.505, -0.09];
const rectangle = [
  [51.49, -0.08],
  [51.5, -0.06],
];
const MapView = () => {
  return (
    <div className="col-span-6 overflow-hidden rounded border border-stone-300 p-4">
      <div className="pb-4 flex justify-center">
        <h3 className="flex items-center gap-1.5 font-medium">
          <RiMapPin2Line className="mr-1" size={20} />
          <span>Incidents Map</span>
        </h3>
      </div>
      <div className="h-full">
        <MapContainer
          center={center}
          zoom={50}
          scrollWheelZoom={false}
          className="w-full h-[87%] rounded "
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FlyToCenter center={center} duration={1} zoom={13} /> # for transtions
          <LayersControl position="topright">
            <LayersControl.Overlay name="Marker with popup">
              <Marker position={center}>
                <Popup>
                  A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
              </Marker>
            </LayersControl.Overlay>
            <LayersControl.Overlay checked name="Layer group with circles">
              <LayerGroup>
                <Circle
                  center={center}
                  pathOptions={{
                    color: "var(--color-accent)",
                    fillColor: "var(--color-accent)",
                  }}
                  radius={200}
                />
                <LayerGroup>
                  <Circle
                    center={[51.51, -0.08]}
                    pathOptions={{
                      color: "var(--color-accent)",
                      fillColor: "var(--color-accent)",
                    }}
                    radius={100}
                  />
                </LayerGroup>
              </LayerGroup>
            </LayersControl.Overlay>
            <LayersControl.Overlay name="Feature group">
              <FeatureGroup pathOptions={{ color: "purple" }}>
                <Popup>Popup in FeatureGroup</Popup>
                <Circle center={[51.51, -0.06]} radius={200} />
                <Rectangle bounds={rectangle} />
              </FeatureGroup>
            </LayersControl.Overlay>
          </LayersControl>
        </MapContainer>
      </div>
    </div>
  );
};

const FlyToCenter = ({ center , duration, zoom}) => {
  const map = useMap();

  React.useEffect(() => {
    if (center) {
      map.flyTo(center, zoom,{
        duration: duration,
      });
    }
  }, [map, center]);

  return null;
};

export default MapView;
