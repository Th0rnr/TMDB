import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Alert, Spinner, Container, Row, Col } from "react-bootstrap";
import { api } from "../services/api";
import { Film } from "../types/apiTypes";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import FilmCard from "../components/FilmCard";
import "../assets/scss/styles.scss";

const FilmList: React.FC = () => {
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const query = searchParams.get("query") || "";

  const initialLoadRef = useRef(true);

  const fetchFilms = useCallback(async (page: number) => {
    setLoading(true);
    setError(null);

    const cachedFilms = localStorage.getItem(`films_page_${page}`);

    if (cachedFilms) {
      const parsedFilms: Film[] = JSON.parse(cachedFilms);
      setFilms(parsedFilms);
      const cachedTotalPages = localStorage.getItem("films_total_pages");
      if (cachedTotalPages) {
        setTotalPages(Number(cachedTotalPages));
      }
      setLoading(false);
      return;
    }

    try {
      const params = { page };
      const response = await api.films.list(params);
      if (response.length === 0) {
        setError(new Error("No films found"));
      } else {
        localStorage.setItem(`films_page_${page}`, JSON.stringify(response));
        setFilms(response);
        const totalCount = 6;
        const totalPages = Math.ceil(totalCount / itemsPerPage);
        setTotalPages(totalPages);
        localStorage.setItem("films_total_pages", totalPages.toString());
      }
      setLoading(false);
    } catch (error) {
      console.error("Fetch data error:", error);
      setError(error as Error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      fetchFilms(page);
      return;
    }
    fetchFilms(page);
  }, [searchParams, setFilms]);

  const handlePageChange = (page: number) => {
    searchParams.set("page", page.toString());
    setSearchParams(searchParams);
  };

  const debounce = <T extends (...args: any[]) => void>(
    func: T,
    wait: number
  ) => {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>): void => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const handleSearch = useCallback(
    (query: string) => {
      const debouncedSearch = debounce(async (query: string) => {
        setLoading(true);
        setError(null);
        try {
          const exactMatch = films.find(
            (film) => film.title.toLowerCase() === query.toLowerCase()
          );
          if (exactMatch) {
            navigate(`/films/${exactMatch.id}`);
            return;
          }

          searchParams.set("query", query);
          searchParams.set("page", "1");
          setSearchParams(searchParams);

          const allFilmsData: Film[] = [];
          let page = 1;
          let moreData = true;

          while (moreData) {
            const cachedFilms = localStorage.getItem(`films_page_${page}`);
            if (cachedFilms) {
              const parsedFilms: Film[] = JSON.parse(cachedFilms);
              allFilmsData.push(...parsedFilms);
              page++;
            } else {
              const params = { page };
              const response = await api.films.list(params);
              const data = response;
              if (data.length === 0) {
                moreData = false;
              } else {
                localStorage.setItem(
                  `films_page_${page}`,
                  JSON.stringify(data)
                );
                allFilmsData.push(...data);
                page++;
              }
            }
          }

          const filteredFilms = allFilmsData.filter((film) =>
            film.title.toLowerCase().includes(query.toLowerCase())
          );

          if (filteredFilms.length === 0) {
            throw new Error("No films found");
          }

          setTotalPages(Math.ceil(filteredFilms.length / itemsPerPage));
          setFilms(filteredFilms.slice(0, itemsPerPage));
          setLoading(false);
        } catch (error) {
          setFilms([]);
          setError(error as Error);
          setLoading(false);
        }
      }, 300);
      debouncedSearch(query);
    },
    [films, navigate, searchParams, setSearchParams]
  );

  return (
    <Container className="main-content">
      <SearchBar
        onSearch={(query) => handleSearch(query)}
        placeholder="Search Films by Name..."
      />
      {query && query.trim() !== "" && (
        <p className="search-query">You searched for "{query}"</p>
      )}
      {loading ? (
        <div className="loading">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : error ? (
        <Alert variant="danger">{error.message}</Alert>
      ) : films.length === 0 ? (
        <Alert variant="warning">No films found</Alert>
      ) : (
        <>
          <Row className="item-list">
            {films.map((film) => (
              <Col key={film.id} xs={12} md={4}>
                <FilmCard film={film} currentPage={page} />
              </Col>
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
    </Container>
  );
};

export default FilmList;
