import { useState, useRef, useEffect } from "react";
import { APIProvider } from "@vis.gl/react-google-maps";
import LOCATIONS from "../data/location";

function Game() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const streetViewRef = useRef<HTMLDivElement>(null);
  const miniMapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const markerRef = useRef<google.maps.Marker | null>(null);

  const [randomLocation] = useState(
    LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)]
  );

  useEffect(() => {
    if (
      !mapLoaded ||
      !streetViewRef.current ||
      !miniMapRef.current ||
      !window.google ||
      !window.google.maps
    )
      return;

    new window.google.maps.StreetViewPanorama(streetViewRef.current, {
      position: { lat: randomLocation.lat, lng: randomLocation.lng },
      pov: { heading: 180, pitch: 5 },
      addressControl: false,
      showRoadLabels: false,
      zoomControl: false,
      fullscreenControl: false,
      disableDefaultUI: true,
    });

    const map = new window.google.maps.Map(miniMapRef.current, {
      center: { lat: 54.6711253091546, lng: 25.09178659873669 },
      zoom: 13,
      disableDefaultUI: true,
      gestureHandling: "greedy",
      clickableIcons: false,
      styles: [
        {
          featureType: "poi",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "transit",
          stylers: [{ visibility: "off" }],
        },
      ],
    });

    map.addListener("click", (e: google.maps.MapMouseEvent) => {
      const clickedLatLng = e.latLng;
      console.log(e.latLng?.toJSON());
      
      if (!clickedLatLng) return;

      if (markerRef.current) {
        markerRef.current.setMap(null);
      }

      const newMarker = new window.google.maps.Marker({
        position: clickedLatLng,
        map: map,
      });

      markerRef.current = newMarker;
    });
  }, [mapLoaded, randomLocation]);

  if (!randomLocation) return null;

  return (
    <APIProvider apiKey={apiKey} onLoad={() => setMapLoaded(true)}>
      <div className="relative w-full h-screen">
        <div ref={streetViewRef} className="w-full h-full" />

        <div className="absolute top-1 left-1 z-50 rounded-md border-2 bg-[#A2BEEE] px-6 py-2 text-white font-semibold">
          <p>Taškai: 0000</p>
        </div>

        <div className="absolute bottom-0 right-0 z-10 flex flex-col items-end p-4 gap-2">
          <button className="z-20 rounded-md border-2 bg-[#A2BEEE] w-64 md:w-80 px-6 py-2 text-white font-semibold hover:opacity-90 transform duration-300 cursor-pointer text-sm md:text-base md:px-8">
            Spėti
          </button>
          <div
            ref={miniMapRef}
            className="w-64 h-48 md:w-80 md:h-56 rounded-lg shadow-lg border-2 text-white"
          />
        </div>
      </div>
    </APIProvider>
  );
}

export default Game;
