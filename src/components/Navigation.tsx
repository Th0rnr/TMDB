import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Navbar, Nav, Button, Container, NavDropdown } from "react-bootstrap";
import { useTheme } from "../context/ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa";
import { getGenres } from "../services/api";
import { Genre } from "../types/types";

const Navigation = () => {
  const { theme, toggleTheme } = useTheme();
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    const fetchGenres = async () => {
      const genresData = await getGenres();
      setGenres(genresData);
    };
    fetchGenres();
  }, []);

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="navbar">
      <Container>
        <Navbar.Brand href="/" className="navbar-brand">
          TMDB
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link as={NavLink} to="/now-playing" className="nav-link">
              Now Playing
            </Nav.Link>
            <Nav.Link as={NavLink} to="/trending" className="nav-link">
              Trending
            </Nav.Link>
            <Nav.Link as={NavLink} to="/top-rated" className="nav-link">
              Top Rated
            </Nav.Link>
            <NavDropdown title="Genres" id="basic-nav-dropdown">
              {genres.map((genre) => (
                <NavDropdown.Item
                  as={NavLink}
                  to={`/genre/${genre.id}`}
                  key={genre.id}
                >
                  {genre.name}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
          </Nav>
          <Button
            variant="outline-light"
            onClick={toggleTheme}
            className="d-flex align-items-center"
          >
            {theme === "light" ? <FaMoon /> : <FaSun />} Toggle Theme to{" "}
            {theme === "light" ? "Dark" : "Light"}
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
