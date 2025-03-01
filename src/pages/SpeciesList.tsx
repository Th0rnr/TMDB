import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Alert, Spinner, Container, Row, Col } from "react-bootstrap";
import { api } from "../services/api";
import { Species } from "../types/apiTypes";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import SpeciesCard from "../components/SpeciesCard";
import "../assets/scss/styles.scss";

const SpeciesList: React.FC = () => {
  const [species, setSpecies] = useState<Species[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);
  const itemsPerPage = 10;

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const query = searchParams.get("query") || "";

  const initialLoadRef = useRef(true);

  const fetchSpecies = useCallback(async (page: number) => {
    setLoading(true);
    setError(null);

    const cachedSpecies = localStorage.getItem(`species_page_${page}`);
    if (cachedSpecies) {
      const parsedSpecies: Species[] = JSON.parse(cachedSpecies);
      setSpecies(parsedSpecies);
      const cachedTotalPages = localStorage.getItem("total_pages");
      if (cachedTotalPages) {
        setTotalPages(Number(cachedTotalPages));
      }
      setLoading(false);
      return;
    }

    try {
      const params = { page };
      const response = await api.species.list(params);
      if (response.length === 0) {
        setError(new Error("No species found"));
      } else {
        localStorage.setItem(`species_page_${page}`, JSON.stringify(response));
        setSpecies(response);
        const totalCount = 37;
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
      fetchSpecies(page);
      return;
    }
    fetchSpecies(page);
  }, [page, fetchSpecies]);

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
          const exactMatch = species.find(
            (species) => species.name.toLowerCase() === query.toLowerCase()
          );
          if (exactMatch) {
            setTimeout(() => {
              navigate(`/species/${exactMatch.id}`);
            }, 1000);
            return;
          }

          searchParams.set("query", query);
          searchParams.set("page", "1");
          setSearchParams(searchParams);

          let allSpeciesData: Species[] = [];
          let page = 1;
          let moreData = true;

          while (moreData) {
            const cachedSpecies = localStorage.getItem(`species_page_${page}`);
            if (cachedSpecies) {
              const parsedSpecies: Species[] = JSON.parse(cachedSpecies);
              allSpeciesData.push(...parsedSpecies);
              page++;
            } else {
              const params = { page };
              const response = await api.species.list(params);
              const data = response;
              if (data.length === 0) {
                moreData = false;
              } else {
                localStorage.setItem(
                  `species_page_${page}`,
                  JSON.stringify(data)
                );
                allSpeciesData.push(...data);
                page++;
              }
            }
          }

          const filteredSpecies = species.filter((species) =>
            species.name.toLowerCase().includes(query.toLowerCase())
          );
          if (filteredSpecies.length === 0) {
            throw new Error("No species found");
          }
          setTotalPages(Math.ceil(filteredSpecies.length / itemsPerPage));
          setSpecies(filteredSpecies.slice(0, itemsPerPage));
          setLoading(false);
        } catch (error) {
          setSpecies([]);
          setError(error as Error);
          setLoading(false);
        }
      }, 300);
      debouncedSearch(query);
    },
    [species, navigate, searchParams, setSearchParams]
  );

  return (
    <Container className="main-content">
      <SearchBar
        onSearch={handleSearch}
        placeholder="Search Species by Name..."
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
      ) : species.length === 0 ? (
        <Alert variant="warning">No species found</Alert>
      ) : (
        <>
          <Row className="item-list">
            {species.map((species) => (
              <Col key={species.id} xs={12} md={4}>
                <SpeciesCard species={species} currentPage={page} />
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

export default SpeciesList;
