import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Planet } from "../types/apiTypes";

interface PlanetCardProps {
  planet: Planet;
  currentPage: number;
}

const PlanetCard: React.FC<PlanetCardProps> = ({ planet, currentPage }) => {
  const navigate = useNavigate();

  const handleReadMore = () => {
    navigate(`/planets/${planet.id}`, {
      state: { from: "/planets", page: currentPage },
    });
  };

  return (
    <Card className="item-card">
      <Card.Body>
        <Card.Title>{planet.name}</Card.Title>
        <Card.Text>
          <strong>Climate:</strong> {planet.climate}
          <br />
          <strong>Population:</strong> {planet.population}
          <br />
          <strong>In {planet.films_count} films</strong>
        </Card.Text>
        <Button variant="primary" onClick={handleReadMore}>
          Read more
        </Button>
      </Card.Body>
    </Card>
  );
};

export default PlanetCard;
