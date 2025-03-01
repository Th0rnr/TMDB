import { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { Alert, Spinner, Button, Container, Card } from "react-bootstrap";
import { api } from "../services/api";
import { Film } from "../types/apiTypes";
import "../assets/scss/styles.scss";

interface LocationState {
  from?: string;
  page?: number;
  query?: string;
}

const MovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [film, setFilm] = useState<Film | null>(null);
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

    const fetchFilm = async () => {
      setLoading(true);
      try {
        const response = await api.films.detail(id);
        setFilm(response);
        setLoading(false);
      } catch (error) {
        setError(error as Error);
        setLoading(false);
      }
    };

    fetchFilm();
  }, [id]);

  const handleBackClick = () => {
    const from = (location.state as LocationState)?.from || "/films";
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
      ) : !film ? (
        <Alert variant="warning">Film not found</Alert>
      ) : (
        <Card className="detail-card">
          <Card.Img
            variant="top"
            src={film.image_url}
            alt={film.title}
            className="film-poster"
          />
          <Card.Body>
            <Card.Title>
              {film.title} (Episode {film.episode_id})
            </Card.Title>
            <Card.Text>
              <strong>Director:</strong> {film.director}
              <br />
              <strong>Producer:</strong> {film.producer}
              <br />
              <strong>Release Date:</strong> {film.release_date}
              <br />
              <strong>Created:</strong>{" "}
              {new Date(film.created).toLocaleDateString()}
              <br />
              <strong>Edited:</strong>{" "}
              {new Date(film.edited).toLocaleDateString()}
              <br />
              <strong>Characters Count:</strong> {film.characters.length}
              <br />
              <strong>Planets Count:</strong> {film.planets.length}
              <br />
              <strong>Starships Count:</strong> {film.starships.length}
              <br />
              <strong>Vehicles Count:</strong> {film.vehicles.length}
              <br />
              <strong>Species Count:</strong> {film.species.length}
            </Card.Text>
            <div className="opening-crawl">
              <p>
                <strong>Opening Crawl:</strong>
              </p>
              <pre>{film.opening_crawl}</pre>
            </div>
            <div className="film-attributes">
              <div className="attribute-section">
                <h3>Characters</h3>
                <ul>
                  {film.characters.map((character) => (
                    <li key={character.id}>
                      <Link to={`/people/${character.id}`}>
                        {character.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="attribute-section">
                <h3>Planets</h3>
                <ul>
                  {film.planets.map((planet) => (
                    <li key={planet.id}>
                      <Link to={`/planets/${planet.id}`}>{planet.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="attribute-section">
                <h3>Starships</h3>
                <ul>
                  {film.starships.map((starship) => (
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
                  {film.vehicles.map((vehicle) => (
                    <li key={vehicle.id}>
                      <Link to={`/vehicles/${vehicle.id}`}>{vehicle.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="attribute-section">
                <h3>Species</h3>
                <ul>
                  {film.species.map((species) => (
                    <li key={species.id}>
                      <Link to={`/species/${species.id}`}>{species.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default MovieDetail;
