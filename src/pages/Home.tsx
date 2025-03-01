import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getNowPlayingMovies,
  getTrendingMovies,
  getTopRatedMovies,
  getGenres,
} from "../services/api";
import { NowPlayingResponse, Genre, Movie } from "../types/types";
import { useConfiguration } from "../context/ConfigurationContext";
import { Spinner, Container, Row, Col, Card, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import SearchBar from "../components/SearchBar";

const Home = () => {
  const { baseUrl, posterSize } = useConfiguration();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);

  const [searchActive, setSearchActive] = useState(false);

  const {
    data: nowPlayingData,
    error: nowPlayingError,
    isLoading: nowPlayingIsLoading,
  } = useQuery<NowPlayingResponse>({
    queryKey: ["nowPlayingMovies"],
    queryFn: () => getNowPlayingMovies(1),
    staleTime: 30000,
    enabled: !searchActive,
  });

  const {
    data: trendingData,
    error: trendingError,
    isLoading: trendingIsLoading,
  } = useQuery<NowPlayingResponse>({
    queryKey: ["trendingMovies"],
    queryFn: () => getTrendingMovies("day", 1),
    staleTime: 30000,
    enabled: !searchActive,
  });

  const {
    data: topRatedData,
    error: topRatedError,
    isLoading: topRatedIsLoading,
  } = useQuery<NowPlayingResponse>({
    queryKey: ["topRatedMovies"],
    queryFn: () => getTopRatedMovies(1),
    staleTime: 30000,
    enabled: !searchActive,
  });

  const {
    data: genresData,
    error: genresError,
    isLoading: genresIsLoading,
  } = useQuery<Genre[]>({
    queryKey: ["genres"],
    queryFn: getGenres,
    staleTime: 30000,
    enabled: !searchActive,
  });

  useEffect(() => {
    if (
      nowPlayingIsLoading ||
      trendingIsLoading ||
      topRatedIsLoading ||
      genresIsLoading
    ) {
      setLoading(true);
    } else {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [
    nowPlayingIsLoading,
    trendingIsLoading,
    topRatedIsLoading,
    genresIsLoading,
  ]);

  if (loading) {
    return (
      <div className="loading-spinner">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (nowPlayingError || trendingError || topRatedError || genresError) {
    return <Alert variant="danger">Error loading data</Alert>;
  }

  const renderMovies = (movies: Movie[]) => (
    <Row className="movies-row">
      {movies.map((movie: Movie) => (
        <Col key={movie.id} className="movie-col">
          <Card className="movie-card">
            <Link to={`/movie/${movie.id}`}>
              <Card.Img
                variant="top"
                src={`${baseUrl}${posterSize}${movie.poster_path}`}
                alt={movie.title}
                className="movie-poster"
              />
            </Link>
            <Card.Body className="movie-body">
              <Card.Title className="movie-title">{movie.title}</Card.Title>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );

  return (
    <Container className="movies-container">
      <h1 className={`text-${theme === "dark" ? "light" : "dark"} my-4`}>
        Welcome to The Movie DB
      </h1>
      <SearchBar setSearchActive={setSearchActive} />
      {!searchActive && (
        <>
          <section className="text-center">
            <h2 className={`text-${theme === "dark" ? "light" : "dark"} my-3`}>
              Now Playing
            </h2>
            {nowPlayingData && renderMovies(nowPlayingData.results || [])}
          </section>

          <section className="text-center">
            <h2 className={`text-${theme === "dark" ? "light" : "dark"} my-3`}>
              Trending Movies
            </h2>
            {trendingData && renderMovies(trendingData.results || [])}
          </section>

          <section className="text-center">
            <h2 className={`text-${theme === "dark" ? "light" : "dark"} my-3`}>
              Top Rated Movies
            </h2>
            {topRatedData && renderMovies(topRatedData.results || [])}
          </section>

          <section className="text-center">
            <h2 className={`text-${theme === "dark" ? "light" : "dark"} my-3`}>
              Genres
            </h2>
            <Row className="genres-row">
              {genresData?.map((genre: Genre) => (
                <Col key={genre.id} xs={12} md={4} lg={3} className="mb-4">
                  <Card
                    as={Link}
                    to={`/genre/${genre.id}`}
                    className="text-decoration-none"
                  >
                    <Card.Body className="genre-body">
                      <Card.Title className="genre-title">
                        {genre.name}
                      </Card.Title>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </section>
        </>
      )}
    </Container>
  );
};

export default Home;
