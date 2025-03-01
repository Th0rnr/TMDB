import { useState, useEffect } from "react";
import { useQueries } from "@tanstack/react-query";
import { searchMovies, searchActors } from "../services/api";
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
} from "react-bootstrap";
import { Movie, Actor } from "../types/types";
import { Link, useSearchParams } from "react-router-dom";
import { useDebounce } from "../hooks/useDebounce";

interface SearchBarProps {
  setSearchActive: (active: boolean) => void;
}

const SearchBar = ({ setSearchActive }: SearchBarProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get("query") || "";
  const [query, setQuery] = useState(queryParam);
  const [searchClicked, setSearchClicked] = useState(false);
  const placeholderImageUrl =
    "https://via.placeholder.com/300x450?text=No+Image+Available";

  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    setSearchActive(debouncedQuery.length > 0);
    if (debouncedQuery.length === 0) {
      setSearchClicked(false);
    }
  }, [debouncedQuery, setSearchActive]);

  useEffect(() => {
    if (searchClicked && debouncedQuery.length > 0) {
      setSearchParams({ query: debouncedQuery });
    }
  }, [debouncedQuery, searchClicked, setSearchParams]);

  const queries = [
    {
      queryKey: ["searchMovies", debouncedQuery],
      queryFn: () => searchMovies(debouncedQuery, 1),
      enabled: debouncedQuery.length > 0,
    },
    {
      queryKey: ["searchActors", debouncedQuery],
      queryFn: () => searchActors(debouncedQuery, 1),
      enabled: debouncedQuery.length > 0,
    },
  ];

  const results = useQueries({ queries });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchClicked(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const isLoading = results.some((result) => result.isLoading);
  const error = results.find((result) => result.error)?.error;
  const movies = (results[0]?.data as { results: Movie[] })?.results || [];
  const actors = (results[1]?.data as { results: Actor[] })?.results || [];

  const noResults =
    searchClicked &&
    !isLoading &&
    !error &&
    movies.length === 0 &&
    actors.length === 0;

  return (
    <Container className="movies-container">
      <Form onSubmit={handleSearch} className="mb-4">
        <Row className="align-items-center">
          <Col xs={12} md={10} className="mb-2 mb-md-0">
            <Form.Control
              type="text"
              placeholder="Search for movies or actors..."
              value={query}
              onChange={handleChange}
              className="search-input"
            />
          </Col>
          <Col xs={12} md={2} className="d-grid">
            <Button
              type="submit"
              variant="primary"
              className="search-button"
              disabled={!query}
            >
              Search
            </Button>
          </Col>
        </Row>
      </Form>
      {searchClicked && !isLoading && !error && debouncedQuery.length > 0 && (
        <>
          <h4 className="mb-4">Search results for "{debouncedQuery}":</h4>
          <h5 className="mb-4">
            Found {movies.length + actors.length} results
          </h5>
        </>
      )}
      <Row className="movies-row">
        {isLoading ? (
          <div className="loading-spinner-overlay">
            <Spinner
              animation="border"
              role="status"
              className="loading-spinner"
            >
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : error ? (
          <Alert variant="danger">{(error as Error).message}</Alert>
        ) : noResults ? (
          <Alert variant="warning">No results found.</Alert>
        ) : (
          <>
            {movies.map((movie: Movie) => (
              <Col
                key={movie.id}
                className="movie-col"
                xs={12}
                sm={6}
                md={4}
                lg={3}
              >
                <Card className="movie-card">
                  <Link to={`/movie/${movie.id}`}>
                    <Card.Img
                      variant="top"
                      src={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                          : placeholderImageUrl
                      }
                      alt={movie.title}
                      className="movie-poster"
                    />
                  </Link>
                  <Card.Body className="movie-body">
                    <Card.Title className="movie-title">
                      {movie.title}
                    </Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            ))}
            {actors.map((actor: Actor) => (
              <Col
                key={actor.id}
                className="movie-col"
                xs={12}
                sm={6}
                md={4}
                lg={3}
              >
                <Card className="movie-card">
                  <Link to={`/actor/${actor.id}`}>
                    <Card.Img
                      variant="top"
                      src={
                        actor.profile_path
                          ? `https://image.tmdb.org/t/p/w500${actor.profile_path}`
                          : placeholderImageUrl
                      }
                      alt={actor.name}
                      className="movie-poster"
                    />
                  </Link>
                  <Card.Body className="movie-body">
                    <Card.Title className="movie-title">
                      {actor.name}
                    </Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </>
        )}
      </Row>
    </Container>
  );
};

export default SearchBar;
