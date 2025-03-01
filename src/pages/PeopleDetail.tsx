import { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { Alert, Spinner, Button, Container, Card } from "react-bootstrap";
import { api } from "../services/api";
import { People, Film, Starship, Vehicle } from "../types/apiTypes";
import "../assets/scss/styles.scss";

interface LocationState {
  from?: string;
  page?: number;
  query?: string;
}

const PeopleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [person, setPerson] = useState<People | null>(null);
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

    const fetchPerson = async () => {
      setLoading(true);
      try {
        const response = await api.people.detail(id);
        if (!response) {
          throw new Error("Person not found");
        }
        setPerson(response);
        setLoading(false);
      } catch (error) {
        setError(error as Error);
        setLoading(false);
      }
    };

    fetchPerson();
  }, [id]);

  const handleBackClick = () => {
    const from = (location.state as LocationState)?.from || "/people";
    const currentPage = (location.state as LocationState)?.page || 1;
    const query = (location.state as LocationState)?.query || "";
    navigate(`${from}?page=${currentPage}&query=${query}`);
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
      ) : !person ? (
        <Alert variant="warning">Person not found</Alert>
      ) : (
        <div>
          <h1 className="person-title">{person.name}</h1>
          <Card className="detail-card">
            <Card.Img
              variant="top"
              src={person.image_url}
              alt={person.name}
              className="person-poster"
            />
            <Card.Body>
              <Card.Title>{person.name}</Card.Title>
              <Card.Text>
                <strong>Birth Year:</strong> {person.birth_year}
                <br />
                <strong>Eye Color:</strong> {person.eye_color}
                <br />
                <strong>Hair Color:</strong> {person.hair_color}
                <br />
                <strong>Height:</strong> {person.height} cm
                <br />
                <strong>Mass:</strong> {person.mass} kg
                <br />
                <strong>Skin Color:</strong> {person.skin_color}
                <br />
                <strong>Homeworld:</strong>{" "}
                <Link to={`/planets/${person.homeworld.id}`}>
                  {person.homeworld.name}
                </Link>
              </Card.Text>
              <div className="attributes">
                <div className="attribute-section">
                  <h3>Films</h3>
                  <ul>
                    {person.films?.map((film: Film) => (
                      <li key={film.id}>
                        <Link to={`/films/${film.id}`}>{film.title}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="attribute-section">
                  <h3>Starships</h3>
                  <ul>
                    {person.starships?.map((starship: Starship) => (
                      <li key={starship.id}>
                        <Link to={`/starships/${starship.id}`}>
                          {starship.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="attribute-section">
                  <h3>Vehicles</h3>
                  <ul>
                    {person.vehicles?.map((vehicle: Vehicle) => (
                      <li key={vehicle.id}>
                        <Link to={`/vehicles/${vehicle.id}`}>
                          {vehicle.name}
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

export default PeopleDetail;
