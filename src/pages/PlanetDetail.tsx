import { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { Alert, Spinner, Button, Container, Card } from "react-bootstrap";
import { api } from "../services/api";
import { Planet, Film, People } from "../types/apiTypes";
import "../assets/scss/styles.scss";

interface LocationState {
  from?: string;
  page?: number;
  query?: string;
}

const PlanetDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [planet, setPlanet] = useState<Planet | null>(null);
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

    const fetchPlanet = async () => {
      setLoading(true);
      try {
        const response = await api.planets.detail(id);
        if (!response) {
          throw new Error("Planet not found");
        }
        setPlanet(response);
        setLoading(false);
      } catch (error) {
        setError(error as Error);
        setLoading(false);
      }
    };

    fetchPlanet();
  }, [id]);

  const handleBackClick = () => {
    const from = (location.state as LocationState)?.from || "/planets";
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
      ) : !planet ? (
        <Alert variant="warning">Planet not found</Alert>
      ) : (
        <div>
          <h1 className="planet-title">{planet.name}</h1>
          <Card className="detail-card">
            <Card.Body>
              <Card.Title>{planet.name}</Card.Title>
              <Card.Text>
                <strong>Rotation Period:</strong> {planet.rotation_period}
                <br />
                <strong>Orbital Period:</strong> {planet.orbital_period}
                <br />
                <strong>Diameter:</strong> {planet.diameter}
                <br />
                <strong>Climate:</strong> {planet.climate}
                <br />
                <strong>Gravity:</strong> {planet.gravity}
                <br />
                <strong>Terrain:</strong> {planet.terrain}
                <br />
                <strong>Surface Water:</strong> {planet.surface_water}
                <br />
                <strong>Population:</strong> {planet.population}
              </Card.Text>
              <div className="attributes">
                <div className="attribute-section">
                  <h3>Films</h3>
                  <ul>
                    {planet.films?.map((film: Film) => (
                      <li key={film.id}>
                        <Link to={`/films/${film.id}`}>{film.title}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="attribute-section">
                  <h3>Residents</h3>
                  <ul>
                    {planet.residents?.map((resident: People) => (
                      <li key={resident.id}>
                        <Link to={`/people/${resident.id}`}>
                          {resident.name}
                        </Link>
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

export default PlanetDetail;
