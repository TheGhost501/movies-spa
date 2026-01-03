// api.js

const baseUrl = 'http://localhost:3030';

// Helper functions 
async function request(url, options = {}) {
    const res = await fetch(baseUrl + url, options);

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
    }

    return res.json();
}

function getToken() {
    const user = sessionStorage.getItem('user');
    if (user) {
        return JSON.parse(user).accessToken;  // or authToken - check your server
    }
    return null;
}

// Auth API
export async function register(email, password) {

    const userData = await request('/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    sessionStorage.setItem('user', JSON.stringify(userData));
    return userData;
}

export async function login(email, password) {
    const userData = await request('/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });
    sessionStorage.setItem('user', JSON.stringify(userData));
    return userData;
}

export async function logout() {
    const token = getToken();
    const res = await fetch(baseUrl + '/users/logout', {
        method: 'GET',
        headers: {
            'X-Authorization': token
        }
    });
    if (!res.ok) {
        throw new Error("Failed to logout.");
    }
    sessionStorage.removeItem('user');
}

// Movie API
export async function getAllMovies() {
    return await request('/data/movies?pageSize=100');
}
export async function createMovie(movie) {
    const token = getToken();
    const newMovie = await request('/data/movies', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': token
        },
        body: JSON.stringify(movie)
    });
    return newMovie;
}
export async function getMovieById(id) {
    const movie = await request(`/data/movies/${id}`);
    return movie;

}
export async function updateMovie(id, movieData) {
    const token = getToken();
    const movie = await request(`/data/movies/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': token
        },
        body: JSON.stringify(movieData)
    });
    return movie;
}
export async function deleteMovie(id) {
    const token = getToken();
    await request(`/data/movies/${id}`, {
        method: 'DELETE',
        headers: { 'X-Authorization': token }
    });
}
// Like API
export async function getLikesCount(movieId) {
    const endpoint = `/data/likes?where=movieId%3D%22${movieId}%22&distinct=_ownerId&count`;
    const data = await request(endpoint);
    return data;
}
export async function getUserLikes(movieId, userId) {
    const endpoint = `/data/likes?where=movieId%3D%22${movieId}%22%20and%20_ownerId%3D%22${userId}%22`;
    const data = await request(endpoint);
    
    return data;
}
export async function addLike(movieId) {
    const token = getToken();
    return await request('/data/likes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': token
        },
        body: JSON.stringify({ movieId })
    });
}