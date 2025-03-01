import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Starship } from "../types/apiTypes";

interface StarshipCardProps {
  starship: Starship;
  currentPage: number;
}

const StarshipCard: React.FC<StarshipCardProps> = ({
  starship,
  currentPage,
}) => {
  const navigate = useNavigate();

  const handleReadMore = () => {
    navigate(`/starships/${starship.id}`, {
      state: { from: "/starships", page: currentPage },
    });
  };

  return (
    <Card className="item-card">
      <Card.Body>
        <Card.Title>{starship.name}</Card.Title>
        <Card.Text>
          <strong>Model:</strong> {starship.model}
          <br />
          <strong>Class:</strong> {starship.starship_class}
          <br />
          <strong>Manufacturer:</strong> {starship.manufacturer}
        </Card.Text>
        <Button variant="primary" onClick={handleReadMore}>
          Read more
        </Button>
      </Card.Body>
    </Card>
  );
};

export default StarshipCard;
