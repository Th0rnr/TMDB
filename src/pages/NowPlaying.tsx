import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getNowPlayingMovies } from "../services/api";
import { NowPlayingResponse } from "../types/types";
import { useConfiguration } from "../context/ConfigurationContext";
import Pagination from "../components/Pagination";
import NowPlayingCard from "../components/NowPlayingCard";
import { Container, Row, Spinner, Alert } from "react-bootstrap";

const NowPlaying = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(
    Math.min(parseInt(searchParams.get("page") || "1", 10), 500)
  );
  const { baseUrl, posterSize } = useConfiguration();
  const [cachedData, setCachedData] = useState<NowPlayingResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const { data, error, isLoading } = useQuery<NowPlayingResponse>({
    queryKey: ["nowPlayingMovies", page],
    queryFn: () => getNowPlayingMovies(page),
    staleTime: 30000,
  });

  useEffect(() => {
    setPage(Math.min(parseInt(searchParams.get("page") || "1", 10), 500));
  }, [searchParams]);

  useEffect(() => {
    const cachedData = localStorage.getItem(`nowPlayingMovies_page_${page}`);
    if (cachedData) {
      setCachedData(JSON.parse(cachedData));
    }
  }, [page]);

  useEffect(() => {
    if (isLoading) {
      setLoading(true);
    } else {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isLoading, page]);

  useEffect(() => {
    if (data) {
      localStorage.setItem(
        `nowPlayingMovies_page_${page}`,
        JSON.stringify(data)
      );
      setCachedData(data);
    }
  }, [data, page]);

  const handlePageChange = (newPage: number) => {
    setLoading(true);
    setSearchParams({ page: newPage.toString() });
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
  if (!data) {
    return <Alert variant="warning">No data available.</Alert>;
  }
  const totalPages = Math.min(data.total_pages || 1, 500);
  const placeholderImageUrl =
    "https://via.placeholder.com/300x450?text=No+Image+Available";

  return (
    <Container className="movies-container">
      <h1 className="movies-title">Now Playing</h1>
      {loading && (
        <div className="loading-spinner-overlay">
          <Spinner animation="border" role="status" className="loading-spinner">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}
      {error && <Alert variant="danger">{(error as Error).message}</Alert>}
      {!loading && cachedData && (
        <>
          <Row className="movies-row">
            {cachedData.results.map((movie) => (
              <NowPlayingCard
                key={movie.id}
                movie={movie}
                baseUrl={baseUrl}
                posterSize={posterSize}
                placeholderImageUrl={placeholderImageUrl}
              />
            ))}
          </Row>
          <div className="pagination-container">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
      {!loading && !error && !cachedData && (
        <Alert variant="warning">No data available.</Alert>
      )}
    </Container>
  );
};

export default NowPlaying;
