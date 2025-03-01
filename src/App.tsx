import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Navigation from './components/Navigation';
import FilmList from './pages/FilmList';
import MovieDetail from './pages/MovieDetails';
import PeopleList from './pages/PeopleList';
import PeopleDetail from './pages/PeopleDetail';
import PlanetList from './pages/PlanetList';
import PlanetDetail from './pages/PlanetDetail';
import SpeciesList from './pages/SpeciesList';
import SpeciesDetail from './pages/SpeciesDetail';
import StarshipList from './pages/StarshipList';
import StarshipDetail from './pages/StarshipDetail';
import VehicleList from './pages/VehiclesList';
import VehicleDetail from './pages/VehicleDetail';
import NotFound from './pages/NotFound';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import './assets/scss/styles.scss';  

function App() {
  return (
    <Router>
      <Navigation />
      <Container className="main-content">
        <Routes>
          <Route path="/" element={
            <>
              <h1>Welcome to the Star Wars Encyclopedia</h1>
              <p>Select a category from the navigation bar to get started.</p>
            </>
          } />
          <Route path="/films" element={<FilmList />} />
          <Route path="/films/:id" element={<MovieDetail />} />
          <Route path="/people" element={<PeopleList />} />
          <Route path="/people/:id" element={<PeopleDetail />} />
          <Route path="/planets" element={<PlanetList />} />
          <Route path="/planets/:id" element={<PlanetDetail />} />
          <Route path="/species" element={<SpeciesList />} />
          <Route path="/species/:id" element={<SpeciesDetail />} />
          <Route path="/starships" element={<StarshipList />} />
          <Route path="/starships/:id" element={<StarshipDetail />} />
          <Route path="/vehicles" element={<VehicleList />} />
          <Route path="/vehicles/:id" element={<VehicleDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;