import { useEffect } from "react";
import {
  CircleMarker,
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  Tooltip,
  useMap,
  useMapEvents,
} from "react-leaflet";


const INDIA_CENTER = [22.9734, 78.6569];


function MapClickHandler({ interactive, onAddCity }) {
  useMapEvents({
    click(event) {
      if (interactive) {
        onAddCity?.(event.latlng.lat, event.latlng.lng);
      }
    },
  });

  return null;
}


function FitBoundsController({ cities, routeCoordinates }) {
  const map = useMap();

  useEffect(() => {
    const targetCoordinates = routeCoordinates.length
      ? routeCoordinates
      : cities.map((city) => [city.lat, city.lng]);

    if (!targetCoordinates.length) {
      map.setView(INDIA_CENTER, 4);
      return;
    }

    if (targetCoordinates.length === 1) {
      map.setView(targetCoordinates[0], 5);
      return;
    }

    map.fitBounds(targetCoordinates, {
      padding: [40, 40],
    });
  }, [cities, map, routeCoordinates]);

  return null;
}


function MapCanvas({ cities, interactive, onAddCity, routeIndices, theme }) {
  const routeCoordinates = routeIndices
    .map((index) => cities[index])
    .filter(Boolean)
    .map((city) => [city.lat, city.lng]);

  const tileUrl =
    theme === "dark"
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  const attribution =
    theme === "dark"
      ? '&copy; <a href="https://carto.com/">CARTO</a> and OpenStreetMap contributors'
      : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  return (
    <div className="relative overflow-hidden rounded-[30px] border border-slate-200/70 dark:border-slate-700/80">
      <div className="absolute left-4 top-4 z-[1000] rounded-2xl bg-slate-950/75 px-3 py-2 text-xs font-medium text-white shadow-lg shadow-slate-950/20">
        Click anywhere to add a city in map mode.
      </div>

      <MapContainer center={INDIA_CENTER} className="h-[540px] w-full" zoom={4}>
        <TileLayer attribution={attribution} url={tileUrl} />
        <MapClickHandler interactive={interactive} onAddCity={onAddCity} />
        <FitBoundsController cities={cities} routeCoordinates={routeCoordinates} />

        {routeCoordinates.length > 1 ? (
          <Polyline color={theme === "dark" ? "#67e8f9" : "#0891b2"} positions={routeCoordinates} weight={4} />
        ) : null}

        {cities.map((city, index) => (
          <Marker key={`${city.name}-${index}`} position={[city.lat, city.lng]}>
            <Tooltip direction="top" offset={[0, -10]} permanent>
              <span className="font-semibold">{city.name}</span>
            </Tooltip>
          </Marker>
        ))}

        {cities[0] ? (
          <CircleMarker
            center={[cities[0].lat, cities[0].lng]}
            color={theme === "dark" ? "#fb923c" : "#f97316"}
            fillOpacity={0.35}
            radius={18}
            weight={2}
          />
        ) : null}
      </MapContainer>
    </div>
  );
}

export default MapCanvas;
