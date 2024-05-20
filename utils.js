export const screens = {
  Login: "LoginScreen",
  Map: "MapScreen",
  Movies: "MoviesScreen",
};

export const moviesURL = "https://dummyapi.online/api/movies";

export const mapsApiKey =
  "pk.eyJ1IjoiYmlmaW5iYWJ1IiwiYSI6ImNsd2V1M2U2NzFyd3Yyam10Yzg5czNvNWIifQ.L4qLI5rSwV2Ex_trWq2QGw";

export const mapTypes = {
  Satellite: "satellite",
  Standard: "standard",
  Terrain: "terrain",
};

export const getMapBoxUrl = (search) => {
  if (search) {
    return `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      search
    )}.json?access_token=${mapsApiKey}`;
  } else return "";
};
