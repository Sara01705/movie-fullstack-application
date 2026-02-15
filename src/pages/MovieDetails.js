import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";

function MovieDetails() {
  const { id } = useParams();
  const history = useHistory();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    fetch(`/api/movies/${id}`)
      .then(res => res.json())
      .then(data => setMovie(data));
  }, [id]);

  if (!movie) return <h2>Loading...</h2>;
const formatDate = (dateStr) => {
  if (!dateStr) return "Unknown";

  const parts = dateStr.split("/");
  if (parts.length !== 3) return dateStr;

  let [day, month, year] = parts;

  // Convert 2-digit year to 4-digit
  year = parseInt(year) < 50 ? "20" + year : "19" + year;

  return `${day}-${month}-${year}`;
};
  return (
    <div style={{ padding: "20px" }}>
      <button onClick={() => history.push("/")}>⬅ Back</button>

      <h1>{movie.title}</h1>

      {movie.tagline && (
  <p><b>Tagline:</b> {movie.tagline}</p>
)}
      <p><b>Overview:</b> {movie.overview}</p>
      <p><b>Status:</b> {movie.status}</p>
      <p>
  <b>Release Date:</b>{" "}
  {formatDate(movie.release_date)}
</p>
      <p><b>Runtime:</b> {movie.runtime} minutes</p>
      <p><b>Rating:</b> ⭐ {movie.vote_average}/10</p>
      <p><b>Votes:</b> {movie.vote_count}</p>
    </div>
  );
}

export default MovieDetails;