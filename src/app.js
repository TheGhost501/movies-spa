// src/app.js
import { logout } from './api.js';
import { initRouter } from './router.js';
import { navigate } from './router.js';


export function updateNav() {
    const user = sessionStorage.getItem('user');
    const guestNav = document.querySelectorAll('.guest');
    const userNav = document.querySelectorAll('.user');
    if (user) {
        const email = JSON.parse(user).email;
        document.getElementById('welcome-msg').textContent = `Welcome, ${email}`;
        userNav.forEach(el => el.style.display = 'block');
        guestNav.forEach(el => el.style.display = 'none');
    } else {
        guestNav.forEach(el => el.style.display = 'block');
        userNav.forEach(el => el.style.display = 'none');
    }
}
function setupLogout() {
    const logoutBtn = document.querySelector('a[href="/logout"]');
    logoutBtn.addEventListener('click', onLogout);

    async function onLogout(e) {
        e.preventDefault();
        try {
            await logout();
            updateNav();
            navigate('/');
        } catch (err) {
            alert(err.message);
        }
    }
}
function init() {
    updateNav();
    initRouter();
    setupLogout();
}

document.addEventListener('DOMContentLoaded', init);
