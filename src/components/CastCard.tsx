import { Card, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useConfiguration } from "../context/ConfigurationContext";
import { Cast } from "../types/types";

interface CastCardProps {
  actor: Cast;
}

const placeholderImageUrl =
  "https://via.placeholder.com/300x450?text=No+Image+Available";

const CastCard: React.FC<CastCardProps> = ({ actor }) => {
  const { baseUrl, posterSize } = useConfiguration();

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    e.currentTarget.src = placeholderImageUrl;
  };

  return (
    <Col className="movie-col">
      <Card className="movie-card">
        <Link to={`/actor/${actor.id}`}>
          <Card.Img
            variant="top"
            src={
              actor.profile_path
                ? `${baseUrl}${posterSize}${actor.profile_path}`
                : placeholderImageUrl
            }
            alt={actor.name}
            className="movie-poster"
            onError={handleImageError}
          />
        </Link>
        <Card.Body className="movie-body">
          <Card.Title className="movie-title">{actor.name}</Card.Title>
          <Card.Text>
            <strong>as</strong> {actor.character}
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default CastCard;
