// router.js
import { homeView } from './views/home.js';
import { loginView } from './views/login.js';
import { registerView } from './views/register.js';
import { addMovieView } from './views/addMovie.js';
import { detailsView } from './views/details.js';
import { editMovieView } from './views/editMovie.js';

// Render function - removes old view and inserts new one
export function render(viewElement) {
    const currentView = document.querySelector('.view-section');
    if (currentView) {
        currentView.remove();
    }
    const container = document.getElementById('container');
    const footer = container.querySelector('footer');
    container.insertBefore(viewElement, footer);
}

// Navigate to a route using hash
export function navigate(path) {
    window.location.hash = path;  // ← Uses hash instead of pushState
}

// Get view based on path
function getViewForPath(path) {
    if (path === '/login') {
        return loginView();
    } else if (path === '/register') {
        return registerView();
    } else if (path === '/add-movie') {
        return addMovieView();
    } else if (path.startsWith('/details/')) {
        const id = path.split('/')[2];
        return detailsView(id);
    } else if (path.startsWith('/edit/')) {
        const id = path.split('/')[2];
        return editMovieView(id);
    } else {
        return homeView();
    }
}

// Initialize router
export function initRouter() {
    // Handle initial page load
    const currentPath = window.location.hash.slice(1) || '/';  // ← Get hash, remove #
    render(getViewForPath(currentPath));
    
    // Listen for hash changes (back/forward buttons, manual typing)
    window.addEventListener('hashchange', () => {  // ← Listen to hashchange
        const path = window.location.hash.slice(1) || '/';
        render(getViewForPath(path));
    });
    
    // Intercept link clicks
    document.body.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        
        if (link) {
            const path = link.getAttribute('href');
            
            if (path && path.startsWith('/')) {
                e.preventDefault();
                navigate(path);
            }
        }
    });
}