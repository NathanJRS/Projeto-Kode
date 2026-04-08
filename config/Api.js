const API_KEY = '3da7138b043947b18f21a5d898c4cb44';
const response = await fetch(
  `https://api.rawg.io/api/games?key=${API_KEY}&platforms=15` // platform 15 = PS2
);
const data = await response.json();