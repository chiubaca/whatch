import { ref } from "vue";
import axios from "axios";
import { TrendingShows, Show } from "../types";

const movieList = ref<Show[]>([]);
const tvList = ref<Show[]>([]);
let baseURL: string;

/**
 * Setup dev & prod base urls so that it works both locally and in Netlify
 */
if (process.env.NODE_ENV === "development") {
  console.log("Dev API", process.env.NODE_ENV);
  baseURL = process.env.VUE_APP_DEV_API_BASE_URL;
}
if (process.env.NODE_ENV === "production") {
  console.log("Prod API", process.env.NODE_ENV);
  baseURL = `https://${document.location.hostname}/.netlify/functions`;
}

/**
 * Get top 20 trending movies from MovieDB API
 */
async function getMovies(): Promise<TrendingShows> {
  const trendingMovies = await axios.get(`${baseURL}/movies`);

  (trendingMovies.data as TrendingShows).results.forEach((movie) => {
    movieList.value.push(movie);
  });
  return trendingMovies.data;
}

/**
 * Get top 20 trending TV shows from MovieDB API
 */
async function getTvShows(): Promise<TrendingShows> {
  const trendingTv = await axios.get(`${baseURL}/tv`);

  (trendingTv.data as TrendingShows).results.forEach((tvShow) => {
    tvList.value.push(tvShow);
  });
  return trendingTv.data;
}

/**
 * Get movie recomendations
 */
async function getMovieRecomendation(movieId: any): Promise<Show[]> {
  try {
    const recomendations = await axios.get(
      `${baseURL}/movie-recomendations?id=${movieId}`
    );
    if (recomendations.data.error) {
      console.log("no data for this movie ID");
      return [];
    }

    return recomendations.data.results;
  } catch (err) {
    console.error("There was problem with the API", err);
    return [];
  }
}

/**
 * Get movie recomendations
 */
async function getTvRecomendation(tvId: any): Promise<Show[]> {
  try {
    const recomendations = await axios.get(
      `${baseURL}/tv-recomendations?id=${tvId}`
    );
    if (recomendations.data.error) {
      console.log("no data for this tv ID");
      return [];
    }

    return recomendations.data.results;
  } catch (err) {
    console.error("There was problem with the API", err);
    return [];
  }
}

export {
  movieList,
  tvList,
  getMovies,
  getTvShows,
  getMovieRecomendation,
  getTvRecomendation,
};
