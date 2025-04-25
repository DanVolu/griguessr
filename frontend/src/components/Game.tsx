import { useState, useRef, useEffect } from "react";
import { APIProvider } from "@vis.gl/react-google-maps";
import LOCATIONS from "../data/location";

function Game() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const streetViewRef = useRef<HTMLDivElement>(null);
  const miniMapRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const actualLocationMarkerRef = useRef<google.maps.Marker | null>(null);
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [score, setScore] = useState(0);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [hasGuessed, setHasGuessed] = useState(false);
  const [clickedLocation, setClickedLocation] =
    useState<google.maps.LatLng | null>(null);

  const [usedIndices, setUsedIndices] = useState<number[]>([]);
  const [round, setRound] = useState(1);
  const [gamePoints, setGamePoints] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [randomLocation, setRandomLocation] = useState(() => {
    const index = Math.floor(Math.random() * LOCATIONS.length);
    setUsedIndices([index]);
    return LOCATIONS[index];
  });

  const setupStreetView = () => {
    if (!streetViewRef.current || !randomLocation) return;

    new window.google.maps.StreetViewPanorama(streetViewRef.current, {
      position: randomLocation,
      pov: { heading: 180, pitch: 5 },
      disableDefaultUI: true,
      motionTracking: false,
    });
  };

  const setupMap = () => {
    if (!miniMapRef.current) return;

    const newMap = new window.google.maps.Map(miniMapRef.current, {
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

    setMap(newMap);

    newMap.addListener("click", (e: google.maps.MapMouseEvent) => {
      if (hasGuessed) return;

      const clicked = e.latLng;
      if (!clicked) return;

      setClickedLocation(clicked);

      if (markerRef.current) {
        markerRef.current.setMap(null);
      }

      markerRef.current = new window.google.maps.Marker({
        position: clicked,
        map: newMap,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#4285F4",
          fillOpacity: 1,
          strokeColor: "#FFFFFF",
          strokeWeight: 2,
        },
      });

      if (!randomLocation) return;

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
    });
  };

  useEffect(() => {
    if (!mapLoaded || !window.google?.maps?.geometry) return;
    setupStreetView();
    setupMap();
        // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapLoaded, randomLocation]);

  const revealActualLocation = () => {
    if (!map || !clickedLocation || !randomLocation) return;

    if (actualLocationMarkerRef.current) {
      actualLocationMarkerRef.current.setMap(null);
    }

    if (polylineRef.current) {
      polylineRef.current.setMap(null);
    }

    actualLocationMarkerRef.current = new window.google.maps.Marker({
      position: {
        lat: randomLocation.lat,
        lng: randomLocation.lng,
      },
      map: map,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: "#FF0000",
        fillOpacity: 1,
        strokeColor: "#FFFFFF",
        strokeWeight: 2,
      },
      title: "Actual Location",
    });

    polylineRef.current = new window.google.maps.Polyline({
      path: [
        clickedLocation.toJSON(),
        { lat: randomLocation.lat, lng: randomLocation.lng },
      ],
      geodesic: true,
      strokeColor: "#FFFFFF",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      map: map,
    });

    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend(clickedLocation);
    bounds.extend(
      new window.google.maps.LatLng(randomLocation.lat, randomLocation.lng)
    );
    map.fitBounds(bounds, 50);
  };

  const startNewRound = () => {
    if (markerRef.current) {
      markerRef.current.setMap(null);
      markerRef.current = null;
    }

    if (actualLocationMarkerRef.current) {
      actualLocationMarkerRef.current.setMap(null);
      actualLocationMarkerRef.current = null;
    }

    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }

    setHasGuessed(false);
    setClickedLocation(null);
    setScore(0);

    if (round >= 5) {
      setHighScore((prev) => Math.max(prev, gamePoints));
      setGamePoints(0);
      setRound(1);
      setUsedIndices([]);
      const index = Math.floor(Math.random() * LOCATIONS.length);
      setUsedIndices([index]);
      setRandomLocation(LOCATIONS[index]);
    } else {
      let index;
      do {
        index = Math.floor(Math.random() * LOCATIONS.length);
      } while (usedIndices.includes(index));

      setUsedIndices([...usedIndices, index]);
      setRandomLocation(LOCATIONS[index]);
      setRound((prev) => prev + 1);
    }

    if (map) {
      map.setCenter({ lat: 54.67, lng: 25.09 });
      map.setZoom(13);
    }
  };

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

        <div className="absolute top-1 left-1 z-50 rounded-md border-2 bg-[#2D3E2B] px-6 py-2 text-white font-semibold space-y-1">
          <p>Taškai: {gamePoints}</p>
          <p>Geriausias rezultatas: {highScore}</p>
          <p>Turas: {round}/5</p>
        </div>

        <div className="absolute bottom-0 right-0 z-10 flex flex-col items-end py-4 px-2 gap-2">
          {!hasGuessed ? (
            <button
              className="z-20 rounded-md border-2 bg-[#2D3E2B] w-64 md:w-80 px-6 py-2 cursor-pointer text-white font-semibold hover:opacity-90 transition"
              onClick={() => {
                if (clickedLocation) {
                  if (score > 0) {
                    setGamePoints((prev) => prev + score);
                  }
                  revealActualLocation();
                  setHasGuessed(true);
                }
              }}
            >
              Spėti
            </button>
          ) : (
            <button
              className="z-20 rounded-md border-2 bg-[#2D3E2B] w-64 md:w-80 px-6 py-2 cursor-pointer text-white font-semibold hover:opacity-90 transition"
              onClick={startNewRound}
            >
              Kitas turas
            </button>
          )}

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
