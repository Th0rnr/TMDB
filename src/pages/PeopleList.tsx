import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Alert, Spinner, Container, Row, Col } from "react-bootstrap";
import { api } from "../services/api";
import { People } from "../types/apiTypes";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import PersonCard from "../components/PersonCard";
import "../assets/scss/styles.scss";

const PeopleList: React.FC = () => {
  const [people, setPeople] = useState<People[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);
  const itemsPerPage = 10;

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const query = searchParams.get("query") || "";

  const initialLoadRef = useRef(true);

  const fetchPeople = useCallback(async (page: number) => {
    setLoading(true);
    setError(null);

    const cachedPeople = localStorage.getItem(`people_page_${page}`);
    if (cachedPeople) {
      const parsedPeople: People[] = JSON.parse(cachedPeople);
      setPeople(parsedPeople);
      const cachedTotalPages = localStorage.getItem("total_pages");
      if (cachedTotalPages) {
        setTotalPages(Number(cachedTotalPages));
      }
      setLoading(false);
      return;
    }

    try {
      const params = { page };
      const response = await api.people.list(params);
      if (response.length === 0) {
        setError(new Error("No people found"));
      } else {
        localStorage.setItem(`people_page_${page}`, JSON.stringify(response));
        setPeople(response);
        const totalCount = 82;
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
      fetchPeople(page);
      return;
    }
    fetchPeople(page);
  }, [page, fetchPeople]);

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
          const exactMatch = people.find(
            (person) => person.name.toLowerCase() === query.toLowerCase()
          );
          if (exactMatch) {
            setTimeout(() => {
              navigate(`/people/${exactMatch.id}`);
            }, 1000);
            return;
          }

          searchParams.set("query", query);
          searchParams.set("page", "1");
          setSearchParams(searchParams);

          const allPeopleData: People[] = [];
          let page = 1;
          let moreData = true;

          while (moreData) {
            const cachedPeople = localStorage.getItem(`people_page_${page}`);
            if (cachedPeople) {
              const parsedPeople: People[] = JSON.parse(cachedPeople);
              allPeopleData.push(...parsedPeople);
              page++;
            } else {
              const params = { page };
              const response = await api.people.list(params);
              const data = response;
              if (data.length === 0) {
                moreData = false;
              } else {
                localStorage.setItem(
                  `people_page_${page}`,
                  JSON.stringify(data)
                );
                allPeopleData.push(...data);
                page++;
              }
            }
          }

          const filteredPeople = allPeopleData.filter((person) =>
            person.name.toLowerCase().includes(query.toLowerCase())
          );

          if (filteredPeople.length === 0) {
            throw new Error("No people found");
          }
          setTotalPages(Math.ceil(filteredPeople.length / itemsPerPage));
          setPeople(filteredPeople.slice(0, itemsPerPage));
          setLoading(false);
        } catch (error) {
          setPeople([]);
          setError(error as Error);
          setTimeout(() => setLoading(false), 1000);
        }
      }, 300);
      debouncedSearch(query);
    },
    [people, navigate, searchParams, setSearchParams]
  );

  return (
    <Container className="main-content">
      <SearchBar
        onSearch={handleSearch}
        placeholder="Search People by Name..."
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
      ) : people.length === 0 ? (
        <Alert variant="warning">No people found</Alert>
      ) : (
        <>
          <Row className="item-list">
            {people.map((person) => (
              <Col key={person.id} xs={12} md={4}>
                <PersonCard person={person} currentPage={page} />
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

export default PeopleList;
