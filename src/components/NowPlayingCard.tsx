import { Card, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Movie } from "../types/types";

interface NowPlayingCardProps {
  movie: Movie;
  baseUrl: string;
  posterSize: string;
  placeholderImageUrl: string;
}

const NowPlayingCard: React.FC<NowPlayingCardProps> = ({
  movie,
  baseUrl,
  posterSize,
  placeholderImageUrl,
}) => {
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
          />
        </Link>
        <Card.Body className="movie-body">
          <Card.Title className="movie-title">{movie.title}</Card.Title>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default NowPlayingCard;
