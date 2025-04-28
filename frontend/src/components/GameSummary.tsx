import { useRef, useEffect } from "react";

interface RoundResult {
  round: number;
  score: number;
  guessLocation: { lat: number; lng: number } | null;
  actualLocation: { lat: number; lng: number } | null;
  distance: number | null;
}

interface GameSummaryProps {
  rounds: RoundResult[];
  totalScore: number;
  highScore: number;
  onPlayAgain: () => void;
  onReturnToMenu: () => void;
}

function GameSummary({
  rounds,
  totalScore,
  highScore,
  onPlayAgain,
  onReturnToMenu,
}: GameSummaryProps) {
  const summaryMapRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const polylinesRef = useRef<google.maps.Polyline[]>([]);

  useEffect(() => {
    if (
      !summaryMapRef.current ||
      !window.google?.maps?.geometry ||
      rounds.length === 0
    )
      return;
    const map = new window.google.maps.Map(summaryMapRef.current, {
      center: { lat: 54.67, lng: 25.09 },
      zoom: 27,
      disableDefaultUI: true,
      gestureHandling: "greedy",
      clickableIcons: false,
      mapTypeId: "hybrid",
      styles: [
        { featureType: "poi", stylers: [{ visibility: "off" }] },
        { featureType: "transit", stylers: [{ visibility: "off" }] },
      ],
    });
    mapRef.current = map;
    const bounds = new window.google.maps.LatLngBounds();
    rounds.forEach((result, index) => {
      if (!result.guessLocation || !result.actualLocation) return;
      const guessMarker = new window.google.maps.Marker({
        position: result.guessLocation,
        map: map,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#4285F4",
          fillOpacity: 1,
          strokeColor: "#FFFFFF",
          strokeWeight: 2,
        },
        label: {
          text: `${index + 1}`,
          color: "#FFFFFF",
          fontSize: "12px",
          fontWeight: "bold",
        },
      });
      markersRef.current.push(guessMarker);
      const actualMarker = new window.google.maps.Marker({
        position: result.actualLocation,
        map: map,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#FF0000",
          fillOpacity: 1,
          strokeColor: "#FFFFFF",
          strokeWeight: 2,
        },
        label: {
          text: `${index + 1}`,
          color: "#FFFFFF",
          fontSize: "12px",
          fontWeight: "bold",
        },
      });
      markersRef.current.push(actualMarker);
      const polyline = new window.google.maps.Polyline({
        path: [result.guessLocation, result.actualLocation],
        geodesic: true,
        strokeColor: "#FFFFFF",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        map: map,
      });
      polylinesRef.current.push(polyline);
      bounds.extend(
        new window.google.maps.LatLng(
          result.guessLocation.lat,
          result.guessLocation.lng
        )
      );
      bounds.extend(
        new window.google.maps.LatLng(
          result.actualLocation.lat,
          result.actualLocation.lng
        )
      );
    });
    map.fitBounds(bounds, 50);
    return () => {
      markersRef.current.forEach((marker) => marker.setMap(null));
      polylinesRef.current.forEach((polyline) => polyline.setMap(null));
      markersRef.current = [];
      polylinesRef.current = [];
    };
  }, [rounds]);

  const averageScore =
    rounds.length > 0
      ? Math.round(
          rounds.reduce((sum, round) => sum + round.score, 0) / rounds.length
        )
      : 0;
  const averageDistance =
    rounds.length > 0 && rounds.every((r) => r.distance !== null)
      ? Math.round(
          rounds.reduce((sum, round) => sum + (round.distance || 0), 0) /
            rounds.length
        )
      : null;

  return (
    <div className="flex flex-col items-center justify-start h-fit w-full bg-gray-900 text-white py-6 overflow-auto">
      <div className="mb-4 text-center">
        <h1 className="text-3xl font-bold text-green-400 mb-2">
          Žaidimo rezultatai
        </h1>

        <div className="flex justify-center mb-4">
          <a
            href="https://ko-fi.com/danvol"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-[#FF5E5B] hover:bg-[#FF7775] text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 7.324-.022 11.822c.164 2.424 2.586 2.672 2.586 2.672s8.267-.023 11.966-.049c2.438-.426 2.683-2.566 2.658-3.734 4.352.24 7.422-2.831 6.649-6.916zm-11.062 3.511c-1.246 1.453-4.011 3.976-4.011 3.976s-.121.119-.31.023c-.076-.057-.108-.09-.108-.09-.443-.441-3.368-3.049-4.034-3.954-.709-.965-1.041-2.7-.091-3.71.951-1.01 3.005-1.086 4.363.407 0 0 1.565-1.782 3.468-.963 1.904.82 1.832 3.011.723 4.311zm6.173.478c-.928.116-1.682.028-1.682.028V7.284h1.77s1.971.551 1.971 2.638c0 1.913-.985 2.667-2.059 3.015z" />
            </svg>
            Patiko žaidimas? Nupirk man kavos!
          </a>
        </div>

        <div className="flex justify-center space-x-8 mb-4">
          <div className="text-center">
            <p className="text-gray-400 text-sm">Bendras rezultatas</p>
            <p className="text-4xl font-bold text-green-400">{totalScore}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm">Geriausias rezultatas</p>
            <p className="text-4xl font-bold text-yellow-400">{highScore}</p>
          </div>
        </div>
        <div className="flex justify-center space-x-8">
          <div className="text-center">
            <p className="text-gray-400 text-sm">Vid. rezultatas per turą</p>
            <p className="text-2xl font-bold">{averageScore}</p>
          </div>
          {averageDistance !== null && (
            <div className="text-center">
              <p className="text-gray-400 text-sm">Vid. atstumas</p>
              <p className="text-2xl font-bold">
                {(averageDistance / 1000).toFixed(2)} km
              </p>
            </div>
          )}
        </div>
      </div>

      <div
        ref={summaryMapRef}
        className="w-full h-[25rem] max-w-5xl rounded-lg shadow-xl border-2 border-gray-700 mb-6"
      />

      <div className="w-full max-w-5xl">
        <h2 className="text-xl font-bold mb-4 px-4">Turai:</h2>
        <div className="flex flex-col space-y-3 px-4">
          {rounds.map((round, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-lg p-4 flex justify-between items-center"
            >
              <div className="flex items-center">
                <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4">
                  {index + 1}
                </div>
                <div>
                  <p className="font-bold text-lg">{round.score} taškų</p>
                  {round.distance !== null && (
                    <p className="text-gray-400 text-sm">
                      Atstumas: {(round.distance / 1000).toFixed(2)} km
                    </p>
                  )}
                </div>
              </div>
              <div>
                {round.score === 0 ? (
                  <span className="text-red-400">Per toli!</span>
                ) : round.score > 400 ? (
                  <span className="text-green-400">Nuostabus!</span>
                ) : round.score > 200 ? (
                  <span className="text-green-300">Geras!</span>
                ) : (
                  <span className="text-yellow-300">Neblogai</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex space-x-4 mt-8 mb-6">
        <button
          onClick={onPlayAgain}
          className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-lg cursor-pointer"
        >
          Žaisti dar kartą
        </button>
        <button
          onClick={onReturnToMenu}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-lg cursor-pointer"
        >
          Grįžti į meniu
        </button>
      </div>
    </div>
  );
}

export default GameSummary;
