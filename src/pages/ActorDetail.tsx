import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getActorDetails } from "../services/api";
import { ActorDetailsResponse } from "../types/types";
import { useConfiguration } from "../context/ConfigurationContext";
import { Spinner, Container, Row, Col, Alert, Button } from "react-bootstrap";
import ActorDetailCard from "../components/ActorDetailCard";

const placeholderImageUrl =
  "https://via.placeholder.com/300x450?text=No+Image+Available";

const ActorDetail = () => {
  const { id } = useParams<{ id: string }>();
  const actorId = parseInt(id!, 10);
  const { baseUrl, posterSize } = useConfiguration();
  const navigate = useNavigate();
  const [cachedData, setCachedData] = useState<ActorDetailsResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const { data, error, isLoading } = useQuery<ActorDetailsResponse>({
    queryKey: ["actorDetails", actorId],
    queryFn: () => getActorDetails(actorId),
    staleTime: 30000,
  });

  useEffect(() => {
    const cachedData = localStorage.getItem(`actorDetails_${actorId}`);
    if (cachedData) {
      setCachedData(JSON.parse(cachedData));
    }
  }, [actorId]);

  useEffect(() => {
    if (isLoading) {
      setLoading(true);
    } else {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  useEffect(() => {
    if (data) {
      localStorage.setItem(`actorDetails_${actorId}`, JSON.stringify(data));
      setCachedData(data);
    }
  }, [data, actorId]);

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    e.currentTarget.src = placeholderImageUrl;
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{(error as Error).message}</Alert>;
  }

  if (!data && !cachedData) {
    return <Alert variant="danger">No actor data found.</Alert>;
  }

  const actorData = data ?? cachedData;

  if (!actorData) {
    return <Alert variant="danger">No actor data available.</Alert>;
  }

  return (
    <Container className="movies-container">
      <div className="back-button-container mt-3">
        <Button variant="primary" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>
      <Row className="my-4">
        <Col md={4}>
          <img
            src={
              actorData.profile_path
                ? `${baseUrl}${posterSize}${actorData.profile_path}`
                : placeholderImageUrl
            }
            alt={actorData.name}
            className="img-fluid"
            onError={handleImageError}
          />
        </Col>
        <Col md={8}>
          <h1 className="actor-name">{actorData.name}</h1>
          <p>{actorData.biography}</p>
          <p>
            <strong>Birthday:</strong> {actorData.birthday}
          </p>
          {actorData.deathday && (
            <p>
              <strong>Deathday:</strong> {actorData.deathday}
            </p>
          )}
          <p>
            <strong>Place of Birth:</strong> {actorData.place_of_birth}
          </p>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <h3 className="mt-4">Movie Credits</h3>
          <Row className="movies-row">
            {actorData.movie_credits.cast.map((movie) => (
              <ActorDetailCard key={movie.id} movie={movie} />
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default ActorDetail;
