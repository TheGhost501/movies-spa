// src/views/login.js   
import { login } from '../api.js';
import { updateNav } from '../app.js';
import { navigate } from '../router.js';

export function loginView() {
  const section = document.createElement('section');
  section.id = 'form-login';
  section.className = 'view-section';

  section.innerHTML = `
   <form id="login-form" class="text-center border border-light p-5" action="" method="">
        <div class="form-group">
          <label for="email">Email</label>
          <input id="email" type="email" class="form-control" placeholder="Email" name="email" value="" />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input id="password" type="password" class="form-control" placeholder="Password" name="password" value="" />
        </div>

        <button type="submit" class="btn btn-primary">Login</button>
      </form>
    `;
    
  const loginForm = section.querySelector('#login-form');
  loginForm.addEventListener('submit', onLogin);
  return section;
}

async function onLogin(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const email = formData.get('email');
  const password = formData.get('password');

  if (!email.trim() || !password.trim()) {
    alert('Both fields required.');
    return;
  }
  try {
    await login(email, password);
    updateNav();
    navigate('/');
  } catch (err) {
    alert(err.message);
  }

}