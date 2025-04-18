import { useState, useRef, useEffect } from "react";
import { APIProvider } from "@vis.gl/react-google-maps";
import LOCATIONS from "../data/location";

function Game() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const streetViewRef = useRef<HTMLDivElement>(null);
  const miniMapRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const [gamePoints, setGamePoints] = useState(0);

  const [mapLoaded, setMapLoaded] = useState(false);
  // const [distance, setDistance]     = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const CLOSE_ENOUGH_KM = 5;

  const [randomLocation] = useState(
    LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)]
  );

  useEffect(() => {
    if (
      !mapLoaded ||
      !streetViewRef.current ||
      !miniMapRef.current ||
      !window.google?.maps?.geometry
    )
      return;

    new window.google.maps.StreetViewPanorama(streetViewRef.current, {
      position: randomLocation,
      pov: { heading: 180, pitch: 5 },
      disableDefaultUI: true,
    });

    const map = new window.google.maps.Map(miniMapRef.current, {
      center: { lat: 54.67, lng: 25.09 },
      zoom: 13,
      disableDefaultUI: true,
      gestureHandling: "greedy",
      clickableIcons: false,
      mapTypeId: "hybrid",
      styles: [
        { featureType: "poi", stylers: [{ visibility: "off" }] },
        { featureType: "transit", stylers: [{ visibility: "off" }] },
      ],
    });

    map.addListener("click", (e: google.maps.MapMouseEvent) => {
      const clicked = e.latLng;
      if (!clicked) return;

      markerRef.current?.setMap(null);

      markerRef.current = new window.google.maps.Marker({
        position: clicked,
        map,
      });

      const target = new window.google.maps.LatLng(
        randomLocation.lat,
        randomLocation.lng
      );

      const meters =
        window.google.maps.geometry.spherical.computeDistanceBetween(
          clicked,
          target
        );
      const km = meters / 1000;

      const score = Math.max(0, Math.round(500 - km * 750));
      setScore(score);

      if (km <= CLOSE_ENOUGH_KM) {
        console.log(
          `🎉 Within ${CLOSE_ENOUGH_KM} km — you scored ${score} points!`
        );
      }
    });
  }, [mapLoaded, randomLocation]);

  if (!randomLocation) return null;

  return (
    <APIProvider
      apiKey={apiKey}
      libraries={["geometry"]}
      version="weekly"
      onLoad={() => setMapLoaded(true)}
      onError={(err) => console.error("Google Maps failed to load", err)}
    >
      <div className="relative w-full h-screen">
        <div ref={streetViewRef} className="w-full h-full" />

        <div className="absolute top-1 left-1 z-50 rounded-md border-2 bg-[#A2BEEE] px-6 py-2 text-white font-semibold space-y-1">
          <p>Taškai:{gamePoints}</p>
        </div>

        <div className="absolute bottom-0 right-0 z-10 flex flex-col items-end py-4 px-2 gap-2">
          <button
            className="z-20 rounded-md border-2 bg-[#A2BEEE] w-64 md:w-80 px-6 py-2 text-white font-semibold hover:opacity-90 transition"
            onClick={() => {
              if (score > 0) {
                console.log(`Guessed: ${score}`);
                setGamePoints((prev) => prev + score);
              } else {
                console.log("Make a guess first");
              }
            }}
          >
            Spėti
          </button>

          <div
            ref={miniMapRef}
            className="w-64 h-48 md:w-80 md:h-56 rounded-lg shadow-lg border-2 border-white"
          />
        </div>
      </div>
    </APIProvider>
  );
}

export default Game;
