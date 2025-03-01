import axios from "axios";
import {
  Film,
  People,
  Planet,
  Species,
  Starship,
  Vehicle,
} from "../types/apiTypes";

const API_URL = "https://swapi.thehiveresistance.com/api";

const fetchData = async <T>(endpoint: string, params = {}): Promise<T> => {
  const response = await axios.get<T>(`${API_URL}/${endpoint}`, { params });
  return response.data;
};
interface FetchParams {
  search?: string;
  page?: number;
  query?: string;
}

const getResource = async <T>(
  resource: string,
  params: FetchParams = {}
): Promise<T[]> => {
  const response = await fetchData<{ data: T[] }>(resource, params);
  return response.data;
};

const getResourceById = <T>(resource: string, id: string): Promise<T> => {
  return fetchData<T>(`${resource}/${id}`);
};

export const api = {
  films: {
    list: (params: FetchParams = {}) => getResource<Film>("films", params),
    detail: (id: string) => getResourceById<Film>("films", id),
  },
  people: {
    list: (params: FetchParams = {}) => getResource<People>("people", params),
    detail: (id: string) => getResourceById<People>("people", id),
  },
  planets: {
    list: (params: FetchParams = {}) => getResource<Planet>("planets", params),
    detail: (id: string) => getResourceById<Planet>("planets", id),
  },
  species: {
    list: (params: FetchParams = {}) => getResource<Species>("species", params),
    detail: (id: string) => getResourceById<Species>("species", id),
  },
  starships: {
    list: (params: FetchParams = {}) =>
      getResource<Starship>("starships", params),
    detail: (id: string) => getResourceById<Starship>("starships", id),
  },
  vehicles: {
    list: (params: FetchParams = {}) =>
      getResource<Vehicle>("vehicles", params),
    detail: (id: string) => getResourceById<Vehicle>("vehicles", id),
  },
};
