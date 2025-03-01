import { Card, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useConfiguration } from "../context/ConfigurationContext";
import { Movie } from "../types/types";

interface SimilarMovieCardProps {
  movie: Movie;
}

const placeholderImageUrl =
  "https://via.placeholder.com/300x450?text=No+Image+Available";

const SimilarMovieCard: React.FC<SimilarMovieCardProps> = ({ movie }) => {
  const { baseUrl, posterSize } = useConfiguration();

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    e.currentTarget.src = placeholderImageUrl;
  };

  return (
    <Col className="movie-col">
      <Card className="movie-card">
        <Link to={`/movie/${movie.id}`}>
          <Card.Img
            variant="top"
            src={
              movie.poster_path
                ? `${baseUrl}${posterSize}${movie.poster_path}`
                : placeholderImageUrl
            }
            alt={movie.title}
            className="movie-poster"
            onError={handleImageError}
          />
        </Link>
        <Card.Body className="movie-body">
          <Card.Title className="movie-title">{movie.title}</Card.Title>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default SimilarMovieCard;
