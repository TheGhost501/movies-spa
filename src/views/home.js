// src/views/home.js
import { getAllMovies } from '../api.js';
import { navigate } from '../router.js';  // ← Add this import

export function homeView() {
    const section = document.createElement('section');
    section.id = 'home-page';
    section.className = 'view-section';
    
    const user = sessionStorage.getItem('user');
    
    section.innerHTML = `
        <div class="jumbotron jumbotron-fluid text-light" style="background-color: #343a40">
            <img src="/images/cropped-movie-banner-e1408372575210.jpg" class="img-fluid" alt="Responsive image" />
            <h1 class="display-4">Movies</h1>
            <p class="lead">
                Unlimited movies, TV shows, and more. Watch anywhere. Cancel anytime.
            </p>
        </div>
        
        <h1 class="text-center">Movies</h1>
        
        ${user ? `
        <section id="add-movie-button" class="user">
            <a href="/add-movie" class="btn btn-warning">Add Movie</a>
        </section>
        ` : ''}
        
        <section id="movie">
            <div class="mt-3">
                <div class="row d-flex d-wrap">
                    <ul id="movies-list" class="card-deck d-flex justify-content-center">
                        <p>Loading movies...</p>
                    </ul>
                </div>
            </div>
        </section>
    `;
    
    loadMovies(section);
    
    return section;
}

async function loadMovies(section) {
    const moviesList = section.querySelector('#movies-list');
    
    try {
        const movies = await getAllMovies();
        
        if (movies.length === 0) {
            moviesList.innerHTML = '<p>No movies yet. Add the first one!</p>';
            return;
        }
        
        const moviesHTML = movies.map(movie => createMovieCard(movie)).join('');
        moviesList.innerHTML = moviesHTML;
        
        // Add event listeners to all Details buttons
        attachDetailsListeners(section);  // ← Add this
        
    } catch (err) {
        moviesList.innerHTML = `<p>Error loading movies: ${err.message}</p>`;
    }
}

function createMovieCard(movie) {
    return `
        <li class="card mb-4">
            <img class="card-img-top" src="${movie.img}" alt="Card image cap" width="400" />
            <div class="card-body">
                <h4 class="card-title">${movie.title}</h4>
            </div>
            <div class="card-footer">
                <button type="button" class="btn btn-info" data-movie-id="${movie._id}">Details</button>
            </div>
        </li>
    `;
}

function attachDetailsListeners(section) {
    // Find all Details buttons
    const detailsButtons = section.querySelectorAll('button[data-movie-id]');
    
    detailsButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const movieId = btn.getAttribute('data-movie-id');
            navigate(`/details/${movieId}`);
        });
    });
}