'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('movies');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const API_URL = 'https://clg-project-db.onrender.com/api';

  // Movies
  const [movies, setMovies] = useState<any[]>([]);
  const [showMovieForm, setShowMovieForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState<any>(null);
  const [movieForm, setMovieForm] = useState({ title: '', releaseyear: '', duration: '', genre: '', language: '', rating: '' });

  // Actors
  const [actors, setActors] = useState<any[]>([]);
  const [showActorForm, setShowActorForm] = useState(false);
  const [editingActor, setEditingActor] = useState<any>(null);
  const [actorForm, setActorForm] = useState({ name: '', dob: '', nationality: '' });

  // Directors
  const [directors, setDirectors] = useState<any[]>([]);
  const [showDirectorForm, setShowDirectorForm] = useState(false);
  const [editingDirector, setEditingDirector] = useState<any>(null);
  const [directorForm, setDirectorForm] = useState({ name: '', dob: '', nationality: '' });

  // Users
  const [users, setUsers] = useState<any[]>([]);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [userForm, setUserForm] = useState({ name: '', email: '', password: '' });

  // Reviews
  const [reviews, setReviews] = useState<any[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState<any>(null);
  const [reviewForm, setReviewForm] = useState({ userid: '', movieid: '', rating: '', comment: '' });

  // Watchlists
  const [watchlists, setWatchlists] = useState<any[]>([]);
  const [showWatchlistForm, setShowWatchlistForm] = useState(false);
  const [watchlistForm, setWatchlistForm] = useState({ userid: '', movieid: '' });

  // Fetch functions
  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/movies`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setMovies(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchActors = async () => {
    try {
      const response = await fetch(`${API_URL}/actors`);
      const data = await response.json();
      setActors(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchDirectors = async () => {
    try {
      const response = await fetch(`${API_URL}/directors`);
      const data = await response.json();
      setDirectors(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/users`);
      const data = await response.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${API_URL}/reviews`);
      const data = await response.json();
      setReviews(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchWatchlists = async () => {
    try {
      const response = await fetch(`${API_URL}/watchlists`);
      const data = await response.json();
      setWatchlists(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchMovies();
    fetchActors();
    fetchDirectors();
    fetchUsers();
    fetchReviews();
    fetchWatchlists();
  }, []);

  // Movie CRUD
  const handleMovieSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingMovie ? `${API_URL}/movies/${editingMovie.movieid}` : `${API_URL}/movies`;
      const method = editingMovie ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: movieForm.title,
          releaseyear: parseInt(movieForm.releaseyear),
          duration: parseInt(movieForm.duration),
          genre: movieForm.genre,
          language: movieForm.language,
          rating: parseFloat(movieForm.rating)
        })
      });
      if (!response.ok) throw new Error('Failed to save');
      setMovieForm({ title: '', releaseyear: '', duration: '', genre: '', language: '', rating: '' });
      setEditingMovie(null);
      setShowMovieForm(false);
      await fetchMovies();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const deleteMovie = async (id: number) => {
    if (!confirm('Delete this movie?')) return;
    try {
      await fetch(`${API_URL}/movies/${id}`, { method: 'DELETE' });
      await fetchMovies();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Actor CRUD
  const handleActorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingActor ? `${API_URL}/actors/${editingActor.actorid}` : `${API_URL}/actors`;
      const method = editingActor ? 'PUT' : 'POST';
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(actorForm)
      });
      setActorForm({ name: '', dob: '', nationality: '' });
      setEditingActor(null);
      setShowActorForm(false);
      await fetchActors();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const deleteActor = async (id: number) => {
    if (!confirm('Delete this actor?')) return;
    try {
      await fetch(`${API_URL}/actors/${id}`, { method: 'DELETE' });
      await fetchActors();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Director CRUD
  const handleDirectorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingDirector ? `${API_URL}/directors/${editingDirector.directorid}` : `${API_URL}/directors`;
      const method = editingDirector ? 'PUT' : 'POST';
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(directorForm)
      });
      setDirectorForm({ name: '', dob: '', nationality: '' });
      setEditingDirector(null);
      setShowDirectorForm(false);
      await fetchDirectors();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const deleteDirector = async (id: number) => {
    if (!confirm('Delete this director?')) return;
    try {
      await fetch(`${API_URL}/directors/${id}`, { method: 'DELETE' });
      await fetchDirectors();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // User CRUD
  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingUser ? `${API_URL}/users/${editingUser.userid}` : `${API_URL}/users`;
      const method = editingUser ? 'PUT' : 'POST';
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userForm)
      });
      setUserForm({ name: '', email: '', password: '' });
      setEditingUser(null);
      setShowUserForm(false);
      await fetchUsers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const deleteUser = async (id: number) => {
    if (!confirm('Delete this user?')) return;
    try {
      await fetch(`${API_URL}/users/${id}`, { method: 'DELETE' });
      await fetchUsers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Review CRUD
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingReview ? `${API_URL}/reviews/${editingReview.reviewid}` : `${API_URL}/reviews`;
      const method = editingReview ? 'PUT' : 'POST';
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userid: parseInt(reviewForm.userid),
          movieid: parseInt(reviewForm.movieid),
          rating: parseFloat(reviewForm.rating),
          comment: reviewForm.comment
        })
      });
      setReviewForm({ userid: '', movieid: '', rating: '', comment: '' });
      setEditingReview(null);
      setShowReviewForm(false);
      await fetchReviews();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const deleteReview = async (id: number) => {
    if (!confirm('Delete this review?')) return;
    try {
      await fetch(`${API_URL}/reviews/${id}`, { method: 'DELETE' });
      await fetchReviews();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Watchlist CRUD
  const handleWatchlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`${API_URL}/watchlists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userid: parseInt(watchlistForm.userid),
          movieid: parseInt(watchlistForm.movieid)
        })
      });
      setWatchlistForm({ userid: '', movieid: '' });
      setShowWatchlistForm(false);
      await fetchWatchlists();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const deleteWatchlist = async (id: number) => {
    if (!confirm('Remove from watchlist?')) return;
    try {
      await fetch(`${API_URL}/watchlists/${id}`, { method: 'DELETE' });
      await fetchWatchlists();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Movie Database Management System</h1>
        
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        {/* Tabs */}
        <div className="flex space-x-2 mb-6 overflow-x-auto">
          {['movies', 'actors', 'directors', 'users', 'reviews', 'watchlists'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-t-lg font-semibold capitalize ${
                activeTab === tab ? 'bg-white text-blue-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* MOVIES TAB */}
          {activeTab === 'movies' && (
            <div>
              <button
                onClick={() => setShowMovieForm(!showMovieForm)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mb-4"
              >
                {showMovieForm ? 'Cancel' : '+ Add Movie'}
              </button>

              {showMovieForm && (
                <form onSubmit={handleMovieSubmit} className="bg-gray-50 p-4 rounded mb-6">
                  <h2 className="text-xl text-black font-bold mb-4">{editingMovie ? 'Edit Movie' : 'Add Movie'}</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="Title" value={movieForm.title} onChange={e => setMovieForm({...movieForm, title: e.target.value})} required className="border text-black p-2 rounded" />
                    <input type="number" placeholder="Release Year" value={movieForm.releaseyear} onChange={e => setMovieForm({...movieForm, releaseyear: e.target.value})} required className="border text-black p-2 rounded" />
                    <input type="number" placeholder="Duration (min)" value={movieForm.duration} onChange={e => setMovieForm({...movieForm, duration: e.target.value})} required className="border text-black p-2 rounded" />
                    <input type="text" placeholder="Genre" value={movieForm.genre} onChange={e => setMovieForm({...movieForm, genre: e.target.value})} required className="border text-black p-2 rounded" />
                    <input type="text" placeholder="Language" value={movieForm.language} onChange={e => setMovieForm({...movieForm, language: e.target.value})} required className="border text-black p-2 rounded" />
                    <input type="number" step="0.1" placeholder="Rating (0-10)" value={movieForm.rating} onChange={e => setMovieForm({...movieForm, rating: e.target.value})} required className="border text-black p-2 rounded" />
                  </div>
                  <button type="submit" className="bg-green-500 text-white  px-4 py-2 rounded mt-4">{editingMovie ? 'Update' : 'Add'}</button>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {movies.map(movie => (
                  <div key={movie.movieid} className="border rounded p-4 shadow hover:shadow-lg">
                    <h3 className="font-bold text-black text-lg">{movie.title}</h3>
                    <p className="text-sm text-gray-600">Year: {movie.releaseyear} | Duration: {movie.duration} min</p>
                    <p className="text-sm text-gray-600">Genre: {movie.genre} | Language: {movie.language}</p>
                    <p className="text-sm text-gray-600">Rating: {movie.rating}/10</p>
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => { setEditingMovie(movie); setMovieForm({ title: movie.title, releaseyear: movie.releaseyear, duration: movie.duration, genre: movie.genre, language: movie.language, rating: movie.rating }); setShowMovieForm(true); }} className="bg-yellow-500 text-white px-3 py-1 rounded text-sm">Edit</button>
                      <button onClick={() => deleteMovie(movie.movieid)} className="bg-red-500 text-white px-3 py-1 rounded text-sm">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ACTORS TAB */}
          {activeTab === 'actors' && (
            <div>
              <button onClick={() => setShowActorForm(!showActorForm)} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mb-4">{showActorForm ? 'Cancel' : '+ Add Actor'}</button>

              {showActorForm && (
                <form onSubmit={handleActorSubmit} className="bg-gray-50 p-4 rounded mb-6">
                  <h2 className="text-xl font-bold text-black mb-4">{editingActor ? 'Edit Actor' : 'Add Actor'}</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="Name" value={actorForm.name} onChange={e => setActorForm({...actorForm, name: e.target.value})} required className="border text-black p-2 rounded" />
                    <input type="date" placeholder="Date of Birth" value={actorForm.dob} onChange={e => setActorForm({...actorForm, dob: e.target.value})} required className="border text-black p-2 rounded" />
                    <input type="text" placeholder="Nationality" value={actorForm.nationality} onChange={e => setActorForm({...actorForm, nationality: e.target.value})} required className="border text-black p-2 rounded" />
                  </div>
                  <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded mt-4">{editingActor ? 'Update' : 'Add'}</button>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {actors.map(actor => (
                  <div key={actor.actorid} className="border rounded p-4 shadow">
                    <h3 className="font-bold text-black">{actor.name}</h3>
                    <p className="text-sm text-gray-600">DOB: {new Date(actor.dob).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-600">Nationality: {actor.nationality}</p>
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => { setEditingActor(actor); setActorForm({ name: actor.name, dob: actor.dob.split('T')[0], nationality: actor.nationality }); setShowActorForm(true); }} className="bg-yellow-500 text-white px-3 py-1 rounded text-sm">Edit</button>
                      <button onClick={() => deleteActor(actor.actorid)} className="bg-red-500 text-white px-3 py-1 rounded text-sm">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DIRECTORS TAB */}
          {activeTab === 'directors' && (
            <div>
              <button onClick={() => setShowDirectorForm(!showDirectorForm)} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mb-4">{showDirectorForm ? 'Cancel' : '+ Add Director'}</button>

              {showDirectorForm && (
                <form onSubmit={handleDirectorSubmit} className="bg-gray-50 p-4 rounded mb-6">
                  <h2 className="text-xl text-black font-bold mb-4">{editingDirector ? 'Edit Director' : 'Add Director'}</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="Name" value={directorForm.name} onChange={e => setDirectorForm({...directorForm, name: e.target.value})} required className="border p-2 text-black rounded" />
                    <input type="date" placeholder="Date of Birth" value={directorForm.dob} onChange={e => setDirectorForm({...directorForm, dob: e.target.value})} required className="border text-black p-2 rounded" />
                    <input type="text" placeholder="Nationality" value={directorForm.nationality} onChange={e => setDirectorForm({...directorForm, nationality: e.target.value})} required className="border text-black p-2 rounded" />
                  </div>
                  <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded mt-4">{editingDirector ? 'Update' : 'Add'}</button>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {directors.map(director => (
                  <div key={director.directorid} className="border text-black rounded p-4 shadow">
                    <h3 className="text-black font-bold">{director.name}</h3>
                    <p className="text-sm text-black ">DOB: {new Date(director.dob).toLocaleDateString()}</p>
                    <p className="text-sm text-black ">Nationality: {director.nationality}</p>
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => { setEditingDirector(director); setDirectorForm({ name: director.name, dob: director.dob.split('T')[0], nationality: director.nationality }); setShowDirectorForm(true); }} className="bg-yellow-500 text-white px-3 py-1 rounded text-sm">Edit</button>
                      <button onClick={() => deleteDirector(director.directorid)} className="bg-red-500 text-white px-3 py-1 rounded text-sm">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* USERS TAB */}
          {activeTab === 'users' && (
            <div>
              <button onClick={() => setShowUserForm(!showUserForm)} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mb-4">{showUserForm ? 'Cancel' : '+ Add User'}</button>

              {showUserForm && (
                <form onSubmit={handleUserSubmit} className="bg-gray-50 p-4 rounded mb-6">
                  <h2 className="text-xl text-black font-bold mb-4">{editingUser ? 'Edit User' : 'Add User'}</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      placeholder="Name" 
                      value={userForm.name} 
                      onChange={e => setUserForm({...userForm, name: e.target.value})} 
                      required 
                      autoComplete="off"
                      className="border text-black p-2 rounded" 
                    />
                    <input 
                      type="email" 
                      placeholder="Email" 
                      value={userForm.email} 
                      onChange={e => setUserForm({...userForm, email: e.target.value})} 
                      required 
                      autoComplete="new-email"
                      className="border text-black p-2 rounded" 
                    />
                    <input 
                      type="password" 
                      placeholder="Password" 
                      value={userForm.password} 
                      onChange={e => setUserForm({...userForm, password: e.target.value})} 
                      autoComplete="new-password"
                      className="border text-black p-2 rounded" 
                    />
                  </div>
                  <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded mt-4">{editingUser ? 'Update' : 'Add'}</button>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {users.map(user => (
                  <div key={user.userid} className="border rounded p-4 shadow">
                    <h3 className="font-bold text-black">{user.name}</h3>
                    <p className="text-sm text-gray-600">Email: {user.email}</p>
                    <p className="text-sm text-gray-600">Joined: {new Date(user.datejoined).toLocaleDateString()}</p>
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => { setEditingUser(user); setUserForm({ name: user.name, email: user.email, password: '' }); setShowUserForm(true); }} className="bg-yellow-500 text-white px-3 py-1 rounded text-sm">Edit</button>
                      <button onClick={() => deleteUser(user.userid)} className="bg-red-500 text-white px-3 py-1 rounded text-sm">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* REVIEWS TAB */}
          {activeTab === 'reviews' && (
            <div>
              <button onClick={() => setShowReviewForm(!showReviewForm)} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mb-4">{showReviewForm ? 'Cancel' : '+ Add Review'}</button>

              {showReviewForm && (
                <form onSubmit={handleReviewSubmit} className="bg-gray-50 p-4 rounded mb-6">
                  <h2 className="text-xl text-black font-bold mb-4">{editingReview ? 'Edit Review' : 'Add Review'}</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <select value={reviewForm.userid} onChange={e => setReviewForm({...reviewForm, userid: e.target.value})} required className="border text-black p-2 rounded">
                      <option value="">Select User</option>
                      {users.map(u => <option key={u.userid} value={u.userid} className='text-black'>{u.name}</option>)}
                    </select>
                    <select value={reviewForm.movieid} onChange={e => setReviewForm({...reviewForm, movieid: e.target.value})} required className="border text-black p-2 rounded">
                      <option value="">Select Movie</option>
                      {movies.map(m => <option key={m.movieid} value={m.movieid}>{m.title}</option>)}
                    </select>
                    <input type="number" step="0.1" placeholder="Rating (0-10)" value={reviewForm.rating} onChange={e => setReviewForm({...reviewForm, rating: e.target.value})} required className="border text-black p-2 rounded" />
                    <input type="text" placeholder="Comment" value={reviewForm.comment} onChange={e => setReviewForm({...reviewForm, comment: e.target.value})} required className="border text-black p-2 rounded" />
                  </div>
                  <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded mt-4">{editingReview ? 'Update' : 'Add'}</button>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.map(review => (
                  <div key={review.reviewid} className="border rounded p-4 shadow">
                    <h3 className="font-bold text-black">{review.movietitle}</h3>
                    <p className="text-sm text-gray-600">By: {review.username}</p>
                    <p className="text-sm text-gray-600">Rating: {review.rating}/10</p>
                    <p className="text-sm text-gray-600">Comment: {review.comment}</p>
                    <p className="text-sm text-gray-500">Date: {new Date(review.date).toLocaleDateString()}</p>
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => { setEditingReview(review); setReviewForm({ userid: review.userid, movieid: review.movieid, rating: review.rating, comment: review.comment }); setShowReviewForm(true); }} className="bg-yellow-500 text-white px-3 py-1 rounded text-sm">Edit</button>
                      <button onClick={() => deleteReview(review.reviewid)} className="bg-red-500 text-white px-3 py-1 rounded text-sm">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* WATCHLISTS TAB */}
          {activeTab === 'watchlists' && (
            <div>
              <button onClick={() => setShowWatchlistForm(!showWatchlistForm)} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mb-4">{showWatchlistForm ? 'Cancel' : '+ Add to Watchlist'}</button>

              {showWatchlistForm && (
                <form onSubmit={handleWatchlistSubmit} className="bg-gray-50 p-4 rounded mb-6">
                  <h2 className="text-xl text-black font-bold mb-4">Add to Watchlist</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <select value={watchlistForm.userid} onChange={e => setWatchlistForm({...watchlistForm, userid: e.target.value})} required className="border text-black p-2 rounded">
                      <option value="">Select User</option>
                      {users.map(u => <option key={u.userid} value={u.userid}>{u.name}</option>)}
                    </select>
                    <select value={watchlistForm.movieid} onChange={e => setWatchlistForm({...watchlistForm, movieid: e.target.value})} required className="border text-black p-2 rounded">
                      <option value="">Select Movie</option>
                      {movies.map(m => <option key={m.movieid} value={m.movieid}>{m.title}</option>)}
                    </select>
                  </div>
                  <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded mt-4">Add</button>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {watchlists.map(item => (
                  <div key={item.watchlistid} className="border rounded p-4 shadow">
                    <h3 className="font-bold text-black">{item.movietitle}</h3>
                    <p className="text-sm text-gray-600">User: {item.username}</p>
                    <p className="text-sm text-gray-500">Added: {new Date(item.dateadded).toLocaleDateString()}</p>
                    <button onClick={() => deleteWatchlist(item.watchlistid)} className="bg-red-500 text-white px-3 py-1 rounded text-sm mt-3">Remove</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
