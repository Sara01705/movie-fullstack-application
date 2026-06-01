import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import "./MovieDetails.css";

function MovieDetails() {
  const { id } = useParams();
  const history = useHistory();
  const [movie, setMovie] = useState(null);
  const [relatedMovies, setRelatedMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Fetch all movies to find related ones and the current one
    fetch("/api/movies")
      .then(res => res.json())
      .then(data => {
        const currentMovie = data.find(m => m.id.toString() === id);
        setMovie(currentMovie || null);
        
        if (currentMovie) {
          // Mock related movies by getting some random ones with same genre or just random
          const related = data
            .filter(m => m.id.toString() !== id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 4);
          setRelatedMovies(related);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching movie details:", err);
        setLoading(false);
      });
  }, [id]);

  const formatDate = dateStr => {
    if (!dateStr) return "Unknown";
    
    const parts = dateStr.split("/");
    if (parts.length !== 3) return dateStr;
    
    let [day, month, year] = parts;
    year = parseInt(year) < 50 ? "20" + year : "19" + year;
    
    const date = new Date(year, parseInt(month) - 1, day);
    
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = amount => {
    if (!amount) return "Unknown";
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
  };

  const getRatingClass = (rating) => {
    if (rating >= 8) return "rating-high";
    if (rating >= 6) return "rating-med";
    return "rating-low";
  };

  if (loading) {
    return (
      <div className="details-container">
        <div className="skeleton" style={{ width: '150px', height: '40px', marginBottom: '30px' }}></div>
        <div className="hero-section skeleton" style={{ height: '400px', borderRadius: 'var(--border-radius)' }}></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="details-container" style={{ textAlign: "center", padding: "100px 20px" }}>
        <h2>Movie not found</h2>
        <button className="back-button mt-4" onClick={() => history.push("/")}>
          <span style={{ marginRight: "8px" }}>←</span> Back to Movies
        </button>
      </div>
    );
  }

  return (
    <div className="details-container">
      <button className="back-button" onClick={() => history.push("/")}>
        <span className="back-icon">←</span> Back to Movies
      </button>

      <div className="hero-section">
        <div className="hero-poster">
          {movie.poster_path ? (
            <img src={movie.poster_path} alt={movie.title} className="detail-poster" />
          ) : (
            <div className="detail-poster-placeholder">No Poster</div>
          )}
        </div>
        
        <div className="hero-content">
          <h1 className="movie-title">{movie.title}</h1>
          {movie.tagline && <p className="movie-tagline">"{movie.tagline}"</p>}
          
          <div className="genre-container">
            {movie.genres && movie.genres.map(g => (
              <span key={g.name} className="detail-genre-pill">{g.name}</span>
            ))}
          </div>
          
          <div className="detail-rating-wrapper">
             <div className={`detail-rating ${getRatingClass(movie.vote_average)}`}>
               <span>⭐</span> {movie.vote_average.toFixed(1)} <span className="vote-count">({movie.vote_count} votes)</span>
             </div>
          </div>

          <div className="movie-overview">
            <h3>Overview</h3>
            <p>{movie.overview}</p>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h3 className="section-title">Movie Information</h3>
        <div className="meta-grid">
          <div className="meta-item">
            <span className="meta-label">Status</span>
            <span className="meta-value">
              <span className={`status-badge ${movie.status.toLowerCase()}`}>{movie.status}</span>
            </span>
          </div>

          <div className="meta-item">
            <span className="meta-label">Release Date</span>
            <span className="meta-value">{formatDate(movie.release_date)}</span>
          </div>

          <div className="meta-item">
            <span className="meta-label">Runtime</span>
            <span className="meta-value">{movie.runtime} minutes</span>
          </div>
          
          <div className="meta-item">
            <span className="meta-label">Original Language</span>
            <span className="meta-value uppercase">{movie.original_language || 'EN'}</span>
          </div>

          <div className="meta-item">
            <span className="meta-label">Budget</span>
            <span className="meta-value">{formatCurrency(movie.budget)}</span>
          </div>

          <div className="meta-item">
            <span className="meta-label">Revenue</span>
            <span className="meta-value">{formatCurrency(movie.revenue)}</span>
          </div>
          
          <div className="meta-item">
            <span className="meta-label">Popularity Score</span>
            <span className="meta-value">{movie.popularity ? movie.popularity.toFixed(2) : 'N/A'}</span>
          </div>
        </div>
      </div>

      {relatedMovies.length > 0 && (
        <div className="related-section">
          <h3 className="section-title">You Might Also Like</h3>
          <div className="related-grid">
            {relatedMovies.map(rm => (
              <div 
                key={rm.id} 
                className="related-card"
                onClick={() => history.push(`/movie/${rm.id}`)}
              >
                <div className="related-poster-container">
                  {rm.poster_path ? (
                    <img src={rm.poster_path} alt={rm.title} className="related-poster" />
                  ) : (
                    <div className="related-poster-placeholder">No Poster</div>
                  )}
                </div>
                <h4 className="related-title">{rm.title}</h4>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieDetails;