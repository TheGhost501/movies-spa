// src/views/editMovie.js
import { getMovieById, updateMovie } from '../api.js';
import { navigate } from '../router.js';

export function editMovieView(id) {
    const section = document.createElement('section');
    section.id = 'edit-movie';
    section.className = 'view-section';

    section.innerHTML = `
        <form class="text-center border border-light p-5" id="edit-form">
            <h1>Edit Movie</h1>
            <p>Loading...</p>
        </form>
    `;

    loadMovieForEdit(section, id);

    return section;
}

async function loadMovieForEdit(section, id) {
    try {
        const movie = await getMovieById(id);
        section.innerHTML = `
        <form class="text-center border border-light p-5" id="edit-form">
        <h1>Edit Movie</h1>
        <div class="form-group">
          <label for="title">Movie Title</label>
          <input id="title" type="text" class="form-control" placeholder="Movie Title" value="${movie.title}" name="title" />
        </div>
        <div class="form-group">
          <label for="description">Movie Description</label>
          <input class="form-control" placeholder="Movie Description..." name="description" id="description" value="${movie.description}" />
        </div>
        <div class="form-group">
          <label for="imageUrl">Image url</label>
          <input id="imageUrl" type="text" class="form-control" placeholder="Image Url" value="${movie.img}" name="img" />
        </div>
        <button type="submit" class="btn btn-primary">Submit</button>
      </form>
        `;
        const form = section.querySelector('#edit-form');
        form.addEventListener('submit', (e) => onEditSubmit(e, id));

    } catch (err) {
        section.innerHTML = `
        <form class="text-center border border-light p-5">
        <h1>Edit Movie</h1>
        <p class="text-danger">Error: ${err.message}</p>
        </form>
`;
    }


}

async function onEditSubmit(e, id) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const title = formData.get('title');
    const description = formData.get('description');
    const img = formData.get('img');

    if (!title.trim() || !description.trim() || !img.trim()) {
        alert('All fields required.');
        return;
    }

    const movieData = { title, description, img };

    try {
        await updateMovie(id, movieData);
        navigate(`/details/${id}`);
    } catch (err) {
        alert(err.message);
    }
}