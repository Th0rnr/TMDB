import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Alert, Spinner, Container, Row, Col } from "react-bootstrap";
import { api } from "../services/api";
import { Starship } from "../types/apiTypes";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import StarshipCard from "../components/StarshipCard";
import "../assets/scss/styles.scss";

const StarshipList: React.FC = () => {
  const [starships, setStarships] = useState<Starship[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);
  const itemsPerPage = 10;

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const query = searchParams.get("query") || "";

  const initialLoadRef = useRef(true);

  const fetchStarships = useCallback(async (page: number) => {
    setLoading(true);
    setError(null);

    const cachedStarships = localStorage.getItem(`starships_page_${page}`);
    if (cachedStarships) {
      const parsedStarships: Starship[] = JSON.parse(cachedStarships);
      setStarships(parsedStarships);
      const cachedTotalPages = localStorage.getItem("total_pages");
      if (cachedTotalPages) {
        setTotalPages(Number(cachedTotalPages));
      }
      setLoading(false);
      return;
    }

    try {
      const params = { page };
      const response = await api.starships.list(params);
      if (response.length === 0) {
        setError(new Error("No starships found"));
      } else {
        localStorage.setItem(
          `starships_page_${page}`,
          JSON.stringify(response)
        );
        setStarships(response);
        const totalCount = 36;
        const totalPages = Math.ceil(totalCount / itemsPerPage);
        setTotalPages(totalPages);
        localStorage.setItem("total_pages", totalPages.toString());
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
      fetchStarships(page);
      return;
    }
    fetchStarships(page);
  }, [page, fetchStarships]);

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
          const exactMatch = starships.find(
            (starship) => starship.name.toLowerCase() === query.toLowerCase()
          );
          if (exactMatch) {
            setTimeout(() => {
              navigate(`/starships/${exactMatch.id}`);
            }, 1000);
            return;
          }

          searchParams.set("query", query);
          searchParams.set("page", "1");
          setSearchParams(searchParams);

          let allStarshipsData: Starship[] = [];
          let page = 1;
          let moreData = true;

          while (moreData) {
            const cachedStarships = localStorage.getItem(
              `starships_page_${page}`
            );
            if (cachedStarships) {
              const parsedStarships: Starship[] = JSON.parse(cachedStarships);
              allStarshipsData.push(...parsedStarships);
              page++;
            } else {
              const params = { page };
              const response = await api.starships.list(params);
              const data = response;
              if (data.length === 0) {
                moreData = false;
              } else {
                localStorage.setItem(
                  `starships_page_${page}`,
                  JSON.stringify(data)
                );
                allStarshipsData.push(...data);
                page++;
              }
            }
          }

          const filteredStarships = allStarshipsData.filter((starship) =>
            starship.name.toLowerCase().includes(query.toLowerCase())
          );
          if (filteredStarships.length === 0) {
            throw new Error("No starships found");
          }
          setTotalPages(Math.ceil(filteredStarships.length / itemsPerPage));
          setStarships(filteredStarships.slice(0, itemsPerPage));
          setLoading(false);
        } catch (error) {
          setStarships([]);
          setError(error as Error);
          setLoading(false);
        }
      }, 300);
      debouncedSearch(query);
    },
    [starships, navigate, searchParams, setSearchParams]
  );

  return (
    <Container className="main-content">
      <SearchBar
        onSearch={handleSearch}
        placeholder="Search Starships by Name..."
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
      ) : starships.length === 0 ? (
        <Alert variant="warning">No starships found</Alert>
      ) : (
        <>
          <Row className="item-list">
            {starships.map((starship) => (
              <Col key={starship.id} xs={12} md={4}>
                <StarshipCard starship={starship} currentPage={page} />
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

export default StarshipList;
