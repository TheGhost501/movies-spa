// src/views/details.js
import { getMovieById, getLikesCount, getUserLikes, addLike, deleteMovie } from '../api.js';  // ← Fixed import
import { navigate } from '../router.js';

export function detailsView(id) {
    const section = document.createElement('section');
    section.id = 'movie-example';
    section.className = 'view-section';

    section.innerHTML = `
        <div class="container">
            <div class="row bg-light text-dark">
                <h1>Loading...</h1>
            </div>
        </div>
    `;

    loadMovieDetails(section, id);
    return section;
}

async function loadMovieDetails(section, id) {
    try {
        const movie = await getMovieById(id);
        const user = sessionStorage.getItem('user');
        const userId = user ? JSON.parse(user)._id : null;
        const isOwner = user && userId === movie._ownerId;

        const likesData = await getLikesCount(id);
        const likesCount = likesData || 0;

        let userHasLiked = false;
        if (user && !isOwner) {
            const userLikeData = await getUserLikes(id, userId);
            userHasLiked = userLikeData && userLikeData.length > 0;
        }

        section.querySelector('.container').innerHTML = `
            <div class="row bg-light text-dark">
                <h1>Movie title: ${movie.title}</h1>
                <div class="wrapper">
                    <div class="col-md-8">
                        <img class="img-thumbnail" src="${movie.img}" alt="Movie" />
                    </div>
                    <div class="col-md-4 text-center">
                        <h3 class="my-3">Movie Description</h3>
                        <p>${movie.description}</p>
                        
                        ${isOwner ? `
                      <button class="btn btn-danger" id="delete-btn">Delete</button>
                       <a class="btn btn-warning" href="/edit/${movie._id}">Edit</a>
                    <span class="enrolled-span">Liked ${likesCount}</span> 
                    ` : user ? `
                      ${!userHasLiked ? `
                   <button class="btn btn-primary" id="like-btn">Like</button>
                      ` : ''}
                     <span class="enrolled-span">Liked ${likesCount}</span>
                    ` : `
                    <span class="enrolled-span">Liked ${likesCount}</span>
`}
                    </div>
                </div>
            </div>
        `;

        if (isOwner) {
            const deleteBtn = section.querySelector('#delete-btn');
            deleteBtn.addEventListener('click', async () => {
                try {
                    await deleteMovie(movie._id);
                    navigate('/');
                } catch (error) {
                    alert(error.message);
                }

            });
        } else if (user && !userHasLiked) {
            const likeBtn = section.querySelector('#like-btn');
            likeBtn?.addEventListener('click', async () => {
                try {
                    await addLike(movie._id);

                    // Fetch updated count
                    const newCount = await getLikesCount(id);

                    // Update the span text
                    const likeSpan = section.querySelector('.enrolled-span');
                    if (likeSpan) {
                        likeSpan.textContent = `Liked ${newCount}`;
                    }

                    // Remove like button
                    if (likeBtn && likeBtn.parentNode) {
                        likeBtn.remove();
                    }

                } catch (error) {
                    console.error('Like error:', error);
                    alert(error.message);
                }
            });
        }

    } catch (err) {
        section.querySelector('.container').innerHTML = `
            <div class="row bg-light text-dark">
                <h1>Error loading movie</h1>
                <p>${err.message}</p>
            </div>
        `;
    }
}