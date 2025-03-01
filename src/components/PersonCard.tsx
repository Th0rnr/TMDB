import { Card, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { People } from "../types/apiTypes";

interface PersonCardProps {
  person: People;
  currentPage: number;
}

const PersonCard: React.FC<PersonCardProps> = ({ person, currentPage }) => {
  const navigate = useNavigate();

  const handleReadMore = () => {
    navigate(`/people/${person.id}`, {
      state: { from: "/people", page: currentPage },
    });
  };

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    e.currentTarget.style.display = "none";
  };

  return (
    <Card className="item-card">
      <Card.Img
        variant="top"
        src={person.image_url}
        alt={person.name}
        onError={handleImageError}
      />
      <Card.Body>
        <Card.Title>{person.name}</Card.Title>
        <Card.Text>
          <strong>Born:</strong> {person.birth_year}
          <br />
          <strong>Homeworld:</strong>{" "}
          <Link to={`/planets/${person.homeworld.id}`}>
            {person.homeworld.name}
          </Link>
          <br />
          <strong>In {person.films_count} films</strong>
        </Card.Text>
        <Button variant="primary" onClick={handleReadMore}>
          Read more
        </Button>
      </Card.Body>
    </Card>
  );
};

export default PersonCard;
