export interface Film {
  id: number;
  title: string;
  episode_id: string;
  opening_crawl: string;
  director: string;
  producer: string;
  release_date: string;
  image_url: string;
  created: string;
  edited: string;
  characters_count: number;
  planets_count: number;
  starships_count: number;
  vehicles_count: number;
  species_count: number;
  characters: People[];
  planets: Planet[];
  starships: Starship[];
  vehicles: Vehicle[];
  species: Species[];
}

export interface People {
  id: number;
  name: string;
  birth_year: string;
  eye_color: string;
  hair_color: string;
  height: string;
  mass: string;
  skin_color: string;
  wiki_link: string;
  image_url: string;
  affiliations: string[];
  created: string;
  edited: string;
  films_count: number;
  species_count: number;
  starships_count: number;
  vehicles_count: number;
  homeworld: {
    id: number;
    name: string;
  };
  films: Film[];
  starships: Starship[];
  vehicles: Vehicle[];
}
export interface Planet {
  id: number;
  name: string;
  rotation_period: string;
  orbital_period: string;
  diameter: string;
  climate: string;
  gravity: string;
  terrain: string;
  surface_water: string;
  population: string;
  created: string;
  edited: string;
  residents_count: number;
  films_count: number;
  residents: People[];
  films: Film[];
}
export interface Species {
  id: number;
  name: string;
  classification: string;
  designation: string;
  average_height: string;
  average_lifespan: string;
  eye_colors: string;
  hair_colors: string;
  skin_colors: string;
  language: string;
  created: string;
  edited: string;
  people_count: number;
  films_count: number;
  homeworld: {
    id: number;
    name: string;
  };
  people: People[];
  films: Film[];
}
export interface Starship {
  id: number;
  name: string;
  model: string;
  starship_class: string;
  manufacturer: string;
  cost_in_credits: string;
  length: string;
  crew: string;
  passengers: string;
  max_atmosphering_speed: string;
  hyperdrive_rating: string;
  MGLT: string;
  cargo_capacity: string;
  consumables: string;
  created: string;
  edited: string;
  pilots_count: number;
  films_count: number;
  pilots: People[];
  films: Film[];
}
export interface Vehicle {
  id: number;
  name: string;
  model: string;
  vehicle_class: string;
  manufacturer: string;
  length: string;
  cost_in_credits: string;
  crew: string;
  passengers: string;
  max_atmosphering_speed: string;
  cargo_capacity: string;
  consumables: string;
  created: string;
  edited: string;
  pilots_count: number;
  films_count: number;
  pilots: People[];
  films: Film[];
}
