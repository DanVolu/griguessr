GeoGuess Game (Lite)

This is a stripped-down GeoGuessr-style guessing game using Google Maps.


How it works

You get dropped into a random location in Street View.

Click somewhere on the mini-map to guess where you think you are.

Click "Spėti" (Guess) to lock in your answer and earn points.

The closer you are, the more points you get (max 500, fades fast after 5km).


Dev setup
Clone this repo

Add a .env with your Google Maps API key:

VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
Run it:

npm install
npm run dev

Notes
Uses Google Maps JS SDK via @vis.gl/react-google-maps

Locations come from a local JSON file (/data/location.js)