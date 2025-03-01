import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Alert, Spinner, Container, Row, Col } from "react-bootstrap";
import { api } from "../services/api";
import { Vehicle } from "../types/apiTypes";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import VehicleCard from "../components/VehicleCard";
import "../assets/scss/styles.scss";

const VehicleList: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);
  const itemsPerPage = 10;

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const query = searchParams.get("query") || "";

  const initialLoadRef = useRef(true);

  const fetchVehicles = useCallback(async (page: number) => {
    setLoading(true);
    setError(null);

    const cachedVehicles = localStorage.getItem(`vehicles_page_${page}`);
    if (cachedVehicles) {
      const parsedVehicles: Vehicle[] = JSON.parse(cachedVehicles);
      setVehicles(parsedVehicles);
      const cachedTotalPages = localStorage.getItem("total_pages");
      if (cachedTotalPages) {
        setTotalPages(Number(cachedTotalPages));
      }
      setLoading(false);
      return;
    }

    try {
      const params = { page };
      const response = await api.vehicles.list(params);
      if (response.length === 0) {
        setError(new Error("No vehicles found"));
      } else {
        localStorage.setItem(`vehicles_page_${page}`, JSON.stringify(response));
        setVehicles(response);
        const totalCount = 39;
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
      fetchVehicles(page);
      return;
    }
    fetchVehicles(page);
  }, [page, fetchVehicles]);

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
          const exactMatch = vehicles.find(
            (vehicle) => vehicle.name.toLowerCase() === query.toLowerCase()
          );
          if (exactMatch) {
            setTimeout(() => {
              navigate(`/vehicles/${exactMatch.id}`);
            }, 1000);
            return;
          }

          searchParams.set("query", query);
          searchParams.set("page", "1");
          setSearchParams(searchParams);

          const allVehiclesData: Vehicle[] = [];
          let page = 1;
          let moreData = true;

          while (moreData) {
            const cachedVehicles = localStorage.getItem(
              `vehicles_page_${page}`
            );
            if (cachedVehicles) {
              const parsedVehicles: Vehicle[] = JSON.parse(cachedVehicles);
              allVehiclesData.push(...parsedVehicles);
              page++;
            } else {
              const params = { page };
              const response = await api.vehicles.list(params);
              const data = response;
              if (data.length === 0) {
                moreData = false;
              } else {
                localStorage.setItem(
                  `vehicles_page_${page}`,
                  JSON.stringify(data)
                );
                allVehiclesData.push(...data);
                page++;
              }
            }
          }

          const filteredVehicles = vehicles.filter((vehicle) =>
            vehicle.name.toLowerCase().includes(query.toLowerCase())
          );
          if (filteredVehicles.length === 0) {
            throw new Error("No vehicles found");
          }
          setTotalPages(Math.ceil(filteredVehicles.length / itemsPerPage));
          setVehicles(filteredVehicles.slice(0, itemsPerPage));
          setLoading;
        } catch (error) {
          setVehicles([]);
          setError(error as Error);
          setLoading(false);
        }
      }, 300);
      debouncedSearch(query);
    },
    [vehicles, navigate, searchParams, setSearchParams]
  );

  return (
    <Container className="main-content">
      <SearchBar
        onSearch={handleSearch}
        placeholder="Search Vehicles by Name..."
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
      ) : vehicles.length === 0 ? (
        <Alert variant="warning">No vehicles found</Alert>
      ) : (
        <>
          <Row className="item-list">
            {vehicles.map((vehicle) => (
              <Col key={vehicle.id} xs={12} md={4}>
                <VehicleCard vehicle={vehicle} currentPage={page} />
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

export default VehicleList;
