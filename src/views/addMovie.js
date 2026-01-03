// src/views/addMovie.js

import { createMovie } from '../api.js';
import { navigate } from '../router.js';

export function addMovieView() {
    const section = document.createElement('section');
    section.id = 'add-movie';
    section.className = 'view-section';

    section.innerHTML = `
        <form id="add-movie-form" class="text-center border border-light p-5" action="#" method="">
            <h1>Add Movie</h1>
            <div class="form-group">
                <label for="title">Movie Title</label>
                <input id="title" type="text" class="form-control" placeholder="Title" name="title" value="" />
            </div>
            <div class="form-group">
                <label for="description">Movie Description</label>
                <input class="form-control" placeholder="Description" name="description" id="description" />
            </div>
            <div class="form-group">
                <label for="imageUrl">Image url</label>
                <input id="imageUrl" type="text" class="form-control" placeholder="Image Url" name="img" value="" />
            </div>
            <button type="submit" class="btn btn-primary">Submit</button>
        </form>
    `;

    section.querySelector('#add-movie-form').addEventListener('submit', onAddMovie);

    return section;
}

async function onAddMovie(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const title = formData.get('title');
    const description = formData.get('description');
    const img = formData.get('img');
    if (!title.trim() || !description.trim() || !img.trim()) {
        alert('All fields required.');
        return;
    }
    const movie = { title, description, img };
    try {
        await createMovie(movie);
        navigate('/');
    } catch (err) {
        alert(err.message);
    }
}