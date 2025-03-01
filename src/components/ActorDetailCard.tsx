import { Card, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Cast } from "../types/types";
import { useConfiguration } from "../context/ConfigurationContext";

interface ActorDetailCardProps {
  movie: Cast;
}

const placeholderImageUrl =
  "https://via.placeholder.com/300x450?text=No+Image+Available";

const ActorDetailCard: React.FC<ActorDetailCardProps> = ({ movie }) => {
  const { baseUrl, posterSize } = useConfiguration();

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    e.currentTarget.src = placeholderImageUrl;
  };

  return (
    <Col xs={12} md={6} lg={3} className="mb-4 movie-col">
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
          <Card.Text>
            <strong>as</strong> {movie.character}
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default ActorDetailCard;
