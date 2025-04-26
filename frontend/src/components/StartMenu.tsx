import { useState } from "react";

interface StartMenuProps {
  onStartGame: () => void;
}

function StartMenu({ onStartGame }: StartMenuProps) {
  const [hover, setHover] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-center justify-center h-screen relative overflow-hidden">
      <div
        className="absolute inset-0 bg-green-800"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Crect width='16' height='16' x='0' y='0' fill='%23507A32' /%3E%3Crect width='16' height='16' x='16' y='0' fill='%23558B2F' /%3E%3Crect width='16' height='16' x='0' y='16' fill='%23558B2F' /%3E%3Crect width='16' height='16' x='16' y='16' fill='%23507A32' /%3E%3C/svg%3E")`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="text-center mb-12 relative z-10">
        <h1 className="text-5xl font-bold text-white mb-2">Žinai Kur?</h1>
        <p className="text-xl text-gray-100">
          Patikrink savo geografijos žinias
        </p>
      </div>

      <div className="flex flex-col w-64 space-y-4 relative z-10">
        <button
          className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-500 shadow-lg"
          onClick={onStartGame}
          onMouseEnter={() => setHover("play")}
          onMouseLeave={() => setHover(null)}
        >
          {hover === "play" ? "Pirmyn!" : "Žaisti"}
        </button>

        <button
          className="bg-gray-600 text-gray-300 font-bold py-3 px-6 rounded-lg cursor-not-allowed opacity-70"
          disabled
          onMouseEnter={() => setHover("region")}
          onMouseLeave={() => setHover(null)}
        >
          {hover === "region" ? "Netrukus" : "Regionas"}
        </button>

        <button
          className="bg-gray-600 text-gray-300 font-bold py-3 px-6 rounded-lg cursor-not-allowed opacity-70"
          disabled
          onMouseEnter={() => setHover("difficulty")}
          onMouseLeave={() => setHover(null)}
        >
          {hover === "difficulty" ? "Netrukus" : "Sunkumas"}
        </button>
      </div>

      <div className="mt-16 text-gray-200 text-sm relative z-10">
        {/* <p>versija 0.8</p> */}
      </div>
    </div>
  );
}

export default StartMenu;
