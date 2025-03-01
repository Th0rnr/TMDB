import { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { Alert, Spinner, Button, Container, Card } from "react-bootstrap";
import { api } from "../services/api";
import { Species, Film, People } from "../types/apiTypes";
import "../assets/scss/styles.scss";

interface LocationState {
  from?: string;
  page?: number;
  query?: string;
}

const SpeciesDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [species, setSpecies] = useState<Species | null>(null);
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

    const fetchSpecies = async () => {
      setLoading(true);
      try {
        const response = await api.species.detail(id);
        if (!response) {
          throw new Error("Species not found");
        }
        setSpecies(response);
        setLoading(false);
      } catch (error) {
        setError(error as Error);
        setLoading(false);
      }
    };

    fetchSpecies();
  }, [id]);

  const handleBackClick = () => {
    const from = (location.state as LocationState)?.from || "/species";
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
      ) : !species ? (
        <Alert variant="warning">Species not found</Alert>
      ) : (
        <div>
          <h1 className="species-title">{species.name}</h1>
          <Card className="detail-card">
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
                <strong>Eye Colors:</strong> {species.eye_colors}
                <br />
                <strong>Hair Colors:</strong> {species.hair_colors}
                <br />
                <strong>Skin Colors:</strong> {species.skin_colors}
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
              </Card.Text>
              <div className="attributes">
                <div className="attribute-section">
                  <h3>Films</h3>
                  <ul>
                    {species.films?.map((film: Film) => (
                      <li key={film.id}>
                        <Link to={`/films/${film.id}`}>{film.title}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="attribute-section">
                  <h3>People</h3>
                  <ul>
                    {species.people?.map((person: People) => (
                      <li key={person.id}>
                        <Link to={`/people/${person.id}`}>{person.name}</Link>
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

export default SpeciesDetail;
