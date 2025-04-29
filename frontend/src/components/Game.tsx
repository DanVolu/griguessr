import { useState, useRef, useEffect } from "react";
import { APIProvider } from "@vis.gl/react-google-maps";
import LOCATIONS from "../data/location";
import StartMenu from "./StartMenu";
import GameSummary from "./GameSummary";
import ExplanationModal from "./ExplanationModal";

function Game() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const streetViewRef = useRef<HTMLDivElement>(null);
  const miniMapRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const actualLocationMarkerRef = useRef<google.maps.Marker | null>(null);
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  const [showStartMenu, setShowStartMenu] = useState(true);
  const [showGameSummary, setShowGameSummary] = useState(false);
  const [showExplanationModal, setShowExplanationModal] = useState(false);
  const [gameStarting, setGameStarting] = useState(false);
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
  const [roundResults, setRoundResults] = useState<
    Array<{
      round: number;
      score: number;
      guessLocation: { lat: number; lng: number } | null;
      actualLocation: { lat: number; lng: number } | null;
      distance: number | null;
    }>
  >([]);
  const [randomLocation, setRandomLocation] = useState(() => {
    const index = Math.floor(Math.random() * LOCATIONS.length);
    setUsedIndices([index]);
    return LOCATIONS[index];
  });

  const setupStreetView = () => {
    if (!streetViewRef.current || !randomLocation) return;

    new window.google.maps.StreetViewPanorama(streetViewRef.current, {
      position: randomLocation,
      pov: { heading: 220, pitch: 5 },
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
    if (
      !mapLoaded ||
      !window.google?.maps?.geometry ||
      showStartMenu ||
      showGameSummary ||
      showExplanationModal
    )
      return;
    setupStreetView();
    setupMap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    mapLoaded,
    randomLocation,
    showStartMenu,
    showGameSummary,
    showExplanationModal,
  ]);

  const revealActualLocation = () => {
    if (!map || !clickedLocation || !randomLocation) return;

    if (actualLocationMarkerRef.current) {
      actualLocationMarkerRef.current.setMap(null);
    }

    if (polylineRef.current) {
      polylineRef.current.setMap(null);
    }

    actualLocationMarkerRef.current = new window.google.maps.Marker({
      position: { lat: randomLocation.lat, lng: randomLocation.lng },
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

  const saveRoundResult = () => {
    if (!clickedLocation || !randomLocation) return;

    const target = new window.google.maps.LatLng(
      randomLocation.lat,
      randomLocation.lng
    );
    const meters = window.google.maps.geometry.spherical.computeDistanceBetween(
      clickedLocation,
      target
    );

    const roundResult = {
      round: round,
      score: score,
      guessLocation: clickedLocation.toJSON(),
      actualLocation: { lat: randomLocation.lat, lng: randomLocation.lng },
      distance: meters,
    };

    setRoundResults((prev) => [...prev, roundResult]);
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
      setShowGameSummary(true);
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

  const handleStartGame = () => {
    setGameStarting(true);
    setShowExplanationModal(true);
  };

  const handleExplanationClose = () => {
    setShowExplanationModal(false);
    if (gameStarting) {
      setGameStarting(false);
      setShowStartMenu(false);
    }
  };

  const handlePlayAgain = () => {
    setGamePoints(0);
    setRound(1);
    setRoundResults([]);
    setUsedIndices([]);
    const index = Math.floor(Math.random() * LOCATIONS.length);
    setUsedIndices([index]);
    setRandomLocation(LOCATIONS[index]);
    setShowGameSummary(false);
  };

  const handleReturnToMenu = () => {
    setGamePoints(0);
    setRound(1);
    setRoundResults([]);
    setUsedIndices([]);
    const index = Math.floor(Math.random() * LOCATIONS.length);
    setUsedIndices([index]);
    setRandomLocation(LOCATIONS[index]);
    setShowGameSummary(false);
    setShowStartMenu(true);
  };

  function renderScoreDisplay() {
    return (
      <div className="fixed md:top-4 top-16 left-4 z-50 bg-black rounded-lg p-4 text-white shadow-xl backdrop-blur-md border border-gray-700">
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-300 font-medium">Taškai</span>
            <span className="text-2xl font-bold text-green-400 pl-4">
              {gamePoints}
            </span>
          </div>
          <div className="h-px w-full bg-gray-700 opacity-50"></div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-300 font-medium">
              Geriausias rezultatas
            </span>
            <span className="text-xl font-bold text-yellow-400 pl-4">
              {highScore}
            </span>
          </div>
        </div>
      </div>
    );
  }

  function renderRoundDisplay() {
    return (
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-black/70 rounded-full px-6 py-2 flex space-x-4 shadow-lg backdrop-blur-md">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full ${
              i < round
                ? "bg-green-400 shadow-green-400/30 shadow-md"
                : "bg-gray-500"
            }`}
          />
        ))}
      </div>
    );
  }

  const renderGuessUI = () => {
    return (
      <div className="absolute bottom-4 right-4 z-10 flex flex-col items-end gap-3">
        {!hasGuessed ? (
          <button
            className={`z-20 flex items-center justify-center rounded-lg bg-gradient-to-r from-green-600 to-green-700 w-64 md:w-80 px-6 py-3 text-white font-bold shadow-lg hover:from-green-500 hover:to-green-600 transition transform hover:scale-105 ${
              !clickedLocation ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => {
              if (clickedLocation) {
                if (score > 0) {
                  setGamePoints((prev) => prev + score);
                }
                revealActualLocation();
                saveRoundResult();
                setHasGuessed(true);
              }
            }}
            disabled={!clickedLocation}
          >
            Spėti
          </button>
        ) : (
          <button
            className="z-20 flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 w-64 md:w-80 px-6 py-3 text-white font-bold shadow-lg hover:from-blue-500 hover:to-blue-600 transition transform hover:scale-105"
            onClick={startNewRound}
          >
            Kitas turas
          </button>
        )}
        <div
          ref={miniMapRef}
          className="w-64 h-48 md:w-80 md:h-56 rounded-lg shadow-xl border-2 border-gray-300"
        />
        {hasGuessed && (
          <div className="bg-black bg-opacity-80 rounded-lg p-3 text-center w-64 md:w-80">
            <div className="text-white">
              <div className="font-bold text-lg">
                {score === 0
                  ? "Per toli!"
                  : score > 400
                  ? "Nuostabus spėjimas!"
                  : score > 200
                  ? "Geras spėjimas!"
                  : "Neblogai!"}
              </div>
              <div className="text-sm text-gray-300">
                Jūs surinkote
                <span className="text-green-400 font-bold"> {score}</span> taškų
              </div>
            </div>
          </div>
        )}
      </div>
    );
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
      {showStartMenu ? (
        <StartMenu
          onStartGame={handleStartGame}
          onShowHelp={() => setShowExplanationModal(true)}
        />
      ) : showGameSummary ? (
        <GameSummary
          rounds={roundResults}
          totalScore={gamePoints}
          highScore={highScore}
          onPlayAgain={handlePlayAgain}
          onReturnToMenu={handleReturnToMenu}
        />
      ) : (
        <div className="relative w-full h-screen overflow-hidden">
          <div ref={streetViewRef} className="w-full h-full" />
          {renderScoreDisplay()}
          {renderRoundDisplay()}
          {renderGuessUI()}

          <button
            onClick={() => setShowExplanationModal(true)}
            className="absolute top-4 right-16 z-50 bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-full shadow-lg transition transform hover:scale-110"
            title="Kaip žaisti?"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M12 21a9 9 0 100-18 9 9 0 000 18z"
              />
            </svg>
          </button>

          <button
            onClick={() => setShowStartMenu(true)}
            className="absolute top-4 right-4 z-50 bg-red-600 hover:bg-red-500 text-white p-2 rounded-full shadow-lg transition transform hover:scale-110"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}

      <ExplanationModal
        isOpen={showExplanationModal}
        onClose={handleExplanationClose}
      />
    </APIProvider>
  );
}

export default Game;
