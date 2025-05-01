import { useState } from "react";

interface StartMenuProps {
  onStartGame: () => void;
  onShowHelp: () => void;
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
        <h1 className="text-5xl font-bold text-white mb-2">Kur? Čia!</h1>
        <p className="text-xl text-gray-100">
          Patikrink savo miesto geografijos žinias
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

      <div className="absolute bottom-6 right-6 flex items-center space-x-2 text-white opacity-80 hover:opacity-100 transition-opacity z-10">
        <span className="text-sm">v0.1</span>
        <a 
          href="https://github.com/DanVolu" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center text-white hover:text-gray-300 transition-colors"
          title="View on GitHub"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        </a>
      </div>
    </div>
  );
}

export default StartMenu;