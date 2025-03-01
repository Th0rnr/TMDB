import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Film } from "../types/apiTypes";

interface FilmCardProps {
  film: Film;
  currentPage: number;
}

const FilmCard: React.FC<FilmCardProps> = ({ film, currentPage }) => {
  const navigate = useNavigate();

  const handleReadMore = () => {
    navigate(`/films/${film.id}`, {
      state: { from: "/films", page: currentPage },
    });
  };

  return (
    <Card className="item-card">
      <Card.Img variant="top" src={film.image_url} alt={film.title} />
      <Card.Body>
        <Card.Title>
          {film.title} (Episode {film.episode_id})
        </Card.Title>
        <Card.Text>
          <strong>Director:</strong> {film.director}
        </Card.Text>
        <Button variant="primary" onClick={handleReadMore}>
          Read more
        </Button>
      </Card.Body>
    </Card>
  );
};

export default FilmCard;
