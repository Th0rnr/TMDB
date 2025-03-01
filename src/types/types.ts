export interface ConfigurationResponse {
  images: {
    base_url: string;
    secure_base_url: string;
    backdrop_sizes: string[];
    logo_sizes: string[];
    poster_sizes: string[];
    profile_sizes: string[];
    still_sizes: string[];
  };
  change_keys: string[];
}

export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  adult: boolean;
  overview: string;
}

export interface SimilarMoviesResponse {
  results: Movie[];
  total_results: number;
}

export interface NowPlayingResponse {
  results: Movie[];
  total_pages: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface CreditsResponse {
  cast: Cast[];
  crew: Crew[];
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string;
  title: string;
  poster_path: string;
  adult: boolean;
}

export interface Crew {
  id: number;
  name: string;
  job: string;
  profile_path: string;
  poster_path: string;
  adult: boolean;
}

export interface MovieDetailsResponse {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  runtime: number;
  genres: Genre[];
  credits: CreditsResponse;
  vote_average: number;
  vote_count: number;
  videos: {
    results: Video[];
  };
  tagline: string;
  belongs_to_collection?: Collection | null;
  homepage: string;
  original_title?: string;
  original_language?: string;
  popularity?: number;
  status?: string;
  production_companies?: ProductionCompany[];
  production_countries?: ProductionCountry[];
  spoken_languages?: SpokenLanguage[];
  adult: boolean;
  similar: SimilarMoviesResponse;
}

export interface Collection {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
}

export interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  iso_639_1: string;
  name: string;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface ActorDetailsResponse {
  id: number;
  name: string;
  biography: string;
  birthday: string;
  deathday: string | null;
  place_of_birth: string;
  profile_path: string;
  also_known_as: string[];
  gender: number;
  adult: boolean;
  homepage: string | null;
  imdb_id: string;
  known_for_department: string;
  popularity: number;
  movie_credits: CreditsResponse;
}

export interface SearchMoviesResponse {
  results: Movie[];
  total_pages: number;
  total_results: number;
  page: number;
}

export interface SearchActorsResponse {
  results: Actor[];
  total_pages: number;
  total_results: number;
  page: number;
}

export interface Actor {
  id: number;
  name: string;
  profile_path: string;
  adult: boolean;
}
