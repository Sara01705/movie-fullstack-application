import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import "./MovieList.css";

function MovieList() {
  const [movies, setMovies] = useState([]);
  const history = useHistory();

  useEffect(() => {
    fetch("/api/movies")
      .then(res => res.json())
      .then(data => setMovies(data));
  }, []);

  return (
    <div className="container">
      <h1>Movies List</h1>

      <div className="grid">
        {movies.map(movie => (
          <div
            key={movie.id}
            className="card"
            onClick={() => history.push(`/movie/${movie.id}`)}
          >
            <h3>{movie.title}</h3>

            {movie.tagline && (
              <p className="tagline">{movie.tagline}</p>
            )}

            <p className="rating">⭐ {movie.vote_average}/10</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MovieList;