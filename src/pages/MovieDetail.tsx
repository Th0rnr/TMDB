import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMovieDetails, getSimilarMovies } from "../services/api";
import {
  MovieDetailsResponse,
  NowPlayingResponse,
  Video,
} from "../types/types";
import { useConfiguration } from "../context/ConfigurationContext";
import { Spinner, Container, Row, Col, Alert, Button } from "react-bootstrap";
import CastCard from "../components/CastCard";
import SimilarMovieCard from "../components/SimiliarMovieCard";

const placeholderImageUrl =
  "https://via.placeholder.com/300x450?text=No+Image+Available";

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const movieId = parseInt(id!, 10);
  const { baseUrl, posterSize } = useConfiguration();
  const navigate = useNavigate();
  const [cachedData, setCachedData] = useState<MovieDetailsResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const { data, error, isLoading } = useQuery<MovieDetailsResponse>({
    queryKey: ["movieDetails", movieId],
    queryFn: () => getMovieDetails(movieId),
    staleTime: 30000,
  });

  const { data: similarMovies } = useQuery<NowPlayingResponse>({
    queryKey: ["similarMovies", movieId],
    queryFn: () => getSimilarMovies(movieId),
    staleTime: 30000,
  });

  useEffect(() => {
    const cachedData = localStorage.getItem(`movieDetails_${movieId}`);
    if (cachedData) {
      setCachedData(JSON.parse(cachedData));
    }
  }, [movieId]);

  useEffect(() => {
    if (isLoading) {
      setLoading(true);
    } else {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  useEffect(() => {
    if (data) {
      localStorage.setItem(`movieDetails_${movieId}`, JSON.stringify(data));
      setCachedData(data);
    }
  }, [data, movieId]);

  if (loading) {
    return (
      <div className="loading-spinner">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{(error as Error).message}</Alert>;
  }

  if (!data && !cachedData) {
    return <Alert variant="danger">No movie data found.</Alert>;
  }

  const movieData = data ?? cachedData;

  if (!movieData) {
    return <Alert variant="danger">No movie data available.</Alert>;
  }

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    e.currentTarget.src = placeholderImageUrl;
  };

  const trailer = movieData.videos.results.find(
    (video: Video) => video.type === "Trailer" && video.site === "YouTube"
  );

  const handleShowTrailer = () => {
    if (trailer) {
      const youtubeUrl = `https://www.youtube.com/watch?v=${trailer.key}`;
      window.open(youtubeUrl, "_blank");
    }
  };

  return (
    <Container className="movies-container">
      <div className="back-button-container mt-3">
        <Button variant="primary" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>
      <Row className="my-4">
        <Col md={4}>
          <img
            src={
              movieData.poster_path
                ? `${baseUrl}${posterSize}${movieData.poster_path}`
                : placeholderImageUrl
            }
            alt={movieData.title}
            className="img-fluid"
            onError={handleImageError}
          />
        </Col>
        <Col md={8}>
          <h1 className="film-title">{movieData.title}</h1>
          <p>{movieData.overview}</p>
          <p>
            <strong>Release Date:</strong> {movieData.release_date}
          </p>
          <p>
            <strong>Runtime:</strong> {movieData.runtime} minutes
          </p>
          <p>
            <strong>Genres:</strong>{" "}
            {movieData.genres.map((genre) => genre.name).join(", ")}
          </p>
          <p>
            <strong>Rating:</strong> {movieData.vote_average} / 10
          </p>
          <p>
            <strong>Vote Count:</strong> {movieData.vote_count}
          </p>
          {movieData.tagline && (
            <p>
              <strong>Tagline:</strong> {movieData.tagline}
            </p>
          )}
          {movieData.homepage && (
            <p>
              <strong>Homepage:</strong>
              <a
                href={movieData.homepage}
                target="_blank"
                rel="noopener noreferrer"
              >
                {movieData.homepage}
              </a>
            </p>
          )}
          <p>
            <strong>Original Language:</strong> {movieData.original_language}
          </p>
          <p>
            <strong>Popularity:</strong> {movieData.popularity}
          </p>
          <p>
            <strong>Status:</strong> {movieData.status}
          </p>
          {movieData.production_companies && (
            <p>
              <strong>Production Companies:</strong>{" "}
              {movieData.production_companies
                .map((company) => company.name)
                .join(", ")}
            </p>
          )}
          {movieData.production_countries && (
            <p>
              <strong>Production Countries:</strong>{" "}
              {movieData.production_countries
                .map((country) => country.name)
                .join(", ")}
            </p>
          )}
          {movieData.spoken_languages && (
            <p>
              <strong>Spoken Languages:</strong>{" "}
              {movieData.spoken_languages
                .map((language) => language.name)
                .join(", ")}
            </p>
          )}
          {trailer && (
            <div className="trailer-button-container mt-3">
              <Button
                variant="primary"
                className="show-trailer-button"
                onClick={handleShowTrailer}
              >
                TRAILER
              </Button>
            </div>
          )}
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <h3 className="mt-4">Cast</h3>
          <Row className="movies-row">
            {movieData.credits.cast.map((actor) => (
              <CastCard key={actor.id} actor={actor} />
            ))}
          </Row>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <h3 className="mt-4">Similar Movies</h3>
          <Row className="movies-row">
            {similarMovies?.results.map((movie) => (
              <SimilarMovieCard key={movie.id} movie={movie} />
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default MovieDetail;
