import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Container } from "react-bootstrap";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import NowPlaying from "./pages/NowPlaying";
import Trending from "./pages/Trending";
import TopRated from "./pages/TopRated";
import Genre from "./pages/Genre";
import MovieDetail from "./pages/MovieDetail";
import ActorDetail from "./pages/ActorDetail";
import NotFound from "./pages/NotFound";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/scss/styles.scss";
import { ThemeProvider } from "./context/ThemeContext";
import { ConfigurationProvider } from "./context/ConfigurationContext";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ConfigurationProvider>
          <Router>
            <Navigation />
            <Container className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/now-playing" element={<NowPlaying />} />
                <Route path="/trending" element={<Trending />} />
                <Route path="/top-rated" element={<TopRated />} />
                <Route path="/genre/:id" element={<Genre />} />
                <Route path="/movie/:id" element={<MovieDetail />} />
                <Route path="/actor/:id" element={<ActorDetail />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Container>
          </Router>
        </ConfigurationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
