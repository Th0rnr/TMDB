import { Card, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

interface GenreCardProps {
  movie: {
    id: number;
    title: string;
    poster_path: string | null;
  };
  baseUrl: string;
  posterSize: string;
  placeholderImageUrl: string;
}

const GenreCard: React.FC<GenreCardProps> = ({
  movie,
  baseUrl,
  posterSize,
  placeholderImageUrl,
}) => {
  const navigate = useNavigate();

  return (
    <Col className="movie-col">
      <Card
        className="movie-card"
        onClick={() => navigate(`/movie/${movie.id}`)}
        style={{ cursor: "pointer" }}
      >
        <Card.Img
          variant="top"
          src={
            movie.poster_path
              ? `${baseUrl}${posterSize}${movie.poster_path}`
              : placeholderImageUrl
          }
          alt={movie.title}
          className="movie-poster"
        />
        <Card.Body className="movie-body">
          <Card.Title className="movie-title">{movie.title}</Card.Title>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default GenreCard;
