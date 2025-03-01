import React from "react";
import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../assets/scss/styles.scss";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/");
  };

  return (
    <Container className="main-content">
      <div className="not-found">
        <h1>404 - Page Not Found</h1>
        <p>Oops! The page you are looking for does not exist.</p>
        <Button variant="primary" onClick={handleBackClick}>
          Go to Home
        </Button>
      </div>
    </Container>
  );
};

export default NotFound;
