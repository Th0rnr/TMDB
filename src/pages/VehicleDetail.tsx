import { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { Alert, Spinner, Button, Container, Card } from "react-bootstrap";
import { api } from "../services/api";
import { Vehicle, Film, People } from "../types/apiTypes";
import "../assets/scss/styles.scss";

interface LocationState {
  from?: string;
  page?: number;
  query?: string;
}

const VehicleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
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

    const fetchVehicle = async () => {
      setLoading(true);
      try {
        const response = await api.vehicles.detail(id);
        if (!response) {
          throw new Error("Vehicle not found");
        }
        setVehicle(response);
        setLoading(false);
      } catch (error) {
        setError(error as Error);
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [id]);

  const handleBackClick = () => {
    const from = (location.state as LocationState)?.from || "/vehicles";
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
      ) : !vehicle ? (
        <Alert variant="warning">Vehicle not found</Alert>
      ) : (
        <div>
          <h1 className="vehicle-title">{vehicle.name}</h1>
          <Card className="detail-card">
            <Card.Body>
              <Card.Title>{vehicle.name}</Card.Title>
              <Card.Text>
                <strong>Model:</strong> {vehicle.model}
                <br />
                <strong>Class:</strong> {vehicle.vehicle_class}
                <br />
                <strong>Manufacturer:</strong> {vehicle.manufacturer}
                <br />
                <strong>Cost:</strong> {vehicle.cost_in_credits} credits
                <br />
                <strong>Length:</strong> {vehicle.length} m<br />
                <strong>Max Speed:</strong> {vehicle.max_atmosphering_speed}{" "}
                km/h
                <br />
                <strong>Crew:</strong> {vehicle.crew}
                <br />
                <strong>Passengers:</strong> {vehicle.passengers}
                <br />
                <strong>Cargo Capacity:</strong> {vehicle.cargo_capacity} kg
                <br />
                <strong>Consumables:</strong> {vehicle.consumables}
              </Card.Text>
              <div className="attributes">
                <div className="attribute-section">
                  <h3>Films</h3>
                  <ul>
                    {vehicle.films?.map((film: Film) => (
                      <li key={film.id}>
                        <Link to={`/films/${film.id}`}>{film.title}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="attribute-section">
                  <h3>Pilots</h3>
                  <ul>
                    {vehicle.pilots?.map((pilot: People) => (
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

export default VehicleDetail;
