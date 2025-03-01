import { Card, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Species } from "../types/apiTypes";

interface SpeciesCardProps {
  species: Species;
  currentPage: number;
}

const SpeciesCard: React.FC<SpeciesCardProps> = ({ species, currentPage }) => {
  const navigate = useNavigate();

  const handleReadMore = () => {
    navigate(`/species/${species.id}`, {
      state: { from: "/species", page: currentPage },
    });
  };

  return (
    <Card className="item-card">
      <Card.Body>
        <Card.Title>{species.name}</Card.Title>
        <Card.Text>
          <strong>Classification:</strong> {species.classification}
          <br />
          <strong>Designation:</strong> {species.designation}
          <br />
          <strong>Average Height:</strong> {species.average_height}
          <br />
          <strong>Average Lifespan:</strong> {species.average_lifespan}
          <br />
          <strong>Language:</strong> {species.language}
          <br />
          <strong>Homeworld:</strong>{" "}
          {species.homeworld ? (
            <Link to={`/planets/${species.homeworld.id}`}>
              {species.homeworld.name}
            </Link>
          ) : (
            "N/A"
          )}
          <br />
          <strong>In {species.films_count} films</strong>
        </Card.Text>
        <Button variant="primary" onClick={handleReadMore}>
          Read more
        </Button>
      </Card.Body>
    </Card>
  );
};

export default SpeciesCard;
