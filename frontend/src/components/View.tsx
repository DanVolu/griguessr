// import "./App.css";
// import Map from "./components/Map";
// import { createRoot } from "react-dom/client";
import { APIProvider, Map } from "@vis.gl/react-google-maps";

function View() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  console.log("API Key defined:", !!apiKey);
  return (
    <>
      <APIProvider apiKey={apiKey}>
        <div className="w-[50vw] h-[40vh]">
          <Map
            className="w-full h-full"
            defaultCenter={{ lat: 54.66916834898837, lng: 25.097128308571374 }}
            defaultZoom={14}
            gestureHandling={"greedy"}
            disableDefaultUI={false}
          />
        </div>
      </APIProvider>
    </>
  );
}

export default View;
