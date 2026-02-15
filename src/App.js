import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import MovieList from "./pages/MovieList";
import MovieDetails from "./pages/MovieDetails";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={MovieList} />
        <Route path="/movie/:id" component={MovieDetails} />
      </Switch>
    </Router>
  );
}

export default App;