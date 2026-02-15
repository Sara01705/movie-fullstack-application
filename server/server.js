const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();


const movies = JSON.parse(
  fs.readFileSync(path.join(__dirname, "movies_metadata.json"))
);


app.get("/api/ping", (req, res) => {
  res.send("pong!");
});


app.get("/api/movies", (req, res) => {
  res.json(movies);
});


app.get("/api/movies/:id", (req, res) => {
  const movie = movies.find(m => m.id == req.params.id);

  if (!movie) {
    return res.status(404).json({ error: "Movie not found" });
  }

  res.json(movie);
});


let port;
if (process.env.NODE_ENV === "production") {
  port = process.env.PORT || 3000;
  app.use(express.static(path.join(__dirname, "../build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../build", "index.html"));
  });
} else {
  port = 3001;
}


const listener = app.listen(port, () => {
  console.log("🚀 Server running on port", listener.address().port);
});