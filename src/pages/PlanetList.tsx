import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Alert, Spinner, Container, Row, Col } from "react-bootstrap";
import { api } from "../services/api";
import { Planet } from "../types/apiTypes";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import PlanetCard from "../components/PlanetCard";
import "../assets/scss/styles.scss";

const PlanetList: React.FC = () => {
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);
  const itemsPerPage = 10;

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const query = searchParams.get("query") || "";

  const initialLoadRef = useRef(true);

  const fetchPlanets = useCallback(async (page: number) => {
    setLoading(true);
    setError(null);

    const cachedPlanets = localStorage.getItem(`planets_page_${page}`);
    if (cachedPlanets) {
      const parsedPlanets: Planet[] = JSON.parse(cachedPlanets);
      setPlanets(parsedPlanets);
      const cachedTotalPages = localStorage.getItem("total_pages");
      if (cachedTotalPages) {
        setTotalPages(Number(cachedTotalPages));
      }
      setLoading(false);
      return;
    }

    try {
      const params = { page };
      const response = await api.planets.list(params);
      if (response.length === 0) {
        setError(new Error("No planets found"));
      } else {
        localStorage.setItem(`planets_page_${page}`, JSON.stringify(response));
        setPlanets(response);
        const totalCount = 60;
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
      fetchPlanets(page);
      return;
    }
    fetchPlanets(page);
  }, [page, fetchPlanets]);

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
          const exactMatch = planets.find(
            (planet) => planet.name.toLowerCase() === query.toLowerCase()
          );
          if (exactMatch) {
            setTimeout(() => {
              navigate(`/planets/${exactMatch.id}`);
            }, 1000);
            return;
          }

          searchParams.set("query", query);
          searchParams.set("page", "1");
          setSearchParams(searchParams);

          let allPlanetsData: Planet[] = [];
          let page = 1;
          let moreData = true;

          while (moreData) {
            const cachedPlanets = localStorage.getItem(`planets_page_${page}`);
            if (cachedPlanets) {
              const parsedPlanets: Planet[] = JSON.parse(cachedPlanets);
              allPlanetsData.push(...parsedPlanets);
              page++;
            } else {
              const params = { page };
              const response = await api.planets.list(params);
              const data = response;
              if (data.length === 0) {
                moreData = false;
              } else {
                localStorage.setItem(
                  `planets_page_${page}`,
                  JSON.stringify(data)
                );
                allPlanetsData.push(...data);
                page++;
              }
            }
          }

          const filteredPlanets = planets.filter((planet) =>
            planet.name.toLowerCase().includes(query.toLowerCase())
          );

          if (filteredPlanets.length === 0) {
            throw new Error("No planets found");
          }

          setTotalPages(Math.ceil(filteredPlanets.length / itemsPerPage));
          setPlanets(filteredPlanets.slice(0, itemsPerPage));
          setLoading(false);
        } catch (error) {
          setPlanets([]);
          setError(error as Error);
          setLoading(false);
        }
      }, 300);

      debouncedSearch(query);
    },
    [planets, navigate, searchParams, setSearchParams]
  );

  return (
    <Container className="main-content">
      <SearchBar
        onSearch={handleSearch}
        placeholder="Search Planets by Name..."
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
      ) : planets.length === 0 ? (
        <Alert variant="warning">No planets found</Alert>
      ) : (
        <>
          <Row className="item-list">
            {planets.map((planet) => (
              <Col key={planet.id} xs={12} md={4}>
                <PlanetCard planet={planet} currentPage={page} />
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

export default PlanetList;
