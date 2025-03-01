import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Vehicle } from "../types/apiTypes";

interface VehicleCardProps {
  vehicle: Vehicle;
  currentPage: number;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, currentPage }) => {
  const navigate = useNavigate();

  const handleReadMore = () => {
    navigate(`/vehicles/${vehicle.id}`, {
      state: { from: "/vehicles", page: currentPage },
    });
  };

  return (
    <Card className="item-card">
      <Card.Body>
        <Card.Title>{vehicle.name}</Card.Title>
        <Card.Text>
          <strong>Model:</strong> {vehicle.model}
          <br />
          <strong>Manufacturer:</strong> {vehicle.manufacturer}
          <br />
          <strong>Cost:</strong> {vehicle.cost_in_credits} credits
          <br />
          <strong>Length:</strong> {vehicle.length} m
          <br />
          <strong>Max Speed:</strong> {vehicle.max_atmosphering_speed} km/h
        </Card.Text>
        <Button variant="primary" onClick={handleReadMore}>
          Read more
        </Button>
      </Card.Body>
    </Card>
  );
};

export default VehicleCard;
