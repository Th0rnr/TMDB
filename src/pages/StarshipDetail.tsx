import { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { Alert, Spinner, Button, Container, Card } from "react-bootstrap";
import { api } from "../services/api";
import { Starship, Film, People } from "../types/apiTypes";
import "../assets/scss/styles.scss";

interface LocationState {
  from?: string;
  page?: number;
  query?: string;
}

const StarshipDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [starship, setStarship] = useState<Starship | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!id) {
      setError(new Error("No ID provided"));
      setLoading(false);
      return;
    }

    const fetchStarship = async () => {
      setLoading(true);
      try {
        const response = await api.starships.detail(id);
        if (!response) {
          throw new Error("Starship not found");
        }
        setStarship(response);
        setLoading(false);
      } catch (error) {
        setError(error as Error);
        setLoading(false);
      }
    };

    fetchStarship();
  }, [id]);

  const handleBackClick = () => {
    const from = (location.state as LocationState)?.from || "/starships";
    const currentPage = (location.state as LocationState)?.page || 1;
    navigate(`${from}?page=${currentPage}`);
  };

  return (
    <Container className="main-content">
      <div className="back-button-container">
        <Button className="back-button" onClick={handleBackClick}>
          Back
        </Button>
      </div>
      {error && <Alert variant="danger">{error.message}</Alert>}
      {loading ? (
        <div className="loading">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : !starship ? (
        <Alert variant="warning">Starship not found</Alert>
      ) : (
        <div>
          <h1 className="starship-title">{starship.name}</h1>
          <Card className="detail-card">
            <Card.Body>
              <Card.Title>{starship.name}</Card.Title>
              <Card.Text>
                <strong>Model:</strong> {starship.model}
                <br />
                <strong>Class:</strong> {starship.starship_class}
                <br />
                <strong>Manufacturer:</strong> {starship.manufacturer}
                <br />
                <strong>Cost:</strong> {starship.cost_in_credits}
                <br />
                <strong>Length:</strong> {starship.length}
                <br />
                <strong>Crew:</strong> {starship.crew}
                <br />
                <strong>Passengers:</strong> {starship.passengers}
                <br />
                <strong>Max Speed:</strong> {starship.max_atmosphering_speed}
                <br />
                <strong>Hyperdrive Rating:</strong> {starship.hyperdrive_rating}
                <br />
                <strong>MGLT:</strong> {starship.MGLT}
                <br />
                <strong>Cargo Capacity:</strong> {starship.cargo_capacity}
                <br />
                <strong>Consumables:</strong> {starship.consumables}
              </Card.Text>
              <div className="attributes">
                <div className="attribute-section">
                  <h3>Films</h3>
                  <ul>
                    {starship.films?.map((film: Film) => (
                      <li key={film.id}>
                        <Link to={`/films/${film.id}`}>{film.title}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="attribute-section">
                  <h3>Pilots</h3>
                  <ul>
                    {starship.pilots?.map((pilot: People) => (
                      <li key={pilot.id}>
                        <Link to={`/people/${pilot.id}`}>{pilot.name}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      )}
    </Container>
  );
};

export default StarshipDetail;
