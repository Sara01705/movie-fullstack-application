const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

// Load movie data
const movies = JSON.parse(
  fs.readFileSync(path.join(__dirname, "movies_metadata.json"))
);

// API — List movies
app.get("/api/movies", (req, res) => {
  res.json(movies);
});

// API — Single movie
app.get("/api/movies/:id", (req, res) => {
  const movie = movies.find(m => m.id == req.params.id);

  if (!movie) {
    return res.status(404).json({ error: "Movie not found" });
  }

  res.json(movie);
});

// Port setup
const port = process.env.NODE_ENV === "production" ? 3000 : 3001;

app.listen(port, () => {
  console.log("Server running on port", port);
});