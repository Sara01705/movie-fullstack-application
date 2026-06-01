import React, { useEffect, useState, useMemo } from "react";
import { useHistory } from "react-router-dom";
import "./MovieList.css";

function MovieList() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("rating-desc");
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });
  
  const history = useHistory();

  useEffect(() => {
    fetch("/api/movies")
      .then(res => res.json())
      .then(data => {
        setMovies(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch movies:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (e, movieId) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(movieId) 
        ? prev.filter(id => id !== movieId)
        : [...prev, movieId]
    );
  };

  const processedMovies = useMemo(() => {
    let result = [...movies];

    // Filter by search
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(movie => 
        movie.title.toLowerCase().includes(lowerQuery)
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortOption) {
        case "rating-desc":
          return b.vote_average - a.vote_average;
        case "rating-asc":
          return a.vote_average - b.vote_average;
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "title-desc":
          return b.title.localeCompare(a.title);
        case "date-desc":
          return new Date(b.release_date.split('/').reverse().join('-')) - new Date(a.release_date.split('/').reverse().join('-'));
        default:
          return 0;
      }
    });

    return result;
  }, [movies, searchQuery, sortOption]);

  const stats = useMemo(() => {
    if (!movies.length) return { total: 0, avgRating: 0, highestRated: "-", latestReleased: "-" };
    
    const avg = movies.reduce((acc, m) => acc + m.vote_average, 0) / movies.length;
    const highest = [...movies].sort((a, b) => b.vote_average - a.vote_average)[0]?.title || "-";
    const latest = [...movies].sort((a, b) => new Date(b.release_date.split('/').reverse().join('-')) - new Date(a.release_date.split('/').reverse().join('-')))[0]?.title || "-";
    
    return {
      total: movies.length,
      avgRating: avg.toFixed(1),
      highestRated: highest,
      latestReleased: latest
    };
  }, [movies]);

  const getRatingClass = (rating) => {
    if (rating >= 8) return "rating-high";
    if (rating >= 6) return "rating-med";
    return "rating-low";
  };

  return (
    <div className="container">
      <header className="header">
        <h1 className="title">Discover Movies</h1>
        <p className="subtitle">Explore the best cinema has to offer</p>
      </header>

      {!loading && (
        <div className="dashboard-stats">
          <div className="stat-card">
            <span className="stat-label">Total Movies</span>
            <span className="stat-value">{stats.total}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Average Rating</span>
            <span className="stat-value">⭐ {stats.avgRating}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Highest Rated</span>
            <span className="stat-value truncate" title={stats.highestRated}>{stats.highestRated}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Latest Release</span>
            <span className="stat-value truncate" title={stats.latestReleased}>{stats.latestReleased}</span>
          </div>
        </div>
      )}

      <div className="controls-bar">
        <div className="search-container">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            className="search-input"
            placeholder="Search movies by title..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="sort-container">
          <select 
            className="sort-select" 
            value={sortOption} 
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="rating-desc">Rating (High to Low)</option>
            <option value="rating-asc">Rating (Low to High)</option>
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
            <option value="date-desc">Release Date (Newest First)</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="card skeleton-card">
              <div className="skeleton poster-skeleton"></div>
              <div className="card-content">
                <div className="skeleton title-skeleton"></div>
                <div className="skeleton tagline-skeleton"></div>
              </div>
            </div>
          ))}
        </div>
      ) : processedMovies.length > 0 ? (
        <div className="grid">
          {processedMovies.map(movie => {
            const isFav = favorites.includes(movie.id);
            return (
              <div
                key={movie.id}
                className="card"
                onClick={() => history.push(`/movie/${movie.id}`)}
              >
                <div className="poster-container">
                  {movie.poster_path ? (
                    <img src={movie.poster_path} alt={movie.title} className="movie-poster" loading="lazy" />
                  ) : (
                    <div className="poster-placeholder">No Poster</div>
                  )}
                  
                  <button 
                    className={`favorite-btn ${isFav ? 'active' : ''}`}
                    onClick={(e) => toggleFavorite(e, movie.id)}
                    aria-label="Toggle Favorite"
                  >
                    ♥
                  </button>
                  
                  <div className={`rating-badge ${getRatingClass(movie.vote_average)}`}>
                    <span className="rating-icon">⭐</span>
                    {movie.vote_average.toFixed(1)}
                  </div>
                </div>

                <div className="card-content">
                  <h3 className="card-title">{movie.title}</h3>
                  <div className="card-meta">
                    <span className="year">{movie.release_date ? movie.release_date.split('/').pop() : 'N/A'}</span>
                    {movie.genres && movie.genres[0] && (
                      <span className="genre-pill">{movie.genres[0].name}</span>
                    )}
                  </div>
                  {movie.tagline && (
                    <p className="tagline">"{movie.tagline}"</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">🎬</div>
          <h2>No movies found</h2>
          <p>We couldn't find any movies matching "{searchQuery}". Try a different search term.</p>
          <button className="clear-btn" onClick={() => setSearchQuery("")}>Clear Search</button>
        </div>
      )}
    </div>
  );
}

export default MovieList;