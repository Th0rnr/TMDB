import axios from "axios";
import {
  ConfigurationResponse,
  NowPlayingResponse,
  Genre,
  MovieDetailsResponse,
  CreditsResponse,
  ActorDetailsResponse,
  SearchMoviesResponse,
  SearchActorsResponse,
} from "../types/types";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  params: {
    api_key: API_KEY,
    include_adult: false,
  },
});

const fetchData = async <T>(url: string, params = {}): Promise<T> => {
  try {
    const response = await instance.get(url, {
      params: { ...params, include_adult: false },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    throw error;
  }
};

const validatePage = (page: number): number => {
  return page > 500 ? 500 : page;
};

export const getConfiguration = (): Promise<ConfigurationResponse> => {
  return fetchData<ConfigurationResponse>("/configuration");
};

export const getNowPlayingMovies = (
  page: number = 1
): Promise<NowPlayingResponse> => {
  return fetchData<NowPlayingResponse>("/movie/now_playing", {
    language: "en-US",
    page: validatePage(page),
  });
};

export const getTrendingMovies = (
  period: "day" | "week" = "day",
  page: number = 1
): Promise<NowPlayingResponse> => {
  return fetchData<NowPlayingResponse>(`/trending/movie/${period}`, {
    language: "en-US",
    page: validatePage(page),
  });
};

export const getTopRatedMovies = (
  page: number = 1
): Promise<NowPlayingResponse> => {
  return fetchData<NowPlayingResponse>("/movie/top_rated", {
    language: "en-US",
    page: validatePage(page),
  });
};

export const getMoviesByGenre = (
  genreId: number,
  page: number = 1
): Promise<NowPlayingResponse> => {
  return fetchData<NowPlayingResponse>("/discover/movie", {
    with_genres: genreId,
    language: "en-US",
    page: validatePage(page),
  });
};

export const getGenres = async (): Promise<Genre[]> => {
  const data = await fetchData<{ genres: Genre[] }>("/genre/movie/list", {
    language: "en-US",
  });
  return data.genres;
};

export const getMovieDetails = (
  movieId: number
): Promise<MovieDetailsResponse> => {
  return fetchData<MovieDetailsResponse>(`/movie/${movieId}`, {
    language: "en-US",
    append_to_response: "credits,videos",
  });
};

export const getSimilarMovies = (
  movieId: number,
  page: number = 1
): Promise<NowPlayingResponse> => {
  return fetchData<NowPlayingResponse>(`/movie/${movieId}/similar`, {
    language: "en-US",
    page: validatePage(page),
  });
};

export const getMovieCredits = (movieId: number): Promise<CreditsResponse> => {
  return fetchData<CreditsResponse>(`/movie/${movieId}/credits`, {
    language: "en-US",
  });
};

export const getActorDetails = (
  actorId: number
): Promise<ActorDetailsResponse> => {
  return fetchData<ActorDetailsResponse>(`/person/${actorId}`, {
    language: "en-US",
    append_to_response: "movie_credits",
  });
};

export const searchMovies = (
  query: string,
  page: number = 1
): Promise<SearchMoviesResponse> => {
  return fetchData<SearchMoviesResponse>("/search/movie", {
    query,
    language: "en-US",
    page: validatePage(page),
    include_adult: false,
  });
};

export const searchActors = (
  query: string,
  page: number = 1
): Promise<SearchActorsResponse> => {
  return fetchData<SearchActorsResponse>("/search/person", {
    query,
    language: "en-US",
    page: validatePage(page),
    include_adult: false,
  });
};
