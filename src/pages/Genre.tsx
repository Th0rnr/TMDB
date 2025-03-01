import { useEffect, useState } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMoviesByGenre, getGenres } from "../services/api";
import { NowPlayingResponse, Genre } from "../types/types";
import { useConfiguration } from "../context/ConfigurationContext";
import Pagination from "../components/Pagination";
import GenreCard from "../components/GenreCard";
import { Container, Row, Spinner, Alert } from "react-bootstrap";

const GenrePage = () => {
  const { id } = useParams<{ id: string }>();
  const genreId = parseInt(id!, 10);
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(
    Math.min(parseInt(searchParams.get("page") || "1", 10), 500)
  );
  const { baseUrl, posterSize } = useConfiguration();
  const [cachedData, setCachedData] = useState<NowPlayingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: genres } = useQuery<Genre[]>({
    queryKey: ["genres"],
    queryFn: getGenres,
    staleTime: 30000,
  });

  const { data, error, isLoading } = useQuery<NowPlayingResponse>({
    queryKey: ["moviesByGenre", genreId, page],
    queryFn: () => getMoviesByGenre(genreId, page),
    staleTime: 30000,
  });

  useEffect(() => {
    setPage(Math.min(parseInt(searchParams.get("page") || "1", 10), 500));
  }, [searchParams]);

  useEffect(() => {
    const cachedData = localStorage.getItem(
      `genreMovies_${genreId}_page_${page}`
    );
    if (cachedData) {
      setCachedData(JSON.parse(cachedData));
    }
  }, [genreId, page]);

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
        `genreMovies_${genreId}_page_${page}`,
        JSON.stringify(data)
      );
      setCachedData(data);
    }
  }, [data, genreId, page]);

  const handlePageChange = (newPage: number) => {
    setLoading(true);
    setSearchParams({ page: newPage.toString() });
    setPage(newPage);
  };

  const genre = genres?.find((g) => g.id === genreId);

  if (!genre) {
    return <Alert variant="warning">Genre not found.</Alert>;
  }

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

  if (!data || !genres || !genre || !cachedData) {
    return <Alert variant="warning">Data not available.</Alert>;
  }

  const totalPages = Math.min(data.total_pages || 1, 500);
  const placeholderImageUrl =
    "https://via.placeholder.com/300x450?text=No+Image+Available";

  return (
    <Container className="movies-container">
      <h1 className="movies-title">{genre.name}</h1>
      <Row className="movies-row">
        {cachedData.results.map((movie) => (
          <GenreCard
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
    </Container>
  );
};

export default GenrePage;
