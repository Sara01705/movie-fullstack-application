const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

// Load movie data
let movies = JSON.parse(
  fs.readFileSync(path.join(__dirname, "movies_metadata.json"))
);

// Copy the placeholder image to public folder if it doesn't exist
const publicPosterPath = path.join(__dirname, "../public/poster-placeholder.png");
if (!fs.existsSync(publicPosterPath)) {
  try {
    const srcPath = "C:\\Users\\sarat\\.gemini\\antigravity\\brain\\8d40bc05-bd5c-4d93-84a3-621cea3179a7\\default_poster_1780292717334.png";
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, publicPosterPath);
    }
  } catch (e) {
    console.error("Could not copy poster placeholder:", e);
  }
}

// Enrich movie data with missing properties
const genresList = ["Action", "Adventure", "Comedy", "Drama", "Sci-Fi", "Romance", "Thriller"];
movies = movies.map((movie, index) => {
  // Generate stable random-ish data based on movie ID
  const seed = movie.id || index;
  
  // Random genres (1 to 3)
  const numGenres = (seed % 3) + 1;
  const genres = [];
  for(let i=0; i<numGenres; i++) {
    genres.push({ name: genresList[(seed + i) % genresList.length] });
  }

  return {
    ...movie,
    poster_path: "/poster-placeholder.png", // Use our generated placeholder
    genres: genres,
    budget: (seed % 150 + 10) * 1000000,
    revenue: (seed % 500 + 20) * 1000000,
    popularity: (seed % 100) + (seed % 10) * 0.1,
    original_language: seed % 10 === 0 ? "fr" : seed % 7 === 0 ? "es" : "en"
  };
});

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