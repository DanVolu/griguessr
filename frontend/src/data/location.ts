const latLongs = [
  [54.66512909942076, 25.09538578295798],
  [54.66741001672653, 25.09076142424579],
  [54.66797455433578, 25.10996302910275],
  [54.672726618617524, 25.091009812385252],
  [54.673749374355445, 25.081650638982797],
  [54.67898923247215, 25.076361082362176],
  [54.67185417671798, 25.091155115373883],
  [54.67324735493895, 25.085717341414043],
];

const LOCATIONS = latLongs.map((coords, index) => ({
  name: `Location ${index + 1}`,
  lat: coords[0],
  lng: coords[1],
}));

export default LOCATIONS;
