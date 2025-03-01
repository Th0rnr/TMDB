import { NavLink } from 'react-router-dom';
import { Container, Navbar, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/scss/styles.scss';  

const Navigation = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="custom-navbar">
      <Container>
        <Navbar.Brand href="/" className="navbar-brand-custom">Star Wars</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/films">Films</Nav.Link>
            <Nav.Link as={NavLink} to="/people">People</Nav.Link>
            <Nav.Link as={NavLink} to="/planets">Planets</Nav.Link>
            <Nav.Link as={NavLink} to="/species">Species</Nav.Link>
            <Nav.Link as={NavLink} to="/starships">Starships</Nav.Link>
            <Nav.Link as={NavLink} to="/vehicles">vehicles</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;



