// src/views/register.js
import { register } from '../api.js';
import { updateNav } from '../app.js';
import { navigate } from '../router.js';

export function registerView() {
  const section = document.createElement('section');
  section.id = 'form-sign-up';
  section.className = 'view-section';

  section.innerHTML = `
        <form id="register-form" class="text-center border border-light p-5" action="" method="">
        <div class="form-group">
          <label for="email">Email</label>
          <input id="email" type="email" class="form-control" placeholder="Email" name="email" value="" />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input id="password" type="password" class="form-control" placeholder="Password" name="password" value="" />
        </div>

        <div class="form-group">
          <label for="repeatPassword">Repeat Password</label>
          <input id="repeatPassword" type="password" class="form-control" placeholder="Repeat-Password"
            name="repeatPassword" value="" />
        </div>

        <button type="submit" class="btn btn-primary">Register</button>
      </form>
  `;

  const registerForm = section.querySelector('#register-form');
  registerForm.addEventListener('submit', onRegister);
  return section;
}

async function onRegister(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const email = formData.get('email');
  const password = formData.get('password');
  const rePass = formData.get('repeatPassword');

  if (!email.trim() || !password.trim() || !rePass.trim()) {
    alert('All fields required.');
    return;
  } else if (password.length < 6) {
    alert('Password must be at least 6 characters.');
    return;
  } else if (password !== rePass) {
    alert('Passwords must match.');
    return;
  }

  try {
    await register(email, password);
    updateNav();
    navigate('/');
  } catch (err) {
    alert(err.message);
  }
}