// import "./App.css";
// import Map from "./components/Map";
// import { createRoot } from "react-dom/client";
import { APIProvider, Map } from "@vis.gl/react-google-maps";

function View() {
  return (
    <>
      <APIProvider apiKey={"AIzaSyD1zP_G8s-Eda3PFfIuaCxWSQipLDKb8dc"}>
        <Map
          style={{ width: "50vw", height: "40vh" }}
          // className="vw-50 vh-40"
          defaultCenter={{ lat: 54.66916834898837,  lng: 25.097128308571374, }}
          defaultZoom={14}
          gestureHandling={"greedy"}
          disableDefaultUI={true}
        />
      </APIProvider>
      {/* <Map/> */}
    </>
  );
}

export default View;
